import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
  type UIEvent,
} from "react";
import { Resizable } from "re-resizable";
import { X, AlertCircle, RefreshCw } from "lucide-react";

import { ScrollArea } from "./ui/scroll-area";
import { cn } from "./ui/utils";

// Context for panel state management
interface TemplatePanelContextValue {
  isCollapsed: boolean;
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  close?: () => void;
}

const TemplatePanelContext = createContext<TemplatePanelContextValue | null>(null);

export function useTemplatePanel() {
  const context = useContext(TemplatePanelContext);
  if (!context) {
    throw new Error("useTemplatePanel must be used within a TemplatePanel");
  }
  return context;
}

export type TemplatePanelVariant = "default" | "elevated" | "outlined" | "ghost";
export type TemplatePanelSize = "sm" | "md" | "lg";
export type BadgeVariant = "default" | "error" | "warning" | "success" | "info";

export interface TemplatePanelProps {
  /** Header content slot */
  header?: ReactNode;
  /** Footer content slot */
  footer?: ReactNode;
  /** Main body content */
  children: ReactNode;
  /** Additional class names for the root container */
  className?: string;
  /** Additional class names for the body section */
  bodyClassName?: string;
  /** Additional class names for the header section */
  headerClassName?: string;
  /** Additional class names for the footer section */
  footerClassName?: string;
  /** Visual variant of the panel */
  variant?: TemplatePanelVariant;
  /** Size preset affecting padding and border radius */
  size?: TemplatePanelSize;
  /** Whether the panel body is collapsible */
  collapsible?: boolean;
  /** Whether the panel starts collapsed */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Whether the panel is in a loading state */
  loading?: boolean;
  /** Whether body content should scroll */
  scrollable?: boolean;
  /** Maximum height for scrollable body */
  maxBodyHeight?: number | string;
  /** Whether to show dividers between header/body/footer */
  showDividers?: boolean;
  /** Whether to animate transitions */
  animated?: boolean;
  /** Accessible label for the panel */
  "aria-label"?: string;
  /** ID for the panel */
  id?: string;

  // NEW FEATURES
  /** Whether the panel can be dismissed/closed */
  dismissable?: boolean;
  /** Callback when panel is closed */
  onClose?: () => void;
  /** Custom close button */
  closeButton?: ReactNode;
  /** Error state - boolean or error message */
  error?: boolean | string;
  /** Callback for retry button in error state */
  onRetry?: () => void;
  /** Empty state */
  empty?: boolean;
  /** Custom empty state content */
  emptyContent?: ReactNode;
  /** Empty state icon */
  emptyIcon?: ReactNode;
  /** Empty state title */
  emptyTitle?: string;
  /** Empty state description */
  emptyDescription?: string;
  /** Callback when scrolled to top */
  onScrollTop?: () => void;
  /** Callback when scrolled to bottom */
  onScrollBottom?: () => void;
  /** Callback on scroll */
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
  /** Whether panel is resizable */
  resizable?: boolean;
  /** Minimum height for resizable panel */
  minHeight?: number;
  /** Maximum height for resizable panel (overrides maxBodyHeight) */
  maxHeight?: number;
  /** Callback when panel is resized */
  onResize?: (height: number) => void;
  /** Whether header should be sticky */
  stickyHeader?: boolean;
  /** Whether footer should be sticky */
  stickyFooter?: boolean;
  /** Badge content to show in header */
  badge?: string | number;
  /** Badge variant */
  badgeVariant?: BadgeVariant;
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean;
  /** Shortcut to toggle collapse (e.g., "ctrl+k") */
  collapseShortcut?: string;
  /** Scroll to top */
  scrollToTop?: boolean;
  /** Scroll to bottom */
  scrollToBottom?: boolean;
  /** Controlled scroll position */
  scrollPosition?: number;
  /** Whether panel is draggable */
  draggable?: boolean;
  /** Show drag handle */
  dragHandle?: boolean;
  /** Callback when drag starts */
  onDragStart?: () => void;
  /** Callback when drag ends */
  onDragEnd?: () => void;
}

const variantStyles: Record<TemplatePanelVariant, string> = {
  default:
    "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-sm",
  elevated:
    "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 shadow-lg",
  outlined: "bg-transparent border-2 border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
  ghost: "bg-transparent border-none shadow-none",
};

const sizeStyles: Record<TemplatePanelSize, { padding: string; radius: string }> = {
  sm: { padding: "p-3", radius: "rounded-md" },
  md: { padding: "p-4", radius: "rounded-lg" },
  lg: { padding: "p-6", radius: "rounded-xl" },
};

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
  error: "bg-foundation-accent-red/10 text-foundation-accent-red",
  warning: "bg-foundation-accent-orange/10 text-foundation-accent-orange",
  success: "bg-foundation-accent-green/10 text-foundation-accent-green",
  info: "bg-foundation-accent-blue/10 text-foundation-accent-blue",
};

export function TemplatePanel({
  header,
  footer,
  children,
  className,
  bodyClassName,
  headerClassName,
  footerClassName,
  variant = "default",
  size = "md",
  collapsible = false,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  loading = false,
  scrollable = false,
  maxBodyHeight,
  showDividers = true,
  animated = true,
  "aria-label": ariaLabel,
  id,
  // New features
  dismissable = false,
  onClose,
  closeButton,
  error = false,
  onRetry,
  empty = false,
  emptyContent,
  emptyIcon,
  emptyTitle = "No content",
  emptyDescription = "There's nothing to display here yet.",
  onScrollTop,
  onScrollBottom,
  onScroll,
  resizable = false,
  minHeight = 100,
  maxHeight,
  onResize,
  stickyHeader = false,
  stickyFooter = false,
  badge,
  badgeVariant = "default",
  enableKeyboardShortcuts = false,
  collapseShortcut = "ctrl+k",
  scrollToTop = false,
  scrollToBottom = false,
  scrollPosition,
  draggable = false,
  dragHandle = false,
  onDragStart,
  onDragEnd,
}: TemplatePanelProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);

  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const setCollapsed = useCallback(
    (collapsed: boolean) => {
      if (!isControlled) {
        setInternalCollapsed(collapsed);
      }
      onCollapseChange?.(collapsed);
    },
    [isControlled, onCollapseChange],
  );

  const toggleCollapse = useCallback(() => {
    if (collapsible) {
      setCollapsed(!isCollapsed);
    }
  }, [collapsible, isCollapsed, setCollapsed]);

  const close = useCallback(() => {
    if (dismissable && onClose) {
      onClose();
    }
  }, [dismissable, onClose]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = collapseShortcut.toLowerCase().split("+");
      const ctrl = keys.includes("ctrl") || keys.includes("control");
      const shift = keys.includes("shift");
      const alt = keys.includes("alt");
      const key = keys[keys.length - 1];

      if (
        e.key.toLowerCase() === key &&
        e.ctrlKey === ctrl &&
        e.shiftKey === shift &&
        e.altKey === alt
      ) {
        e.preventDefault();
        toggleCollapse();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboardShortcuts, collapseShortcut, toggleCollapse]);

  // Scroll position control
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLDivElement;
    const bodyElement = bodyRef.current;
    const target = scrollElement || bodyElement;

    if (!target) return;

    if (scrollToTop) {
      target.scrollTo({ top: 0, behavior: "smooth" });
    } else if (scrollToBottom) {
      target.scrollTo({ top: target.scrollHeight, behavior: "smooth" });
    } else if (scrollPosition !== undefined) {
      target.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  }, [scrollToTop, scrollToBottom, scrollPosition]);

  // Scroll callbacks
  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Check if at top
      if (scrollTop === 0 && onScrollTop) {
        onScrollTop();
      }

      // Check if at bottom (with 10px threshold)
      if (scrollTop + clientHeight >= scrollHeight - 10 && onScrollBottom) {
        onScrollBottom();
      }

      onScroll?.(e);
    },
    [onScrollTop, onScrollBottom, onScroll],
  );

  const contextValue: TemplatePanelContextValue = {
    isCollapsed,
    isLoading: loading,
    hasError: !!error,
    isEmpty: empty,
    toggleCollapse,
    setCollapsed,
    close: dismissable ? close : undefined,
  };

  const transitionClasses = animated ? "transition-all duration-200 ease-in-out" : "";

  const dividerClasses = showDividers
    ? "border-foundation-bg-light-3 dark:border-foundation-bg-dark-3"
    : "border-transparent";

  const { padding, radius } = sizeStyles[size];

  const maxHeightValue = maxHeight
    ? typeof maxHeight === "number"
      ? `${maxHeight}px`
      : maxHeight
    : typeof maxBodyHeight === "number"
      ? `${maxBodyHeight}px`
      : maxBodyHeight;

  // Render body content based on state
  const renderBodyContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      const errorMessage = typeof error === "string" ? error : "An error occurred";
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <AlertCircle className="size-12 text-foundation-accent-red mb-3" />
          <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
            Error
          </h3>
          <p className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary text-center mb-4">
            {errorMessage}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-foundation-accent-blue text-white hover:bg-foundation-accent-blue/90 transition-colors"
            >
              <RefreshCw className="size-4" />
              Retry
            </button>
          )}
        </div>
      );
    }

    if (empty) {
      if (emptyContent) {
        return <>{emptyContent}</>;
      }
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          {emptyIcon || (
            <svg
              className="size-12 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          )}
          <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
            {emptyTitle}
          </h3>
          <p className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary text-center">
            {emptyDescription}
          </p>
        </div>
      );
    }

    return children;
  };

  const bodyContent = (
    <div
      ref={bodyRef}
      className={cn(
        "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1",
        padding,
        transitionClasses,
        collapsible && isCollapsed && "h-0 overflow-hidden opacity-0 !p-0",
        !scrollable && "overflow-auto",
        bodyClassName,
      )}
      style={
        scrollable && maxBodyHeight && !scrollAreaRef.current
          ? { maxHeight: maxHeightValue }
          : undefined
      }
      aria-hidden={collapsible && isCollapsed}
      onScroll={!scrollable ? handleScroll : undefined}
    >
      {renderBodyContent()}
    </div>
  );

  const panelContent = (
    <TemplatePanelContext.Provider value={contextValue}>
      <div
        id={id}
        className={cn(
          "overflow-hidden",
          variantStyles[variant],
          radius,
          transitionClasses,
          draggable && "cursor-move",
          className,
        )}
        aria-label={ariaLabel}
        role={ariaLabel ? "region" : undefined}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        style={resizable && panelHeight ? { height: panelHeight } : undefined}
      >
        {/* Drag Handle */}
        {dragHandle && draggable && (
          <div className="flex items-center justify-center py-1 cursor-grab active:cursor-grabbing border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
            <div className="flex gap-1">
              <div className="w-8 h-1 rounded-full bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3" />
            </div>
          </div>
        )}

        {/* Header */}
        {header ? (
          <div
            className={cn(
              "shrink-0 border-b",
              dividerClasses,
              stickyHeader && "sticky top-0 z-10 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2",
              headerClassName,
            )}
          >
            {header}
          </div>
        ) : null}

        {/* Body */}
        {scrollable && !isCollapsed ? (
          <ScrollArea
            ref={scrollAreaRef}
            className="w-full"
            style={maxBodyHeight || maxHeight ? { maxHeight: maxHeightValue } : undefined}
            onScroll={handleScroll}
          >
            {bodyContent}
          </ScrollArea>
        ) : (
          bodyContent
        )}

        {/* Footer */}
        {footer && (!collapsible || !isCollapsed) ? (
          <div
            className={cn(
              "shrink-0 border-t",
              dividerClasses,
              transitionClasses,
              stickyFooter && "sticky bottom-0 z-10 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2",
              footerClassName,
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </TemplatePanelContext.Provider>
  );

  // Wrap with Resizable if enabled
  if (resizable) {
    return (
      <Resizable
        size={{ width: "100%", height: panelHeight || "auto" }}
        minHeight={minHeight}
        maxHeight={maxHeight}
        enable={{ bottom: true }}
        onResizeStop={(e, direction, ref, d) => {
          const newHeight = (panelHeight || ref.offsetHeight) + d.height;
          setPanelHeight(newHeight);
          onResize?.(newHeight);
        }}
        handleStyles={{
          bottom: {
            bottom: 0,
            height: "4px",
            cursor: "ns-resize",
          },
        }}
        handleClasses={{
          bottom: "hover:bg-foundation-accent-blue transition-colors",
        }}
      >
        {panelContent}
      </Resizable>
    );
  }

  return panelContent;
}

// Compound component for panel header with collapse toggle
export interface TemplatePanelHeaderProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  showCollapseToggle?: boolean;
  showCloseButton?: boolean;
  badge?: string | number;
  badgeVariant?: BadgeVariant;
  className?: string;
}

export function TemplatePanelHeader({
  title,
  subtitle,
  leading,
  trailing,
  showCollapseToggle = false,
  showCloseButton = false,
  badge,
  badgeVariant = "default",
  className,
}: TemplatePanelHeaderProps) {
  const context = useContext(TemplatePanelContext);
  const isCollapsed = context?.isCollapsed ?? false;
  const toggleCollapse = context?.toggleCollapse;
  const close = context?.close;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {leading}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary truncate">
              {title}
            </h3>
            {badge !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full shrink-0",
                  badgeStyles[badgeVariant],
                )}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {trailing}
        {showCollapseToggle && toggleCollapse && (
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              "inline-flex items-center justify-center rounded-md p-1.5",
              "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
              "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
              "transition-colors duration-150",
            )}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            <svg
              className={cn(
                "size-4 transition-transform duration-200",
                isCollapsed && "-rotate-90",
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
        {showCloseButton && close && (
          <button
            type="button"
            onClick={close}
            className={cn(
              "inline-flex items-center justify-center rounded-md p-1.5",
              "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
              "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
              "transition-colors duration-150",
            )}
            aria-label="Close panel"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Compound component for panel footer with actions
export interface TemplatePanelFooterProps {
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export function TemplatePanelFooter({ leading, trailing, className }: TemplatePanelFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">{leading}</div>
      <div className="flex items-center gap-2">{trailing}</div>
    </div>
  );
}
