import { IconCheck, IconCopy } from "./icons";

interface CSSVariableSwatchProps {
  name: string;
  description: string;
  onCopy: (v: string) => void;
  isCopied: boolean;
}

/** CSSVariableSwatch displays a CSS variable with live preview and copy functionality. */
export function CSSVariableSwatch({
  name,
  description,
  onCopy,
  isCopied,
}: CSSVariableSwatchProps) {
  const copyValue = `var(${name})`;
  return (
    <button
      type="button"
      onClick={() => onCopy(copyValue)}
      aria-label={`Copy ${name}`}
      className="group flex items-center gap-3 w-full text-left p-2 -m-2 rounded-lg transition-all duration-150 hover:bg-foundation-bg-dark-3/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue"
    >
      <div className="relative shrink-0">
        <div
          className="size-11 rounded-lg border border-foundation-bg-dark-3 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105"
          style={{ backgroundColor: `var(${name})` }}
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
        <div className="text-sm font-medium text-foundation-text-dark-primary truncate">
          {description}
        </div>
        <div className="text-xs font-mono text-foundation-text-dark-tertiary truncate group-hover:text-foundation-accent-blue transition-colors">
          {name}
        </div>
      </div>
    </button>
  );
}
