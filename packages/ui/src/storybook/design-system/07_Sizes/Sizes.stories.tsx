import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { sizeTokens } from "@design-studio/tokens/sizes";

/**
 * Component Sizes System - Design Foundation
 *
 * ## Overview
 * Component size tokens define standard dimensions for common UI elements. These sizes
 * ensure consistency across the interface and meet accessibility requirements.
 *
 * ## Size Tokens
 * - **controlHeight**: 44px - Standard height for buttons, inputs, form controls
 * - **cardHeaderHeight**: 56px - Standard height for card headers
 * - **hitTarget**: 44px - Minimum touch target size (WCAG 2.1 AAA)
 *
 * ## Why 44px?
 * The 44px value is not arbitrary—it comes from accessibility guidelines:
 * - **WCAG 2.1 AAA**: Recommends 44x44px minimum touch target
 * - **Apple HIG**: 44x44pt minimum tappable area
 * - **Material Design**: 48x48dp recommended (44dp minimum)
 * - **Android**: 48x48dp standard touch target
 *
 * ## Usage Guidelines
 * - **All interactive elements**: Min 44px height (including padding)
 * - **Form controls**: Use 44px height for inputs, selects, dropdowns
 * - **Card headers**: Use 56px for consistent header appearance
 * - **Icons in buttons**: Count padding toward 44px minimum
 *
 * ## Design Principles
 * - **Accessibility first**: Touch targets are non-negotiable for mobile usability
 * - **Consistency**: All buttons/inputs use same height for visual rhythm
 * - **Padding included**: Hit target includes padding, not just the visible element
 * - **Platform alignment**: 44px works across iOS, Android, and web
 *
 * ## Accessibility
 * - **Minimum 44x44px**: Required for mobile touch targets (WCAG 2.1 AAA)
 * - **Spacing between targets**: 8px minimum gap between adjacent touch targets
 * - **Don't rely on hover**: Touch users don't have hover state
 * - **Visual vs touch target**: Visible button can be smaller if padding creates 44px tap area
 */

const SIZE_TOKENS = [
  {
    name: "controlHeight",
    value: 44,
    unit: "px",
    usage: "Standard height for buttons, inputs, form controls",
    wcag: "WCAG 2.1 AAA minimum touch target",
  },
  {
    name: "cardHeaderHeight",
    value: 56,
    unit: "px",
    usage: "Standard height for card headers, panel headers",
    wcac: "Derived from controlHeight + comfortable padding",
  },
  {
    name: "hitTarget",
    value: 44,
    unit: "px",
    usage: "Minimum touch target size for interactive elements",
    wcag: "WCAG 2.1 AAA, Apple HIG, Android recommendation",
  },
] as const;

const SizeVisualizer = ({
  name,
  value,
  usage,
  wcag,
}: {
  name: string;
  value: number;
  usage: string;
  wcag?: string;
}) => (
  <button
    onClick={() => navigator.clipboard.writeText(name)}
    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors w-full"
  >
    <div
      className="bg-accent/20 border-2 border-accent/40 flex items-center justify-center text-accent font-mono text-sm"
      style={{ width: "80px", height: `${value}px` }}
    >
      {value}px
    </div>
    <div className="flex-1 text-left">
      <div className="font-medium">{name}</div>
      <div className="text-sm font-mono text-muted-foreground">{value}px</div>
      <div className="text-xs text-muted-foreground mt-1">{usage}</div>
      {wcag && (
        <div className="text-xs text-accent mt-1">♿ {wcag}</div>
      )}
    </div>
  </button>
);

const ControlHeightDemo = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Control Height (44px)</h3>
      <p className="text-sm text-muted-foreground">
        All form controls and buttons use 44px height for consistency and accessibility.
      </p>
    </div>

    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Buttons</div>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm"
            style={{ height: "44px" }}
          >
            Default Button
          </button>
          <button
            className="px-4 py-2 rounded-md border text-sm"
            style={{ height: "44px" }}
          >
            Outline Button
          </button>
          <button
            className="px-4 py-2 rounded-md bg-muted text-sm"
            style={{ height: "44px" }}
          >
            Ghost Button
          </button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          All buttons are 44px tall (content + padding)
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Inputs</div>
        <div className="space-y-3 max-w-md">
          <input
            type="text"
            placeholder="Standard input"
            className="w-full px-3 rounded-md border bg-background"
            style={{ height: "44px" }}
          />
          <input
            type="email"
            placeholder="Email input"
            className="w-full px-3 rounded-md border bg-background"
            style={{ height: "44px" }}
          />
          <select
            className="w-full px-3 rounded-md border bg-background"
            style={{ height: "44px" }}
          >
            <option>Select dropdown</option>
          </select>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          All form controls are 44px tall for touch-friendly targets
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Icon Buttons</div>
        <div className="flex gap-2">
          <button
            className="p-3 rounded-md hover:bg-muted/80"
            aria-label="Edit"
            style={{ width: "44px", height: "44px" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="p-3 rounded-md hover:bg-muted/80"
            aria-label="Copy"
            style={{ width: "44px", height: "44px" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            className="p-3 rounded-md hover:bg-muted/80"
            aria-label="Delete"
            style={{ width: "44px", height: "44px" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Icon buttons are 44x44px (full square touch target)
        </div>
      </div>
    </div>
  </div>
);

const CardHeaderDemo = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Card Header Height (56px)</h3>
      <p className="text-sm text-muted-foreground">
        Standard header height creates consistent card appearance across the interface.
      </p>
    </div>

    <div className="space-y-4">
      <div className="rounded-lg border bg-card overflow-hidden">
        <div
          className="px-4 flex items-center border-b bg-muted/30"
          style={{ height: "56px" }}
        >
          <div className="font-semibold">Card Title</div>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Card content goes here. The header is exactly 56px tall for consistency.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div
          className="px-4 flex items-center justify-between border-b bg-muted/30"
          style={{ height: "56px" }}
        >
          <div className="font-semibold">With Actions</div>
          <button className="text-sm text-accent">Edit</button>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Headers with actions also use 56px height.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div
          className="px-4 flex items-center gap-3 border-b bg-muted/30"
          style={{ height: "56px" }}
        >
          <div className="w-8 h-8 rounded bg-accent/20" />
          <div className="font-semibold">With Icon</div>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Icons fit comfortably within 56px header height.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const HitTargetDemo = () => {
  const [showTarget, setShowTarget] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Hit Target (44px Minimum)</h3>
        <p className="text-sm text-muted-foreground">
          Toggle the visualization to see actual touch targets vs visible elements.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowTarget(!showTarget)}
          className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm"
        >
          {showTarget ? "Hide" : "Show"} Touch Targets
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative inline-block">
          <button className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm">
            Small Button
          </button>
          {showTarget && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-accent/50 rounded"
              style={{ width: "44px", height: "44px" }}
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="p-2 rounded-md bg-muted"
              aria-label="Edit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            {showTarget && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-accent/50 rounded"
                style={{ width: "44px", height: "44px" }}
              />
            )}
          </div>

          <div className="relative">
            <button
              className="p-1 rounded-md bg-muted"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {showTarget && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-accent/50 rounded"
                style={{ width: "44px", height: "44px" }}
              />
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Icons may be small, but padding creates 44px touch target
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium mb-3">Touch Target Spacing</div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-md bg-accent text-accent-foreground text-sm"
              style={{ height: "44px" }}
            >
              Button A
            </button>
            <button
              className="px-3 py-2 rounded-md bg-muted text-sm"
              style={{ height: "44px" }}
            >
              Button B
            </button>
            <button
              className="px-3 py-2 rounded-md border text-sm"
              style={{ height: "44px" }}
            >
              Button C
            </button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Maintain 8px minimum gap between adjacent touch targets
          </div>
        </div>
      </div>
    </div>
  );
};

const AccessibilityGuide = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Accessibility Guidelines</h3>
      <p className="text-sm text-muted-foreground">
        Understanding why 44px is the minimum touch target size.
      </p>
    </div>

    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h4 className="font-medium mb-2">Why 44x44px?</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Human finger size:</span> Average adult finger pad is
            10-14mm wide. 44px (≈1/3 inch) accommodates most users.
          </div>
          <div>
            <span className="font-medium">Motor accuracy:</span> Larger targets reduce
            mis-taps and improve input accuracy.
          </div>
          <div>
            <span className="font-medium">Situational factors:</span> Users may be on the move,
            in vehicles, or have motor impairments.
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h4 className="font-medium mb-2">Platform Guidelines</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Apple Human Interface Guidelines:</span> 44x44pt
            minimum tappable area
          </div>
          <div>
            <span className="font-medium">Material Design:</span> 48x48dp recommended, 48x48dp
            minimum
          </div>
          <div>
            <span className="font-medium">WCAG 2.1 AAA:</span> 44x44 CSS pixel minimum
            touch target
          </div>
          <div>
            <span className="font-medium">Android:</span> 48x48dp standard touch target
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h4 className="font-medium mb-2">Common Mistakes</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-destructive">✗ Icon-only buttons without padding:</span>{" "}
            16px icon ≠ 16px touch target. Add padding!
          </div>
          <div>
            <span className="font-medium text-destructive">✗ Text links as buttons:</span>{" "}
            Underlined text alone is too small. Use button styling.
          </div>
          <div>
            <span className="font-medium text-destructive">✗ Crammed buttons:</span>{" "}
            Multiple small buttons next to each other increase error rate.
          </div>
          <div>
            <span className="font-medium text-accent">✓ Padding counts toward touch target:</span>{" "}
            20px icon + 12px padding each side = 44px touch target ✓
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h4 className="font-medium mb-2">Desktop vs Mobile</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Mobile:</span> 44px minimum (required for touch)
          </div>
          <div>
            <span className="font-medium">Desktop:</span> Can be smaller (32px common), but 44px
            is still recommended for consistency
          </div>
          <div>
            <span className="font-medium">Best practice:</span> Use 44px everywhere—consistent
            sizing, accessible to all
          </div>
        </div>
      </div>
    </div>
  </div>
);

const meta = {
  title: "Design System/07 Sizes",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component size system documentation with visual examples and accessibility guidelines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const SizeTokens: Story = {
  name: "Size Tokens",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Component Size Tokens</h2>
        <p className="text-muted-foreground mb-6">
          Standard dimensions for common UI elements. Click any value to copy its token name.
        </p>
      </div>

      <div className="space-y-3">
        {SIZE_TOKENS.map((token) => (
          <SizeVisualizer key={token.name} {...token} />
        ))}
      </div>

      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="text-sm font-medium text-accent">💡 Key Insight</div>
        <p className="text-sm text-muted-foreground mt-1">
          Both <code>controlHeight</code> and <code>hitTarget</code> are 44px. This is the WCAG
          2.1 AAA minimum touch target size—a non-negotiable accessibility requirement for mobile
          interfaces.
        </p>
      </div>
    </div>
  ),
};

export const ControlHeight: Story = {
  name: "Control Height",
  render: () => <ControlHeightDemo />,
};

export const CardHeaders: Story = {
  name: "Card Headers",
  render: () => <CardHeaderDemo />,
};

export const HitTargets: Story = {
  name: "Touch Targets",
  render: () => <HitTargetDemo />,
};

export const Accessibility: Story = {
  name: "Accessibility Guide",
  render: () => <AccessibilityGuide />,
};

export const TokenReference: Story = {
  name: "Token Reference",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Reference</h2>
        <p className="text-muted-foreground">
          Size tokens and usage guidelines.
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Token</th>
              <th className="text-left p-3 font-semibold">Value</th>
              <th className="text-left p-3 font-semibold">Usage</th>
              <th className="text-left p-3 font-semibold">Accessibility</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_TOKENS.map((token, i) => (
              <tr key={token.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="p-3 font-mono text-sm">{token.name}</td>
                <td className="p-3 font-mono text-sm">{token.value}px</td>
                <td className="p-3 text-sm text-muted-foreground">{token.usage}</td>
                <td className="p-3 text-xs text-accent">{token.wcag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Import Size Tokens</div>
        <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`import { sizeTokens } from "@design-studio/tokens/sizes";

// Usage in components
const inputStyle = {
  height: \`\${sizeTokens.controlHeight}px\` // 44px
};

const cardHeaderStyle = {
  height: \`\${sizeTokens.cardHeaderHeight}px\` // 56px
};`}
        </pre>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">CSS-in-JS with Tailwind</div>
        <div className="text-sm space-y-1">
          <div><code>h-[44px]</code> → Control height, hit target</div>
          <div><code>h-[56px]</code> → Card header height</div>
          <div><code>min-h-[44px]</code> → Minimum touch target</div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Related Guidelines</div>
        <div className="text-sm space-y-1">
          <div>• Spacing system: Use for padding around touch targets</div>
          <div>• Radius system: Rounded corners don't count toward hit target</div>
          <div>• Typography: Ensure text fits within 44px minimum height</div>
        </div>
      </div>
    </div>
  ),
};
