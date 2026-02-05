import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { cn } from "../../utils";

/**
 * Represents a selectable segment option.
 */
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

/**
 * Props for the segmented control component.
 */
export interface SegmentedControlProps<T extends string = string> extends StatefulComponentProps {
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
  /** Error message, applies error styling and shows error text */
  error?: string;
  /** Shows loading state (opacity reduced, cursor wait) */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Required field indicator (default: `false`) */
  required?: boolean;
  /** Unique ID for the control */
  id?: string;
}

/**
 * Error message display for segmented control.
 */
function SegmentedControlError({ message, id }: { message: string; id?: string }) {
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
 * Renders a group of mutually exclusive buttons with stateful props support.
 *
 * Controlled component; supply `value` and `onChange` for selection updates.
 * Supports error, loading, disabled, and required states.
 *
 * Accessibility contract:
 * - Uses `role="radiogroup"` and `role="radio"` per option.
 * - Error state is announced via aria-invalid and aria-describedby.
 * - Required field shows visual indicator.
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
 * <SegmentedControl error="Please select an option" />
 * <SegmentedControl required />
 * ```
 *
 * @param props - Segmented control props.
 * @returns A segmented control element with optional error message.
 */
export function SegmentedControl<T extends string = string>({
  value,
  onChange,
  options,
  size = "md",
  fullWidth = false,
  className,
  activeColor,
  error,
  loading = false,
  disabled = false,
  required = false,
  onStateChange,
  id,
}: SegmentedControlProps<T>) {
  // Generate a unique ID for the error message using React's useId
  const generatedControlId = React.useId();
  const controlId = id || generatedControlId;
  const errorId = `${controlId}-error`;

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

  const isDisabled = disabled || loading;

  const sizes = {
    sm: "px-2 py-1 text-caption",
    md: "px-3 py-1.5 text-body-small",
    lg: "px-4 py-2 text-body-small",
  };

  const controlElement = (
    <div
      role="radiogroup"
      data-slot="segmented-control"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? errorId : undefined}
      aria-required={required ? "true" : undefined}
      className={cn(
        "inline-flex items-center gap-0 bg-secondary rounded-lg p-1",
        fullWidth && "w-full",
        loading && "opacity-70 cursor-wait",
        error && "ring-2 ring-status-error/50",
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isOptionDisabled = isDisabled || option.disabled;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isOptionDisabled}
            onClick={() => !isOptionDisabled && onChange?.(option.value)}
            className={cn(
              "rounded-md transition-all flex items-center gap-1.5",
              sizes[size],
              fullWidth && "flex-1 justify-center",
              isSelected ? "text-foreground" : "text-text-secondary hover:text-foreground",
              isOptionDisabled && "opacity-50 cursor-not-allowed",
            )}
            style={{
              backgroundColor: isSelected
                ? activeColor || "color-mix(in srgb, var(--accent-green) 30%, transparent)"
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

  // If error or required, wrap with container for error message/indicator
  if (error || required) {
    return (
      <div className="flex flex-col">
        {controlElement}
        {error && <SegmentedControlError message={error} id={errorId} />}
        {required && !error && (
          <span className="text-status-error text-body-small mt-1" aria-hidden="true">
            * Required
          </span>
        )}
      </div>
    );
  }

  return controlElement;
}

SegmentedControl.displayName = "SegmentedControl";
