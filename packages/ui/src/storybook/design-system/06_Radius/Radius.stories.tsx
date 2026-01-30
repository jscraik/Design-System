import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { radiusTokens } from "@astudio/tokens/radius";

/**
 * Border Radius System - Design Foundation
 *
 * ## Overview
 * Border radius controls the roundness of corners, affecting personality and perceived affordance.
 * Our radius scale provides options from subtle softening to fully rounded elements.
 *
 * ## Scale
 * - **r6-r8**: Subtle rounding (buttons, badges, small cards)
 * - **r10-r12**: Moderate rounding (inputs, standard cards)
 * - **r16-r24**: Strong rounding (large cards, modals)
 * - **round**: Fully rounded (pills, avatars, tags)
 *
 * ## Usage Guidelines
 * - **Consistency within component types**: All buttons use the same radius
 * - **Size proportionality**: Larger elements can have larger radius
 * - **Personality**: Smaller radius = serious/professional, larger radius = friendly/playful
 * - **Touch targets**: Rounded corners don't count toward touch target size
 *
 * ## Design Principles
 * - **Optical circles**: Even "round" (9999px) isn't always visually circular on non-square elements
 * - **Mixed radius**: Avoid mixing different radii in the same layout
 * - **Platform consistency**: Match platform conventions (iOS: larger radius, Android: smaller)
 *
 * ## Accessibility
 * - Rounded corners don't affect screen readers
 * - Ensure sufficient contrast on rounded backgrounds
 * - Don't rely on shape alone for meaning (use icons + labels)
 */

const RADIUS_TOKENS = [
  { name: "r6", value: 6, usage: "Subtle rounding, small buttons, compact badges" },
  { name: "r8", value: 8, usage: "Default button radius, small inputs" },
  { name: "r10", value: 10, usage: "Standard inputs, toggle switches" },
  { name: "r12", value: 12, usage: "Cards, dropdown menus, tooltips" },
  { name: "r16", value: 16, usage: "Large cards, prominent buttons" },
  { name: "r18", value: 20, usage: "Modals, panels, spacious cards" },
  { name: "r21", value: 20, usage: "Alternative to r18 (same value, semantic difference)" },
  { name: "r24", value: 24, usage: "Hero sections, featured content" },
  { name: "r30", value: 24, usage: "Alternative to r24 (same value, semantic difference)" },
  { name: "round", value: 9999, usage: "Pills, avatars, tags, fully rounded" },
] as const;

const RadiusVisualizer = ({
  value,
  name,
  usage,
}: {
  value: number;
  name: string;
  usage: string;
}) => (
  <button
    onClick={() => navigator.clipboard.writeText(name)}
    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
  >
    <div
      className="w-16 h-16 bg-accent/20 border-2 border-accent/40 flex items-center justify-center"
      style={{ borderRadius: value >= 100 ? "9999px" : `${value}px` }}
    >
      <span className="text-xs font-mono text-accent">{value >= 100 ? "round" : `${value}px`}</span>
    </div>
    <div className="flex-1 text-left">
      <div className="font-medium">{name}</div>
      <div className="text-sm font-mono text-muted-foreground">{value >= 100 ? "9999px" : `${value}px`}</div>
      <div className="text-xs text-muted-foreground mt-1">{usage}</div>
    </div>
  </button>
);

const ComponentExamples = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Component Examples</h3>
      <p className="text-sm text-muted-foreground">
        See how border radius applies to real components.
      </p>
    </div>

    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Buttons</div>
        <div className="flex flex-wrap gap-3">
          <button className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">
            Default (r8)
          </button>
          <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground">
            Large (r12)
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-lg">
            XLarge (r16)
          </button>
          <button className="px-4 py-2 rounded-full bg-accent text-accent-foreground">
            Pill (round)
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Cards</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md border bg-muted p-4">
            <div className="text-xs text-muted-foreground mb-2">Subtle (r6)</div>
            <div className="text-sm font-medium">Card content</div>
          </div>
          <div className="rounded-lg border bg-muted p-4">
            <div className="text-xs text-muted-foreground mb-2">Standard (r12)</div>
            <div className="text-sm font-medium">Card content</div>
          </div>
          <div className="rounded-2xl border bg-muted p-4">
            <div className="text-xs text-muted-foreground mb-2">Spacious (r16)</div>
            <div className="text-sm font-medium">Card content</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Avatars & Pills</div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            JD
          </div>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
            Pill tag
          </span>
          <span className="px-3 py-1 rounded-full bg-muted text-sm">
            Another pill
          </span>
          <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
            Status
          </span>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          All use "round" (9999px) for fully rounded appearance
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Inputs</div>
        <div className="space-y-3 max-w-md">
          <input
            type="text"
            placeholder="Standard input (r8)"
            className="w-full px-3 py-2 rounded-md border bg-background"
          />
          <input
            type="text"
            placeholder="Larger input (r10)"
            className="w-full px-4 py-2.5 rounded-lg border bg-background"
          />
          <input
            type="text"
            placeholder="Search input (r12)"
            className="w-full px-4 py-3 rounded-xl border bg-background"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Modals & Overlays</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-muted p-6">
            <div className="text-xs text-muted-foreground mb-2">Dialog (r16-r18)</div>
            <div className="text-sm font-medium mb-2">Modal Title</div>
            <div className="text-sm text-muted-foreground">
              Modal content with rounded corners for a softer appearance.
            </div>
          </div>
          <div className="rounded-3xl border bg-muted p-6">
            <div className="text-xs text-muted-foreground mb-2">Popover (r18-r21)</div>
            <div className="text-sm font-medium mb-2">Popover Title</div>
            <div className="text-sm text-muted-foreground">
              Popover content with extra rounded corners for floating elements.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RadiusComparison = () => {
  const [selectedRadius, setSelectedRadius] = React.useState<keyof typeof radiusTokens>("r12");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Interactive Radius Preview</h3>
        <p className="text-sm text-muted-foreground">
          Select a radius value to see how it affects elements.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {RADIUS_TOKENS.map((token) => (
          <button
            key={token.name}
            onClick={() => setSelectedRadius(token.name as keyof typeof radiusTokens)}
            className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
              selectedRadius === token.name
                ? "bg-accent text-accent-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {token.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium mb-4">Button Example</div>
          <div
            className="p-4 bg-accent text-accent-foreground text-center"
            style={{
              borderRadius: radiusTokens[selectedRadius] >= 100 ? "9999px" : `${radiusTokens[selectedRadius]}px`,
            }}
          >
            Click me
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Using {selectedRadius} ({radiusTokens[selectedRadius] >= 100 ? "9999px" : `${radiusTokens[selectedRadius]}px`})
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium mb-4">Card Example</div>
          <div
            className="p-4 bg-muted"
            style={{
              borderRadius: radiusTokens[selectedRadius] >= 100 ? "9999px" : `${radiusTokens[selectedRadius]}px`,
            }}
          >
            <div className="font-medium">Card Title</div>
            <div className="text-sm text-muted-foreground">Card content goes here</div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Using {selectedRadius} ({radiusTokens[selectedRadius] >= 100 ? "9999px" : `${radiusTokens[selectedRadius]}px`})
          </div>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "Design System/06 Radius",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Border radius system documentation with visual examples and usage guidelines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const RadiusScale: Story = {
  name: "Radius Scale",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Border Radius Scale</h2>
        <p className="text-muted-foreground mb-6">
          Visual border radius scale with usage guidelines. Click any value to copy its token name.
        </p>
      </div>

      <div className="space-y-3">
        {RADIUS_TOKENS.map((token) => (
          <RadiusVisualizer key={token.name} {...token} />
        ))}
      </div>

      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="text-sm font-medium text-accent">💡 Pro Tip</div>
        <p className="text-sm text-muted-foreground mt-1">
          Some tokens share values (r18/r21 both 20px, r24/r30 both 24px). This allows semantic
          flexibility—use different tokens for different component types while maintaining visual
          consistency.
        </p>
      </div>
    </div>
  ),
};

export const InteractiveDemo: Story = {
  name: "Interactive Preview",
  render: () => <RadiusComparison />,
};

export const ComponentPatterns: Story = {
  name: "Component Patterns",
  render: () => <ComponentExamples />,
};

export const UsageGuidelines: Story = {
  name: "Usage Guidelines",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">When to Use Each Radius</h2>
        <p className="text-muted-foreground">
          Guidelines for choosing the right border radius for different contexts.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Subtle Rounding (r6-r8)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-16 h-16 bg-accent/10 flex items-center justify-center text-accent border-2 border-accent/30"
                style={{ borderRadius: "8px" }}
              >
                <span className="text-xs font-mono">r8</span>
              </div>
              <div>
                <div className="font-medium">Default for buttons and inputs</div>
                <p className="text-sm text-muted-foreground">
                  Use for standard UI elements. Provides subtle softening without feeling playful.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Moderate Rounding (r10-r12)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-16 h-16 bg-accent/10 flex items-center justify-center text-accent border-2 border-accent/30"
                style={{ borderRadius: "12px" }}
              >
                <span className="text-xs font-mono">r12</span>
              </div>
              <div>
                <div className="font-medium">Standard for cards and containers</div>
                <p className="text-sm text-muted-foreground">
                  Use for cards, dropdown menus, tooltips. Friendly but professional appearance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Strong Rounding (r16-r24)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-16 h-16 bg-accent/10 flex items-center justify-center text-accent border-2 border-accent/30"
                style={{ borderRadius: "16px" }}
              >
                <span className="text-xs font-mono">r16</span>
              </div>
              <div>
                <div className="font-medium">Prominent elements and hero sections</div>
                <p className="text-sm text-muted-foreground">
                  Use for large cards, modals, featured content. Creates a friendly, approachable feel.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Fully Rounded (round)</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-16 h-16 bg-accent/10 flex items-center justify-center text-accent border-2 border-accent/30"
                style={{ borderRadius: "9999px" }}
              >
                <span className="text-xs font-mono">round</span>
              </div>
              <div>
                <div className="font-medium">Pills, avatars, tags</div>
                <p className="text-sm text-muted-foreground">
                  Use for pill buttons, avatar containers, status tags. Creates distinctive shape.
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
        <h2 className="text-2xl font-bold mb-2">Border Radius Best Practices</h2>
        <p className="text-muted-foreground">
          Common patterns to follow and pitfalls to avoid.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Be consistent within component types</div>
              <p className="text-sm text-muted-foreground mt-1">
                All buttons should use the same radius. All cards should use the same radius.
                Consistency creates polish.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">
                  Button A
                </button>
                <button className="px-3 py-1.5 rounded-md bg-muted text-sm">
                  Button B
                </button>
                <button className="px-3 py-1.5 rounded-md border text-sm">
                  Button C
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">DON'T: Mix radii arbitrarily in the same layout</div>
              <p className="text-sm text-muted-foreground mt-1">
                Avoid using r6, r12, and r24 in the same layout without clear reason.
                Mixed radii create visual clutter.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 rounded-md bg-muted text-sm">r6</button>
                <button className="px-3 py-1.5 rounded-xl bg-muted text-sm">r12</button>
                <button className="px-3 py-1.5 rounded-3xl bg-muted text-sm">r24</button>
              </div>
              <div className="mt-2 text-xs text-destructive">
                ↑ Inconsistent radius creates messy appearance
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Scale radius with element size</div>
              <p className="text-sm text-muted-foreground mt-1">
                Larger elements can have proportionally larger radius. Small buttons use r6-r8,
                large cards use r16-r24.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">
                DON'T: Use large radius on small elements
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                A 16px radius on a 20px tall button looks awkward. Scale radius appropriately.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Use "round" for pills and avatars</div>
              <p className="text-sm text-muted-foreground mt-1">
                Fully rounded elements create distinctive shapes. Perfect for pills, tags,
                avatars, and floating action buttons.
              </p>
              <div className="mt-3 flex gap-2 items-center">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">
                  JD
                </div>
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                  Tag
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">
                DON'T: Use "round" on rectangular content
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Fully rounded rectangles on very wide content look like pills (which is fine
                if intentional, but awkward if not).
              </p>
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
          Border radius tokens and usage patterns. Click any value to copy.
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Token</th>
              <th className="text-left p-3 font-semibold">Value</th>
              <th className="text-left p-3 font-semibold">Usage</th>
            </tr>
          </thead>
          <tbody>
            {RADIUS_TOKENS.map((token, i) => (
              <tr
                key={token.name}
                className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <td className="p-3 font-mono text-sm">{token.name}</td>
                <td className="p-3 font-mono text-sm">{token.value >= 100 ? "9999px" : `${token.value}px`}</td>
                <td className="p-3 text-sm text-muted-foreground">{token.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Import Radius Tokens</div>
        <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`import { radiusTokens } from "@astudio/tokens/radius";

// Usage in components
const borderRadius = radiusTokens.r12; // 12px
const buttonRadius = radiusTokens.round; // 9999px (fully rounded)`}
        </pre>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Tailwind Classes</div>
        <div className="text-sm space-y-1">
          <div><code>rounded-sm</code> → r6</div>
          <div><code>rounded</code> → r8 (default)</div>
          <div><code>rounded-lg</code> → r12</div>
          <div><code>rounded-xl</code> → r16</div>
          <div><code>rounded-2xl</code> → r18/r21</div>
          <div><code>rounded-3xl</code> → r24/r30</div>
          <div><code>rounded-full</code> → round</div>
        </div>
      </div>
    </div>
  ),
};
