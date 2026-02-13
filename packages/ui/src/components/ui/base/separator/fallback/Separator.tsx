// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";
import { cn } from "../../../utils";

/**
 * Renders a visual separator line.
 *
 * Supports stateful props for loading, error, and disabled states.
 * Note: Separator is primarily visual; stateful props are provided for API consistency.
 *
 * @param props - Radix separator props and stateful options.
 * @returns A separator element.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & StatefulComponentProps) {
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
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        // Disabled state styling
        disabled && "opacity-50",
        // Error state styling
        error && "bg-status-error",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
