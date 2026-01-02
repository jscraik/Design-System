import type { ReactNode } from "react";

import { IconChevronRightMd } from "../../../../icons";
import { cn } from "../../utils";

/**
 * Props for the list item component.
 */
export interface ListItemProps {
  /** Icon to display on the left */
  icon?: ReactNode;
  /** Primary label text */
  label: string;
  /** Secondary description text */
  description?: string;
  /** Content to display on the right */
  right?: ReactNode;
  /** Whether to show a chevron on the right */
  showChevron?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether the item is selected */
  selected?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Accessible label (useful when label text is visually hidden) */
  ariaLabel?: string;
  /** Optional title tooltip */
  title?: string;
  /** Marks a rail item (for collapsed sidebar navigation) */
  dataRailItem?: boolean;
  /** Optional test id */
  dataTestId?: string;
}

/**
 * Renders a versatile list item component.
 *
 * @example
 * ```tsx
 * <ListItem
 *   icon={<IconSettings />}
 *   label="Settings"
 *   description="Manage your preferences"
 *   showChevron
 *   onClick={() => openSettings()}
 * />
 * ```
 *
 * @param props - List item props.
 * @returns A list item element.
 */
export function ListItem({
  icon,
  label,
  description,
  right,
  showChevron = false,
  onClick,
  selected = false,
  disabled = false,
  className,
  size = "md",
  ariaLabel,
  title,
  dataRailItem,
  dataTestId,
}: ListItemProps) {
  const sizes = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-5 py-4",
  };

  const isButton = Boolean(onClick);
  const Component = isButton ? "button" : "div";

  return (
    <Component
      {...(isButton ? { type: "button" as const, disabled } : {})}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      title={title}
      data-rail-item={dataRailItem ? "true" : undefined}
      data-testid={dataTestId}
      className={cn(
        "w-full flex items-center justify-between rounded-10 transition-colors text-left",
        sizes[size],
        onClick &&
          "hover:bg-secondary/60 dark:hover:bg-secondary/40 cursor-pointer",
        selected && "bg-secondary/60 dark:bg-secondary/40",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div className="flex-shrink-0 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-list-title text-foreground truncate">
            {label}
          </div>
          {description && (
            <div className="text-list-subtitle text-text-secondary truncate">
              {description}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {right}
        {showChevron && (
          <IconChevronRightMd className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
        )}
      </div>
    </Component>
  );
}

/**
 * Props for the list item check variant.
 */
export interface ListItemCheckProps extends Omit<ListItemProps, "right" | "showChevron"> {
  /** Whether the item is checked */
  checked?: boolean;
}

/**
 * Renders a list item with a checkmark indicator.
 *
 * @param props - List item check props.
 * @returns A list item element with a checkmark.
 */
export function ListItemCheck({ checked = false, ...props }: ListItemCheckProps) {
  return (
    <ListItem
      {...props}
      right={
        checked && (
          <svg
            className="size-4 text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )
      }
    />
  );
}

ListItem.displayName = "ListItem";
ListItemCheck.displayName = "ListItemCheck";
