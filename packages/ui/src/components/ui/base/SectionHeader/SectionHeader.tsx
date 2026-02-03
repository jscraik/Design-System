import { cn } from "../../utils";

/**
 * Props for the section header component.
 */
export interface SectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional description */
  description?: string;
  /** Right-side content (buttons, badges, etc.) */
  right?: React.ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Description CSS classes */
  descriptionClassName?: string;
}

/**
 * Renders a header for content sections.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Settings"
 *   description="Manage your preferences"
 *   right={<Button size="sm">Save</Button>}
 * />
 * ```
 *
 * @param props - Section header props.
 * @returns A section header element.
 */
export function SectionHeader({
  title,
  description,
  right,
  size = "md",
  className,
  descriptionClassName,
}: SectionHeaderProps) {
  const sizes = {
    sm: {
      title: "text-caption",
      description: "text-caption",
    },
    md: {
      title: "text-body-small",
      description: "text-caption",
    },
    lg: {
      title: "text-body",
      description: "text-body-small",
    },
  };

  return (
    <div className={cn("flex items-start justify-between font-foundation", className)}>
      <div>
        <h3 className={cn("font-semibold text-foreground tracking-body-small", sizes[size].title)}>
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "font-normal text-text-secondary tracking-body-small mt-1",
              sizes[size].description,
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}

SectionHeader.displayName = "SectionHeader";
