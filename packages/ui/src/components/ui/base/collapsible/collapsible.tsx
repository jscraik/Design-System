"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/**
 * Renders the collapsible root component (Radix Collapsible).
 *
 * Use `open`/`onOpenChange` for controlled state or `defaultOpen` for uncontrolled.
 *
 * @param props - Radix collapsible root props.
 * @returns The collapsible root element.
 */
function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
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
