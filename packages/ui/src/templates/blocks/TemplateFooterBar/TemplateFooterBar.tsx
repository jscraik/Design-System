import type { ReactNode } from "react";

import { cn } from "../../../components/ui/utils";

/** Visual variants for TemplateFooterBar. */
export type TemplateFooterBarVariant = "default" | "elevated" | "transparent" | "subtle";
/** Size presets for TemplateFooterBar. */
export type TemplateFooterBarSize = "sm" | "md" | "lg";
/** Status variants for TemplateFooterBar. */
export type TemplateFooterBarStatus = "default" | "success" | "warning" | "error" | "info";

/** Props for TemplateFooterBar. */
export interface TemplateFooterBarProps {
  /** Content on the left side */
  leading?: ReactNode;
  /** Content on the right side */
  trailing?: ReactNode;
  /** Center content (takes priority over leading/trailing layout) */
  center?: ReactNode;
  /** Additional class names for the root container */
  className?: string;
  /** Visual variant */
  variant?: TemplateFooterBarVariant;
  /** Size preset affecting padding */
  size?: TemplateFooterBarSize;
  /** Whether the footer is sticky at the bottom */
  sticky?: boolean;
  /** Whether to show the top border */
  bordered?: boolean;
  /** Status indicator with icon and message */
  status?: {
    type: TemplateFooterBarStatus;
    message: string;
    icon?: ReactNode;
  };
  /** Progress indicator (0-100) */
  progress?: {
    value: number;
    label?: string;
    showPercentage?: boolean;
  };
  /** Whether the footer is in a loading state */
  loading?: boolean;
  /** Keyboard shortcut hint */
  shortcut?: {
    key: string;
    label: string;
  };
}

const variantStyles: Record<TemplateFooterBarVariant, string> = {
  default: "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1",
  elevated: "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 shadow-sm",
  transparent: "bg-transparent",
  subtle: "bg-foundation-bg-light-1/50 dark:bg-foundation-bg-dark-1/50 backdrop-blur-sm",
};

const sizeStyles: Record<TemplateFooterBarSize, { padding: string; gap: string }> = {
  sm: { padding: "px-3 py-2", gap: "gap-2" },
  md: { padding: "px-4 py-2.5", gap: "gap-3" },
  lg: { padding: "px-5 py-3.5", gap: "gap-4" },
};

const statusStyles: Record<TemplateFooterBarStatus, { bg: string; text: string; icon: string }> = {
  default: {
    bg: "",
    text: "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
    icon: "text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary",
  },
  success: {
    bg: "",
    text: "text-foundation-accent-green",
    icon: "text-foundation-accent-green",
  },
  warning: {
    bg: "",
    text: "text-foundation-accent-orange",
    icon: "text-foundation-accent-orange",
  },
  error: {
    bg: "",
    text: "text-foundation-accent-red",
    icon: "text-foundation-accent-red",
  },
  info: {
    bg: "",
    text: "text-foundation-accent-blue",
    icon: "text-foundation-accent-blue",
  },
};

const statusIcons: Record<TemplateFooterBarStatus, ReactNode> = {
  default: null,
  success: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

/**
 * Render the template footer bar.
 * @param props - Footer bar props.
 * @returns The footer bar element.
 */
export function TemplateFooterBar({
  leading,
  trailing,
  center,
  className,
  variant = "default",
  size = "md",
  sticky = false,
  bordered = true,
  status,
  progress,
  loading = false,
  shortcut,
}: TemplateFooterBarProps) {
  const { padding, gap } = sizeStyles[size];

  const statusElement = status && (
    <div className={cn("flex items-center gap-1.5", statusStyles[status.type].text)}>
      <span className={statusStyles[status.type].icon}>
        {status.icon ?? statusIcons[status.type]}
      </span>
      <span className="text-xs font-medium">{status.message}</span>
    </div>
  );

  const progressElement = progress && (
    <div className="flex items-center gap-2 min-w-[120px]">
      {progress.label && (
        <span className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary whitespace-nowrap">
          {progress.label}
        </span>
      )}
      <div className="flex-1 h-1.5 bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-foundation-accent-blue rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress.value))}%` }}
        />
      </div>
      {progress.showPercentage && (
        <span className="text-xs tabular-nums text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary min-w-[2.5rem] text-right">
          {Math.round(progress.value)}%
        </span>
      )}
    </div>
  );

  const loadingElement = loading && (
    <div className="flex items-center gap-2">
      <svg
        className="w-4 h-4 animate-spin text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary"
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
      <span className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
        Loading...
      </span>
    </div>
  );

  const shortcutElement = shortcut && (
    <div className="flex items-center gap-1.5 text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
      <kbd className="px-1.5 py-0.5 rounded bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 font-mono text-[11px] border border-foundation-bg-light-4 dark:border-foundation-bg-dark-4">
        {shortcut.key}
      </kbd>
      <span>{shortcut.label}</span>
    </div>
  );

  // Determine what to show in leading slot
  const leadingContent = loading ? loadingElement : (statusElement ?? progressElement ?? leading);

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        padding,
        variantStyles[variant],
        bordered && "border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
        sticky && "sticky bottom-0 z-10",
        className,
      )}
    >
      {/* Leading */}
      <div className={cn("flex items-center", gap, "min-w-0 flex-1")}>{leadingContent}</div>

      {/* Center */}
      {center && (
        <div className={cn("flex items-center justify-center", gap, "px-4")}>{center}</div>
      )}

      {/* Trailing */}
      <div className={cn("flex items-center", gap, "shrink-0")}>
        {shortcutElement}
        {trailing}
      </div>
    </div>
  );
}

// Compound component for footer button
/** Props for TemplateFooterButton. */
export interface TemplateFooterButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
}

/**
 * Render a button for the footer bar.
 * @param props - Button props.
 * @returns The footer button element.
 */
export function TemplateFooterButton({
  children,
  onClick,
  variant = "default",
  size = "sm",
  disabled = false,
  loading = false,
  icon,
  className,
}: TemplateFooterButtonProps) {
  const variantClasses = {
    default:
      "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
    primary:
      "bg-button-primary-bg-light dark:bg-button-primary-bg-dark text-button-primary-text-light dark:text-button-primary-text-dark hover:bg-button-primary-bg-light-hover dark:hover:bg-button-primary-bg-dark-hover border border-transparent shadow-sm",
    ghost:
      "bg-transparent text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3 hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary border border-transparent",
    danger:
      "bg-foundation-accent-red text-white hover:bg-foundation-accent-red/90 border border-transparent shadow-sm",
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 rounded-lg",
    md: "text-sm px-4 py-2 rounded-lg",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-1",
        "transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && "opacity-40 cursor-not-allowed pointer-events-none",
        className,
      )}
    >
      {loading ? (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
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
        icon
      )}
      {children}
    </button>
  );
}

// Compound component for footer link
/** Props for TemplateFooterLink. */
export interface TemplateFooterLinkProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * Render a link for the footer bar.
 * @param props - Link props.
 * @returns The footer link element.
 */
export function TemplateFooterLink({
  children,
  onClick,
  href,
  icon,
  className,
  disabled = false,
}: TemplateFooterLinkProps) {
  const baseClasses = cn(
    "inline-flex items-center gap-1.5 text-xs font-medium",
    "text-foundation-accent-blue hover:text-foundation-accent-blue/80",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:rounded-sm",
    "transition-colors",
    disabled && "opacity-40 pointer-events-none cursor-not-allowed",
    className,
  );

  const content = (
    <>
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  );
}

// Compound component for footer text/info
/** Props for TemplateFooterText. */
export interface TemplateFooterTextProps {
  children: ReactNode;
  variant?: "default" | "muted" | "success" | "warning" | "error";
  icon?: ReactNode;
  className?: string;
}

/**
 * Render text content for the footer bar.
 * @param props - Text props.
 * @returns The footer text element.
 */
export function TemplateFooterText({
  children,
  variant = "default",
  icon,
  className,
}: TemplateFooterTextProps) {
  const variantClasses = {
    default: "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
    muted: "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary",
    success: "text-foundation-accent-green",
    warning: "text-foundation-accent-orange",
    error: "text-foundation-accent-red",
  };

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs", variantClasses[variant], className)}
    >
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </span>
  );
}

// Compound component for footer divider
/** Props for TemplateFooterDivider. */
export interface TemplateFooterDividerProps {
  className?: string;
}

/**
 * Render a divider within the footer bar.
 * @param props - Divider props.
 * @returns The divider element.
 */
export function TemplateFooterDivider({ className }: TemplateFooterDividerProps) {
  return (
    <div
      className={cn("w-px h-4 bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3", className)}
      role="separator"
      aria-orientation="vertical"
    />
  );
}
