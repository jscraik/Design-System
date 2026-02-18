import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { cn } from "../../utils";

/**
 * Props for the range slider component.
 */
export interface RangeSliderProps extends StatefulComponentProps {
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Label text */
  label?: string;
  /** Accessible label if no visible label is provided */
  ariaLabel?: string;
  /** Value suffix (e.g., "k", "%") */
  suffix?: string;
  /** Show value display */
  showValue?: boolean;
  /** Gradient background for track */
  gradient?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Renders a customizable range input.
 *
 * Supports stateful props for loading, error, and disabled states.
 * When loading, disables the slider with pulse animation.
 * When error, shows error ring styling.
 * When disabled, reduces opacity and prevents interaction.
 *
 * @example
 * ```tsx
 * <RangeSlider
 *   label="Target Size"
 *   value={60}
 *   onChange={setTargetSize}
 *   min={20}
 *   max={100}
 *   suffix="k"
 * />
 * <RangeSlider loading />
 * <RangeSlider error="Invalid value" />
 * ```
 *
 * @param props - Range slider props and stateful options.
 * @returns A range slider element.
 */
export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  ariaLabel,
  suffix = "",
  showValue = true,
  gradient,
  disabled = false,
  loading = false,
  error,
  required,
  onStateChange,
  className,
}: RangeSliderProps) {
  const inputId = React.useId();
  const percentage = ((value - min) / (max - min)) * 100;

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

  const defaultGradient = `linear-gradient(to right, var(--range-fill) 0%, var(--range-fill) ${percentage}%, var(--range-track) ${percentage}%, var(--range-track) 100%)`;

  return (
    <div
      className={cn("space-y-2", className)}
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="text-caption text-text-secondary">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-caption font-semibold text-foreground">
              {value}
              {suffix}
            </span>
          )}
        </div>
      )}
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        disabled={isDisabled}
        aria-label={ariaLabel ?? label ?? "Range slider"}
        className={cn(
          "w-full h-1.5 rounded-lg appearance-none cursor-pointer [--range-track:var(--muted)] [--range-thumb:var(--background)] [--range-fill:var(--status-success)]",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--range-thumb)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm",
          "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--range-thumb)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer",
          isDisabled && "opacity-50 cursor-not-allowed",
          error && "ring-2 ring-status-error/50",
          loading && "animate-pulse",
        )}
        style={{ background: gradient || defaultGradient }}
      />
    </div>
  );
}

RangeSlider.displayName = "RangeSlider";
