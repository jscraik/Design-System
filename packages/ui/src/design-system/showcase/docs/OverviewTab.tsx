import { Card } from "./Card";
import { CodeBlock } from "./CodeBlock";
import { Section } from "./Section";
import { StatCard } from "./StatCard";
import { colorSwatches, iconCategories, spacingScale } from "./data";

/** Overview tab content for DesignSystemDocs. */
export function OverviewTab() {
  return (
    <>
      {/* Hero */}
      <Card className="bg-gradient-to-br from-foundation-bg-light-1 to-foundation-bg-light-2 dark:from-foundation-bg-dark-2 dark:to-foundation-bg-dark-3">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
            ChatGPT Design System
          </h2>
          <p className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-6">
            A complete, production-ready design system featuring 350+ icons and official ChatUI design
            tokens with full Tailwind CSS integration.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Tailwind CSS", "Design Tokens", "Dark Mode", "Accessible"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-4 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Icon Families" value={iconCategories.length} description="Organized categories" />
        <StatCard label="Spacing Tokens" value={spacingScale.length} description="8px grid system" />
        <StatCard label="Typography Styles" value="6" description="Heading & body" />
        <StatCard label="Color Tokens" value={colorSwatches.length} description="Light & dark modes" />
      </div>

      {/* Quick Start */}
      <Section title="Quick Start" description="Get started with the design system in 3 steps">
        <div className="grid gap-4">
          <Card>
            <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3 flex items-center gap-2">
              <span className="size-6 rounded-full bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-xs font-bold">
                1
              </span>
              Import Foundation CSS
            </h3>
            <CodeBlock code={`import '@astudio/ui/styles/foundation.css';`} language="ts" />
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3 flex items-center gap-2">
              <span className="size-6 rounded-full bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-xs font-bold">
                2
              </span>
              Use Tailwind Classes
            </h3>
            <CodeBlock
              code={`<div className="bg-foundation-bg-dark-1 text-foundation-text-dark-primary p-8">
  <h1 className="text-heading-1">Hello World</h1>
</div>`}
              language="tsx"
            />
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3 flex items-center gap-2">
              <span className="size-6 rounded-full bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-xs font-bold">
                3
              </span>
              Import Components
            </h3>
            <CodeBlock code={`import { Button, Card, IconButton } from '@astudio/ui';`} language="ts" />
          </Card>
        </div>
      </Section>
    </>
  );
}
