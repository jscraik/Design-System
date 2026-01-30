import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { spaceTokens, spacingScale } from "@astudio/tokens/spacing";

/**
 * Spacing System - Design Foundation
 *
 * ## Overview
 * Consistent spacing creates visual rhythm, improves scanability, and reduces cognitive load.
 * Our spacing scale is based on a power-of-2 system for mathematical harmony.
 *
 * ## Scale
 * - **Base unit**: 4px (small enough for fine adjustments, large enough to be visible)
 * - **Scale**: Powers of 2 with strategic intermediate values (48, 40, 24, 12)
 * - **Range**: 0px to 128px
 *
 * ## Usage Guidelines
 * - **Component spacing**: Use s4-s16 for padding/margins within components
 * - **Section spacing**: Use s24-s48 for spacing between content sections
 * - **Layout spacing**: Use s64-s128 for major layout divisions
 * - **Be consistent**: Prefer scale values over arbitrary numbers
 *
 * ## Responsive Behavior
 * - Scale values remain constant across viewports (px-based)
 * - Apply more spacing on desktop, less on mobile (e.g., s16 mobile → s24 desktop)
 *
 * ## Design Principles
 * - **Less but better** (Emil Kowalski): Use fewer spacing relationships consistently
 * - **White space is active**: Spacing is design, not empty space
 * - **Rhythm creates flow**: Repeated spacing patterns guide the eye through content
 *
 * ## Accessibility
 * - Minimum touch target: s40 (44px WCAG recommended) for mobile interactive elements
 * - Maintain spacing between interactive elements (prevent misclicks)
 * - Don't rely on spacing alone for content separation (use borders/dividers)
 */

const SPACING_TOKENS = [
  { name: "s128", value: 128, usage: "Page-level sections, major layout divisions" },
  { name: "s64", value: 64, usage: "Large gaps between content blocks" },
  { name: "s48", value: 48, usage: "Section spacing, card padding (large)" },
  { name: "s40", value: 40, usage: "Minimum touch target, comfortable padding" },
  { name: "s32", value: 32, usage: "Modal padding, button padding (large)" },
  { name: "s24", value: 24, usage: "Section spacing, card padding" },
  { name: "s16", value: 16, usage: "Default padding, form field spacing" },
  { name: "s12", value: 12, usage: "Compact spacing, label gaps" },
  { name: "s8", value: 8, usage: "Tight spacing, icon gaps" },
  { name: "s4", value: 4, usage: "Micro-spacing, hairline gaps" },
  { name: "s2", value: 4, usage: "Alias for s4 (semantic flexibility)" },
  { name: "s0", value: 0, usage: "No spacing (reset)" },
];

const SpacingVisualizer = ({ value, label, usage }: { value: number; label: string; usage: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
    <div className="flex items-center gap-2">
      <div
        className="rounded bg-accent/20 border border-accent/40"
        style={{
          width: `${Math.min(value, 64)}px`,
          height: `${Math.min(value, 64)}px`,
          minWidth: value === 0 ? "4px" : undefined,
        }}
      />
      {value > 64 && (
        <span className="text-xs text-muted-foreground">
          {value}px
        </span>
      )}
    </div>
    <div className="flex-1">
      <div className="font-semibold">{label}</div>
      <div className="text-sm font-mono text-muted-foreground">{value}px</div>
      <div className="text-xs text-muted-foreground mt-1">{usage}</div>
    </div>
  </div>
);

const SpacingRhythmDemo = () => {
  const [selectedSpacing, setSelectedSpacing] = React.useState<keyof typeof spaceTokens>("s16");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Interactive Rhythm Preview</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a spacing value to see how it affects content rhythm.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {SPACING_TOKENS.map((token) => (
          <button
            key={token.name}
            onClick={() => setSelectedSpacing(token.name as keyof typeof spaceTokens)}
            className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
              selectedSpacing === token.name
                ? "bg-accent text-accent-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {token.name}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded bg-accent/20" />
            <div>
              <div className="font-medium">Card Title</div>
              <div className="text-sm text-muted-foreground">Subtitle text</div>
            </div>
          </div>

          <div
            className="h-px bg-border"
            style={{ marginTop: `${spaceTokens[selectedSpacing]}px`, marginBottom: `${spaceTokens[selectedSpacing]}px` }}
          />

          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded bg-muted" />
            <div>
              <div className="font-medium">Another Title</div>
              <div className="text-sm text-muted-foreground">More subtitle text</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Using {selectedSpacing} ({spaceTokens[selectedSpacing]}px) for vertical rhythm
        </div>
      </div>
    </div>
  );
};

const ComponentSpacingDemo = () => (
  <div className="space-y-6 p-6">
    <h3 className="text-lg font-semibold">Component Spacing Patterns</h3>

    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Button Padding</div>
        <div className="flex flex-wrap gap-4">
          <button className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">
            Small (s8 vertical, s12 horizontal)
          </button>
          <button className="px-4 py-2 rounded-md bg-accent text-accent-foreground">
            Default (s8 vertical, s16 horizontal)
          </button>
          <button className="px-6 py-3 rounded-md bg-accent text-accent-foreground text-lg">
            Large (s12 vertical, s24 horizontal)
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Card Padding</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-muted p-4">
            <div className="text-xs text-muted-foreground mb-2">Compact (s12)</div>
            <div className="text-sm font-medium">Card content</div>
          </div>
          <div className="rounded-lg border bg-muted p-6">
            <div className="text-xs text-muted-foreground mb-2">Default (s16/s24)</div>
            <div className="text-sm font-medium">Card content</div>
          </div>
          <div className="rounded-lg border bg-muted p-8">
            <div className="text-xs text-muted-foreground mb-2">Spacious (s24/s32)</div>
            <div className="text-sm font-medium">Card content</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Form Field Spacing</div>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-md border bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md border bg-background"
            />
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Labels use s4-s8 gap, fields use s16 vertical gap
        </div>
      </div>
    </div>
  </div>
);

const meta = {
  title: "Design System/05 Spacing",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Spacing system documentation with visual examples and usage guidelines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const SpacingScale: Story = {
  name: "Spacing Scale",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Spacing Scale</h2>
        <p className="text-muted-foreground mb-6">
          Visual spacing scale with usage guidelines. Click any spacing value to copy its token name.
        </p>
      </div>

      <div className="space-y-3">
        {SPACING_TOKENS.map((token) => (
          <button
            key={token.name}
            onClick={() => navigator.clipboard.writeText(token.name)}
            className="w-full text-left hover:bg-muted/50 rounded-lg transition-colors"
          >
            <SpacingVisualizer value={token.value} label={token.name} usage={token.usage} />
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="text-sm font-medium text-accent">💡 Pro Tip</div>
        <p className="text-sm text-muted-foreground mt-1">
          Prefer using spacing tokens (s16, s24, etc.) over arbitrary pixel values. This ensures
          consistent rhythm across the entire interface.
        </p>
      </div>
    </div>
  ),
};

export const RhythmDemo: Story = {
  name: "Visual Rhythm",
  render: () => <SpacingRhythmDemo />,
};

export const ComponentPatterns: Story = {
  name: "Component Patterns",
  render: () => <ComponentSpacingDemo />,
};

export const UsageGuidelines: Story = {
  name: "Usage Guidelines",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">When to Use Each Spacing Value</h2>
        <p className="text-muted-foreground">
          Guidelines for choosing the right spacing for different contexts.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Page Level (s64-s128)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                128
              </div>
              <div>
                <div className="font-medium">s128 - Major Sections</div>
                <p className="text-sm text-muted-foreground">
                  Use between completely different content areas (hero → features, content → footer)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                64
              </div>
              <div>
                <div className="font-medium">s64 - Large Gaps</div>
                <p className="text-sm text-muted-foreground">
                  Use between distinct content blocks within a section
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Section Level (s24-s48)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                48
              </div>
              <div>
                <div className="font-medium">s48 - Spacious Section Spacing</div>
                <p className="text-sm text-muted-foreground">
                  Use for large cards, generous padding in modals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                24
              </div>
              <div>
                <div className="font-medium">s24 - Default Section Spacing</div>
                <p className="text-sm text-muted-foreground">
                  Use between related elements, card padding, standard section gaps
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Component Level (s8-s16)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                16
              </div>
              <div>
                <div className="font-medium">s16 - Default Component Spacing</div>
                <p className="text-sm text-muted-foreground">
                  Use for button padding, form field gaps, card internal spacing
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                12
              </div>
              <div>
                <div className="font-medium">s12 - Compact Spacing</div>
                <p className="text-sm text-muted-foreground">
                  Use for label gaps, tight component layouts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                8
              </div>
              <div>
                <div className="font-medium">s8 - Tight Spacing</div>
                <p className="text-sm text-muted-foreground">
                  Use for icon gaps, button padding (vertical)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Micro Level (s0-s4)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                4
              </div>
              <div>
                <div className="font-medium">s4 / s2 - Micro Spacing</div>
                <p className="text-sm text-muted-foreground">
                  Use for hairline gaps, fine adjustments, border radius on small elements
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                0
              </div>
              <div>
                <div className="font-medium">s0 - No Spacing</div>
                <p className="text-sm text-muted-foreground">
                  Use to reset spacing, create flush edges, or overlap elements intentionally
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DoDont: Story = {
  name: "Do's and Don'ts",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Spacing Best Practices</h2>
        <p className="text-muted-foreground">
          Common patterns to follow and pitfalls to avoid.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Use scale values consistently</div>
              <p className="text-sm text-muted-foreground mt-1">
                Always prefer spacing tokens (s16, s24) over arbitrary numbers. This creates visual rhythm
                and makes systematic changes easier.
              </p>
              <div className="mt-3 p-3 rounded bg-background border">
                <code className="text-sm">
                  className="p-s16 mb-s24" → Consistent, adjustable
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">DON'T: Use arbitrary pixel values</div>
              <p className="text-sm text-muted-foreground mt-1">
                Avoid random numbers like 13px, 27px, 51px. They break rhythm and make spacing
                unpredictable.
              </p>
              <div className="mt-3 p-3 rounded bg-background border">
                <code className="text-sm">
                  className="p-[13px] mb-[27px]" → Inconsistent, hard to maintain
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Be generous with white space</div>
              <p className="text-sm text-muted-foreground mt-1">
                White space is design, not empty space. Give elements room to breathe. Users scan
                better with clear visual separation.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-background border">
                  <div className="text-xs text-muted-foreground mb-2">Generous (s24)</div>
                  <div className="space-y-6">
                    <div className="h-2 w-full rounded bg-muted" />
                    <div className="h-2 w-3/4 rounded bg-muted" />
                  </div>
                </div>
                <div className="p-4 rounded bg-background border">
                  <div className="text-xs text-muted-foreground mb-2">Better (s32)</div>
                  <div className="space-y-8">
                    <div className="h-2 w-full rounded bg-muted" />
                    <div className="h-2 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">DON'T: Rely on spacing alone for separation</div>
              <p className="text-sm text-muted-foreground mt-1">
                Use borders or dividers in addition to spacing for clear content separation. Spacing
                alone can be ambiguous.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-background border">
                  <div className="text-xs text-destructive mb-2">Spacing only (ambiguous)</div>
                  <div className="space-y-6">
                    <div className="h-2 w-full rounded bg-muted" />
                    <div className="h-2 w-3/4 rounded bg-muted" />
                  </div>
                </div>
                <div className="p-4 rounded bg-background border">
                  <div className="text-xs text-accent mb-2">Spacing + border (clear)</div>
                  <div className="space-y-6">
                    <div className="h-2 w-full rounded bg-muted" />
                    <div className="h-px bg-border" />
                    <div className="h-2 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Maintain touch targets</div>
              <p className="text-sm text-muted-foreground mt-1">
                Interactive elements need at least s40 (44px WCAG recommended) spacing or padding
                for mobile usability.
              </p>
              <div className="mt-3 p-3 rounded bg-background border">
                <code className="text-sm">
                  className="min-h-s40 px-s16" → Accessible touch target
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">DON'T: Mix scales randomly</div>
              <p className="text-sm text-muted-foreground mt-1">
                Avoid jumping between vastly different spacing values (s4 → s32 → s8). Use adjacent
                scale values for smoother transitions.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-background border">
                  <div className="text-xs text-destructive mb-2">Chaotic (s4 → s32 → s8)</div>
                  <div className="flex items-end gap-1">
                    <div className="w-2 h-1 rounded bg-muted" />
                    <div className="w-2 h-8 rounded bg-muted" />
                    <div className="w-2 h-2 rounded bg-muted" />
                  </div>
                </div>
                <div className="p-4 rounded bg-background border">
                  <div className="text-xs text-accent mb-2">Harmonious (s8 → s12 → s16)</div>
                  <div className="flex items-end gap-1">
                    <div className="w-2 h-2 rounded bg-muted" />
                    <div className="w-2 h-3 rounded bg-muted" />
                    <div className="w-2 h-4 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TokenReference: Story = {
  name: "Token Reference",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Reference</h2>
        <p className="text-muted-foreground">
          Copy token names for use in your code. Click any value to copy.
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Token</th>
              <th className="text-left p-3 font-semibold">Value</th>
              <th className="text-left p-3 font-semibold">Usage</th>
              <th className="text-left p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {SPACING_TOKENS.map((token, i) => (
              <tr key={token.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="p-3 font-mono text-sm">{token.name}</td>
                <td className="p-3 font-mono text-sm">{token.value}px</td>
                <td className="p-3 text-sm text-muted-foreground">{token.usage}</td>
                <td className="p-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(token.name)}
                    className="px-3 py-1 rounded bg-accent/10 hover:bg-accent/20 text-accent text-sm font-medium transition-colors"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Import Spacing Tokens</div>
        <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`import { spaceTokens } from "@astudio/tokens/spacing";

// Usage in components
const padding = spaceTokens.s16; // 16px
const margin = spaceTokens.s24;  // 24px`}
        </pre>
      </div>
    </div>
  ),
};

export const ResponsiveBreakpoints: Story = {
  name: "Responsive Breakpoints",
  render: () => (
    <div className="max-w-5xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Responsive Spacing Guidelines</h2>
        <p className="text-muted-foreground mb-6">
          How spacing scales across viewport sizes. Use Storybook viewport toggle to see differences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Responsive Card Pattern</h3>
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted p-4">
              <div className="text-xs text-muted-foreground mb-2">Mobile (320px) → Compact</div>
              <div className="rounded bg-card border p-3" style={{ padding: "12px" }}>
                <div className="text-sm font-medium mb-1">Card Title</div>
                <p className="text-xs text-muted-foreground">
                  Mobile uses s12 padding for tight layouts
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-muted p-4">
              <div className="text-xs text-muted-foreground mb-2">Desktop (768px+) → Standard</div>
              <div className="rounded bg-card border p-4" style={{ padding: "16px" }}>
                <div className="text-sm font-medium mb-1">Card Title</div>
                <p className="text-xs text-muted-foreground">
                  Desktop uses s16 padding for comfortable reading
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-muted p-4">
              <div className="text-xs text-muted-foreground mb-2">Large Desktop (1024px+) → Spacious</div>
              <div className="rounded bg-card border p-5" style={{ padding: "20px" }}>
                <div className="text-sm font-medium mb-1">Card Title</div>
                <p className="text-xs text-muted-foreground">
                  Large screens use s20-s24 padding for premium feel
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Responsive Section Spacing</h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-2">Mobile Sections (s16-s24 gap)</div>
              <div className="flex flex-col gap-3">
                <div className="rounded bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Section 1</div>
                </div>
                <div className="rounded bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Section 2</div>
                </div>
                <div className="rounded bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Section 3</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-2">Desktop Sections (s24-s32 gap)</div>
              <div className="flex flex-col gap-4">
                <div className="rounded bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Section 1</div>
                </div>
                <div className="rounded bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Section 2</div>
                </div>
                <div className="rounded bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Section 3</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Breakpoint Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Mobile (&lt; 768px)</div>
              <div className="text-xs text-muted-foreground">
                • s12-s16 for compact layouts
              </div>
              <div className="text-xs text-muted-foreground">
                • s16-s20 for standard spacing
              </div>
              <div className="text-xs text-muted-foreground">
                • Prioritize content density
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Tablet (768px - 1024px)</div>
              <div className="text-xs text-muted-foreground">
                • s16-s20 for balanced spacing
              </div>
              <div className="text-xs text-muted-foreground">
                • s20-s24 for section gaps
              </div>
              <div className="text-xs text-muted-foreground">
                • Maintain visual rhythm
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Desktop (&ge; 1024px)</div>
              <div className="text-xs text-muted-foreground">
                • s20-s24 for comfortable spacing
              </div>
              <div className="text-xs text-muted-foreground">
                • s24-s32 for section gaps
              </div>
              <div className="text-xs text-muted-foreground">
                • Premium, spacious feel
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
          <div className="text-sm font-medium text-accent">💡 Responsive Strategy</div>
          <p className="text-sm text-muted-foreground mt-1">
            Use container queries or Tailwind responsive modifiers: <code>px-s16 md:px-s20 lg:px-s24</code>.
            Mobile-first design, then enhance for larger screens.
          </p>
        </div>
      </div>
    </div>
  ),
};
