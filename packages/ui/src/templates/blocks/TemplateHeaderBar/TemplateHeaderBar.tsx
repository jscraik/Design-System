import type { ReactNode } from "react";

import { cn } from "../../../components/ui/utils";

/** Visual variants for TemplateHeaderBar. */
export type TemplateHeaderBarVariant = "default" | "transparent" | "elevated" | "bordered";
/** Size presets for TemplateHeaderBar. */
export type TemplateHeaderBarSize = "sm" | "md" | "lg";

/** Props for TemplateHeaderBar. */
export interface TemplateHeaderBarProps {
  /** Main title text */
  title: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Content before the title (e.g., back button, icon) */
  leading?: ReactNode;
  /** Content after the title on the right side */
  trailing?: ReactNode;
  /** Breadcrumbs for multi-level navigation */
  breadcrumbs?: ReactNode;
  /** Badge content (e.g., notification count) next to title */
  badge?: ReactNode;
  /** Additional class names for the root container */
  className?: string;
  /** Additional class names for the title */
  titleClassName?: string;
  /** Additional class names for the subtitle */
  subtitleClassName?: string;
  /** Visual variant */
  variant?: TemplateHeaderBarVariant;
  /** Size preset affecting padding and typography */
  size?: TemplateHeaderBarSize;
  /** Whether the header is sticky */
  sticky?: boolean;
  /** Whether to show a bottom border */
  bordered?: boolean;
  /** Whether to show a divider line below the header */
  divider?: boolean;
  /** Center the title instead of left-aligning */
  centerTitle?: boolean;
  /** Whether the header is in a loading state */
  loading?: boolean;
  /** Make the header clickable (e.g., for navigation) */
  onClick?: () => void;
  /** Accessible label for the header */
  "aria-label"?: string;
}

const variantStyles: Record<TemplateHeaderBarVariant, string> = {
  default: "bg-secondary",
  transparent: "bg-transparent",
  elevated: "bg-secondary shadow-sm",
  bordered: "bg-secondary border-b border-border",
};

const sizeStyles: Record<
  TemplateHeaderBarSize,
  { padding: string; title: string; subtitle: string; gap: string }
> = {
  sm: {
    padding: "px-3 py-2",
    title: "text-sm leading-5",
    subtitle: "text-xs",
    gap: "gap-1.5",
  },
  md: {
    padding: "px-4 py-3",
    title: "text-base leading-6",
    subtitle: "text-xs",
    gap: "gap-2",
  },
  lg: {
    padding: "px-5 py-4",
    title: "text-lg leading-7",
    subtitle: "text-sm",
    gap: "gap-3",
  },
};

/**
 * Render the template header bar.
 * @param props - Header bar props.
 * @returns The header bar element.
 */
export function TemplateHeaderBar({
  title,
  subtitle,
  leading,
  trailing,
  breadcrumbs,
  badge,
  className,
  titleClassName,
  subtitleClassName,
  variant = "default",
  size = "md",
  sticky = false,
  bordered = false,
  divider = false,
  centerTitle = false,
  loading = false,
  onClick,
  "aria-label": ariaLabel,
}: TemplateHeaderBarProps) {
  const { padding, title: titleSize, subtitle: subtitleSize, gap } = sizeStyles[size];

  const isClickable = !!onClick;

  // Skeleton loader for loading state
  const skeletonContent = (
    <div className={cn("flex items-center", gap, centerTitle && "flex-1")}>
      {leading && <div className="shrink-0 flex items-center opacity-50">{leading}</div>}
      <div className={cn("min-w-0 space-y-1.5", centerTitle && "flex-1")}>
        <div
          className={cn(
            "h-5 rounded bg-muted animate-pulse",
            size === "sm" && "w-24 h-4",
            size === "md" && "w-32 h-5",
            size === "lg" && "w-40 h-6",
          )}
        />
        {subtitle && (
          <div
            className={cn(
              "h-3 rounded bg-muted animate-pulse",
              size === "sm" && "w-16",
              size === "md" && "w-20",
              size === "lg" && "w-24",
            )}
          />
        )}
      </div>
    </div>
  );

  const content = (
    <div className="flex flex-col w-full">
      {/* Breadcrumbs */}
      {breadcrumbs && !loading && <div className="mb-1">{breadcrumbs}</div>}

      <div className="flex items-center justify-between w-full">
        {/* Leading + Title Section */}
        {loading ? (
          skeletonContent
        ) : (
          <div className={cn("flex items-center", gap, centerTitle && "flex-1")}>
            {leading && <div className="shrink-0 flex items-center">{leading}</div>}
            <div className={cn("min-w-0", centerTitle && "flex-1 text-center")}>
              <div className="flex items-center gap-2">
                <span
                  className={cn("font-medium text-foreground truncate", titleSize, titleClassName)}
                >
                  {title}
                </span>
                {badge}
              </div>
              {subtitle && (
                <span
                  className={cn(
                    "text-text-secondary truncate block mt-0.5",
                    subtitleSize,
                    subtitleClassName,
                  )}
                >
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Spacer for centered title */}
        {centerTitle && leading && !trailing && <div className="shrink-0 invisible">{leading}</div>}

        {/* Trailing Section */}
        {trailing && !loading && (
          <div className={cn("shrink-0 flex items-center", gap)}>{trailing}</div>
        )}
      </div>
    </div>
  );

  const baseClasses = cn(
    "flex items-center justify-between",
    padding,
    variantStyles[variant],
    bordered && "border-b border-border",
    sticky && "sticky top-0 z-10 backdrop-blur-sm",
    isClickable && "cursor-pointer hover:bg-muted/50 transition-colors",
    className,
  );

  const headerElement = isClickable ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseClasses, "w-full text-left")}
      aria-label={ariaLabel ?? title}
      disabled={loading}
    >
      {content}
    </button>
  ) : (
    <div className={baseClasses} aria-label={ariaLabel} role={ariaLabel ? "banner" : undefined}>
      {content}
    </div>
  );

  if (divider) {
    return (
      <div>
        {headerElement}
        <div className="h-px bg-border" />
      </div>
    );
  }

  return headerElement;
}

// Compound component for common back button pattern
/** Props for TemplateHeaderBackButton. */
export interface TemplateHeaderBackButtonProps {
  onClick: () => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Render a back button for the header bar.
 * @param props - Back button props.
 * @returns The back button element.
 */
export function TemplateHeaderBackButton({
  onClick,
  className,
  "aria-label": ariaLabel = "Go back",
}: TemplateHeaderBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 -ml-1.5",
        "text-muted-foreground",
        "hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-150",
        className,
      )}
      aria-label={ariaLabel}
    >
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

// Compound component for icon button in header
/** Props for TemplateHeaderIconButton. */
export interface TemplateHeaderIconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  "aria-label": string;
  active?: boolean;
  disabled?: boolean;
}

/**
 * Render an icon-only header action button.
 * @param props - Icon button props.
 * @returns The icon button element.
 */
export function TemplateHeaderIconButton({
  icon,
  onClick,
  className,
  "aria-label": ariaLabel,
  active = false,
  disabled = false,
}: TemplateHeaderIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2",
        "text-muted-foreground",
        "hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-150",
        active && "bg-muted text-foreground",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      {icon}
    </button>
  );
}

// Compound component for action button in header
/** Props for TemplateHeaderActionButton. */
export interface TemplateHeaderActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "primary" | "ghost";
  size?: "sm" | "md";
  disabled?: boolean;
}

/**
 * Render a labeled header action button.
 * @param props - Action button props.
 * @returns The action button element.
 */
export function TemplateHeaderActionButton({
  children,
  onClick,
  className,
  variant = "default",
  size = "sm",
  disabled = false,
}: TemplateHeaderActionButtonProps) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground hover:bg-muted/80",
    primary: "bg-accent-blue text-text-body-on-color hover:bg-accent-blue/90",
    ghost: "text-muted-foreground hover:bg-muted",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-3 py-2",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-150",
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
}

// Compound component for close button pattern
/** Props for TemplateHeaderCloseButton. */
export interface TemplateHeaderCloseButtonProps {
  onClick: () => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Render a close button for the header bar.
 * @param props - Close button props.
 * @returns The close button element.
 */
export function TemplateHeaderCloseButton({
  onClick,
  className,
  "aria-label": ariaLabel = "Close",
}: TemplateHeaderCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5",
        "text-muted-foreground",
        "hover:bg-muted",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-150",
        className,
      )}
      aria-label={ariaLabel}
    >
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

// Compound component for badge/notification indicator
/** Badge variants for header badges. */
export type TemplateHeaderBadgeVariant = "default" | "primary" | "success" | "warning" | "error";

/** Props for TemplateHeaderBadge. */
export interface TemplateHeaderBadgeProps {
  children?: ReactNode;
  count?: number;
  maxCount?: number;
  dot?: boolean;
  variant?: TemplateHeaderBadgeVariant;
  className?: string;
}

const badgeVariantStyles: Record<TemplateHeaderBadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-accent-blue text-text-body-on-color",
  success: "bg-accent-green text-text-body-on-color",
  warning: "bg-accent-orange text-text-body-on-color",
  error: "bg-status-error text-text-body-on-color",
};

/**
 * Render a header badge element.
 * @param props - Badge props.
 * @returns The badge element.
 */
export function TemplateHeaderBadge({
  children,
  count,
  maxCount = 99,
  dot = false,
  variant = "primary",
  className,
}: TemplateHeaderBadgeProps) {
  if (dot) {
    return (
      <span
        className={cn("inline-block size-2 rounded-full", badgeVariantStyles[variant], className)}
        aria-hidden="true"
      />
    );
  }

  const displayCount =
    count !== undefined ? (count > maxCount ? `${maxCount}+` : count.toString()) : null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full text-xs font-medium min-w-[1.25rem] h-5 px-1.5",
        badgeVariantStyles[variant],
        className,
      )}
    >
      {displayCount ?? children}
    </span>
  );
}

// Compound component for breadcrumbs
/** Item metadata for header breadcrumbs. */
export interface TemplateHeaderBreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

/** Props for TemplateHeaderBreadcrumbs. */
export interface TemplateHeaderBreadcrumbsProps {
  items: TemplateHeaderBreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

/**
 * Render breadcrumb navigation for the header bar.
 * @param props - Breadcrumb props.
 * @returns The breadcrumbs element.
 */
export function TemplateHeaderBreadcrumbs({
  items,
  separator,
  className,
}: TemplateHeaderBreadcrumbsProps) {
  const defaultSeparator = (
    <svg
      className="size-3 text-muted-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1", className)}>
      <ol className="flex items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = item.href || item.onClick;

          return (
            <li key={index} className="flex items-center gap-1">
              {isClickable && !isLast ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className={cn(
                    "text-xs text-muted-foreground",
                    "hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded",
                    "transition-colors duration-150",
                  )}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={cn(
                    "text-xs",
                    isLast ? "text-foreground font-medium" : "text-muted-foreground",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="flex items-center" aria-hidden="true">
                  {separator ?? defaultSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
