#!/usr/bin/env node

/**
 * Property-Based Tests for Theme Propagation
 *
 * Tests Property 6: Theme Propagation
 * Validates: Requirements 3.3, 3.4, 6.2, 6.4
 */

import fc from "fast-check";
import {
  applyTheme,
  clearThemePreference,
  getStoredThemePreference,
  initThemePreference,
  setThemePreference,
} from "../platforms/web/apps/web/src/app/theme.ts";

const THEME_VALUES = ["light", "dark"];

const createMockEnvironment = (systemTheme) => {
  const attributes = new Map();
  const listeners = new Set();
  const documentElement = {
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: (name) => attributes.get(name) ?? null,
  };

  const localStorage = new Map();
  const window = {
    localStorage: {
      getItem: (key) => localStorage.get(key) ?? null,
      setItem: (key, value) => localStorage.set(key, value),
      removeItem: (key) => localStorage.delete(key),
    },
    matchMedia: () => ({
      matches: systemTheme === "dark",
      addEventListener: (event, callback) => {
        if (event === "change") {
          listeners.add(callback);
        }
      },
      removeEventListener: (event, callback) => {
        if (event === "change") {
          listeners.delete(callback);
        }
      },
    }),
  };

  const emitThemeChange = (nextTheme) => {
    for (const callback of listeners) {
      callback({ matches: nextTheme === "dark" });
    }
  };

  return {
    document: { documentElement },
    window,
    emitThemeChange,
  };
};

const withMockedGlobals = (environment, run) => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  globalThis.window = environment.window;
  globalThis.document = environment.document;

  try {
    return run();
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
};

describe("Theme Propagation Property", () => {
  test("Property 6: applyTheme writes the data-theme attribute", () => {
    fc.assert(
      fc.property(fc.constantFrom(...THEME_VALUES), (theme) => {
        const environment = createMockEnvironment("light");
        withMockedGlobals(environment, () => {
          applyTheme(theme);
          expect(environment.document.documentElement.getAttribute("data-theme")).toBe(
            theme,
          );
        });
      }),
      { numRuns: 20, timeout: 5000 },
    );
  });

  test("Property 6: setThemePreference persists and applies theme", () => {
    fc.assert(
      fc.property(fc.constantFrom(...THEME_VALUES), (theme) => {
        const environment = createMockEnvironment("light");
        withMockedGlobals(environment, () => {
          setThemePreference(theme);
          expect(getStoredThemePreference()).toBe(theme);
          expect(environment.document.documentElement.getAttribute("data-theme")).toBe(
            theme,
          );
        });
      }),
      { numRuns: 20, timeout: 5000 },
    );
  });

  test("Property 6: clearThemePreference resets to system theme", () => {
    fc.assert(
      fc.property(fc.constantFrom(...THEME_VALUES), (systemTheme) => {
        const environment = createMockEnvironment(systemTheme);
        withMockedGlobals(environment, () => {
          setThemePreference(systemTheme === "dark" ? "light" : "dark");
          clearThemePreference();
          expect(getStoredThemePreference()).toBe(null);
          expect(environment.document.documentElement.getAttribute("data-theme")).toBe(
            systemTheme,
          );
        });
      }),
      { numRuns: 20, timeout: 5000 },
    );
  });

  test("Property 6: initThemePreference honors stored theme and system changes", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...THEME_VALUES),
        fc.constantFrom(...THEME_VALUES),
        fc.boolean(),
        (systemTheme, storedTheme, hasStoredTheme) => {
          const environment = createMockEnvironment(systemTheme);
          withMockedGlobals(environment, () => {
            if (hasStoredTheme) {
              setThemePreference(storedTheme);
            }

            const teardown = initThemePreference();

            const expectedInitialTheme = hasStoredTheme ? storedTheme : systemTheme;
            expect(environment.document.documentElement.getAttribute("data-theme")).toBe(
              expectedInitialTheme,
            );

            const nextTheme = systemTheme === "dark" ? "light" : "dark";
            environment.emitThemeChange(nextTheme);

            const expectedAfterChange = hasStoredTheme ? storedTheme : nextTheme;
            expect(environment.document.documentElement.getAttribute("data-theme")).toBe(
              expectedAfterChange,
            );

            teardown();
          });
        },
      ),
      { numRuns: 20, timeout: 5000 },
    );
  });
});
