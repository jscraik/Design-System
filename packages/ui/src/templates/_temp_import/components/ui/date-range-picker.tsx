import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  formatStr?: string;
  minDate?: Date;
  maxDate?: Date;
  numberOfMonths?: number;
}

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      dateRange,
      onDateRangeChange,
      placeholder = "Pick a date range",
      disabled = false,
      className,
      formatStr = "LLL dd, y",
      minDate,
      maxDate,
      numberOfMonths = 2,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSelect = (range: DateRange | undefined) => {
      onDateRangeChange?.(range);
      // Close popover when both dates are selected
      if (range?.from && range?.to) {
        setIsOpen(false);
      }
    };

    return (
      <div className={cn("grid gap-2", className)}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              disabled={disabled}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-foundation-text-dark-tertiary"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, formatStr)} -{" "}
                    {format(dateRange.to, formatStr)}
                  </>
                ) : (
                  format(dateRange.from, formatStr)
                )
              ) : (
                placeholder
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleSelect}
              numberOfMonths={numberOfMonths}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

// Preset options component
export interface DateRangePreset {
  label: string;
  range: DateRange;
}

export interface DateRangePickerWithPresetsProps extends DateRangePickerProps {
  presets?: DateRangePreset[];
}

const DateRangePickerWithPresets = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerWithPresetsProps
>(({ presets, onDateRangeChange, dateRange, ...props }, ref) => {
  const defaultPresets: DateRangePreset[] = [
    {
      label: "Today",
      range: { from: new Date(), to: new Date() },
    },
    {
      label: "Last 7 days",
      range: { from: addDays(new Date(), -7), to: new Date() },
    },
    {
      label: "Last 30 days",
      range: { from: addDays(new Date(), -30), to: new Date() },
    },
    {
      label: "Last 90 days",
      range: { from: addDays(new Date(), -90), to: new Date() },
    },
  ];

  const activePresets = presets || defaultPresets;

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <DateRangePicker
        ref={ref}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        {...props}
      />
      {activePresets && activePresets.length > 0 && (
        <div className="flex gap-2">
          {activePresets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => onDateRangeChange?.(preset.range)}
              className="text-sm"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
});
DateRangePickerWithPresets.displayName = "DateRangePickerWithPresets";

export { DateRangePicker, DateRangePickerWithPresets };
