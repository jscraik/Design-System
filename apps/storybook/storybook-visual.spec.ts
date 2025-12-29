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

import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * Helper to set theme and wait for transition
 */
async function setTheme(page: Page, theme: "light" | "dark") {
  await page.emulateMedia({ colorScheme: theme });
  await page.waitForTimeout(100);
}

function storyUrl(storyId: string, theme: "light" | "dark") {
  const params = new URLSearchParams();
  params.set("id", storyId);
  params.set("globals", `backgrounds.value:${theme === "light" ? "light" : "dark"}`);
  return `http://localhost:6006/iframe.html?${params.toString()}`;
}

/**
 * Critical UI components to test (from each major category)
 * Format: "title--story" from story title (e.g., "UI/Button" + "Default" = "ui-button--default")
 */
const CRITICAL_STORIES = [
  // Base primitives
  "ui-button--default",
  "ui-button--secondary",
  "ui-button--outline",
  "ui-button--ghost",
  "ui-button--destructive",
  "ui-button--withicon",
  "ui-button--icononly",
  "ui-input--default",
  "ui-textarea--default",
  "ui-switch--default",
  "ui-checkbox--default",
  "ui-radiogroup--default",
  "ui-select--default",
  "ui-slider--default",
  "ui-segmentedcontrol--default",
  "ui-badge--default",
  "ui-avatar--default",
  "ui-iconbutton--default",

  // Forms
  "ui-form--default",
  "ui-rangeslider--default",

  // Feedback
  "ui-dialog--default",
  "ui-dialog--longcontent",
  "ui-alertdialog--default",
  "ui-feedback-toast--default",
  "ui-sonner--default",

  // Navigation
  "ui-tabs--default",
  "ui-sidebar--default",
  "ui-navigationmenu--default",
  "ui-navigation-breadcrumb--default",
  "ui-navigation-pagination--default",
  "ui-modeselector--default",
  "ui-modelselector--default",
  "ui-viewmodetoggle--default",

  // Overlays
  "ui-popover--default",
  "ui-tooltip--default",
  "ui-dropdownmenu--default",
  "ui-contextmenu--default",
  "ui-drawer--default",
  "ui-sheet--default",
  "ui-hovercard--default",
  "ui-overlays-modal-dialog--default",

  // Chat components
  "chatui-chatheader--default",
  "chatui-chatinput--default",
  "chatui-chatmessages--default",
  "chatui-chatsidebar--defaultopen",
  "chatui-composeview--default",

  // Modals
  "chatui-settingsmodal--default",
  "chatui-discoverysettingsmodal--default",
  "chatui-iconpickermodal--default",

  // Display
  "ui-card--default",
  "ui-progress--default",
  "ui-skeleton--default",
  "ui-table--default",

  // Templates
  "templates-chatfullwidthtemplate--fullwidthchat",
  "templates-chattwopanetemplate--golden",
  "templates-dashboardtemplate--dashboardoverview",

  // Showcase pages
  "pages-designsystempage--default",
  "pages-typographypage--default",
  "pages-spacingpage--default",
  "designsystem-colorshowcase--default",
  "designsystem-foundationsshowcase--default",
  "design-system-iconography-showcase--default",
];

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
  const INTERACTIVE_STORIES = [
    "ui-button--default",
    "ui-input--default",
    "ui-iconbutton--default",
    "ui-switch--default",
  ];

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
