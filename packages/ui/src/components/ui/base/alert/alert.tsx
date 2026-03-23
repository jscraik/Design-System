import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../utils";

/**
 * Defines base class names and variant mappings for alerts.
 */
const alertVariants = cva("relative w-full rounded-lg border p-4", {
  variants: {
    variant: {
      default: "bg-secondary text-foreground border-border",
      destructive: "border-status-error/50 text-status-error [&>svg]:text-status-error",
      warning: "border-status-warning/50 text-status-warning [&>svg]:text-status-warning",
      success: "border-status-success/50 text-status-success [&>svg]:text-status-success",
      info: "border-status-info/50 text-status-info [&>svg]:text-status-info",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

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
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

/**
 * Renders an alert title element.
 *
 * @param props - Heading props for the title.
 * @returns An alert title element.
 */
function AlertTitle({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight line-clamp-1", className)}
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
function AlertDescription({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
