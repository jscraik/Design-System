import * as React from "react";
import { Button } from "../../base/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../base/table";
import { Spinner } from "../../feedback/Spinner";
import { cn } from "../../utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortDirection = "asc" | "desc" | null;

interface ColumnDef<TData> {
  /** Unique key for this column (must match a key in TData). */
  key: keyof TData & string;
  /** Column header label. */
  header: string;
  /** Whether the column is sortable. Defaults to false. */
  sortable?: boolean;
  /** Custom cell renderer. Receives the row value. */
  cell?: (value: TData[keyof TData], row: TData) => React.ReactNode;
  /** Column header className. */
  headerClassName?: string;
  /** Column cell className. */
  cellClassName?: string;
}

interface SortState {
  key: string;
  direction: SortDirection;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface DataTableProps<TData extends Record<string, unknown>> {
  /** Column definitions. */
  columns: ColumnDef<TData>[];
  /** Row data. */
  data: TData[];
  /** Unique row key accessor. Defaults to index. */
  rowKey?: keyof TData;
  /** Whether the table is loading. Shows a spinner overlay. */
  loading?: boolean;
  /** Empty state message or element. */
  emptyMessage?: React.ReactNode;
  /** Enable pagination. Defaults to false. */
  paginated?: boolean;
  /** Rows per page. Defaults to 10. */
  pageSize?: number;
  /** Controlled sort state. */
  sortState?: SortState;
  /** Callback when sort changes (for server-side sorting). */
  onSortChange?: (sort: SortState) => void;
  /** Controlled page. */
  page?: number;
  /** Total rows (for server-side pagination). */
  totalRows?: number;
  /** Callback when page changes. */
  onPageChange?: (page: number) => void;
  /** Table caption for accessibility. */
  caption?: string;
  /** Additional className for the wrapper. */
  className?: string;
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <span aria-hidden="true" className="ml-1 inline-block text-muted-foreground">
      {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
    </span>
  );
}

// ─── Client-side sort ─────────────────────────────────────────────────────────

function sortData<TData>(data: TData[], sort: SortState): TData[] {
  if (!sort.direction) return data;
  return [...data].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sort.key];
    const bVal = (b as Record<string, unknown>)[sort.key];
    const aStr = String(aVal ?? "");
    const bStr = String(bVal ?? "");
    const cmp = aStr.localeCompare(bStr, undefined, { numeric: true });
    return sort.direction === "asc" ? cmp : -cmp;
  });
}

// ─── DataTable ────────────────────────────────────────────────────────────────

/**
 * DataTable — sortable, paginated data table built on Table primitives.
 *
 * Supports both client-side sorting/pagination (default) and server-side
 * control via `onSortChange` / `onPageChange` callbacks.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<User>[] = [
 *   { key: "name", header: "Name", sortable: true },
 *   { key: "email", header: "Email" },
 *   { key: "role", header: "Role", cell: (v) => <Badge>{String(v)}</Badge> },
 * ];
 *
 * <DataTable columns={columns} data={users} paginated pageSize={20} caption="User list" />
 * ```
 */
function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "No results.",
  paginated = false,
  pageSize: pageSizeProp = 10,
  sortState: controlledSort,
  onSortChange,
  page: controlledPage,
  totalRows,
  onPageChange,
  caption,
  className,
}: DataTableProps<TData>) {
  // Uncontrolled sort/pagination state
  const [internalSort, setInternalSort] = React.useState<SortState>({
    key: "",
    direction: null,
  });
  const [internalPage, setInternalPage] = React.useState(1);

  const sort = controlledSort ?? internalSort;
  const page = controlledPage ?? internalPage;
  const isServerMode = Boolean(onSortChange ?? onPageChange);

  // Sort
  const sortedData = isServerMode ? data : sortData(data, sort);

  // Paginate
  const pageSize = pageSizeProp;
  const total = totalRows ?? sortedData.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const displayData =
    isServerMode || !paginated
      ? sortedData
      : sortedData.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(key: string) {
    const next: SortState =
      sort.key === key
        ? {
            key,
            direction: sort.direction === "asc" ? "desc" : sort.direction === "desc" ? null : "asc",
          }
        : { key, direction: "asc" };

    if (onSortChange) {
      onSortChange(next);
    } else {
      setInternalSort(next);
      setInternalPage(1);
    }
  }

  function handlePage(next: number) {
    if (onPageChange) {
      onPageChange(next);
    } else {
      setInternalPage(next);
    }
  }

  return (
    <div data-slot="data-table" className={cn("relative", className)}>
      {/* Loading overlay */}
      {loading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded bg-background/70"
          aria-live="polite"
        >
          <Spinner size="lg" label="Loading table data…" />
        </div>
      )}

      <Table aria-busy={loading || undefined} aria-label={caption}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(col.sortable && "cursor-pointer select-none", col.headerClassName)}
                aria-sort={
                  sort.key === col.key
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : col.sortable
                      ? "none"
                      : undefined
                }
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                {col.header}
                {col.sortable && (
                  <SortIcon direction={sort.key === col.key ? sort.direction : null} />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            displayData.map((row, i) => {
              const key = rowKey ? String(row[rowKey]) : String(i);
              return (
                <TableRow key={key}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.cellClassName}>
                      {col.cell ? col.cell(row[col.key], row) : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      {paginated && (
        <div
          data-slot="data-table-pagination"
          className="flex items-center justify-between gap-2 pt-3"
          aria-label="Table pagination"
        >
          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePage(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePage(page + 1)}
              disabled={page >= pageCount}
              aria-label="Next page"
            >
              →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };
export type { ColumnDef, DataTableProps, SortState, PaginationState };
