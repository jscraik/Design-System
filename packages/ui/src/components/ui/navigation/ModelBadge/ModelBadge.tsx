import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { cn } from "../../utils";

/**
 * Props for the model badge component.
 */
export interface ModelBadgeProps extends StatefulComponentProps {
  /** Model name to display */
  name: string;
  /** Color variant */
  variant?: "blue" | "green" | "orange" | "default";
  /** Size variant */
  size?: "sm" | "md";
  /** Additional CSS classes */
  className?: string;
}

const variantStyles = {
  blue: "text-interactive bg-interactive/20",
  green: "text-status-success bg-status-success-muted/20",
  orange: "text-status-warning bg-status-warning/20",
  default: "text-text-secondary bg-muted",
};

/**
 * Renders a badge displaying the current model name.
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * @example
 * ```tsx
 * <ModelBadge name="GPT-4o" variant="blue" />
 * ```
 *
 * @param props - Model badge props.
 * @returns A model badge element.
 */
export function ModelBadge({
  name,
  variant = "blue",
  size = "sm",
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  className,
}: ModelBadgeProps) {
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

  const sizes = {
    sm: "px-2 py-1 text-caption leading-tight",
    md: "px-3 py-1.5 text-caption",
  };

  return (
    <div
      data-slot="model-badge"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      className={cn(
        "rounded-md font-medium",
        variantStyles[variant],
        sizes[size],
        isDisabled && "opacity-50 pointer-events-none",
        error && "border border-status-error",
        loading && "animate-pulse",
        className,
      )}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
    >
      {loading ? "Loading..." : (error ?? name)}
    </div>
  );
}

ModelBadge.displayName = "ModelBadge";
