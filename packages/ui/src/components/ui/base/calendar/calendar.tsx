import * as React from "react";
import { DayPicker } from "react-day-picker";

import { IconChevronLeftMd, IconChevronRightMd } from "../../../../icons";
import { cn } from "../../utils";
import { buttonVariants } from "../Button";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Props for the Calendar component.
 */
export interface CalendarProps extends Omit<StatefulComponentProps, "disabled"> {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  disabled?: boolean | ((date: Date) => boolean);
  required?: boolean;
  id?: string;
  // Allow any other DayPicker props - use any to work around react-day-picker v9 complex types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Error message display for calendar.
 */
function CalendarError({ message, id }: { message: string; id?: string }) {
  return (
    <span id={id} className="text-status-error text-body-small mt-1 flex items-center gap-1">
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </span>
  );
}

/**
 * Calendar container wrapper that includes the calendar and optional error message.
 */
function CalendarWrapper({
  children,
  error,
  required,
  errorId,
}: {
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  errorId?: string;
}) {
  return (
    <div className="flex flex-col">
      {children}
      {error && <CalendarError message={error} id={errorId} />}
      {required && !error && (
        <span className="text-status-error text-body-small mt-1" aria-hidden="true">
          * Required
        </span>
      )}
    </div>
  );
}

/**
 * Renders a calendar component using `react-day-picker` with stateful props support.
 *
 * Supports error, loading, disabled, and required states.
 *
 * Defaults to showing outside days unless `showOutsideDays` is overridden.
 * Pass `mode="single" | "multiple" | "range"` to control selection behavior.
 *
 * Accessibility contract:
 * - Provide a visible label or `aria-label`/`aria-labelledby`.
 * - Error state is announced via aria-invalid and aria-describedby.
 * - Required field shows visual indicator.
 *
 * @param props - DayPicker props plus stateful options.
 * @param props.error - Error message, applies error styling and shows error text.
 * @param props.loading - Shows loading state (opacity reduced, pointer events none).
 * @param props.disabled - Disabled state (pointer events none, opacity reduced).
 * @param props.required - Required field indicator (default: `false`).
 * @param props.onStateChange - Callback when component state changes.
 * @returns A calendar element with optional error message.
 *
 * @example
 * ```tsx
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * <Calendar mode="single" error="Date is unavailable" />
 * <Calendar loading />
 * <Calendar required />
 * ```
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  error,
  loading = false,
  disabled: disabledProp = false,
  required = false,
  onStateChange,
  id,
  ...props
}: CalendarProps) {
  // Generate a unique ID for the error message using React's useId
  const generatedCalendarId = React.useId();
  const calendarId = id || generatedCalendarId;
  const errorId = `${calendarId}-error`;

  // Determine effective state
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabledProp
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Convert boolean disabled to Matcher for DayPicker
  const disabledMatcher =
    typeof disabledProp === "boolean" && disabledProp ? () => true : disabledProp;

  const calendarElement = (
    <DayPicker
      id={calendarId}
      showOutsideDays={showOutsideDays}
      disabled={disabledMatcher}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? errorId : undefined}
      aria-required={required ? "true" : undefined}
      className={cn(
        "p-3",
        loading && "opacity-70 cursor-wait pointer-events-none",
        error && "ring-2 ring-status-error/50",
        className,
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-caption",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) =>
          orientation === "right" ? (
            <IconChevronRightMd className={cn("size-4", className)} {...props} />
          ) : (
            <IconChevronLeftMd className={cn("size-4", className)} {...props} />
          ),
      }}
      {...(props as React.ComponentProps<typeof DayPicker>)}
    />
  );

  // If error or required, wrap with container for error message/indicator
  if (error || required) {
    return (
      <CalendarWrapper error={error} required={required} errorId={errorId}>
        <div
          data-slot="calendar"
          data-state={effectiveState}
          data-error={error ? "true" : undefined}
          data-required={required ? "true" : undefined}
        >
          {calendarElement}
        </div>
      </CalendarWrapper>
    );
  }

  return (
    <div
      data-slot="calendar"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
    >
      {calendarElement}
    </div>
  );
}

export { Calendar, CalendarWrapper, CalendarError };
