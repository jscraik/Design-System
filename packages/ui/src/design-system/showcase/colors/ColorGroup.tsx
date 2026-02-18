import type { ReactNode } from "react";

import { cn } from "../../../components/ui/utils";

import { ColorSwatch } from "./ColorSwatch";

interface ColorGroupProps {
  title: string;
  colors: Record<string, string>;
  isDark?: boolean;
  onCopy: (value: string) => void;
  copiedValue: string | null;
  variant?: "compact" | "detailed";
  icon?: ReactNode;
}

/** ColorGroup displays a group of colors with optional icon and variant. */
export function ColorGroup({
  title,
  colors,
  isDark = true,
  onCopy,
  copiedValue,
  variant = "compact",
  icon,
}: ColorGroupProps) {
  const entries = Object.entries(colors);
  const groupClass = isDark
    ? "bg-foundation-bg-dark-2 border-foundation-bg-dark-3"
    : "bg-foundation-bg-light-1 border-foundation-bg-light-3";
  const textClass = isDark
    ? "text-foundation-text-dark-primary"
    : "text-foundation-text-light-primary";
  const subtleClass = isDark
    ? "text-foundation-text-dark-tertiary"
    : "text-foundation-text-light-tertiary";

  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "rounded-2xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md",
          groupClass,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isDark
                    ? "bg-foundation-bg-dark-3 text-foundation-text-dark-secondary"
                    : "bg-foundation-bg-light-2 text-foundation-text-light-secondary",
                )}
              >
                {icon}
              </div>
            )}
            <h3 className={cn("font-semibold text-[15px]", textClass)}>{title}</h3>
          </div>
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              isDark ? "bg-foundation-bg-dark-3" : "bg-foundation-bg-light-2",
              subtleClass,
            )}
          >
            {entries.length} {entries.length === 1 ? "color" : "colors"}
          </span>
        </div>
        <div
          className={cn(
            "h-px w-full mb-5",
            isDark ? "bg-foundation-bg-dark-3" : "bg-foundation-bg-light-3",
          )}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {entries.map(([n, v]) => (
            <ColorSwatch
              key={n}
              name={n}
              value={v}
              onCopy={onCopy}
              isCopied={copiedValue === v}
              isDark={isDark}
              variant="detailed"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl p-5 border", groupClass)}>
      <h3 className={cn("text-sm font-semibold mb-4", textClass)}>{title}</h3>
      <div className="space-y-1">
        {entries.map(([n, v]) => (
          <ColorSwatch
            key={n}
            name={n}
            value={v}
            onCopy={onCopy}
            isCopied={copiedValue === v}
            isDark={isDark}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}
