import { cva } from "class-variance-authority";

import { cn } from "../utils";

// Add toggleVariants for compatibility with toggle-group
export const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
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

export interface ToggleProps {
  /** Whether the toggle is on */
  checked?: boolean;
  /** Callback when toggle changes */
  onChange?: (checked: boolean) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Disable the toggle */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Active color */
  activeColor?: string;
}

/**
 * Toggle - A switch component for boolean values
 *
 * @example
 * ```tsx
 * <Toggle checked={isEnabled} onChange={setIsEnabled} />
 * ```
 */
export function Toggle({
  checked = false,
  onChange,
  size = "md",
  disabled = false,
  className,
  activeColor = "var(--foundation-accent-green)",
}: ToggleProps) {
  const sizes = {
    sm: { track: "w-8 h-4", thumb: "size-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "size-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", thumb: "size-6", translate: "translate-x-7" },
  };

  const { track, thumb, translate } = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={cn(
        "relative rounded-full transition-colors",
        track,
        !checked && "bg-foundation-bg-dark-3",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={checked ? { backgroundColor: activeColor } : undefined}
    >
      <div
        className={cn(
          "absolute top-0.5 left-0.5 bg-white rounded-full transition-transform shadow-sm",
          thumb,
          checked && translate,
        )}
      />
    </button>
  );
}

export interface ToggleRowProps {
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
 * ToggleRow - A row with label and toggle switch
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
 */
export function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
  className,
}: ToggleRowProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-foundation-text-dark-tertiary">{icon}</div>}
        <div>
          <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-dark-primary">
            {label}
          </div>
          {description && (
            <div className="text-[12px] leading-[18px] text-foundation-text-dark-primary/70">
              {description}
            </div>
          )}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

Toggle.displayName = "Toggle";
ToggleRow.displayName = "ToggleRow";
