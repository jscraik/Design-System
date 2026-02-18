import { expect, test } from "@playwright/test";

/**
 * Visual regression tests for main pages.
 * These tests capture screenshots and compare against baseline images.
 *
 * To update snapshots: pnpm test:visual:web --update-snapshots
 */

test.describe("Page Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts to load
    await page.waitForLoadState("networkidle");
  });

  test("chat page - default state", async ({ page }) => {
    await page.goto("/");
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("chat-page-default.png", {
      fullPage: true,
    });
  });

  test("chat page - with sidebar open", async ({ page }) => {
    await page.goto("/");
    // Open sidebar if closed
    const sidebarToggle = page.getByRole("button", { name: /sidebar/i }).first();
    const toggleLabel =
      (await sidebarToggle.getAttribute("title")) ??
      (await sidebarToggle.getAttribute("aria-label")) ??
      "";
    if (/expand sidebar/i.test(toggleLabel)) {
      await sidebarToggle.click();
      await page.waitForTimeout(300);
    }
    await expect(page).toHaveScreenshot("chat-page-sidebar-open.png", {
      fullPage: true,
    });
  });

  test("settings page", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("settings-page.png", {
      fullPage: true,
    });
  });

  test("profile page", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("profile-page.png", {
      fullPage: true,
    });
  });

  test("about page", async ({ page }) => {
    await page.goto("/about");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("about-page.png", {
      fullPage: true,
    });
  });

  test("harness page", async ({ page }) => {
    await page.goto("/harness");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("harness-page.png", {
      fullPage: true,
    });
  });
});

test.describe("Component Visual Regression", () => {
  test("chat input - empty state", async ({ page }) => {
    await page.goto("/");
    const chatInput = page.locator("[data-testid='chat-input'], .chat-input, form").first();
    if (await chatInput.isVisible()) {
      await expect(chatInput).toHaveScreenshot("chat-input-empty.png");
    }
  });

  test("chat input - with text", async ({ page }) => {
    await page.goto("/");
    const textarea = page.locator("textarea").first();
    if (await textarea.isVisible()) {
      await textarea.fill("Hello, this is a test message");
      await expect(textarea.locator("..").locator("..")).toHaveScreenshot(
        "chat-input-with-text.png",
      );
    }
  });
});

test.describe("Responsive Visual Regression", () => {
  test("chat page - mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("chat-page-mobile.png", {
      fullPage: true,
    });
  });

  test("chat page - tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("chat-page-tablet.png", {
      fullPage: true,
    });
  });
});

test.describe("Theme Visual Regression", () => {
  test("chat page - dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("chat-page-dark.png", {
      fullPage: true,
    });
  });

  test("chat page - light mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("chat-page-light.png", {
      fullPage: true,
    });
  });
});
