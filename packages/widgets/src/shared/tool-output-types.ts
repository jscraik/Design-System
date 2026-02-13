/**
 * Tool Output Types
 *
 * Standardized tool output shapes for common widget patterns.
 * Widgets can extend these base types for their specific needs.
 */

import type { CartItem, ShopView } from "./data-types";

/**
 * Base tool output interface
 */
export type BaseToolOutput = {
  [key: string]: unknown;
};

/**
 * Shopping cart tool output
 */
export type CartToolOutput = {
  action?: "add" | "remove" | "clear" | "show";
  items?: CartItem[];
  message?: string;
};

/**
 * Shop tool output with view state
 */
export type ShopToolOutput = {
  items?: CartItem[];
  view?: ShopView;
};

/**
 * Dashboard tool output
 */
export type DashboardToolOutput = {
  headerText?: string;
  stats?: Array<{
    label: string;
    value: string;
    change: string;
  }>;
  recentChats?: Array<{
    id: number;
    title: string;
    model: string;
    time: string;
  }>;
};

/**
 * Example widget tool output
 */
export type ExampleToolOutput = {
  message?: string;
  count?: number;
  items?: string[];
};

/**
 * Search results tool output
 */
export type SearchToolOutput = {
  query?: string;
  results?: Array<{
    id: string;
    title: string;
    url: string;
    snippet?: string;
  }>;
};
