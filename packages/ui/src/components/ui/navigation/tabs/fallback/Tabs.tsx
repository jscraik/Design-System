// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Tabs root container for grouping triggers and content.
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * Accessibility contract:
 * - Ensure each `TabsTrigger` has a readable label.
 *
 * @param props - Radix Tabs root props and stateful options.
 * @returns The Tabs root element.
 */
function Tabs({
  className,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & StatefulComponentProps) {
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

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      className={cn(
        "flex flex-col gap-2 font-foundation",
        disabled && "opacity-50 pointer-events-none",
        error && "ring-2 ring-status-error/50 rounded-md",
        className,
      )}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      {...props}
    />
  );
}

/**
 * Container for tab triggers.
 *
 * @param props - Radix Tabs list props.
 * @returns The Tabs list element.
 */
function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-secondary text-text-secondary inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Tab trigger button.
 *
 * @param props - Radix Tabs trigger props.
 * @returns A tab trigger element.
 */
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-card data-[state=active]:text-foreground focus-visible:border-interactive focus-visible:ring-2 focus-visible:ring-ring text-text-secondary inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-body-small font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Tab content panel.
 *
 * @param props - Radix Tabs content props.
 * @returns A tab content element.
 */
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
