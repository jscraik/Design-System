import { Card } from "./Card";
import { CodeBlock } from "./CodeBlock";
import { spacingScale } from "./data";
import { Section } from "./Section";

/** Spacing tab content for DesignSystemDocs. */
export function SpacingTab() {
  return (
    <Section title="Spacing Scale" description="8px grid system with semantic spacing tokens">
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {spacingScale.map((value) => (
            <div
              key={value}
              className="flex flex-col items-center p-4 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3"
            >
              <div
                className="bg-foundation-accent-blue rounded mb-3"
                style={{ width: value, height: value, minWidth: 4, minHeight: 4 }}
              />
              <div className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                {value}px
              </div>
              <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                space-{value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
          Usage Example
        </h3>
        <CodeBlock
          code={`<div className="p-4">Padding 16px</div>
<div className="p-8">Padding 32px</div>
<div className="gap-4">Gap 16px</div>
<div className="space-y-6">Vertical spacing 24px</div>`}
          language="tsx"
        />
      </Card>
    </Section>
  );
}
