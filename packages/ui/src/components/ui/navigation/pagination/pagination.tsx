"use client";

import * as React from "react";

import { Button } from "../../base/Button";
import { cn } from "../../utils";

/**
 * Props for the pagination component.
 */
export interface PaginationProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show */
  siblingCount?: number;
  /** Show first/last buttons */
  showFirstLast?: boolean;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
}

/**
 * Renders pagination controls for paginated content.
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 * ```
 *
 * @param props - Pagination props.
 * @returns A pagination navigation element.
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  className,
  ...props
}: PaginationProps) {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "dots", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "dots", ...middleRange, "dots", lastPageIndex];
    }

    return range(1, totalPages);
  }, [totalPages, siblingCount, currentPage]);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center font-foundation", className)}
      {...props}
    >
      <ul className="flex flex-row items-center gap-1">
        {showFirstLast && (
          <li>
            <PaginationButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              aria-label="Go to first page"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </PaginationButton>
          </li>
        )}

        {showPrevNext && (
          <li>
            <PaginationButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </PaginationButton>
          </li>
        )}

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "dots") {
            return (
              <li key={`dots-${index}`}>
                <PaginationEllipsis />
              </li>
            );
          }

          return (
            <li key={pageNumber}>
              <PaginationButton
                onClick={() => onPageChange(pageNumber as number)}
                isActive={currentPage === pageNumber}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </PaginationButton>
            </li>
          );
        })}

        {showPrevNext && (
          <li>
            <PaginationButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </PaginationButton>
          </li>
        )}

        {showFirstLast && (
          <li>
            <PaginationButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Go to last page"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </PaginationButton>
          </li>
        )}
      </ul>
    </nav>
  );
}

interface PaginationButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant" | "size"> {
  isActive?: boolean;
}

/**
 * Renders an individual pagination button.
 *
 * @param props - Button props plus active state.
 * @returns A pagination button element.
 */
function PaginationButton({ isActive, className, ...props }: PaginationButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="icon"
      className={cn(
        "size-9",
        isActive &&
          "bg-foundation-accent-blue text-foundation-text-light-primary hover:bg-foundation-accent-blue/90 pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the pagination ellipsis element.
 *
 * @param props - Span props for the ellipsis.
 * @returns A pagination ellipsis element.
 */
function PaginationEllipsis({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center text-foundation-text-dark-tertiary",
        className,
      )}
      {...props}
    >
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>
      <span className="sr-only">More pages</span>
    </span>
  );
}

Pagination.displayName = "Pagination";
PaginationButton.displayName = "PaginationButton";
PaginationEllipsis.displayName = "PaginationEllipsis";

export { Pagination, PaginationButton, PaginationEllipsis };
