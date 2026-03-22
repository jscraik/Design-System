/**
 * @design-studio/tokens - Theme Provider
 *
 * Runtime theme switching with React context.
 * Supports light/dark themes with system preference detection.
 */

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

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
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

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
export const THEME_STORAGE_KEY = "astudio-theme";

const VALID_THEMES: Theme[] = ["light", "dark", "system", "high-contrast", "system-high-contrast"];

/**
 * Get initial theme from localStorage or system preference
 */
function getInitialTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && (VALID_THEMES as string[]).includes(stored)) {
      return stored as Theme;
    }
  } catch {
    // Ignore localStorage errors
  }

  return defaultTheme;
}

/**
 * Get effective theme (resolves "system" and "system-high-contrast" to an actual theme).
 */
function getEffectiveTheme(theme: Theme): EffectiveTheme {
  if (theme === "high-contrast") return "high-contrast";

  if (theme === "system-high-contrast") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-contrast: more)").matches
      ? "high-contrast"
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  }

  if (theme !== "system") return theme;

  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Theme provider component
 *
 * Usage:
 *   <ThemeProvider defaultTheme="system">
 *     <App />
 *   </ThemeProvider>
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme(defaultTheme));
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() =>
    getEffectiveTheme(theme),
  );

  // Update effective theme when theme changes or system preference changes
  useEffect(() => {
    const updateEffectiveTheme = () => {
      setEffectiveTheme(getEffectiveTheme(theme));
    };

    updateEffectiveTheme();

    // Listen for system theme changes
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const contrastQuery = window.matchMedia("(prefers-contrast: more)");
    colorSchemeQuery.addEventListener("change", updateEffectiveTheme);
    contrastQuery.addEventListener("change", updateEffectiveTheme);

    return () => {
      colorSchemeQuery.removeEventListener("change", updateEffectiveTheme);
      contrastQuery.removeEventListener("change", updateEffectiveTheme);
    };
  }, [theme]);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", effectiveTheme);

    // Remove all known theme classes then apply effective
    root.classList.remove("light", "dark", "high-contrast");
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  // Persist theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme, storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const contextValue: ThemeContextValue = {
    theme,
    setTheme,
    effectiveTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 *
 * Usage:
 *   const { theme, setTheme, effectiveTheme } = useTheme();
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

/**
 * Hook to get the current effective theme (light or dark)
 * This is a convenience hook for components that only need to know the current theme
 *
 * Usage:
 *   const effectiveTheme = useEffectiveTheme();
 *   const isDark = effectiveTheme === "dark";
 */
export function useEffectiveTheme(): EffectiveTheme {
  const { effectiveTheme } = useTheme();
  return effectiveTheme;
}
