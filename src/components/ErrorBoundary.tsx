
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { shouldSuppressError, logError, isDevelopmentEnvironment } from '@/lib/networkUtils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorCount: 0
  };

  public static getDerivedStateFromError(error: Error): State | null {
    // Filter out external errors that don't affect functionality
    if (shouldSuppressError(error)) {
      logError(error, 'ErrorBoundary - External error suppressed');
      return null; // Don't update state for external errors
    }
    
    logError(error, 'ErrorBoundary');
    return { 
      hasError: true, 
      error,
      errorCount: 0
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error categorization
    if (shouldSuppressError(error)) {
      logError(error, 'ErrorBoundary - External error in componentDidCatch');
      
      // Reset error state if it was an external error
      if (this.state.hasError) {
        this.setState({ hasError: false, error: undefined });
      }
      return;
    }
    
    logError(error, 'ErrorBoundary - Component error');
    console.error('ErrorBoundary details:', error, errorInfo);
    
    // Track error count to prevent infinite error loops
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1
    }));
  }

  public componentDidMount() {
    // Enhanced global error handlers
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.addEventListener('error', this.handleGlobalError);
  }

  public componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleGlobalError);
  }

  private handleGlobalError = (event: ErrorEvent) => {
    const error = event.error || new Error(event.message);
    
    if (shouldSuppressError(error)) {
      logError(error, 'Global error handler - External error suppressed');
      event.preventDefault();
      return;
    }
    
    logError(error, 'Global error handler');
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const error = event.reason;
    
    if (shouldSuppressError(error)) {
      logError(error, 'Unhandled rejection - External error suppressed');
      event.preventDefault();
      return;
    }
    
    logError(error, 'Unhandled rejection');
  };

  private handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined,
      errorCount: 0
    });
  };

  public render() {
    if (this.state.hasError) {
      // Prevent infinite error loops
      if (this.state.errorCount > 3) {
        return (
          <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-md">
              <AlertTitle>Critical Error</AlertTitle>
              <AlertDescription>
                Multiple errors detected. Please refresh the page.
                {isDevelopmentEnvironment() && (
                  <>
                    <br />
                    <strong>Dev Error:</strong> {this.state.error?.message}
                  </>
                )}
              </AlertDescription>
            </Alert>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription>
              Something went wrong. This appears to be an application error.
              <br />
              <button 
                onClick={this.handleRetry}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
              {isDevelopmentEnvironment() && (
                <>
                  <br />
                  <strong>Dev Error:</strong> {this.state.error?.message}
                </>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
