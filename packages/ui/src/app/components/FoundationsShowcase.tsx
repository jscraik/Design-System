import { colorTokens, spacingScale, typographyTokens } from "@chatui/tokens";

const colorSections = [
  {
    title: "Background / Light",
    tokens: colorTokens.background.light,
  },
  {
    title: "Background / Dark",
    tokens: colorTokens.background.dark,
  },
  {
    title: "Text / Light",
    tokens: colorTokens.text.light,
  },
  {
    title: "Text / Dark",
    tokens: colorTokens.text.dark,
  },
  {
    title: "Icon / Light",
    tokens: colorTokens.icon.light,
  },
  {
    title: "Icon / Dark",
    tokens: colorTokens.icon.dark,
  },
  {
    title: "Accents / Light",
    tokens: colorTokens.accent.light,
  },
  {
    title: "Accents / Dark",
    tokens: colorTokens.accent.dark,
  },
] as const;

export function FoundationsShowcase() {
  const lightSurface = "var(--foundation-bg-light-1)";
  const lightSurfaceAlt = "var(--foundation-bg-light-2)";
  const textPrimary = "var(--foundation-text-light-primary)";
  const textSecondary = "var(--foundation-text-light-secondary)";
  const textTertiary = "var(--foundation-text-light-tertiary)";

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: lightSurfaceAlt, color: textPrimary }}
    >
      <div className="mx-auto max-w-5xl space-y-10">
        <div>
          <h1 className="text-2xl font-semibold">Foundations Audit</h1>
          <p className="text-sm" style={{ color: textSecondary }}>
            Reference tokens sourced from the Figma foundations PDFs.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-4">Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colorSections.map((section) => (
              <div
                key={section.title}
                className="rounded-xl border border-black/10 p-5"
                style={{ backgroundColor: lightSurface }}
              >
                <div className="text-sm font-semibold mb-3">{section.title}</div>
                <div className="space-y-2">
                  {Object.entries(section.tokens).map(([name, value]) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className="size-8 rounded border border-black/10" style={{ backgroundColor: value }} />
                      <div className="text-sm">
                        <div className="font-medium">{name}</div>
                        <div className="text-xs" style={{ color: textTertiary }}>
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Spacing Scale</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spacingScale.map((value) => (
              <div
                key={value}
                className="rounded-lg border border-black/10 p-4"
                style={{ backgroundColor: lightSurface }}
              >
                <div className="text-lg font-semibold">{value}px</div>
                <div className="text-xs" style={{ color: textTertiary }}>
                  space-{value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Typography</h2>
          <div className="space-y-4">
            <div
              className="rounded-lg border border-black/10 p-4"
              style={{ backgroundColor: lightSurface }}
            >
              <div
                style={{
                  fontFamily: typographyTokens.fontFamily,
                  fontSize: typographyTokens.heading1.size,
                  lineHeight: `${typographyTokens.heading1.lineHeight}px`,
                  fontWeight: typographyTokens.heading1.weight,
                  letterSpacing: `${typographyTokens.heading1.tracking}px`,
                }}
              >
                Heading 1
              </div>
              <div className="text-xs mt-2" style={{ color: textTertiary }}>
                {typographyTokens.heading1.size}/{typographyTokens.heading1.weight}/
                {typographyTokens.heading1.lineHeight}/{typographyTokens.heading1.tracking}
              </div>
            </div>
            <div
              className="rounded-lg border border-black/10 p-4"
              style={{ backgroundColor: lightSurface }}
            >
              <div
                style={{
                  fontFamily: typographyTokens.fontFamily,
                  fontSize: typographyTokens.heading2.size,
                  lineHeight: `${typographyTokens.heading2.lineHeight}px`,
                  fontWeight: typographyTokens.heading2.weight,
                  letterSpacing: `${typographyTokens.heading2.tracking}px`,
                }}
              >
                Heading 2
              </div>
              <div className="text-xs mt-2" style={{ color: textTertiary }}>
                {typographyTokens.heading2.size}/{typographyTokens.heading2.weight}/
                {typographyTokens.heading2.lineHeight}/{typographyTokens.heading2.tracking}
              </div>
            </div>
            <div
              className="rounded-lg border border-black/10 p-4"
              style={{ backgroundColor: lightSurface }}
            >
              <div
                style={{
                  fontFamily: typographyTokens.fontFamily,
                  fontSize: typographyTokens.heading3.size,
                  lineHeight: `${typographyTokens.heading3.lineHeight}px`,
                  fontWeight: typographyTokens.heading3.weight,
                  letterSpacing: `${typographyTokens.heading3.tracking}px`,
                }}
              >
                Heading 3
              </div>
              <div className="text-xs mt-2" style={{ color: textTertiary }}>
                {typographyTokens.heading3.size}/{typographyTokens.heading3.weight}/
                {typographyTokens.heading3.lineHeight}/{typographyTokens.heading3.tracking}
              </div>
            </div>
            <div
              className="rounded-lg border border-black/10 p-4"
              style={{ backgroundColor: lightSurface }}
            >
              <div
                style={{
                  fontFamily: typographyTokens.fontFamily,
                  fontSize: typographyTokens.body.size,
                  lineHeight: `${typographyTokens.body.lineHeight}px`,
                  fontWeight: typographyTokens.body.weight,
                  letterSpacing: `${typographyTokens.body.tracking}px`,
                }}
              >
                Body
              </div>
              <div className="text-xs mt-2" style={{ color: textTertiary }}>
                {typographyTokens.body.size}/{typographyTokens.body.weight}/
                {typographyTokens.body.lineHeight}/{typographyTokens.body.tracking}
              </div>
            </div>
            <div
              className="rounded-lg border border-black/10 p-4"
              style={{ backgroundColor: lightSurface }}
            >
              <div
                style={{
                  fontFamily: typographyTokens.fontFamily,
                  fontSize: typographyTokens.bodySmall.size,
                  lineHeight: `${typographyTokens.bodySmall.lineHeight}px`,
                  fontWeight: typographyTokens.bodySmall.weight,
                  letterSpacing: `${typographyTokens.bodySmall.tracking}px`,
                }}
              >
                Body Small
              </div>
              <div className="text-xs mt-2" style={{ color: textTertiary }}>
                {typographyTokens.bodySmall.size}/{typographyTokens.bodySmall.weight}/
                {typographyTokens.bodySmall.lineHeight}/{typographyTokens.bodySmall.tracking}
              </div>
            </div>
            <div
              className="rounded-lg border border-black/10 p-4"
              style={{ backgroundColor: lightSurface }}
            >
              <div
                style={{
                  fontFamily: typographyTokens.fontFamily,
                  fontSize: typographyTokens.caption.size,
                  lineHeight: `${typographyTokens.caption.lineHeight}px`,
                  fontWeight: typographyTokens.caption.weight,
                  letterSpacing: `${typographyTokens.caption.tracking}px`,
                }}
              >
                Caption
              </div>
              <div className="text-xs mt-2" style={{ color: textTertiary }}>
                {typographyTokens.caption.size}/{typographyTokens.caption.weight}/
                {typographyTokens.caption.lineHeight}/{typographyTokens.caption.tracking}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
