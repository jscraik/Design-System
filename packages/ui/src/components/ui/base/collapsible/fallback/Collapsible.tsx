// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as React from "react";

/**
 * Renders the collapsible root component (Radix Collapsible).
 *
 * Supports stateful props for loading, error, and disabled states.
 * Note: Radix Collapsible manages its own open/closed state via `open`/`onOpenChange` props.
 *
 * Use `open`/`onOpenChange` for controlled state or `defaultOpen` for uncontrolled.
 *
 * @param props - Radix collapsible root props and stateful options.
 * @returns The collapsible root element.
 */
function Collapsible({
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root> & StatefulComponentProps) {
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
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={disabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      {...props}
    />
  );
}

/**
 * Renders the collapsible trigger element.
 *
 * Ensure the trigger has an accessible label or visible text.
 *
 * @param props - Radix collapsible trigger props.
 * @returns The collapsible trigger element.
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

/**
 * Renders the collapsible content element.
 *
 * @param props - Radix collapsible content props.
 * @returns The collapsible content element.
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
