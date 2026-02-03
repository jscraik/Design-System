// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "../../../utils";
import { toggleVariants } from "../../Toggle/Toggle";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});
ToggleGroupContext.displayName = "ToggleGroupContext";

/**
 * Renders a group of toggle items with Apps SDK UI tokens.
 *
 * Supports stateful props for loading, error, disabled, and required states.
 *
 * @param props - Radix toggle group props plus variant sizing and stateful options.
 * @param props.error - Error message, applies error styling when set.
 * @param props.loading - Shows loading state and disables all items (default: `false`).
 * @param props.disabled - Disabled state (also set automatically when loading).
 * @param props.required - Required field indicator (default: `false`).
 * @param props.onStateChange - Callback when component state changes.
 * @returns A toggle group element.
 *
 * @example
 * ```tsx
 * <ToggleGroup type="single">
 *   <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
 *   <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
 * </ToggleGroup>
 * <ToggleGroup error="Invalid selection" />
 * ```
 */
function ToggleGroup({
  className,
  variant,
  size,
  children,
  loading = false,
  error,
  disabled = false,
  required = false,
  onStateChange,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> &
  StatefulComponentProps) {
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

  // ToggleGroup is effectively disabled when loading or explicitly disabled
  const isDisabled = disabled || loading;

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        // Error state styling
        error && "border-status-error/50 border",
        // Loading state styling
        loading && "opacity-70",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

/**
 * Renders a toggle group item.
 *
 * @param props - Radix toggle group item props plus variant sizing.
 * @returns A toggle group item element.
 */
function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
