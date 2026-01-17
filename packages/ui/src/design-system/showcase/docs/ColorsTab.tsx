import { Card } from "./Card";
import { ColorSwatch } from "./ColorSwatch";
import { Section } from "./Section";
import { colorSwatches } from "./data";

/** Colors tab content for DesignSystemDocs. */
export function ColorsTab() {
  // Group colors by category
  const groupedColors = colorSwatches.reduce<Record<string, (typeof colorSwatches)[number][]>>(
    (acc, swatch) => {
      if (!acc[swatch.group]) acc[swatch.group] = [];
      acc[swatch.group].push(swatch);
      return acc;
    },
    {},
  );

  return (
    <Section
      title="Color Tokens"
      description="38 color tokens for backgrounds, text, icons, and accents"
    >
      <div className="space-y-6">
        {Object.entries(groupedColors).map(([group, swatches]) => (
          <Card key={group}>
            <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
              {group}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {swatches.map((swatch) => (
                <ColorSwatch key={swatch.label} label={swatch.label} cssVar={swatch.cssVar} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
