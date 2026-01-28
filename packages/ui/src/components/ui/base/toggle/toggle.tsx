import { cva } from "class-variance-authority";
import * as React from "react";
import { useId } from "react";

import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Toggle style variants used by Toggle and ToggleGroup.
 * Uses Apps SDK UI tokens for styling.
 */
export const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: cn(
          "bg-transparent",
          // Hover - using Apps SDK UI tokens
          "hover:bg-color-background-hover",
          // Text colors - using Apps SDK UI tokens
          "text-foreground",
          "hover:text-foreground",
          // Active/on state - using Apps SDK UI tokens
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
          // Focus styles - using Apps SDK UI tokens
          "focus-visible:ring-1 focus-visible:ring-ring/50",
        ),
        outline: cn(
          "border bg-transparent shadow-sm",
          // Border - using Apps SDK UI tokens
          "border-input",
          // Hover - using Apps SDK UI tokens
          "hover:bg-color-background-hover hover:text-foreground",
          // Text color - using Apps SDK UI tokens
          "text-foreground",
          // Active/on state - using Apps SDK UI tokens
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
          // Focus styles - using Apps SDK UI tokens
          "focus-visible:ring-1 focus-visible:ring-ring/50",
        ),
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2",
        lg: "h-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Props for the toggle switch.
 */
export interface ToggleProps extends StatefulComponentProps {
  /** Whether the toggle is on */
  checked?: boolean;
  /** Callback when toggle changes */
  onChange?: (checked: boolean) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Active color */
  activeColor?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Accessible label element id */
  ariaLabelledby?: string;
  /** Accessible description element id */
  ariaDescribedby?: string;
}

/**
 * Renders a switch component for boolean values.
 *
 * Accessibility contract:
 * - Uses `role="switch"` and `aria-checked`.
 *
 * @example
 * ```tsx
 * <Toggle checked={isEnabled} onChange={setIsEnabled} />
 * ```
 *
 * @param props - Toggle props.
 * @returns A toggle switch element.
 */
export function Toggle({
  checked = false,
  onChange,
  size = "md",
  disabled = false,
  loading = false,
  error,
  required = false,
  onStateChange,
  className,
  activeColor = "var(--foundation-accent-green)",
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
}: ToggleProps) {
  // Determine effective state
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : checked
          ? "checked"
          : "unchecked";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Toggle is effectively disabled when loading or explicitly disabled
  const isDisabled = disabled || loading;

  const sizes = {
    sm: { track: "w-8 h-4", thumb: "size-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "size-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", thumb: "size-6", translate: "translate-x-7" },
  };

  const { track, thumb, translate } = sizes[size];

  // Handle keyboard activation (Space/Enter)
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!isDisabled && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        onChange?.(!checked);
      }
    },
    [isDisabled, checked, onChange],
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-required={required ? true : undefined}
      disabled={isDisabled}
      onKeyDown={handleKeyDown}
      onClick={() => !isDisabled && onChange?.(!checked)}
      className={cn(
        "relative rounded-full transition-colors",
        track,
        // Unchecked background - using Apps SDK UI tokens
        !checked && "bg-input-background",
        // Error state styling
        error && "border-2 border-destructive",
        effectiveState === "error" && "ring-2 ring-destructive/20",
        // Loading state styling
        effectiveState === "loading" && "opacity-70 cursor-wait",
        // Disabled state
        isDisabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={checked ? { backgroundColor: activeColor } : undefined}
    >
      <div
        className={cn(
          "absolute top-0.5 left-0.5 rounded-full transition-transform shadow-sm",
          thumb,
          // Thumb background - using Apps SDK UI tokens
          "bg-background",
          // Error thumb styling
          error && checked && "bg-destructive",
          checked && translate,
        )}
      />
    </button>
  );
}

/**
 * Props for the toggle row helper.
 */
export interface ToggleRowProps extends StatefulComponentProps {
  /** Icon to display */
  icon?: React.ReactNode;
  /** Label text */
  label: string;
  /** Description text */
  description?: string;
  /** Whether the toggle is on */
  checked?: boolean;
  /** Callback when toggle changes */
  onChange?: (checked: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Renders a row with label and toggle switch.
 *
 * @example
 * ```tsx
 * <ToggleRow
 *   icon={<IconSettings />}
 *   label="Enable feature"
 *   description="Turn this on to enable the feature"
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 * />
 * ```
 *
 * @param props - Toggle row props.
 * @returns A row with a toggle control.
 */
export function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
  loading,
  error,
  disabled,
  required,
  onStateChange,
  className,
}: ToggleRowProps) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div>
          <div id={labelId} className="text-body-small text-foreground">
            {label}
          </div>
          {description && (
            <div id={descriptionId} className="text-caption text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      </div>
      <Toggle
        checked={checked}
        onChange={onChange}
        loading={loading}
        error={error}
        disabled={disabled}
        required={required}
        onStateChange={onStateChange}
        ariaLabelledby={labelId}
        ariaDescribedby={description ? descriptionId : undefined}
      />
    </div>
  );
}

Toggle.displayName = "Toggle";
ToggleRow.displayName = "ToggleRow";
