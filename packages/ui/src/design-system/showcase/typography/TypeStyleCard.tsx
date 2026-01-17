import { cn } from "../../../components/ui/utils";

import { IconCheck, IconCopy, IconType } from "./icons";
import { SpecBadge } from "./SpecBadge";

export interface TypeStyle {
  name: string;
  displayName: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  className: string;
  description: string;
}

interface TypeStyleCardProps {
  style: TypeStyle;
  onCopy: (v: string) => void;
  copiedValue: string | null;
  viewMode: "preview" | "specs" | "code";
}

/** TypeStyleCard displays a typography style with preview, specs, and code views. */
export function TypeStyleCard({ style, onCopy, copiedValue, viewMode }: TypeStyleCardProps) {
  const cssCode = `.${style.name} {\n  font-size: ${style.size};\n  font-weight: ${style.weight};\n  line-height: ${style.lineHeight};\n  letter-spacing: ${style.letterSpacing};\n}`;
  const tailwindCode = `className="${style.className}"`;

  return (
    <div className="rounded-2xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-foundation-bg-dark-4">
      <div className="px-5 py-4 border-b border-foundation-bg-dark-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-foundation-bg-dark-3">
            <IconType className="size-4 text-foundation-text-dark-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foundation-text-dark-primary">
              {style.displayName}
            </h3>
            <p className="text-xs text-foundation-text-dark-tertiary">{style.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <SpecBadge
            label="Size"
            value={style.size}
            onCopy={onCopy}
            isCopied={copiedValue === style.size}
          />
          <SpecBadge
            label="Weight"
            value={style.weight}
            onCopy={onCopy}
            isCopied={copiedValue === style.weight}
          />
          <SpecBadge
            label="Line"
            value={style.lineHeight}
            onCopy={onCopy}
            isCopied={copiedValue === style.lineHeight}
          />
          <SpecBadge
            label="Track"
            value={style.letterSpacing}
            onCopy={onCopy}
            isCopied={copiedValue === style.letterSpacing}
          />
        </div>
      </div>
      <div className="p-5">
        {viewMode === "preview" && (
          <div className={cn(style.className, "text-foundation-text-dark-primary")}>
            The quick brown fox jumps over the lazy dog
          </div>
        )}
        {viewMode === "specs" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-foundation-text-dark-tertiary">Font Size</span>
              <p className="text-lg font-semibold text-foundation-text-dark-primary">
                {style.size}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-foundation-text-dark-tertiary">Font Weight</span>
              <p className="text-lg font-semibold text-foundation-text-dark-primary">
                {style.weight}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-foundation-text-dark-tertiary">Line Height</span>
              <p className="text-lg font-semibold text-foundation-text-dark-primary">
                {style.lineHeight}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-foundation-text-dark-tertiary">Letter Spacing</span>
              <p className="text-lg font-semibold text-foundation-text-dark-primary">
                {style.letterSpacing}
              </p>
            </div>
          </div>
        )}
        {viewMode === "code" && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foundation-text-dark-tertiary">Tailwind CSS</span>
                <button
                  type="button"
                  onClick={() => onCopy(tailwindCode)}
                  aria-label="Copy Tailwind code"
                  className="text-xs text-foundation-text-dark-tertiary hover:text-foundation-accent-blue transition-colors flex items-center gap-1"
                >
                  {copiedValue === tailwindCode ? (
                    <>
                      <IconCheck className="size-3 text-foundation-accent-green" /> Copied
                    </>
                  ) : (
                    <>
                      <IconCopy className="size-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-foundation-bg-dark-3 text-xs font-mono text-foundation-text-dark-primary overflow-x-auto">
                {tailwindCode}
              </pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foundation-text-dark-tertiary">CSS</span>
                <button
                  type="button"
                  onClick={() => onCopy(cssCode)}
                  aria-label="Copy CSS code"
                  className="text-xs text-foundation-text-dark-tertiary hover:text-foundation-accent-blue transition-colors flex items-center gap-1"
                >
                  {copiedValue === cssCode ? (
                    <>
                      <IconCheck className="size-3 text-foundation-accent-green" /> Copied
                    </>
                  ) : (
                    <>
                      <IconCopy className="size-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-foundation-bg-dark-3 text-xs font-mono text-foundation-text-dark-primary overflow-x-auto whitespace-pre">
                {cssCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
