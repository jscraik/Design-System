import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "./utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectControlProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
}

const SelectControl = React.forwardRef<HTMLButtonElement, SelectControlProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      disabled = false,
      className,
      searchable = true,
      clearable = false,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (currentValue: string) => {
      const newValue = currentValue === value ? "" : currentValue;
      onValueChange?.(newValue);
      setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.("");
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-foundation-text-dark-tertiary",
              className
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedOption?.icon && (
                <span className="inline-flex shrink-0">
                  {selectedOption.icon}
                </span>
              )}
              <span className="truncate">
                {selectedOption?.label || placeholder}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {clearable && value && (
                <button
                  onClick={handleClear}
                  className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2"
                  aria-label="Clear selection"
                >
                  <span className="text-xs">×</span>
                </button>
              )}
              <ChevronDown className="size-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            {searchable && (
              <CommandInput
                placeholder={searchPlaceholder}
                className="h-9"
              />
            )}
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    disabled={option.disabled}
                    className="gap-2"
                  >
                    {option.icon && (
                      <span className="inline-flex shrink-0">
                        {option.icon}
                      </span>
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-foundation-text-dark-tertiary truncate">
                          {option.description}
                        </span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "size-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
SelectControl.displayName = "SelectControl";

// Multi-select variant
export interface MultiSelectControlProps
  extends Omit<SelectControlProps, "value" | "onValueChange"> {
  values?: string[];
  onValuesChange?: (values: string[]) => void;
  maxSelections?: number;
}

const MultiSelectControl = React.forwardRef<
  HTMLButtonElement,
  MultiSelectControlProps
>(
  (
    {
      options,
      values = [],
      onValuesChange,
      placeholder = "Select options...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      disabled = false,
      className,
      searchable = true,
      maxSelections,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const selectedOptions = options.filter((option) =>
      values.includes(option.value)
    );

    const handleSelect = (currentValue: string) => {
      let newValues: string[];
      
      if (values.includes(currentValue)) {
        // Remove value
        newValues = values.filter((v) => v !== currentValue);
      } else {
        // Add value if under max selections
        if (maxSelections && values.length >= maxSelections) {
          return;
        }
        newValues = [...values, currentValue];
      }
      
      onValuesChange?.(newValues);
    };

    const displayText =
      selectedOptions.length > 0
        ? selectedOptions.length === 1
          ? selectedOptions[0].label
          : `${selectedOptions.length} selected`
        : placeholder;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              values.length === 0 && "text-foundation-text-dark-tertiary",
              className
            )}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="size-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            {searchable && (
              <CommandInput
                placeholder={searchPlaceholder}
                className="h-9"
              />
            )}
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = values.includes(option.value);
                  const isDisabled =
                    option.disabled ||
                    (!isSelected &&
                      maxSelections !== undefined &&
                      values.length >= maxSelections);

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                      disabled={isDisabled}
                      className="gap-2"
                    >
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-sm border border-foundation-text-dark-primary/20",
                          isSelected &&
                            "bg-foundation-accent-blue border-foundation-accent-blue"
                        )}
                      >
                        {isSelected && <Check className="size-3 text-white" />}
                      </div>
                      {option.icon && (
                        <span className="inline-flex shrink-0">
                          {option.icon}
                        </span>
                      )}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-foundation-text-dark-tertiary truncate">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
MultiSelectControl.displayName = "MultiSelectControl";

export { SelectControl, MultiSelectControl };
