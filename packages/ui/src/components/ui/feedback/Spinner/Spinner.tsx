import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../utils";

const spinnerVariants = cva("animate-spin motion-reduce:animate-none", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
      xl: "size-10",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-interactive",
      inverted: "text-text-inverted",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label announced to screen readers. */
  label?: string;
}

/**
 * Spinner — indeterminate loading indicator.
 *
 * Includes `role="status"` and `aria-label` for screen-reader accessibility,
 * and `motion-reduce:animate-none` to respect user motion preferences.
 *
 * @example
 * ```tsx
 * <Spinner size="sm" label="Loading results…" />
 * ```
 */
function Spinner({ size, variant, label = "Loading…", className, ...props }: SpinnerProps) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { Spinner, spinnerVariants };
export type { SpinnerProps };
