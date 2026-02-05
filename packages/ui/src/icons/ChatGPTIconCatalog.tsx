import { radiusTokens, spaceTokens, typographyTokens } from "@design-studio/tokens";
import { type ComponentType, useState } from "react";

import { copyToClipboard } from "../utils/clipboard";
import * as Icons from "./chatgpt/ChatGPTIconsFixed";

const toPx = (value: number) => `${value}px`;

const spacing = {
  pageX: toPx(spaceTokens.s24),
  pageY: toPx(spaceTokens.s32),
  sectionGap: toPx(spaceTokens.s24),
  cardPadding: toPx(spaceTokens.s16),
  cardGap: toPx(spaceTokens.s12),
  controlPadding: toPx(spaceTokens.s16),
  controlGap: toPx(spaceTokens.s12),
  inputPaddingX: toPx(spaceTokens.s16),
  inputPaddingY: toPx(spaceTokens.s12),
  chipPaddingX: toPx(spaceTokens.s12),
  chipPaddingY: toPx(spaceTokens.s8),
  gridGap: toPx(spaceTokens.s16),
  footerPadding: toPx(spaceTokens.s16),
};

const radius = {
  card: toPx(radiusTokens.r12),
  surface: toPx(radiusTokens.r16),
  chip: toPx(radiusTokens.r8),
  iconTile: toPx(radiusTokens.r10),
};

const headingStyle = (token: (typeof typographyTokens)["h1"]) => ({
  fontSize: toPx(token.size),
  lineHeight: toPx(token.lineHeight),
  fontWeight: token.weight,
  letterSpacing: toPx(token.tracking),
});

const bodyStyle = (token: (typeof typographyTokens)["paragraphMd"]) => ({
  fontSize: toPx(token.size),
  lineHeight: toPx(token.lineHeight),
  fontWeight: token.weight,
  letterSpacing: toPx(token.tracking),
});

const labelStyle = (token: (typeof typographyTokens)["paragraphSm"]) => ({
  fontSize: toPx(token.size),
  lineHeight: toPx(token.lineHeight),
  fontWeight: token.emphasisWeight,
  letterSpacing: toPx(token.tracking),
});

// Icon catalog component for browsing and testing all ChatGPT icons
export function ChatGPTIconCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const iconEntries = Object.entries(Icons).filter(
    ([name]) => name.startsWith("Icon") && typeof Icons[name as keyof typeof Icons] === "function",
  );

  const filteredIcons = iconEntries.filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const [_statusMessage, setStatusMessage] = useState<string | null>(null);

  const _handleCopy = async (name: string) => {
    if (!navigator?.clipboard?.writeText) {
      setStatusMessage(`Clipboard unavailable. Select and copy: ${name}`);
      window.prompt("Clipboard unavailable. Copy the icon name manually:", name);
      return;
    }

    try {
      await navigator.clipboard.writeText(name);
      setStatusMessage(`Copied ${name} to clipboard.`);
    } catch (_error) {
      setStatusMessage(`Couldn't copy ${name}. Select and copy it manually.`);
      window.prompt("Clipboard failed. Copy the icon name manually:", name);
    }
  };

  const categories = {
    all: filteredIcons,
    arrows: filteredIcons.filter(
      ([name]) =>
        name.includes("Arrow") ||
        name.includes("Chevron") ||
        name.includes("Expand") ||
        name.includes("Collapse") ||
        name.includes("Regenerate") ||
        name.includes("Undo") ||
        name.includes("Redo") ||
        name.includes("Reply") ||
        name === "IconShuffle",
    ),
    media: filteredIcons.filter(
      ([name]) =>
        name.includes("Mic") ||
        name.includes("Speaker") ||
        name.includes("Volume") ||
        name.includes("Mute") ||
        name.includes("Play") ||
        name.includes("Pause") ||
        name.includes("Stop") ||
        name.includes("Skip") ||
        name.includes("Rewind") ||
        name.includes("Forward") ||
        name.includes("Repeat") ||
        name.includes("Video") ||
        name.includes("Film") ||
        name.includes("Movie") ||
        name.includes("Headphones") ||
        name.includes("Music") ||
        name.includes("Album") ||
        name.includes("Disc") ||
        name.includes("Waveform") ||
        name.includes("Equalizer") ||
        name.includes("Audio") ||
        name.includes("Radio") ||
        name.includes("Broadcast") ||
        name.includes("Signal") ||
        name.includes("Antenna") ||
        name.includes("Podcast") ||
        name.includes("Record") ||
        name.includes("Sound"),
    ),
    interface: filteredIcons.filter(
      ([name]) =>
        name.includes("Dots") ||
        name.includes("Magnifying") ||
        name.includes("Sidebar") ||
        name.includes("Menu") ||
        name.includes("Composer"),
    ),
    platform: filteredIcons.filter(
      ([name]) =>
        name.includes("Agent") ||
        name.includes("Playground") ||
        name.includes("Gpt") ||
        name.includes("Terminal") ||
        name.includes("Notebook") ||
        name.includes("Category") ||
        name.includes("Stack") ||
        name.includes("Status") ||
        name.includes("Snorkle") ||
        name.includes("Speech") ||
        name.includes("Storage") ||
        name.includes("Batches") ||
        name.includes("Function") ||
        name.includes("Robot") ||
        name.includes("Api"),
    ),
    account: filteredIcons.filter(
      ([name]) =>
        name.includes("Profile") ||
        name.includes("Avatar") ||
        name.includes("User") ||
        name.includes("Pro") ||
        name.includes("Upgrade") ||
        name.includes("Members") ||
        name.includes("Group") ||
        name.includes("Building") ||
        name.includes("Suitcase") ||
        name.includes("Smile") ||
        name.includes("Relax") ||
        name.includes("Sleep") ||
        name.includes("Sad"),
    ),
    ui: filteredIcons.filter(
      ([name]) =>
        name.includes("Check") ||
        name.includes("Close") ||
        name.includes("Plus") ||
        name.includes("Minus") ||
        name.includes("Edit") ||
        name.includes("Delete") ||
        name.includes("Trash") ||
        name.includes("Copy") ||
        name.includes("Share") ||
        name.includes("Download") ||
        name.includes("Upload") ||
        name.includes("Image") ||
        name.includes("Camera") ||
        name.includes("File") ||
        name.includes("Folder") ||
        name.includes("Document") ||
        name.includes("Attachment") ||
        name.includes("Link") ||
        name.includes("Eye") ||
        name.includes("Lock") ||
        name.includes("Bell") ||
        name.includes("Star") ||
        name.includes("Heart") ||
        name.includes("Bookmark") ||
        name.includes("Flag") ||
        name.includes("Calendar") ||
        name.includes("Clock") ||
        name.includes("Home") ||
        name.includes("Inbox") ||
        name.includes("Mail") ||
        name.includes("Message") ||
        name.includes("Chat") ||
        name.includes("Phone") ||
        name.includes("Globe") ||
        name.includes("Shield") ||
        name.includes("Info") ||
        name.includes("Warning") ||
        name.includes("Help") ||
        name.includes("More") ||
        name.includes("Grid") ||
        name.includes("List") ||
        name.includes("Code") ||
        name.includes("Command") ||
        name.includes("Slider") ||
        name.includes("Refresh") ||
        name.includes("Sync") ||
        name.includes("Spinner") ||
        name.includes("Loader") ||
        name.includes("Zoom") ||
        name.includes("Maximize") ||
        name.includes("Minimize") ||
        name.includes("Layer") ||
        name.includes("Box") ||
        name.includes("Package") ||
        name.includes("Archive") ||
        name.includes("Tag") ||
        name.includes("Credit") ||
        name.includes("Sparkles") ||
        name.includes("BarChart") ||
        name.includes("Search") ||
        name.includes("Filter") ||
        name.includes("Settings") ||
        name.includes("Question"),
    ),
    public: filteredIcons.filter(
      ([name]) =>
        name.includes("Thumb") ||
        name.includes("Compose") ||
        name.includes("Paperclip") ||
        name.includes("Tray") ||
        name.includes("Public"),
    ),
    misc: filteredIcons.filter(
      ([name]) =>
        name.includes("Book") ||
        name.includes("Pin") ||
        name.includes("Email") ||
        name.includes("Flask") ||
        name.includes("Writing") ||
        name.includes("Stuff") ||
        name.includes("Telescope") ||
        name.includes("Operator") ||
        name.includes("Compass") ||
        name.includes("Messaging") ||
        name.includes("Comment") ||
        name.includes("History") ||
        name.includes("Unarchive") ||
        name.includes("OpenAI"),
    ),
    settings: filteredIcons.filter(
      ([name]) =>
        name.includes("Sun") ||
        name.includes("Moon") ||
        name.includes("LightBulb") ||
        name.includes("Error"),
    ),
  };

  const displayedIcons =
    selectedCategory === "all"
      ? filteredIcons
      : categories[selectedCategory as keyof typeof categories] || [];

  return (
    <div
      data-theme="dark"
      className="min-h-screen bg-foundation-bg-dark-1 text-foundation-text-dark-primary"
    >
      <div className="mx-auto max-w-7xl" style={{ padding: `${spacing.pageY} ${spacing.pageX}` }}>
        {/* Header */}
        <div style={{ marginBottom: spacing.sectionGap }}>
          <h1 style={headingStyle(typographyTokens.h1)}>ChatGPT Icon Catalog</h1>
          <p
            className="text-foundation-text-dark-secondary"
            style={bodyStyle(typographyTokens.paragraphMd)}
          >
            Browse and test all {iconEntries.length} icons from the ChatGPT-style icon library.
          </p>
        </div>

        {/* Controls */}
        <div
          className="border border-foundation-border-dark-default bg-foundation-bg-dark-2"
          style={{
            borderRadius: radius.surface,
            padding: spacing.controlPadding,
            marginBottom: spacing.sectionGap,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.controlGap }}>
            {/* Search */}
            <div>
              <label
                htmlFor="icon-search"
                className="text-foundation-text-dark-primary"
                style={labelStyle(typographyTokens.paragraphSm)}
              >
                Search Icons
              </label>
              <input
                id="icon-search"
                type="text"
                aria-label="Search Icons"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search icons..."
                className="w-full border border-foundation-border-dark-default bg-foundation-bg-dark-1 text-foundation-text-dark-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue"
                style={{
                  borderRadius: radius.chip,
                  padding: `${spacing.inputPaddingY} ${spacing.inputPaddingX}`,
                  marginTop: spacing.controlGap,
                  ...bodyStyle(typographyTokens.paragraphMd),
                }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <p
                className="text-foundation-text-dark-primary"
                style={labelStyle(typographyTokens.paragraphSm)}
              >
                Category
              </p>
              <div className="flex flex-wrap" style={{ gap: spacing.cardGap }}>
                {Object.keys(categories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "text-foundation-text-dark-primary bg-foundation-accent-green"
                        : "text-foundation-text-dark-secondary bg-foundation-bg-dark-1 hover:text-foundation-text-dark-primary"
                    }
                    style={{
                      borderRadius: radius.chip,
                      padding: `${spacing.chipPaddingY} ${spacing.chipPaddingX}`,
                      ...bodyStyle(typographyTokens.paragraphSm),
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)} (
                    {categories[category as keyof typeof categories].length})
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div
              className="text-foundation-text-dark-secondary"
              style={bodyStyle(typographyTokens.paragraphSm)}
            >
              <span>Total Icons: {iconEntries.length}</span>
              <span style={{ margin: `0 ${spacing.cardGap}` }}>•</span>
              <span>Showing: {displayedIcons.length}</span>
            </div>
          </div>
        </div>

        {/* Icon Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
          style={{ gap: spacing.gridGap }}
        >
          {displayedIcons.map(([name, IconComponent]) => {
            const Icon = IconComponent as ComponentType<{ className?: string }>;
            return (
              <div
                key={name}
                className="group border border-foundation-border-dark-default bg-foundation-bg-dark-2 hover:border-foundation-accent-blue hover:shadow-lg transition-all cursor-pointer"
                style={{ borderRadius: radius.card, padding: spacing.cardPadding }}
                onClick={() => {
                  copyToClipboard(`<${name} />`);
                }}
                title={`Click to copy: ${name}`}
              >
                <div className="flex flex-col items-center" style={{ gap: spacing.cardGap }}>
                  <div
                    className="flex items-center justify-center bg-foundation-bg-dark-1"
                    style={{
                      width: toPx(spaceTokens.s48),
                      height: toPx(spaceTokens.s48),
                      borderRadius: radius.iconTile,
                    }}
                  >
                    <Icon className="size-6 text-foundation-icon-dark-primary" />
                  </div>
                  <span
                    className="text-center break-all text-foundation-text-dark-tertiary"
                    style={bodyStyle(typographyTokens.caption)}
                  >
                    {name.replace("Icon", "")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {displayedIcons.length === 0 && (
          <div
            className="text-center border border-foundation-border-dark-default bg-foundation-bg-dark-2"
            style={{
              borderRadius: radius.surface,
              padding: spacing.footerPadding,
              marginTop: spacing.sectionGap,
            }}
          >
            <p
              className="text-foundation-text-dark-secondary"
              style={bodyStyle(typographyTokens.paragraphMd)}
            >
              No icons found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div
          className="border border-foundation-border-dark-default bg-foundation-bg-dark-2"
          style={{
            borderRadius: radius.surface,
            padding: spacing.footerPadding,
            marginTop: spacing.sectionGap,
          }}
        >
          <h3 style={headingStyle(typographyTokens.h3)}>Quick Usage</h3>
          <div
            className="text-foundation-text-dark-secondary"
            style={{ marginTop: spacing.cardGap, ...bodyStyle(typographyTokens.paragraphSm) }}
          >
            <p>
              <span className="text-foundation-accent-green">import</span> {`{ IconCheckmark }`}{" "}
              <span className="text-foundation-accent-green">from</span>{" "}
              {'"@design-studio/ui/icons"'};
            </p>
            <p
              className="text-foundation-text-dark-tertiary"
              style={{ marginTop: spacing.cardGap }}
            >
              {`// Use in your components`}
            </p>
            <p>{'<IconCheckmark className="size-6" />'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGPTIconCatalog;
