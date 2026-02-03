import { Card } from "./Card";
import { CodeBlock } from "./CodeBlock";
import { Section } from "./Section";
import { typographyTokens } from "./data";

/** Typography tab content for DesignSystemDocs. */
export function TypographyTab() {
  return (
    <Section
      title="Typography Scale"
      description="Complete typography system with SF Pro font family"
    >
      <div className="space-y-4">
        {[
          { label: "Hero", token: typographyTokens.hero, example: "The quick brown fox" },
          { label: "H1", token: typographyTokens.h1, example: "The quick brown fox jumps" },
          { label: "H2", token: typographyTokens.h2, example: "The quick brown fox jumps over" },
          {
            label: "H3",
            token: typographyTokens.h3,
            example: "The quick brown fox jumps over the",
          },
          {
            label: "H4",
            token: typographyTokens.h4,
            example: "The quick brown fox jumps over the lazy",
          },
          {
            label: "H5",
            token: typographyTokens.h5,
            example: "The quick brown fox jumps over the lazy dog",
          },
          {
            label: "H6",
            token: typographyTokens.h6,
            example: "The quick brown fox jumps over the lazy dog.",
          },
          {
            label: "Paragraph Lg",
            token: typographyTokens.paragraphLg,
            example: "The quick brown fox jumps over the lazy dog.",
          },
          {
            label: "Paragraph Md",
            token: typographyTokens.paragraphMd,
            example: "The quick brown fox jumps over the lazy dog.",
          },
          {
            label: "Paragraph Sm",
            token: typographyTokens.paragraphSm,
            example: "The quick brown fox jumps over the lazy dog.",
          },
          {
            label: "Caption",
            token: typographyTokens.caption,
            example: "The quick brown fox",
          },
          {
            label: "Heading 1 (Legacy)",
            token: typographyTokens.legacy.heading1,
            example: "Legacy heading token",
          },
          {
            label: "Heading 2 (Legacy)",
            token: typographyTokens.legacy.heading2,
            example: "Legacy heading token",
          },
          {
            label: "Heading 3 (Legacy)",
            token: typographyTokens.legacy.heading3,
            example: "Legacy heading token",
          },
          {
            label: "Body (Legacy)",
            token: typographyTokens.legacy.body,
            example: "Legacy body token",
          },
          {
            label: "Body Small (Legacy)",
            token: typographyTokens.legacy.bodySmall,
            example: "Legacy body token",
          },
        ].map(({ label, token, example }) => (
          <Card key={label}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div
                  className="text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
                  style={{
                    fontFamily: typographyTokens.fontFamily,
                    fontSize: token.size,
                    lineHeight: `${token.lineHeight}px`,
                    fontWeight: token.weight,
                    letterSpacing: `${token.tracking}px`,
                  }}
                >
                  {example}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  {label}
                </div>
                <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-1">
                  {token.size}px / {token.weight} / {token.lineHeight}px
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Card>
          <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Usage Example
          </h3>
          <CodeBlock
            code={`<h1 className="text-hero">Hero headline</h1>
<h2 className="text-h1">Page title</h2>
<h3 className="text-h2">Section title</h3>
<p className="text-paragraph-md">Body text</p>
<p className="text-paragraph-sm">Small body text</p>
<span className="text-caption">Caption text</span>`}
            language="tsx"
          />
        </Card>
      </div>
    </Section>
  );
}
