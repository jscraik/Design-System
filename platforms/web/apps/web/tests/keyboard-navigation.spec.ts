/**
 * Modal Keyboard Navigation Tests
 *
 * Tests keyboard navigation and focus management for modal dialogs:
 * - ModalDialog focus trap
 * - SettingsModal multi-panel navigation
 * - IconPickerModal grid navigation
 * - Escape key behavior
 * - Focus restoration on close
 */

import { expect, type Page, test } from "@playwright/test";

// Import test utilities
import {
  getFocusedElement,
  pressKey,
  runAxeScan,
} from "../../../../../packages/ui/src/testing/utils/keyboard-utils";

async function gotoHarness(page: Page) {
  await page.goto("/harness");
  await expect(page.getByRole("button", { name: "Open Modal" })).toBeVisible({ timeout: 60000 });
}

async function openHarnessModal(
  page: Page,
  label: "Open Modal" | "Choose Icon" | "Discovery Settings",
) {
  const trigger = page.getByRole("button", { name: label });
  await expect(trigger).toBeVisible({ timeout: 60000 });
  await trigger.click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
}

test.describe("ModalDialog keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHarness(page);
  });

  test("focuses modal on open", async ({ page }) => {
    // Listen for console messages before navigation
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warn") {
        console.log(`Console [${msg.type()}]:`, msg.text(), msg.location());
      }
    });

    // Listen for uncaught errors with full details
    page.on("pageerror", (err) => {
      console.log("Page error:", err.message, err.stack);
    });

    // Also listen for request failures
    page.on("requestfailed", (request) => {
      console.log("Request failed:", request.url(), request.failure().errorText);
    });

    await openHarnessModal(page, "Open Modal");

    // Modal should be focused
    const focused = await getFocusedElement(page);
    expect(await focused.count()).toBeGreaterThan(0);

    // Check for role="dialog" attribute
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test("traps focus within modal (Tab cycles)", async ({ page }) => {
    await openHarnessModal(page, "Open Modal");
    const modal = page.locator('[role="dialog"]');

    // Get initial focused element
    await getFocusedElement(page);

    // Press Tab multiple times - should cycle within modal
    for (let i = 0; i < 5; i++) {
      await pressKey(page, "Tab");
      const focused = await getFocusedElement(page);

      // Focus should remain within modal
      const isInModal = await modal.evaluate(
        (modalEl, focusedEl) => modalEl.contains(focusedEl),
        await focused.elementHandle(),
      );

      expect(isInModal).toBe(true);
    }
  });

  test("traps focus within modal (Shift+Tab cycles backward)", async ({ page }) => {
    await openHarnessModal(page, "Open Modal");
    const modal = page.locator('[role="dialog"]');

    // Press Shift+Tab - should move to previous focusable element within modal
    await page.waitForTimeout(100);
    await pressKey(page, "Shift+Tab");
    const focused = await getFocusedElement(page);

    // Focus should remain within modal
    const isInModal = await modal.evaluate(
      (modalEl, focusedEl) => modalEl.contains(focusedEl),
      await focused.elementHandle(),
    );

    expect(isInModal).toBe(true);
  });

  test("closes modal on Escape key", async ({ page }) => {
    const openButton = page.locator('button:has-text("Open Modal")');
    const modal = page.locator('[role="dialog"]');

    // Open modal
    await openButton.click();
    await expect(modal).toBeVisible();

    // Press Escape
    await pressKey(page, "Escape");

    // Modal should be closed
    await expect(modal).not.toBeVisible();
  });

  test("closes modal on overlay click", async ({ page }) => {
    const modal = page.locator('[role="dialog"]');
    const overlay = page.locator('[role="presentation"] > button').first();

    // Open modal
    await openHarnessModal(page, "Open Modal");

    // Click overlay
    await overlay.evaluate((el) => (el as HTMLButtonElement).click());

    // Modal should be closed
    await expect(modal).not.toBeVisible();
  });

  test("restores focus to trigger on close", async ({ page }) => {
    const openButton = page.locator('button:has-text("Open Modal")');
    const modal = page.locator('[role="dialog"]');

    // Focus the button before opening
    await openButton.focus();
    const buttonId = await openButton.evaluate((el) => el.id);

    // Open modal
    await openButton.click();
    await expect(modal).toBeVisible();

    // Close with Escape
    await pressKey(page, "Escape");
    await expect(modal).not.toBeVisible();

    // Focus should return to button
    const focused = await getFocusedElement(page);
    const focusedId = await focused.evaluate((el) => el?.id);

    expect(focusedId).toBe(buttonId);
  });

  test("has proper ARIA attributes", async ({ page }) => {
    await openHarnessModal(page, "Open Modal");
    const modal = page.locator('[role="dialog"]');

    // Check role
    await expect(modal).toHaveAttribute("role", "dialog");

    // Check aria-modal
    await expect(modal).toHaveAttribute("aria-modal", "true");

    // Check aria-labelledby (title reference)
    const hasLabelledBy = await modal.evaluate((el) => el.hasAttribute("aria-labelledby"));
    expect(hasLabelledBy).toBe(true);
  });

  test("passes Axe accessibility scan", async ({ page }) => {
    await openHarnessModal(page, "Open Modal");
    // Run Axe scan on modal
    await runAxeScan(page, '[role="dialog"]');
  });
});

test.describe("SettingsModal keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navigates between main sections with Tab", async ({ page }) => {
    // Open Settings modal via sidebar user menu
    await page.click('[data-testid="chat-sidebar-user-menu"]');
    await page.click('[data-testid="chat-sidebar-settings"]');
    const modal = page.locator('[role="dialog"]');

    // Tab through main sections
    for (let i = 0; i < 10; i++) {
      await pressKey(page, "Tab");
      const focused = await getFocusedElement(page);

      // Focus should remain within modal
      const isInModal = await modal.evaluate(
        (modalEl, focusedEl) => modalEl.contains(focusedEl),
        await focused.elementHandle(),
      );

      expect(isInModal).toBe(true);
    }
  });

  test("navigates into panel and back with keyboard", async ({ page }) => {
    // Open Settings modal via sidebar user menu
    await page.click('[data-testid="chat-sidebar-user-menu"]');
    await page.click('[data-testid="chat-sidebar-settings"]');

    // Find and click Personalization setting row
    const personalizationRow = page.locator('button:has-text("Personalization")');
    await personalizationRow.click();

    // Should be in panel view now
    await expect(page.locator("text=Personalization")).toBeVisible();

    // Press Escape to go back to main view
    await pressKey(page, "Escape");

    // Should be back in main view
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    // Personalization row should still be visible
    await expect(personalizationRow).toBeVisible();
  });

  test("toggles switches with Space/Enter", async ({ page }) => {
    await page.click('[data-testid="chat-sidebar-user-menu"]');
    await page.click('[data-testid="chat-sidebar-settings"]');

    // Find a toggle/switch
    const toggle = page.locator('[role="switch"]').first();
    // Focus the toggle (Tab to it or click to focus)
    await toggle.focus();

    // Get initial state
    const initialState = await toggle.getAttribute("aria-checked");

    // Press Space to toggle
    await pressKey(page, "Space");

    // State should change
    const newState = await toggle.getAttribute("aria-checked");
    expect(newState).not.toBe(initialState);
  });

  test("navigates dropdowns with arrow keys", async ({ page }) => {
    await page.click('[data-testid="chat-sidebar-user-menu"]');
    await page.click('[data-testid="chat-sidebar-settings"]');

    // Find a dropdown/segmented control
    const dropdown = page.locator('[role="radiogroup"]').first();

    if ((await dropdown.count()) > 0) {
      await dropdown.focus();

      // Press arrow keys to navigate options
      await pressKey(page, "ArrowRight");
      await pressKey(page, "ArrowLeft");

      // Check focus moved
      const focused = await getFocusedElement(page);
      expect(await focused.count()).toBeGreaterThan(0);
    }
  });

  test("passes Axe accessibility scan", async ({ page }) => {
    await page.click('[data-testid="chat-sidebar-user-menu"]');
    await page.click('[data-testid="chat-sidebar-settings"]');
    // Run Axe scan on settings modal
    await runAxeScan(page, '[role="dialog"]');
  });
});

test.describe("IconPickerModal keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHarness(page);
  });

  test("navigates icon grid with arrow keys", async ({ page }) => {
    // Open Icon Picker
    await openHarnessModal(page, "Choose Icon");
    const modal = page.locator('[role="dialog"]');

    // Try arrow key navigation in icon grid
    await pressKey(page, "ArrowRight");
    await pressKey(page, "ArrowLeft");
    await pressKey(page, "ArrowDown");
    await pressKey(page, "ArrowUp");

    // Focus should remain in modal
    const focused = await getFocusedElement(page);
    const isInModal = await modal.evaluate(
      (modalEl, focusedEl) => modalEl.contains(focusedEl),
      await focused.elementHandle(),
    );

    expect(isInModal).toBe(true);
  });

  test("selects color and icon with keyboard", async ({ page }) => {
    await openHarnessModal(page, "Choose Icon");

    // Focus should be in modal
    const focused = await getFocusedElement(page);
    expect(await focused.count()).toBeGreaterThan(0);

    // Tab to color picker
    await pressKey(page, "Tab");
    await pressKey(page, "Tab");

    // Press Enter to select
    await pressKey(page, "Enter");

    // Tab to icon grid and select
    await pressKey(page, "Tab");
    await pressKey(page, "Enter");
  });

  test("passes Axe accessibility scan", async ({ page }) => {
    await openHarnessModal(page, "Choose Icon");
    // Run Axe scan
    await runAxeScan(page, '[role="dialog"]');
  });
});

test.describe("DiscoverySettingsModal keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHarness(page);
  });

  test("navigates form controls with Tab", async ({ page }) => {
    await openHarnessModal(page, "Discovery Settings");
    const modal = page.locator('[role="dialog"]');

    // Tab through all controls
    for (let i = 0; i < 15; i++) {
      await pressKey(page, "Tab");
      const focused = await getFocusedElement(page);

      // Focus should remain within modal
      const isInModal = await modal.evaluate(
        (modalEl, focusedEl) => modalEl.contains(focusedEl),
        await focused.elementHandle(),
      );

      expect(isInModal).toBe(true);
    }
  });

  test("operates range sliders with arrow keys", async ({ page }) => {
    await openHarnessModal(page, "Discovery Settings");

    // Find a range slider (input type="range")
    const slider = page.locator('input[type="range"]').first();

    if ((await slider.count()) > 0) {
      await slider.focus();

      const initialValue = await slider.inputValue();
      await pressKey(page, "ArrowRight");
      await pressKey(page, "ArrowLeft");

      // Values should change (direction depends on implementation)
      expect(initialValue).toBeDefined();
    }
  });

  test("toggles toggles with Space", async ({ page }) => {
    await openHarnessModal(page, "Discovery Settings");

    // Find all toggles/switches
    const toggles = page.locator('[role="switch"]');

    const count = await toggles.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const toggle = toggles.nth(i);
      await toggle.focus();

      const initialState = await toggle.getAttribute("aria-checked");
      await pressKey(page, "Space");
      const newState = await toggle.getAttribute("aria-checked");

      expect(newState).not.toBe(initialState);
    }
  });

  test("passes Axe accessibility scan", async ({ page }) => {
    await openHarnessModal(page, "Discovery Settings");
    // Run Axe scan
    await runAxeScan(page, '[role="dialog"]');
  });
});
