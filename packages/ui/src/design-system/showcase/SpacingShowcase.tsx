import { radiusTokens, spacingScale } from "@design-studio/tokens";

interface SpacingBoxProps {
  token: string;
  value: string;
  showBox?: boolean;
}

const spacingPx = (value: number) => `${value}px`;

const spacingEntries = [...spacingScale]
  .sort((a, b) => a - b)
  .map((value) => [String(value), spacingPx(value)] as const);

const semanticSpacing = {
  "container-padding": {
    sm: spacingPx(16),
    md: spacingPx(24),
    lg: spacingPx(32),
  },
  "component-gap": {
    sm: spacingPx(8),
    md: spacingPx(16),
    lg: spacingPx(24),
  },
  "section-spacing": {
    sm: spacingPx(32),
    md: spacingPx(48),
    lg: spacingPx(64),
  },
  "border-radius": {
    sm: spacingPx(radiusTokens.r6),
    md: spacingPx(radiusTokens.r8),
    lg: spacingPx(radiusTokens.r12),
    xl: spacingPx(radiusTokens.r16),
  },
} as const;

function SpacingBox({ token, value, showBox = true }: SpacingBoxProps) {
  return (
    <div className="rounded-xl p-4 bg-foundation-bg-dark-2 border border-foundation-text-dark-primary/10">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-foundation-text-dark-primary">{token}</div>
        <div className="text-xs font-mono text-foundation-text-dark-tertiary">{value}</div>
      </div>
      {showBox && (
        <div className="bg-foundation-bg-dark-3 rounded flex items-center justify-center">
          <div className="bg-foundation-accent-blue" style={{ width: value, height: value }} />
        </div>
      )}
    </div>
  );
}

/**
 * SpacingShowcase displays all spacing tokens from the design system.
 * Use this to verify spacing matches the 8px grid system.
 */
export function SpacingShowcase() {
  return (
    <div className="w-full max-w-6xl space-y-12">
      {/* Spacing Scale */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foundation-text-dark-primary mb-2">
            Spacing Scale
          </h2>
          <p className="text-body-small text-foundation-text-dark-secondary">
            Based on 8px grid system. Token number represents HALF the pixel value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spacingEntries.map(([token, value]) => (
            <SpacingBox key={token} token={`space-${token}`} value={value} />
          ))}
        </div>
      </section>

      {/* Visual Scale */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foundation-text-dark-primary mb-2">
            Visual Scale
          </h2>
          <p className="text-body-small text-foundation-text-dark-secondary">
            Compare relative sizes of spacing tokens
          </p>
        </div>

        <div className="rounded-xl p-6 bg-foundation-bg-dark-2 border border-foundation-text-dark-primary/10 space-y-4">
          {spacingEntries.slice(1).map(([token, value]) => (
            <div key={token} className="flex items-center gap-4">
              <div className="w-20 text-xs font-mono text-foundation-text-dark-tertiary">
                space-{token}
              </div>
              <div className="bg-foundation-accent-green h-8 rounded" style={{ width: value }} />
              <div className="text-xs text-foundation-text-dark-secondary">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Spacing */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foundation-text-dark-primary mb-2">
            Container Padding
          </h2>
          <p className="text-body-small text-foundation-text-dark-secondary">
            Recommended padding values for different container sizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(semanticSpacing["container-padding"]).map(([size, value]) => (
            <div
              key={size}
              className="rounded-xl border border-foundation-text-dark-primary/10 bg-foundation-bg-dark-2"
              style={{ padding: value }}
            >
              <div className="bg-foundation-bg-dark-3 rounded p-4">
                <div className="text-sm font-medium text-foundation-text-dark-primary mb-1">
                  {size.toUpperCase()}
                </div>
                <div className="text-xs font-mono text-foundation-text-dark-tertiary">
                  padding: {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Component Gap */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foundation-text-dark-primary mb-2">
            Component Gap
          </h2>
          <p className="text-body-small text-foundation-text-dark-secondary">
            Recommended gap values between components
          </p>
        </div>

        <div className="rounded-xl p-6 bg-foundation-bg-dark-2 border border-foundation-text-dark-primary/10 space-y-6">
          {Object.entries(semanticSpacing["component-gap"]).map(([size, value]) => (
            <div key={size}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-sm font-medium text-foundation-text-dark-primary">
                  {size.toUpperCase()}
                </div>
                <div className="text-xs font-mono text-foundation-text-dark-tertiary">
                  gap: {value}
                </div>
              </div>
              <div className="flex" style={{ gap: value }}>
                <div className="flex-1 h-16 bg-foundation-accent-blue rounded" />
                <div className="flex-1 h-16 bg-foundation-accent-blue rounded" />
                <div className="flex-1 h-16 bg-foundation-accent-blue rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foundation-text-dark-primary mb-2">
            Border Radius
          </h2>
          <p className="text-body-small text-foundation-text-dark-secondary">
            Standard border radius values for UI elements
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(semanticSpacing["border-radius"]).map(([size, value]) => (
            <div
              key={size}
              className="rounded-xl p-4 bg-foundation-bg-dark-2 border border-foundation-text-dark-primary/10"
            >
              <div className="mb-3">
                <div className="text-sm font-medium text-foundation-text-dark-primary">{size}</div>
                <div className="text-xs font-mono text-foundation-text-dark-tertiary">{value}</div>
              </div>
              <div
                className="w-full h-16 bg-foundation-accent-purple"
                style={{ borderRadius: value }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foundation-text-dark-primary mb-2">
            Usage Guidelines
          </h2>
        </div>

        <div className="rounded-xl p-6 bg-foundation-bg-dark-2 border border-foundation-text-dark-primary/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-foundation-text-dark-primary mb-2">
                Major Sections
              </div>
              <div className="text-body-small text-foundation-text-dark-secondary">
                Use <code className="text-foundation-accent-blue">space-64</code> (128px) for major
                page sections
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-foundation-text-dark-primary mb-2">
                Component Spacing
              </div>
              <div className="text-body-small text-foundation-text-dark-secondary">
                Use <code className="text-foundation-accent-blue">space-24</code> (48px) between
                unrelated components
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-foundation-text-dark-primary mb-2">
                Element Spacing
              </div>
              <div className="text-body-small text-foundation-text-dark-secondary">
                Use <code className="text-foundation-accent-blue">space-8</code> (16px) between
                related elements
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-foundation-text-dark-primary mb-2">
                Tight Spacing
              </div>
              <div className="text-body-small text-foundation-text-dark-secondary">
                Use <code className="text-foundation-accent-blue">space-4</code> (8px) for tight
                groupings
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
