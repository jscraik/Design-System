import type { ReactNode } from "react";

interface UsageCardProps {
  title: string;
  description: string;
  token: string;
  value: string;
  example: ReactNode;
}

/** Card component displaying usage examples for spacing tokens. */
export function UsageCard({ title, description, token, value, example }: UsageCardProps) {
  return (
    <div className="rounded-2xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 overflow-hidden">
      <div className="p-5 border-b border-foundation-bg-dark-3">
        <h4 className="text-sm font-semibold text-foundation-text-dark-primary mb-1">{title}</h4>
        <p className="text-xs text-foundation-text-dark-tertiary">{description}</p>
        <div className="mt-2 flex items-center gap-2">
          <code className="text-xs font-mono px-2 py-1 rounded bg-foundation-bg-dark-3 text-foundation-accent-blue">
            {token}
          </code>
          <span className="text-xs text-foundation-text-dark-tertiary">→ {value}</span>
        </div>
      </div>
      <div className="p-5 bg-foundation-bg-dark-3/30">{example}</div>
    </div>
  );
}

export { UsageCard as default }; // Default export for convenience
