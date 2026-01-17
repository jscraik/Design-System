import type { ReactNode } from "react";

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
} from "../../../icons/ChatGPTIcons";

// Tab type for navigation
export type DocTab = "overview" | "colors" | "typography" | "spacing" | "icons" | "usage";

// Tab icon components (exported separately for TypeScript compatibility)
export function OverviewIcon({ className = "size-4" }: { className?: string }) {
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

export function ColorsIcon({ className = "size-4" }: { className?: string }) {
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
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  );
}

export function TypographyIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );
}

export function SpacingIcon({ className = "size-4" }: { className?: string }) {
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
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  );
}

export function IconsIcon({ className = "size-4" }: { className?: string }) {
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
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function UsageIcon({ className = "size-4" }: { className?: string }) {
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
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

export const iconCategories = [
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

export const colorSwatches = [
  { label: "bg-dark-1", cssVar: "--foundation-bg-dark-1", group: "Background (Dark)" },
  { label: "bg-dark-2", cssVar: "--foundation-bg-dark-2", group: "Background (Dark)" },
  { label: "bg-dark-3", cssVar: "--foundation-bg-dark-3", group: "Background (Dark)" },
  { label: "text-dark-primary", cssVar: "--foundation-text-dark-primary", group: "Text (Dark)" },
  {
    label: "text-dark-secondary",
    cssVar: "--foundation-text-dark-secondary",
    group: "Text (Dark)",
  },
  { label: "text-dark-tertiary", cssVar: "--foundation-text-dark-tertiary", group: "Text (Dark)" },
  { label: "bg-light-1", cssVar: "--foundation-bg-light-1", group: "Background (Light)" },
  { label: "bg-light-2", cssVar: "--foundation-bg-light-2", group: "Background (Light)" },
  { label: "bg-light-3", cssVar: "--foundation-bg-light-3", group: "Background (Light)" },
  { label: "text-light-primary", cssVar: "--foundation-text-light-primary", group: "Text (Light)" },
  {
    label: "text-light-secondary",
    cssVar: "--foundation-text-light-secondary",
    group: "Text (Light)",
  },
  {
    label: "text-light-tertiary",
    cssVar: "--foundation-text-light-tertiary",
    group: "Text (Light)",
  },
  { label: "accent-green", cssVar: "--foundation-accent-green", group: "Accents" },
  { label: "accent-blue", cssVar: "--foundation-accent-blue", group: "Accents" },
  { label: "accent-red", cssVar: "--foundation-accent-red", group: "Accents" },
  { label: "accent-yellow", cssVar: "--foundation-accent-yellow", group: "Accents" },
] as const;

// Spacing scale (8px grid system)
export const spacingScale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const;

// Typography tokens
export const typographyTokens = {
  fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  heading1: { size: 32, weight: 600, lineHeight: 40, tracking: -0.5 },
  heading2: { size: 24, weight: 600, lineHeight: 32, tracking: -0.3 },
  heading3: { size: 18, weight: 600, lineHeight: 24, tracking: -0.2 },
  body: { size: 15, weight: 400, lineHeight: 22, tracking: 0 },
  bodySmall: { size: 13, weight: 400, lineHeight: 18, tracking: 0 },
  caption: { size: 11, weight: 400, lineHeight: 14, tracking: 0.1 },
} as const;

export const tabs: { id: DocTab; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <OverviewIcon /> },
  { id: "colors", label: "Colors", icon: <ColorsIcon /> },
  { id: "typography", label: "Typography", icon: <TypographyIcon /> },
  { id: "spacing", label: "Spacing", icon: <SpacingIcon /> },
  { id: "icons", label: "Icons", icon: <IconsIcon /> },
  { id: "usage", label: "Usage", icon: <UsageIcon /> },
];
