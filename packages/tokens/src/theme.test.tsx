/**
 * @design-studio/tokens - Theme Provider Tests
 *
 * Tests for runtime theme switching functionality.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useEffectiveTheme, useTheme } from "./theme";

describe("ThemeProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document theme
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("light", "dark");
  });

  describe("rendering", () => {
    it("should render children", () => {
      render(
        <ThemeProvider defaultTheme="light">
          <div>Test Content</div>
        </ThemeProvider>,
      );
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should set initial theme from defaultTheme prop", () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <div>Dark Theme</div>
        </ThemeProvider>,
      );
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });
  });

  describe("theme switching", () => {
    it("should switch themes when setTheme is called", () => {
      function TestComponent() {
        const { theme, setTheme } = useTheme();
        return (
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            Current: {theme}
          </button>
        );
      }

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button");
      expect(button.textContent).toBe("Current: light");

      fireEvent.click(button);
      expect(button.textContent).toBe("Current: dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });

    it("should persist theme to localStorage", () => {
      function TestComponent() {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme("dark")}>Set Dark</button>;
      }

      render(
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
          <TestComponent />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(localStorage.getItem("test-theme")).toBe("dark");
    });
  });

  describe("system theme detection", () => {
    it("should resolve system theme to light when pref is light", () => {
      // Mock window.matchMedia to return light mode
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: false,
        media: "(prefers-color-scheme: dark)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(
        <ThemeProvider defaultTheme="system">
          <div>System Theme</div>
        </ThemeProvider>,
      );

      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });

    it("should resolve system theme to dark when pref is dark", () => {
      // Mock window.matchMedia to return dark mode
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: true,
        media: "(prefers-color-scheme: dark)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(
        <ThemeProvider defaultTheme="system">
          <div>System Theme</div>
        </ThemeProvider>,
      );

      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });
  });

  describe("useEffectiveTheme", () => {
    it("should return the effective theme (not 'system')", () => {
      function TestComponent() {
        const effectiveTheme = useEffectiveTheme();
        return <div>Effective: {effectiveTheme}</div>;
      }

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByText("Effective: light")).toBeInTheDocument();
    });

    it("should return 'dark' when system preference is dark", () => {
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: true,
        media: "(prefers-color-scheme: dark)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      function TestComponent() {
        const effectiveTheme = useEffectiveTheme();
        return <div>Effective: {effectiveTheme}</div>;
      }

      render(
        <ThemeProvider defaultTheme="system">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByText("Effective: dark")).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("should throw error when useTheme is used outside ThemeProvider", () => {
      expect(() => {
        function TestComponent() {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          const { theme } = useTheme();
          return <div>{theme}</div>;
        }

        render(<TestComponent />);
      }).toThrow("useTheme must be used within a ThemeProvider");
    });
  });
});
