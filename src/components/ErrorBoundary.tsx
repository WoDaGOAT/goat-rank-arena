
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary details:', error, errorInfo);
    
    // Filter out common external resource errors that don't affect functionality
    const isExternalResourceError = error.message.includes('ERR_BLOCKED_BY_CLIENT') ||
                                   error.message.includes('chrome-extension') ||
                                   error.message.includes('ERR_FAILED') ||
                                   error.message.includes('fbevents.js');
    
    if (isExternalResourceError) {
      console.warn('External resource error (likely browser extension or ad blocker):', error.message);
      // Don't show error UI for external resource failures
      this.setState({ hasError: false });
    }
  }

  // Handle global unhandled promise rejections
  public componentDidMount() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  public componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const error = event.reason;
    
    // Filter out network errors that don't affect core functionality
    if (error?.message?.includes('ERR_BLOCKED_BY_CLIENT') ||
        error?.message?.includes('chrome-extension') ||
        error?.message?.includes('lovable-api.com')) {
      console.warn('Network/External resource error ignored:', error);
      event.preventDefault(); // Prevent the error from being logged to console
      return;
    }
    
    console.error('Unhandled promise rejection:', error);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription>
              Something went wrong. Check the console for details.
              <br />
              <strong>Error:</strong> {this.state.error?.message}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
