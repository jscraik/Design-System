import { useState } from "react";

import { IconChevronDownMd } from "../../../../icons";

import { cn } from "../utils";

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
 * CollapsibleSection - An expandable/collapsible section
 *
 * @example
 * ```tsx
 * <CollapsibleSection title="Advanced Options" defaultExpanded={false}>
 *   <SettingsForm />
 * </CollapsibleSection>
 * ```
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
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between py-2 text-left group",
          headerClassName,
        )}
      >
        <div className="flex items-center gap-2">
          <IconChevronDownMd
            className={cn(
              "size-4 text-foundation-text-dark-tertiary transition-transform",
              !expanded && "-rotate-90",
            )}
          />
          <span className="text-[12px] font-semibold leading-[18px] tracking-[-0.32px] text-white/60 uppercase">
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
