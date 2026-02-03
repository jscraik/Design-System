// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "../../../utils";

/**
 * Props for the breadcrumb navigation.
 */
export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** Separator between items */
  separator?: React.ReactNode;
}

/**
 * Renders a navigation breadcrumb for hierarchy context.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current Page</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 *
 * @param props - Breadcrumb props.
 * @returns A breadcrumb navigation element.
 */
function Breadcrumb({ ...props }: BreadcrumbProps) {
  return <nav aria-label="Breadcrumb" data-slot="breadcrumb" {...props} />;
}

/**
 * Renders the breadcrumb list container.
 *
 * @param props - Ol props for the list.
 * @returns A breadcrumb list element.
 */
function BreadcrumbList({ className, ...props }: React.ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 font-foundation",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a breadcrumb item container.
 *
 * @param props - Li props for the item.
 * @returns A breadcrumb item element.
 */
function BreadcrumbItem({ className, ...props }: React.ComponentPropsWithoutRef<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

/**
 * Renders a breadcrumb link element.
 *
 * @param props - Anchor props and `asChild` option.
 * @returns A breadcrumb link element.
 */
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the current breadcrumb page label.
 *
 * @param props - Span props for the page label.
 * @returns A breadcrumb page element.
 */
function BreadcrumbPage({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}

/**
 * Renders the separator between breadcrumb items.
 *
 * @param props - Li props for the separator.
 * @returns A breadcrumb separator element.
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? (
        <svg
          className="size-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </li>
  );
}

/**
 * Renders a truncated breadcrumb ellipsis.
 *
 * @param props - Span props for the ellipsis.
 * @returns A breadcrumb ellipsis element.
 */
function BreadcrumbEllipsis({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>
      <span className="sr-only">More</span>
    </span>
  );
}

Breadcrumb.displayName = "Breadcrumb";
BreadcrumbList.displayName = "BreadcrumbList";
BreadcrumbItem.displayName = "BreadcrumbItem";
BreadcrumbLink.displayName = "BreadcrumbLink";
BreadcrumbPage.displayName = "BreadcrumbPage";
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
