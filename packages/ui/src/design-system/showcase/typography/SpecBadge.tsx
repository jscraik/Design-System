import { cn } from "../../../components/ui/utils";

import { IconCheck, IconCopy } from "./icons";

interface SpecBadgeProps {
  label: string;
  value: string;
  onCopy: (v: string) => void;
  isCopied: boolean;
}

/** SpecBadge displays a typography specification with copy functionality. */
export function SpecBadge({ label, value, onCopy, isCopied }: SpecBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      aria-label={`Copy ${label}: ${value}`}
      className={cn(
        "group flex flex-col gap-0.5 rounded-lg px-3 py-2 transition-all duration-150 bg-foundation-bg-dark-3/50 hover:bg-foundation-bg-dark-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue text-left min-w-[80px]",
      )}
    >
      <span className="text-[10px] text-foundation-text-dark-tertiary uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium text-foundation-text-dark-primary group-hover:text-foundation-accent-blue transition-colors flex items-center gap-1">
        {value}
        {isCopied ? (
          <IconCheck className="size-3 text-foundation-accent-green" />
        ) : (
          <IconCopy className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </button>
  );
}
