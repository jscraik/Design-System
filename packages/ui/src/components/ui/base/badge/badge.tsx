import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

/**
 * Defines base class names and variant mappings for badges.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-foundation text-caption font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-foundation-accent-blue focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50 aria-invalid:ring-2 aria-invalid:ring-foundation-accent-red aria-invalid:border-foundation-accent-red transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-foundation-accent-blue text-foundation-text-light-primary [a&]:hover:bg-foundation-accent-blue/90",
        secondary:
          "border-transparent bg-foundation-bg-light-2 text-foundation-text-light-primary [a&]:hover:bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-2 dark:text-foundation-text-dark-primary dark:[a&]:hover:bg-foundation-bg-dark-3",
        destructive:
          "border-transparent bg-foundation-accent-red text-foundation-text-light-primary [a&]:hover:bg-foundation-accent-red/90 focus-visible:ring-foundation-accent-red/50",
        outline:
          "border-foundation-bg-light-3 bg-transparent text-foundation-text-light-primary [a&]:hover:bg-foundation-bg-light-3 dark:border-foundation-bg-dark-3 dark:text-foundation-text-dark-primary dark:[a&]:hover:bg-foundation-bg-dark-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Renders a badge element with visual variants.
 *
 * @param props - Badge props including variant and `asChild`.
 * @returns A badge element.
 *
 * @example
 * ```tsx
 * <Badge variant="secondary">Beta</Badge>
 * ```
 */
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
