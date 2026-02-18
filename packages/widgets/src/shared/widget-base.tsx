import { createHostAdapter, ensureMockOpenAI, HostProvider } from "@design-studio/runtime";
import React, { type ReactNode, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";

/**
 * Props for the base widget wrapper.
 */
export interface WidgetProps {
  children: ReactNode;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

/**
 * Base wrapper component for all widgets with consistent styling.
 *
 * @param props - Widget wrapper props.
 * @param props.title - Optional title displayed at the top of the widget.
 * @returns A styled wrapper element containing widget content.
 */
export function WidgetBase({ children, className = "", title, style }: WidgetProps) {
  return (
    <div
      className={`antialiased w-full text-foreground p-4 border border-border rounded-2xl overflow-hidden bg-background widget-scrollable ${className}`}
      style={style}
    >
      {title && (
        <div className="mb-4 pb-3 border-b border-border">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
      )}
      <div className="overflow-auto max-h-[80vh] widget-content">{children}</div>
    </div>
  );
}

/**
 * Mounts a widget into the `#root` element with StrictMode.
 *
 * @param component - The widget component to render.
 * @returns `void`.
 */
export function mountWidget(component: ReactNode) {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    if (import.meta.env.DEV) {
      console.error("Widget mount failed: No root element found");
    }
    return;
  }

  const host = createHostAdapter({
    apiBase: import.meta.env?.VITE_WIDGETS_API_BASE,
  });

  if (host.mode !== "embedded") {
    ensureMockOpenAI();
  }

  const root = getOrCreateRoot(rootElement);
  root.render(
    <StrictMode>
      <HostProvider host={host}>{component}</HostProvider>
    </StrictMode>,
  );
}

const rootCache = new WeakMap<Element, Root>();

function getOrCreateRoot(element: Element): Root {
  const existing = rootCache.get(element);
  if (existing) return existing;
  const root = createRoot(element);
  rootCache.set(element, root);
  return root;
}

/**
 * Creates a widget component wrapped in `WidgetBase`.
 *
 * @param Component - The widget component to wrap.
 * @param options - Optional wrapper configuration.
 * @returns A wrapped widget component.
 */
export function createWidget<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  options?: {
    title?: string;
    className?: string;
    maxHeight?: string;
  },
) {
  return function Widget(props: T) {
    const component = (
      <WidgetBase
        title={options?.title}
        className={options?.className || ""}
        style={options?.maxHeight ? { maxHeight: options.maxHeight } : undefined}
      >
        <Component {...props} />
      </WidgetBase>
    );

    return component;
  };
}

/**
 * Widget error boundary for production resilience.
 *
 * @param props - Error boundary props.
 * @returns A rendered widget or fallback UI when errors occur.
 */
export class WidgetErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Widget error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <WidgetBase>
            <div className="text-center py-8">
              <div className="text-status-error mb-2 text-2xl">⚠️</div>
              <div className="text-status-error mb-2 font-medium">Widget Error</div>
              <div className="text-sm text-text-secondary mb-4">
                Something went wrong. Please try refreshing.
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-status-error text-text-body-on-color rounded-lg text-sm font-medium transition-colors hover:bg-status-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-error/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Refresh Widget
              </button>
            </div>
          </WidgetBase>
        )
      );
    }

    return this.props.children;
  }
}
