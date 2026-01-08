import * as React from "react";

import { cn } from "./utils";

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lineHeight?: "sm" | "md" | "lg";
}

const ShimmerText = React.forwardRef<HTMLDivElement, ShimmerTextProps>(
  ({ lines = 3, lineHeight = "md", className, ...props }, ref) => {
    const heights = {
      sm: "h-3",
      md: "h-4",
      lg: "h-5",
    };

    const gaps = {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    };

    // Generate random widths for a more natural look
    const widths = React.useMemo(
      () =>
        Array.from({ length: lines }, (_, i) => {
          // Last line is usually shorter
          if (i === lines - 1) {
            return `${60 + Math.random() * 20}%`;
          }
          return `${85 + Math.random() * 15}%`;
        }),
      [lines]
    );

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading content"
        className={cn("flex flex-col", gaps[lineHeight], className)}
        {...props}
      >
        {widths.map((width, index) => (
          <div
            key={index}
            className={cn(
              heights[lineHeight],
              "rounded-md bg-gradient-to-r from-foundation-bg-dark-3/60 via-foundation-text-dark-primary/20 to-foundation-bg-dark-3/60 bg-[length:200%_100%] animate-shimmer"
            )}
            style={{
              width,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
ShimmerText.displayName = "ShimmerText";

// Inline variant for single line shimmer
export interface ShimmerInlineProps
  extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

const ShimmerInline = React.forwardRef<HTMLDivElement, ShimmerInlineProps>(
  ({ width = "100%", height = "1rem", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(
          "rounded-md bg-gradient-to-r from-foundation-bg-dark-3/60 via-foundation-text-dark-primary/20 to-foundation-bg-dark-3/60 bg-[length:200%_100%] animate-shimmer",
          className
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
        }}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
ShimmerInline.displayName = "ShimmerInline";

export { ShimmerText, ShimmerInline };