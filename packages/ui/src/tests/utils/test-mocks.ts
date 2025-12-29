/**
 * Deterministic Test Data Utilities
 *
 * Utilities for mocking dynamic content in tests to prevent flaky
 * visual and functional tests. These mocks ensure consistent:
 * - Timestamps and dates
 * - Random values (IDs, colors, etc.)
 * - Time-related animations
 * - Font loading states
 */

import type { Page } from "@playwright/test";

/**
 * Setup deterministic mocks for dynamic content.
 * This prevents visual test flakiness from timestamps, random IDs, etc.
 */
export async function setupDeterministicMocks(page: Page): Promise<void> {
  // Mock Date to return consistent time
  await page.addInitScript(() => {
    const FIXED_DATE = new Date("2025-01-15T10:30:00Z");

    class MockDate extends Date {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super(FIXED_DATE);
        } else {
          super(...(args as ConstructorParameters<typeof Date>));
        }
      }

      static now() {
        return FIXED_DATE.getTime();
      }

      getTime() {
        return FIXED_DATE.getTime();
      }
    }

    // @ts-expect-error - Intentional mock
    globalThis.Date = MockDate;
  });

  // Mock Math.random for consistent "random" values
  await page.addInitScript(() => {
    let seed = 0.42;

    // Seeded random for consistency
    Math.random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  });

  // Mock performance.now() for consistent timing
  await page.addInitScript(() => {
    let now = 0;
    performance.now = () => {
      now += 16; // Simulate ~60fps frame time
      return now;
    };
  });
}

/**
 * Wait for all fonts to be loaded before taking screenshots.
 * This prevents visual diffs from font loading timing.
 */
export async function waitForFontsLoaded(page: Page): Promise<void> {
  await page.evaluate(async () => {
    // Wait for document.fonts.ready
    await document.fonts.ready;

    // Additional wait for any late-loading fonts
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
}

/**
 * Wait for CSS animations and transitions to complete.
 * Use before taking screenshots to avoid motion blur.
 */
export async function waitForAnimations(page: Page): Promise<void> {
  await page.evaluate(async () => {
    // Get all animated elements
    const animatedElements = document.querySelectorAll(
      "[class*='transition-'], [class*='animate-']"
    );

    // Wait for transition end (or timeout)
    await Promise.allSettled(
      Array.from(animatedElements).map(
        (el) =>
          new Promise((resolve) => {
            const timeout = setTimeout(resolve, 300);
            el.addEventListener("transitionend", () => {
              clearTimeout(timeout);
              resolve(undefined);
            });
          })
      )
    );

    // Final safety wait
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
}

/**
 * Mock Intl.DateTimeFormat for consistent date formatting
 * across locales and timezones.
 */
export async function setupDateTimeMock(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const ORIGINAL_FORMAT = Intl.DateTimeFormat;

    // @ts-expect-error - Mock Intl for consistent dates
    Intl.DateTimeFormat = function (...args: Parameters<typeof ORIGINAL_FORMAT>) {
      const formatter = new ORIGINAL_FORMAT(...args);
      const originalFormat = formatter.format;

      return {
        ...formatter,
        format: (_date: Date) => {
          // Always format as the same fixed date
          return originalFormat(new Date("2025-01-15T10:30:00Z"));
        },
      };
    };
  });
}

/**
 * Disable all CSS transitions and animations for testing.
 * Use this when you want immediate state changes without timing.
 */
export async function disableAnimations(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  });
}

/**
 * Setup comprehensive test environment mocks.
 * Combines all common mocks in one call.
 */
export async function setupTestEnvironment(
  page: Page,
  options: {
    deterministic?: boolean;
    disableAnims?: boolean;
    mockDateTime?: boolean;
  } = {}
): Promise<void> {
  const {
    deterministic = true,
    disableAnims = false,
    mockDateTime = true,
  } = options;

  if (deterministic) {
    await setupDeterministicMocks(page);
  }

  if (disableAnims) {
    await disableAnimations(page);
  }

  if (mockDateTime) {
    await setupDateTimeMock(page);
  }

  // Always wait for fonts after setup
  await waitForFontsLoaded(page);
}

/**
 * Mock clipboard API for consistent clipboard tests
 */
export async function mockClipboard(page: Page, text: string = "mocked-clipboard-text"): Promise<void> {
  await page.addInitScript((text) => {
    Object.assign(navigator, {
      clipboard: {
        writeText: async () => void 0,
        readText: async () => text,
      },
    });
  }, text);
}

/**
 * Mock IntersectionObserver for elements that use lazy loading
 */
export async function mockIntersectionObserver(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const ORIGINAL = IntersectionObserver;

    IntersectionObserver = class MockIntersectionObserver extends ORIGINAL {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(callback, options);
        // Immediately trigger callback with "intersecting" entries
        setTimeout(() => {
          const now = Date.now();
          const rect = document.body.getBoundingClientRect();
          const entry = {
            time: now,
            isIntersecting: true,
            target: document.body,
            intersectionRatio: 1,
            boundingClientRect: rect,
            intersectionRect: rect,
            rootBounds: rect,
          } as IntersectionObserverEntry;
          callback([entry], this);
        }, 0);
      }

      observe() {
        // No-op for testing
      }

      unobserve() {
        // No-op for testing
      }

      disconnect() {
        // No-op for testing
      }
    };
  });
}

/**
 * Mock ResizeObserver for responsive components
 */
export async function mockResizeObserver(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const ORIGINAL = ResizeObserver;

    ResizeObserver = class MockResizeObserver extends ORIGINAL {
      constructor(callback: ResizeObserverCallback) {
        super(callback);
        // Trigger with default size
        setTimeout(() => {
          const rect = document.body.getBoundingClientRect();
          const entry = {
            contentRect: rect,
            target: document.body,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          } as ResizeObserverEntry;
          callback([entry], this);
        }, 0);
      }

      observe() {
        // No-op for testing
      }

      unobserve() {
        // No-op for testing
      }

      disconnect() {
        // No-op for testing
      }
    };
  });
}

/**
 * Setup all observer mocks for consistent layout tests
 */
export async function setupObserverMocks(page: Page): Promise<void> {
  await mockIntersectionObserver(page);
  await mockResizeObserver(page);
}
