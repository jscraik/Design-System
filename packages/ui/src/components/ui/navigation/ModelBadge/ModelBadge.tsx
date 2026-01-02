import { cn } from "../../utils";

/**
 * Props for the model badge component.
 */
export interface ModelBadgeProps {
  /** Model name to display */
  name: string;
  /** Color variant */
  variant?: "blue" | "green" | "orange" | "default";
  /** Size variant */
  size?: "sm" | "md";
  /** Additional CSS classes */
  className?: string;
}

const variantStyles = {
  blue: "text-foundation-accent-blue bg-foundation-accent-blue/20",
  green: "text-foundation-accent-green bg-foundation-accent-green/20",
  orange: "text-foundation-accent-orange bg-foundation-accent-orange/20",
  default: "text-foundation-text-dark-secondary bg-foundation-bg-dark-3",
};

/**
 * Renders a badge displaying the current model name.
 *
 * @example
 * ```tsx
 * <ModelBadge name="GPT-4o" variant="blue" />
 * ```
 *
 * @param props - Model badge props.
 * @returns A model badge element.
 */
export function ModelBadge({ name, variant = "blue", size = "sm", className }: ModelBadgeProps) {
  const sizes = {
    sm: "px-2 py-1 text-caption leading-tight",
    md: "px-3 py-1.5 text-caption",
  };

  return (
    <div className={cn("rounded-md font-medium", variantStyles[variant], sizes[size], className)}>
      {name}
    </div>
  );
}

ModelBadge.displayName = "ModelBadge";
