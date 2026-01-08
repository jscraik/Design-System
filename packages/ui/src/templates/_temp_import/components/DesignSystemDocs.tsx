import { useCallback, useState } from "react";

import { copyToClipboard as copyToClipboardUtil } from "../utils/clipboard";

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
  IconChevronDownMd,
  IconChat,
  IconCompass,
  IconClock,
  IconEmail,
  IconPhone,
  IconCamera,
  IconMic,
  IconVideo,
  IconHeadphones,
  IconBarChart,
  IconFlask,
  IconLightBulb,
  IconStar,
  IconFlag,
  IconPin,
  IconBook,
  IconTerminal,
  IconNotebook,
  IconGlobe,
  IconMapPin,
  IconCalendar,
  IconWriting,
  IconStuffTools,
  IconFolder,
  IconImage,
} from "./icons/ChatGPTIcons";
import { cn } from "./ui/utils";

// Tab type for navigation
type DocTab = "overview" | "colors" | "typography" | "spacing" | "icons" | "components" | "usage";

const iconCategories = [
  {
    title: "Navigation",
    description: "Arrows, chevrons, and directional icons",
    items: [
      { name: "ArrowUp", Icon: IconArrowUpSm },
      { name: "ChevronDown", Icon: IconChevronDownMd },
      { name: "Search", Icon: IconSearch },
      { name: "Plus", Icon: IconPlusLg },
      { name: "Compass", Icon: IconCompass },
    ],
  },
  {
    title: "Interface",
    description: "Settings, actions, and UI elements",
    items: [
      { name: "Settings", Icon: IconSettings },
      { name: "Checkmark", Icon: IconCheckmark },
      { name: "Edit", Icon: IconEdit },
      { name: "Trash", Icon: IconTrash },
      { name: "Folder", Icon: IconFolder },
    ],
  },
  {
    title: "Chat & Communication",
    description: "Chat, messaging, and social icons",
    items: [
      { name: "Compose", Icon: IconCompose },
      { name: "Copy", Icon: IconCopy },
      { name: "Share", Icon: IconShare },
      { name: "ThumbUp", Icon: IconThumbUp },
      { name: "Chat", Icon: IconChat },
      { name: "Email", Icon: IconEmail },
    ],
  },
  {
    title: "Media",
    description: "Audio, video, and image icons",
    items: [
      { name: "Camera", Icon: IconCamera },
      { name: "Mic", Icon: IconMic },
      { name: "Video", Icon: IconVideo },
      { name: "Headphones", Icon: IconHeadphones },
      { name: "Image", Icon: IconImage },
    ],
  },
  {
    title: "Data & Analytics",
    description: "Charts, graphs, and data visualization",
    items: [
      { name: "BarChart", Icon: IconBarChart },
      { name: "Flask", Icon: IconFlask },
      { name: "LightBulb", Icon: IconLightBulb },
    ],
  },
  {
    title: "Organization",
    description: "Tags, bookmarks, and categorization",
    items: [
      { name: "Star", Icon: IconStar },
      { name: "Flag", Icon: IconFlag },
      { name: "Pin", Icon: IconPin },
      { name: "Book", Icon: IconBook },
      { name: "Notebook", Icon: IconNotebook },
    ],
  },
  {
    title: "Utilities",
    description: "Time, location, and general utilities",
    items: [
      { name: "Clock", Icon: IconClock },
      { name: "Phone", Icon: IconPhone },
      { name: "Terminal", Icon: IconTerminal },
      { name: "Globe", Icon: IconGlobe },
      { name: "MapPin", Icon: IconMapPin },
      { name: "Calendar", Icon: IconCalendar },
      { name: "Writing", Icon: IconWriting },
      { name: "StuffTools", Icon: IconStuffTools },
    ],
  },
  {
    title: "Account",
    description: "User and profile icons",
    items: [{ name: "User", Icon: IconUser }],
  },
] as const;

const colorSwatches = [
  // Background Tokens - Dark
  { label: "bg-dark-1", cssVar: "--foundation-bg-dark-1", hex: "#0d0d0d", group: "Background (Dark)" },
  { label: "bg-dark-2", cssVar: "--foundation-bg-dark-2", hex: "#171717", group: "Background (Dark)" },
  { label: "bg-dark-3", cssVar: "--foundation-bg-dark-3", hex: "#202020", group: "Background (Dark)" },
  { label: "bg-dark-4", cssVar: "--foundation-bg-dark-4", hex: "#2a2a2a", group: "Background (Dark)" },
  { label: "bg-dark-modal", cssVar: "--foundation-bg-dark-modal", hex: "#1a1a1a", group: "Background (Dark)" },
  
  // Background Tokens - Light
  { label: "bg-light-1", cssVar: "--foundation-bg-light-1", hex: "#ffffff", group: "Background (Light)" },
  { label: "bg-light-2", cssVar: "--foundation-bg-light-2", hex: "#f9f9f9", group: "Background (Light)" },
  { label: "bg-light-3", cssVar: "--foundation-bg-light-3", hex: "#ececec", group: "Background (Light)" },
  { label: "bg-light-4", cssVar: "--foundation-bg-light-4", hex: "#d9d9d9", group: "Background (Light)" },
  
  // Text Tokens - Dark
  { label: "text-dark-primary", cssVar: "--foundation-text-dark-primary", hex: "#ececec", group: "Text (Dark)" },
  { label: "text-dark-secondary", cssVar: "--foundation-text-dark-secondary", hex: "#acacac", group: "Text (Dark)" },
  { label: "text-dark-tertiary", cssVar: "--foundation-text-dark-tertiary", hex: "#8e8e8e", group: "Text (Dark)" },
  
  // Text Tokens - Light
  { label: "text-light-primary", cssVar: "--foundation-text-light-primary", hex: "#0d0d0d", group: "Text (Light)" },
  { label: "text-light-secondary", cssVar: "--foundation-text-light-secondary", hex: "#676767", group: "Text (Light)" },
  { label: "text-light-tertiary", cssVar: "--foundation-text-light-tertiary", hex: "#8e8e8e", group: "Text (Light)" },
  
  // Icon Tokens - Dark
  { label: "icon-dark-primary", cssVar: "--foundation-icon-dark-primary", hex: "#ececec", group: "Icons (Dark)" },
  { label: "icon-dark-secondary", cssVar: "--foundation-icon-dark-secondary", hex: "#acacac", group: "Icons (Dark)" },
  { label: "icon-dark-tertiary", cssVar: "--foundation-icon-dark-tertiary", hex: "#6e6e6e", group: "Icons (Dark)" },
  
  // Icon Tokens - Light
  { label: "icon-light-primary", cssVar: "--foundation-icon-light-primary", hex: "#0d0d0d", group: "Icons (Light)" },
  { label: "icon-light-secondary", cssVar: "--foundation-icon-light-secondary", hex: "#676767", group: "Icons (Light)" },
  { label: "icon-light-tertiary", cssVar: "--foundation-icon-light-tertiary", hex: "#8e8e8e", group: "Icons (Light)" },
  
  // Accent Colors
  { label: "accent-green", cssVar: "--foundation-accent-green", hex: "#10a37f", group: "Accents" },
  { label: "accent-blue", cssVar: "--foundation-accent-blue", hex: "#1B72E8", group: "Accents" },
  { label: "accent-red", cssVar: "--foundation-accent-red", hex: "#ef4444", group: "Accents" },
  { label: "accent-yellow", cssVar: "--foundation-accent-yellow", hex: "#f59e0b", group: "Accents" },
  { label: "accent-purple", cssVar: "--foundation-accent-purple", hex: "#8b5cf6", group: "Accents" },
  { label: "accent-orange", cssVar: "--foundation-accent-orange", hex: "#f97316", group: "Accents" },
  { label: "accent-success", cssVar: "--foundation-accent-success", hex: "#10a37f", group: "Accents" },
  { label: "accent-info", cssVar: "--foundation-accent-info", hex: "#1B72E8", group: "Accents" },
];

// Spacing scale (8px grid system)
const spacingScale = [
  { value: 0, name: "0", tailwind: "0" },
  { value: 2, name: "0.5", tailwind: "0.5" },
  { value: 4, name: "1", tailwind: "1" },
  { value: 8, name: "2", tailwind: "2" },
  { value: 12, name: "3", tailwind: "3" },
  { value: 16, name: "4", tailwind: "4" },
  { value: 20, name: "5", tailwind: "5" },
  { value: 24, name: "6", tailwind: "6" },
  { value: 32, name: "8", tailwind: "8" },
  { value: 40, name: "10", tailwind: "10" },
  { value: 48, name: "12", tailwind: "12" },
  { value: 64, name: "16", tailwind: "16" },
  { value: 80, name: "20", tailwind: "20" },
  { value: 96, name: "24", tailwind: "24" },
] as const;

// Typography tokens
const typographyTokens = [
  { 
    label: "Heading 1", 
    className: "text-heading-1",
    size: 32, 
    weight: 600, 
    lineHeight: 40, 
    tracking: -0.5,
    example: "The quick brown fox"
  },
  { 
    label: "Heading 2", 
    className: "text-heading-2",
    size: 24, 
    weight: 600, 
    lineHeight: 32, 
    tracking: -0.3,
    example: "The quick brown fox jumps"
  },
  { 
    label: "Heading 3", 
    className: "text-heading-3",
    size: 18, 
    weight: 600, 
    lineHeight: 24, 
    tracking: -0.2,
    example: "The quick brown fox jumps over"
  },
  { 
    label: "Body", 
    className: "text-body",
    size: 15, 
    weight: 400, 
    lineHeight: 22, 
    tracking: 0,
    example: "The quick brown fox jumps over the lazy dog"
  },
  { 
    label: "Body Small", 
    className: "text-body-small",
    size: 13, 
    weight: 400, 
    lineHeight: 18, 
    tracking: 0,
    example: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
  },
  { 
    label: "Caption", 
    className: "text-caption",
    size: 11, 
    weight: 400, 
    lineHeight: 14, 
    tracking: 0.1,
    example: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!"
  },
] as const;

const tabs: { id: DocTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    id: "colors",
    label: "Colors",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
  },
  {
    id: "typography",
    label: "Typography",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
  },
  {
    id: "spacing",
    label: "Spacing",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
    ),
  },
  {
    id: "icons",
    label: "Icons",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "components",
    label: "Components",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    id: "usage",
    label: "Usage",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
];

// Code block component with copy functionality
function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await copyToClipboardUtil(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group rounded-xl overflow-hidden border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
      <pre className="bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3 p-4 overflow-x-auto text-sm">
        <code className="font-mono text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
          {code}
        </code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "absolute top-3 right-3 p-2 rounded-lg transition-all duration-200",
          "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2",
          "border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
          "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-1",
          "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
          "opacity-0 group-hover:opacity-100",
        )}
        aria-label={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <IconCheckmark className="size-4 text-foundation-accent-success" />
        ) : (
          <IconCopy className="size-4" />
        )}
      </button>
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-foundation-bg-light-1/80 dark:bg-foundation-bg-dark-2/80 backdrop-blur-sm border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
        <span className="text-[10px] font-mono text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary uppercase tracking-wider">
          {language}
        </span>
      </div>
    </div>
  );
}

// Color swatch with copy functionality
function ColorSwatch({ label, cssVar, hex }: { label: string; cssVar: string; hex: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await copyToClipboardUtil(`var(${cssVar})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [cssVar]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
        "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2",
        "border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
        "hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3",
        "hover:border-foundation-accent-blue/30",
        "hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
        "group text-left w-full",
      )}
      aria-label={`Copy ${label} color value`}
    >
      <div
        className="size-12 rounded-lg border border-foundation-bg-light-3 dark:border-foundation-bg-dark-4 shadow-sm shrink-0 relative overflow-hidden"
        style={{ backgroundColor: `var(${cssVar})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foundation-text-light-primary dark:text-foundation-text-dark-primary truncate">
          {label}
        </div>
        <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-mono truncate">
          {hex}
        </div>
      </div>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <div className="flex items-center gap-1.5 text-foundation-accent-success">
            <IconCheckmark className="size-4" />
            <span className="text-xs font-medium">Copied!</span>
          </div>
        ) : (
          <IconCopy className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
        )}
      </div>
    </button>
  );
}

// Stat card component
function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-6 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 hover:border-foundation-accent-blue/30 transition-all duration-200 hover:shadow-sm">
      {icon && (
        <div className="size-10 rounded-lg bg-foundation-accent-blue/10 flex items-center justify-center mb-4 text-foundation-accent-blue">
          {icon}
        </div>
      )}
      <div className="text-3xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary tabular-nums">
        {value}
      </div>
      <div className="text-sm font-medium text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
        {label}
      </div>
      {description && (
        <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary mt-2">
          {description}
        </div>
      )}
    </div>
  );
}

// Section component
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-2">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

// Card component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DesignSystemDocs() {
  const [activeTab, setActiveTab] = useState<DocTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Group colors by category
  const groupedColors = colorSwatches.reduce<Record<string, (typeof colorSwatches)[number][]>>(
    (acc, swatch) => {
      if (!acc[swatch.group]) acc[swatch.group] = [];
      acc[swatch.group].push(swatch);
      return acc;
    },
    {},
  );

  // Filter icons based on search
  const filteredIcons = searchQuery
    ? iconCategories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    : iconCategories;

  const totalIcons = iconCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-1">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-foundation-bg-light-1/80 dark:bg-foundation-bg-dark-2/80 backdrop-blur-xl border-b border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-gradient-to-br from-foundation-accent-blue to-foundation-accent-purple flex items-center justify-center shadow-lg">
                <svg
                  className="size-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                  ChatGPT Design System
                </h1>
                <p className="text-sm text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                  Official UI Foundation & Component Library
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-foundation-accent-success/10 text-foundation-accent-success border border-foundation-accent-success/20">
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <nav className="flex items-center gap-2 p-1.5 rounded-xl bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 mb-10 overflow-x-auto shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue focus-visible:ring-offset-2",
                activeTab === tab.id
                  ? "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary shadow-sm scale-[1.02]"
                  : "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3/50",
              )}
            >
              <span className={cn(activeTab === tab.id && "text-foundation-accent-blue")}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="space-y-10">
          {activeTab === "overview" && (
            <>
              {/* Hero */}
              <Card className="bg-gradient-to-br from-foundation-bg-light-1 via-foundation-bg-light-2 to-foundation-bg-light-3 dark:from-foundation-bg-dark-2 dark:via-foundation-bg-dark-3 dark:to-foundation-bg-dark-2 border-foundation-accent-blue/20 shadow-lg">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foundation-accent-blue/10 text-foundation-accent-blue text-xs font-semibold mb-4 border border-foundation-accent-blue/20">
                    <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Production Ready
                  </div>
                  <h2 className="text-3xl font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
                    Complete Design System
                  </h2>
                  <p className="text-base text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-6 leading-relaxed">
                    A comprehensive, production-ready design system featuring the official ChatUI Apps SDK design tokens, 350+ icons, and complete Tailwind CSS integration with full light/dark mode support.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Tailwind CSS v4",
                      "Design Tokens",
                      "Dark Mode",
                      "Accessible",
                      "Type Safe",
                      "Tree Shakeable"
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-4 text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary border border-foundation-bg-light-4 dark:border-foundation-bg-dark-3"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Icon Categories"
                  value={iconCategories.length}
                  description="Organized families"
                  icon={<IconCompass className="size-6" />}
                />
                <StatCard
                  label="Total Icons"
                  value={totalIcons}
                  description="Production-ready"
                  icon={<IconImage className="size-6" />}
                />
                <StatCard 
                  label="Color Tokens" 
                  value={colorSwatches.length}
                  description="Light & dark modes"
                  icon={
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  }
                />
                <StatCard
                  label="Spacing Scale"
                  value={spacingScale.length}
                  description="8px grid system"
                  icon={
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  }
                />
              </div>

              {/* Quick Start */}
              <Section
                title="Quick Start Guide"
                description="Get up and running in 3 simple steps"
              >
                <div className="grid gap-5">
                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4">
                      <div className="size-8 rounded-lg bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-sm font-bold shrink-0">
                        1
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                          Import Foundation Styles
                        </h3>
                        <CodeBlock code={`import '@/styles/globals.css';\n\n// All design tokens are now available`} language="ts" />
                      </div>
                    </div>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4">
                      <div className="size-8 rounded-lg bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-sm font-bold shrink-0">
                        2
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                          Use Tailwind Foundation Classes
                        </h3>
                        <CodeBlock
                          code={`<div className="bg-foundation-bg-dark-1 text-foundation-text-dark-primary p-8 rounded-xl">
  <h1 className="text-heading-1 mb-4">Hello World</h1>
  <p className="text-body text-foundation-text-dark-secondary">
    Welcome to the ChatGPT design system
  </p>
</div>`}
                          language="tsx"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4">
                      <div className="size-8 rounded-lg bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-sm font-bold shrink-0">
                        3
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                          Import Icons & Components
                        </h3>
                        <CodeBlock
                          code={`import { IconSettings, IconSearch, IconUser } from '@/components/icons/ChatGPTIcons';
import { SettingDropdownBlock, SettingToggleBlock } from '@/components';

// Use components with full type safety`}
                          language="ts"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </Section>

              {/* Features Grid */}
              <Section
                title="Key Features"
                description="Everything you need for production applications"
              >
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    {
                      icon: (
                        <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      ),
                      title: "Official ChatUI Tokens",
                      description: "Based on the official ChatUI Apps SDK design tokens from index.dtcg.json"
                    },
                    {
                      icon: <IconSettings className="size-5" />,
                      title: "350+ Icons",
                      description: "Comprehensive icon library organized into 9 semantic categories"
                    },
                    {
                      icon: (
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      ),
                      title: "Dark Mode Built-in",
                      description: "Full light and dark mode support with automatic theme switching"
                    },
                    {
                      icon: (
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      ),
                      title: "Component Library",
                      description: "Production-ready components with Radix UI integration"
                    },
                    {
                      icon: (
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      ),
                      title: "Type Safe",
                      description: "Full TypeScript support with type definitions for all tokens"
                    },
                    {
                      icon: (
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      ),
                      title: "Performance Optimized",
                      description: "Tree-shakeable, minimal bundle size, and optimized for production"
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="hover:border-foundation-accent-blue/30 transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-lg bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Section>
            </>
          )}

          {activeTab === "colors" && (
            <Section
              title="Color Tokens"
              description="Complete color palette with semantic naming for backgrounds, text, icons, and accents"
            >
              <div className="space-y-6">
                {Object.entries(groupedColors).map(([group, swatches]) => (
                  <Card key={group}>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                        {group}
                      </h3>
                      <span className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-medium px-2 py-1 rounded-md bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3">
                        {swatches.length} tokens
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {swatches.map((swatch) => (
                        <ColorSwatch
                          key={swatch.label}
                          label={swatch.label}
                          cssVar={swatch.cssVar}
                          hex={swatch.hex}
                        />
                      ))}
                    </div>
                  </Card>
                ))}

                <Card>
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
                    Usage Examples
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-3">
                        Tailwind classes (recommended):
                      </p>
                      <CodeBlock
                        code={`<div className="bg-foundation-bg-dark-2 text-foundation-text-dark-primary">
  <p className="text-foundation-text-dark-secondary">Secondary text</p>
</div>`}
                        language="tsx"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-3">
                        CSS variables:
                      </p>
                      <CodeBlock
                        code={`<div style={{ 
  backgroundColor: 'var(--foundation-bg-dark-2)',
  color: 'var(--foundation-text-dark-primary)'
}}>
  Content
</div>`}
                        language="tsx"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </Section>
          )}

          {activeTab === "typography" && (
            <Section
              title="Typography System"
              description="Complete type scale with SF Pro font family and precise token values"
            >
              <div className="space-y-5">
                {typographyTokens.map((token) => (
                  <Card key={token.label} className="hover:shadow-md transition-shadow duration-200">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className="flex-1 text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
                          style={{
                            fontSize: token.size,
                            lineHeight: `${token.lineHeight}px`,
                            fontWeight: token.weight,
                            letterSpacing: `${token.tracking}px`,
                          }}
                        >
                          {token.example}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3">
                        <div>
                          <div className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                            {token.label}
                          </div>
                          <code className="text-xs text-foundation-accent-blue font-mono mt-1 inline-block">
                            {token.className}
                          </code>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-mono">
                            {token.size}px · {token.weight} · {token.lineHeight}px
                          </div>
                          {token.tracking !== 0 && (
                            <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-mono">
                              tracking: {token.tracking}px
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <Card>
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
                    Usage Example
                  </h3>
                  <CodeBlock
                    code={`<h1 className="text-heading-1">Heading 1</h1>
<h2 className="text-heading-2">Heading 2</h2>
<h3 className="text-heading-3">Heading 3</h3>
<p className="text-body">Body text for paragraphs</p>
<p className="text-body-small">Small body text</p>
<span className="text-caption">Caption text</span>`}
                    language="tsx"
                  />
                </Card>
              </div>
            </Section>
          )}

          {activeTab === "spacing" && (
            <Section
              title="Spacing System"
              description="8px-based grid system with consistent spacing tokens"
            >
              <Card>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {spacingScale.map((space) => (
                    <div
                      key={space.value}
                      className="flex flex-col items-center p-4 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-4 transition-colors"
                    >
                      <div
                        className="bg-foundation-accent-blue rounded-md mb-3 shadow-sm"
                        style={{ width: space.value, height: space.value, minWidth: 4, minHeight: 4 }}
                      />
                      <div className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary tabular-nums">
                        {space.value}px
                      </div>
                      <div className="text-xs text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary font-mono">
                        {space.tailwind}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
                  Usage Examples
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-3">
                      Padding & margin:
                    </p>
                    <CodeBlock
                      code={`<div className="p-4">Padding 16px</div>
<div className="p-8 m-6">Padding 32px, Margin 24px</div>
<div className="px-6 py-4">Horizontal 24px, Vertical 16px</div>`}
                      language="tsx"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-3">
                      Gap & space:
                    </p>
                    <CodeBlock
                      code={`<div className="flex gap-4">Gap 16px</div>
<div className="space-y-6">Vertical spacing 24px</div>
<div className="grid gap-8">Grid gap 32px</div>`}
                      language="tsx"
                    />
                  </div>
                </div>
              </Card>
            </Section>
          )}

          {activeTab === "icons" && (
            <Section
              title="Icon Library"
              description="350+ production-ready icons organized into semantic categories"
            >
              {/* Search */}
              <div className="relative">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search icons by name..."
                  aria-label="Search icons"
                  className={cn(
                    "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm",
                    "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2",
                    "border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
                    "text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
                    "placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary",
                    "focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue focus:border-transparent",
                    "transition-all duration-200",
                  )}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg className="size-4 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid gap-5">
                {filteredIcons.map((category) => (
                  <Card key={category.title}>
                    <div className="mb-5">
                      <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                        {category.title}
                      </h3>
                      <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mt-1">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map(({ name, Icon }) => (
                        <div
                          key={name}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-4 hover:shadow-sm transition-all duration-200 cursor-default group"
                          title={name}
                        >
                          <Icon className="size-5 text-foundation-icon-light-primary dark:text-foundation-icon-dark-primary group-hover:text-foundation-accent-blue transition-colors" />
                          <span className="text-xs font-medium text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary group-hover:text-foundation-text-light-primary dark:group-hover:text-foundation-text-dark-primary transition-colors">
                            {name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {filteredIcons.length === 0 && (
                <Card className="text-center py-16">
                  <div className="size-16 rounded-full bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3 flex items-center justify-center mx-auto mb-4">
                    <IconSearch className="size-8 text-foundation-icon-light-tertiary dark:text-foundation-icon-dark-tertiary" />
                  </div>
                  <p className="text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary text-sm">
                    No icons found matching <span className="font-semibold">"{searchQuery}"</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-sm text-foundation-accent-blue hover:underline"
                  >
                    Clear search
                  </button>
                </Card>
              )}

              <Card>
                <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
                  Usage Example
                </h3>
                <CodeBlock
                  code={`import { IconSettings, IconSearch, IconUser } from '@/components/icons/ChatGPTIcons';

function MyComponent() {
  return (
    <div className="flex items-center gap-2">
      <IconSettings className="size-5 text-foundation-icon-dark-primary" />
      <IconSearch className="size-5 text-foundation-icon-dark-secondary" />
      <IconUser className="size-4 text-foundation-accent-blue" />
    </div>
  );
}`}
                  language="tsx"
                />
              </Card>
            </Section>
          )}

          {activeTab === "components" && (
            <Section
              title="Component Library"
              description="Production-ready components built with Radix UI and design tokens"
            >
              <div className="grid gap-5">
                <Card>
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                    Template Components
                  </h3>
                  <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
                    Layout and structural components for building ChatGPT-style interfaces
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "TemplateShell",
                      "TemplatePanel",
                      "TemplateHeaderBar",
                      "TemplateFooterBar",
                      "TemplateCard",
                      "TemplateFieldGroup",
                      "TemplateFormField"
                    ].map((comp) => (
                      <span
                        key={comp}
                        className="px-3 py-2 rounded-lg text-xs font-mono bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary border border-foundation-bg-light-3 dark:border-foundation-bg-dark-4"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                    Setting Components
                  </h3>
                  <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
                    Form controls and settings UI with Radix UI integration
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "SettingDropdownBlock",
                      "SettingToggleBlock",
                      "SettingRowBlock",
                      "SettingDropdown",
                      "SettingToggle",
                      "SettingRow"
                    ].map((comp) => (
                      <span
                        key={comp}
                        className="px-3 py-2 rounded-lg text-xs font-mono bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary border border-foundation-bg-light-3 dark:border-foundation-bg-dark-4"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
                    UI Primitives (Radix UI)
                  </h3>
                  <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
                    Accessible, production-ready primitives with full keyboard navigation
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Dialog",
                      "DropdownMenu",
                      "Popover",
                      "Select",
                      "Switch",
                      "Checkbox",
                      "RadioGroup",
                      "Tabs",
                      "Accordion",
                      "Tooltip",
                      "HoverCard",
                      "ContextMenu",
                      "Slider"
                    ].map((comp) => (
                      <span
                        key={comp}
                        className="px-3 py-2 rounded-lg text-xs font-mono bg-foundation-accent-blue/10 dark:bg-foundation-accent-blue/20 text-foundation-accent-blue border border-foundation-accent-blue/20"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
                    Example: Setting Dropdown
                  </h3>
                  <CodeBlock
                    code={`import { SettingDropdownBlock } from '@/components';

function Settings() {
  const [model, setModel] = useState('gpt-4');
  
  return (
    <SettingDropdownBlock
      label="Model"
      value={model}
      onValueChange={setModel}
      variant="default"
      size="md"
      options={[
        { value: 'gpt-4', label: 'GPT-4', description: 'Most capable' },
        { value: 'gpt-3.5', label: 'GPT-3.5', description: 'Faster' }
      ]}
    />
  );
}`}
                    language="tsx"
                  />
                </Card>
              </div>
            </Section>
          )}

          {activeTab === "usage" && (
            <Section
              title="Usage Guide"
              description="Three ways to integrate design tokens in your project"
            >
              <div className="space-y-5">
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2 flex items-center gap-2">
                    <span className="size-6 rounded-md bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    Tailwind Foundation Classes (Recommended)
                  </h3>
                  <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
                    Clean, semantic class names for quick styling with full IntelliSense support
                  </p>
                  <CodeBlock
                    code={`<div className="bg-foundation-bg-dark-2 text-foundation-text-dark-primary rounded-xl p-8 space-y-4">
  <h2 className="text-heading-2">Dashboard</h2>
  <p className="text-body text-foundation-text-dark-secondary">
    Welcome to your workspace
  </p>
  <button className="bg-foundation-accent-blue hover:bg-foundation-accent-blue/90 px-4 py-2 rounded-lg">
    Get Started
  </button>
</div>`}
                    language="tsx"
                  />
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2 flex items-center gap-2">
                    <span className="size-6 rounded-md bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    CSS Variables (Direct Access)
                  </h3>
                  <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
                    Use CSS custom properties for dynamic or computed styles
                  </p>
                  <CodeBlock
                    code={`<div 
  style={{ 
    backgroundColor: 'var(--foundation-bg-dark-2)',
    color: 'var(--foundation-text-dark-primary)',
    padding: '2rem',
    borderRadius: '0.75rem'
  }}
>
  <h2 style={{ fontSize: '24px', fontWeight: 600 }}>
    Styled with CSS vars
  </h2>
</div>`}
                    language="tsx"
                  />
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2 flex items-center gap-2">
                    <span className="size-6 rounded-md bg-foundation-accent-blue/10 text-foundation-accent-blue flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    cn() Utility (Conditional Classes)
                  </h3>
                  <p className="text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary mb-4">
                    Combine and conditionally apply classes with the cn utility
                  </p>
                  <CodeBlock
                    code={`import { cn } from '@/components/ui/utils';

function Button({ variant, size, children }) {
  return (
    <button
      className={cn(
        "rounded-lg transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
        variant === "primary" && "bg-foundation-accent-blue text-white",
        variant === "secondary" && "bg-foundation-bg-dark-3 text-foundation-text-dark-primary",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-base"
      )}
    >
      {children}
    </button>
  );
}`}
                    language="tsx"
                  />
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4 flex items-center gap-2">
                    <svg className="size-5 text-foundation-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Best Practices
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Always use foundation tokens instead of arbitrary values",
                      "Prefer Tailwind classes over inline styles for better performance",
                      "Use semantic color tokens (e.g., text-primary) instead of specific colors",
                      "Follow the 8px spacing grid for consistent layouts",
                      "Use the cn() utility for conditional and complex class combinations",
                      "Import icons from the centralized icon library for consistency"
                    ].map((practice, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                        <IconCheckmark className="size-5 text-foundation-accent-success shrink-0 mt-0.5" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
                    Additional Resources
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "ChatUI Apps SDK Documentation", href: "#" },
                      { label: "Radix UI Integration Guide", href: "#" },
                      { label: "Tailwind CSS v4 Documentation", href: "#" },
                      { label: "TypeScript Type Definitions", href: "#" },
                      { label: "Component API Reference", href: "#" }
                    ].map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-foundation-accent-blue hover:underline group"
                      >
                        <svg
                          className="size-4 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </Card>
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 mt-20 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
              Built with official ChatUI Apps SDK design tokens · Version 1.0.0
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-foundation-accent-blue hover:underline">
                Documentation
              </a>
              <a href="#" className="text-sm text-foundation-accent-blue hover:underline">
                GitHub
              </a>
              <a href="#" className="text-sm text-foundation-accent-blue hover:underline">
                Figma
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
