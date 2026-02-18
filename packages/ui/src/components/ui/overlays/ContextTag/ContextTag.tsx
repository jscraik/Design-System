import { IconX } from "../../../../icons";
import { cn } from "../../utils";

/**
 * Props for the context tag component.
 */
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
    bg: "bg-status-success-muted/20",
    text: "text-foreground",
    hover: "hover:bg-status-success-muted/30",
  },
  blue: {
    bg: "bg-interactive/20",
    text: "text-foreground",
    hover: "hover:bg-interactive/30",
  },
  orange: {
    bg: "bg-status-warning/20",
    text: "text-foreground",
    hover: "hover:bg-status-warning/30",
  },
  red: {
    bg: "bg-status-error-muted/20",
    text: "text-foreground",
    hover: "hover:bg-status-error-muted/30",
  },
  default: {
    bg: "bg-muted",
    text: "text-foreground",
    hover: "hover:bg-secondary",
  },
};

/**
 * Renders a dismissible tag showing active context.
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
 *
 * @param props - Context tag props.
 * @returns A contextual tag element.
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
    sm: "px-2 py-1 text-caption gap-1.5",
    md: "px-3 py-1.5 text-body-small gap-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg font-normal",
        styles.bg,
        styles.text,
        sizes[size],
        className,
      )}
    >
      {icon && <span className="size-3.5 [&>svg]:w-full [&>svg]:h-full">{icon}</span>}
      <span>{label}</span>
      {onClose && (
        <button
          type="button"
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
