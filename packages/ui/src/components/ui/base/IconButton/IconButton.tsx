import type { ReactElement } from "react";
import { cloneElement, isValidElement } from "react";

import { cn } from "../../utils";

type IconButtonLabelProps =
  | {
      /** Tooltip/title text */
      title: string;
      /** Explicit aria-label (overrides title for accessibility if provided) */
      ariaLabel?: string;
    }
  | {
      /** Tooltip/title text */
      title?: string;
      /** Explicit aria-label (required when no title is provided) */
      ariaLabel: string;
    };

/**
 * Props for the icon-only button component.
 */
export type IconButtonProps = IconButtonLabelProps & {
  /** Icon to display */
  icon: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "ghost" | "outline" | "solid";
  /** Whether the button is active/pressed */
  active?: boolean;
  /** Active color when pressed */
  activeColor?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional classes to override icon color/size behavior */
  iconClassName?: string;
  /** Button type */
  type?: "button" | "submit" | "reset";
  /** Standard aria-label (preferred when wiring from JSX) */
  "aria-label"?: string;
  /** Standard aria-labelledby */
  "aria-labelledby"?: string;
};

/**
 * Renders a button that displays only an icon.
 *
 * Accessibility contract:
 * - Provide `title` or `ariaLabel` so the control has an accessible name.
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<IconCopy />}
 *   onClick={handleCopy}
 *   title="Copy to clipboard"
 * />
 * ```
 *
 * @param props - Icon button props.
 * @returns An icon-only button element.
 */
export function IconButton({
  icon,
  onClick,
  title,
  ariaLabel,
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledBy,
  size = "md",
  variant = "ghost",
  active = false,
  activeColor = "var(--foundation-accent-blue)",
  disabled = false,
  className,
  iconClassName,
  type = "button",
}: IconButtonProps) {
  const accessibleLabel = ariaLabel ?? ariaLabelProp ?? title;

  if (!accessibleLabel && process.env.NODE_ENV !== "production") {
    // Enforce accessible names for icon-only buttons in dev builds.

    console.warn("IconButton requires a title or ariaLabel for accessibility.");
  }

  const sizes = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
  };

  const iconSizes = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  };

  const variants = {
    ghost: "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
    outline:
      "border border-foundation-bg-dark-3 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2",
    solid:
      "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
  };

  const iconElement = isValidElement(icon)
    ? cloneElement(icon as ReactElement<{ className?: string }>, {
        className: cn((icon.props as { className?: string }).className, iconSizes[size]),
      })
    : icon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabelledBy ? undefined : accessibleLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "rounded-md transition-colors flex items-center justify-center font-foundation min-h-[var(--foundation-size-hit-target)] min-w-[var(--foundation-size-hit-target)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-foundation-text-light-primary dark:focus-visible:ring-foundation-text-dark-primary",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-foundation-bg-light-1 dark:focus-visible:ring-offset-foundation-bg-dark-2",
        "motion-reduce:transition-none",
        sizes[size],
        variants[variant],
        // active background handled via inline style (color-mix) below
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={
        active
          ? { backgroundColor: `color-mix(in srgb, ${activeColor} 10%, transparent)` }
          : undefined
      }
    >
      <span
        className={cn(
          "text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary transition-colors",
          "motion-reduce:transition-none",
          "[&>svg]:w-full [&>svg]:h-full",
          iconClassName,
        )}
        style={active ? { color: activeColor } : undefined}
      >
        {iconElement}
      </span>
    </button>
  );
}

IconButton.displayName = "IconButton";
