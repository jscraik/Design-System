import type { ReactNode } from "react";

import {
  IconBarChart,
  IconBook,
  IconChat,
  IconCompose,
  IconFolder,
  IconSearch,
  IconWriting,
} from "../../../../icons/ChatGPTIcons";
import type { SidebarItem } from "../../shared/types";

/**
 * Project data - default projects and configuration
 */

/**
 * Default sidebar projects list.
 */
export const projects: SidebarItem[] = [
  {
    id: "apps-sdk",
    label: "Apps SDK Designer",
    icon: <IconWriting className="size-5" />,
    color: "text-accent-blue dark:text-accent-blue",
  },
  {
    id: "dadmode",
    label: "DADMODE",
    icon: <IconBarChart className="size-5" />,
    color: "text-accent-green dark:text-accent-green",
  },
  {
    id: "peer",
    label: "PEER Framework",
    icon: <IconFolder className="size-5" />,
    color: "text-accent-orange dark:text-accent-orange",
  },
];

/**
 * Default chat history labels.
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
 * Default sidebar categories.
 */
export const categories = ["Investing", "Homework", "Writing", "Coding", "Research"];

/**
 * Category icon elements by label.
 */
export const categoryIcons: Record<string, ReactNode> = {
  Investing: <IconBarChart className="size-5" />,
  Homework: <IconBook className="size-5" />,
  Writing: <IconWriting className="size-5" />,
  Coding: <IconCompose className="size-5" />,
  Research: <IconSearch className="size-5" />,
};

/**
 * Category badge class names by label.
 */
export const categoryColors: Record<string, string> = {
  Investing:
    "bg-accent-green/15 dark:bg-accent-green/15 text-accent-green dark:text-accent-green border-accent-green/30 dark:border-accent-green/30",
  Homework:
    "bg-accent-blue/15 dark:bg-accent-blue/15 text-accent-blue dark:text-accent-blue border-accent-blue/30 dark:border-accent-blue/30",
  Writing:
    "bg-accent-orange/15 dark:bg-accent-orange/15 text-accent-orange dark:text-accent-orange border-accent-orange/30 dark:border-accent-orange/30",
  Coding:
    "bg-status-error-muted/15 dark:bg-status-error-muted/15 text-status-error dark:text-status-error border-status-error/30 dark:border-status-error/30",
  Research:
    "bg-accent-blue/15 dark:bg-accent-blue/15 text-accent-blue dark:text-accent-blue border-accent-blue/30 dark:border-accent-blue/30",
};

/**
 * Category icon class names by label.
 */
export const categoryIconColors: Record<string, string> = {
  Investing: "text-accent-green dark:text-accent-green",
  Homework: "text-accent-blue dark:text-accent-blue",
  Writing: "text-accent-orange dark:text-accent-orange",
  Coding: "text-status-error dark:text-status-error",
  Research: "text-accent-blue dark:text-accent-blue",
};

/**
 * Project icon elements by icon identifier.
 */
export const projectIconMap: { [key: string]: ReactNode } = {
  folder: <IconFolder className="size-5" />,
  chat: <IconChat className="size-5" />,
  "bar-chart": <IconBarChart className="size-5" />,
  writing: <IconWriting className="size-5" />,
  book: <IconBook className="size-5" />,
  compose: <IconCompose className="size-5" />,
};

/**
 * Returns a project icon element for a given icon ID.
 *
 * @param iconId - Icon identifier.
 * @returns Icon element (folder icon as fallback).
 */
export function getProjectIcon(iconId: string) {
  return projectIconMap[iconId] || <IconFolder className="size-5" />;
}
