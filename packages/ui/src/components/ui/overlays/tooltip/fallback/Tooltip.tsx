// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Provides a tooltip provider for shared configuration.
 *
 * @param props - Radix tooltip provider props.
 * @returns The tooltip provider element.
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

/**
 * Renders the tooltip root component.
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * @param props - Radix tooltip root props and stateful options.
 * @returns The tooltip root element.
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger>Info</TooltipTrigger>
 *   <TooltipContent>Helpful text</TooltipContent>
 * </Tooltip>
 * ```
 */
function Tooltip({
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & StatefulComponentProps) {
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
    <TooltipProvider>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        data-state={effectiveState}
        data-error={error ? "true" : undefined}
        data-required={required ? "true" : undefined}
        aria-disabled={isDisabled || undefined}
        aria-invalid={error ? "true" : required ? "false" : undefined}
        aria-required={required || undefined}
        aria-busy={loading || undefined}
        {...props}
      />
    </TooltipProvider>
  );
}

/**
 * Renders the tooltip trigger element.
 *
 * @param props - Radix tooltip trigger props.
 * @returns The tooltip trigger element.
 */
function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Renders the tooltip content container.
 *
 * @param props - Radix tooltip content props.
 * @returns The tooltip content element rendered in a portal.
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md border border-border px-3 py-1.5 text-caption text-balance font-foundation shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-popover fill-popover border-border z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
