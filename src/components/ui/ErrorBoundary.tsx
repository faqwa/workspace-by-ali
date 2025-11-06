import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch React errors and display a fallback UI
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * With custom fallback:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // TODO: Log to error reporting service (e.g., Sentry) in production
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
          <div className="card bg-base-100 shadow-xl max-w-md w-full">
            <div className="card-body items-center text-center">
              {/* Error Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-16 h-16 text-error mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>

              <h2 className="card-title text-2xl mb-2">Something went wrong</h2>

              <p className="text-base-content/70 mb-4">
                We encountered an unexpected error. Please try again or contact support if the problem persists.
              </p>

              {/* Show error message in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="alert alert-error text-left w-full mb-4">
                  <div className="flex flex-col gap-2 w-full">
                    <span className="font-semibold">Error Details:</span>
                    <code className="text-xs overflow-x-auto block whitespace-pre-wrap break-words">
                      {this.state.error.message}
                    </code>
                  </div>
                </div>
              )}

              <div className="card-actions flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={this.handleReset}
                  className="btn btn-outline flex-1"
                >
                  Try Again
                </button>
                <a
                  href="/"
                  className="btn bg-[#22c55e] hover:bg-[#16a34a] text-white border-0 flex-1"
                >
                  Go Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
