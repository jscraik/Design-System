import {
  IconArrowUpSm,
  IconBarChart,
  IconBook,
  IconChat,
  IconCheckmark,
  IconChevronRightMd,
  IconCompose,
  IconCopy,
  IconEdit,
  IconFolder,
  IconPlusLg,
  IconSearch,
  IconSettings,
  IconShare,
  IconStar,
  IconThumbUp,
  IconTrash,
  IconUser,
  IconWriting,
} from "./icons/ChatGPTIcons";

const iconSections = [
  {
    title: "Navigation",
    description: "Arrows, chevrons, search, and add",
    icons: [
      { name: "ArrowUp", Icon: IconArrowUpSm },
      { name: "ChevronRight", Icon: IconChevronRightMd },
      { name: "Search", Icon: IconSearch },
      { name: "Plus", Icon: IconPlusLg },
    ],
  },
  {
    title: "Interface",
    description: "Settings, status, and utilities",
    icons: [
      { name: "Settings", Icon: IconSettings },
      { name: "Checkmark", Icon: IconCheckmark },
      { name: "Edit", Icon: IconEdit },
      { name: "Trash", Icon: IconTrash },
    ],
  },
  {
    title: "Chat & Tools",
    description: "Messaging and collaboration actions",
    icons: [
      { name: "Chat", Icon: IconChat },
      { name: "Compose", Icon: IconCompose },
      { name: "Copy", Icon: IconCopy },
      { name: "Share", Icon: IconShare },
      { name: "ThumbUp", Icon: IconThumbUp },
    ],
  },
  {
    title: "Account & Projects",
    description: "Identity and workspace icons",
    icons: [
      { name: "User", Icon: IconUser },
      { name: "Star", Icon: IconStar },
      { name: "Folder", Icon: IconFolder },
      { name: "Writing", Icon: IconWriting },
      { name: "Book", Icon: IconBook },
      { name: "BarChart", Icon: IconBarChart },
    ],
  },
] as const;

const iconSizes = [16, 20, 24, 32] as const;

export function IconographyShowcase() {
  const lightSurface = "var(--foundation-bg-light-1)";
  const lightSurfaceAlt = "var(--foundation-bg-light-2)";
  const textPrimary = "var(--foundation-text-light-primary)";
  const textSecondary = "var(--foundation-text-light-secondary)";
  const textTertiary = "var(--foundation-text-light-tertiary)";

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: lightSurfaceAlt, color: textPrimary }}>
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <div className="flex items-center gap-3 mb-4">
            <IconSettings className="size-5" />
            <p className="text-[12px] font-semibold tracking-[-0.32px]">Foundations</p>
          </div>
          <h1 className="text-[36px] font-semibold leading-[40px] tracking-[-0.1px]">Iconography</h1>
          <p className="text-[14px] leading-[20px] mt-2" style={{ color: textSecondary }}>
            Canonical icon families aligned to Apps SDK UI. Use these sets before introducing new
            glyphs.
          </p>
        </header>

        <section className="rounded-lg p-8 shadow-sm" style={{ backgroundColor: lightSurface }}>
          <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] mb-2">
            Icon Sizes
          </h2>
          <p className="text-[13px] leading-[18px] mb-6" style={{ color: textSecondary }}>
            Use consistent sizing tokens to keep icons aligned across UI surfaces.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {iconSizes.map((size) => (
              <div key={size} className="rounded-xl p-4" style={{ backgroundColor: lightSurfaceAlt }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold">{size}px</span>
                  <span className="text-[11px]" style={{ color: textTertiary }}>
                    size-{size}
                  </span>
                </div>
                <div className="flex gap-3">
                  <IconSearch className={`size-[${size}px]`} />
                  <IconSettings className={`size-[${size}px]`} />
                  <IconCompose className={`size-[${size}px]`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          {iconSections.map((section) => (
            <div
              key={section.title}
              className="rounded-lg p-8 shadow-sm"
              style={{ backgroundColor: lightSurface }}
            >
              <div className="mb-4">
                <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">
                  {section.title}
                </h2>
                <p className="text-[13px] leading-[18px]" style={{ color: textSecondary }}>
                  {section.description}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {section.icons.map(({ name, Icon }) => (
                  <div
                    key={name}
                    className="rounded-xl p-4 flex flex-col items-center gap-3"
                    style={{ backgroundColor: lightSurfaceAlt }}
                  >
                    <Icon className="size-5" />
                    <span className="text-[11px]" style={{ color: textTertiary }}>
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
