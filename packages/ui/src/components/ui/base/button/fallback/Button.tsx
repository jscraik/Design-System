// Radix fallback component.
// why_missing_upstream: Apps SDK UI lacks this component or required API parity.
// migration_trigger: Replace with Apps SDK UI component when available with matching props and behavior.
// a11y_contract_ref: docs/KEYBOARD_NAVIGATION_TESTS.md

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Loading spinner component for button loading state
 */
function ButtonSpinner() {
  return (
    <svg
      className="animate-spin size-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Defines the base class names and variant mappings for the Button component.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-round font-foundation text-button-label font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-foundation-text-light-primary dark:focus-visible:ring-foundation-text-dark-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background aria-invalid:ring-2 aria-invalid:ring-foundation-accent-red aria-invalid:ring-offset-2 aria-invalid:ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-foreground text-text-inverted hover:bg-foreground/90",
        destructive:
          "bg-foundation-accent-red text-text-inverted hover:bg-foundation-accent-red/90 focus-visible:ring-foundation-text-light-primary dark:focus-visible:ring-foundation-text-dark-primary",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-secondary/60 focus-visible:ring-foundation-text-light-primary dark:focus-visible:ring-foundation-text-dark-primary",
        secondary: "bg-muted text-foreground hover:bg-secondary/70",
        ghost: "bg-transparent text-foreground hover:bg-secondary/60 hover:text-foreground",
        link: "text-foundation-text-dark-primary underline decoration-foundation-accent-blue underline-offset-4 hover:decoration-foundation-accent-blue/70",
      },
      size: {
        default: "h-[var(--foundation-size-control-height)] px-4 py-2 has-[>svg]:px-3",
        sm: "h-[var(--foundation-size-control-height)] gap-1.5 px-3 has-[>svg]:px-2.5 text-button-label-small",
        lg: "h-[var(--foundation-size-control-height)] px-6 has-[>svg]:px-4 text-button-label",
        icon: "size-[var(--foundation-size-control-height)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Renders a styled button with size and visual variants.
 *
 * Supports stateful props for loading, error, disabled, and required states.
 *
 * Accessibility contract:
 * - Uses native `button` semantics by default.
 * - When `asChild` is true, ensure the child element provides button semantics.
 * - Loading state disables button and shows spinner.
 * - Error state applies error styling.
 *
 * @param props - Button props including variant, size, and stateful options.
 * @param props.variant - Visual style for the button.
 * @param props.size - Size variant for the button.
 * @param props.asChild - Renders the child element via Radix Slot (default: `false`).
 * @param props.loading - Shows loading spinner and disables button (default: `false`).
 * @param props.error - Error message, applies error styling when set.
 * @param props.disabled - Disabled state (also set automatically when loading).
 * @param props.onStateChange - Callback when component state changes.
 * @returns A styled button element.
 *
 * @example
 * ```tsx
 * <Button variant="secondary" size="sm">Cancel</Button>
 * <Button loading>Loading...</Button>
 * <Button error="Failed to submit">Retry</Button>
 * ```
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  error,
  disabled = false,
  onStateChange,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> &
  StatefulComponentProps & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

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

  // Button is effectively disabled when loading or explicitly disabled
  const isDisabled = disabled || loading;

  // When using asChild with Slot, we can only have one child
  // The loading spinner can't be rendered in asChild mode
  const buttonChildren = asChild ? (
    children
  ) : (
    <>
      {loading && <ButtonSpinner />}
      {children}
    </>
  );

  return (
    <Comp
      data-slot="button"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant, size, className }),
        // Error state styling
        error &&
          "border-foundation-accent-red text-foundation-accent-red hover:bg-foundation-accent-red/10",
        // Loading state styling
        loading && "opacity-70 cursor-wait",
        // Focus ring for error state
        error && "focus-visible:ring-foundation-accent-red",
      )}
      {...props}
    >
      {buttonChildren}
    </Comp>
  );
}

export { Button, buttonVariants };
