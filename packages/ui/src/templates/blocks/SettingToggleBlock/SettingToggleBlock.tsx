import { type ReactNode, useId } from "react";

import { cn } from "../../../components/ui/utils";

/** Visual variants for SettingToggleBlock. */
export type SettingToggleBlockVariant = "default" | "card" | "compact" | "inline";
/** Size presets for SettingToggleBlock. */
export type SettingToggleBlockSize = "sm" | "md" | "lg";

/** Props for SettingToggleBlock. */
export interface SettingToggleBlockProps {
  /** Whether the toggle is checked */
  checked: boolean;
  /** Callback when toggle state changes */
  onCheckedChange: (checked: boolean) => void;
  /** Icon displayed before the label */
  icon?: ReactNode;
  /** Main label text */
  label: string;
  /** Description text below the label */
  description?: string;
  /** Additional class names */
  className?: string;
  /** Visual variant */
  variant?: SettingToggleBlockVariant;
  /** Size preset */
  size?: SettingToggleBlockSize;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Whether the toggle is in a loading state */
  loading?: boolean;
  /** Badge/tag next to the label */
  badge?: ReactNode;
  /** Hint text (appears below description) */
  hint?: string;
  /** Error message */
  error?: string;
  /** Whether to show a divider below */
  divider?: boolean;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Additional action button */
  action?: ReactNode;
  /** ID for the toggle (auto-generated if not provided) */
  id?: string;
}

const variantStyles: Record<SettingToggleBlockVariant, { container: string; content: string }> = {
  default: {
    container: "",
    content: "px-3 py-2.5",
  },
  card: {
    container: "bg-secondary border border-border rounded-xl shadow-sm",
    content: "px-4 py-3.5",
  },
  compact: {
    container: "",
    content: "px-2 py-2",
  },
  inline: {
    container: "",
    content: "px-3 py-2",
  },
};

const sizeStyles: Record<
  SettingToggleBlockSize,
  { label: string; description: string; toggle: string; icon: string }
> = {
  sm: {
    label: "text-xs",
    description: "text-[11px]",
    toggle: "h-4 w-7",
    icon: "w-4 h-4",
  },
  md: {
    label: "text-sm",
    description: "text-xs",
    toggle: "h-5 w-9",
    icon: "w-5 h-5",
  },
  lg: {
    label: "text-[15px]",
    description: "text-sm",
    toggle: "h-6 w-11",
    icon: "w-6 h-6",
  },
};

const toggleKnobSizes: Record<SettingToggleBlockSize, { size: string; translate: string }> = {
  sm: { size: "w-3 h-3", translate: "translate-x-[14px]" },
  md: { size: "w-4 h-4", translate: "translate-x-[18px]" },
  lg: { size: "w-5 h-5", translate: "translate-x-[22px]" },
};

/**
 * Render a settings toggle block with label and actions.
 * @param props - Block props.
 * @returns The settings toggle block element.
 */
export function SettingToggleBlock({
  checked,
  onCheckedChange,
  icon,
  label,
  description,
  className,
  variant = "default",
  size = "md",
  disabled = false,
  loading = false,
  badge,
  hint,
  error,
  divider = false,
  shortcut,
  action,
  id,
}: SettingToggleBlockProps) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;
  const descriptionId = description ? `${toggleId}-description` : undefined;
  const errorId = error ? `${toggleId}-error` : undefined;

  const { container, content } = variantStyles[variant];
  const {
    label: labelSize,
    description: descriptionSize,
    toggle: toggleSize,
    icon: iconSize,
  } = sizeStyles[size];
  const { size: knobSize, translate: knobTranslate } = toggleKnobSizes[size];

  const handleToggle = () => {
    if (!disabled && !loading) {
      onCheckedChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={cn(
        container,
        divider && "border-b border-border",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          content,
          !disabled &&
            !loading &&
            "cursor-pointer hover:bg-secondary/50 rounded-lg transition-colors",
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="presentation"
      >
        {/* Left side: Icon + Label + Description */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <span className={cn("shrink-0 text-text-secondary", iconSize)}>{icon}</span>}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <label
                htmlFor={toggleId}
                className={cn("font-medium text-foreground cursor-pointer select-none", labelSize)}
              >
                {label}
              </label>
              {badge}
              {shortcut && (
                <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-muted font-mono text-[10px] text-muted-foreground border border-border">
                  {shortcut}
                </kbd>
              )}
            </div>
            {description && (
              <p
                id={descriptionId}
                className={cn("text-text-secondary mt-1 leading-relaxed", descriptionSize)}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right side: Action + Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {action}
          <button
            id={toggleId}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            disabled={disabled || loading}
            className={cn(
              "relative inline-flex items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              toggleSize,
              checked ? "bg-accent-green" : "bg-muted",
              disabled && "cursor-not-allowed",
              loading && "cursor-wait",
            )}
            role="switch"
            aria-checked={checked}
            aria-label={label}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          >
            {loading ? (
              <span className={cn("absolute inset-0 flex items-center justify-center")}>
                <svg
                  className="w-3 h-3 animate-spin text-muted-foreground"
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
              </span>
            ) : (
              <span
                className={cn(
                  "transform rounded-full bg-background dark:bg-foreground shadow-sm transition-transform",
                  knobSize,
                  checked ? knobTranslate : "translate-x-0.5",
                )}
              />
            )}
          </button>
        </div>
      </div>

      {/* Hint text */}
      {hint && !error && (
        <p
          className={cn(
            "text-muted-foreground mt-2 leading-relaxed",
            content,
            "pt-0",
            descriptionSize,
          )}
        >
          {hint}
        </p>
      )}

      {/* Error message */}
      {error && (
        <div
          id={errorId}
          className={cn(
            "flex items-center gap-1.5 text-status-error mt-2",
            content,
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

// Compound component for toggle badge
/** Props for SettingToggleBadge. */
export interface SettingToggleBadgeProps {
  children: ReactNode;
  variant?: "default" | "new" | "beta" | "pro" | "deprecated";
  className?: string;
}

/**
 * Render a badge for a toggle block.
 * @param props - Badge props.
 * @returns The badge element.
 */
export function SettingToggleBadge({
  children,
  variant = "default",
  className,
}: SettingToggleBadgeProps) {
  const variantClasses = {
    default: "bg-muted text-text-secondary",
    new: "bg-accent-blue/10 text-accent-blue",
    beta: "bg-accent-orange/10 text-accent-orange",
    pro: "bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 text-accent-purple",
    deprecated: "bg-status-error-muted/10 text-status-error",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// Compound component for toggle group
/** Props for SettingToggleGroup. */
export interface SettingToggleGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  className?: string;
}

/**
 * Render a group of toggle blocks.
 * @param props - Group props.
 * @returns The group element.
 */
export function SettingToggleGroup({
  children,
  label,
  description,
  className,
}: SettingToggleGroupProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {(label || description) && (
        <div className="px-3 py-2">
          {label && <h3 className="text-sm font-semibold text-foreground">{label}</h3>}
          {description && <p className="text-xs text-text-secondary mt-1">{description}</p>}
        </div>
      )}
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}
