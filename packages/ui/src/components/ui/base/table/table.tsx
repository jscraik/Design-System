import * as React from "react";

import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Renders a responsive table container and table element.
 *
 * Supports stateful props for loading, error, and disabled states.
 *
 * Preserve semantic table structure (`thead`, `tbody`, `th`, `td`) for accessibility.
 *
 * @param props - Table props and stateful options.
 * @returns A table element wrapped in a scroll container.
 */
function Table({
  className,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: React.ComponentProps<"table"> & StatefulComponentProps) {
  // Determine effective state
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={disabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm",
          // Disabled state styling
          disabled && "opacity-50 pointer-events-none",
          // Error state styling
          error && "border-status-error",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/**
 * Renders a table header section.
 *
 * @param props - Thead props.
 * @returns A table header element.
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
}

/**
 * Renders a table body section.
 *
 * @param props - Tbody props.
 * @returns A table body element.
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

/**
 * Renders a table footer section.
 *
 * @param props - Tfoot props.
 * @returns A table footer element.
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  );
}

/**
 * Renders a table row element.
 *
 * @param props - Tr props.
 * @returns A table row element.
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a table header cell.
 *
 * @param props - Th props.
 * @returns A header cell element.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a table data cell.
 *
 * @param props - Td props.
 * @returns A table cell element.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a table caption element.
 *
 * @param props - Caption props.
 * @returns A table caption element.
 */
function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
