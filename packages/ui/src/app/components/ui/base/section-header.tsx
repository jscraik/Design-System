import { cn } from "../utils";

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
 * SectionHeader - A header for content sections
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Settings"
 *   description="Manage your preferences"
 *   right={<Button size="sm">Save</Button>}
 * />
 * ```
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
      description: "text-[11px]", // Fallback for smaller than caption
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
        <h3
          className={cn(
            "font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary tracking-body-small",
            sizes[size].title,
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "font-normal text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary tracking-body-small mt-1",
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
