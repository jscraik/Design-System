/**
 * Sidebar constants - icon names and configuration data
 * Following best practice: Store data, not React elements
 * React elements are created in components where needed
 */

/**
 * Sample chat history labels for the sidebar.
 */
export const chatHistory = [
  "Greeting exchange",
  "Storybook and Apps SDK UI",
  "Conversation start",
  "Your Year with ChatGPT",
  "CRMO explanation and sensitivity",
  "Project governance complexity",
  "React Component Explorers",
  "Clone Tauri App",
  "Apps SDK UI examples",
  "Governance framework expansion",
  "New chat",
  "Bobblehead figurine design",
  "Plushie transformation concept",
  "Plushie-style transformation",
  "3D pencil sketch generation",
  "Assistant response clarification",
  "Learn Year 7 Maths",
];

/**
 * Sidebar category labels.
 */
export const categories = ["Investing", "Homework", "Writing", "Coding", "Research"] as const;

/**
 * Category badge classes by label.
 */
export const categoryColors = {
  Investing: "bg-accent-green/20 text-accent-green border-accent-green/30",
  Homework: "bg-accent-blue/20 text-accent-blue border-accent-blue/30",
  Writing: "bg-accent-purple/20 text-accent-purple border-accent-purple/30",
  Coding: "bg-accent-orange/20 text-accent-orange border-accent-orange/30",
  Research: "bg-accent-pink/20 text-accent-pink border-accent-pink/30",
} as const;

/**
 * Category icon color classes by label.
 */
export const iconColorMap = {
  Investing: "text-accent-green",
  Homework: "text-accent-blue",
  Writing: "text-accent-purple",
  Coding: "text-accent-orange",
  Research: "text-accent-pink",
} as const;

/**
 * Icon type definitions (string identifiers, not JSX).
 */
export type IconType =
  | "chat"
  | "folder"
  | "bar-chart"
  | "writing"
  | "book"
  | "compose"
  | "search"
  | "chevron-right";

/**
 * Quick action configurations (icon type tokens only).
 */
export const quickActionsConfig = [
  { id: "chatgpt", label: "ChatGPT", iconType: "chat" as IconType },
  { id: "gpts", label: "GPTs", iconType: "chevron-right" as IconType },
  { id: "new-project", label: "New project", iconType: "folder" as IconType },
];

/**
 * Initial project list configuration shown in the sidebar.
 */
export const initialProjectsConfig = [
  {
    id: "apps-sdk",
    label: "Apps SDK Designer",
    iconType: "writing" as IconType,
    color: "text-accent-purple",
  },
  {
    id: "dadmode",
    label: "DADMODE",
    iconType: "bar-chart" as IconType,
    color: "text-accent-green",
  },
  {
    id: "peer",
    label: "PEER Framework",
    iconType: "folder" as IconType,
    color: "text-accent-orange",
  },
];

/**
 * Category icon type mapping.
 */
export const categoryIconTypes: Record<string, IconType> = {
  Investing: "bar-chart",
  Homework: "book",
  Writing: "writing",
  Coding: "compose",
  Research: "search",
};
