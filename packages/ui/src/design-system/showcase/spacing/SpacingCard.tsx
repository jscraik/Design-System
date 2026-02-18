import { cn } from "../../../components/ui/utils";

import { IconCheck, IconCopy } from "./icons";

interface SpacingCardProps {
  token: string;
  value: number;
  onCopy: (v: string) => void;
  copiedValue: string | null;
}

/** Card component displaying individual spacing token with visual box. */
export function SpacingCard({ token, value, onCopy, copiedValue }: SpacingCardProps) {
  const pxValue = `${value}px`;
  const isCopied = copiedValue === pxValue;

  return (
    <button
      type="button"
      onClick={() => onCopy(pxValue)}
      aria-label={`Copy ${token}: ${pxValue}`}
      className={cn(
        "group rounded-2xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 p-4 transition-all duration-200",
        "hover:shadow-lg hover:border-foundation-bg-dark-4 hover:scale-[1.02]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
        "text-left w-full",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foundation-text-dark-primary">{token}</span>
        <span className="text-xs font-mono text-foundation-text-dark-tertiary group-hover:text-foundation-accent-blue transition-colors flex items-center gap-1">
          {pxValue}
          {isCopied ? (
            <IconCheck className="size-3 text-foundation-accent-green" />
          ) : (
            <IconCopy className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </div>
      <div className="bg-foundation-bg-dark-3/50 rounded-lg p-3 flex items-center justify-center min-h-[80px]">
        {value > 0 ? (
          <div
            className="bg-foundation-accent-blue rounded"
            style={{ width: value, height: value, minWidth: 4, minHeight: 4 }}
          />
        ) : (
          <span className="text-xs text-foundation-text-dark-tertiary">0px</span>
        )}
      </div>
    </button>
  );
}
