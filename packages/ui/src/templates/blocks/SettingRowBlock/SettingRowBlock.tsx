import type { ReactNode } from "react";

import { cn } from "../../../components/ui/utils";

/** Visual variants for SettingRowBlock. */
export type SettingRowBlockVariant = "default" | "card" | "compact" | "danger";
/** Size presets for SettingRowBlock. */
export type SettingRowBlockSize = "sm" | "md" | "lg";

/** Props for SettingRowBlock. */
export interface SettingRowBlockProps {
  /** Icon displayed before the label */
  icon?: ReactNode;
  /** Main label text */
  label: string;
  /** Description text below the label */
  description?: string;
  /** Content on the right side (value, badge, chevron, etc.) */
  right?: ReactNode;
  /** Click handler - makes the row interactive */
  onClick?: () => void;
  /** Additional class names */
  className?: string;
  /** Visual variant */
  variant?: SettingRowBlockVariant;
  /** Size preset */
  size?: SettingRowBlockSize;
  /** Whether the row is disabled */
  disabled?: boolean;
  /** Whether the row is in a loading state */
  loading?: boolean;
  /** Whether the row is selected/active */
  selected?: boolean;
  /** Badge next to the label */
  badge?: ReactNode;
  /** Whether to show a divider below */
  divider?: boolean;
  /** Whether to show a chevron indicator (auto-added if onClick is provided) */
  showChevron?: boolean;
  /** External link indicator */
  external?: boolean;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Accessible label override */
  "aria-label"?: string;
}

const variantStyles: Record<
  SettingRowBlockVariant,
  { base: string; hover: string; active: string }
> = {
  default: {
    base: "",
    hover: "hover:bg-secondary",
    active: "active:bg-muted",
  },
  card: {
    base: "bg-secondary border border-border rounded-lg",
    hover: "hover:bg-muted/50 hover:border-border",
    active: "active:bg-muted",
  },
  compact: {
    base: "",
    hover: "hover:bg-secondary/50",
    active: "active:bg-secondary",
  },
  danger: {
    base: "",
    hover: "hover:bg-status-error-muted/10",
    active: "active:bg-status-error-muted/20",
  },
};

const sizeStyles: Record<
  SettingRowBlockSize,
  { padding: string; label: string; description: string; icon: string; gap: string }
> = {
  sm: {
    padding: "px-2.5 py-2",
    label: "text-xs",
    description: "text-[11px]",
    icon: "size-4",
    gap: "gap-2.5",
  },
  md: {
    padding: "px-3 py-2.5",
    label: "text-sm",
    description: "text-xs",
    icon: "size-5",
    gap: "gap-3",
  },
  lg: {
    padding: "px-4 py-3",
    label: "text-base",
    description: "text-sm",
    icon: "size-6",
    gap: "gap-4",
  },
};

/**
 * Render a settings row block with optional actions and status.
 * @param props - Block props.
 * @returns The settings row block element.
 */
export function SettingRowBlock({
  icon,
  label,
  description,
  right,
  onClick,
  className,
  variant = "default",
  size = "md",
  disabled = false,
  loading = false,
  selected = false,
  badge,
  divider = false,
  showChevron,
  external = false,
  shortcut,
  "aria-label": ariaLabel,
}: SettingRowBlockProps) {
  const isClickable = !!onClick && !disabled && !loading;
  const shouldShowChevron = showChevron ?? (isClickable && !external);

  const { base, hover, active } = variantStyles[variant];
  const {
    padding,
    label: labelSize,
    description: descriptionSize,
    icon: iconSize,
    gap,
  } = sizeStyles[size];

  const content = (
    <>
      {/* Left side: Icon + Label + Description */}
      <div className={cn("flex items-center flex-1 min-w-0", gap)}>
        {icon && (
          <span
            className={cn(
              "shrink-0",
              iconSize,
              variant === "danger" ? "text-status-error" : "text-text-secondary",
              disabled && "opacity-50",
            )}
          >
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium truncate",
                labelSize,
                variant === "danger" ? "text-status-error" : "text-foreground",
                disabled && "opacity-50",
              )}
            >
              {label}
            </span>
            {badge}
            {shortcut && (
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-muted font-mono text-[10px] text-muted-foreground border border-border">
                {shortcut}
              </kbd>
            )}
          </div>
          {description && (
            <p
              className={cn(
                "text-muted-foreground mt-0.5 line-clamp-2",
                descriptionSize,
                disabled && "opacity-50",
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Value + Indicators */}
      <div className={cn("flex items-center shrink-0", gap)}>
        {loading ? (
          <svg
            className="size-4 animate-spin text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
          >
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
        ) : (
          <>
            {right && <span className="text-text-secondary text-sm">{right}</span>}
            {external && (
              <svg
                className="size-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            )}
            {shouldShowChevron && (
              <svg
                className="size-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </>
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    "flex items-center justify-between rounded-lg transition-colors duration-150",
    padding,
    base,
    selected && "bg-accent-blue/10 border-accent-blue",
    divider && "border-b border-border rounded-none",
    disabled && "opacity-50 cursor-not-allowed",
    className,
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          baseClasses,
          "w-full text-left",
          hover,
          active,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          loading && "cursor-wait",
        )}
        aria-label={ariaLabel ?? label}
        aria-selected={selected}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={baseClasses} aria-label={ariaLabel}>
      {content}
    </div>
  );
}

// Compound component for row value display
/** Props for SettingRowValue. */
export interface SettingRowValueProps {
  children: ReactNode;
  variant?: "default" | "muted" | "accent";
  className?: string;
}

/**
 * Render a value element for a settings row.
 * @param props - Value props.
 * @returns The value element.
 */
export function SettingRowValue({
  children,
  variant = "default",
  className,
}: SettingRowValueProps) {
  const variantClasses = {
    default: "text-text-secondary",
    muted: "text-muted-foreground",
    accent: "text-accent-blue",
  };

  return <span className={cn("text-sm", variantClasses[variant], className)}>{children}</span>;
}

// Compound component for row badge
/** Props for SettingRowBadge. */
export interface SettingRowBadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "new";
  className?: string;
}

/**
 * Render a badge for a settings row.
 * @param props - Badge props.
 * @returns The badge element.
 */
export function SettingRowBadge({
  children,
  variant = "default",
  className,
}: SettingRowBadgeProps) {
  const variantClasses = {
    default: "bg-muted text-text-secondary",
    primary: "bg-accent-blue text-text-body-on-color",
    success: "bg-accent-green text-text-body-on-color",
    warning: "bg-accent-orange text-foreground",
    error: "bg-status-error text-text-body-on-color",
    new: "bg-accent-blue/10 text-accent-blue",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// Compound component for row group
/** Props for SettingRowGroup. */
export interface SettingRowGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  className?: string;
}

/**
 * Render a group of related setting rows.
 * @param props - Group props.
 * @returns The group element.
 */
export function SettingRowGroup({ children, label, description, className }: SettingRowGroupProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {(label || description) && (
        <div className="px-3 py-2">
          {label && <h3 className="text-sm font-medium text-foreground">{label}</h3>}
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      )}
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

// Compound component for row divider
/**
 * Render a divider between setting rows.
 * @param props - Divider props.
 * @returns The divider element.
 */
export function SettingRowDivider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-muted my-1", className)} role="separator" />;
}
