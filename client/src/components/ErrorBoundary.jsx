import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleRetry = () => {
      this.setState({ hasError: false, error: null, errorInfo: null });
      if (this.props.onRetry) {
        this.props.onRetry();
      }
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.handleRetry,
        });
      }
      return (
        <div>
          <h2>{this.props.errorMessage || this.props.message || 'Something went wrong. Please reload the page or contact support.'}</h2>
          {this.state.error && (process.env.NODE_ENV !== 'production') && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          )}
          <button onClick={this.handleRetry} aria-label="Try Again">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
