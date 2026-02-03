// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Renders an avatar root container.
 *
 * Supports stateful props for loading, error, disabled, and required states.
 * Loading state shows a spinner placeholder, error state applies error styling.
 *
 * @param props - Radix avatar root props and stateful options.
 * @returns An avatar root element.
 */
function Avatar({
  className,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & StatefulComponentProps) {
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

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        // Disabled state styling
        disabled && "opacity-50 pointer-events-none",
        // Error state styling
        error && "ring-2 ring-status-error",
        className,
      )}
      aria-disabled={disabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      {...props}
    />
  );
}

/**
 * Renders the avatar image.
 *
 * @param props - Radix avatar image props.
 * @returns An avatar image element.
 *
 * @example
 * ```tsx
 * <AvatarImage src={url} alt="Profile photo" />
 * ```
 */
function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

/**
 * Renders the avatar fallback content.
 *
 * @param props - Radix avatar fallback props.
 * @returns An avatar fallback element.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
