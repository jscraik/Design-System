import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

/**
 * Defines the base class names and variant mappings for the Button component.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-round font-foundation text-button-label font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background aria-invalid:ring-2 aria-invalid:ring-foundation-accent-red aria-invalid:ring-offset-2 aria-invalid:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-text-inverted hover:bg-foreground/90",
        destructive:
          "bg-foundation-accent-red text-text-inverted hover:bg-foundation-accent-red/90 focus-visible:ring-foundation-accent-red/50",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-secondary/60 focus-visible:ring-foundation-accent-blue/50",
        secondary:
          "bg-muted text-foreground hover:bg-secondary/70",
        ghost:
          "bg-transparent text-foreground hover:bg-secondary/60 hover:text-foreground",
        link: "text-foundation-text-dark-primary underline decoration-foundation-accent-blue underline-offset-4 hover:decoration-foundation-accent-blue/70",
      },
      size: {
        default: "h-[var(--foundation-size-control-height)] px-4 py-2 has-[>svg]:px-3",
        sm: "h-[var(--foundation-size-control-height)] gap-1.5 px-3 has-[>svg]:px-2.5 text-button-label-small",
        lg: "h-[var(--foundation-size-control-height)] px-6 has-[>svg]:px-4 text-button-label",
        icon: "size-[var(--foundation-size-control-height)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Renders a styled button with size and visual variants.
 *
 * Accessibility contract:
 * - Uses native `button` semantics by default.
 * - When `asChild` is true, ensure the child element provides button semantics.
 *
 * @param props - Button props including variant and size options.
 * @param props.variant - Visual style for the button.
 * @param props.size - Size variant for the button.
 * @param props.asChild - Renders the child element via Radix Slot (default: `false`).
 * @returns A styled button element.
 *
 * @example
 * ```tsx
 * <Button variant="secondary" size="sm">Cancel</Button>
 * ```
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
