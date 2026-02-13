import { Card } from "./Card";
import { CodeBlock } from "./CodeBlock";
import { Section } from "./Section";

/** Usage tab content for DesignSystemDocs. */
export function UsageTab() {
  return (
    <Section title="Usage Guide" description="Three ways to use design tokens in your project">
      <div className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
            1. Tailwind Foundation Classes
          </h3>
          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
            Clean, semantic class names for quick styling
          </p>
          <CodeBlock
            code={`<div className="bg-foundation-bg-dark-2 text-foundation-text-dark-primary rounded-lg p-8">
  <h2 className="text-heading-2">Title</h2>
</div>`}
            language="tsx"
          />
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
            2. CSS Variables
          </h3>
          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
            Direct access to CSS custom properties
          </p>
          <CodeBlock
            code={`<div style={{ backgroundColor: 'var(--foundation-bg-dark-2)' }}>
  Content
</div>`}
            language="tsx"
          />
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
            3. TypeScript Token Imports
          </h3>
          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
            Type-safe token access for dynamic styling
          </p>
          <CodeBlock
            code={`import { colorTokens } from '@design-studio/tokens';

const bgColor = colorTokens.background.dark.primary; // '#212121'`}
            language="ts"
          />
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
            Resources
          </h3>
          <div className="space-y-2">
            {[
              { label: "Token Integration Guide", href: "#" },
              { label: "Design Tokens Reference", href: "#" },
              { label: "Tailwind Foundation Guide", href: "#" },
              { label: "Complete Icon List", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 text-sm text-foundation-accent-blue hover:underline"
              >
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {link.label}
              </a>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
