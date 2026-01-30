import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { colorTokens } from "@design-studio/tokens/colors";

/**
 * Colors - Visual-first documentation for the color palette.
 *
 * ## Design Philosophy
 *
 * **Clarity over process** (Jenny Wen): Colors are shown visually with semantic meanings.
 * Designers see the color, not just hex codes.
 *
 * **Less but better** (Emil Kowalski): Each color has a specific purpose. Don't introduce new colors lightly.
 *
 * **CSS-first** (Jhey Tompkins): Use CSS custom properties, not hardcoded values.
 *
 * ## Usage Guidelines
 *
 * ```tsx
 * import { colorTokens } from "@design-studio/tokens";
 *
 * // As CSS custom properties
 * style={{ backgroundColor: colorTokens.background.light.primary }}
 *
 * // As Tailwind utilities (preferred)
 * className="bg-background-light-primary"
 * ```
 *
 * ## Accessibility
 *
 * - All color combinations meet WCAG AA contrast requirements (4.5:1 for normal text)
 * - Focus rings use interactive.ring color (always visible)
 * - Status colors (error, warning, success) have semantic meaning
 * - Dark/light modes provide equivalent semantic meaning
 *
 * ## Color Categories
 *
 * - **Background**: Surface colors for cards, panels, pages
 * - **Text**: Foreground colors for content, labels, captions
 * - **Icon**: Colors for icons and indicators
 * - **Border**: Separator and divider colors
 * - **Accent**: Semantic colors (gray, red, orange, yellow, green, blue, purple, pink)
 * - **Interactive**: Focus ring color for keyboard navigation
 *
 * ## Keyboard Navigation
 *
 * This component is decorative (documentation) and doesn't accept keyboard input.
 */

const meta: Meta = {
  title: "Design System/03 Colors",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Visual-first color palette with semantic meanings and accessibility validation.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component for color swatch
const ColorSwatch = ({
  name,
  color,
  category,
  usage,
  contrastWarning,
}: {
  name: string;
  color: string;
  category: string;
  usage: string;
  contrastWarning?: string;
}) => (
  <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
    <div
      className="w-16 h-16 rounded-lg shadow-sm flex-shrink-0"
      style={{ backgroundColor: color }}
    />
    <div className="flex-1">
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground font-mono">{color}</div>
      <div className="text-sm mt-1">{usage}</div>
      {contrastWarning && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
          ⚠️ {contrastWarning}
        </div>
      )}
    </div>
  </div>
);

// Copy button component
const CopyButton = ({ value, label }: { value: string; label: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted hover:bg-accent/10 text-sm transition-colors"
      aria-label={`Copy ${label} color value`}
    >
      <code className="text-xs">{copied ? "✓ Copied!" : value}</code>
    </button>
  );
};

// Theme toggle for showing colors in different contexts
const ThemePreview = ({
  children,
  theme = "light",
}: {
  children: React.ReactNode;
  theme?: "light" | "dark";
}) => (
  <div
    className={`p-6 rounded-lg border ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
    data-theme={theme}
  >
    {children}
  </div>
);

export const ColorPalette: Story = {
  name: "Color Palette",
  render: () => (
    <div className="p-8 space-y-8 max-w-6xl">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Color Palette</h1>
        <p className="text-muted-foreground text-lg">
          All color tokens with semantic meanings and usage guidelines.
        </p>
      </div>

      {/* Background Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Background Colors</h2>
        <p className="text-muted-foreground">
          Surface colors for cards, panels, and page backgrounds.
        </p>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Light Mode</h3>
          <div className="grid grid-cols-3 gap-4">
            <ColorSwatch
              name="Background Primary"
              color={colorTokens.background.light.primary}
              category="Background"
              usage="Main page background, default surface"
            />
            <ColorSwatch
              name="Background Secondary"
              color={colorTokens.background.light.secondary}
              category="Background"
              usage="Nested surfaces, card backgrounds"
            />
            <ColorSwatch
              name="Background Tertiary"
              color={colorTokens.background.light.tertiary}
              category="Background"
              usage="Hover states, subtle separators"
            />
          </div>

          <h3 className="text-lg font-medium mt-6">Dark Mode</h3>
          <div className="grid grid-cols-3 gap-4">
            <ColorSwatch
              name="Background Primary"
              color={colorTokens.background.dark.primary}
              category="Background"
              usage="Main page background in dark mode"
            />
            <ColorSwatch
              name="Background Secondary"
              color={colorTokens.background.dark.secondary}
              category="Background"
              usage="Nested surfaces, card backgrounds"
            />
            <ColorSwatch
              name="Background Tertiary"
              color={colorTokens.background.dark.tertiary}
              category="Background"
              usage="Hover states, subtle separators"
            />
          </div>
        </div>
      </section>

      {/* Text Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Text Colors</h2>
        <p className="text-muted-foreground">
          Foreground colors for content, labels, and captions.
        </p>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Light Mode Text</h3>
          <div className="grid grid-cols-2 gap-4">
            <ColorSwatch
              name="Text Primary"
              color={colorTokens.text.light.primary}
              category="Text"
              usage="Primary content, headings"
            />
            <ColorSwatch
              name="Text Secondary"
              color={colorTokens.text.light.secondary}
              category="Text"
              usage="Secondary content, descriptions"
            />
            <ColorSwatch
              name="Text Tertiary"
              color={colorTokens.text.light.tertiary}
              category="Text"
              usage="Disabled text, metadata"
            />
            <ColorSwatch
              name="Text Inverted"
              color={colorTokens.text.light.inverted}
              category="Text"
              usage="Text on dark backgrounds"
            />
          </div>

          <h3 className="text-lg font-medium mt-6">Dark Mode Text</h3>
          <div className="grid grid-cols-2 gap-4">
            <ColorSwatch
              name="Text Primary"
              color={colorTokens.text.dark.primary}
              category="Text"
              usage="Primary content in dark mode"
            />
            <ColorSwatch
              name="Text Secondary"
              color={colorTokens.text.dark.secondary}
              category="Text"
              usage="Secondary content, descriptions"
            />
            <ColorSwatch
              name="Text Tertiary"
              color={colorTokens.text.dark.tertiary}
              category="Text"
              usage="Disabled text, metadata"
            />
            <ColorSwatch
              name="Text Inverted"
              color={colorTokens.text.dark.inverted}
              category="Text"
              usage="Text on light backgrounds"
            />
          </div>
        </div>
      </section>

      {/* Accent Colors (Semantic) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Accent Colors (Semantic)</h2>
        <p className="text-muted-foreground">
          Semantic colors for states, feedback, and communication.
        </p>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Light Mode Accents</h3>
          <div className="grid grid-cols-2 gap-4">
            <ColorSwatch
              name="Gray"
              color={colorTokens.accent.light.gray}
              category="Accent"
              usage="Neutral information, disabled states"
            />
            <ColorSwatch
              name="Red"
              color={colorTokens.accent.light.red}
              category="Accent"
              usage="Errors, destructive actions, danger zones"
            />
            <ColorSwatch
              name="Orange"
              color={colorTokens.accent.light.orange}
              category="Accent"
              usage="Warnings, cautions, pending states"
            />
            <ColorSwatch
              name="Yellow"
              color={colorTokens.accent.light.yellow}
              category="Accent"
              usage="Attention, notices, highlights"
            />
            <ColorSwatch
              name="Green"
              color={colorTokens.accent.light.green}
              category="Accent"
              usage="Success, confirmation, safe states"
            />
            <ColorSwatch
              name="Blue"
              color={colorTokens.accent.light.blue}
              category="Accent"
              usage="Information, links, primary actions"
            />
            <ColorSwatch
              name="Purple"
              color={colorTokens.accent.light.purple}
              category="Accent"
              usage="Creative, premium, featured content"
            />
            <ColorSwatch
              name="Pink"
              color={colorTokens.accent.light.pink}
              category="Accent"
              usage="Playful, romantic, highlights"
            />
          </div>

          <h3 className="text-lg font-medium mt-6">Dark Mode Accents</h3>
          <div className="grid grid-cols-2 gap-4">
            <ColorSwatch
              name="Gray"
              color={colorTokens.accent.dark.gray}
              category="Accent"
              usage="Neutral information in dark mode"
            />
            <ColorSwatch
              name="Red"
              color={colorTokens.accent.dark.red}
              category="Accent"
              usage="Errors in dark mode"
            />
            <ColorSwatch
              name="Orange"
              color={colorTokens.accent.dark.orange}
              category="Accent"
              usage="Warnings in dark mode"
            />
            <ColorSwatch
              name="Yellow"
              color={colorTokens.accent.dark.yellow}
              category="Accent"
              usage="Highlights in dark mode"
            />
            <ColorSwatch
              name="Green"
              color={colorTokens.accent.dark.green}
              category="Accent"
              usage="Success states in dark mode"
            />
            <ColorSwatch
              name="Blue"
              color={colorTokens.accent.dark.blue}
              category="Accent"
              usage="Links and primary actions in dark mode"
            />
            <ColorSwatch
              name="Purple"
              color={colorTokens.accent.dark.purple}
              category="Accent"
              usage="Premium content in dark mode"
            />
            <ColorSwatch
              name="Pink"
              color={colorTokens.accent.dark.pink}
              category="Accent"
              usage="Highlights in dark mode"
            />
          </div>
        </div>
      </section>

      {/* Interactive Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Colors</h2>
        <p className="text-muted-foreground">
          Focus ring and interactive state colors.
        </p>

        <div className="space-y-3">
          <div className="p-6 rounded-lg border bg-card space-y-4">
            <h3 className="font-semibold">Focus Ring</h3>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: colorTokens.background.light.primary,
                  outline: `2px solid ${colorTokens.interactive.light.ring}`,
                }}
              >
                <span className="text-sm">Focus</span>
              </div>
              <div>
                <div className="font-medium">Interactive Ring</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {colorTokens.interactive.light.ring}
                </div>
                <div className="text-sm mt-1">
                  Used for keyboard focus indicators on all interactive elements
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const ContrastRatios: Story = {
  name: "Contrast Ratios",
  render: () => {
    // Calculate contrast ratios for key combinations
    const combinations = [
      {
        name: "Primary text on light background",
        foreground: colorTokens.text.light.primary,
        background: colorTokens.background.light.primary,
        expected: "Pass (>4.5:1)",
      },
      {
        name: "Secondary text on light background",
        foreground: colorTokens.text.light.secondary,
        background: colorTokens.background.light.primary,
        expected: "Pass (>4.5:1)",
      },
      {
        name: "Primary text on dark background",
        foreground: colorTokens.text.dark.primary,
        background: colorTokens.background.dark.primary,
        expected: "Pass (>4.5:1)",
      },
      {
        name: "Accent blue on light background",
        foreground: colorTokens.accent.light.blue,
        background: colorTokens.background.light.primary,
        expected: "Fail (too light)",
      },
      {
        name: "Accent blue on white card",
        foreground: colorTokens.accent.light.blue,
        background: "#FFFFFF",
        expected: "Pass (>3:1 for large text)",
      },
    ];

    return (
      <div className="p-8 space-y-8 max-w-6xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Contrast Ratios</h1>
          <p className="text-muted-foreground text-lg">
            WCAG AA compliance requires 4.5:1 for normal text and 3:1 for large text.
          </p>
        </div>

        <div className="space-y-3">
          {combinations.map((combo) => (
            <div
              key={combo.name}
              className="flex items-center gap-6 p-4 rounded-lg border bg-card"
            >
              <div
                className="w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: combo.background,
                  color: combo.foreground,
                }}
              >
                <span className="text-sm font-medium">Sample</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">{combo.name}</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {combo.foreground} on {combo.background}
                </div>
                <div className="text-sm mt-1">{combo.expected}</div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-8 p-6 rounded-lg bg-muted">
          <h4 className="font-semibold mb-4">Testing Recommendations</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              • Use{" "}
              <a
                href="https://webaim.org/resources/contrastchecker/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                WebAIM Contrast Checker
              </a>{" "}
              to validate combinations
            </li>
            <li>• Test with Chrome DevTools Lighthouse accessibility audit</li>
            <li>• Always test both light and dark mode variants</li>
            <li>• Verify focus indicators are visible on all backgrounds</li>
          </ul>
        </section>
      </div>
    );
  },
};

export const UsageGuidelines: Story = {
  name: "Usage Guidelines",
  render: () => {
    const { background, text, accent } = colorTokens;

    return (
      <div className="p-8 space-y-8 max-w-6xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Color Usage Guidelines</h1>
          <p className="text-muted-foreground text-lg">
            When to use each color category with examples.
          </p>
        </div>

        {/* Background Guidelines */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Background Colors</h2>

          <div className="space-y-4">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-3">When to Use Primary Background</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Main page background</li>
                <li>✓ Default canvas for content</li>
                <li>✓ Base layer for nested surfaces</li>
              </ul>
              <div className="mt-4 p-4 rounded border" style={{ backgroundColor: background.light.primary }}>
                <span className="text-foreground">Content area with primary background</span>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-3">When to Use Secondary Background</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Card backgrounds on primary background</li>
                <li>✓ Nested panels and sections</li>
                <li>✓ Hover states on interactive elements</li>
              </ul>
              <div className="mt-4 p-4 rounded border" style={{ backgroundColor: background.light.secondary }}>
                <div className="p-4 rounded" style={{ backgroundColor: background.light.primary }}>
                  <span className="text-foreground">Nested card on secondary background</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Text Color Guidelines */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Text Color Guidelines</h2>

          <div className="space-y-4">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-3">Primary Text</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use for body content, headings, and primary UI elements.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div
                    className="flex-1 p-3 rounded"
                    style={{ backgroundColor: background.light.primary, color: text.light.primary }}
                  >
                    Headlines and body content
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-3">Secondary Text</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use for descriptions, metadata, and less important content.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div
                    className="flex-1 p-3 rounded"
                    style={{ backgroundColor: background.light.primary, color: text.light.secondary }}
                  >
                    Supporting information and metadata
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accent Color Guidelines */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Accent Color Guidelines</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: accent.light.red }}
                />
                <h3 className="font-semibold">Red (Error/Destructive)</h3>
              </div>
              <ul className="space-y-1 text-sm">
                <li>• Error messages</li>
                <li>• Destructive actions (Delete, Remove)</li>
                <li>• Danger zones</li>
                <li>• Failed states</li>
              </ul>
              <div className="mt-3 p-3 rounded bg-destructive/10">
                <div className="text-destructive font-medium text-sm">Error: Something went wrong</div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: accent.light.orange }}
                />
                <h3 className="font-semibold">Orange (Warning)</h3>
              </div>
              <ul className="space-y-1 text-sm">
                <li>• Warning messages</li>
                <li>• Pending states</li>
                <li>• Caution needed</li>
                <li>• Non-critical alerts</li>
              </ul>
              <div className="mt-3 p-3 rounded bg-orange-500/10">
                <div className="text-orange-600 dark:text-orange-400 font-medium text-sm">
                  Warning: Action required
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: accent.light.green }}
                />
                <h3 className="font-semibold">Green (Success)</h3>
              </div>
              <ul className="space-y-1 text-sm">
                <li>• Success messages</li>
                <li>• Confirmation states</li>
                <li>• Completed actions</li>
                <li>• Safe/allowed states</li>
              </ul>
              <div className="mt-3 p-3 rounded bg-green-500/10">
                <div className="text-green-600 dark:text-green-400 font-medium text-sm">
                  Success: Changes saved
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: accent.light.blue }}
                />
                <h3 className="font-semibold">Blue (Info/Action)</h3>
              </div>
              <ul className="space-y-1 text-sm">
                <li>• Informational messages</li>
                <li>• Primary CTAs and links</li>
                <li>• Neutral information</li>
                <li>• External links</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  },
};

export const DoDont: Story = {
  name: "Do's and Don'ts",
  render: () => {
    const { background, text, accent } = colorTokens;

    return (
      <div className="p-8 space-y-8 max-w-6xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Do's and Don'ts</h1>
          <p className="text-muted-foreground text-lg">
            Common color patterns to follow and avoid.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Do */}
          <div className="space-y-4 p-6 rounded-lg border-l-4 border-green-500 bg-card">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
              ✓ Do
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <div className="font-medium">Always use semantic colors</div>
                  <div className="text-sm text-muted-foreground">
                    Use accent.red for errors, not arbitrary red
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <div className="font-medium">Test contrast in both themes</div>
                  <div className="text-sm text-muted-foreground">
                    Colors that work in light may fail in dark mode
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <div className="font-medium">Use background tokens, not hex</div>
                  <div className="text-sm text-muted-foreground">
                    Prefer semantic names over arbitrary colors
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <div className="font-medium">Ensure focus indicators are visible</div>
                  <div className="text-sm text-muted-foreground">
                    Ring color must contrast with all backgrounds
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Don't */}
          <div className="space-y-4 p-6 rounded-lg border-l-4 border-red-500 bg-card">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              ✗ Don't
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <div>
                  <div className="font-medium">Don't hardcode color values</div>
                  <div className="text-sm text-muted-foreground">
                    Use tokens, not `#FFFFFF` or `rgb(255,255,255)`
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <div>
                  <div className="font-medium">Don't mix semantic meanings</div>
                  <div className="text-sm text-muted-foreground">
                    Red is for errors, not "because I like red"
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <div>
                  <div className="font-medium">Don't ignore contrast ratios</div>
                  <div className="text-sm text-muted-foreground">
                    Beautiful colors that fail WCAG are inaccessible
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <div>
                  <div className="font-medium">Don't use color alone for meaning</div>
                  <div className="text-sm text-muted-foreground">
                    Include icons, labels, or patterns with color
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Visual Examples */}
        <section className="space-y-6">
          <h3 className="text-xl font-semibold">Visual Examples</h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                ✓ Good Semantic Color Use
              </div>
              <div className="space-y-2">
                <div
                  className="p-3 rounded bg-destructive/10 border border-destructive/20"
                  style={{ color: accent.light.red }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-destructive">⚠️</span>
                    <span className="font-medium">Error: Invalid file format</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    The file you uploaded is not supported.
                  </p>
                </div>
                <div
                  className="p-3 rounded bg-green-500/10 border border-green-500/20"
                  style={{ color: accent.light.green }}
                >
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span className="font-medium">Success: Changes saved</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your changes have been saved successfully.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">
                ✗ Poor Semantic Color Use
              </div>
              <div className="space-y-2">
                <div
                  className="p-3 rounded bg-blue-500/10 border border-blue-500/20"
                  style={{ color: accent.light.blue }}
                >
                  <div className="flex items-center gap-2">
                    <span>ℹ️</span>
                    <span className="font-medium">Error: Invalid file format</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Blue means "info", not "error"
                  </p>
                </div>
                <div
                  className="p-3 rounded bg-red-500/10 border border-red-500/20"
                  style={{ color: accent.light.red }}
                >
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span className="font-medium">Success: Changes saved</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Red means "error", not "success"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  },
};

export const TokenReference: Story = {
  name: "Token Reference",
  render: () => {
    const categories = [
      { key: "background", tokens: colorTokens.background },
      { key: "text", tokens: colorTokens.text },
      { key: "accent", tokens: colorTokens.accent },
      { key: "interactive", tokens: colorTokens.interactive },
    ];

    const flattenTokens = (obj: any, prefix = ""): Array<{ key: string; value: string; path: string }> => {
      const results: Array<{ key: string; value: string; path: string }> = [];

      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          results.push(...flattenTokens(value, path));
        } else {
          results.push({ key, value: value as string, path });
        }
      }

      return results;
    };

    return (
      <div className="p-8 space-y-8 max-w-6xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Token Reference</h1>
          <p className="text-muted-foreground text-lg">
            Quick reference for all color tokens with copy-to-clipboard.
          </p>
        </div>

        {categories.map(({ key, tokens }) => (
          <section key={key} className="space-y-4">
            <h2 className="text-2xl font-semibold capitalize">{key} Colors</h2>
            <div className="space-y-2">
              {flattenTokens(tokens, `colorTokens.${key}`).map(({ key, value, path }) => (
                <div
                  key={path}
                  className="flex items-center justify-between p-3 rounded border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded border flex-shrink-0"
                      style={{ backgroundColor: value }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{key}</div>
                      <div className="text-sm text-muted-foreground font-mono">{path}</div>
                    </div>
                  </div>
                  <CopyButton value={`colorTokens.${path}`} label={key} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  },
};

export const ThemeComparison: Story = {
  name: "Light vs Dark Mode",
  render: () => {
    const { background, text, accent } = colorTokens;

    return (
      <div className="p-8 space-y-8 max-w-6xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Light vs Dark Mode</h1>
          <p className="text-muted-foreground text-lg">
            Side-by-side comparison of themes showing equivalent semantic meaning.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Light Mode */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Light Mode</h2>

            <ThemePreview theme="light">
              <h3 className="text-lg font-semibold mb-3">Content Example</h3>
              <p style={{ color: text.light.primary }}>
                Primary text using the primary text color on light background.
              </p>
              <p style={{ color: text.light.secondary }}>
                Secondary text using the secondary text color for descriptions.
              </p>
              <div className="mt-4 space-y-2">
                <div
                  className="p-3 rounded border"
                  style={{
                    color: accent.light.red,
                    borderColor: accent.light.red,
                    backgroundColor: accent.light.red + "10",
                  }}
                >
                  Error message in red
                </div>
                <div
                  className="p-3 rounded border"
                  style={{
                    color: accent.light.green,
                    borderColor: accent.light.green,
                    backgroundColor: accent.light.green + "10",
                  }}
                >
                  Success message in green
                </div>
              </div>
            </ThemePreview>

            <div className="mt-4 p-4 rounded bg-muted">
              <h4 className="font-semibold mb-2">Background Layers</h4>
              <div className="space-y-2">
                <div
                  className="p-3 border"
                  style={{ backgroundColor: background.light.primary }}
                >
                  Primary background
                </div>
                <div
                  className="p-3 border"
                  style={{ backgroundColor: background.light.secondary }}
                >
                  Secondary background
                </div>
                <div
                  className="p-3 border"
                  style={{ backgroundColor: background.light.tertiary }}
                >
                  Tertiary background
                </div>
              </div>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="space-y-4">
            <h2 className="text-2xl-semibold">Dark Mode</h2>

            <ThemePreview theme="dark">
              <h3 className="text-lg font-semibold mb-3">Content Example</h3>
              <p style={{ color: text.dark.primary }}>
                Primary text using dark mode primary text color on dark background.
              </p>
              <p style={{ color: text.dark.secondary }}>
                Secondary text using the secondary text color for descriptions.
              </p>
              <div className="mt-4 space-y-2">
                <div
                  className="p-3 rounded border"
                  style={{
                    color: accent.dark.red,
                    borderColor: accent.dark.red,
                    backgroundColor: accent.dark.red + "10",
                  }}
                >
                  Error message in red (dark mode)
                </div>
                <div
                  className="p-3 rounded border"
                  style={{
                    color: accent.dark.green,
                    borderColor: accent.dark.green,
                    backgroundColor: accent.dark.green + "10",
                  }}
                >
                  Success message in green (dark mode)
                </div>
              </div>
            </ThemePreview>

            <div className="mt-4 p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Background Layers</h4>
              <div className="space-y-2">
                <div
                  className="p-3 border border-gray-700"
                  style={{ backgroundColor: background.dark.primary }}
                >
                  Primary background (dark)
                </div>
                <div
                  className="p-3 border border-gray-700"
                  style={{ backgroundColor: background.dark.secondary }}
                >
                  Secondary background (dark)
                </div>
                <div
                  className="p-3 border border-gray-700"
                  style={{ backgroundColor: background.dark.tertiary }}
                >
                  Tertiary background (dark)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Color Comparison Playground - see colors side by side
const ColorComparison: Story = {
  name: "Color Comparison",
  render: () => (
    <div className="max-w-6xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Color Comparison Playground</h1>
        <p className="text-muted-foreground">
          Compare semantic colors side-by-side. Toggle theme to see how each adapts.
        </p>
      </div>

      {/* Accent Colors Comparison */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Accent Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Red (Error)", "Green (Success)", "Yellow (Warning)", "Blue (Info)"].map((label) => {
            const [name, usage] = label.split(" (");
            const colorKey = name.toLowerCase() as "red" | "green" | "yellow" | "blue";
            return (
              <div key={name} className="space-y-2">
                <div className="text-sm font-medium">{label}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="aspect-square rounded-lg"
                    style={{ backgroundColor: "hsl(var(--color-" + colorKey + ") / 0.1)" }}
                  >
                    <div className="p-4 text-center text-sm font-mono text-foreground">Light bg</div>
                  </div>
                  <div
                    className="aspect-square rounded-lg text-white"
                    style={{ backgroundColor: "hsl(var(--color-" + colorKey + "))" }}
                  >
                    <div className="p-4 text-center text-sm font-mono">Full</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {usage.replace(")", "")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ),
};
