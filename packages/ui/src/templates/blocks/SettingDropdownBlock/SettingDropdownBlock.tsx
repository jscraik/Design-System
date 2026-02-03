import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";

import { cn } from "../../../components/ui/utils";

/** Visual variants for SettingDropdownBlock. */
export type SettingDropdownBlockVariant = "default" | "card" | "compact" | "inline";
/** Size presets for SettingDropdownBlock. */
export type SettingDropdownBlockSize = "sm" | "md" | "lg";

/** Option metadata for dropdown selections. */
export interface SettingDropdownOption {
  /** Unique value for the option */
  value: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Group label (for grouped options) */
  group?: string;
}

/** Props for SettingDropdownBlock. */
export interface SettingDropdownBlockProps {
  /** Main label text */
  label: string;
  /** Current selected value */
  value: string;
  /** Available options */
  options: SettingDropdownOption[];
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** Description text below the row */
  description?: string;
  /** Dropdown alignment */
  align?: "start" | "end" | "center";
  /** Additional class names */
  className?: string;
  /** Visual variant */
  variant?: SettingDropdownBlockVariant;
  /** Size preset */
  size?: SettingDropdownBlockSize;
  /** Icon displayed before the label */
  icon?: ReactNode;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Whether the dropdown is in a loading state */
  loading?: boolean;
  /** Placeholder when no value is selected */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Whether to show a divider below */
  divider?: boolean;
  /** Badge next to the label */
  badge?: ReactNode;
  /** Minimum width for the dropdown menu */
  menuWidth?: number | string;
  /** Whether to show search input in dropdown */
  searchable?: boolean;
  /** ID for the dropdown */
  id?: string;
}

const variantStyles: Record<SettingDropdownBlockVariant, { container: string; trigger: string }> = {
  default: {
    container: "hover:bg-secondary rounded-lg",
    trigger: "hover:bg-muted",
  },
  card: {
    container: "bg-secondary border border-border rounded-lg",
    trigger: "hover:bg-muted",
  },
  compact: {
    container: "",
    trigger: "hover:bg-secondary",
  },
  inline: {
    container: "",
    trigger: "hover:bg-secondary",
  },
};

const sizeStyles: Record<
  SettingDropdownBlockSize,
  { padding: string; label: string; description: string; trigger: string; icon: string }
> = {
  sm: {
    padding: "px-2.5 py-2",
    label: "text-xs",
    description: "text-[11px]",
    trigger: "px-2 py-1 text-xs",
    icon: "size-4",
  },
  md: {
    padding: "px-3 py-2.5",
    label: "text-sm",
    description: "text-xs",
    trigger: "px-3 py-1.5 text-sm",
    icon: "size-5",
  },
  lg: {
    padding: "px-4 py-3",
    label: "text-base",
    description: "text-sm",
    trigger: "px-4 py-2 text-base",
    icon: "size-6",
  },
};

/**
 * Render a settings dropdown block with label and options.
 * @param props - Block props.
 * @returns The settings dropdown block element.
 */
export function SettingDropdownBlock({
  label,
  value,
  options,
  onValueChange,
  description,
  align = "end",
  className,
  variant = "default",
  size = "md",
  icon,
  disabled = false,
  loading = false,
  placeholder = "Select...",
  error,
  divider = false,
  badge,
  menuWidth = 270,
  searchable = false,
  id,
}: SettingDropdownBlockProps) {
  const generatedId = useId();
  const dropdownId = id ?? generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const { container, trigger: triggerVariant } = variantStyles[variant];
  const {
    padding,
    label: labelSize,
    description: descriptionSize,
    trigger: triggerSize,
    icon: iconSize,
  } = sizeStyles[size];

  const menuWidthValue = typeof menuWidth === "number" ? `${menuWidth}px` : menuWidth;

  // Filter options based on search
  const filteredOptions =
    searchable && searchQuery
      ? options.filter(
          (opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opt.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : options;

  // Group options
  const groupedOptions = filteredOptions.reduce<Record<string, SettingDropdownOption[]>>(
    (acc, opt) => {
      const group = opt.group ?? "";
      if (!acc[group]) acc[group] = [];
      acc[group].push(opt);
      return acc;
    },
    {},
  );

  const handleSelect = useCallback(
    (optionValue: string) => {
      onValueChange(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    },
    [onValueChange],
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
      triggerRef.current?.focus();
    } else if (e.key === "Enter" && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className={cn(divider && "border-b border-border", className)}>
      <div
        className={cn(
          "flex items-center justify-between transition-colors",
          padding,
          container,
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        {/* Left side: Icon + Label */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <span className={cn("shrink-0 text-text-secondary", iconSize)}>{icon}</span>}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <label htmlFor={dropdownId} className={cn("font-medium text-foreground", labelSize)}>
                {label}
              </label>
              {badge}
            </div>
          </div>
        </div>

        {/* Right side: Dropdown trigger */}
        <div className="relative">
          <button
            ref={triggerRef}
            id={dropdownId}
            type="button"
            onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            className={cn(
              "flex items-center gap-1.5 rounded-md transition-colors",
              triggerSize,
              triggerVariant,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              error && "ring-1 ring-status-error",
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={dropdownId}
          >
            {loading ? (
              <svg
                className="size-4 animate-spin text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <>
                <span className="text-text-secondary truncate max-w-[150px]">
                  {selectedOption?.label ?? placeholder}
                </span>
                <svg
                  className={cn(
                    "size-3.5 text-text-secondary transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div
              ref={menuRef}
              className={cn(
                "absolute z-50 mt-1 py-1 rounded-lg shadow-lg border",
                "bg-secondary",
                "border-border",
                "animate-in fade-in-0 zoom-in-95 duration-100",
                align === "end" && "right-0",
                align === "start" && "left-0",
                align === "center" && "left-1/2 -translate-x-1/2",
              )}
              style={{ minWidth: menuWidthValue }}
              role="listbox"
              aria-labelledby={dropdownId}
            >
              {/* Search input */}
              {searchable && (
                <div className="px-2 pb-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    aria-label="Search options"
                    className={cn(
                      "w-full px-3 py-1.5 text-sm rounded-md",
                      "bg-muted",
                      "text-foreground",
                      "placeholder:text-text-placeholder",
                      "border border-border",
                      "focus:outline-none focus:ring-2 focus:ring-ring",
                    )}
                  />
                </div>
              )}

              {/* Options */}
              <div className="max-h-[300px] overflow-y-auto">
                {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                  <div key={group || "default"}>
                    {group && (
                      <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {group}
                      </div>
                    )}
                    {groupOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-left transition-colors",
                          "hover:bg-muted",
                          "focus:outline-none focus:bg-muted",
                          option.disabled && "opacity-50 cursor-not-allowed",
                          value === option.value && "bg-muted",
                        )}
                        role="option"
                        aria-selected={value === option.value}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {option.icon && (
                            <span className="shrink-0 text-text-secondary">{option.icon}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-foreground truncate">{option.label}</div>
                            {option.description && (
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {option.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {value === option.value && (
                          <svg
                            className="size-4 text-accent-blue shrink-0 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {description && !error && (
        <p className={cn("text-muted-foreground mt-1", padding, "pt-0", descriptionSize)}>
          {description}
        </p>
      )}

      {/* Error message */}
      {error && (
        <div
          className={cn(
            "flex items-center gap-1.5 text-status-error mt-1",
            padding,
            "pt-0",
            descriptionSize,
          )}
          role="alert"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Compound component for dropdown group
/** Props for SettingDropdownGroup. */
export interface SettingDropdownGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  className?: string;
}

/**
 * Render a group of dropdown blocks.
 * @param props - Group props.
 * @returns The group element.
 */
export function SettingDropdownGroup({
  children,
  label,
  description,
  className,
}: SettingDropdownGroupProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {(label || description) && (
        <div className="px-3 py-2">
          {label && <h3 className="text-sm font-medium text-foreground">{label}</h3>}
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      )}
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}
