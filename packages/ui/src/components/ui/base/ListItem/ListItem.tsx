import * as React from "react";
import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

import { IconChevronRightMd } from "../../../../icons";
import { cn } from "../../utils";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

/**
 * Props for the list item component.
 */
export interface ListItemProps extends StatefulComponentProps {
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
  loading = false,
  error,
  required,
  onStateChange,
  className,
  size = "md",
  ariaLabel,
  title,
  dataRailItem,
  dataTestId,
}: ListItemProps) {
  // Determine effective state (priority: loading > error > disabled > default)
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

  const iconSizeClass = size === "lg" ? "size-6" : size === "sm" ? "size-4" : "size-5";
  const iconWrapperSizeClass =
    size === "lg" ? "[&>svg]:size-6" : size === "sm" ? "[&>svg]:size-4" : "[&>svg]:size-5";
  const iconElement =
    isValidElement(icon) && typeof icon.type !== "string"
      ? cloneElement(icon as ReactElement<{ className?: string }>, {
          className: (() => {
            const existing = (icon.props as { className?: string }).className ?? "";
            const hasExplicitSize = /\bsize-\d+\b/.test(existing);
            return cn(existing, hasExplicitSize ? null : iconSizeClass);
          })(),
        })
      : icon;
  const sizes = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-5 py-4",
  };

  const isButton = Boolean(onClick);
  const isDisabled = disabled || loading;
  const Component = isButton ? "button" : "div";

  return (
    <Component
      {...(isButton ? { type: "button" as const, disabled: isDisabled } : {})}
      onClick={isDisabled ? undefined : onClick}
      aria-label={ariaLabel}
      title={title}
      data-rail-item={dataRailItem ? "true" : undefined}
      data-testid={dataTestId}
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={loading || undefined}
      className={cn(
        "group w-full flex items-center justify-between rounded-10 transition-colors text-left",
        sizes[size],
        onClick &&
          "hover:bg-foundation-bg-light-2/80 dark:hover:bg-foundation-bg-dark-2/80 cursor-pointer",
        selected && "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2",
        isDisabled && "opacity-50 cursor-not-allowed",
        error && "border border-foundation-accent-red/50",
        loading && "animate-pulse",
        dataRailItem && "justify-center px-2",
        className,
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div
            className={cn(
              "flex-shrink-0 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary [&>svg]:shrink-0",
              iconWrapperSizeClass,
            )}
          >
            {iconElement}
          </div>
        )}
        <div className={cn("flex-1 min-w-0", dataRailItem && "hidden")}>
          <div className="text-list-title text-foundation-text-light-primary dark:text-foundation-text-dark-primary truncate">
            {label}
          </div>
          {description && (
            <div className="text-list-subtitle text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary truncate">
              {description}
            </div>
          )}
        </div>
      </div>

      <div className={cn("flex items-center gap-2 flex-shrink-0 ml-2", dataRailItem && "hidden")}>
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
