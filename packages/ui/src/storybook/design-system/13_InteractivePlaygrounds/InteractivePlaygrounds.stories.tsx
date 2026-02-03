import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { spacingTokens } from "@design-studio/tokens/spacing";
import { radiusTokens } from "@design-studio/tokens/radius";

/**
 * # Interactive Playgrounds
 *
 * **Purpose**: Tweak tokens in real-time and see the impact immediately.
 *
 * **Jenny Wen**: Make the default path effortless. Don't make designers guess.
 *
 * ## What This Includes
 * - Spacing Calculator: Visualize space scale, calculate gaps
 * - Radius Inspector: See border radius values on actual shapes
 * - Live token playgrounds with sliders and toggles
 */

// Spacing Calculator with live preview
const SpacingCalculator = () => {
  const [spacing, setSpacing] = React.useState(16);
  const [gap, setGap] = React.useState(16);

  return (
    <div className="max-w-4xl p-6 space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Spacing Calculator</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Adjust spacing values and see the impact on layout instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Padding: {spacing}px (s{spacing})
              </label>
              <input
                type="range"
                min={4}
                max={32}
                step={4}
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>4px</span>
                <span>32px</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Gap: {gap}px (s{gap})
              </label>
              <input
                type="range"
                min={4}
                max={32}
                step={4}
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>4px</span>
                <span>32px</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm font-medium mb-2">Token Reference</div>
              <code className="text-xs">
                padding: p-s{spacing}
                <br />
                gap: gap-s{gap}
              </code>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Preview</div>
            <div
              className="rounded-lg border bg-accent/10 p-4"
              style={{ padding: `${spacing}px`, gap: `${gap}px` }}
            >
              <div className="text-sm font-medium">Content with adjusted spacing</div>
              <div className="text-xs text-muted-foreground">
                Notice how the breathing room changes
              </div>
            </div>

            <div className="text-sm text-muted-foreground">Space Scale Reference</div>
            <div className="grid grid-cols-4 gap-2">
              {[8, 12, 16, 20, 24, 32].map((s) => (
                <div
                  key={s}
                  className="text-center p-2 rounded border text-xs"
                  style={{
                    backgroundColor: spacing === s ? "hsl(var(--color-accent) / 0.1)" : undefined,
                  }}
                >
                  <div className="font-mono">s{s}</div>
                  <div className="text-muted-foreground">{s}px</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Radius Inspector with live preview
const RadiusInspector = () => {
  const [radius, setRadius] = React.useState(12);

  return (
    <div className="max-w-4xl p-6 space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Radius Inspector</h2>
        <p className="text-sm text-muted-foreground mb-6">
          See border radius values on actual shapes. Adjust to find the right feel.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Radius: {radius}px (r{radius})
              </label>
              <input
                type="range"
                min={0}
                max={24}
                step={4}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0px (sharp)</span>
                <span>24px (round)</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm font-medium mb-2">Token Reference</div>
              <code className="text-xs">border-radius: r{radius}px</code>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Preview on Shapes</div>
            <div className="flex gap-4">
              <div
                className="w-20 h-20 border-2 border-accent flex items-center justify-center text-xs"
                style={{ borderRadius: `${radius}px` }}
              >
                Square
              </div>
              <div
                className="w-20 h-20 border-2 border-accent flex items-center justify-center text-xs"
                style={{ borderRadius: `${radius}px` }}
              >
                Rect
              </div>
              <div className="w-20 h-20 border-2 border-accent rounded-full flex items-center justify-center text-xs">
                Circle
              </div>
            </div>

            <div className="text-sm text-muted-foreground">On Buttons</div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 border-2 border-accent text-sm"
                style={{ borderRadius: `${radius}px` }}
              >
                Sharp
              </button>
              <button
                className="px-4 py-2 bg-accent text-accent-foreground text-sm"
                style={{ borderRadius: `${radius}px` }}
              >
                Rounded
              </button>
            </div>

            <div className="text-sm text-muted-foreground">Radius Scale Reference</div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 4, 8, 12, 16, 20, 24].map((r) => (
                <div
                  key={r}
                  className="text-center p-2 rounded border text-xs cursor-pointer hover:bg-accent/5"
                  style={{
                    backgroundColor: radius === r ? "hsl(var(--color-accent) / 0.1)" : undefined,
                  }}
                  onClick={() => setRadius(r)}
                >
                  <div className="font-mono">r{r || "0"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/13 Interactive Playgrounds",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Interactive playgrounds for exploring tokens with live controls. Adjust spacing, radius, and more in real-time.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpacingCalculatorStory: Story = {
  name: "Spacing Calculator",
  render: () => <SpacingCalculator />,
};

export const RadiusInspectorStory: Story = {
  name: "Radius Inspector",
  render: () => <RadiusInspector />,
};
