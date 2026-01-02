import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

/**
 * UIErrorBoundary - Error boundary for catching and displaying errors
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * @example
 * ```tsx
 * <UIErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </UIErrorBoundary>
 * ```
 */
export interface UIErrorBoundaryProps {
  /** Fallback UI to render when an error is caught */
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  /** Error handler function called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Children components to wrap */
  children: ReactNode;
}

interface UIErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component for React trees.
 */
export class UIErrorBoundary extends Component<UIErrorBoundaryProps, UIErrorBoundaryState> {
  constructor(props: UIErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): UIErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error("UIErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const { error } = this.state;

      if (typeof fallback === "function") {
        return fallback(error!, {
          componentStack: "",
        } as ErrorInfo);
      }

      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[200px] p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
              <svg
                className="w-6 h-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3.131L13.065 5.47a2.998 2.998 0 00-2.122-.879L8.158 3.06a2.998 2.998 0 00-2.122.879l-1.932 4.698A2.998 2.998 0 004.568 9H13m0 0h6m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
export function DefaultErrorFallback({
  error,
  resetError: _resetError,
}: {
  error?: Error;
  resetError: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
          <svg
            className="w-6 h-6 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3.131L13.065 5.47a2.998 2.998 0 00-2.122-.879L8.158 3.06a2.998 2.998 0 00-2.122.879l-1.932 4.698A2.998 2.998 0 004.568 9H13m0 0h6m-6 0h6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message || "An unexpected error occurred"}
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for programmatically triggering error boundary reset
 */
export function useErrorBoundary() {
  return { resetError: () => window.location.reload() };
}
