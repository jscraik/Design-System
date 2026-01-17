import type { ReactNode } from "react";

import { cn } from "./ui/utils";

export type SettingRowBlockVariant = "default" | "card" | "compact" | "danger";
export type SettingRowBlockSize = "sm" | "md" | "lg";

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
    hover: "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2",
    active: "active:bg-foundation-bg-light-3 dark:active:bg-foundation-bg-dark-3",
  },
  card: {
    base: "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg",
    hover:
      "hover:bg-foundation-bg-light-3/50 dark:hover:bg-foundation-bg-dark-3/50 hover:border-foundation-bg-light-4 dark:hover:border-foundation-bg-dark-4",
    active: "active:bg-foundation-bg-light-3 dark:active:bg-foundation-bg-dark-3",
  },
  compact: {
    base: "",
    hover: "hover:bg-foundation-bg-light-2/50 dark:hover:bg-foundation-bg-dark-2/50",
    active: "active:bg-foundation-bg-light-2 dark:active:bg-foundation-bg-dark-2",
  },
  danger: {
    base: "",
    hover: "hover:bg-foundation-accent-red/10",
    active: "active:bg-foundation-accent-red/20",
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
              variant === "danger"
                ? "text-foundation-accent-red"
                : "text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary",
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
                variant === "danger"
                  ? "text-foundation-accent-red"
                  : "text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
                disabled && "opacity-50",
              )}
            >
              {label}
            </span>
            {badge}
            {shortcut && (
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 font-mono text-[10px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary border border-foundation-bg-light-4 dark:border-foundation-bg-dark-4">
                {shortcut}
              </kbd>
            )}
          </div>
          {description && (
            <p
              className={cn(
                "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-0.5 line-clamp-2",
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
            className="size-4 animate-spin text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary"
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
            {right && (
              <span className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary text-sm">
                {right}
              </span>
            )}
            {external && (
              <svg
                className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary"
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
                className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary"
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
    selected && "bg-foundation-accent-blue/10 border-foundation-accent-blue",
    divider &&
      "border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-none",
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-inset",
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
export interface SettingRowValueProps {
  children: ReactNode;
  variant?: "default" | "muted" | "accent";
  className?: string;
}

export function SettingRowValue({
  children,
  variant = "default",
  className,
}: SettingRowValueProps) {
  const variantClasses = {
    default: "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
    muted: "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary",
    accent: "text-foundation-accent-blue",
  };

  return <span className={cn("text-sm", variantClasses[variant], className)}>{children}</span>;
}

// Compound component for row badge
export interface SettingRowBadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "new";
  className?: string;
}

export function SettingRowBadge({
  children,
  variant = "default",
  className,
}: SettingRowBadgeProps) {
  const variantClasses = {
    default:
      "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
    primary: "bg-foundation-accent-blue text-white",
    success: "bg-foundation-accent-green text-white",
    warning:
      "bg-foundation-accent-orange text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
    error: "bg-foundation-accent-red text-white",
    new: "bg-foundation-accent-blue/10 text-foundation-accent-blue",
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
export interface SettingRowGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  className?: string;
}

export function SettingRowGroup({ children, label, description, className }: SettingRowGroupProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {(label || description) && (
        <div className="px-3 py-2">
          {label && (
            <h3 className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
              {label}
            </h3>
          )}
          {description && (
            <p className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="divide-y divide-foundation-bg-light-3 dark:divide-foundation-bg-dark-3">
        {children}
      </div>
    </div>
  );
}

// Compound component for row divider
export function SettingRowDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-px bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 my-1", className)}
      role="separator"
    />
  );
}
