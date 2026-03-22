import type * as React from "react";

import { cn } from "../../utils";

type GapValue =
  | "0"
  | "px"
  | "0.5"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20"
  | "24";

const gapMap: Record<GapValue, string> = {
  "0": "gap-0",
  px: "gap-px",
  "0.5": "gap-0.5",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
  "16": "gap-16",
  "20": "gap-20",
  "24": "gap-24",
};

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex direction. Defaults to "column". */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  /** Gap between children using Tailwind gap scale. Defaults to "4". */
  gap?: GapValue;
  /** Align items. */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justify content. */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Whether to wrap children. */
  wrap?: boolean;
  /** Render as a different element. Defaults to "div". */
  as?: React.ElementType;
}

const alignMap: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const directionMap: Record<NonNullable<StackProps["direction"]>, string> = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

/**
 * Stack — flex layout primitive for spacing children along an axis.
 *
 * @example
 * ```tsx
 * <Stack gap="3" align="center">
 *   <Label>Name</Label>
 *   <Input />
 * </Stack>
 *
 * <Stack direction="row" gap="2" justify="between">
 *   <span>Left</span>
 *   <span>Right</span>
 * </Stack>
 * ```
 */
function Stack({
  direction = "column",
  gap = "4",
  align,
  justify,
  wrap = false,
  as: Component = "div",
  className,
  children,
  ...props
}: StackProps) {
  return (
    <Component
      data-slot="stack"
      className={cn(
        "flex",
        directionMap[direction],
        gapMap[gap],
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export { Stack };
export type { StackProps, GapValue };
