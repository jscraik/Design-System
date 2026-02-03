// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { IconCheckCircle } from "../../../../../icons";
import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Renders a radio group container (Radix Radio Group).
 *
 * Supports stateful props for loading, error, disabled, and required states.
 *
 * Provide an accessible label via `aria-label` or `aria-labelledby`.
 *
 * @param props - Radix radio group root props including stateful options.
 * @param props.error - Error message, applies error styling when set.
 * @param props.loading - Shows loading state and disables all items (default: `false`).
 * @param props.disabled - Disabled state (also set automatically when loading).
 * @param props.required - Required field indicator (default: `false`).
 * @param props.onStateChange - Callback when component state changes.
 * @returns A radio group element.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="option1">
 *   <RadioGroupItem value="option1">Option 1</RadioGroupItem>
 *   <RadioGroupItem value="option2">Option 2</RadioGroupItem>
 * </RadioGroup>
 * <RadioGroup error="Selection required" required />
 * ```
 */
function RadioGroup({
  className,
  loading = false,
  error,
  disabled = false,
  required = false,
  onStateChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & StatefulComponentProps) {
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

  // RadioGroup is effectively disabled when loading or explicitly disabled
  const isDisabled = disabled || loading;

  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      disabled={isDisabled}
      required={required}
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

/**
 * Renders a radio group item.
 *
 * @param props - Radix radio group item props.
 * @returns A radio group item element.
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Base styles
        "aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none",
        // Background - using Apps SDK UI tokens
        "bg-input-background",
        // Border - using Apps SDK UI tokens
        "border-input",
        // Text - using Apps SDK UI tokens
        "text-foreground",
        // Focus styles - using Apps SDK UI tokens
        "focus-visible:border-ring focus-visible:ring-ring/50",
        "focus-visible:ring-[3px]",
        // Error state styling
        "aria-invalid:ring-status-error/20 dark:aria-invalid:ring-status-error/40",
        "aria-invalid:border-status-error",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <IconCheckCircle className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
