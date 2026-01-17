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
          { label: "Heading 1", token: typographyTokens.heading1, example: "The quick brown fox" },
          {
            label: "Heading 2",
            token: typographyTokens.heading2,
            example: "The quick brown fox jumps",
          },
          {
            label: "Heading 3",
            token: typographyTokens.heading3,
            example: "The quick brown fox jumps over",
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
            code={`<h1 className="text-heading-1">Heading 1</h1>
<h2 className="text-heading-2">Heading 2</h2>
<h3 className="text-heading-3">Heading 3</h3>
<p className="text-body">Body text</p>
<p className="text-body-small">Small body text</p>
<span className="text-caption">Caption text</span>`}
            language="tsx"
          />
        </Card>
      </div>
    </Section>
  );
}
