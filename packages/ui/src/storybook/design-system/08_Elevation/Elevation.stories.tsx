import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { shadowTokens } from "@design-studio/tokens/shadows";

/**
 * Elevation System - Design Foundation
 *
 * ## Overview
 * Elevation (shadows) communicates hierarchy, depth, and interactivity. Our shadow system
 * creates subtle depth that guides attention without overwhelming content.
 *
 * ## Shadow Tokens
 * - **card**: Default elevation for cards, panels, modals
 * - **pip**: Used for floating elements, buttons, badges
 * - **pill**: Used for pill-shaped elements, tags
 * - **close**: Used for close buttons, dismissible elements
 *
 * ## Technical Details
 * - All shadows use two layers for depth
 * - Color: rgba(0 0 0 / 10%) - subtle, works on all backgrounds
 * - Layer 1: 0px offset, 10px blur, -3px spread
 * - Layer 2: 0px offset, 4px blur, -4px spread
 * - Downward-only shadows (no x-offset) match Material Design principles
 *
 * ## Usage Guidelines
 * - **Resting state**: Use shadows for elevated elements (cards, modals, dropdowns)
 * - **Interactive state**: Increase shadow on hover/focus for feedback
 * - **Don't overdo**: Too much shadow creates visual noise
 * - **Consistent elevation**: Elements at same "height" should have same shadow
 *
 * ## Design Principles
 * - **Light source**: Shadows fall downward (consistent with overhead light)
 * - **Subtlety**: 10% opacity creates soft, natural shadows
 * - **No color**: Shadows are neutral black, no colored tinting
 * - **Function over decoration**: Shadows indicate hierarchy, not aesthetics
 *
 * ## Accessibility
 * - Don't rely on shadow alone for depth (use borders/backgrounds too)
 * - Ensure sufficient contrast between elevated element and background
 * - Dark mode: Shadows may need adjustment (10% opacity works for both modes)
 *
 * ## Animation
 * - Shadow transitions should be smooth (150-200ms)
 * - Use ease-out for elevation (element lifting up)
 * - Don't animate shadow spread (causes layout shift)
 */

const ELEVATION_LEVELS = [
  {
    name: "flat",
    description: "No elevation - baseline",
    shadow: "none",
    usage: "Background elements, content areas",
  },
  {
    name: "raised",
    description: "Card elevation - default",
    shadow: "card",
    usage: "Cards, panels, content blocks",
  },
  {
    name: "floating",
    description: "Floating element elevation",
    shadow: "pip",
    usage: "Badges, floating buttons, tooltips",
  },
] as const;

const shadowToBoxShadow = (shadow: keyof typeof shadowTokens | "none"): string => {
  if (shadow === "none") return "none";
  const layers = shadowTokens[shadow];
  return layers
    .map(
      (layer) =>
        `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`,
    )
    .join(", ");
};

const ElevationCard = ({
  title,
  shadow,
  description,
  usage,
  interactive = false,
}: {
  title: string;
  shadow: keyof typeof shadowTokens | "none";
  description: string;
  usage: string;
  interactive?: boolean;
}) => (
  <div
    className={`p-6 bg-card border transition-all ${
      interactive ? "hover:scale-[1.02] cursor-pointer" : ""
    }`}
    style={{
      boxShadow: shadowToBoxShadow(shadow),
    }}
  >
    <div className="font-semibold text-lg mb-1">{title}</div>
    <div className="text-sm text-muted-foreground mb-3">{description}</div>
    <div className="text-xs text-muted-foreground">{usage}</div>
  </div>
);

const ElevationDemo = () => {
  const [elevated, setElevated] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Interactive Elevation Demo</h3>
        <p className="text-sm text-muted-foreground">
          Hover over the card to see elevation change.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ElevationCard
          title="Flat"
          shadow="none"
          description="No shadow - baseline"
          usage="Background content, nested elements"
        />
        <ElevationCard
          title="Card"
          shadow="card"
          description="Default card elevation"
          usage="Standard cards, panels, modals"
        />
        <ElevationCard
          title="Floating"
          shadow="pip"
          description="Floating element elevation"
          usage="Badges, tooltips, floating buttons"
        />
      </div>

      <div
        className="p-6 bg-card border transition-all duration-200 cursor-pointer"
        style={{
          boxShadow: elevated ? shadowToBoxShadow("card") : "none",
        }}
        onMouseEnter={() => setElevated(true)}
        onMouseLeave={() => setElevated(false)}
      >
        <div className="text-sm font-medium mb-2">
          {elevated ? "Elevated (hovering)" : "Flat (not hovering)"}
        </div>
        <p className="text-sm text-muted-foreground">
          Hover over this card to see it lift up with a shadow.
        </p>
      </div>
    </div>
  );
};

const ComponentExamples = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Component Examples</h3>
      <p className="text-sm text-muted-foreground">See how elevation applies to real components.</p>
    </div>

    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Cards with Elevation</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-4 bg-card border"
            style={{
              boxShadow: shadowToBoxShadow("card"),
            }}
          >
            <div className="font-medium mb-2">Standard Card</div>
            <div className="text-sm text-muted-foreground">
              Uses "card" shadow for subtle elevation.
            </div>
          </div>
          <div
            className="p-4 bg-card border"
            style={{
              boxShadow: shadowToBoxShadow("card"),
            }}
          >
            <div className="font-medium mb-2">Another Card</div>
            <div className="text-sm text-muted-foreground">
              Same elevation creates visual grouping.
            </div>
          </div>
          <div className="p-4 bg-muted border" style={{ boxShadow: "none" }}>
            <div className="font-medium mb-2">Nested Element</div>
            <div className="text-sm text-muted-foreground">
              No shadow - nested content stays flat.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Floating Elements</div>
        <div className="flex flex-wrap gap-4">
          <div
            className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm"
            style={{
              boxShadow: shadowToBoxShadow("pip"),
            }}
          >
            Badge
          </div>
          <div
            className="px-3 py-1.5 rounded-full bg-muted text-sm"
            style={{
              boxShadow: shadowToBoxShadow("pill"),
            }}
          >
            Pill
          </div>
          <div
            className="px-3 py-1.5 rounded bg-accent/10 text-accent text-sm"
            style={{
              boxShadow: shadowToBoxShadow("pip"),
            }}
          >
            Tag
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Small floating elements use "pip" or "pill" shadow for subtle depth.
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Modal with Elevation</div>
        <div className="relative">
          <div className="absolute inset-0 bg-overlay/10 rounded-lg" />
          <div
            className="relative p-6 bg-card rounded-lg"
            style={{
              boxShadow: shadowToBoxShadow("card"),
            }}
          >
            <div className="font-medium mb-2">Modal Content</div>
            <p className="text-sm text-muted-foreground mb-4">
              Modals use "card" shadow to separate from overlay.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">
                Confirm
              </button>
              <button className="px-3 py-1.5 rounded-md border text-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Interactive Hover States</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Button", shadow: "pip" as const },
            { name: "Card", shadow: "card" as const },
            { name: "Element", shadow: "pill" as const },
          ].map((item) => (
            <div key={item.name}>
              <div
                className="p-4 bg-card border transition-all hover:scale-[1.02]"
                style={{
                  boxShadow: `0 1px 2px rgba(0 0 0 / 5%)`,
                  transition: "box-shadow 150ms ease-out, transform 150ms ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = shadowToBoxShadow(item.shadow);
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(0 0 0 / 5%)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">Hover to elevate</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ShadowTechnical = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Shadow Technical Details</h3>
      <p className="text-sm text-muted-foreground">
        Understanding how our shadows are constructed.
      </p>
    </div>

    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">All Shadows Use This Pattern</div>
        <div className="space-y-3">
          <div className="p-3 rounded bg-muted">
            <div className="text-xs text-muted-foreground mb-1">Layer 1 (diffuse, large)</div>
            <div className="font-mono text-sm">
              0px offset, 10px blur, -3px spread, rgba(0 0 0 / 10%)
            </div>
          </div>
          <div className="p-3 rounded bg-muted">
            <div className="text-xs text-muted-foreground mb-1">Layer 2 (sharp, small)</div>
            <div className="font-mono text-sm">
              0px offset, 4px blur, -4px spread, rgba(0 0 0 / 10%)
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Two layers create depth: diffuse ambient shadow + sharp contact shadow
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Shadow Tokens</div>
        <div className="space-y-2">
          {Object.keys(shadowTokens).map((key) => (
            <div key={key} className="p-3 rounded bg-muted">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sm font-medium">{key}</span>
                <div
                  className="w-8 h-8 rounded bg-accent/20"
                  style={{
                    boxShadow: shadowToBoxShadow(key as keyof typeof shadowTokens),
                  }}
                />
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                {shadowToBoxShadow(key as keyof typeof shadowTokens)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Design Principles</div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Downward-only shadows:</span> No x-offset (consistent with
            overhead light source)
          </div>
          <div>
            <span className="font-medium">Negative spread:</span> Tightens shadow, prevents fuzzy
            edges
          </div>
          <div>
            <span className="font-medium">10% opacity:</span> Subtle, works on both light and dark
            backgrounds
          </div>
          <div>
            <span className="font-medium">Two layers:</span> Creates depth perception through
            multiple shadow intensities
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Animation Best Practices</div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-accent">✓ DO:</span> Animate box-shadow with ease-out
            (150-200ms)
          </div>
          <div>
            <span className="font-medium text-status-error">✗ DON'T:</span> Animate spread radius
            (causes layout shift)
          </div>
          <div>
            <span className="font-medium text-accent">✓ DO:</span> Combine with translateY for lift
            effect
          </div>
          <div>
            <span className="font-medium text-status-error">✗ DON'T:</span> Use long durations
            (feels sluggish, not responsive)
          </div>
        </div>
        <div className="mt-3 p-3 rounded bg-muted">
          <code className="text-xs">
            transition: box-shadow 150ms ease-out, transform 150ms ease-out;
          </code>
        </div>
      </div>
    </div>
  </div>
);

const meta = {
  title: "Design System/08 Elevation",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Elevation (shadow) system documentation with visual examples and usage guidelines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ElevationLevels: Story = {
  name: "Elevation Levels",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Elevation Scale</h2>
        <p className="text-muted-foreground mb-6">Visual elevation levels with usage guidelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ELEVATION_LEVELS.map((level) => (
          <div key={level.name}>
            <div
              className="p-6 bg-card border"
              style={{
                boxShadow:
                  level.shadow === "none"
                    ? "none"
                    : shadowToBoxShadow(level.shadow as keyof typeof shadowTokens),
              }}
            >
              <div className="font-semibold text-lg mb-1 capitalize">{level.name}</div>
              <div className="text-sm text-muted-foreground mb-3">{level.description}</div>
              <div className="text-xs text-muted-foreground">{level.usage}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="text-sm font-medium text-accent">💡 Pro Tip</div>
        <p className="text-sm text-muted-foreground mt-1">
          All shadows use the same two-layer pattern with 10% opacity. This creates consistent depth
          across the interface while working on both light and dark backgrounds.
        </p>
      </div>
    </div>
  ),
};

export const InteractiveDemo: Story = {
  name: "Interactive Demo",
  render: () => <ElevationDemo />,
};

export const ComponentPatterns: Story = {
  name: "Component Patterns",
  render: () => <ComponentExamples />,
};

export const TechnicalDetails: Story = {
  name: "Technical Details",
  render: () => <ShadowTechnical />,
};

export const UsageGuidelines: Story = {
  name: "Usage Guidelines",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Elevation Usage Guidelines</h2>
        <p className="text-muted-foreground">Best practices for using elevation effectively.</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">When to Use Elevation</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-accent">✓ Use elevation for:</span>
              <ul className="text-muted-foreground ml-4 mt-1 space-y-1">
                <li>• Cards and panels (to separate from background)</li>
                <li>• Modals and dialogs (to show they're above content)</li>
                <li>• Dropdowns and tooltips (floating above)</li>
                <li>• Hover/focus states (interactive feedback)</li>
                <li>• Dragged elements (showing lift)</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-status-error">✗ Avoid elevation for:</span>
              <ul className="text-muted-foreground ml-4 mt-1 space-y-1">
                <li>• Nested elements inside elevated containers</li>
                <li>• Elements that are already separated by borders</li>
                <li>• Large areas (creates muddy appearance)</li>
                <li>• Elements with dark backgrounds on dark surfaces</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Elevation Best Practices</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Consistent hierarchy:</span> Elements at the same
              "height" should have the same shadow. Don't mix elevations arbitrarily.
            </div>
            <div>
              <span className="font-medium">Subtlety over drama:</span> Shadows should be subtle,
              not dramatic. 10% opacity creates soft, natural depth.
            </div>
            <div>
              <span className="font-medium">Combine with other cues:</span> Use borders, background
              colors, and spacing alongside shadows for clear hierarchy.
            </div>
            <div>
              <span className="font-medium">Interactive feedback:</span> Increase shadow on
              hover/focus to show elevation change. Combine with slight translate for lift effect.
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Dark Mode Considerations</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">10% opacity works for both modes:</span> The shadow
              color uses rgba(0 0 0 / 10%), which appears as a dark shadow on light backgrounds and
              a lighter shadow on dark backgrounds.
            </div>
            <div>
              <span className="font-medium">May need adjustment:</span> For very dark surfaces,
              consider using lighter shadow colors or reducing opacity.
            </div>
            <div>
              <span className="font-medium">Test on real backgrounds:</span> Always test shadows on
              actual background colors, not just white/black.
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
        <h2 className="text-2xl font-bold mb-2">Elevation Best Practices</h2>
        <p className="text-muted-foreground">Common patterns to follow and pitfalls to avoid.</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Use elevation to show hierarchy</div>
              <p className="text-sm text-muted-foreground mt-1">
                Elevated elements appear "above" other content. Use shadows to show modals,
                dropdowns, and tooltips are floating.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div
                  className="p-3 bg-card border"
                  style={{ boxShadow: shadowToBoxShadow("card") }}
                >
                  Card A
                </div>
                <div className="p-3 bg-muted border" style={{ boxShadow: "none" }}>
                  Background
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-status-error bg-status-error/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-status-error">DON'T: Over-everything</div>
              <p className="text-sm text-muted-foreground mt-1">
                Don't add shadows to everything. Too much elevation creates visual noise and reduces
                impact.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="p-2 bg-muted border text-xs">No shadow</div>
                <div
                  className="p-2 bg-card border text-xs"
                  style={{ boxShadow: shadowToBoxShadow("card") }}
                >
                  Shadow
                </div>
                <div className="p-2 bg-muted border text-xs">No shadow</div>
              </div>
              <div className="mt-2 text-xs text-status-error">
                ↑ Selective elevation is more effective
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Animate shadow on hover/focus</div>
              <p className="text-sm text-muted-foreground mt-1">
                Interactive elements should "lift" when hovered. Combine shadow change with slight
                translateY for realistic effect.
              </p>
              <div className="mt-3 p-3 rounded bg-muted">
                <code className="text-xs">
                  transition: box-shadow 150ms ease-out, transform 150ms ease-out;
                  <br />
                  hover: box-shadow: 0 10px 15px -3px rgba(0 0 0 / 10%);
                  <br />
                  hover: transform: translateY(-2px);
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-status-error bg-status-error/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-status-error">DON'T: Use colored shadows</div>
              <p className="text-sm text-muted-foreground mt-1">
                Shadows should be neutral black. Colored shadows look dated and create visual
                clutter.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">
                DO: Use consistent elevation for same-level elements
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                All cards should have the same shadow. All badges should have the same shadow.
                Consistency creates polished appearance.
              </p>
              <div className="mt-3 flex gap-2">
                <div
                  className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm"
                  style={{ boxShadow: shadowToBoxShadow("pip") }}
                >
                  Badge A
                </div>
                <div
                  className="px-3 py-1.5 rounded-full bg-muted text-sm"
                  style={{ boxShadow: shadowToBoxShadow("pip") }}
                >
                  Badge B
                </div>
                <div
                  className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm"
                  style={{ boxShadow: shadowToBoxShadow("pip") }}
                >
                  Badge C
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-status-error bg-status-error/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-status-error">
                DON'T: Rely on shadow alone for separation
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Shadows are subtle. Use borders, background colors, and spacing alongside shadows
                for clear visual separation.
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
        <p className="text-muted-foreground">Elevation tokens and CSS box-shadow values.</p>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Token</th>
              <th className="text-left p-3 font-semibold">Box Shadow</th>
              <th className="text-left p-3 font-semibold">Usage</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(shadowTokens).map((key, i) => (
              <tr key={key} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="p-3 font-mono text-sm">{key}</td>
                <td className="p-3 font-mono text-xs">
                  {shadowToBoxShadow(key as keyof typeof shadowTokens)}
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  {key === "card" && "Cards, panels, modals"}
                  {key === "pip" && "Badges, floating elements"}
                  {key === "pill" && "Pill-shaped elements, tags"}
                  {key === "close" && "Close buttons, dismissibles"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Import Shadow Tokens</div>
        <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
          {`import { shadowTokens } from "@design-studio/tokens/shadows";

// Usage in inline styles or CSS-in-JS
const cardStyle = {
  boxShadow: shadowTokens.card
    .map(layer =>
      \`\${layer.offsetX}px \${layer.offsetY}px \${layer.blur}px \${layer.spread}px \${layer.color}\`
    )
    .join(", ")
};

// Or use utility function (recommended)
const boxShadow = shadowToBoxShadow("card");`}
        </pre>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Shadow Structure</div>
        <div className="text-sm space-y-1">
          <div>
            <strong>Layer 1:</strong> 0px 10px 15px -3px rgba(0 0 0 / 10%)
          </div>
          <div>
            <strong>Layer 2:</strong> 0px 4px 6px -4px rgba(0 0 0 / 10%)
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            All shadows use this two-layer pattern for consistent depth.
          </div>
        </div>
      </div>
    </div>
  ),
};
