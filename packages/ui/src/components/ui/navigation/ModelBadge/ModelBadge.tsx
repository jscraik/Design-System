import * as React from "react";
import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

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
  blue: "text-foundation-accent-blue bg-foundation-accent-blue/20",
  green: "text-foundation-accent-green bg-foundation-accent-green/20",
  orange: "text-foundation-accent-orange bg-foundation-accent-orange/20",
  default: "text-foundation-text-dark-secondary bg-foundation-bg-dark-3",
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
        error && "border border-foundation-accent-red",
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
