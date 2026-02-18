/**
 * @design-studio/tokens - Theme Provider
 *
 * Runtime theme switching with React context.
 * Supports light/dark themes with system preference detection.
 */
import { type ReactNode } from "react";
/**
 * Theme type
 */
export type Theme = "light" | "dark" | "system";
/**
 * Theme context type
 */
interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    effectiveTheme: "light" | "dark";
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
export declare function useEffectiveTheme(): "light" | "dark";
export {};
//# sourceMappingURL=theme.d.ts.map