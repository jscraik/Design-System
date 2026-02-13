import * as React from "react";

import { cn } from "../../utils";
import { Skeleton } from "../Skeleton";

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lineHeight?: "sm" | "md" | "lg";
}

const heightClasses = {
  sm: "h-3",
  md: "h-4",
  lg: "h-5",
} as const;

const gapClasses = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
} as const;

const buildWidths = (lines: number): string[] => {
  const widths: string[] = [];
  for (let index = 0; index < lines; index += 1) {
    const base = 100 - index * 6;
    const min = index === lines - 1 ? 70 : 85;
    widths.push(`${Math.max(min, base)}%`);
  }
  return widths;
};

function ShimmerText({ lines = 3, lineHeight = "md", className, ...props }: ShimmerTextProps) {
  const widths = React.useMemo(() => buildWidths(lines), [lines]);

  return (
    <div
      data-slot="shimmer-text"
      role="status"
      aria-label="Loading content"
      className={cn("flex flex-col", gapClasses[lineHeight], className)}
      {...props}
    >
      {widths.map((width, index) => (
        <Skeleton
          key={`${width}-${index}`}
          className={cn(heightClasses[lineHeight])}
          style={{ width }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export interface ShimmerInlineProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

function ShimmerInline({
  width = "100%",
  height = "1rem",
  className,
  ...props
}: ShimmerInlineProps) {
  const resolvedWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <Skeleton
      data-slot="shimmer-inline"
      role="status"
      aria-label="Loading"
      className={cn(className)}
      style={{ width: resolvedWidth, height: resolvedHeight }}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </Skeleton>
  );
}

export { ShimmerText, ShimmerInline };
