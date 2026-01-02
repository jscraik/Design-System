import { useState, type ComponentType } from "react";

import * as Icons from "../../icons/ChatGPTIcons";
import { copyToClipboard } from "../../utils/clipboard";

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
        name.includes("Sun") || name.includes("Moon") || name.includes("LightBulb") || name.includes("Error"),
    ),
  };

  const displayedIcons =
    selectedCategory === "all"
      ? filteredIcons
      : categories[selectedCategory as keyof typeof categories] || [];

  return (
    <div className="min-h-screen bg-foundation-bg-dark-1">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 text-foundation-text-dark-primary">
            ChatGPT Icon Catalog
          </h1>
          <p className="text-foundation-text-dark-secondary">
            Browse and test all {iconEntries.length} icons from the ChatGPT-style icon library
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 rounded-xl border border-foundation-bg-dark-3 p-6 space-y-4 bg-foundation-bg-dark-2">
          {/* Search */}
          <div>
            <label
              htmlFor="icon-search"
              className="block text-sm font-medium mb-2 text-foundation-text-dark-primary"
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
              className="w-full px-4 py-3 rounded-lg border border-foundation-bg-dark-3 bg-foundation-bg-dark-1 text-foundation-text-dark-primary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2 text-foundation-text-dark-primary">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-foundation-accent-green text-white"
                      : "px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-foundation-bg-dark-1 text-foundation-text-dark-secondary hover:text-foundation-text-dark-primary"
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({categories[category as keyof typeof categories].length})
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-foundation-text-dark-secondary">
            <span>Total Icons: {iconEntries.length}</span>
            <span>•</span>
            <span>Showing: {displayedIcons.length}</span>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {displayedIcons.map(([name, IconComponent]) => {
            const Icon = IconComponent as ComponentType<{ className?: string }>;
            return (
              <div
                key={name}
                className="group rounded-xl p-4 border border-foundation-bg-dark-3 bg-foundation-bg-dark-2 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  copyToClipboard(`<${name} />`);
                }}
                title={`Click to copy: ${name}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-foundation-bg-dark-1">
                    <Icon className="size-6 text-foundation-icon-dark-primary" />
                  </div>
                  <span className="text-xs text-center break-all font-mono text-foundation-text-dark-secondary">
                    {name.replace("Icon", "")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {displayedIcons.length === 0 && (
          <div className="text-center py-12 rounded-xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2">
            <p className="text-lg text-foundation-text-dark-secondary">
              No icons found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 p-6 rounded-xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2">
          <h3 className="text-lg font-semibold mb-3 text-foundation-text-dark-primary">
            Quick Usage
          </h3>
          <div className="space-y-2 text-sm font-mono text-foundation-text-dark-secondary">
            <p>
              <span className="text-foundation-accent-green">import</span> {`{ IconCheckmark }`} <span className="text-foundation-accent-green">from</span> {"\"@chatui/ui/icons\""};
            </p>
            <p className="mt-4 text-foundation-text-dark-tertiary">
              {`// Use in your components`}
            </p>
            <p>
              {`<IconCheckmark className=\"size-6\" />`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGPTIconCatalog;
