"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../utils";

/**
 * Tabs root container for grouping triggers and content.
 *
 * Accessibility contract:
 * - Ensure each `TabsTrigger` has a readable label.
 *
 * @param props - Radix Tabs root props.
 * @returns The Tabs root element.
 */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2 font-foundation", className)}
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
        "bg-foundation-bg-dark-2 text-foundation-text-dark-secondary inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
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
        "data-[state=active]:bg-foundation-bg-light-1 dark:data-[state=active]:bg-foundation-bg-dark-1 data-[state=active]:text-foundation-text-light-primary dark:data-[state=active]:text-foundation-text-dark-primary focus-visible:border-foundation-accent-blue focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50 text-foundation-text-dark-secondary inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-body-small font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
