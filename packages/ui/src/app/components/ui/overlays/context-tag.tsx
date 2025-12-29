import { IconX } from "../../../../icons";
import { cn } from "../utils";

export interface ContextTagProps {
  /** Icon to display */
  icon?: React.ReactNode;
  /** Tag label text */
  label: string;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Color variant */
  variant?: "green" | "blue" | "orange" | "red" | "default";
  /** Size variant */
  size?: "sm" | "md";
  /** Additional CSS classes */
  className?: string;
}

const variantStyles = {
  green: {
    bg: "bg-foundation-accent-green/20",
    text: "text-foundation-accent-green",
    hover: "hover:bg-foundation-accent-green/30",
  },
  blue: {
    bg: "bg-foundation-accent-blue/20",
    text: "text-foundation-accent-blue",
    hover: "hover:bg-foundation-accent-blue/30",
  },
  orange: {
    bg: "bg-foundation-accent-orange/20",
    text: "text-foundation-accent-orange",
    hover: "hover:bg-foundation-accent-orange/30",
  },
  red: {
    bg: "bg-foundation-accent-red/20",
    text: "text-foundation-accent-red",
    hover: "hover:bg-foundation-accent-red/30",
  },
  default: {
    bg: "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3",
    text: "text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
    hover: "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2",
  },
};

/**
 * ContextTag - A dismissible tag showing active context
 *
 * @example
 * ```tsx
 * <ContextTag
 *   icon={<IconFile />}
 *   label="main.tsx"
 *   onClose={() => removeContext()}
 *   variant="green"
 * />
 * ```
 */
export function ContextTag({
  icon,
  label,
  onClose,
  variant = "green",
  size = "md",
  className,
}: ContextTagProps) {
  const styles = variantStyles[variant];
  const sizes = {
    sm: "px-2 py-1 text-[12px] gap-1.5",
    md: "px-3 py-1.5 text-[14px] gap-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg font-normal leading-[20px] tracking-[-0.3px]",
        styles.bg,
        styles.text,
        sizes[size],
        className,
      )}
    >
      {icon && <span className="size-3.5 [&>svg]:w-full [&>svg]:h-full">{icon}</span>}
      <span>{label}</span>
      {onClose && (
        <button type="button"
          onClick={onClose}
          aria-label={`Remove ${label}`}
          title={`Remove ${label}`}
          className={cn("rounded-full p-0.5 transition-colors", styles.hover)}
        >
          <IconX className="size-3" />
        </button>
      )}
    </div>
  );
}

ContextTag.displayName = "ContextTag";
