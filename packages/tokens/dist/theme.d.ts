/**
 * @design-studio/tokens - Theme Provider
 *
 * Runtime theme switching with React context.
 * Supports light/dark themes with system preference detection.
 */
import { type ReactNode } from "react";
/**
 * Theme type.
 *
 * - `"light"` / `"dark"`: explicit colour scheme
 * - `"system"`: follows `prefers-color-scheme`
 * - `"high-contrast"`: explicit high-contrast mode (WCAG enhanced contrast)
 * - `"system-high-contrast"`: follows `prefers-contrast: more`, resolves to high-contrast or system
 */
export type Theme = "light" | "dark" | "system" | "high-contrast" | "system-high-contrast";
/**
 * Resolved theme (after system preferences are applied).
 */
export type EffectiveTheme = "light" | "dark" | "high-contrast";
/**
 * Theme context type
 */
interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    effectiveTheme: EffectiveTheme;
}
/**
 * Theme provider props
 */
export interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}
/**
 * Local storage key for theme persistence
 */
export declare const THEME_STORAGE_KEY = "astudio-theme";
/**
 * Theme provider component
 *
 * Usage:
 *   <ThemeProvider defaultTheme="system">
 *     <App />
 *   </ThemeProvider>
 */
export declare function ThemeProvider({ children, defaultTheme, storageKey, }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access theme context
 *
 * Usage:
 *   const { theme, setTheme, effectiveTheme } = useTheme();
 */
export declare function useTheme(): ThemeContextValue;
/**
 * Hook to get the current effective theme (light or dark)
 * This is a convenience hook for components that only need to know the current theme
 *
 * Usage:
 *   const effectiveTheme = useEffectiveTheme();
 *   const isDark = effectiveTheme === "dark";
 */
export declare function useEffectiveTheme(): EffectiveTheme;
export {};
//# sourceMappingURL=theme.d.ts.map