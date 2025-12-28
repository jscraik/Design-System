"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full font-foundation",
  {
    variants: {
      variant: {
        default:
          "border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
        success:
          "border-foundation-accent-green/50 bg-foundation-accent-green/10 text-foundation-accent-green",
        error:
          "border-foundation-accent-red/50 bg-foundation-accent-red/10 text-foundation-accent-red",
        warning:
          "border-foundation-accent-orange/50 bg-foundation-accent-orange/10 text-foundation-accent-orange",
        info: "border-foundation-accent-blue/50 bg-foundation-accent-blue/10 text-foundation-accent-blue",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
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
 * @example
 * ```tsx
 * <Toast
 *   variant="success"
 *   title="Success!"
 *   description="Your changes have been saved."
 *   onClose={() => setOpen(false)}
 * />
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
  ...props
}: ToastProps) {
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
      className={cn(toastVariants({ variant }), className)}
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
            className="absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-foundation-accent-blue"
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
