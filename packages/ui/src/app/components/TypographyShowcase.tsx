import { typographyTokens } from "@chatui/tokens";

export function TypographyShowcase() {
  const platforms = [
    {
      id: "web",
      title: "Typography / Web",
      font: "SF Pro",
      weights: "400, 600",
      items: [
        {
          name: "heading1",
          size: `${typographyTokens.heading1.size}px`,
          weight: `${typographyTokens.heading1.weight}`,
          lineHeight: `${typographyTokens.heading1.lineHeight}px`,
          letterSpacing: `${typographyTokens.heading1.tracking}px`,
          sampleWeight: "font-semibold",
        },
        {
          name: "heading2",
          size: `${typographyTokens.heading2.size}px`,
          weight: `${typographyTokens.heading2.weight}`,
          lineHeight: `${typographyTokens.heading2.lineHeight}px`,
          letterSpacing: `${typographyTokens.heading2.tracking}px`,
          sampleWeight: "font-semibold",
        },
        {
          name: "heading3",
          size: `${typographyTokens.heading3.size}px`,
          weight: `${typographyTokens.heading3.weight}`,
          lineHeight: `${typographyTokens.heading3.lineHeight}px`,
          letterSpacing: `${typographyTokens.heading3.tracking}px`,
          sampleWeight: "font-semibold",
        },
        {
          name: "body / regular / emphasized",
          size: `${typographyTokens.body.size}px`,
          weight: `${typographyTokens.body.weight} / ${typographyTokens.body.emphasisWeight}`,
          lineHeight: `${typographyTokens.body.lineHeight}px`,
          letterSpacing: `${typographyTokens.body.tracking}px`,
          sampleWeight: "font-normal",
        },
        {
          name: "body-small / regular / emphasized",
          size: `${typographyTokens.bodySmall.size}px`,
          weight: `${typographyTokens.bodySmall.weight} / ${typographyTokens.bodySmall.emphasisWeight}`,
          lineHeight: `${typographyTokens.bodySmall.lineHeight}px`,
          letterSpacing: `${typographyTokens.bodySmall.tracking}px`,
          sampleWeight: "font-normal",
        },
        {
          name: "caption / regular / emphasized",
          size: `${typographyTokens.caption.size}px`,
          weight: `${typographyTokens.caption.weight} / ${typographyTokens.caption.emphasisWeight}`,
          lineHeight: `${typographyTokens.caption.lineHeight}px`,
          letterSpacing: `${typographyTokens.caption.tracking}px`,
          sampleWeight: "font-normal",
        },
      ],
    },
    {
      id: "ios",
      title: "Typography / iOS",
      font: "SF Pro",
      weights: "400, 600",
      items: [
        {
          name: "heading1",
          size: "32px",
          weight: "600",
          lineHeight: "40px",
          letterSpacing: "-0.1px",
          sampleWeight: "font-semibold",
        },
        {
          name: "heading2",
          size: "24px",
          weight: "600",
          lineHeight: "28px",
          letterSpacing: "-0.25px",
          sampleWeight: "font-semibold",
        },
        {
          name: "heading3",
          size: "18px",
          weight: "600",
          lineHeight: "26px",
          letterSpacing: "-0.45px",
          sampleWeight: "font-semibold",
        },
        {
          name: "body / regular / emphasized",
          size: "16px",
          weight: "400 / 600",
          lineHeight: "26px",
          letterSpacing: "-0.4px",
          sampleWeight: "font-normal",
        },
        {
          name: "body-small / regular / emphasized",
          size: "14px",
          weight: "400 / 600",
          lineHeight: "18px",
          letterSpacing: "-0.3px",
          sampleWeight: "font-normal",
        },
        {
          name: "caption / regular / emphasized",
          size: "12px",
          weight: "400 / 600",
          lineHeight: "16px",
          letterSpacing: "-0.1px",
          sampleWeight: "font-normal",
        },
      ],
    },
    {
      id: "android",
      title: "Typography / Android",
      font: "SF Pro",
      weights: "400, 600",
      items: [
        {
          name: "heading1",
          size: "32px",
          weight: "600",
          lineHeight: "40px",
          letterSpacing: "-0.1px",
          sampleWeight: "font-semibold",
        },
        {
          name: "heading2",
          size: "24px",
          weight: "600",
          lineHeight: "28px",
          letterSpacing: "-0.25px",
          sampleWeight: "font-semibold",
        },
        {
          name: "heading3",
          size: "16px",
          weight: "600",
          lineHeight: "26px",
          letterSpacing: "0px",
          sampleWeight: "font-semibold",
        },
        {
          name: "body / regular / emphasized",
          size: "16px",
          weight: "400 / 600",
          lineHeight: "26px",
          letterSpacing: "0px",
          sampleWeight: "font-normal",
        },
        {
          name: "body-small / regular / emphasized",
          size: "14px",
          weight: "400 / 600",
          lineHeight: "18px",
          letterSpacing: "0px",
          sampleWeight: "font-normal",
        },
        {
          name: "caption / regular / emphasized",
          size: "12px",
          weight: "400 / 600",
          lineHeight: "16px",
          letterSpacing: "0px",
          sampleWeight: "font-normal",
        },
      ],
    },
  ];

  const getTypeClassName = (item: {
    size: string;
    lineHeight: string;
    letterSpacing: string;
    sampleWeight: string;
  }) =>
    `text-[${item.size}] ${item.sampleWeight} leading-[${item.lineHeight}] tracking-[${item.letterSpacing}]`;

  const lightPrimary = "var(--foundation-text-light-primary)";
  const lightSecondary = "var(--foundation-text-light-secondary)";
  const lightTertiary = "var(--foundation-text-light-tertiary)";
  const lightSurface = "var(--foundation-bg-light-1)";
  const lightSurfaceAlt = "var(--foundation-bg-light-2)";

  const FontCard = ({ font, weights }: { font: string; weights: string }) => (
    <div className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
      <div className="mb-8">
        <h3 className="mb-4 font-medium text-[12px] leading-[24px] tracking-[-0.32px]">Font</h3>
        <div className="h-px w-full" style={{ backgroundColor: lightPrimary }} />
      </div>
      <div
        className="flex h-[150px] flex-col justify-between rounded-xl p-3 ring-1 ring-black/10"
        style={{ backgroundColor: lightSurface }}
      >
        <p className="font-medium text-[12px] leading-[18px] tracking-[-0.32px]">{font}</p>
        <div>
          <div className="mb-1 flex items-center gap-2 text-[64px] leading-[1.2] tracking-[-0.32px]">
            <span className="font-normal">Aa</span>
            <span className="font-semibold">Gg</span>
          </div>
          <p className="font-mono text-[12px] leading-[18px] tracking-[-0.32px]" style={{ color: lightSecondary }}>
            {weights}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: lightSurfaceAlt }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-6 items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
              </svg>
            </div>
            <h2 className="font-semibold text-[12px] leading-[18px] tracking-[-0.32px]">Foundations</h2>
          </div>
          <div className="mb-4 h-px w-full" style={{ backgroundColor: lightPrimary }} />
          <div>
            <h1 className="mb-2 text-[56px] font-semibold leading-[1.2] tracking-[0.416px]">Typography</h1>
            <a 
              href="https://developers.openai.com/apps-sdk/concepts/design-guidelines"
              className="text-[16px] leading-[24px] tracking-[-0.32px] underline"
              style={{ color: lightSecondary }}
              target="_blank"
              rel="noopener noreferrer"
            >
              App design guidelines
            </a>
          </div>
        </div>

        <div className="space-y-10">
          {platforms.map((platform) => (
            <div key={platform.id} className="space-y-4">
              <h2 className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px]">
                {platform.title}
              </h2>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[308px_1fr]">
                <FontCard font={platform.font} weights={platform.weights} />

                <div className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
                  <div className="mb-8">
                    <h3 className="mb-4 font-medium text-[12px] leading-[24px] tracking-[-0.32px]">
                      Definitions
                    </h3>
                    <div className="h-px w-full" style={{ backgroundColor: lightPrimary }} />
                  </div>
                  <div className="space-y-0">
                    {platform.items.map((type, index) => (
                      <div
                        key={type.name}
                        className={`flex items-center justify-between py-6 ${
                          index !== 0 ? "border-t border-black/5" : ""
                        }`}
                      >
                        <p className={getTypeClassName(type)}>{type.name}</p>
                        <div className="flex gap-2">
                          <div className="flex min-w-[100px] flex-col gap-0.5 rounded-xl px-4 py-2.5" style={{ backgroundColor: lightSurfaceAlt }}>
                            <span className="text-[10px] leading-none" style={{ color: lightTertiary }}>Size</span>
                            <span className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px]">
                              {type.size}
                            </span>
                          </div>
                          <div className="flex min-w-[100px] flex-col gap-0.5 rounded-xl px-4 py-2.5" style={{ backgroundColor: lightSurfaceAlt }}>
                            <span className="text-[10px] leading-none" style={{ color: lightTertiary }}>Weight</span>
                            <span className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px]">
                              {type.weight}
                            </span>
                          </div>
                          <div className="flex min-w-[100px] flex-col gap-0.5 rounded-xl px-4 py-2.5" style={{ backgroundColor: lightSurfaceAlt }}>
                            <span className="text-[10px] leading-none" style={{ color: lightTertiary }}>Line height</span>
                            <span className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px]">
                              {type.lineHeight}
                            </span>
                          </div>
                          <div className="flex min-w-[100px] flex-col gap-0.5 rounded-xl px-4 py-2.5" style={{ backgroundColor: lightSurfaceAlt }}>
                            <span className="text-[10px] leading-none" style={{ color: lightTertiary }}>
                              Letter spacing
                            </span>
                            <span className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px]">
                              {type.letterSpacing}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
