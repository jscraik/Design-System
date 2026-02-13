import { useCallback, useState } from "react";
import { cn } from "../../../components/ui/utils";
import { IconCheckmark, IconCopy } from "../../../icons/ChatGPTIcons";

interface ColorSwatchProps {
  label: string;
  cssVar: string;
}

/** ColorSwatch displays a CSS variable color with copy functionality. */
export function ColorSwatch({ label, cssVar }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(`var(${cssVar})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssVar]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
        "bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2",
        "hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
        "group text-left w-full",
      )}
      aria-label={`Copy ${label} color value`}
    >
      <div
        className="size-10 rounded-lg border border-foundation-bg-light-4 dark:border-foundation-bg-dark-4 shadow-sm shrink-0"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary truncate">
          {label}
        </div>
        <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-mono truncate">
          var({cssVar})
        </div>
      </div>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <IconCheckmark className="size-4 text-foundation-accent-green" />
        ) : (
          <IconCopy className="size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
        )}
      </div>
    </button>
  );
}
