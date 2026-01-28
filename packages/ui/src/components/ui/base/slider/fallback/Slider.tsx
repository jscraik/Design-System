// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Renders a slider component (Radix Slider) with Apps SDK UI tokens.
 *
 * Supports stateful props for loading, error, disabled, and required states.
 *
 * Provide `aria-label` or `aria-labelledby` so each thumb is accessible.
 * Supports controlled (`value`) and uncontrolled (`defaultValue`) usage.
 *
 * @param props - Radix slider root props including stateful options.
 * @param props.error - Error message, applies error styling when set.
 * @param props.loading - Shows loading state and disables slider (default: `false`).
 * @param props.disabled - Disabled state (also set automatically when loading).
 * @param props.required - Required field indicator (default: `false`).
 * @param props.onStateChange - Callback when component state changes.
 * @returns A slider element.
 *
 * @example
 * ```tsx
 * <Slider defaultValue={[50]} />
 * <Slider error="Value too high" max={100} />
 * <Slider loading />
 * ```
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  loading = false,
  error,
  disabled = false,
  required = false,
  onStateChange,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & StatefulComponentProps) {
  const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...rootProps } = props;

  // Determine effective state
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

  // Slider is effectively disabled when loading or explicitly disabled
  const isDisabled = disabled || loading;

  // Resolve value/defaultValue to array for multiple thumbs
  const thumbValues = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      disabled={isDisabled}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...rootProps}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          // Track background - using Apps SDK UI tokens
          "bg-input-background",
          // Error state styling
          error && "border-destructive/50 border",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            // Range background - using Apps SDK UI tokens
            error ? "bg-destructive" : "bg-primary",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbValues.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className={cn(
            "block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow]",
            // Thumb border - using Apps SDK UI tokens
            error ? "border-destructive" : "border-primary",
            // Thumb background - using Apps SDK UI tokens
            "bg-background",
            // Focus styles - using Apps SDK UI tokens
            "hover:ring-ring/50 hover:ring-4",
            "focus-visible:ring-ring/50 focus-visible:ring-4 focus-visible:outline-hidden",
            // Disabled state
            "disabled:pointer-events-none disabled:opacity-50",
            // Loading state styling
            loading && "opacity-70 cursor-wait",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
