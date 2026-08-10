import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Friendly crash screen — no raw errors or stack traces shown to the user.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Logged for debugging only — never surfaced in the UI.
    console.error("StudyPilot crashed:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-soft">
              <TriangleAlert className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="mt-2 text-muted-foreground">
              We hit an unexpected hiccup. Reload the app and you&apos;ll be back on track in a
              second.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-soft transition-all duration-150 ease-out hover:bg-primary-hover active:scale-[0.97]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
