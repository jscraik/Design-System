import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  chatGPTIconSizes,
  // Import sample icons from each category
  IconCheckmark,
  IconSettings,
  IconSearch,
  IconEdit,
  IconCopy,
  IconShare,
  IconStar,
  IconThumbUp,
  IconThumbDown,
  IconChevronDownMd,
  IconChevronLeftMd,
  IconChevronRightMd,
  IconChevronUpMd,
  IconArrowUpSm,
  IconArrowLeftSm,
  IconArrowRightSm,
  IconDotsVertical,
  IconDotsHorizontal,
  IconPlusLg,
  IconPlusSm,
  IconX,
  IconRegenerate,
  IconCode,
  IconGrid3x3,
  IconLightBulb,
  IconFolder,
  IconImage,
  IconArchive,
  IconChat,
  GitHubIcon,
  NotionIcon,
  SlackIcon,
  FigmaIcon,
  LinearIcon,
  IconRadio,
  IconRadioChecked,
  IconNotification,
  IconWifi,
  IconBatteryFull,
  IconSparkles,
  IconDownload,
  IconCloseBold,
} from "@design-studio/ui/icons";

/**
 * Iconography System - Design Foundation
 *
 * ## Overview
 * Icons are visual symbols that represent actions, objects, or concepts. Our icon system
 * provides 350+ production-ready icons organized into clear categories.
 *
 * ## Icon Categories
 * - **ChatGPT Icons** (350+): Core interface icons from Figma (arrows, actions, navigation, etc.)
 * - **Brand Icons**: Third-party service logos (GitHub, Notion, Slack, Figma, Linear, etc.)
 * - **Utility Icons**: Platform/system icons (battery, wifi, radio, notification)
 * - **Apps SDK UI Icons**: Local implementations for OpenAI-specific patterns
 *
 * ## Size Scale
 * Icons use a consistent size scale for visual harmony:
 * - **xs**: 12px (compact, inline)
 * - **sm**: 16px (default, text-aligned)
 * - **md**: 20px (touch-friendly, buttons)
 * - **lg**: 24px (prominent, headers)
 * - **key**: 32px (large CTAs, emphasis)
 * - **toggle**: 44x24px (special case for toggle switches)
 *
 * ## Usage Guidelines
 * - **Size to context**: Match icon size to text size (sm with body text, lg with headings)
 * - **Semantic meaning**: Choose icons for meaning, not decoration
 * - **Touch targets**: Icons in buttons need min 44px tap target (include padding)
 * - **Color**: Use text colors for icons, don't introduce new colors
 * - **Animation**: Use sparingly (Emil Kowalski: motion is communication)
 *
 * ## Design Principles
 * - **Clarity over cleverness** (Jenny Wen): Icon meaning should be instant
 * - **Less but better** (Emil Kowalski): Don't use icons just because you can
 * - **Consistent stroke**: All icons use 1.5px stroke for visual harmony
 * - **Optical alignment**: Icons are optically centered, not mathematically centered
 *
 * ## Accessibility
 * - Icons must have text labels (visible or screen-reader-only)
 * - Decorative icons get `aria-hidden="true"` or `role="presentation"`
 * - Interactive icons need accessible names (`aria-label` or `aria-labelledby`)
 * - Icon-only buttons require descriptive `aria-label`
 *
 * ## Import Pattern
 * ```tsx
 * import { IconCheckmark, IconSettings } from "@design-studio/ui/icons";
 * // OR for named exports with Icon* prefix
 * import { IconCheckmark, IconSettings } from "@design-studio/ui/icons";
 * ```
 */

const SIZE_OPTIONS = [
  { name: "xs", value: 12, usage: "Compact, inline icons" },
  { name: "sm", value: 16, usage: "Default, text-aligned" },
  { name: "md", value: 20, usage: "Touch-friendly buttons" },
  { name: "lg", value: 24, usage: "Prominent, headers" },
  { name: "key", value: 32, usage: "Large CTAs, emphasis" },
  { name: "toggle", value: { width: 44, height: 24 }, usage: "Toggle switches only" },
] as const;

const SAMPLE_ICONS = {
  actions: [
    { name: "IconCheckmark", component: IconCheckmark, description: "Confirm, accept, success" },
    { name: "IconEdit", component: IconEdit, description: "Edit, modify, customize" },
    { name: "IconCopy", component: IconCopy, description: "Copy to clipboard" },
    { name: "IconShare", component: IconShare, description: "Share, distribute" },
    { name: "IconDelete", component: IconX, description: "Remove, delete, clear" },
    { name: "IconRegenerate", component: IconRegenerate, description: "Regenerate, refresh, retry" },
    { name: "IconPlus", component: IconPlusLg, description: "Add, create, new" },
    { name: "IconSearch", component: IconSearch, description: "Search, find, lookup" },
    { name: "IconSettings", component: IconSettings, description: "Settings, preferences, configure" },
  ],
  navigation: [
    { name: "IconChevronDown", component: IconChevronDownMd, description: "Expand, reveal more" },
    { name: "IconChevronUp", component: IconChevronUpMd, description: "Collapse, show less" },
    { name: "IconChevronLeft", component: IconChevronLeftMd, description: "Back, previous, left" },
    { name: "IconChevronRight", component: IconChevronRightMd, description: "Forward, next, right" },
    { name: "IconArrowUp", component: IconArrowUpSm, description: "Up, increase, ascend" },
    { name: "IconMenu", component: IconDotsVertical, description: "More options, menu" },
    { name: "IconMore", component: IconDotsHorizontal, description: "More horizontal, overflow" },
  ],
  feedback: [
    { name: "IconThumbUp", component: IconThumbUp, description: "Like, approve, positive" },
    { name: "IconThumbDown", component: IconThumbDown, description: "Dislike, disapprove, negative" },
    { name: "IconStar", component: IconStar, description: "Favorite, save, important" },
    { name: "IconSparkles", component: IconSparkles, description: "AI, magic, smart features" },
  ],
  brands: [
    { name: "GitHubIcon", component: GitHubIcon, description: "GitHub, git, version control" },
    { name: "NotionIcon", component: NotionIcon, description: "Notion, docs, notes" },
    { name: "SlackIcon", component: SlackIcon, description: "Slack, messaging, chat" },
    { name: "FigmaIcon", component: FigmaIcon, description: "Figma, design, prototype" },
    { name: "LinearIcon", component: LinearIcon, description: "Linear, project management" },
  ],
  utility: [
    { name: "IconRadio", component: IconRadio, description: "Radio button unchecked" },
    { name: "IconRadioChecked", component: IconRadioChecked, description: "Radio button checked" },
    { name: "IconNotification", component: IconNotification, description: "Notification bell" },
    { name: "IconWifi", component: IconWifi, description: "WiFi, connectivity" },
    { name: "IconBatteryFull", component: IconBatteryFull, description: "Full battery, charged" },
  ],
};

const IconDisplay = ({
  name,
  component: Component,
  description,
  size = "md",
}: {
  name: string;
  component: React.ComponentType<{ className?: string; size?: keyof typeof chatGPTIconSizes }>;
  description: string;
  size?: keyof typeof chatGPTIconSizes;
}) => (
  <button
    onClick={() => navigator.clipboard.writeText(name)}
    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
  >
    <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
      <Component size={size} className="text-accent" />
    </div>
    <div className="flex-1 text-left">
      <div className="text-sm font-medium">{name}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  </button>
);

const SizeDemo = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Interactive Size Preview</h3>
      <p className="text-sm text-muted-foreground">
        See how icons appear at different sizes.
      </p>
    </div>

    <div className="rounded-lg border bg-card p-6">
      <div className="space-y-4">
        {SIZE_OPTIONS.filter((s) => typeof s.value === "number").map((sizeOption) => {
          const sizeValue = sizeOption.value as number;
          return (
            <div key={sizeOption.name} className="flex items-center gap-4">
              <div className="w-20 text-sm font-mono text-muted-foreground">
                {sizeOption.name}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="rounded bg-accent/10 flex items-center justify-center"
                  style={{ width: `${Math.max(sizeValue, 32)}px`, height: `${Math.max(sizeValue, 32)}px` }}
                >
                  <IconCheckmark
                    style={{
                      width: `${sizeValue}px`,
                      height: `${sizeValue}px`,
                    }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {sizeValue}px
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {sizeOption.usage}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const UsageExamples = () => (
  <div className="space-y-6 p-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Icon Usage Examples</h3>
      <p className="text-sm text-muted-foreground">
        Common patterns for using icons in components.
      </p>
    </div>

    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Button with Icon</div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">
            <IconCheckmark size="sm" />
            Confirm
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-sm">
            <IconDownload size="sm" />
            Download
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm">
            <IconShare size="sm" />
            Share
          </button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Use "sm" size with body text. Icon comes before or after text.
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Icon Buttons</div>
        <div className="flex flex-wrap gap-2">
          <button
            className="p-2 rounded-md hover:bg-muted/80"
            aria-label="Edit"
          >
            <IconEdit size="md" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-muted/80"
            aria-label="Copy"
          >
            <IconCopy size="md" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-muted/80"
            aria-label="Delete"
          >
            <IconX size="md" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-muted/80"
            aria-label="More options"
          >
            <IconDotsVertical size="md" />
          </button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Icon buttons need aria-label for accessibility. Use "md" size for 44px touch target.
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Text with Icon</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <IconSearch size="sm" />
            <span className="text-muted-foreground">Search for anything...</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IconLightBulb size="sm" />
            <span className="text-muted-foreground">Tip: Press / to search</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IconWifi size="sm" />
            <span className="text-muted-foreground">Connected</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Use "sm" size when icon appears with body text.
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium mb-3">Navigation Icons</div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-muted/80">
            <IconChevronLeftMd size="md" />
          </button>
          <span className="text-sm">Page 1 of 10</span>
          <button className="p-2 rounded-md hover:bg-muted/80">
            <IconChevronRightMd size="md" />
          </button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Chevrons indicate navigation direction.
        </div>
      </div>
    </div>
  </div>
);

const meta = {
  title: "Design System/12 Iconography",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Iconography system documentation with visual examples and usage guidelines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const IconCatalog: Story = {
  name: "Icon Catalog",
  render: () => (
    <div className="max-w-5xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Icon Catalog</h2>
        <p className="text-muted-foreground mb-6">
          Browse icons by category. Click any icon to copy its name.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {SAMPLE_ICONS.actions.map((icon) => (
              <IconDisplay key={icon.name} {...icon} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Navigation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {SAMPLE_ICONS.navigation.map((icon) => (
              <IconDisplay key={icon.name} {...icon} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Feedback</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {SAMPLE_ICONS.feedback.map((icon) => (
              <IconDisplay key={icon.name} {...icon} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Brand Icons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {SAMPLE_ICONS.brands.map((icon) => (
              <IconDisplay key={icon.name} {...icon} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Utility Icons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {SAMPLE_ICONS.utility.map((icon) => (
              <IconDisplay key={icon.name} {...icon} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="text-sm font-medium text-accent">💡 Pro Tip</div>
        <p className="text-sm text-muted-foreground mt-1">
          This catalog shows a subset of 350+ available icons. All icons follow the same
          usage pattern: import from "@design-studio/ui/icons" and use the size prop.
        </p>
      </div>
    </div>
  ),
};

export const SizeScale: Story = {
  name: "Size Scale",
  render: () => <SizeDemo />,
};

export const UsagePatterns: Story = {
  name: "Usage Patterns",
  render: () => <UsageExamples />,
};

export const UsageGuidelines: Story = {
  name: "Usage Guidelines",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Icon Usage Guidelines</h2>
        <p className="text-muted-foreground">
          Best practices for using icons effectively.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">When to Use Icons</h3>
          <div className="space-y-4">
            <div>
              <div className="font-medium text-accent mb-1">✓ Use icons for:</div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Common actions (search, settings, edit, delete)</li>
                <li>• Navigation indicators (back, forward, menu)</li>
                <li>• Status indicators (success, error, warning)</li>
                <li>• Brand recognition (company logos, service badges)</li>
                <li>• Content types (image, folder, document)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-destructive mb-1">✗ Avoid icons for:</div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Abstract concepts (use text instead)</li>
                <li>• Novel actions (no established icon pattern)</li>
                <li>• Decoration only (Jenny Wen: clarity over cleverness)</li>
                <li>• Complex multi-step flows (use labels + icons)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Icon Sizing</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-accent">
                12px
              </div>
              <div>
                <div className="font-medium">xs - Compact inline</div>
                <p className="text-muted-foreground">
                  Use inline with small text (captions, labels). Minimum visibility.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-accent">
                16px
              </div>
              <div>
                <div className="font-medium">sm - Default size</div>
                <p className="text-muted-foreground">
                  Use with body text. Most common size for UI icons.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-accent">
                20px
              </div>
              <div>
                <div className="font-medium">md - Touch-friendly</div>
                <p className="text-muted-foreground">
                  Use in buttons. Balances visibility with space efficiency.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-accent">
                24px
              </div>
              <div>
                <div className="font-medium">lg - Prominent</div>
                <p className="text-muted-foreground">
                  Use for emphasis, headers, or large touch targets.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded bg-accent/10 flex items-center justify-center text-accent">
                32px
              </div>
              <div>
                <div className="font-medium">key - Emphasis</div>
                <p className="text-muted-foreground">
                  Use for feature highlights, empty states, or hero sections.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Icon Colors</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Icons inherit text color by default. Use semantic color tokens for meaning.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <IconCheckmark size="md" />
              <span className="text-sm">Default (inherit)</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCheckmark size="md" className="text-accent" />
              <span className="text-sm">Accent color</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCheckmark size="md" className="text-muted-foreground" />
              <span className="text-sm">Muted</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCheckmark size="md" className="text-destructive" />
              <span className="text-sm">Destructive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DoDont: Story = {
  name: "Do's and Don'ts",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Icon Best Practices</h2>
        <p className="text-muted-foreground">
          Common patterns to follow and pitfalls to avoid.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Pair icons with text labels</div>
              <p className="text-sm text-muted-foreground mt-1">
                Icon-only buttons are ambiguous. Add text labels unless the icon is universally
                understood (search, settings, menu).
              </p>
              <div className="mt-3 flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">
                  <IconCheckmark size="sm" />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">
                DON'T: Use icon-only buttons without aria-label
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Icon-only buttons MUST have aria-label for screen readers.
              </p>
              <div className="mt-3 p-3 rounded bg-background border">
                <code className="text-sm">
                  &lt;button aria-label="Edit"&gt;&lt;IconEdit /&gt;&lt;/button&gt;
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">DO: Use consistent icon sizing</div>
              <p className="text-sm text-muted-foreground mt-1">
                Match icon size to text size. Sm icons with body text, Lg with headings.
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <IconSearch size="sm" />
                  <span className="text-sm">Search (sm icon with body text)</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconSettings size="lg" />
                  <span className="text-lg font-semibold">Settings (lg icon with heading)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">
                DON'T: Mix icon styles randomly
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                All icons use the same stroke width and visual style. Don't mix with icon
                libraries from different sources.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">
                DO: Ensure 44px minimum touch target for interactive icons
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                WCAG recommends 44x44px minimum for touch targets. Include padding in the tap area.
              </p>
              <div className="mt-3 p-3 rounded bg-background border">
                <code className="text-sm">
                  button padding: p-2 (8px) + icon-md (20px) = 36px → add more padding for 44px
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">
                DON'T: Use decorative icons without aria-hidden
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Decorative icons should be hidden from screen readers to reduce cognitive load.
              </p>
              <div className="mt-3 p-3 rounded bg-background border">
                <code className="text-sm">
                  &lt;Icon aria-hidden="true" /&gt; or &lt;Icon role="presentation" /&gt;
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-semibold text-accent">
                DO: Use semantic icons for established meanings
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Leverage user familiarity. Magnifying glass = search, gear = settings, X = close.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="p-2 rounded-md bg-muted">
                  <IconSearch size="md" />
                </button>
                <button className="p-2 rounded-md bg-muted">
                  <IconSettings size="md" />
                </button>
                <button className="p-2 rounded-md bg-muted">
                  <IconCloseBold size="md" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✗</span>
            <div>
              <div className="font-semibold text-destructive">
                DON'T: Create novel icons for abstract concepts
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                "Innovation", "Strategy", "Synergy" have no universal icon. Use text instead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TokenReference: Story = {
  name: "Token Reference",
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Reference</h2>
        <p className="text-muted-foreground">
          Icon sizes and usage patterns. Click any value to copy.
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Size</th>
              <th className="text-left p-3 font-semibold">Pixels</th>
              <th className="text-left p-3 font-semibold">Usage</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_OPTIONS.map((size, i) => (
              <tr
                key={size.name}
                className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <td className="p-3 font-mono text-sm">{size.name}</td>
                <td className="p-3 font-mono text-sm">
                  {typeof size.value === "object"
                    ? `${size.value.width}x${size.value.height}`
                    : `${size.value}px`}
                </td>
                <td className="p-3 text-sm text-muted-foreground">{size.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Import Icons</div>
        <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`import { IconCheckmark, IconSettings } from "@design-studio/ui/icons";

// Usage with size prop
<IconCheckmark size="md" />

// Usage with custom className
<IconSettings className="text-accent" size="lg" />`}
        </pre>
      </div>

      <div className="p-4 rounded-lg bg-muted border">
        <div className="text-sm font-medium mb-2">Icon Categories</div>
        <div className="space-y-2 text-sm">
          <div><strong>ChatGPT Icons</strong>: 350+ core interface icons</div>
          <div><strong>Brand Icons</strong>: Third-party service logos</div>
          <div><strong>Utility Icons</strong>: Platform/system indicators</div>
          <div><strong>Apps SDK UI Icons</strong>: OpenAI-specific patterns</div>
        </div>
      </div>
    </div>
  ),
};
