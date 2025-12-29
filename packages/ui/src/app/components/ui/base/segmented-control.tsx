import { cn } from "../utils";

export interface SegmentOption<T extends string = string> {
  /** Unique value for the option */
  value: T;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  /** Currently selected value */
  value?: T;
  /** Callback when selection changes */
  onChange?: (value: T) => void;
  /** Available options */
  options: SegmentOption<T>[];
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Active segment color */
  activeColor?: string;
}

/**
 * SegmentedControl - A group of mutually exclusive buttons
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   value={selected}
 *   onChange={setSelected}
 *   options={[
 *     { value: "rewrite", label: "Rewrite" },
 *     { value: "augment", label: "Augment" },
 *     { value: "preserve", label: "Preserve" },
 *   ]}
 * />
 * ```
 */
export function SegmentedControl<T extends string = string>({
  value,
  onChange,
  options,
  size = "md",
  fullWidth = false,
  className,
  activeColor,
}: SegmentedControlProps<T>) {
  const sizes = {
    sm: "px-2 py-1 text-[12px]",
    md: "px-3 py-1.5 text-[13px]",
    lg: "px-4 py-2 text-[14px]",
  };

  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex items-center gap-0 bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 rounded-lg p-1",
        fullWidth && "w-full",
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={option.disabled}
            onClick={() => onChange?.(option.value)}
            className={cn(
              "rounded-md transition-all font-normal leading-[20px] tracking-[-0.3px] flex items-center gap-1.5",
              sizes[size],
              fullWidth && "flex-1 justify-center",
              isSelected
                ? "text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
                : "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary",
              option.disabled && "opacity-50 cursor-not-allowed",
            )}
            style={{
              backgroundColor: isSelected
                ? activeColor || "rgba(var(--foundation-accent-green-rgb), 0.3)"
                : "transparent",
            }}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = "SegmentedControl";
