"use client";

import * as React from "react";

import { Button } from "../../base/Button";
import { cn } from "../../utils";

/**
 * Represents a combobox option.
 */
export interface ComboboxOption {
  /** Option value */
  value: string;
  /** Option label */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

/**
 * Props for the combobox component.
 */
export interface ComboboxProps {
  /** Available options */
  options: ComboboxOption[];
  /** Selected value */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Allow custom values not in options */
  allowCustomValue?: boolean;
}

/**
 * Renders a searchable select component with autocomplete.
 *
 * Accessibility contract:
 * - The trigger uses `role="combobox"` and `aria-expanded`.
 * - The options list uses `role="listbox"`/`option`.
 *
 * @example
 * ```tsx
 * <Combobox
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *     { value: "angular", label: "Angular" },
 *   ]}
 *   value={framework}
 *   onValueChange={setFramework}
 *   placeholder="Select framework..."
 * />
 * ```
 *
 * @param props - Combobox props.
 * @returns A combobox element with search and selection UI.
 */
function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  className,
  allowCustomValue = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(searchLower) ||
        opt.value.toLowerCase().includes(searchLower),
    );
  }, [options, search]);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else if (allowCustomValue && search) {
          handleSelect(search);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
        break;
    }
  };

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!listRef.current?.contains(target) && !inputRef.current?.contains(target)) {
        setOpen(false);
        setSearch("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div
      data-slot="combobox"
      className={cn("relative w-full font-foundation", className)}
      onKeyDown={handleKeyDown}
    >
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn("w-full justify-between", !value && "text-foundation-text-dark-tertiary")}
      >
        {selectedOption?.label || value || placeholder}
        <svg
          className={cn(
            "ml-2 size-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {open && (
        <div
          data-slot="combobox-content"
          className="absolute z-50 mt-1 w-full rounded-md border border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 shadow-lg"
        >
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-md border border-foundation-bg-dark-3 bg-transparent px-3 py-2 text-sm text-foundation-text-dark-primary placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue"
              aria-label={searchPlaceholder}
            />
          </div>

          <ul
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-auto p-1"
            aria-label="Options"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-foundation-text-dark-tertiary">
                {emptyMessage}
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                  aria-disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors",
                    value === option.value &&
                      "bg-foundation-accent-blue/10 text-foundation-text-dark-primary",
                    highlightedIndex === index &&
                      value !== option.value &&
                      "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
                    option.disabled && "pointer-events-none opacity-50",
                    !option.disabled &&
                      value !== option.value &&
                      "text-foundation-text-dark-primary hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
                  )}
                >
                  {value === option.value && (
                    <svg
                      className="mr-2 size-4 text-foundation-accent-blue"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  <span className={cn(value !== option.value && "ml-6")}>{option.label}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

Combobox.displayName = "Combobox";

export { Combobox };
