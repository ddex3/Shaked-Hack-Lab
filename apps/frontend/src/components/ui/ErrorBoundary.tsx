import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-terminal-bg">
          <div className="terminal-border rounded-lg p-8 max-w-md w-full text-center">
            <div className="text-accent-red text-4xl mb-4">!</div>
            <h1 className="text-hacker-green text-xl font-bold mb-2">System Error</h1>
            <p className="text-gray-400 text-sm mb-6 font-mono">
              {this.state.error?.message ?? "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reboot
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
