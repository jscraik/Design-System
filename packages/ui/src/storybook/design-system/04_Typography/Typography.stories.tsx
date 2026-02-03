import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { typographyTokens } from "@design-studio/tokens/typography";

/**
 * Typography Scale - Visual-first documentation for type decisions.
 *
 * ## Design Philosophy
 *
 * **Clarity over process** (Jenny Wen): This page shows typography visually first, code second.
 * Designers see the type, not just numbers.
 *
 * **Less but better** (Emil Kowalski): Each type token has a specific purpose. Don't invent new sizes.
 *
 * **CSS-first** (Jhey Tompkins): Use these tokens as Tailwind utilities or CSS variables.
 *
 * ## Usage Guidelines
 *
 * ```tsx
 * import { typographyTokens } from "@design-studio/tokens";
 *
 * // As CSS custom properties
 * style={{
 *   fontSize: `${typographyTokens.body.size}px`,
 *   lineHeight: `${typographyTokens.body.lineHeight}px`,
 *   fontWeight: typographyTokens.body.weight,
 * }}
 *
 * // As Tailwind utilities (preferred)
 * className="text-base leading-normal"
 * ```
 *
 * ## Accessibility
 *
 * - All text meets WCAG AA contrast requirements (4.5:1 for normal text)
 * - Line heights provide sufficient spacing for dyslexic readers
 * - Font sizes are never smaller than 12px (caption)
 * - Letter spacing (tracking) is optimized for readability
 *
 * ## Responsive Behavior
 *
 * Typography scales proportionally. Use container queries or media queries
 * to adjust type scale for different viewport sizes.
 *
 * ## Keyboard Navigation
 *
 * This component is decorative (documentation) and doesn't accept keyboard input.
 */

const meta: Meta = {
  title: "Design System/04 Typography",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Visual-first typography scale showing all type tokens with usage guidelines.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component for token display
const TokenDisplay = ({
  name,
  size,
  lineHeight,
  weight,
  tracking,
  emphasisWeight,
  usage,
  sample = "Aa",
}: {
  name: string;
  size: number;
  lineHeight: number;
  weight: number;
  tracking: number;
  emphasisWeight?: number;
  usage: string;
  sample?: string;
}) => {
  const lineHeightRatio = (lineHeight / size).toFixed(2);
  const trackingEm = (tracking / 1000).toFixed(3);

  return (
    <div className="flex items-start gap-6 p-6 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      {/* Visual Sample */}
      <div
        className="flex-shrink-0"
        style={{
          fontSize: `${size}px`,
          lineHeight: `${lineHeight}px`,
          fontWeight: weight,
          letterSpacing: `${trackingEm}em`,
        }}
      >
        {sample}
      </div>

      {/* Token Details */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">{name}</span>
          {emphasisWeight && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Emphasis: {emphasisWeight}
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {size}px / {lineHeight}px (ratio: {lineHeightRatio})
        </div>
        <div className="text-sm text-muted-foreground">
          Weight: {weight} / Tracking: {tracking}
        </div>
        <div className="text-sm">{usage}</div>
      </div>
    </div>
  );
};

// Helper component for copy button
const CopyButton = ({ value }: { value: string }) => {
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
    >
      <code className="text-xs">{copied ? "✓ Copied!" : value}</code>
    </button>
  );
};

export const TypeScale: Story = {
  name: "Type Scale",
  render: () => (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Typography Scale</h1>
        <p className="text-muted-foreground text-lg">
          All typography tokens with visual examples and usage guidelines.
        </p>
      </div>

      {/* Headings */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Headings</h2>
        <p className="text-muted-foreground">
          Use for page hierarchy, section titles, and content organization.
        </p>

        <div className="space-y-3">
          <TokenDisplay
            name="Hero"
            size={typographyTokens.hero.size}
            lineHeight={typographyTokens.hero.lineHeight}
            weight={typographyTokens.hero.weight}
            tracking={typographyTokens.hero.tracking}
            usage="Hero headlines, landing introductions"
            sample="Hero Headline"
          />
          <TokenDisplay
            name="H1"
            size={typographyTokens.h1.size}
            lineHeight={typographyTokens.h1.lineHeight}
            weight={typographyTokens.h1.weight}
            tracking={typographyTokens.h1.tracking}
            usage="Primary page titles"
            sample="Primary Page Title"
          />
          <TokenDisplay
            name="H2"
            size={typographyTokens.h2.size}
            lineHeight={typographyTokens.h2.lineHeight}
            weight={typographyTokens.h2.weight}
            tracking={typographyTokens.h2.tracking}
            usage="Section titles, page subheadings"
            sample="Section Title Example"
          />
          <TokenDisplay
            name="H3"
            size={typographyTokens.h3.size}
            lineHeight={typographyTokens.h3.lineHeight}
            weight={typographyTokens.h3.weight}
            tracking={typographyTokens.h3.tracking}
            usage="Subsection titles, card headers"
            sample="Subsection Title"
          />
          <TokenDisplay
            name="H4"
            size={typographyTokens.h4.size}
            lineHeight={typographyTokens.h4.lineHeight}
            weight={typographyTokens.h4.weight}
            tracking={typographyTokens.h4.tracking}
            usage="Minor headings, section labels"
            sample="Minor Heading"
          />
          <TokenDisplay
            name="H5"
            size={typographyTokens.h5.size}
            lineHeight={typographyTokens.h5.lineHeight}
            weight={typographyTokens.h5.weight}
            tracking={typographyTokens.h5.tracking}
            usage="Eyebrow headings, metadata"
            sample="Eyebrow Heading"
          />
          <TokenDisplay
            name="H6"
            size={typographyTokens.h6.size}
            lineHeight={typographyTokens.h6.lineHeight}
            weight={typographyTokens.h6.weight}
            tracking={typographyTokens.h6.tracking}
            usage="Micro headings, overlines"
            sample="Micro Heading"
          />
        </div>
      </section>

      {/* Body Text */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Body Text</h2>
        <p className="text-muted-foreground">
          Use for paragraphs, articles, and long-form content.
        </p>

        <div className="space-y-3">
          <TokenDisplay
            name="Paragraph Lg"
            size={typographyTokens.paragraphLg.size}
            lineHeight={typographyTokens.paragraphLg.lineHeight}
            weight={typographyTokens.paragraphLg.weight}
            tracking={typographyTokens.paragraphLg.tracking}
            emphasisWeight={typographyTokens.paragraphLg.emphasisWeight}
            usage="Intro paragraphs, long-form emphasis"
            sample="Intro paragraph example with extra breathing room."
          />
          <TokenDisplay
            name="Paragraph Md"
            size={typographyTokens.paragraphMd.size}
            lineHeight={typographyTokens.paragraphMd.lineHeight}
            weight={typographyTokens.paragraphMd.weight}
            tracking={typographyTokens.paragraphMd.tracking}
            emphasisWeight={typographyTokens.paragraphMd.emphasisWeight}
            usage="Default body text, content paragraphs"
            sample="Paragraph-md example with default reading size."
          />
          <TokenDisplay
            name="Paragraph Sm"
            size={typographyTokens.paragraphSm.size}
            lineHeight={typographyTokens.paragraphSm.lineHeight}
            weight={typographyTokens.paragraphSm.weight}
            tracking={typographyTokens.paragraphSm.tracking}
            emphasisWeight={typographyTokens.paragraphSm.emphasisWeight}
            usage="Secondary body text, compact content"
            sample="Smaller paragraph text for constrained spaces."
          />
          <TokenDisplay
            name="Caption"
            size={typographyTokens.caption.size}
            lineHeight={typographyTokens.caption.lineHeight}
            weight={typographyTokens.caption.weight}
            tracking={typographyTokens.caption.tracking}
            emphasisWeight={typographyTokens.caption.emphasisWeight}
            usage="Helper text, metadata, timestamps"
            sample="Caption text for labels and hints"
          />
          <TokenDisplay
            name="Body (Legacy)"
            size={typographyTokens.body.size}
            lineHeight={typographyTokens.body.lineHeight}
            weight={typographyTokens.body.weight}
            tracking={typographyTokens.body.tracking}
            emphasisWeight={typographyTokens.body.emphasisWeight}
            usage="Legacy body token (use Paragraph Md)"
            sample="Legacy body text retained for backwards compatibility."
          />
          <TokenDisplay
            name="Body Small (Legacy)"
            size={typographyTokens.bodySmall.size}
            lineHeight={typographyTokens.bodySmall.lineHeight}
            weight={typographyTokens.bodySmall.weight}
            tracking={typographyTokens.bodySmall.tracking}
            emphasisWeight={typographyTokens.bodySmall.emphasisWeight}
            usage="Legacy body token (use Paragraph Sm)"
            sample="Legacy small body text retained for compatibility."
          />
        </div>
      </section>

      {/* Component-Specific */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Component Text</h2>
        <p className="text-muted-foreground">Specialized tokens for specific UI components.</p>

        <div className="space-y-3">
          <TokenDisplay
            name="Card Title"
            size={typographyTokens.cardTitle.size}
            lineHeight={typographyTokens.cardTitle.lineHeight}
            weight={typographyTokens.cardTitle.weight}
            tracking={typographyTokens.cardTitle.tracking}
            usage="Card and panel titles"
            sample="Card Title Example"
          />
          <TokenDisplay
            name="List Title"
            size={typographyTokens.listTitle.size}
            lineHeight={typographyTokens.listTitle.lineHeight}
            weight={typographyTokens.listTitle.weight}
            tracking={typographyTokens.listTitle.tracking}
            usage="List item titles, menu items"
            sample="List Item Title"
          />
          <TokenDisplay
            name="List Subtitle"
            size={typographyTokens.listSubtitle.size}
            lineHeight={typographyTokens.listSubtitle.lineHeight}
            weight={typographyTokens.listSubtitle.weight}
            tracking={typographyTokens.listSubtitle.tracking}
            usage="List item descriptions, secondary text"
            sample="List subtitle text"
          />
          <TokenDisplay
            name="Button Label"
            size={typographyTokens.buttonLabel.size}
            lineHeight={typographyTokens.buttonLabel.lineHeight}
            weight={typographyTokens.buttonLabel.weight}
            tracking={typographyTokens.buttonLabel.tracking}
            usage="Button labels, CTAs"
            sample="Button Label"
          />
          <TokenDisplay
            name="Button Label Small"
            size={typographyTokens.buttonLabelSmall.size}
            lineHeight={typographyTokens.buttonLabelSmall.lineHeight}
            weight={typographyTokens.buttonLabelSmall.weight}
            tracking={typographyTokens.buttonLabelSmall.tracking}
            usage="Small buttons, compact CTAs"
            sample="Small Button"
          />
        </div>
      </section>
    </div>
  ),
};

export const FontWeight: Story = {
  name: "Font Weight",
  render: () => {
    const weights = [400, 500, 600, 700] as const;

    return (
      <div className="p-8 space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Font Weight Scale</h1>
          <p className="text-muted-foreground text-lg">
            All available font weights with usage examples.
          </p>
        </div>

        <div className="space-y-4">
          {weights.map((weight) => (
            <div key={weight} className="flex items-baseline gap-6 p-4 rounded-lg border bg-card">
              <div className="flex-shrink-0 w-16 text-2xl" style={{ fontWeight: weight }}>
                Aa
              </div>
              <div className="flex-1">
                <div className="font-medium" style={{ fontWeight: weight }}>
                  {weight === 400 && "Regular (400)"}
                  {weight === 500 && "Medium (500)"}
                  {weight === 600 && "Semibold (600)"}
                  {weight === 700 && "Bold (700)"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {weight === 400 && "Body text, descriptions"}
                  {weight === 500 && "Buttons, links, emphasis"}
                  {weight === 600 && "Headings, titles, highlights"}
                  {weight === 700 && "Display text, strong emphasis"}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{weight}</div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const LineHeightRhythm: Story = {
  name: "Line Height & Vertical Rhythm",
  render: () => {
    const tokens: Array<{ key: string; token: keyof typeof typographyTokens; label: string }> = [
      { key: "hero", token: "hero", label: "Hero" },
      { key: "h1", token: "h1", label: "H1" },
      { key: "h2", token: "h2", label: "H2" },
      { key: "h3", token: "h3", label: "H3" },
      { key: "h4", token: "h4", label: "H4" },
      { key: "h5", token: "h5", label: "H5" },
      { key: "h6", token: "h6", label: "H6" },
      { key: "paragraphLg", token: "paragraphLg", label: "Paragraph Lg" },
      { key: "paragraphMd", token: "paragraphMd", label: "Paragraph Md" },
      { key: "paragraphSm", token: "paragraphSm", label: "Paragraph Sm" },
      { key: "caption", token: "caption", label: "Caption" },
    ];

    return (
      <div className="p-8 space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Line Height & Vertical Rhythm</h1>
          <p className="text-muted-foreground text-lg">
            Visual comparison of line heights across the type scale. Proper line height ensures
            readability and maintains vertical rhythm.
          </p>
        </div>

        <div className="space-y-4">
          {tokens.map(({ key, token, label }) => {
            const { size, lineHeight } = typographyTokens[token];
            const ratio = (lineHeight / size).toFixed(2);
            const spacing = (lineHeight - size) / 2;

            return (
              <div key={key} className="flex items-center gap-4">
                <div className="w-24 text-sm text-muted-foreground font-mono">{label}</div>
                <div className="flex-1">
                  <div
                    className="border-2 border-dashed rounded flex items-center"
                    style={{
                      height: `${lineHeight}px`,
                      fontSize: `${size}px`,
                      fontWeight: 600,
                    }}
                  >
                    <span className="flex-1 text-center">
                      {size}px / {lineHeight}px (ratio: {ratio})
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground w-32 text-right">
                  {spacing > 0 ? `+${spacing.toFixed(1)}px above/below` : "Tight"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

export const UsageExamples: Story = {
  name: "Usage Examples",
  render: () => {
    const { h1, h2, paragraphMd, paragraphSm, caption } = typographyTokens;

    return (
      <div className="p-8 space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Usage Examples</h1>
          <p className="text-muted-foreground text-lg">
            Real-world examples of typography in context.
          </p>
        </div>

        {/* Article Example */}
        <section className="space-y-4 p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold">Article Layout</h2>
          <p className="text-muted-foreground">
            Hierarchy using headings, body, and caption tokens.
          </p>

          <article className="space-y-4">
            <h1
              style={{
                fontSize: `${h1.size}px`,
                lineHeight: `${h1.lineHeight}px`,
                fontWeight: h1.weight,
              }}
            >
              Article Title Goes Here
            </h1>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: `${caption.size}px`,
                lineHeight: `${caption.lineHeight}px`,
              }}
            >
              Published on January 29, 2026 · 5 min read
            </p>
            <p
              style={{
                fontSize: `${paragraphMd.size}px`,
                lineHeight: `${paragraphMd.lineHeight}px`,
                fontWeight: paragraphMd.weight,
              }}
            >
              This is an example of body text using the paragraph-md token. Notice how the line
              height provides comfortable reading spacing. The font size is large enough for
              readability on most screens, and the weight is regular for sustained reading.
            </p>
            <h3
              style={{
                fontSize: `${h2.size}px`,
                lineHeight: `${h2.lineHeight}px`,
                fontWeight: h2.weight,
              }}
            >
              Section Heading Example
            </h3>
            <p
              style={{
                fontSize: `${paragraphMd.size}px`,
                lineHeight: `${paragraphMd.lineHeight}px`,
                fontWeight: paragraphMd.weight,
              }}
            >
              Continue reading with more body text. The hierarchy between the heading and body text
              is clear, making the content easy to scan.
            </p>
          </article>
        </section>

        {/* Card Example */}
        <section className="space-y-4 p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold">Card Layout</h2>
          <p className="text-muted-foreground">Component-specific tokens for cards.</p>

          <div className="p-4 rounded border bg-muted space-y-2">
            <h3
              style={{
                fontSize: `${typographyTokens.cardTitle.size}px`,
                lineHeight: `${typographyTokens.cardTitle.lineHeight}px`,
                fontWeight: typographyTokens.cardTitle.weight,
              }}
            >
              Card Title Example
            </h3>
            <p
              style={{
                fontSize: `${typographyTokens.listSubtitle.size}px`,
                lineHeight: `${typographyTokens.listSubtitle.lineHeight}px`,
                fontWeight: typographyTokens.listSubtitle.weight,
              }}
            >
              Card description or metadata using the list subtitle token.
            </p>
            <p
              style={{
                fontSize: `${paragraphSm.size}px`,
                lineHeight: `${paragraphSm.lineHeight}px`,
                fontWeight: paragraphSm.weight,
              }}
            >
              Additional context or supporting information in a smaller size.
            </p>
          </div>
        </section>

        {/* Form Example */}
        <section className="space-y-4 p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold">Form Layout</h2>
          <p className="text-muted-foreground">
            Typography in form contexts with labels and helper text.
          </p>

          <div className="space-y-4 max-w-md">
            <div>
              <label
                className="block mb-2"
                style={{
                  fontSize: `${paragraphSm.size}px`,
                  fontWeight: paragraphSm.weight,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded border bg-background"
                style={{
                  fontSize: `${paragraphMd.size}px`,
                  lineHeight: `${paragraphMd.lineHeight}px`,
                }}
              />
              <p
                className="mt-1"
                style={{
                  fontSize: `${caption.size}px`,
                  lineHeight: `${caption.lineHeight}px`,
                }}
              >
                We'll never share your email with anyone else.
              </p>
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
    const tokenEntries = Object.entries(typographyTokens).filter(([key]) => key !== "fontFamily");

    return (
      <div className="p-8 space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Token Reference</h1>
          <p className="text-muted-foreground text-lg">
            Quick reference for all typography tokens with copy-to-clipboard.
          </p>
        </div>

        <div className="space-y-2">
          {tokenEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-32 font-medium">{key}</div>
                <div className="text-sm text-muted-foreground font-mono">
                  size: {value.size}px / lh: {value.lineHeight}px / w: {value.weight}
                  {value.tracking && ` / track: ${value.tracking}`}
                  {value.emphasisWeight && ` / emph: ${value.emphasisWeight}`}
                </div>
              </div>
              <CopyButton value={`typographyTokens.${key}`} />
            </div>
          ))}
        </div>

        <section className="mt-8 p-6 rounded-lg bg-muted">
          <h3 className="font-semibold mb-4">Font Family</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">typographyTokens.fontFamily</span>
              <CopyButton value={typographyTokens.fontFamily} />
            </div>
            <div
              className="p-4 rounded border bg-background"
              style={{ fontFamily: typographyTokens.fontFamily }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>
        </section>
      </div>
    );
  },
};

export const DoDont: Story = {
  name: "Do's and Don'ts",
  render: () => (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Do's and Don'ts</h1>
        <p className="text-muted-foreground text-lg">
          Common patterns to follow and avoid when using typography.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Do */}
        <div className="space-y-4 p-6 rounded-lg border-l-4 border-status-success bg-card">
          <h3 className="text-lg font-semibold text-status-success dark:text-status-success">
            ✓ Do
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-status-success mt-1">✓</span>
              <div>
                <div className="font-medium">Use semantic heading levels</div>
                <div className="text-sm text-muted-foreground">
                  H1 → H2 → H3 creates clear hierarchy
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-status-success mt-1">✓</span>
              <div>
                <div className="font-medium">Match line height to font size</div>
                <div className="text-sm text-muted-foreground">
                  Use predefined tokens, don't guess
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-status-success mt-1">✓</span>
              <div>
                <div className="font-medium">Limit type scale variations</div>
                <div className="text-sm text-muted-foreground">
                  Use existing tokens, don't create arbitrary sizes
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-status-success mt-1">✓</span>
              <div>
                <div className="font-medium">Respect user's font preferences</div>
                <div className="text-sm text-muted-foreground">
                  Use system fonts, respect browser settings
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Don't */}
        <div className="space-y-4 p-6 rounded-lg border-l-4 border-status-error bg-card">
          <h3 className="text-lg font-semibold text-status-error">✗ Don't</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-status-error mt-1">✗</span>
              <div>
                <div className="font-medium">Don't skip heading levels</div>
                <div className="text-sm text-muted-foreground">
                  H1 → H3 breaks hierarchy (skip H2)
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-status-error mt-1">✗</span>
              <div>
                <div className="font-medium">Don't use font sizes below 12px</div>
                <div className="text-sm text-muted-foreground">
                  Caption is the minimum for accessibility
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-status-error mt-1">✗</span>
              <div>
                <div className="font-medium">Don't set arbitrary line heights</div>
                <div className="text-sm text-muted-foreground">
                  Use tokens, not "leading-loose" guesses
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-status-error mt-1">✗</span>
              <div>
                <div className="font-medium">Don't use headings for style</div>
                <div className="text-sm text-muted-foreground">
                  Use font weight, not heading level, for emphasis
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
            <div className="text-sm text-status-success dark:text-status-success font-medium mb-2">
              ✓ Good Hierarchy
            </div>
            <h1
              style={{
                fontSize: `${typographyTokens.h1.size}px`,
                lineHeight: `${typographyTokens.h1.lineHeight}px`,
                fontWeight: typographyTokens.h1.weight,
              }}
            >
              Main Title
            </h1>
            <h2
              style={{
                fontSize: `${typographyTokens.h2.size}px`,
                lineHeight: `${typographyTokens.h2.lineHeight}px`,
                fontWeight: typographyTokens.h2.weight,
              }}
            >
              Section Title
            </h2>
            <p
              style={{
                fontSize: `${typographyTokens.paragraphMd.size}px`,
                lineHeight: `${typographyTokens.paragraphMd.lineHeight}px`,
                fontWeight: typographyTokens.paragraphMd.weight,
              }}
            >
              Body text follows semantic structure.
            </p>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="text-sm text-status-error font-medium mb-2">✗ Poor Hierarchy</div>
            <h1
              style={{
                fontSize: `${typographyTokens.h1.size}px`,
                lineHeight: `${typographyTokens.h1.lineHeight}px`,
                fontWeight: typographyTokens.h1.weight,
              }}
            >
              Main Title
            </h1>
            <h1
              style={{
                fontSize: `${typographyTokens.h2.size}px`,
                lineHeight: `${typographyTokens.h2.lineHeight}px`,
                fontWeight: typographyTokens.h2.weight,
              }}
            >
              Skipped Level
            </h1>
            <p
              style={{
                fontSize: `${typographyTokens.paragraphMd.size}px`,
                lineHeight: `${typographyTokens.paragraphMd.lineHeight}px`,
                fontWeight: typographyTokens.paragraphMd.weight,
              }}
            >
              Confusing structure with multiple H1s.
            </p>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const ResponsiveScaling: Story = {
  name: "Responsive Scaling",
  render: () => {
    const { hero } = typographyTokens;

    return (
      <div className="p-8 space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Responsive Scaling</h1>
          <p className="text-muted-foreground text-lg">
            Typography scales proportionally across viewport sizes.
          </p>
        </div>

        <div className="space-y-6">
          {/* Desktop */}
          <section className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-4">Desktop (Default)</h3>
            <p className="text-sm text-muted-foreground mb-4">Viewport width ≥ 768px</p>
            <div
              className="border-2 border-dashed rounded p-4"
              style={{ fontSize: `${hero.size}px`, fontWeight: hero.weight }}
            >
              Responsive Typography Example
            </div>
          </section>

          {/* Tablet */}
          <section className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-4">Tablet (Scaled to 85%)</h3>
            <p className="text-sm text-muted-foreground mb-4">Viewport width 768px - 1024px</p>
            <div
              className="border-2 border-dashed rounded p-4"
              style={{ fontSize: `${hero.size * 0.85}px`, fontWeight: hero.weight }}
            >
              Responsive Typography Example
            </div>
          </section>

          {/* Mobile */}
          <section className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-4">Mobile (Scaled to 75%)</h3>
            <p className="text-sm text-muted-foreground mb-4">Viewport width &lt; 768px</p>
            <div
              className="border-2 border-dashed rounded p-4"
              style={{ fontSize: `${hero.size * 0.75}px`, fontWeight: hero.weight }}
            >
              Responsive Typography Example
            </div>
          </section>
        </div>

        <section className="mt-6 p-6 rounded-lg bg-muted">
          <h4 className="font-semibold mb-2">Implementation Note</h4>
          <p className="text-sm text-muted-foreground">
            Use CSS `clamp()` or media queries for responsive scaling. The tokens above are base
            values—adjust proportionally for different viewports while maintaining the line-height
            ratios. For body text, keep paragraph-md at 16px minimum for accessibility.
          </p>
        </section>
      </div>
    );
  },
};

// Accessibility test story for reduced motion
export const AccessibilityTest: Story = {
  name: "Accessibility Test",
  render: () => (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Accessibility Tests</h1>
        <p className="text-muted-foreground text-lg">
          Typography accessibility validation examples.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Minimum Font Size</h3>
        <p className="text-muted-foreground mb-4">
          All text meets WCAG AA minimum requirements (12px for normal text).
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { size: 12, label: "Caption (minimum)", pass: true },
            { size: 14, label: "Paragraph Sm", pass: true },
            { size: 16, label: "Paragraph Md (recommended)", pass: true },
          ].map(({ size, label, pass }) => (
            <div
              key={size}
              className={`p-4 rounded border text-center ${
                pass ? "border-status-success" : "border-status-error"
              }`}
            >
              <div className="mb-2" style={{ fontSize: `${size}px`, lineHeight: "1.5" }}>
                Aa
              </div>
              <div className="text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Line Height for Readability</h3>
        <p className="text-muted-foreground mb-4">
          Line height ratios between 1.4 and 1.7 are optimal for readability.
        </p>
        <div className="space-y-2">
          {Object.entries(typographyTokens)
            .filter(([key]) => key !== "fontFamily")
            .map(([key, value]) => {
              const ratio = (value.lineHeight / value.size).toFixed(2);
              const isGood = parseFloat(ratio) >= 1.4 && parseFloat(ratio) <= 1.7;

              return (
                <div
                  key={key}
                  className={`flex items-center gap-4 p-3 rounded border ${
                    isGood ? "border-status-success" : "border-status-error"
                  }`}
                >
                  <div className="flex-1">{key}</div>
                  <div className="font-mono text-sm">
                    {ratio} ({isGood ? "✓ Good" : "✗ Too tight/loose"})
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <section className="p-6 rounded-lg bg-muted">
        <h4 className="font-semibold mb-2">Testing Recommendations</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Test with browser zoom at 100%, 200%, and 300%</li>
          <li>• Verify text remains readable at minimum contrast</li>
          <li>• Check line height doesn't cause text overlap</li>
          <li>• Validate with screen reader (text scales correctly)</li>
        </ul>
      </section>
    </div>
  ),
};

// Typography Playground - interact with type scale
export const TypographyPlayground: Story = {
  name: "Typography Playground",
  render: () => (
    <div className="max-w-4xl p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Typography Playground</h1>
        <p className="text-muted-foreground">
          Explore the type scale with live examples. Each size has a recommended use case.
        </p>
      </div>

      <div className="space-y-8">
        {/* Display Sizes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Display Scale</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="text-xs text-muted-foreground mb-1">text-hero / Hero / 40px</div>
              <div className="text-hero">Hero headline</div>
            </div>
            <div className="border-b pb-4">
              <div className="text-xs text-muted-foreground mb-1">text-h1 / H1 / 36px</div>
              <div className="text-h1">Page title</div>
            </div>
            <div className="border-b pb-4">
              <div className="text-xs text-muted-foreground mb-1">text-h2 / H2 / 24px</div>
              <div className="text-h2">Section heading</div>
            </div>
          </div>
        </div>

        {/* Body Scale */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Body Scale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-xs text-muted-foreground mb-2">text-paragraph-md / 16px</div>
              <div className="text-paragraph-md">
                Paragraph-md is used for most content. It should be comfortable to read at length.
                Line height of 1.5-1.7 provides optimal readability.
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-xs text-muted-foreground mb-2">text-paragraph-sm / 14px</div>
              <div className="text-paragraph-sm">
                Smaller text for secondary information, captions, and labels. Use sparingly to
                maintain hierarchy.
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-xs text-muted-foreground mb-2">text-caption / 12px</div>
              <div className="text-caption">
                Caption text for fine print, disclaimers, and metadata. Ensure 4.5:1 contrast for
                accessibility.
              </div>
            </div>
          </div>
        </div>

        {/* Font Weight */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Font Weight Scale</h2>
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Light (300)</div>
              <div className="font-light text-xl">Aa</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Normal (400)</div>
              <div className="text-xl">Aa</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Medium (500)</div>
              <div className="font-medium text-xl">Aa</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Semibold (600)</div>
              <div className="font-semibold text-xl">Aa</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Bold (700)</div>
              <div className="font-bold text-xl">Aa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
