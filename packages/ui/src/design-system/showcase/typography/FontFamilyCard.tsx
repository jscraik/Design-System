import { IconCheck, IconCopy } from "./icons";

interface FontFamilyCardProps {
  name: string;
  family: string;
  weights: string[];
  sample: string;
  onCopy: (v: string) => void;
  copiedValue: string | null;
}

/** FontFamilyCard displays a font family with sample text and available weights. */
export function FontFamilyCard({
  name,
  family,
  weights,
  sample,
  onCopy,
  copiedValue,
}: FontFamilyCardProps) {
  const fontValue = `font-family: ${family};`;
  return (
    <div className="rounded-2xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 p-5 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foundation-text-dark-primary">{name}</h3>
          <p className="text-xs text-foundation-text-dark-tertiary font-mono mt-1">{family}</p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(fontValue)}
          aria-label={`Copy ${name} font family`}
          className="p-2 rounded-lg hover:bg-foundation-bg-dark-3 transition-colors"
        >
          {copiedValue === fontValue ? (
            <IconCheck className="size-4 text-foundation-accent-green" />
          ) : (
            <IconCopy className="size-4 text-foundation-text-dark-tertiary" />
          )}
        </button>
      </div>
      <div className="mb-4 p-4 rounded-xl bg-foundation-bg-dark-3/50">
        <div
          className="text-5xl text-foundation-text-dark-primary mb-2"
          style={{ fontFamily: family }}
        >
          {sample}
        </div>
        <div className="flex gap-2 flex-wrap">
          {weights.map((w) => (
            <span
              key={w}
              className="text-xs px-2 py-1 rounded-full bg-foundation-bg-dark-3 text-foundation-text-dark-secondary"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
      <div className="text-xs text-foundation-text-dark-tertiary font-mono">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
        <br />
        abcdefghijklmnopqrstuvwxyz
        <br />
        0123456789 !@#$%^&*()
      </div>
    </div>
  );
}
