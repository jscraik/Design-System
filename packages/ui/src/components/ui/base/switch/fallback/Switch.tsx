// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Loading spinner component for switch loading state
 */
function SwitchSpinner() {
  return (
    <svg
      className="animate-spin size-2"
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
 * Renders a styled switch using Radix primitives with Apps SDK UI tokens.
 *
 * Supports stateful props for loading, error, disabled, and required states.
 *
 * Accessibility contract:
 * - Provide a visible label or `aria-label`/`aria-labelledby`.
 * - Supports keyboard toggling via Space/Enter per Radix behavior.
 * - Loading state shows spinner and disables switch.
 * - Error state applies error styling.
 *
 * @param props - Switch props including variant, size, and stateful options.
 * @param props.error - Error message, applies error styling when set.
 * @param props.loading - Shows loading spinner and disables switch (default: `false`).
 * @param props.disabled - Disabled state (also set automatically when loading).
 * @param props.required - Required state for visual indicator (default: `false`).
 * @param props.onStateChange - Callback when component state changes.
 * @returns A styled switch element.
 *
 * @example
 * ```tsx
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 * <Switch error="Must enable notifications" required />
 * <Switch loading />
 * ```
 */
function Switch({
  className,
  loading = false,
  error,
  disabled = false,
  required = false,
  onStateChange,
  checked,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & StatefulComponentProps) {
  // Determine effective state
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : checked
          ? "checked"
          : "unchecked";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Switch is effectively disabled when loading or explicitly disabled
  const isDisabled = disabled || loading;

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      disabled={isDisabled}
      required={required ? true : undefined}
      checked={checked}
      className={cn(
        // Base layout
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none",
        // Base background - using Apps SDK UI tokens
        "data-[state=unchecked]:bg-input-background",
        // Checked background - using Apps SDK UI accent color
        "data-[state=checked]:bg-primary",
        // Focus styles - using Apps SDK UI tokens
        "focus-visible:ring-2 focus-visible:ring-ring",
        // Error state styling
        error && "border-status-error focus:border-status-error focus:ring-status-error",
        // Loading state styling
        loading && "opacity-70 cursor-wait",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Custom className
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Base thumb styles
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          // Thumb background - using Apps SDK UI tokens
          "bg-background",
          // Thumb translation
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          // Error state for thumb
          error && "data-[state=checked]:bg-status-error",
        )}
      >
        {/* Show loading spinner in thumb when loading */}
        {loading && <SwitchSpinner />}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
