/**
 * Storybook Screenshot Regression Tests
 *
 * Visual regression tests for Storybook stories in both light and dark themes.
 * Tests key components at the story level (component isolation) for faster
 * feedback than full E2E visual tests.
 *
 * Run: pnpm test:visual:storybook
 * Update: pnpm test:visual:storybook --update-screenshots
 */

import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const storybookBaseUrl =
  process.env.PLAYWRIGHT_STORYBOOK_BASE_URL ??
  `http://127.0.0.1:${process.env.PLAYWRIGHT_STORYBOOK_PORT ?? process.env.STORYBOOK_PORT ?? "6006"}`;

function parseStoryIdsEnv(name: string): string[] | null {
  const raw = process.env[name];
  if (!raw) return null;
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

/**
 * Helper to set theme and wait for transition
 */
async function setTheme(page: Page, theme: "light" | "dark") {
  await page.emulateMedia({ colorScheme: theme });
  await page.waitForTimeout(100);
}

function storyUrl(storyId: string, theme: "light" | "dark") {
  const url = new URL("/iframe.html", storybookBaseUrl);
  url.searchParams.set("id", storyId);
  url.searchParams.set(
    "globals",
    [`theme:${theme}`, `backgrounds.value:${theme === "light" ? "light" : "dark"}`].join(";"),
  );
  url.searchParams.set("devOverlays", "0");
  url.searchParams.set("agentation", "0");
  return url.toString();
}

/**
 * Critical UI components to test (from each major category)
 * Format: "title--story" from story title (e.g., "Components/UI/Base/Button" + "Default" = "components-ui-base-button--default")
 */
const DEFAULT_CRITICAL_STORIES = [
  // Base primitives
  "components-ui-base-button--default",
  "components-ui-base-button--secondary",
  "components-ui-base-button--outline",
  "components-ui-base-button--ghost",
  "components-ui-base-button--destructive",
  "components-ui-base-button--withicon",
  "components-ui-base-button--icononly",
  "components-ui-base-input--default",
  "components-ui-base-textarea--default",
  "components-ui-base-switch--default",
  "components-ui-base-checkbox--default",
  "components-ui-base-radio-group--default",
  "components-ui-base-select--default",
  "components-ui-base-slider--default",
  "components-ui-base-segmented-control--default",
  "components-ui-base-badge--default",
  "components-ui-base-avatar--default",
  "components-ui-base-icon-button--default",

  // Forms
  "components-ui-forms-form--default",
  "components-ui-forms-range-slider--default",

  // Feedback
  "components-ui-feedback-dialog--default",
  "components-ui-feedback-dialog--longcontent",
  "components-ui-feedback-alert-dialog--default",
  "components-ui-feedback-toast--default",
  "components-ui-feedback-sonner--default",

  // Navigation
  "components-ui-navigation-tabs--default",
  "components-ui-navigation-sidebar--default",
  "components-ui-navigation-navigation-menu--default",
  "components-ui-navigation-breadcrumb--default",
  "components-ui-navigation-pagination--default",
  "components-ui-navigation-mode-selector--default",
  "components-ui-navigation-model-selector--default",
  "components-ui-navigation-view-mode-toggle--default",

  // Overlays
  "components-ui-overlays-popover--default",
  "components-ui-overlays-tooltip--default",
  "components-ui-overlays-dropdown-menu--default",
  "components-ui-overlays-context-menu--default",
  "components-ui-overlays-drawer--default",
  "components-ui-overlays-sheet--default",
  "components-ui-overlays-hover-card--default",
  "components-ui-overlays-modal--default",

  // Chat components
  "components-chat-chat-header--default",
  "components-chat-chat-input--default",
  "components-chat-chat-messages--default",
  "components-chat-chat-sidebar--defaultopen",
  "components-chat-compose-view--default",

  // Modals
  "components-modals-settings-modal--default",
  "components-modals-discovery-settings-modal--default",
  "components-modals-icon-picker-modal--default",

  // Display
  "components-ui-data-display-card--default",
  "components-ui-data-display-progress--default",
  "components-ui-base-skeleton--default",
  "components-ui-base-table--default",

  // Templates
  "components-templates-chat-chat-full-width--fullwidthchat",
  "components-templates-chat-chat-two-pane--golden",
  "components-templates-dashboard-dashboard--dashboardoverview",

  // Showcase pages
  "overview-pages-design-system--default",
  "overview-pages-typography--default",
  "overview-pages-spacing--default",
  "documentation-design-system-color-showcase--default",
  "documentation-design-system-foundations-showcase--default",
  "documentation-design-system-iconography-showcase--default",
];

const DEFAULT_INTERACTIVE_STORIES = [
  "components-ui-base-button--default",
  "components-ui-base-input--default",
  "components-ui-base-icon-button--default",
  "components-ui-base-switch--default",
];

const CRITICAL_STORIES =
  parseStoryIdsEnv("PLAYWRIGHT_STORYBOOK_STORY_IDS") ?? DEFAULT_CRITICAL_STORIES;
const INTERACTIVE_STORIES =
  parseStoryIdsEnv("PLAYWRIGHT_STORYBOOK_INTERACTIVE_STORY_IDS") ?? DEFAULT_INTERACTIVE_STORIES;

test.describe("Storybook visual regression - Light Theme", () => {
  test.beforeEach(async ({ page }) => {
    await setTheme(page, "light");
  });

  for (const storyId of CRITICAL_STORIES) {
    test(storyId, async ({ page }) => {
      await page.goto(storyUrl(storyId, "light"));
      await page.waitForLoadState("networkidle");
      await page.waitForFunction(() => !document.fonts || document.fonts.status === "loaded");
      await expect(page).toHaveScreenshot(`${storyId}-light.png`);
    });
  }
});

test.describe("Storybook visual regression - Dark Theme", () => {
  test.beforeEach(async ({ page }) => {
    await setTheme(page, "dark");
  });

  for (const storyId of CRITICAL_STORIES) {
    test(storyId, async ({ page }) => {
      await page.goto(storyUrl(storyId, "dark"));
      await page.waitForLoadState("networkidle");
      await page.waitForFunction(() => !document.fonts || document.fonts.status === "loaded");
      await expect(page).toHaveScreenshot(`${storyId}-dark.png`);
    });
  }
});

test.describe("Storybook visual regression - Interactive States", () => {
  // Test hover/focus states for critical interactive elements
  for (const storyId of INTERACTIVE_STORIES) {
    test(`${storyId} - hover state`, async ({ page }) => {
      await setTheme(page, "light");
      await page.goto(storyUrl(storyId, "light"));
      await page.waitForLoadState("networkidle");
      await page.waitForFunction(() => !document.fonts || document.fonts.status === "loaded");

      // Hover over the main element
      const root = page.locator("#storybook-root");
      const interactive = root.locator("button, input, a, [role='button']").first();
      if ((await interactive.count()) > 0) {
        await interactive.hover();
        await page.waitForTimeout(100);
        await expect(page).toHaveScreenshot(`${storyId}-hover-light.png`);
      }
    });

    test(`${storyId} - focus state`, async ({ page }) => {
      await setTheme(page, "light");
      await page.goto(storyUrl(storyId, "light"));
      await page.waitForLoadState("networkidle");
      await page.waitForFunction(() => !document.fonts || document.fonts.status === "loaded");

      const root = page.locator("#storybook-root");
      const interactive = root.locator("button, input, a, [role='button']").first();
      if ((await interactive.count()) > 0) {
        await interactive.focus();
        await page.waitForTimeout(100);
        await expect(page).toHaveScreenshot(`${storyId}-focus-light.png`);
      }
    });
  }
});
