import type { ReactNode } from "react";

import type { IconType } from "./constants";

/**
 * Shared types for ChatSidebar internal modules
 * Following best practice: types are shared, but modules are internal-only
 */

/**
 * Describes a sidebar item with a rendered icon.
 */
export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode; // Keep ReactNode for runtime items
  color?: string;
}

/**
 * Describes a sidebar item configuration using icon type tokens.
 */
export interface SidebarItemConfig {
  id: string;
  label: string;
  iconType: IconType; // Use IconType for configuration
  color?: string;
}

/**
 * Defines user metadata displayed in the chat sidebar.
 */
export interface ChatSidebarUser {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  initials?: string;
}

/**
 * Memory scope options for sidebar filtering.
 */
export type MemoryOption = "default" | "project-only";
