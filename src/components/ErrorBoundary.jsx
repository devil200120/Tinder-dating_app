import React, { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryAttempts: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to monitoring service (replace with your error reporting service)
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryAttempts: prevState.retryAttempts + 1,
    }));
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError =
        this.state.error?.message?.includes("network") ||
        this.state.error?.message?.includes("fetch");
      const isChunkError =
        this.state.error?.message?.includes("ChunkLoadError") ||
        this.state.error?.message?.includes("Loading chunk");

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isChunkError
                ? "Update Available"
                : isNetworkError
                ? "Connection Error"
                : "Oops! Something went wrong"}
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 mb-6">
              {isChunkError
                ? "A new version of the app is available. Please refresh the page to get the latest updates."
                : isNetworkError
                ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
                : "We encountered an unexpected error. Our team has been notified and is working on a fix."}
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <details className="text-sm">
                  <summary className="font-semibold text-gray-700 cursor-pointer mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="text-red-600 font-mono text-xs">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={
                  isChunkError
                    ? () => window.location.reload()
                    : this.handleRetry
                }
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isChunkError ? "Refresh Page" : "Try Again"}</span>
              </button>

              {!isChunkError && (
                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Go Home</span>
                </button>
              )}
            </div>

            {/* Retry Attempts Counter */}
            {this.state.retryAttempts > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Retry attempts: {this.state.retryAttempts}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
