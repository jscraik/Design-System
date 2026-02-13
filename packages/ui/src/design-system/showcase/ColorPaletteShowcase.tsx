import { colorTokens } from "@design-studio/tokens";

type SectionItem = { name: string; value: string };
type Section = { title: string; items: SectionItem[]; darkSurface?: boolean };

const sections: Section[] = [
  {
    title: "Colors / light mode",
    items: [
      { name: "Primary / 50", value: colorTokens.background.light.primary },
      { name: "Secondary / 75", value: colorTokens.background.light.secondary },
      { name: "Tertiary / 100", value: colorTokens.background.light.tertiary },
    ],
  },
  {
    title: "Colors / dark mode",
    items: [
      { name: "Primary / 50", value: colorTokens.background.dark.primary },
      { name: "Secondary / 75", value: colorTokens.background.dark.secondary },
      { name: "Tertiary / 100", value: colorTokens.background.dark.tertiary },
    ],
    darkSurface: true,
  },
  {
    title: "Text / Light",
    items: [
      { name: "Text / Primary", value: colorTokens.text.light.primary },
      { name: "Text / Secondary", value: colorTokens.text.light.secondary },
      { name: "Text / Tertiary", value: colorTokens.text.light.tertiary },
      { name: "Text / Inverted", value: colorTokens.text.light.inverted },
    ],
  },
  {
    title: "Text / Dark",
    items: [
      { name: "Text / Primary", value: colorTokens.text.dark.primary },
      { name: "Text / Secondary", value: colorTokens.text.dark.secondary },
      { name: "Text / Tertiary", value: colorTokens.text.dark.tertiary },
      { name: "Text / Inverted", value: colorTokens.text.dark.inverted },
    ],
    darkSurface: true,
  },
  {
    title: "Icon / Light",
    items: [
      { name: "Icon / Primary", value: colorTokens.icon.light.primary },
      { name: "Icon / Secondary", value: colorTokens.icon.light.secondary },
      { name: "Icon / Tertiary", value: colorTokens.icon.light.tertiary },
      { name: "Icon / Inverted", value: colorTokens.icon.light.inverted },
    ],
  },
  {
    title: "Icon / Dark",
    items: [
      { name: "Icon / Primary", value: colorTokens.icon.dark.primary },
      { name: "Icon / Secondary", value: colorTokens.icon.dark.secondary },
      { name: "Icon / Tertiary", value: colorTokens.icon.dark.tertiary },
      { name: "Icon / Inverted", value: colorTokens.icon.dark.inverted },
    ],
    darkSurface: true,
  },
  {
    title: "Accents (Light)",
    items: [
      { name: "Accent / Blue", value: colorTokens.accent.light.blue },
      { name: "Accent / Red", value: colorTokens.accent.light.red },
      { name: "Accent / Orange", value: colorTokens.accent.light.orange },
      { name: "Accent / Green", value: colorTokens.accent.light.green },
      { name: "Accent / Purple", value: colorTokens.accent.light.purple },
    ],
  },
  {
    title: "Accents (Dark)",
    items: [
      { name: "Accent / Blue", value: colorTokens.accent.dark.blue },
      { name: "Accent / Red", value: colorTokens.accent.dark.red },
      { name: "Accent / Orange", value: colorTokens.accent.dark.orange },
      { name: "Accent / Green", value: colorTokens.accent.dark.green },
      { name: "Accent / Purple", value: colorTokens.accent.dark.purple },
    ],
    darkSurface: true,
  },
];

export function ColorPaletteShowcase() {
  const lightSurface = "var(--foundation-bg-light-1)";
  const lightSurfaceAlt = "var(--foundation-bg-light-3)";
  const darkSurface = "var(--foundation-bg-dark-1)";
  const lightBorder = "color-mix(in srgb, var(--foundation-text-light-primary) 10%, transparent)";
  const darkBorder = "color-mix(in srgb, var(--foundation-text-dark-primary) 10%, transparent)";
  const lightText = "var(--foundation-text-light-primary)";
  const lightMeta = "var(--foundation-text-light-secondary)";
  const darkText = "var(--foundation-text-dark-primary)";
  const darkMeta = "var(--foundation-text-dark-secondary)";

  const Swatch = ({
    name,
    value,
    textColor,
    metaColor,
    borderColor,
  }: {
    name: string;
    value: string;
    textColor: string;
    metaColor: string;
    borderColor: string;
  }) => (
    <div className="flex flex-col gap-3">
      <div
        className="h-16 w-full rounded-md border"
        style={{ backgroundColor: value, borderColor }}
      />
      <div className="flex flex-col font-mono text-[12px] leading-[18px] tracking-[-0.32px]">
        <p style={{ color: textColor }}>{name}</p>
        <p style={{ color: metaColor }}>{value}</p>
      </div>
    </div>
  );

  const SectionCard = ({ title, items, darkSurface: useDarkSurface }: Section) => {
    const surfaceColor = useDarkSurface ? darkSurface : lightSurface;
    const borderColor = useDarkSurface ? darkBorder : lightBorder;
    const textColor = useDarkSurface ? darkText : lightText;
    const metaColor = useDarkSurface ? darkMeta : lightMeta;

    const grid = (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Swatch
            key={item.name}
            name={item.name}
            value={item.value}
            textColor={textColor}
            metaColor={metaColor}
            borderColor={borderColor}
          />
        ))}
      </div>
    );

    return (
      <div className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
        <div className="mb-6">
          <h3 className="mb-4 font-medium text-[12px] leading-[24px] tracking-[-0.32px]">
            {title}
          </h3>
          <div className="h-px w-full" style={{ backgroundColor: lightBorder }} />
        </div>
        {useDarkSurface ? (
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: surfaceColor, borderColor }}
          >
            {grid}
          </div>
        ) : (
          grid
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: lightSurfaceAlt }}>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-6 items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
              </svg>
            </div>
            <h2 className="font-semibold text-[12px] leading-[18px] tracking-[-0.32px]">
              Foundations
            </h2>
          </div>
          <div className="mb-4 h-px w-full" style={{ backgroundColor: lightBorder }} />
          <div>
            <h1 className="text-[56px] font-semibold leading-[1.2] tracking-[0.416px]">Color</h1>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              items={section.items}
              darkSurface={section.darkSurface}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
