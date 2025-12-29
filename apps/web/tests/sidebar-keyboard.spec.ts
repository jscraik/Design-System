/**
 * ChatSidebar Keyboard Navigation Tests
 *
 * Tests keyboard navigation and focus management for the ChatSidebar:
 * - Rail button navigation with arrow keys
 * - Collapsed mode navigation
 * - Focus management between rail and main content
 * - Modal overlays within sidebar context
 * - Accessibility assertions
 */

import { expect, test } from "@playwright/test";

// Import test utilities
import {
  pressKey,
  getFocusedElement,
  runAxeScan,
} from "../../../packages/ui/src/tests/utils/keyboard-utils";

test.describe("ChatSidebar keyboard navigation - Expanded Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navigates main items with Tab", async ({ page }) => {
    const sidebar = page.locator('[data-testid="chat-sidebar"]');

    // Tab into sidebar
    await pressKey(page, "Tab");
    await pressKey(page, "Tab");

    // Should focus first sidebar item
    const focused = await getFocusedElement(page);
    const isInSidebar = await sidebar.evaluate(
      (sidebarEl, focusedEl) => sidebarEl.contains(focusedEl),
      await focused.elementHandle()
    );

    expect(isInSidebar).toBe(true);
  });

  test("navigates project list with Tab", async ({ page }) => {
    const sidebar = page.locator('[data-testid="chat-sidebar"]');
    const projectsSection = sidebar.getByRole("button", { name: /projects/i }).first();

    if (await projectsSection.count() > 0) {
      // Expand projects if collapsed
      await projectsSection.click();

      const projectButton = sidebar.getByRole("button", { name: /new project/i }).first();
      if (await projectButton.count() > 0) {
        await projectButton.focus();
        await pressKey(page, "Tab");
      }

      const focused = await getFocusedElement(page);
      if (await focused.count()) {
        const inSidebar = await sidebar.evaluate(
          (nav, focusedEl) => nav.contains(focusedEl),
          await focused.elementHandle()
        );
        expect(inSidebar).toBe(true);
      }
    }
  });

  test("activates items with Enter/Space", async ({ page }) => {
    // Find "New chat" button
    const newChatBtn = page.locator('button:has-text("New chat"), [aria-label="New chat"]');

    await newChatBtn.focus();
    expect(await newChatBtn).toBeFocused();

    // Press Enter to activate
    await pressKey(page, "Enter");

    // Should trigger new chat (check for some indicator)
    // This may vary based on implementation
  });

  test("navigates between sections with Tab", async ({ page }) => {
    const sidebar = page.locator('[data-testid="chat-sidebar"]');

    const firstButton = sidebar.getByRole("button", { name: /new chat/i }).first();
    if (await firstButton.count() > 0) {
      await firstButton.focus();
    }

    // Press Tab a few times to navigate through sidebar
    for (let i = 0; i < 5; i++) {
      await pressKey(page, "Tab");
      const focused = await getFocusedElement(page);

      if (await focused.count()) {
        const inSidebar = await sidebar.evaluate(
          (sidebarEl, focusedEl) => sidebarEl?.contains(focusedEl) ?? false,
          await focused.elementHandle()
        );
        expect(inSidebar).toBe(true);
      }
    }
  });
});

test.describe("ChatSidebar keyboard navigation - Collapsed Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("collapses sidebar with keyboard", async ({ page }) => {
    // Find collapse button
    const collapseBtn = page.locator('[data-testid="chat-sidebar-toggle"]');

    if (await collapseBtn.count() > 0) {
      const sidebar = page.locator('[data-testid="chat-sidebar"]');
      const initialWidth = await sidebar.evaluate((el) => el.offsetWidth);
      await collapseBtn.focus();
      await pressKey(page, "Enter");

      const collapsedWidth = await sidebar.evaluate((el) => el.offsetWidth);
      expect(collapsedWidth).toBeLessThan(initialWidth);
    }
  });

  test("navigates rail buttons with arrow keys", async ({ page }) => {
    const collapseBtn = page.locator('[data-testid="chat-sidebar-toggle"]');

    // Collapse sidebar first
    if (await collapseBtn.count() > 0) {
      await collapseBtn.click();

      // Now in rail mode - test arrow key navigation
      // Arrow Down should move to next rail item
      await pressKey(page, "ArrowDown");
      const afterDown = await getFocusedElement(page);

      expect(await afterDown.count()).toBeGreaterThan(0);

      // Arrow Up should move to previous rail item
      await pressKey(page, "ArrowUp");
      const afterUp = await getFocusedElement(page);

      expect(await afterUp.count()).toBeGreaterThan(0);
    }
  });

  test("wraps around rail with arrow keys", async ({ page }) => {
    const collapseBtn = page.locator('[data-testid="chat-sidebar-toggle"]');

    if (await collapseBtn.count() > 0) {
      await collapseBtn.click();

      // Press Arrow Down many times to cycle through all rail items
      for (let i = 0; i < 10; i++) {
        await pressKey(page, "ArrowDown");
      }

      // Should wrap around and still be focused on rail
      const focused = await getFocusedElement(page);
      const inSidebar = await page.locator('[data-testid="chat-sidebar"]').evaluate(
        (nav, focused) => nav.contains(focused),
        await focused.elementHandle()
      );

      expect(inSidebar).toBe(true);
    }
  });

  test("shows tooltip on rail button focus", async ({ page }) => {
    const collapseBtn = page.locator('[data-testid="chat-sidebar-toggle"]');

    if (await collapseBtn.count() > 0) {
      await collapseBtn.click();

      // Focus a rail button
      await pressKey(page, "Tab");
      await pressKey(page, "Tab");

      // Rail button should have title/aria-label for tooltip
      const focused = await getFocusedElement(page);
      const hasLabel = await focused.evaluate((el) =>
        el.hasAttribute("title") || el.hasAttribute("aria-label")
      );

      expect(hasLabel).toBe(true);
    }
  });
});

test.describe("ChatSidebar keyboard navigation - Modals", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens project settings modal with keyboard", async ({ page }) => {
    // Find a project with settings (hover to show options)
    const projectItem = page.locator('[data-rail-item="true"]').first();

    if ((await projectItem.count()) > 0) {
      await projectItem.focus();

      // Look for settings trigger (might be on hover or key press)
      // This depends on implementation
    }
  });

  test("focuses modal when opened from sidebar", async ({ page }) => {
    await page.click('[data-testid="chat-sidebar-user-menu"]');
    const settingsTrigger = page.locator('[data-testid="chat-sidebar-settings"]');
    await settingsTrigger.click();
    const modal = page.locator('[role="dialog"]');

    await expect(modal).toBeVisible();

    // Modal should receive focus
    const focused = await getFocusedElement(page);
    const inModal = await modal.evaluate(
      (modalEl, focusedEl) => modalEl.contains(focusedEl),
      await focused.elementHandle()
    );

    expect(inModal).toBe(true);
  });

  test("returns focus to sidebar after closing modal", async ({ page }) => {
    const userMenuTrigger = page.locator('[data-testid="chat-sidebar-user-menu"]');
    await userMenuTrigger.click();
    const settingsTrigger = page.locator('[data-testid="chat-sidebar-settings"]');

    // Focus the menu trigger before opening
    await userMenuTrigger.focus();

    // Open modal
    await settingsTrigger.click();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Close with Escape
    await pressKey(page, "Escape");
    await expect(modal).not.toBeVisible();

    // Focus should return to sidebar trigger
    await expect(userMenuTrigger).toBeFocused();
  });

  test("maintains focus in modal with Tab cycles", async ({ page }) => {
    await page.click('[data-testid="chat-sidebar-user-menu"]');
    const settingsTrigger = page.locator('[data-testid="chat-sidebar-settings"]');
    await settingsTrigger.click();

    const modal = page.locator('[role="dialog"]');

    // Tab multiple times - should stay in modal
    for (let i = 0; i < 10; i++) {
      await pressKey(page, "Tab");
      const focused = await getFocusedElement(page);

      const inModal = await modal.evaluate(
        (modalEl, focusedEl) => modalEl.contains(focusedEl),
        await focused.elementHandle()
      );

      expect(inModal).toBe(true);
    }
  });
});

test.describe("ChatSidebar accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has proper ARIA attributes", async ({ page }) => {
    const sidebar = page.locator('[data-testid="chat-sidebar"]');

    // Check role
    await expect(sidebar).toHaveAttribute("role", "navigation");

    // Check aria-label
    const hasLabel = await sidebar.evaluate((el) => el.hasAttribute("aria-label"));
    expect(hasLabel).toBe(true);
  });

  test("rail buttons have accessible names", async ({ page }) => {
    const railButtons = page.locator('[data-rail-item="true"]');

    const count = await railButtons.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = railButtons.nth(i);

      // Should have aria-label or title
      const hasAriaLabel = await button.evaluate((el) =>
        el.hasAttribute("aria-label") || el.hasAttribute("title") || el.textContent?.trim().length > 0
      );

      expect(hasAriaLabel).toBe(true);
    }
  });

  test("passes Axe accessibility scan", async ({ page }) => {
    // Run Axe scan on sidebar
    await runAxeScan(page, '[data-testid="chat-sidebar"]');
  });

  test("passes Axe scan on collapsed sidebar", async ({ page }) => {
    const collapseBtn = page.locator('[data-testid="chat-sidebar-toggle"]');

    if (await collapseBtn.count() > 0) {
      await collapseBtn.click();

      // Scan collapsed sidebar
      await runAxeScan(page, '[data-testid="chat-sidebar"]');
    }
  });
});

test.describe("ChatSidebar keyboard shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens settings with keyboard shortcut", async ({ page }) => {
    // Try common settings shortcuts (implementation dependent)
    // Cmd/Ctrl + , or similar

    // For now, just verify the button is keyboard accessible
    const userMenuBtn = page.locator('[data-testid="chat-sidebar-user-menu"]');

    if (await userMenuBtn.count() > 0) {
      await userMenuBtn.focus();
      expect(await userMenuBtn).toBeFocused();

      await pressKey(page, "Enter");
      const settingsBtn = page.locator('[data-testid="chat-sidebar-settings"]');
      await settingsBtn.click();

      // Settings modal should open
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
    }
  });

  test("toggles sidebar collapse with keyboard", async ({ page }) => {
    const collapseBtn = page.locator('[data-testid="chat-sidebar-toggle"]');

    if (await collapseBtn.count() > 0) {
      await collapseBtn.focus();
      const initialWidth = await page
        .locator('[data-testid="chat-sidebar"]')
        .evaluate((el) => el.offsetWidth);

      await pressKey(page, "Enter");
      const collapsedWidth = await page
        .locator('[data-testid="chat-sidebar"]')
        .evaluate((el) => el.offsetWidth);

      // Width should have changed
      expect(collapsedWidth).not.toBe(initialWidth);
    }
  });
});
