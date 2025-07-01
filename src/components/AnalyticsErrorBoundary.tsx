
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class AnalyticsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log analytics errors but don't break the app
    console.warn('Analytics error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return the children anyway, don't show error UI for analytics failures
      return this.props.children;
    }

    return this.props.children;
  }
}

export default AnalyticsErrorBoundary;
