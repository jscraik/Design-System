import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../utils";

const indicatorVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "text-interactive",
      success: "text-status-success",
      warning: "text-status-warning",
      error: "text-status-error",
    },
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
      xl: "size-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface IndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof indicatorVariants>,
    StatefulComponentProps {
  label?: string;
}

/**
 * Renders a loading indicator with spinner animation.
 *
 * Supports stateful props for loading, error, and disabled states.
 * When error is provided, displays error message instead of label.
 *
 * @param props - Indicator props and stateful options.
 * @returns The indicator element.
 *
 * @example
 * ```tsx
 * <Indicator label="Loading..." />
 * <Indicator label="Saving..." variant="primary" />
 * <Indicator error="Failed to load" />
 * ```
 */
function Indicator({
  className,
  variant,
  size,
  label,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: IndicatorProps) {
  // Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  return (
    <div
      data-slot="indicator"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      role="status"
      aria-label={error || label || "Loading"}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "flex flex-col items-center gap-2",
        isDisabled && "opacity-50 pointer-events-none",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          indicatorVariants({ variant: error ? "error" : variant, size }),
          "inline-flex items-center justify-center",
        )}
      >
        <span
          className={cn(
            "inline-block rounded-full border-2 border-current border-t-transparent animate-spin",
            "size-full",
            isDisabled && "animate-pulse",
          )}
        />
      </span>
      {(label || error) && (
        <span className={cn("text-sm", error ? "text-status-error" : "text-muted-foreground")}>
          {error || label}
        </span>
      )}
    </div>
  );
}

export interface InlineIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof indicatorVariants>,
    StatefulComponentProps {}

/**
 * Renders an inline loading indicator with spinner animation.
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * @param props - Inline indicator props and stateful options.
 * @returns The inline indicator element.
 */
function InlineIndicator({
  className,
  variant,
  size = "sm",
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: InlineIndicatorProps) {
  // Determine effective state (priority: loading > error > disabled > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  return (
    <span
      data-slot="inline-indicator"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      role="status"
      aria-label={error || "Loading"}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn("inline-flex", isDisabled && "opacity-50 pointer-events-none", className)}
      {...props}
    >
      <span
        className={cn(
          indicatorVariants({ variant: error ? "error" : variant, size }),
          "inline-flex items-center justify-center",
        )}
      >
        <span
          className={cn(
            "inline-block size-full rounded-full border-2 border-current border-t-transparent animate-spin",
            isDisabled && "animate-pulse",
          )}
        />
      </span>
    </span>
  );
}

export { Indicator, InlineIndicator };
