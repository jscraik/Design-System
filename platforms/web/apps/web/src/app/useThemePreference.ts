import { useCallback, useEffect, useState } from "react";

import {
  getStoredThemePreference,
  getSystemTheme,
  initThemePreference,
  setThemePreference,
  type ThemePreference,
} from "./theme";

export function useThemePreference() {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    return getStoredThemePreference() ?? getSystemTheme();
  });

  useEffect(() => {
    const cleanup = initThemePreference();
    return () => cleanup();
  }, []);

  const updateTheme = useCallback((next: ThemePreference) => {
    setThemePreference(next);
    setTheme(next);
  }, []);

  return { theme, setTheme: updateTheme } as const;
}
