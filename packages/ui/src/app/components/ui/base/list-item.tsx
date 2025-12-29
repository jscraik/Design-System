import type { ReactNode } from "react";

import { IconChevronRightMd } from "../../../../icons";
import { cn } from "../utils";

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
}

/**
 * ListItem - A versatile list item component
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
}: ListItemProps) {
  const sizes = {
    sm: "px-2 py-1.5",
    md: "px-3 py-2.5",
    lg: "px-4 py-3",
  };

  const isButton = Boolean(onClick);
  const Component = isButton ? "button" : "div";

  return (
    <Component
      {...(isButton ? { type: "button" as const, disabled } : {})}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "w-full flex items-center justify-between rounded-lg transition-colors text-left",
        sizes[size],
        onClick &&
          "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-2 cursor-pointer",
        selected && "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div className="flex-shrink-0 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary truncate">
            {label}
          </div>
          {description && (
            <div className="text-[12px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary leading-[16px] tracking-[-0.3px] truncate">
              {description}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {right}
        {showChevron && (
          <IconChevronRightMd className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
        )}
      </div>
    </Component>
  );
}

export interface ListItemCheckProps extends Omit<ListItemProps, "right" | "showChevron"> {
  /** Whether the item is checked */
  checked?: boolean;
}

/**
 * ListItemCheck - A list item with a checkmark indicator
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
