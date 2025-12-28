import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils";

const alertVariants = cva(
  "relative w-full rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 px-4 py-3 font-foundation text-body-small grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "border-foundation-accent-red/50 bg-foundation-accent-red/10 [&>svg]:text-foundation-accent-red *:data-[slot=alert-description]:text-foundation-accent-red/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

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

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary col-start-2 grid justify-items-start gap-1 text-body-small [&_p]:leading-body",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
