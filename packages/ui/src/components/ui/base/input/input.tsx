import * as React from "react";

import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Error message display for input
 */
function InputError({ message, id }: { message: string; id?: string }) {
  return (
    <span
      id={id}
      className="text-foundation-accent-red text-body-small mt-1 flex items-center gap-1"
    >
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
 * Input container wrapper that includes the input and optional error message
 */
function InputWrapper({
  children,
  error,
  required,
  errorId,
}: {
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  errorId?: string;
}) {
  return (
    <div className="flex flex-col">
      {children}
      {error && <InputError message={error} id={errorId} />}
    </div>
  );
}

/**
 * Renders a styled input element with stateful props support.
 *
 * Supports error, loading, disabled, and required states.
 *
 * Accessibility contract:
 * - Provide a visible label or `aria-label`/`aria-labelledby`.
 * - Error state is announced via aria-invalid and aria-describedby.
 * - Required field shows visual indicator.
 *
 * @param props - Native input props plus stateful options.
 * @param props.error - Error message, applies error styling and shows error text.
 * @param props.loading - Shows loading state (opacity reduced, cursor wait).
 * @param props.disabled - Disabled state (pointer events none, opacity reduced).
 * @param props.required - Shows required indicator after input.
 * @param props.onStateChange - Callback when component state changes.
 * @returns A styled input element with optional error message.
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="name@company.com" />
 * <Input error="Invalid email address" />
 * <Input loading />
 * <Input required />
 * ```
 */
function Input({
  className,
  type,
  error,
  loading = false,
  disabled = false,
  required = false,
  onStateChange,
  id,
  ...props
}: React.ComponentProps<"input"> & StatefulComponentProps) {
  // Generate a unique ID for the error message using React's useId
  const generatedInputId = React.useId();
  const inputId = id || generatedInputId;
  const errorId = `${inputId}-error`;

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

  const inputElement = (
    <input
      type={type}
      id={inputId}
      data-slot="input"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      disabled={disabled || loading}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? errorId : undefined}
      aria-required={required ? "true" : undefined}
      className={cn(
        "font-foundation text-body placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary selection:bg-foundation-accent-blue selection:text-foundation-text-light-primary border-foundation-bg-dark-3 flex min-h-[var(--foundation-size-control-height)] w-full min-w-0 rounded-md border px-3 py-1 bg-foundation-bg-dark-1 text-foundation-text-dark-primary transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body-small file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Focus styles
        "focus-visible:border-foundation-accent-blue focus-visible:ring-2 focus-visible:ring-foundation-text-light-primary dark:focus-visible:ring-foundation-text-dark-primary",
        // Error state
        error && "border-foundation-accent-red focus-visible:ring-foundation-accent-red",
        // Loading state
        loading && "opacity-70 cursor-wait",
        // Required indicator
        required && "pr-8",
        className,
      )}
      {...props}
    />
  );

  // If error or required, wrap with container for error message/indicator
  if (error || required) {
    return (
      <InputWrapper error={error} required={required} errorId={errorId}>
        <div className="relative">
          {inputElement}
          {required && !disabled && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foundation-accent-red"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </div>
      </InputWrapper>
    );
  }

  return inputElement;
}

export { Input, InputWrapper, InputError };
