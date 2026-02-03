import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

import { ScrollArea } from "../../../components/ui/base/ScrollArea";
import { cn } from "../../../components/ui/utils";

// Context for shell state management
interface TemplateShellContextValue {
  sidebarCollapsed: boolean;
  detailCollapsed: boolean;
  toggleSidebar: () => void;
  toggleDetail: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDetailCollapsed: (collapsed: boolean) => void;
}

const TemplateShellContext = createContext<TemplateShellContextValue | null>(null);

/**
 * Access the current TemplateShell context.
 * @returns Shell state and helpers.
 * @throws Error when used outside a TemplateShell.
 */
export function useTemplateShell() {
  const context = useContext(TemplateShellContext);
  if (!context) {
    throw new Error("useTemplateShell must be used within a TemplateShell");
  }
  return context;
}

/** Props for TemplateShell. */
export interface TemplateShellProps {
  /** Left sidebar content */
  sidebar?: ReactNode;
  /** Top header content */
  header?: ReactNode;
  /** Main body content */
  body?: ReactNode;
  /** Bottom footer content */
  footer?: ReactNode;
  /** Right detail panel content */
  detail?: ReactNode;
  /** Additional class names for the root container */
  className?: string;
  /** Additional class names for the main content section */
  contentClassName?: string;
  /** Width of the sidebar (default: 260px) */
  sidebarWidth?: number | string;
  /** Width of the detail panel (default: 280px) */
  detailWidth?: number | string;
  /** Whether sidebar starts collapsed */
  sidebarDefaultCollapsed?: boolean;
  /** Whether detail panel starts collapsed */
  detailDefaultCollapsed?: boolean;
  /** Whether sidebar is collapsible */
  sidebarCollapsible?: boolean;
  /** Whether detail panel is collapsible */
  detailCollapsible?: boolean;
  /** Whether body content should scroll */
  bodyScrollable?: boolean;
  /** Animate panel transitions */
  animated?: boolean;
  /** Show dividers between sections */
  showDividers?: boolean;
  /** Callback when sidebar collapse state changes */
  onSidebarCollapseChange?: (collapsed: boolean) => void;
  /** Callback when detail collapse state changes */
  onDetailCollapseChange?: (collapsed: boolean) => void;
}

/**
 * Render a shell layout with header, body, and optional side panels.
 * @param props - Shell props.
 * @returns The template shell element.
 */
export function TemplateShell({
  sidebar,
  header,
  body,
  footer,
  detail,
  className,
  contentClassName,
  sidebarWidth = 260,
  detailWidth = 280,
  sidebarDefaultCollapsed = false,
  detailDefaultCollapsed = false,
  sidebarCollapsible = true,
  detailCollapsible = true,
  bodyScrollable = true,
  animated = true,
  showDividers = true,
  onSidebarCollapseChange,
  onDetailCollapseChange,
}: TemplateShellProps) {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(sidebarDefaultCollapsed);
  const [detailCollapsed, setDetailCollapsedState] = useState(detailDefaultCollapsed);

  const setSidebarCollapsed = useCallback(
    (collapsed: boolean) => {
      setSidebarCollapsedState(collapsed);
      onSidebarCollapseChange?.(collapsed);
    },
    [onSidebarCollapseChange],
  );

  const setDetailCollapsed = useCallback(
    (collapsed: boolean) => {
      setDetailCollapsedState(collapsed);
      onDetailCollapseChange?.(collapsed);
    },
    [onDetailCollapseChange],
  );

  const toggleSidebar = useCallback(() => {
    if (sidebarCollapsible) {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  }, [sidebarCollapsible, sidebarCollapsed, setSidebarCollapsed]);

  const toggleDetail = useCallback(() => {
    if (detailCollapsible) {
      setDetailCollapsed(!detailCollapsed);
    }
  }, [detailCollapsible, detailCollapsed, setDetailCollapsed]);

  const contextValue: TemplateShellContextValue = {
    sidebarCollapsed,
    detailCollapsed,
    toggleSidebar,
    toggleDetail,
    setSidebarCollapsed,
    setDetailCollapsed,
  };

  const transitionClasses = animated ? "transition-all duration-200 ease-in-out" : "";

  const dividerClasses = showDividers ? "border-border" : "border-transparent";

  const sidebarWidthValue = typeof sidebarWidth === "number" ? `${sidebarWidth}px` : sidebarWidth;
  const detailWidthValue = typeof detailWidth === "number" ? `${detailWidth}px` : detailWidth;

  return (
    <TemplateShellContext.Provider value={contextValue}>
      <div className={cn("flex h-full w-full min-h-0 bg-background", className)}>
        {/* Sidebar */}
        {sidebar ? (
          <aside
            className={cn(
              "shrink-0 h-full overflow-hidden border-r",
              dividerClasses,
              transitionClasses,
            )}
            style={{
              width: sidebarCollapsed ? 0 : sidebarWidthValue,
              opacity: sidebarCollapsed ? 0 : 1,
            }}
            aria-hidden={sidebarCollapsed}
          >
            <div className="h-full" style={{ width: sidebarWidthValue }}>
              {sidebar}
            </div>
          </aside>
        ) : null}

        {/* Main Content Section */}
        <section
          className={cn(
            "flex-1 min-w-0 min-h-0 flex flex-col",
            transitionClasses,
            contentClassName,
          )}
        >
          {/* Header */}
          {header ? <div className={cn("shrink-0 border-b", dividerClasses)}>{header}</div> : null}

          {/* Body */}
          {body ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              {bodyScrollable ? <ScrollArea className="h-full w-full">{body}</ScrollArea> : body}
            </div>
          ) : null}

          {/* Footer */}
          {footer ? <div className={cn("shrink-0 border-t", dividerClasses)}>{footer}</div> : null}
        </section>

        {/* Detail Panel */}
        {detail ? (
          <aside
            className={cn(
              "shrink-0 h-full overflow-hidden border-l",
              dividerClasses,
              transitionClasses,
            )}
            style={{
              width: detailCollapsed ? 0 : detailWidthValue,
              opacity: detailCollapsed ? 0 : 1,
            }}
            aria-hidden={detailCollapsed}
          >
            <div className="h-full" style={{ width: detailWidthValue }}>
              {detail}
            </div>
          </aside>
        ) : null}
      </div>
    </TemplateShellContext.Provider>
  );
}

// Compound components for common patterns
/** Props for TemplateShellToggleButton. */
export interface TemplateShellToggleButtonProps {
  panel: "sidebar" | "detail";
  className?: string;
  children?: ReactNode;
}

/**
 * Render a toggle button for shell side panels.
 * @param props - Toggle button props.
 * @returns The toggle button element.
 */
export function TemplateShellToggleButton({
  panel,
  className,
  children,
}: TemplateShellToggleButtonProps) {
  const { sidebarCollapsed, detailCollapsed, toggleSidebar, toggleDetail } = useTemplateShell();

  const isCollapsed = panel === "sidebar" ? sidebarCollapsed : detailCollapsed;
  const toggle = panel === "sidebar" ? toggleSidebar : toggleDetail;

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2",
        "text-text-secondary",
        "hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-150",
        className,
      )}
      aria-expanded={!isCollapsed}
      aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${panel}`}
    >
      {children ?? (
        <svg
          className={cn(
            "size-4 transition-transform duration-200",
            panel === "sidebar" && !isCollapsed && "rotate-180",
            panel === "detail" && isCollapsed && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      )}
    </button>
  );
}
