"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../utils";

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
 * @param props - Radix tooltip root props.
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
function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
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
          "bg-foundation-bg-dark-3 text-foundation-text-dark-primary animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md border border-foundation-bg-dark-3 px-3 py-1.5 text-caption text-balance font-foundation shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foundation-bg-dark-3 fill-foundation-bg-light-3 dark:fill-foundation-bg-dark-3 border-foundation-bg-dark-3 z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
