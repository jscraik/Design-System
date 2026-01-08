import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "./utils";

const indicatorVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      default: "text-foundation-text-dark-primary",
      primary: "text-foundation-accent-blue",
      success: "text-foundation-accent-green",
      warning: "text-foundation-accent-orange",
      error: "text-foundation-accent-red",
    },
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
      xl: "size-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface IndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof indicatorVariants> {
  label?: string;
}

const Indicator = React.forwardRef<HTMLDivElement, IndicatorProps>(
  ({ className, variant, size, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || "Loading"}
        className={cn("flex flex-col items-center gap-2", className)}
        {...props}
      >
        <Loader2
          className={cn(
            indicatorVariants({ variant, size }),
            "animate-spin"
          )}
        />
        {label && (
          <span className="text-sm text-foundation-text-dark-tertiary">
            {label}
          </span>
        )}
      </div>
    );
  }
);
Indicator.displayName = "Indicator";

// Inline variant for use within text
export interface InlineIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof indicatorVariants> {}

const InlineIndicator = React.forwardRef<HTMLSpanElement, InlineIndicatorProps>(
  ({ className, variant, size = "sm", ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn("inline-flex", className)}
        {...props}
      >
        <Loader2
          className={cn(
            indicatorVariants({ variant, size }),
            "animate-spin"
          )}
        />
      </span>
    );
  }
);
InlineIndicator.displayName = "InlineIndicator";

export { Indicator, InlineIndicator };
