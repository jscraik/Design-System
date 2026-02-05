import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";
import { cn } from "../../utils";

/**
 * Error message display for InputOTP.
 */
function InputOTPError({ message, id }: { message: string; id?: string }) {
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
 * InputOTP container wrapper that includes the OTP input and optional error message.
 */
function InputOTPWrapper({
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
      {error && <InputOTPError message={error} id={errorId} />}
      {required && !error && (
        <span className="text-status-error text-body-small mt-1" aria-hidden="true">
          * Required
        </span>
      )}
    </div>
  );
}

/**
 * Renders an OTP input using the `input-otp` package with stateful props support.
 *
 * Supports error, loading, disabled, and required states.
 *
 * Accessibility contract:
 * - Provide a visible label or `aria-label`/`aria-labelledby`.
 * - Error state is announced via aria-invalid and aria-describedby.
 * - Required field shows visual indicator.
 *
 * @param props - OTP input props plus stateful options.
 * @param props.error - Error message, applies error styling and shows error text.
 * @param props.loading - Shows loading state (opacity reduced, cursor wait).
 * @param props.disabled - Disabled state (pointer events none, opacity reduced).
 * @param props.required - Required field indicator (default: `false`).
 * @param props.onStateChange - Callback when component state changes.
 * @returns An OTP input element with optional error message.
 *
 * @example
 * ```tsx
 * <InputOTP maxLength={6} />
 * <InputOTP error="Invalid code" />
 * <InputOTP loading />
 * <InputOTP required />
 * ```
 */
function InputOTP({
  className,
  containerClassName,
  error,
  loading = false,
  disabled = false,
  required = false,
  onStateChange,
  id,
  ...props
}: React.ComponentProps<typeof OTPInput> &
  StatefulComponentProps & {
    containerClassName?: string;
  }) {
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

  const isDisabled = disabled || loading;

  const inputElement = (
    <OTPInput
      id={inputId}
      data-slot="input-otp"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      disabled={isDisabled}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? errorId : undefined}
      aria-required={required ? "true" : undefined}
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        loading && "opacity-70",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", error && "border-status-error", className)}
      {...props}
    />
  );

  // If error or required, wrap with container for error message/indicator
  if (error || required) {
    return (
      <InputOTPWrapper error={error} required={required} errorId={errorId}>
        {inputElement}
      </InputOTPWrapper>
    );
  }

  return inputElement;
}

/**
 * Renders a grouping container for OTP slots.
 *
 * @param props - Div props for the group container.
 * @returns An OTP group element.
 */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

/**
 * Renders an OTP input slot at a given index.
 *
 * @param props - Div props for the slot plus index.
 * @returns An OTP slot element.
 */
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  type OTPContextValue = {
    slots: Array<{ char?: string; hasFakeCaret?: boolean; isActive?: boolean }>;
  };
  const inputOTPContext = React.useContext(
    OTPInputContext as unknown as React.Context<OTPContextValue | null>,
  );
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-status-error/20 dark:data-[active=true]:aria-invalid:ring-status-error/40 aria-invalid:border-status-error data-[active=true]:aria-invalid:border-status-error dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm bg-input-background transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

/**
 * Renders a separator between OTP groups.
 *
 * @param props - Div props for the separator.
 * @returns An OTP separator element.
 */
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <span className="text-muted-foreground">-</span>
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, InputOTPWrapper, InputOTPError };
