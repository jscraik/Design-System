import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import * as React from "react";
import { cn } from "../../utils";

/**
 * Error message display for textarea
 */
function TextareaError({ message, id }: { message: string; id?: string }) {
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
 * Textarea container wrapper that includes the textarea and optional error message
 */
function TextareaWrapper({
  children,
  error,
  errorId,
}: {
  children: React.ReactNode;
  error?: string;
  errorId?: string;
}) {
  return (
    <div className="flex flex-col">
      {children}
      {error && <TextareaError message={error} id={errorId} />}
    </div>
  );
}

/**
 * Renders a styled textarea element with stateful props support.
 *
 * Supports error, loading, disabled, and required states.
 *
 * Accessibility contract:
 * - Provide a visible label or `aria-label`/`aria-labelledby`.
 * - Error state is announced via aria-invalid and aria-describedby.
 * - Required field shows visual indicator.
 *
 * @param props - Native textarea props plus stateful options.
 * @param props.error - Error message, applies error styling and shows error text.
 * @param props.loading - Shows loading state (opacity reduced, cursor wait).
 * @param props.disabled - Disabled state (pointer events none, opacity reduced).
 * @param props.required - Shows required indicator after textarea.
 * @param props.onStateChange - Callback when component state changes.
 * @returns A styled textarea element with optional error message.
 *
 * @example
 * ```tsx
 * <Textarea rows={4} placeholder="Write a response..." />
 * <Textarea error="Response is too long" />
 * <Textarea loading />
 * <Textarea required />
 * ```
 */
function Textarea({
  className,
  error,
  loading = false,
  disabled = false,
  required = false,
  onStateChange,
  id,
  ...props
}: React.ComponentProps<"textarea"> & StatefulComponentProps) {
  // Generate a unique ID for the error message using React's useId
  const generatedTextareaId = React.useId();
  const textareaId = id || generatedTextareaId;
  const errorId = `${textareaId}-error`;

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

  const textareaElement = (
    <textarea
      id={textareaId}
      data-slot="textarea"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      disabled={isDisabled}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? errorId : undefined}
      aria-required={required ? "true" : undefined}
      tabIndex={isDisabled ? -1 : undefined}
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:focus-visible:ring-ring/40 aria-invalid:ring-status-error/20 dark:aria-invalid:ring-status-error/40 aria-invalid:border-status-error dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Error state styling
        error && "border-status-error focus-visible:ring-status-error/50",
        // Loading state styling
        loading && "opacity-70 cursor-wait",
        className,
      )}
      {...props}
    />
  );

  // If error or required, wrap with container for error message/indicator
  if (error || required) {
    return (
      <TextareaWrapper error={error} errorId={errorId}>
        <div className="relative">
          {textareaElement}
          {required && !isDisabled && (
            <span className="absolute right-3 top-3 text-status-error" aria-hidden="true">
              *
            </span>
          )}
        </div>
      </TextareaWrapper>
    );
  }

  return textareaElement;
}

export { Textarea, TextareaWrapper, TextareaError };
