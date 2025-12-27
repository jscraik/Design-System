import { spacingScale, typographyTokens } from "@chatui/tokens";
import {
  IconArrowUpSm,
  IconCheckmark,
  IconCompose,
  IconCopy,
  IconEdit,
  IconPlusLg,
  IconSearch,
  IconSettings,
  IconShare,
  IconThumbUp,
  IconTrash,
  IconUser,
} from "./icons/ChatGPTIcons";

const iconCategories = [
  {
    title: "Navigation",
    items: [
      { name: "ArrowUp", Icon: IconArrowUpSm },
      { name: "Search", Icon: IconSearch },
      { name: "Plus", Icon: IconPlusLg },
    ],
  },
  {
    title: "Interface",
    items: [
      { name: "Settings", Icon: IconSettings },
      { name: "Checkmark", Icon: IconCheckmark },
      { name: "Edit", Icon: IconEdit },
      { name: "Trash", Icon: IconTrash },
    ],
  },
  {
    title: "Chat",
    items: [
      { name: "Compose", Icon: IconCompose },
      { name: "Copy", Icon: IconCopy },
      { name: "Share", Icon: IconShare },
      { name: "ThumbUp", Icon: IconThumbUp },
    ],
  },
  {
    title: "Account",
    items: [{ name: "User", Icon: IconUser }],
  },
] as const;

const colorSwatches = [
  { label: "foundation-bg-dark-1", cssVar: "--foundation-bg-dark-1" },
  { label: "foundation-bg-dark-2", cssVar: "--foundation-bg-dark-2" },
  { label: "foundation-bg-dark-3", cssVar: "--foundation-bg-dark-3" },
  { label: "foundation-text-dark-primary", cssVar: "--foundation-text-dark-primary" },
  { label: "foundation-text-dark-secondary", cssVar: "--foundation-text-dark-secondary" },
  { label: "foundation-text-dark-tertiary", cssVar: "--foundation-text-dark-tertiary" },
  { label: "foundation-accent-green", cssVar: "--foundation-accent-green" },
  { label: "foundation-accent-blue", cssVar: "--foundation-accent-blue" },
  { label: "foundation-bg-light-1", cssVar: "--foundation-bg-light-1" },
  { label: "foundation-bg-light-2", cssVar: "--foundation-bg-light-2" },
  { label: "foundation-bg-light-3", cssVar: "--foundation-bg-light-3" },
  { label: "foundation-text-light-primary", cssVar: "--foundation-text-light-primary" },
  { label: "foundation-text-light-secondary", cssVar: "--foundation-text-light-secondary" },
  { label: "foundation-text-light-tertiary", cssVar: "--foundation-text-light-tertiary" },
  { label: "foundation-accent-green-light", cssVar: "--foundation-accent-green-light" },
] as const;

export function DesignSystemDocs() {
  const lightSurface = "var(--foundation-bg-light-1)";
  const lightSurfaceAlt = "var(--foundation-bg-light-2)";
  const lightSurfaceMuted = "var(--foundation-bg-light-3)";
  const textPrimary = "var(--foundation-text-light-primary)";
  const textSecondary = "var(--foundation-text-light-secondary)";
  const textTertiary = "var(--foundation-text-light-tertiary)";

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: lightSurfaceAlt, color: textPrimary }}>
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-6 items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-semibold tracking-[-0.32px]">ChatGPT Design System</h2>
          </div>
          <div className="mb-4 h-px w-full" style={{ backgroundColor: textPrimary }} />
          <h1 className="mb-4 text-[40px] font-semibold leading-[1.2] tracking-[0.416px]">
            Foundations & Compliance
          </h1>
          <p className="text-[16px] leading-[24px] tracking-[-0.32px]" style={{ color: textSecondary }}>
            This page audits UI tokens, iconography, typography, and spacing against the Apps SDK UI
            design system.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Icon families", value: iconCategories.length },
            { label: "Spacing tokens", value: spacingScale.length },
            { label: "Typography styles", value: 3 },
            { label: "Color swatches", value: colorSwatches.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-6 shadow-sm"
              style={{ backgroundColor: lightSurface }}
            >
              <div className="text-[32px] font-semibold leading-[40px]">{stat.value}</div>
              <div className="text-[14px] leading-[20px] tracking-[-0.3px]" style={{ color: textSecondary }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">
            Icon Library
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {iconCategories.map((category) => (
              <div
                key={category.title}
                className="rounded-lg p-6"
                style={{ backgroundColor: lightSurfaceAlt }}
              >
                <h3 className="mb-4 text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {category.items.map(({ name, Icon }) => (
                    <div key={name} className="flex items-center gap-2 text-[12px]">
                      <Icon className="size-5" />
                      <span style={{ color: textSecondary }}>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">
            Typography
          </h2>
          <div className="space-y-6">
            {[
              { label: "heading1", token: typographyTokens.heading1 },
              { label: "heading2", token: typographyTokens.heading2 },
              { label: "heading3", token: typographyTokens.heading3 },
            ].map(({ label, token }) => (
              <div
                key={label}
                className="rounded-lg border border-black/10 p-6"
                style={{ backgroundColor: lightSurfaceAlt }}
              >
                <div
                  style={{
                    fontFamily: typographyTokens.fontFamily,
                    fontSize: token.size,
                    lineHeight: `${token.lineHeight}px`,
                    fontWeight: token.weight,
                    letterSpacing: `${token.tracking}px`,
                  }}
                >
                  {label}
                </div>
                <div className="mt-2 text-[12px]" style={{ color: textSecondary }}>
                  {token.size}px / {token.weight} / {token.lineHeight}px / {token.tracking}px
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">
            Spacing Scale
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spacingScale.map((value) => (
              <div
                key={value}
                className="rounded-lg p-4"
                style={{ backgroundColor: lightSurfaceAlt }}
              >
                <div className="text-[16px] font-semibold">{value}px</div>
                <div className="text-[12px]" style={{ color: textSecondary }}>
                  space-{value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <h2 className="mb-6 text-[24px] font-semibold leading-[28px] tracking-[-0.25px]">
            Color Reference
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {colorSwatches.map((swatch) => (
              <div key={swatch.label} className="flex items-center gap-3">
                <div
                  className="size-10 rounded border border-black/10"
                  style={{ backgroundColor: `var(${swatch.cssVar})` }}
                />
                <div>
                  <div className="text-[12px] font-medium">{swatch.label}</div>
                  <div className="text-[11px]" style={{ color: textTertiary }}>
                    var({swatch.cssVar})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <h2 className="mb-4 text-[20px] font-semibold leading-[28px] tracking-[-0.25px]">
            Compliance Guidance
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg p-4" style={{ backgroundColor: lightSurfaceMuted }}>
              <p className="text-[13px] leading-[18px]" style={{ color: textSecondary }}>
                Use Apps SDK UI components and tokens for all primitives. Avoid raw hex values in UI
                components.
              </p>
              <div className="mt-3 rounded-lg p-3 text-[12px]" style={{ backgroundColor: lightSurface }}>
                bg-surface text-primary border-default
              </div>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: lightSurfaceMuted }}>
              <p className="text-[13px] leading-[18px]" style={{ color: textSecondary }}>
                Use the host adapter seam for runtime calls. UI should not touch window.openai
                directly.
              </p>
              <div className="mt-3 rounded-lg p-3 text-[12px]" style={{ backgroundColor: lightSurface }}>
                const host = createEmbeddedHost()
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
