import { type ReactNode, useId } from "react";

import { cn } from "../../../components/ui/utils";

/** Size presets for TemplateFormField. */
export type TemplateFormFieldSize = "sm" | "md" | "lg";
/** Status variants for TemplateFormField. */
export type TemplateFormFieldStatus = "default" | "error" | "success" | "warning";
/** Layout orientation for TemplateFormField. */
export type TemplateFormFieldOrientation = "vertical" | "horizontal";

/** Props for TemplateFormField. */
export interface TemplateFormFieldProps {
  /** Field label text */
  label: string;
  /** ID for the form control (auto-generated if not provided) */
  htmlFor?: string;
  /** Helper text below the label */
  description?: string;
  /** Error message to display */
  error?: string;
  /** Success message to display */
  success?: string;
  /** Hint text below the input */
  hint?: string;
  /** Action buttons/links next to the label */
  actions?: ReactNode;
  /** The form control (input, select, textarea, etc.) */
  children: ReactNode;
  /** Additional class names for the root container */
  className?: string;
  /** Additional class names for the label */
  labelClassName?: string;
  /** Additional class names for the description */
  descriptionClassName?: string;
  /** Size preset affecting spacing and typography */
  size?: TemplateFormFieldSize;
  /** Validation status */
  status?: TemplateFormFieldStatus;
  /** Layout orientation */
  orientation?: TemplateFormFieldOrientation;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is optional (shows "Optional" badge) */
  optional?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Character count (current/max) */
  characterCount?: { current: number; max: number };
  /** Whether to hide the label visually (still accessible) */
  hideLabel?: boolean;
  /** Icon to display before the label */
  labelIcon?: ReactNode;
  /** Tooltip content for the label */
  tooltip?: ReactNode;
}

const sizeStyles: Record<
  TemplateFormFieldSize,
  { label: string; description: string; hint: string; gap: string }
> = {
  sm: {
    label: "text-xs leading-4",
    description: "text-[11px] leading-4",
    hint: "text-[11px] leading-4",
    gap: "space-y-1",
  },
  md: {
    label: "text-[13px] leading-5",
    description: "text-xs leading-4",
    hint: "text-xs leading-4",
    gap: "space-y-1.5",
  },
  lg: {
    label: "text-sm leading-5",
    description: "text-[13px] leading-5",
    hint: "text-[13px] leading-5",
    gap: "space-y-2",
  },
};

const statusStyles: Record<TemplateFormFieldStatus, { border: string; text: string }> = {
  default: {
    border: "",
    text: "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary",
  },
  error: {
    border: "ring-1 ring-foundation-accent-red",
    text: "text-foundation-accent-red",
  },
  success: {
    border: "ring-1 ring-foundation-accent-green",
    text: "text-foundation-accent-green",
  },
  warning: {
    border: "ring-1 ring-foundation-accent-orange",
    text: "text-foundation-accent-orange",
  },
};

/**
 * Render a template form field with label, description, and actions.
 * @param props - Form field props.
 * @returns The form field element.
 */
export function TemplateFormField({
  label,
  htmlFor,
  description,
  error,
  success,
  hint,
  actions,
  children,
  className,
  labelClassName,
  descriptionClassName,
  size = "md",
  status: statusProp,
  orientation = "vertical",
  required = false,
  optional = false,
  disabled = false,
  characterCount,
  hideLabel = false,
  labelIcon,
  tooltip,
}: TemplateFormFieldProps) {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  // Determine status from props (available for future use/child styling)
  const _status = statusProp ?? (error ? "error" : success ? "success" : "default");

  const { label: labelSize, description: descriptionSize, hint: hintSize, gap } = sizeStyles[size];

  const isHorizontal = orientation === "horizontal";

  // Character count warning
  const isOverLimit = characterCount && characterCount.current > characterCount.max;
  const isNearLimit =
    characterCount && characterCount.current >= characterCount.max * 0.9 && !isOverLimit;

  const labelElement = (
    <div className={cn("flex items-center gap-1.5", isHorizontal && "min-w-[120px] shrink-0")}>
      {labelIcon && (
        <span className="text-foundation-icon-light-secondary dark:text-foundation-icon-dark-secondary">
          {labelIcon}
        </span>
      )}
      <label
        htmlFor={fieldId}
        className={cn(
          "font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
          labelSize,
          disabled && "opacity-50 cursor-not-allowed",
          hideLabel && "sr-only",
          labelClassName,
        )}
      >
        {label}
        {required && (
          <span className="text-foundation-accent-red ml-0.5" aria-label="required">
            *
          </span>
        )}
      </label>
      {optional && !required && (
        <span className="text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-xs">
          (Optional)
        </span>
      )}
      {tooltip && (
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-full w-4 h-4",
            "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary",
            "hover:text-foundation-text-light-secondary dark:hover:text-foundation-text-dark-secondary",
            "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
            "transition-colors",
          )}
          aria-label="More information"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );

  const actionsElement = actions && (
    <div className="flex items-center gap-1 shrink-0">{actions}</div>
  );

  const descriptionElement = description && (
    <p
      id={descriptionId}
      className={cn(
        "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
        descriptionSize,
        disabled && "opacity-50",
        descriptionClassName,
      )}
    >
      {description}
    </p>
  );

  const feedbackElement = (error || success || hint || characterCount) && (
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        {error && (
          <p
            id={errorId}
            className={cn("flex items-center gap-1.5", hintSize, statusStyles.error.text)}
            role="alert"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0 mt-0.5"
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
          </p>
        )}
        {success && !error && (
          <p className={cn("flex items-center gap-1.5", hintSize, statusStyles.success.text)}>
            <svg
              className="w-3.5 h-3.5 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </p>
        )}
        {hint && !error && !success && (
          <p
            id={hintId}
            className={cn(
              "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary",
              hintSize,
            )}
          >
            {hint}
          </p>
        )}
      </div>
      {characterCount && (
        <span
          className={cn(
            hintSize,
            "tabular-nums shrink-0 font-medium",
            isOverLimit && "text-foundation-accent-red",
            isNearLimit && !isOverLimit && "text-foundation-accent-orange",
            !isOverLimit &&
              !isNearLimit &&
              "text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary",
          )}
          aria-live="polite"
        >
          {characterCount.current}/{characterCount.max}
        </span>
      )}
    </div>
  );

  if (isHorizontal) {
    return (
      <div className={cn("flex items-start gap-4", disabled && "pointer-events-none", className)}>
        <div className="pt-2.5">
          {labelElement}
          {descriptionElement && <div className="mt-1">{descriptionElement}</div>}
        </div>
        <div className={cn("flex-1 min-w-0", gap)}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">{children}</div>
            {actionsElement}
          </div>
          {feedbackElement}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(gap, disabled && "pointer-events-none", className)}
      role="group"
      aria-labelledby={fieldId}
      aria-describedby={[descriptionId, errorId, hintId].filter(Boolean).join(" ") || undefined}
    >
      <div className="flex items-center justify-between gap-2">
        {labelElement}
        {actionsElement}
      </div>
      {descriptionElement}
      <div className={cn(disabled && "opacity-50")}>{children}</div>
      {feedbackElement}
    </div>
  );
}

// Compound component for form field action link
/** Props for TemplateFormFieldAction. */
export interface TemplateFormFieldActionProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Render a form field action element.
 * @param props - Action props.
 * @returns The action element.
 */
export function TemplateFormFieldAction({
  children,
  onClick,
  href,
  className,
  disabled = false,
}: TemplateFormFieldActionProps) {
  const baseClasses = cn(
    "text-xs font-medium",
    "text-foundation-accent-blue hover:text-foundation-accent-blue/80",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:rounded-sm",
    "transition-colors",
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    className,
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={baseClasses}>
      {children}
    </button>
  );
}

// Compound component for form field icon button
/** Props for TemplateFormFieldIconButton. */
export interface TemplateFormFieldIconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  "aria-label": string;
  className?: string;
  disabled?: boolean;
}

/**
 * Render an icon button for form field actions.
 * @param props - Icon button props.
 * @returns The icon button element.
 */
export function TemplateFormFieldIconButton({
  icon,
  onClick,
  "aria-label": ariaLabel,
  className,
  disabled = false,
}: TemplateFormFieldIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg w-7 h-7",
        "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
        "hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary",
        "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
        "transition-colors",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className,
      )}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}

// Compound component for inline form field (label and input on same line)
/** Props for TemplateFormFieldInline. */
export interface TemplateFormFieldInlineProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  labelWidth?: number | string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Render an inline layout for form field content.
 * @param props - Inline props.
 * @returns The inline element.
 */
export function TemplateFormFieldInline({
  label,
  htmlFor,
  children,
  className,
  labelWidth = 120,
  required = false,
  disabled = false,
}: TemplateFormFieldInlineProps) {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const widthValue = typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth;

  return (
    <div className={cn("flex items-center gap-3", disabled && "pointer-events-none", className)}>
      <label
        htmlFor={fieldId}
        className={cn(
          "text-[13px] leading-5 font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary shrink-0",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        style={{ width: widthValue }}
      >
        {label}
        {required && (
          <span className="text-foundation-accent-red ml-0.5" aria-label="required">
            *
          </span>
        )}
      </label>
      <div className={cn("flex-1 min-w-0", disabled && "opacity-50")}>{children}</div>
    </div>
  );
}
