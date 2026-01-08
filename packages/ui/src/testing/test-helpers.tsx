/**
 * Test Utilities
 *
 * Common helper functions for testing ChatUI components.
 * Provides consistent rendering, user interaction simulation, and assertions.
 */

import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";

/**
 * Custom render function that includes any required providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  // Add any required providers here (ThemeProvider, etc.)
  return render(ui, options);
}

/**
 * Re-export commonly used testing library functions
 */
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

/**
 * Mock intersection observer for components that use it
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver as any;
}

/**
 * Mock resize observer for components that use it
 */
export function mockResizeObserver() {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver as any;
}

/**
 * Mock window.matchMedia for responsive components
 */
export function mockMatchMedia(matches: boolean = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Setup common mocks for all tests
 */
export function setupTestMocks() {
  mockIntersectionObserver();
  mockResizeObserver();
  mockMatchMedia();
}

/**
 * Wait for a specified delay (useful for animations, debounces)
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Flush all pending promises
 */
export const flushPromises = () =>
  new Promise((resolve) => setImmediate(resolve));

/**
 * Get data attribute value from element
 */
export function getDataAttribute(
  element: HTMLElement,
  attribute: string
): string | undefined {
  return element.getAttribute(`data-${attribute}`) || undefined;
}

/**
 * Type assertion for test elements
 */
export function getRequiredElement(
  container: HTMLElement,
  selector: string
): HTMLElement {
  const element = container.querySelector(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element as HTMLElement;
}
