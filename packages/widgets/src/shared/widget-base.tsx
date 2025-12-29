import React, { ReactNode, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

export interface WidgetProps {
  children: ReactNode;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

/**
 * Base wrapper component for all widgets with consistent styling
 * Uses Apps SDK UI token utilities for theming and enhanced scrollbar styling
 */
export function WidgetBase({ children, className = "", title, style }: WidgetProps) {
  return (
    <div
      className={`antialiased w-full text-white p-4 border border-white/10 rounded-2xl overflow-hidden bg-[var(--foundation-bg-dark-1)] widget-scrollable ${className}`}
      style={style}
    >
      {title && (
        <div className="mb-4 pb-3 border-b border-white/10">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
      )}
      <div className="overflow-auto max-h-[80vh] widget-content">
        {children}
      </div>
    </div>
  );
}

/**
 * Standardized widget mounting helper
 * Reduces boilerplate across all widget components
 */
export function mountWidget(component: ReactNode) {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Widget mount failed: No root element found');
    return;
  }

  const root = getOrCreateRoot(rootElement);
  root.render(
    <StrictMode>
      {component}
    </StrictMode>
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
 * Higher-order component for widget creation with consistent patterns
 */
export function createWidget<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options?: {
    title?: string;
    className?: string;
    maxHeight?: string;
  }
) {
  return function Widget(props: T) {
    const component = (
      <WidgetBase 
        title={options?.title}
        className={options?.className || ''}
        style={options?.maxHeight ? { maxHeight: options.maxHeight } : undefined}
      >
        <Component {...props} />
      </WidgetBase>
    );

    return component;
  };
}

/**
 * Widget error boundary for production resilience
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
    console.error('Widget error:', error, errorInfo);
    
    // Report to error tracking service in production
    if (typeof window !== 'undefined' && window.openai) {
      // Could send error reports via OpenAI API if needed
      console.warn('Widget error boundary caught:', { error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <WidgetBase>
          <div className="text-center py-8">
            <div className="text-red-400 mb-2 text-2xl">⚠️</div>
            <div className="text-red-400 mb-2 font-medium">Widget Error</div>
            <div className="text-sm text-gray-400 mb-4">
              Something went wrong. Please try refreshing.
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Refresh Widget
            </button>
          </div>
        </WidgetBase>
      );
    }

    return this.props.children;
  }
}
