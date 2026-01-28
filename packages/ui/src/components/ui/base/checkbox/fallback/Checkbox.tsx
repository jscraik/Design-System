// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { IconCheckmark } from "../../../../../icons";
import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Loading spinner component for checkbox loading state
 */
function CheckboxSpinner() {
  return (
    <svg
      className="animate-spin size-3.5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Renders a styled checkbox using Radix primitives with Apps SDK UI tokens.
 *
 * Supports stateful props for loading, error, disabled, and required states.
 *
 * Accessibility contract:
 * - Provide a visible label or `aria-label`/`aria-labelledby`.
 * - Supports keyboard toggling via Space/Enter per Radix behavior.
 * - Loading state shows spinner and disables checkbox.
 * - Error state applies error styling.
 *
 * @param props - Checkbox props including variant, size, and stateful options.
 * @param props.error - Error message, applies error styling when set.
 * @param props.loading - Shows loading spinner and disables checkbox (default: `false`).
 * @param props.disabled - Disabled state (also set automatically when loading).
 * @param props.required - Required state for visual indicator (default: `false`).
 * @param props.onStateChange - Callback when component state changes.
 * @returns A styled checkbox element.
 *
 * @example
 * ```tsx
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 * <Checkbox error="Must accept terms" required />
 * <Checkbox loading />
 * ```
 */
function Checkbox({
  className,
  loading = false,
  error,
  disabled = false,
  required = false,
  onStateChange,
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & StatefulComponentProps) {
  // Determine effective state (loading > error > disabled > indeterminate/checked > default)
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : checked === "indeterminate"
          ? "indeterminate"
          : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Checkbox is effectively disabled when loading or explicitly disabled
  const isDisabled = disabled || loading;

  // Render appropriate indicator based on state
  const indicator = loading ? <CheckboxSpinner /> : <IconCheckmark className="size-3.5" />;

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      disabled={isDisabled}
      required={required}
      checked={checked}
      className={cn(
        // Base styles with Apps SDK UI tokens
        "peer border size-4 shrink-0 rounded-[4px] shadow-xs transition-shadow outline-none",
        // Background colors - using Apps SDK UI tokens
        "bg-input-background dark:bg-input/30",
        // Checked state - using Apps SDK UI tokens
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        // Focus styles - using Apps SDK UI tokens
        "focus-visible:border-ring focus-visible:ring-ring/50",
        "focus-visible:ring-[3px]",
        // Error state styling
        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
        // Loading state styling
        loading && "opacity-70 cursor-wait",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Custom className
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        {indicator}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
