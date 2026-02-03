import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { radiusTokens } from "@design-studio/tokens/radius";
import { spacingTokens } from "@design-studio/tokens/spacing";
import { shadowTokens } from "@design-studio/tokens/shadows";

/**
 * # Interactive Pattern Builder
 *
 * **Purpose**: Build and customize patterns in real-time. See token combinations instantly.
 *
 * **Jenny Wen**: Make the default path effortless. Start with a good default.
 *
 * ## What This Includes
 * - Live Card Customizer: Adjust spacing, radius, shadow and see the card update
 * - Pattern Builder: Combine tokens to create new patterns
 * - Token Recipe Generator: Get copy-pasteable code for your custom pattern
 */

const shadowToBoxShadow = (shadow: keyof typeof shadowTokens): string => {
  const layers = shadowTokens[shadow];
  return layers
    .map(
      (layer) =>
        `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`,
    )
    .join(", ");
};

// Live Card Customizer
const CardCustomizer = () => {
  const [radius, setRadius] = React.useState(12);
  const [padding, setPadding] = React.useState(16);
  const [shadow, setShadow] = React.useState<"card" | "none">("card");

  return (
    <div className="max-w-4xl p-6 space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Live Card Customizer</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Adjust the controls below to customize the card in real-time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Border Radius: r{radius}</label>
              <input
                type="range"
                min={0}
                max={24}
                step={4}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Padding: s{padding}</label>
              <input
                type="range"
                min={8}
                max={32}
                step={4}
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Shadow</label>
              <select
                value={shadow}
                onChange={(e) => setShadow(e.target.value as "card" | "none")}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm"
              >
                <option value="card">Card (elevated)</option>
                <option value="none">None (flat)</option>
              </select>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm font-medium mb-2">Generated Code</div>
              <code className="text-xs block bg-background p-2 rounded">
                {`className="rounded-lg border p-s${padding}"`}
              </code>
              <code className="text-xs block bg-background p-2 rounded mt-1">
                {`style={{ borderRadius: "${radius}px", boxShadow: ${shadow === "card" ? "var(--shadow-card)" : "none"} }}`}
              </code>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Preview</div>
            <div
              className="border bg-card transition-all hover:shadow-lg"
              style={{
                borderRadius: `${radius}px`,
                padding: `${padding}px`,
                boxShadow: shadow === "card" ? shadowToBoxShadow("card") : "none",
              }}
            >
              <div className="flex items-center border-b bg-muted/30" style={{ height: "56px" }}>
                <div className="font-semibold px-4">Card Title</div>
              </div>
              <div className="p-4">
                <div className="text-sm text-muted-foreground">
                  Adjust the controls to customize this card. The values update in real-time.
                </div>
              </div>
            </div>

            {/* Token breakdown */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Radius:</span>
                <span className="font-mono">r{radius}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Padding:</span>
                <span className="font-mono">s{padding}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shadow:</span>
                <span className="font-mono">{shadow}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pattern Builder - combine tokens to create patterns
const PatternBuilder = () => {
  const [pattern, setPattern] = React.useState({
    name: "My Custom Card",
    radius: 12,
    padding: 16,
    headerHeight: 56,
    shadow: "card",
    bgColor: "card",
    borderColor: true,
  });

  return (
    <div className="max-w-4xl p-6 space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Pattern Builder</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Combine tokens to create your own custom pattern. Copy the code when satisfied.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Builder Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1">Pattern Name</label>
              <input
                type="text"
                value={pattern.name}
                onChange={(e) => setPattern({ ...pattern, name: e.target.value })}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Border Radius (r{pattern.radius})</label>
              <input
                type="range"
                min={0}
                max={24}
                step={4}
                value={pattern.radius}
                onChange={(e) => setPattern({ ...pattern, radius: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">Padding (s{pattern.padding})</label>
              <input
                type="range"
                min={8}
                max={32}
                step={4}
                value={pattern.padding}
                onChange={(e) => setPattern({ ...pattern, padding: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1">
                Header Height ({pattern.headerHeight}px)
              </label>
              <input
                type="range"
                min={40}
                max={80}
                step={8}
                value={pattern.headerHeight}
                onChange={(e) => setPattern({ ...pattern, headerHeight: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shadow"
                checked={pattern.shadow === "card"}
                onChange={(e) =>
                  setPattern({ ...pattern, shadow: e.target.checked ? "card" : "none" })
                }
                className="w-4 h-4"
              />
              <label htmlFor="shadow" className="text-sm">
                Add shadow
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="border"
                checked={pattern.borderColor}
                onChange={(e) => setPattern({ ...pattern, borderColor: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="border" className="text-sm">
                Add border
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Preview</div>
            <div
              className="border bg-card"
              style={{
                borderRadius: `${pattern.radius}px`,
                boxShadow: pattern.shadow === "card" ? shadowToBoxShadow("card") : "none",
              }}
            >
              {pattern.borderColor && (
                <div
                  className="border-b"
                  style={{ height: "1px", backgroundColor: "var(--color-border)" }}
                />
              )}
              <div
                className="flex items-center bg-muted/30"
                style={{ height: `${pattern.headerHeight}px` }}
              >
                <div className="font-semibold px-4">{pattern.name}</div>
              </div>
              <div style={{ padding: `${pattern.padding}px` }}>
                <div className="text-sm text-muted-foreground">
                  Your custom card pattern. Adjust the controls to finalize the design.
                </div>
              </div>
            </div>

            {/* Code Output */}
            <div className="mt-4 p-4 rounded-lg bg-muted">
              <div className="text-sm font-medium mb-2">Pattern Code</div>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                {`const ${pattern.name.toLowerCase().replace(/\s+/g, "-")} = ({ title, children }) => (
  <div
    className="border bg-card"
    style={{
      borderRadius: "${pattern.radius}px",
      padding: "${pattern.padding}px",
      boxShadow: ${pattern.shadow === "card" ? "var(--shadow-card)" : "none"},
    }}
  >
    <div className="flex items-center bg-muted/30" style={{ height: "${pattern.headerHeight}px" }}>
      <div className="font-semibold px-4">{title}</div>
    </div>
    <div style={{ padding: "${pattern.padding}px" }}>
      {children}
    </div>
  </div>
);`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/14 Interactive Patterns",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Interactive pattern builder with live customization. Adjust tokens and see your pattern update instantly.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardCustomizerStory: Story = {
  name: "Card Customizer",
  render: () => <CardCustomizer />,
};

export const PatternBuilderStory: Story = {
  name: "Pattern Builder",
  render: () => <PatternBuilder />,
};
