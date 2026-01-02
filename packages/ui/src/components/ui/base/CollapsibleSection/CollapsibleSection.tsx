import { useState } from "react";

import { IconChevronRightMd } from "../../../../icons";
import { cn } from "../../utils";

/**
 * Props for the collapsible section component.
 */
export interface CollapsibleSectionProps {
  /** Section title */
  title: string;
  /** Whether the section is expanded */
  defaultExpanded?: boolean;
  /** Controlled expanded state */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Section content */
  children?: React.ReactNode;
  /** Right-side content in header */
  headerRight?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Header CSS classes */
  headerClassName?: string;
  /** Content CSS classes */
  contentClassName?: string;
}

/**
 * Renders an expandable/collapsible section.
 *
 * Supports controlled (`expanded`) and uncontrolled (`defaultExpanded`) usage.
 *
 * @example
 * ```tsx
 * <CollapsibleSection title="Advanced Options" defaultExpanded={false}>
 *   <SettingsForm />
 * </CollapsibleSection>
 * ```
 *
 * @param props - Collapsible section props.
 * @returns A collapsible section element.
 */
export function CollapsibleSection({
  title,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  children,
  headerRight,
  className,
  headerClassName,
  contentClassName,
}: CollapsibleSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    const newValue = !expanded;
    if (!isControlled) {
      setInternalExpanded(newValue);
    }
    onExpandedChange?.(newValue);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3/40",
          headerClassName,
        )}
      >
        <div className="flex items-center gap-2">
          <IconChevronRightMd
            className={cn(
              "size-3 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary transition-transform",
              expanded && "rotate-90",
            )}
          />
          <span className="text-caption text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            {title}
          </span>
        </div>
        {headerRight}
      </button>

      {expanded && <div className={cn("mt-1", contentClassName)}>{children}</div>}
    </div>
  );
}

CollapsibleSection.displayName = "CollapsibleSection";
