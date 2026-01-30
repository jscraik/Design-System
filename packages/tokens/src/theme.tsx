/**
 * @design-studio/tokens - Theme Provider
 *
 * Runtime theme switching with React context.
 * Supports light/dark themes with system preference detection.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

/**
 * Get initial theme from localStorage or system preference
 */
function getInitialTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
      return stored as Theme;
    }
  } catch {
    // Ignore localStorage errors
  }

  return defaultTheme;
}

/**
 * Get effective theme (resolves "system" to actual theme)
 */
function getEffectiveTheme(theme: Theme): "light" | "dark" {
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
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(() =>
    getEffectiveTheme(theme),
  );

  // Update effective theme when theme changes or system preference changes
  useEffect(() => {
    const updateEffectiveTheme = () => {
      setEffectiveTheme(getEffectiveTheme(theme));
    };

    updateEffectiveTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateEffectiveTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateEffectiveTheme);
    };
  }, [theme]);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", effectiveTheme);

    // Add class for backwards compatibility
    root.classList.remove("light", "dark");
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
export function useEffectiveTheme(): "light" | "dark" {
  const { effectiveTheme } = useTheme();
  return effectiveTheme;
}
