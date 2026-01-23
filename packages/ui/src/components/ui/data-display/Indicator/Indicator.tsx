import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

const indicatorVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "text-accent",
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

function Indicator({ className, variant, size, label, ...props }: IndicatorProps) {
  return (
    <div
      data-slot="indicator"
      role="status"
      aria-label={label || "Loading"}
      className={cn("flex flex-col items-center gap-2", className)}
      {...props}
    >
      <span
        className={cn(
          indicatorVariants({ variant, size }),
          "inline-flex items-center justify-center",
        )}
      >
        <span
          className={cn(
            "inline-block rounded-full border-2 border-current border-t-transparent animate-spin",
            "size-full",
          )}
        />
      </span>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

export interface InlineIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof indicatorVariants> {}

function InlineIndicator({ className, variant, size = "sm", ...props }: InlineIndicatorProps) {
  return (
    <span
      data-slot="inline-indicator"
      role="status"
      aria-label="Loading"
      className={cn("inline-flex", className)}
      {...props}
    >
      <span
        className={cn(
          indicatorVariants({ variant, size }),
          "inline-flex items-center justify-center",
        )}
      >
        <span className="inline-block size-full rounded-full border-2 border-current border-t-transparent animate-spin" />
      </span>
    </span>
  );
}

export { Indicator, InlineIndicator };
