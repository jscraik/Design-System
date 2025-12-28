import { cn } from "../utils";

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
  /** Button type */
  type?: "button" | "submit" | "reset";
};

/**
 * IconButton - A button that displays only an icon
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<IconCopy />}
 *   onClick={handleCopy}
 *   title="Copy to clipboard"
 * />
 * ```
 */
export function IconButton({
  icon,
  onClick,
  title,
  ariaLabel,
  size = "md",
  variant = "ghost",
  active = false,
  activeColor = "var(--foundation-accent-blue)",
  disabled = false,
  className,
  type = "button",
}: IconButtonProps) {
  const accessibleLabel = ariaLabel ?? title;

  if (!accessibleLabel && process.env.NODE_ENV !== "production") {
    // Enforce accessible names for icon-only buttons in dev builds.
    // eslint-disable-next-line no-console
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
      "border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2",
    solid:
      "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={accessibleLabel}
      className={cn(
        "rounded-md transition-colors flex items-center justify-center font-foundation",
        sizes[size],
        variants[variant],
        active && `bg-[${activeColor}]/10`,
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
          iconSizes[size],
          "text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary hover:text-foundation-icon-light-primary dark:hover:text-foundation-icon-dark-primary transition-colors",
          "[&>svg]:w-full [&>svg]:h-full",
        )}
        style={active ? { color: activeColor } : undefined}
      >
        {icon}
      </span>
    </button>
  );
}

IconButton.displayName = "IconButton";
