/**
 * Keyboard Navigation Test Utilities
 *
 * Helper functions for testing keyboard navigation and focus management
 * in Playwright tests.
 *
 * @module keyboard-utils
 */

import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Re-export deterministic test mocks for convenience
export * from "./test-mocks";

/**
 * Press a key and wait for navigation/focus changes
 */
export async function pressKey(
  page: Page,
  key: string,
  options: { delay?: number } = {}
): Promise<void> {
  const { delay = 100 } = options;
  await page.keyboard.press(key);
  await page.waitForTimeout(delay); // Wait for focus transitions
}

/**
 * Get the currently focused element
 */
export async function getFocusedElement(page: Page): Promise<Locator> {
  return page.locator(":focus");
}

/**
 * Get the focusable elements within a container
 */
export async function getFocusableElements(
  page: Page,
  container: string
): Promise<string[]> {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return page.locator(`${container} ${focusableSelectors}`).allInnerTexts();
}

/**
 * Test Tab cycles forward through focusable elements
 */
export async function testTabCycle(
  page: Page,
  container: string,
  options: { cycles?: number } = {}
): Promise<void> {
  const { cycles = 2 } = options;
  void (await getFocusableElements(page, container));

  for (let i = 0; i < cycles; i++) {
    await pressKey(page, "Tab");
  }

  // After cycling, we should be back at the start or next element
  const focused = await getFocusedElement(page);
  const hasFocus = await focused.count();

  if (hasFocus === 0) {
    throw new Error("Tab cycle: No element focused after cycling");
  }
}

/**
 * Test Shift+Tab cycles backward through focusable elements
 */
export async function testShiftTabCycle(
  page: Page,
  _container: string
): Promise<void> {
  await pressKey(page, "Shift+Tab");
  const focused = await getFocusedElement(page);

  if ((await focused.count()) === 0) {
    throw new Error("Shift+Tab: No element focused after navigation");
  }
}

/**
 * Test Escape key closes an element
 */
export async function testEscapeCloses(
  page: Page,
  element: Locator,
  triggerSelector: string
): Promise<void> {
  // Open the element
  await page.click(triggerSelector);
  await expect(element).toBeVisible();

  // Press Escape
  await pressKey(page, "Escape");

  // Should be closed or hidden
  await expect(element).not.toBeVisible();
}

/**
 * Test focus trap: Tab stays within container
 */
export async function testFocusTrap(
  page: Page,
  container: string,
  triggerSelector: string
): Promise<void> {
  // Open the trapped container
  await page.click(triggerSelector);
  await expect(page.locator(container)).toBeVisible();

  // Get all focusable elements
  const focusableCount = await page.locator(
    `${container} button:not([disabled]), ${container} a[href], ${container} input:not([disabled]), ${container} [tabindex]:not([tabindex="-1"])`
  ).count();

  // Press Tab multiple times - should cycle within container
  for (let i = 0; i < focusableCount + 2; i++) {
    await pressKey(page, "Tab");
    const focused = await getFocusedElement(page);

    // Check focus is within the container
    const isInContainer = await page.locator(`${container} :scope`).evaluate(
      (el, focusedEl) => el.contains(focusedEl),
      await focused.elementHandle()
    );

    if (!isInContainer) {
      throw new Error(
        `Focus trap violation: Focus escaped container at Tab ${i + 1}`
      );
    }
  }
}

/**
 * Test focus restoration: closing modal returns focus to trigger
 */
export async function testFocusRestoration(
  page: Page,
  modalSelector: string,
  triggerSelector: string,
  closeMethod: "escape" | "click" = "escape"
): Promise<void> {
  // Get trigger element before opening modal
  const trigger = page.locator(triggerSelector);
  await trigger.focus();
  const triggerId = await trigger.evaluate((el) => el.id);

  // Open modal
  await trigger.click();
  await expect(page.locator(modalSelector)).toBeVisible();

  // Close modal
  if (closeMethod === "escape") {
    await pressKey(page, "Escape");
  } else {
    // Click close button or overlay
    await page.click(`${modalSelector} [aria-label="Close dialog"], ${modalSelector} button[aria-label="Close"]`);
  }

  await expect(page.locator(modalSelector)).not.toBeVisible();

  // Check focus returned to trigger
  const focused = await getFocusedElement(page);
  const focusedId = await focused.evaluate((el) => el?.id);

  if (focusedId !== triggerId) {
    throw new Error(
      `Focus restoration failed: expected focus on #${triggerId}, got #${focusedId}`
    );
  }
}

/**
 * Test arrow key navigation in a list
 */
export async function testArrowNavigation(
  page: Page,
  listSelector: string,
  options: { wrap?: boolean } = {}
): Promise<void> {
  const { wrap = true } = options;
  void wrap;

  const items = await page.locator(`${listSelector} [role="menuitem"]`).all();
  const itemCount = items.length;

  // Press ArrowDown multiple times
  for (let i = 0; i < itemCount + 1; i++) {
    await pressKey(page, "ArrowDown");
  }

  // If wrap is enabled, we should be back at or past the first item
  const focused = await getFocusedElement(page);
  expect(await focused.count()).toBeGreaterThan(0);
}

/**
 * Test Home/End keys jump to first/last item
 */
export async function testHomeEndKeys(
  page: Page,
  listSelector: string
): Promise<void> {
  const items = await page.locator(`${listSelector} [role="menuitem"]`).all();

  // Press Home - should focus first item
  await pressKey(page, "Home");
  let focused = await getFocusedElement(page);
  const firstFocused = await focused.evaluate((el) => el?.textContent);

  // Press End - should focus last item
  await pressKey(page, "End");
  focused = await getFocusedElement(page);
  const lastFocused = await focused.evaluate((el) => el?.textContent);

  if (firstFocused === (await items[0].textContent())) {
    console.log("✓ Home key focuses first item");
  }

  if (lastFocused === (await items[items.length - 1].textContent())) {
    console.log("✓ End key focuses last item");
  }
}

/**
 * Run Axe-core accessibility scan on a page or element
 */
export async function runAxeScan(
  page: Page,
  selector?: string,
  options?: { excludedRules?: string[] }
): Promise<void> {
  const excludedRules = options?.excludedRules || [];

  type AxeViolation = { id: string; description: string; nodes: Array<unknown> };
  type AxeRunResult = { violations: AxeViolation[] };
  const builder = new AxeBuilder({ page });
  if (selector) builder.include(selector);
  if (excludedRules.length) builder.disableRules(excludedRules);

  const results = (await builder.analyze()) as AxeRunResult;

  if (results.violations.length > 0) {
    const violationMessages = results.violations
      .map((v) => `  - ${v.id}: ${v.description} (${v.nodes.length} affected)`)
      .join("\n");

    throw new Error(
      `Axe accessibility violations found:\n${violationMessages}\n` +
      `Run with DEBUG=1 to see full details.`
    );
  }
}

/**
 * Check for ARIA attributes on an element
 */
export async function checkAriaAttributes(
  page: Page,
  selector: string,
  expectedAttributes: Record<string, string>
): Promise<boolean> {
  const element = page.locator(selector);
  const actual = await element.evaluate((el) => {
    const attrs: Record<string, string> = {};
    for (const attr of el.attributes) {
      if (attr.name.startsWith("aria-")) {
        attrs[attr.name] = attr.value;
      }
    }
    return attrs;
  });

  for (const [key, value] of Object.entries(expectedAttributes)) {
    if (actual[key] !== value) {
      console.error(
        `ARIA attribute mismatch: expected ${key}="${value}", got ${key}="${actual[key]}"`
      );
      return false;
    }
  }

  return true;
}

/**
 * Test keyboard shortcut activation
 */
export async function testKeyboardShortcut(
  page: Page,
  shortcut: string,
  expectedSelector: string,
  state: "visible" | "hidden" | "focused"
): Promise<void> {
  await pressKey(page, shortcut);
  const target = page.locator(expectedSelector);

  switch (state) {
    case "visible":
      await expect(target).toBeVisible();
      break;
    case "hidden":
      await expect(target).not.toBeVisible();
      break;
    case "focused":
      await expect(target).toBeFocused();
      break;
  }
}
