const THEME_STORAGE_KEY = "astudio.theme" as const;

export type ThemePreference = "light" | "dark";

export function getStoredThemePreference(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}

export function getSystemTheme(): ThemePreference {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: ThemePreference) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function setThemePreference(theme: ThemePreference) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

export function clearThemePreference() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(THEME_STORAGE_KEY);
  applyTheme(getSystemTheme());
}

export function initThemePreference() {
  const stored = getStoredThemePreference();
  applyTheme(stored ?? getSystemTheme());

  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (event: MediaQueryListEvent) => {
    if (getStoredThemePreference()) return;
    applyTheme(event.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}
