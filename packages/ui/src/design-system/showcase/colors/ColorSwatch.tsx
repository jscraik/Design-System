import { cn } from "../../../components/ui/utils";

import { IconCheck, IconCopy } from "./icons";

interface ColorSwatchProps {
  name: string;
  value: string;
  onCopy: (value: string) => void;
  isCopied: boolean;
  isDark?: boolean;
  variant?: "compact" | "detailed";
}

/** ColorSwatch displays a color with copy functionality. */
export function ColorSwatch({
  name,
  value,
  onCopy,
  isCopied,
  isDark = true,
  variant = "compact",
}: ColorSwatchProps) {
  const textClass = isDark
    ? "text-foundation-text-dark-primary"
    : "text-foundation-text-light-primary";
  const valueClass = isDark
    ? "text-foundation-text-dark-tertiary"
    : "text-foundation-text-light-tertiary";
  const borderClass = isDark ? "border-foundation-bg-dark-3" : "border-foundation-bg-light-3";

  if (variant === "detailed") {
    return (
      <button
        type="button"
        onClick={() => onCopy(value)}
        aria-label={`Copy ${name}: ${value}`}
        className={cn(
          "group flex flex-col gap-3 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-2 rounded-lg",
        )}
      >
        <div className="relative overflow-hidden rounded-xl">
          <div
            className={cn(
              "h-24 w-full rounded-xl border-2 shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:border-foundation-accent-blue/50",
              borderClass,
            )}
            style={{ backgroundColor: value }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-foundation-bg-dark-1/0 group-hover:bg-foundation-bg-dark-1/10 transition-all duration-200 rounded-xl">
            <div className="bg-foundation-bg-light-1/95 dark:bg-foundation-bg-dark-2/95 backdrop-blur-sm rounded-full p-2.5 transform scale-0 group-hover:scale-100 transition-transform duration-200 shadow-lg">
              {isCopied ? (
                <IconCheck className="size-4 text-foundation-accent-green" />
              ) : (
                <IconCopy className="size-4 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col px-1">
          <p className={cn("text-sm font-medium", textClass)}>{name}</p>
          <p
            className={cn(
              "text-xs font-mono group-hover:text-foundation-accent-blue transition-colors",
              valueClass,
            )}
          >
            {value}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      aria-label={`Copy ${name}: ${value}`}
      className={cn(
        "group flex items-center gap-3 w-full text-left p-2 -m-2 rounded-lg transition-all duration-150 hover:bg-foundation-bg-light-2/50 dark:hover:bg-foundation-bg-dark-3/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            "size-11 rounded-lg border shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105",
            borderClass,
          )}
          style={{ backgroundColor: value }}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {isCopied ? (
            <IconCheck className="size-4 text-foundation-text-dark-primary drop-shadow-md" />
          ) : (
            <IconCopy className="size-3.5 text-foundation-text-dark-primary drop-shadow-md" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm font-medium truncate", textClass)}>{name}</div>
        <div
          className={cn(
            "text-xs font-mono truncate group-hover:text-foundation-accent-blue transition-colors",
            valueClass,
          )}
        >
          {value}
        </div>
      </div>
    </button>
  );
}
