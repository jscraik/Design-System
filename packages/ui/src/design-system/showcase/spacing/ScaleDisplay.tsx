import { cn } from "../../../components/ui/utils";

import { IconCheck, IconCopy } from "./icons";

interface ScaleBarProps {
  token: string;
  value: number;
  maxValue: number;
  onCopy: (v: string) => void;
  copiedValue: string | null;
}

/** Scale bar component displaying spacing token as horizontal bar. */
export function ScaleBar({ token, value, maxValue, onCopy, copiedValue }: ScaleBarProps) {
  const pxValue = `${value}px`;
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const isCopied = copiedValue === pxValue;

  return (
    <button
      type="button"
      onClick={() => onCopy(pxValue)}
      aria-label={`Copy ${token}: ${pxValue}`}
      className={cn(
        "group flex items-center gap-4 w-full p-2 -m-2 rounded-lg transition-all duration-150",
        "hover:bg-foundation-bg-dark-3/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
      )}
    >
      <span className="w-24 text-sm font-mono text-foundation-text-dark-tertiary shrink-0">
        {token}
      </span>
      <div className="flex-1 h-8 bg-foundation-bg-dark-3/50 rounded-lg overflow-hidden">
        <div
          className="h-full bg-foundation-accent-green rounded-lg transition-all duration-300"
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
      <span className="w-16 text-sm font-mono text-foundation-text-dark-primary text-right flex items-center justify-end gap-1">
        {pxValue}
        {isCopied ? (
          <IconCheck className="size-3 text-foundation-accent-green" />
        ) : (
          <IconCopy className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </button>
  );
}
