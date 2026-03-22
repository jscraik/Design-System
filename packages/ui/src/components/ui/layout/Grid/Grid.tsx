import type * as React from "react";

import { cn } from "../../utils";

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GridRows = 1 | 2 | 3 | 4 | 5 | 6;
type GapValue = "0" | "px" | "0.5" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16";

const colsMap: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const rowsMap: Record<GridRows, string> = {
  1: "grid-rows-1",
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
};

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
};

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (1–12). */
  cols?: GridCols;
  /** Number of rows (1–6). Omit to allow auto rows. */
  rows?: GridRows;
  /** Gap between cells. Defaults to "4". */
  gap?: GapValue;
  /** Column gap (overrides gap for columns). */
  colGap?: GapValue;
  /** Row gap (overrides gap for rows). */
  rowGap?: GapValue;
  /** Render as a different element. Defaults to "div". */
  as?: React.ElementType;
}

/**
 * Grid — CSS grid layout primitive.
 *
 * @example
 * ```tsx
 * <Grid cols={3} gap="4">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 * ```
 */
function Grid({
  cols = 1,
  rows,
  gap = "4",
  colGap,
  rowGap,
  as: Component = "div",
  className,
  children,
  ...props
}: GridProps) {
  return (
    <Component
      data-slot="grid"
      className={cn(
        "grid",
        colsMap[cols],
        rows && rowsMap[rows],
        !colGap && !rowGap && gapMap[gap],
        colGap && `gap-x-${colGap}`,
        rowGap && `gap-y-${rowGap}`,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * GridItem — places a child within a Grid with optional span control.
 */
interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span (1–12). */
  colSpan?: GridCols;
  /** Row span (1–6). */
  rowSpan?: GridRows;
}

const colSpanMap: Record<GridCols, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const rowSpanMap: Record<GridRows, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
};

function GridItem({ colSpan, rowSpan, className, children, ...props }: GridItemProps) {
  return (
    <div
      data-slot="grid-item"
      className={cn(colSpan && colSpanMap[colSpan], rowSpan && rowSpanMap[rowSpan], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Grid, GridItem };
export type { GridProps, GridItemProps, GridCols, GridRows };
