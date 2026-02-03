import { useCallback, useMemo, useState, type ReactNode, type ComponentType } from "react";

import * as Icons from "../../icons/ChatGPTIcons";
import { cn } from "../../components/ui/utils";

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconSparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function Toast({ message, value, visible }: { message: string; value: string; visible: boolean }) {
  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
        "px-5 py-3.5 rounded-xl shadow-2xl",
        "bg-foundation-bg-dark-2/95 backdrop-blur-xl",
        "border border-foundation-bg-dark-3",
        "flex items-center gap-3",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95 pointer-events-none",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="size-9 rounded-full bg-foundation-accent-success/10 flex items-center justify-center shrink-0 border border-foundation-accent-success/20">
        <IconCheck className="size-5 text-foundation-accent-success" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foundation-text-dark-primary leading-tight">
          {message}
        </p>
        <p className="text-xs font-mono text-foundation-text-dark-secondary mt-0.5 truncate leading-tight max-w-[200px]">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl p-5 bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 shadow-sm hover:shadow-md transition-all duration-200 hover:border-foundation-accent-blue/30">
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-lg bg-foundation-accent-blue/10 flex items-center justify-center shrink-0 border border-foundation-accent-blue/20">
          <div className="text-foundation-accent-blue">{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-semibold text-foundation-text-dark-primary tabular-nums">
            {value}
          </div>
          <div className="text-sm text-foundation-text-dark-secondary mt-1 leading-tight">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconCard({
  name,
  IconComponent,
  onCopy,
  isCopied,
}: {
  name: string;
  IconComponent: ComponentType<{ className?: string }>;
  onCopy: (name: string) => void;
  isCopied: boolean;
}) {
  const displayName = name.replace("Icon", "");

  return (
    <button
      type="button"
      onClick={() => onCopy(name)}
      aria-label={`Copy ${name}`}
      className={cn(
        "group relative rounded-xl p-4 border",
        "transition-all duration-200",
        "bg-foundation-bg-dark-2 border-foundation-bg-dark-3",
        "hover:bg-foundation-bg-dark-3 hover:border-foundation-accent-blue/40 hover:shadow-lg hover:scale-[1.02]",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-foundation-bg-dark-1",
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center size-14 rounded-lg",
            "transition-all duration-200",
            "bg-foundation-bg-dark-1 group-hover:bg-foundation-bg-dark-2",
            "shadow-sm group-hover:shadow-md",
          )}
        >
          <IconComponent className="size-6 text-foundation-icon-dark-primary group-hover:text-foundation-accent-blue transition-colors duration-200" />
        </div>
        <span className="text-xs text-center break-all font-mono text-foundation-text-dark-secondary group-hover:text-foundation-text-dark-primary transition-colors leading-tight">
          {displayName}
        </span>
      </div>

      <div
        className={cn(
          "absolute top-2 right-2 p-1.5 rounded-full",
          "bg-foundation-accent-success/90 backdrop-blur-sm",
          "border border-foundation-accent-success/20",
          "transition-all duration-200",
          isCopied ? "opacity-100 scale-100" : "opacity-0 scale-50",
        )}
      >
        <IconCheck className="size-3 text-text-body-on-color" />
      </div>
    </button>
  );
}

/**
 * IconographyShowcase displays the complete icon system with 350+ icons.
 * Browse, search, filter by category, and click to copy.
 */
export function IconographyShowcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const iconEntries = useMemo(
    () =>
      Object.entries(Icons).filter(
        ([name, Icon]) => name.startsWith("Icon") && typeof Icon === "function",
      ),
    [],
  );

  const filteredIcons = useMemo(
    () => iconEntries.filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase())),
    [iconEntries, searchQuery],
  );

  const categories = useMemo(
    () => ({
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
    }),
    [filteredIcons],
  );

  const totalIcons = iconEntries.length;
  const displayedIcons =
    selectedCategory === "all"
      ? filteredIcons
      : categories[selectedCategory as keyof typeof categories] || [];

  const copyToClipboard = useCallback(async (name: string) => {
    try {
      await navigator.clipboard.writeText(`<${name} />`);
      setCopiedIcon(name);
      setToastVisible(true);
      setTimeout(() => {
        setCopiedIcon(null);
        setToastVisible(false);
      }, 2000);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-foundation-bg-dark-1 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-foundation-accent-blue to-foundation-accent-purple flex items-center justify-center shadow-lg">
              <IconSparkles className="size-6 text-text-body-on-color" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foundation-text-dark-primary">
                Icon System
              </h2>
              <p className="text-sm text-foundation-text-dark-secondary mt-0.5">
                Complete icon library with {totalIcons} icons
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Icons"
              value={totalIcons}
              icon={<IconSparkles className="size-5" />}
            />
            <StatCard
              label="Categories"
              value={Object.keys(categories).length - 1}
              icon={<IconGrid className="size-5" />}
            />
            <StatCard
              label="Search Results"
              value={displayedIcons.length}
              icon={<IconSearch className="size-5" />}
            />
            <StatCard
              label="Format"
              value="SVG"
              icon={
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-xl p-6 bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="iconography-search"
                className="block text-sm font-medium text-foundation-text-dark-primary mb-2"
              >
                Search Icons
              </label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foundation-text-dark-tertiary" />
                <input
                  id="iconography-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or keyword..."
                  aria-label="Search icons"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-foundation-bg-dark-3 bg-foundation-bg-dark-1 text-foundation-text-dark-primary placeholder:text-foundation-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue"
                />
              </div>
            </div>
            <div className="md:w-64">
              <label
                htmlFor="iconography-category"
                className="block text-sm font-medium text-foundation-text-dark-primary mb-2"
              >
                Category
              </label>
              <select
                id="iconography-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Icon category"
                className="w-full px-4 py-2.5 rounded-lg border border-foundation-bg-dark-3 bg-foundation-bg-dark-1 text-foundation-text-dark-primary focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue"
              >
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} (
                    {categories[category as keyof typeof categories].length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {displayedIcons.map(([name, Icon]) => (
            <IconCard
              key={name}
              name={name}
              IconComponent={Icon as ComponentType<{ className?: string }>}
              onCopy={copyToClipboard}
              isCopied={copiedIcon === name}
            />
          ))}
        </div>

        {displayedIcons.length === 0 && (
          <div className="text-center py-12 rounded-xl border border-foundation-bg-dark-3 bg-foundation-bg-dark-2">
            <p className="text-lg text-foundation-text-dark-secondary">
              No icons found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      <Toast message="Copied to clipboard!" value={copiedIcon ?? ""} visible={toastVisible} />
    </div>
  );
}
