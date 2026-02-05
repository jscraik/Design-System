import { AppsSDKButton } from "@design-studio/ui";
import { Component, type ErrorInfo, type ReactNode } from "react";

type TemplateHostProps = {
  templateId: string;
  children: ReactNode;
};

type TemplateHostState = {
  error: Error | null;
  info: ErrorInfo | null;
  copied: boolean;
};

export class TemplateHost extends Component<TemplateHostProps, TemplateHostState> {
  state: TemplateHostState = {
    error: null,
    info: null,
    copied: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { error, info: null, copied: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info });
    console.error("Template render error", { templateId: this.props.templateId, error, info });
  }

  handleCopyDiagnostics = async () => {
    const { error, info } = this.state;
    if (!error) return;

    const payload = {
      templateId: this.props.templateId,
      message: error.message,
      stack: error.stack,
      componentStack: info?.componentStack,
      timestamp: new Date().toISOString(),
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      this.setState({ copied: true });
      window.setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error("Unable to copy diagnostics", err);
    }
  };

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className="rounded-2xl border border-foundation-bg-light-3 bg-foundation-bg-light-2 p-6 text-foundation-text-light-primary dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-2 dark:text-foundation-text-dark-primary">
          <h3 className="text-lg font-semibold">Template failed to render</h3>
          <p className="mt-2 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            {error.message}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <AppsSDKButton size="sm" onClick={this.handleCopyDiagnostics}>
              {this.state.copied ? "Copied" : "Copy diagnostics"}
            </AppsSDKButton>
            <span className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Template ID: {this.props.templateId}
            </span>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
