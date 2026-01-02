import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

/**
 * Defines base class names and variant mappings for alerts.
 */
const alertVariants = cva(
  "relative w-full rounded-lg border border-foundation-bg-dark-3 px-4 py-3 font-foundation text-body-small grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current bg-foundation-bg-dark-1 text-foundation-text-dark-primary",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "border-foundation-accent-red/50 bg-foundation-accent-red/10 [&>svg]:text-foundation-accent-red",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Renders an alert container with variant styles.
 *
 * Accessibility contract:
 * - Uses `role="alert"` for assistive technologies.
 *
 * @param props - Alert props including variant.
 * @returns An alert element.
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

/**
 * Renders an alert title element.
 *
 * @param props - Div props for the title.
 * @returns An alert title element.
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight text-body-small-emphasis",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders an alert description element.
 *
 * @param props - Div props for the description.
 * @returns An alert description element.
 */
function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-foundation-text-dark-tertiary col-start-2 grid justify-items-start gap-1 text-body-small [&_p]:leading-body",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
