"use client";

import * as React from "react";
import { useMemo } from "react";

import { Button } from "../../base/Button";
import { Calendar } from "../../base/Calendar";
import { cn } from "../../utils";

/**
 * Props for the date picker component.
 */
export interface DatePickerProps {
  /** Selected date */
  value?: Date;
  /** Callback when date changes */
  onValueChange?: (date: Date | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Additional className */
  className?: string;
  /** Date format function */
  formatDate?: (date: Date) => string;
}

const defaultFormatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Renders a date selection component with a calendar popup.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   value={date}
 *   onValueChange={setDate}
 *   placeholder="Pick a date"
 * />
 * ```
 *
 * @param props - Date picker props.
 * @returns A date picker element.
 */
function DatePicker({
  value,
  onValueChange,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
  className,
  formatDate = defaultFormatDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  const handleSelect = (date: Date | undefined) => {
    onValueChange?.(date);
    setOpen(false);
  };

  const isDateDisabled: ((date: Date) => boolean) | undefined = useMemo(() => {
    if (!minDate && !maxDate) return undefined;
    return (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };
  }, [minDate, maxDate]);

  return (
    <div
      ref={containerRef}
      data-slot="date-picker"
      className={cn("relative w-full font-foundation", className)}
    >
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg
          className="mr-2 size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {value ? formatDate(value) : placeholder}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose date"
          data-slot="date-picker-content"
          className="absolute z-50 mt-1 rounded-md border border-border bg-popover p-3 shadow-lg"
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            initialFocus
          />
          {value && (
            <div className="mt-2 flex justify-end border-t border-border pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onValueChange?.(undefined);
                  setOpen(false);
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Props for the date range picker component.
 */
export interface DateRangePickerProps {
  /** Start date */
  startDate?: Date;
  /** End date */
  endDate?: Date;
  /** Callback when range changes */
  onRangeChange?: (start: Date | undefined, end: Date | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Date format function */
  formatDate?: (date: Date) => string;
}

/**
 * Renders a date range selection component.
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   startDate={startDate}
 *   endDate={endDate}
 *   onRangeChange={(start, end) => {
 *     setStartDate(start);
 *     setEndDate(end);
 *   }}
 * />
 * ```
 *
 * @param props - Date range picker props.
 * @returns A date range picker element.
 */
function DateRangePicker({
  startDate,
  endDate,
  onRangeChange,
  placeholder = "Pick a date range",
  disabled = false,
  className,
  formatDate = defaultFormatDate,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selecting, setSelecting] = React.useState<"start" | "end">("start");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    if (selecting === "start") {
      onRangeChange?.(date, endDate && date <= endDate ? endDate : undefined);
      setSelecting("end");
    } else {
      if (startDate && date >= startDate) {
        onRangeChange?.(startDate, date);
        setOpen(false);
        setSelecting("start");
      } else {
        // If end date is before start, treat as new start
        onRangeChange?.(date, undefined);
        setSelecting("end");
      }
    }
  };

  const displayValue = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    if (startDate) {
      return `${formatDate(startDate)} - ...`;
    }
    return placeholder;
  };

  return (
    <div
      ref={containerRef}
      data-slot="date-range-picker"
      className={cn("relative w-full font-foundation", className)}
    >
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full justify-start text-left font-normal",
          !startDate && "text-muted-foreground",
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg
          className="mr-2 size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {displayValue()}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose date range"
          data-slot="date-range-picker-content"
          className="absolute z-50 mt-1 rounded-md border border-border bg-popover p-3 shadow-lg"
        >
          <div className="mb-2 text-sm text-muted-foreground">
            {selecting === "start" ? "Select start date" : "Select end date"}
          </div>
          <Calendar
            mode="single"
            selected={selecting === "start" ? startDate : endDate}
            onSelect={handleSelect}
            initialFocus
          />
          {(startDate || endDate) && (
            <div className="mt-2 flex justify-end border-t border-border pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onRangeChange?.(undefined, undefined);
                  setSelecting("start");
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

DatePicker.displayName = "DatePicker";
DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker };
