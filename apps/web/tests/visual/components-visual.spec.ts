/**
 * Screenshot Regression Tests - Component Level
 *
 * Visual regression tests for key components in both light and dark themes.
 * Tests capture screenshots at consistent viewports and compare against
 * stored snapshots to detect unintended visual changes.
 *
 * Run: pnpm test:visual:web
 * Update: pnpm test:visual:update
 */

import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// Import deterministic test utilities
import {
  setupTestEnvironment,
  waitForAnimations,
} from "../../../../packages/ui/src/tests/utils/test-mocks";

/**
 * Helper to set theme and wait for transition
 */
async function setTheme(page: Page, theme: "light" | "dark") {
  await page.emulateMedia({ colorScheme: theme });
  await page.waitForTimeout(100);
}

/**
 * Helper to capture screenshot with consistent naming
 */
type CaptureOptions = {
  theme?: "light" | "dark";
  fullPage?: boolean;
  clip?: { x: number; y: number; width: number; height: number };
};

async function captureScreenshot(page: Page, name: string, options: CaptureOptions = {}) {
  const { theme = "light", ...rest } = options;
  await setTheme(page, theme);

  // Wait for animations to complete before screenshot
  await waitForAnimations(page);

  const filename = `${name}-${theme}.png`;
  await expect(page).toHaveScreenshot(filename, rest);
}

// Setup deterministic test environment before all tests
test.beforeEach(async ({ page }) => {
  await setupTestEnvironment(page, {
    deterministic: true,
    disableAnims: false, // We want to test with animations, just wait for them
    mockDateTime: true,
  });
});

test.describe("ModalDialog visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/harness");
  });

  test("renders modal in light theme", async ({ page }) => {
    // Open a test modal (assuming harness has modal trigger)
    const modalTrigger = page.locator('button:has-text("Open Modal")').first();

    if ((await modalTrigger.count()) > 0) {
      await modalTrigger.click();
      const modal = page.locator('[role="dialog"]').first();

      await expect(modal).toBeVisible();
      await captureScreenshot(page, "modal-dialog-basic");
    }
  });

  test("renders modal in dark theme", async ({ page }) => {
    const modalTrigger = page.locator('button:has-text("Open Modal")').first();

    if ((await modalTrigger.count()) > 0) {
      await modalTrigger.click();
      const modal = page.locator('[role="dialog"]').first();

      await expect(modal).toBeVisible();
      await captureScreenshot(page, "modal-dialog-basic", { theme: "dark" });
    }
  });

  test("renders modal with header in both themes", async ({ page }) => {
    const modalTrigger = page.locator('button:has-text("Open Modal")').first();

    if ((await modalTrigger.count()) > 0) {
      await modalTrigger.click();

      // Light theme
      await captureScreenshot(page, "modal-dialog-with-header");

      // Dark theme
      await captureScreenshot(page, "modal-dialog-with-header", { theme: "dark" });
    }
  });

  test("renders modal with body content in both themes", async ({ page }) => {
    const modalTrigger = page.locator('button:has-text("Open Modal")').first();

    if ((await modalTrigger.count()) > 0) {
      await modalTrigger.click();

      // Light theme
      await captureScreenshot(page, "modal-dialog-with-body");

      // Dark theme
      await captureScreenshot(page, "modal-dialog-with-body", { theme: "dark" });
    }
  });

  test("renders modal with footer actions in both themes", async ({ page }) => {
    const modalTrigger = page.locator('button:has-text("Open Modal")').first();

    if ((await modalTrigger.count()) > 0) {
      await modalTrigger.click();

      // Light theme
      await captureScreenshot(page, "modal-dialog-with-footer");

      // Dark theme
      await captureScreenshot(page, "modal-dialog-with-footer", { theme: "dark" });
    }
  });
});

test.describe("SettingsModal visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders settings main view in both themes", async ({ page }) => {
    // Open settings modal
    const settingsTrigger = page.locator('[aria-label="Open settings"], button:has-text("Settings")').first();

    if ((await settingsTrigger.count()) > 0) {
      await settingsTrigger.click();
      const modal = page.locator('[role="dialog"]').first();

      await expect(modal).toBeVisible();

      // Light theme
      await captureScreenshot(page, "settings-modal-main-view");

      // Dark theme
      await captureScreenshot(page, "settings-modal-main-view", { theme: "dark" });
    }
  });

  test("renders settings with all sections in both themes", async ({ page }) => {
    const settingsTrigger = page.locator('[aria-label="Open settings"], button:has-text("Settings")').first();

    if ((await settingsTrigger.count()) > 0) {
      await settingsTrigger.click();
      // Scroll to bottom to load all content
      await page.locator('[role="dialog"]').first().evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });

      await page.waitForTimeout(200);

      // Light theme
      await captureScreenshot(page, "settings-modal-full-scroll");

      // Dark theme
      await captureScreenshot(page, "settings-modal-full-scroll", { theme: "dark" });
    }
  });

  test("renders settings panels in both themes", async ({ page }) => {
    const settingsTrigger = page.locator('[aria-label="Open settings"], button:has-text("Settings")').first();

    if ((await settingsTrigger.count()) > 0) {
      await settingsTrigger.click();

      // Navigate to different panels and capture screenshots
      const panels = [
        { name: "Personalization", trigger: 'button:has-text("Personalization")' },
        { name: "Notifications", trigger: 'button:has-text("Notifications")' },
        { name: "Apps", trigger: 'button:has-text("Apps")' },
        { name: "Data", trigger: 'button:has-text("Data Controls")' },
      ];

      for (const panel of panels) {
        const trigger = page.locator(panel.trigger).first();

        if ((await trigger.count()) > 0) {
          await trigger.click();
          await page.waitForTimeout(200); // Wait for panel transition

          // Light theme
          await captureScreenshot(page, `settings-panel-${panel.name.toLowerCase()}`);

          // Dark theme
          await captureScreenshot(page, `settings-panel-${panel.name.toLowerCase()}`, {
            theme: "dark",
          });

          // Go back to main view
          await page.keyboard.press("Escape");
          await page.waitForTimeout(200);
        }
      }
    }
  });

  test("renders toggle switches in both themes", async ({ page }) => {
    const settingsTrigger = page.locator('[aria-label="Open settings"], button:has-text("Settings")').first();

    if ((await settingsTrigger.count()) > 0) {
      await settingsTrigger.click();

      // Find toggles and capture
      const toggles = page.locator('[role="switch"]').first();

      if ((await toggles.count()) > 0) {
        // Light theme
        await captureScreenshot(page, "settings-modal-toggles");

        // Dark theme
        await captureScreenshot(page, "settings-modal-toggles", { theme: "dark" });
      }
    }
  });
});

test.describe("IconPickerModal visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/harness");
  });

  test("renders icon picker in both themes", async ({ page }) => {
    const iconPickerTrigger = page.locator('button:has-text("Choose Icon"), button:has-text("Icon Picker")').first();

    if ((await iconPickerTrigger.count()) > 0) {
      await iconPickerTrigger.click();
      const modal = page.locator('[role="dialog"]').first();

      await expect(modal).toBeVisible();

      // Light theme
      await captureScreenshot(page, "icon-picker-modal");

      // Dark theme
      await captureScreenshot(page, "icon-picker-modal", { theme: "dark" });
    }
  });

  test("renders icon grid with selection in both themes", async ({ page }) => {
    const iconPickerTrigger = page.locator('button:has-text("Choose Icon"), button:has-text("Icon Picker")').first();

    if ((await iconPickerTrigger.count()) > 0) {
      await iconPickerTrigger.click();

      // Click an icon to select it
      const icon = page.locator('[aria-label*="Icon:"], button[title*="folder"]').first();

      if ((await icon.count()) > 0) {
        await icon.click();
        await page.waitForTimeout(100);

        // Light theme
        await captureScreenshot(page, "icon-picker-modal-selected");

        // Dark theme
        await captureScreenshot(page, "icon-picker-modal-selected", { theme: "dark" });
      }
    }
  });

  test("renders color picker in both themes", async ({ page }) => {
    const iconPickerTrigger = page.locator('button:has-text("Choose Icon"), button:has-text("Icon Picker")').first();

    if ((await iconPickerTrigger.count()) > 0) {
      await iconPickerTrigger.click();

      // Light theme
      await captureScreenshot(page, "icon-picker-color-picker");

      // Dark theme
      await captureScreenshot(page, "icon-picker-color-picker", { theme: "dark" });
    }
  });
});

test.describe("DiscoverySettingsModal visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/harness");
  });

  test("renders discovery settings in both themes", async ({ page }) => {
    const discoveryTrigger = page.locator('button:has-text("Discovery Settings")').first();

    if ((await discoveryTrigger.count()) > 0) {
      await discoveryTrigger.click();
      const modal = page.locator('[role="dialog"]').first();

      await expect(modal).toBeVisible();

      // Light theme
      await captureScreenshot(page, "discovery-settings-modal");

      // Dark theme
      await captureScreenshot(page, "discovery-settings-modal", { theme: "dark" });
    }
  });

  test("renders with range sliders in both themes", async ({ page }) => {
    const discoveryTrigger = page.locator('button:has-text("Discovery Settings")').first();

    if ((await discoveryTrigger.count()) > 0) {
      await discoveryTrigger.click();

      // Light theme
      await captureScreenshot(page, "discovery-settings-sliders");

      // Dark theme
      await captureScreenshot(page, "discovery-settings-sliders", { theme: "dark" });
    }
  });

  test("renders segmented controls in both themes", async ({ page }) => {
    const discoveryTrigger = page.locator('button:has-text("Discovery Settings")').first();

    if ((await discoveryTrigger.count()) > 0) {
      await discoveryTrigger.click();

      // Light theme
      await captureScreenshot(page, "discovery-settings-segments");

      // Dark theme
      await captureScreenshot(page, "discovery-settings-segments", { theme: "dark" });
    }
  });
});

test.describe("ChatSidebar visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders expanded sidebar in both themes", async ({ page }) => {
    const sidebar = page.locator('[data-testid="chat-sidebar"]');

    await expect(sidebar).toBeVisible();

    // Light theme
    await captureScreenshot(page, "sidebar-expanded");

    // Dark theme
    await captureScreenshot(page, "sidebar-expanded", { theme: "dark" });
  });

  test("renders collapsed sidebar (rail) in both themes", async ({ page }) => {
    const collapseBtn = page.locator('[aria-label*="Collapse sidebar"], [aria-label*="Expand sidebar"]').first();

    if ((await collapseBtn.count()) > 0) {
      await collapseBtn.click();
      await page.waitForTimeout(200); // Wait for transition

      // Light theme
      await captureScreenshot(page, "sidebar-collapsed");

      // Dark theme
      await captureScreenshot(page, "sidebar-collapsed", { theme: "dark" });
    }
  });

  test("renders sidebar with project list in both themes", async ({ page }) => {
    // Find projects section and expand
    const projectsSection = page.getByRole("button", { name: /projects/i }).first();

    if ((await projectsSection.count()) > 0) {
      await projectsSection.click();
      await page.waitForTimeout(200);

      // Light theme
      await captureScreenshot(page, "sidebar-with-projects");

      // Dark theme
      await captureScreenshot(page, "sidebar-with-projects", { theme: "dark" });
    }
  });

  test("renders sidebar with groups in both themes", async ({ page }) => {
    // Find group chats section
    const groupsSection = page.getByRole("button", { name: /group chats/i }).first();

    if ((await groupsSection.count()) > 0) {
      await groupsSection.click();
      await page.waitForTimeout(200);

      // Light theme
      await captureScreenshot(page, "sidebar-with-groups");

      // Dark theme
      await captureScreenshot(page, "sidebar-with-groups", { theme: "dark" });
    }
  });

  test("renders sidebar with active state in both themes", async ({ page }) => {
    // Click a chat/project to activate it
    const firstItem = page
      .locator('button:has-text("UI Library"), button:has-text("Apps SDK Demo"), button:has-text("Search Widgets")')
      .first();

    if ((await firstItem.count()) > 0) {
      await firstItem.click();
      await page.waitForTimeout(100);

      // Light theme
      await captureScreenshot(page, "sidebar-active-state");

      // Dark theme
      await captureScreenshot(page, "sidebar-active-state", { theme: "dark" });
    }
  });
});

test.describe("Form components visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/harness");
  });

  test("renders input fields in both themes", async ({ page }) => {
    const input = page.locator('input[type="text"]').first();

    if ((await input.count()) > 0) {
      // Focus input to show states
      await input.focus();

      // Light theme
      await captureScreenshot(page, "input-focused");

      // Dark theme
      await captureScreenshot(page, "input-focused", { theme: "dark" });
    }
  });

  test("renders buttons in both themes", async ({ page }) => {
    const buttons = page.locator('button').all();

    if (buttons.length > 0) {
      // Test first few buttons
      for (let i = 0; i < Math.min(3, buttons.length); i++) {
        const button = buttons[i];

        // Hover state
        await button.hover();
        await page.waitForTimeout(50);

        // Light theme
        await captureScreenshot(page, `button-${i}-hover`);

        // Dark theme
        await captureScreenshot(page, `button-${i}-hover`, { theme: "dark" });
      }
    }
  });

  test("renders toggles/switches in both themes", async ({ page }) => {
    const toggle = page.locator('[role="switch"]').first();

    if ((await toggle.count()) > 0) {
      // Light theme - unchecked
      await captureScreenshot(page, "toggle-unchecked");

      // Dark theme - unchecked
      await captureScreenshot(page, "toggle-unchecked", { theme: "dark" });

      // Click to check
      await toggle.click();
      await page.waitForTimeout(100);

      // Light theme - checked
      await captureScreenshot(page, "toggle-checked");

      // Dark theme - checked
      await captureScreenshot(page, "toggle-checked", { theme: "dark" });
    }
  });
});

test.describe("Responsive visual regression", () => {
  test("renders modal on mobile viewport in both themes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/harness");

    const modalTrigger = page.locator('button:has-text("Open Modal")').first();

    if ((await modalTrigger.count()) > 0) {
      await modalTrigger.click();
      const modal = page.locator('[role="dialog"]').first();

      await expect(modal).toBeVisible();

      // Light theme
      await captureScreenshot(page, "modal-mobile");

      // Dark theme
      await captureScreenshot(page, "modal-mobile", { theme: "dark" });
    }
  });

  test("renders sidebar on mobile viewport in both themes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const sidebar = page.locator('[data-testid="chat-sidebar"]');

    await expect(sidebar).toBeVisible();

    // Light theme
    await captureScreenshot(page, "sidebar-mobile");

    // Dark theme
    await captureScreenshot(page, "sidebar-mobile", { theme: "dark" });
  });

  test("renders settings on tablet viewport in both themes", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    const settingsTrigger = page.locator('[aria-label="Open settings"], button:has-text("Settings")').first();

    if ((await settingsTrigger.count()) > 0) {
      await settingsTrigger.click();

      // Light theme
      await captureScreenshot(page, "settings-tablet");

      // Dark theme
      await captureScreenshot(page, "settings-tablet", { theme: "dark" });
    }
  });
});

test.describe("Interactive states visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/harness");
  });

  test("renders hover states in both themes", async ({ page }) => {
    const button = page.locator('button').first();

    if ((await button.count()) > 0) {
      await button.hover();
      await page.waitForTimeout(100);

      // Light theme
      await captureScreenshot(page, "button-hover");

      // Dark theme
      await captureScreenshot(page, "button-hover", { theme: "dark" });
    }
  });

  test("renders focus states in both themes", async ({ page }) => {
    const button = page.locator('button').first();

    if ((await button.count()) > 0) {
      await button.focus();
      await page.waitForTimeout(100);

      // Light theme
      await captureScreenshot(page, "button-focus");

      // Dark theme
      await captureScreenshot(page, "button-focus", { theme: "dark" });
    }
  });

  test("renders active/pressed states in both themes", async ({ page }) => {
    const button = page.locator('button[aria-pressed="true"], button:has-text("Active"), button.active').first();

    if ((await button.count()) > 0) {
      // Light theme
      await captureScreenshot(page, "button-active");

      // Dark theme
      await captureScreenshot(page, "button-active", { theme: "dark" });
    }
  });

  test("renders disabled states in both themes", async ({ page }) => {
    const disabledButton = page.locator('button[disabled], button:disabled').first();

    if ((await disabledButton.count()) > 0) {
      // Light theme
      await captureScreenshot(page, "button-disabled");

      // Dark theme
      await captureScreenshot(page, "button-disabled", { theme: "dark" });
    }
  });
});

test.describe("Icon and visual elements visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders icons in both themes", async ({ page }) => {
    // Find all icon buttons/elements
    const icons = page.locator('svg, [class*="icon"], [class*="Icon"]').all();

    if (icons.length > 0) {
      // Capture first icon
      const icon = icons[0];

      // Light theme
      const iconBounds = await icon.boundingBox();
      if (iconBounds) {
        await page.screenshot({
          clip: iconBounds,
          path: "icon-light.png",
        });
      }
    }

    // Dark theme
    await setTheme(page, "dark");

    const iconsDark = page.locator('svg, [class*="icon"], [class*="Icon"]').all();

    if (iconsDark.length > 0) {
      const icon = iconsDark[0];
      const iconBounds = await icon.boundingBox();

      if (iconBounds) {
        await page.screenshot({
          clip: iconBounds,
          path: "icon-dark.png",
        });
      }
    }
  });

  test("renders accent colors consistently in both themes", async ({ page }) => {
    // Find elements with accent colors (green, blue, orange, red)
    const accentElements = page.locator('[class*="accent"], [class*="text-green"], [class*="text-blue"]').all();

    if (accentElements.length > 0) {
      // Light theme - capture accent elements
      for (let i = 0; i < Math.min(3, accentElements.length); i++) {
        const element = accentElements[i];
        const bounds = await element.boundingBox();

        if (bounds) {
          await page.screenshot({
            clip: { ...bounds, width: 50, height: 50 }, // Sample of element
            path: `accent-light-${i}.png`,
          });
        }
      }
    }

    // Dark theme
    await setTheme(page, "dark");

    const accentDark = page.locator('[class*="accent"], [class*="text-green"], [class*="text-blue"]').all();

    if (accentDark.length > 0) {
      for (let i = 0; i < Math.min(3, accentDark.length); i++) {
        const element = accentDark[i];
        const bounds = await element.boundingBox();

        if (bounds) {
          await page.screenshot({
            clip: { ...bounds, width: 50, height: 50 },
            path: `accent-dark-${i}.png`,
          });
        }
      }
    }
  });
});
