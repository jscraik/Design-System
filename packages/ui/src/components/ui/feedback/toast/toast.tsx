import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../utils";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full font-foundation",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground",
        success: "border-status-success/50 bg-status-success-muted/10 text-foreground",
        error: "border-status-error/50 bg-status-error-muted/10 text-foreground",
        warning: "border-status-warning/50 bg-status-warning/10 text-foreground",
        info: "border-interactive/50 bg-interactive/10 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Props for the toast component.
 */
export interface ToastProps
  extends StatefulComponentProps,
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  /** Toast title */
  title?: string;
  /** Toast description */
  description?: string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Action button */
  action?: React.ReactNode;
  /** Close button handler */
  onClose?: () => void;
  /** Whether the toast is open */
  open?: boolean;
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
}

/**
 * Toast - A notification component for displaying brief messages
 *
 * Supports stateful props for loading, error, and disabled states.
 * When loading, shows a loading indicator in the toast.
 * When error, applies error styling.
 * When disabled, reduces opacity and disables interactive elements.
 *
 * @example
 * ```tsx
 * <Toast
 *   variant="success"
 *   title="Success!"
 *   description="Your changes have been saved."
 *   onClose={() => setOpen(false)}
 * />
 * <Toast loading />
 * <Toast error="Failed to save" />
 * ```
 */
function Toast({
  className,
  variant,
  title,
  description,
  icon,
  action,
  onClose,
  open = true,
  duration = 5000,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  ...props
}: ToastProps) {
  // Determine effective state (priority: loading > error > disabled > default)
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

  // Effective disabled state (disabled if explicitly disabled OR loading)
  const isDisabled = disabled || loading;

  React.useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      data-slot="toast"
      data-state={open ? "open" : "closed"}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        toastVariants({ variant }),
        isDisabled && "opacity-60 pointer-events-none",
        error && "ring-2 ring-status-error/50",
        loading && "animate-pulse",
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
        <div className="grid gap-1">
          {title && (
            <div data-slot="toast-title" className="text-sm font-semibold">
              {title}
            </div>
          )}
          {description && (
            <div data-slot="toast-description" className="text-sm opacity-90">
              {description}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isDisabled}
            className="absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-interactive disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Props for the toast container.
 */
export interface ToastContainerProps {
  /** Position of the toast container */
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  /** Children toasts */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

const positionClasses = {
  "top-left": "top-0 left-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-0 right-0",
};

/**
 * ToastContainer - Container for positioning toasts
 */
function ToastContainer({ position = "bottom-right", children, className }: ToastContainerProps) {
  return (
    <div
      data-slot="toast-container"
      className={cn(
        "fixed z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]",
        positionClasses[position],
        className,
      )}
    >
      {children}
    </div>
  );
}

Toast.displayName = "Toast";
ToastContainer.displayName = "ToastContainer";

export { Toast, ToastContainer, toastVariants };
