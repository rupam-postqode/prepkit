"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<Record<string, unknown>>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <div className="text-center">
              <div className="text-6xl mb-4 text-red-500">
                <AlertTriangle className="w-16 h-16 mx-auto" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. This error has been logged and our team will look into it.
              </p>

              {this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h2 className="text-lg font-semibold text-red-800 mb-2">
                    Error Details
                  </h2>
                  <div className="text-sm text-red-700">
                    <p className="mb-2">
                      <strong>Error:</strong> {this.state.error?.message}
                    </p>
                    {this.state.error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">
                          Technical Details
                        </summary>
                        <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                          {this.state.error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for using error boundary
export function useErrorBoundary() {
  return {
    ErrorBoundary,
  };
}