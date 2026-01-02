import { createContext, type ReactNode, useCallback, useContext, useId, useState } from "react";

import { cn } from "../../../components/ui/utils";

/** Visual variants for TemplateFieldGroup. */
export type TemplateFieldGroupVariant = "default" | "card" | "bordered" | "ghost";
/** Size presets for TemplateFieldGroup. */
export type TemplateFieldGroupSize = "sm" | "md" | "lg";

// Context for field group state
interface TemplateFieldGroupContextValue {
  isCollapsed: boolean;
  isDisabled: boolean;
  groupId: string;
}

const TemplateFieldGroupContext = createContext<TemplateFieldGroupContextValue | null>(null);

/**
 * Access the current TemplateFieldGroup context.
 * @returns Field group state and helpers.
 * @throws Error when used outside a TemplateFieldGroup.
 */
export function useTemplateFieldGroup() {
  return useContext(TemplateFieldGroupContext);
}

/** Props for TemplateFieldGroup. */
export interface TemplateFieldGroupProps {
  /** Group label/title */
  label: string;
  /** Description text below the label */
  description?: string;
  /** Action buttons/links in the header */
  actions?: ReactNode;
  /** Icon before the label */
  icon?: ReactNode;
  /** Badge next to the label */
  badge?: ReactNode;
  /** The grouped form fields */
  children: ReactNode;
  /** Additional class names for the root container */
  className?: string;
  /** Additional class names for the label */
  labelClassName?: string;
  /** Additional class names for the content area */
  contentClassName?: string;
  /** Visual variant */
  variant?: TemplateFieldGroupVariant;
  /** Size preset affecting spacing and typography */
  size?: TemplateFieldGroupSize;
  /** Whether the group is collapsible */
  collapsible?: boolean;
  /** Whether the group starts collapsed */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Whether all fields in the group are disabled */
  disabled?: boolean;
  /** Whether the group is required (shows indicator) */
  required?: boolean;
  /** Error message for the group */
  error?: string;
  /** Number of columns for grid layout */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between fields */
  gap?: "sm" | "md" | "lg";
  /** Whether to show a divider below the header */
  divider?: boolean;
  /** Accessible label for the group */
  "aria-label"?: string;
}

const variantStyles: Record<
  TemplateFieldGroupVariant,
  { container: string; header: string; content: string }
> = {
  default: {
    container: "",
    header: "",
    content: "",
  },
  card: {
    container:
      "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl overflow-hidden shadow-sm",
    header: "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 px-5 py-4",
    content: "px-5 py-4",
  },
  bordered: {
    container: "border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg",
    header: "px-4 py-3 border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
    content: "px-4 py-4",
  },
  ghost: {
    container: "",
    header: "pb-3",
    content: "pl-4 border-l-2 border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
  },
};

const sizeStyles: Record<
  TemplateFieldGroupSize,
  { label: string; description: string; gap: string; padding: string }
> = {
  sm: {
    label: "text-xs leading-4 font-medium",
    description: "text-[11px] leading-4",
    gap: "space-y-2",
    padding: "p-3",
  },
  md: {
    label: "text-[13px] leading-5 font-medium",
    description: "text-xs leading-4",
    gap: "space-y-3",
    padding: "p-4",
  },
  lg: {
    label: "text-sm leading-5 font-semibold",
    description: "text-[13px] leading-5",
    gap: "space-y-4",
    padding: "p-5",
  },
};

const gapStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

const columnStyles: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Render a grouped set of related form fields.
 * @param props - Field group props.
 * @returns The field group element.
 */
export function TemplateFieldGroup({
  label,
  description,
  actions,
  icon,
  badge,
  children,
  className,
  labelClassName,
  contentClassName,
  variant = "default",
  size = "md",
  collapsible = false,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  disabled = false,
  required = false,
  error,
  columns,
  gap = "md",
  divider = false,
  "aria-label": ariaLabel,
}: TemplateFieldGroupProps) {
  const groupId = useId();
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const toggleCollapse = useCallback(() => {
    if (collapsible) {
      const newValue = !isCollapsed;
      if (!isControlled) {
        setInternalCollapsed(newValue);
      }
      onCollapseChange?.(newValue);
    }
  }, [collapsible, isCollapsed, isControlled, onCollapseChange]);

  const contextValue: TemplateFieldGroupContextValue = {
    isCollapsed,
    isDisabled: disabled,
    groupId,
  };

  const { label: labelSize, description: descriptionSize, gap: defaultGap } = sizeStyles[size];
  const {
    container: containerStyle,
    header: headerStyle,
    content: contentStyle,
  } = variantStyles[variant];

  const contentElement = (
    <div
      id={`${groupId}-content`}
      className={cn(
        contentStyle,
        columns ? cn("grid", columnStyles[columns], gapStyles[gap]) : defaultGap,
        collapsible && isCollapsed && "hidden",
        disabled && "opacity-50 pointer-events-none",
        contentClassName,
      )}
      aria-hidden={collapsible && isCollapsed}
    >
      {children}
    </div>
  );

  return (
    <TemplateFieldGroupContext.Provider value={contextValue}>
      <fieldset
        className={cn(containerStyle, className)}
        disabled={disabled}
        aria-labelledby={`${groupId}-label`}
        aria-describedby={error ? `${groupId}-error` : undefined}
      >
        {/* Header */}
        <legend className="sr-only">{ariaLabel ?? label}</legend>
        <div
          className={cn(
            headerStyle,
            divider &&
              !isCollapsed &&
              "border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {icon && (
                <span className="shrink-0 text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary">
                  {icon}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    id={`${groupId}-label`}
                    className={cn(
                      "text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
                      labelSize,
                      disabled && "opacity-50 cursor-not-allowed",
                      labelClassName,
                    )}
                  >
                    {label}
                  </span>
                  {required && (
                    <span className="text-foundation-accent-red text-xs" aria-label="required">
                      *
                    </span>
                  )}
                  {badge}
                </div>
                {description && (
                  <p
                    className={cn(
                      "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1",
                      descriptionSize,
                      disabled && "opacity-50",
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {actions}
              {collapsible && (
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg w-7 h-7",
                    "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
                    "hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary",
                    "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
                    "transition-colors",
                  )}
                  aria-expanded={!isCollapsed}
                  aria-controls={`${groupId}-content`}
                  aria-label={isCollapsed ? `Expand ${label}` : `Collapse ${label}`}
                >
                  <svg
                    className={cn(
                      "w-4 h-4 transition-transform",
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
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            id={`${groupId}-error`}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-foundation-accent-red bg-foundation-accent-red/10"
            role="alert"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {contentElement}
      </fieldset>
    </TemplateFieldGroupContext.Provider>
  );
}

// Compound component for group action button
/** Props for TemplateFieldGroupAction. */
export interface TemplateFieldGroupActionProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "default" | "primary" | "ghost";
  disabled?: boolean;
  className?: string;
}

/**
 * Render a field group action element.
 * @param props - Action props.
 * @returns The action element.
 */
export function TemplateFieldGroupAction({
  children,
  onClick,
  icon,
  variant = "ghost",
  disabled = false,
  className,
}: TemplateFieldGroupActionProps) {
  const variantClasses = {
    default:
      "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:bg-foundation-bg-light-4 dark:hover:bg-foundation-bg-dark-4",
    primary: "text-foundation-accent-blue hover:text-foundation-accent-blue/80",
    ghost:
      "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-2 py-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
        "transition-colors",
        variantClasses[variant],
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className,
      )}
    >
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </button>
  );
}

// Compound component for group badge
/** Props for TemplateFieldGroupBadge. */
export interface TemplateFieldGroupBadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  className?: string;
}

/**
 * Render a badge inside a field group.
 * @param props - Badge props.
 * @returns The badge element.
 */
export function TemplateFieldGroupBadge({
  children,
  variant = "default",
  className,
}: TemplateFieldGroupBadgeProps) {
  const variantClasses = {
    default:
      "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
    primary: "bg-foundation-accent-blue/10 text-foundation-accent-blue",
    success: "bg-foundation-accent-green/10 text-foundation-accent-green",
    warning: "bg-foundation-accent-orange/10 text-foundation-accent-orange",
    error: "bg-foundation-accent-red/10 text-foundation-accent-red",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// Compound component for nested field group divider
/** Props for TemplateFieldGroupDivider. */
export interface TemplateFieldGroupDividerProps {
  label?: string;
  className?: string;
}

/**
 * Render a divider within a field group.
 * @param props - Divider props.
 * @returns The divider element.
 */
export function TemplateFieldGroupDivider({ label, className }: TemplateFieldGroupDividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3 py-3", className)}>
        <div className="flex-1 h-px bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
          {label}
        </span>
        <div className="flex-1 h-px bg-foundation-bg-light-3 dark:border-foundation-bg-dark-3" />
      </div>
    );
  }

  return (
    <div
      className={cn("h-px bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 my-3", className)}
      role="separator"
    />
  );
}

// Compound component for field group row (horizontal layout)
/** Props for TemplateFieldGroupRow. */
export interface TemplateFieldGroupRowProps {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
}

/**
 * Render a row within a field group.
 * @param props - Row props.
 * @returns The row element.
 */
export function TemplateFieldGroupRow({
  children,
  className,
  gap = "md",
}: TemplateFieldGroupRowProps) {
  return <div className={cn("flex items-start", gapStyles[gap], className)}>{children}</div>;
}
