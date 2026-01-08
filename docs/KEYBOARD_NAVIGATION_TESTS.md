# Keyboard Navigation & Accessibility Testing

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This document describes the keyboard navigation and accessibility tests for modal and sidebar components using Playwright and Axe-core.

## Table of contents

- [Test files](#test-files)
- [Running tests](#running-tests)
- [Test coverage](#test-coverage)
- [Test utilities](#test-utilities)
- [A11y test patterns](#a11y-test-patterns)

## Test Files

| Test File                                       | Description                       |
| ----------------------------------------------- | --------------------------------- |
| `platforms/web/apps/web/tests/keyboard-navigation.spec.ts`    | Modal keyboard navigation tests   |
| `platforms/web/apps/web/tests/sidebar-keyboard.spec.ts`       | Sidebar keyboard navigation tests |
| `packages/ui/src/testing/utils/keyboard-utils.ts` | Reusable test utilities           |

## Running Tests

### All Tests

```bash
# Run all E2E tests (includes keyboard nav)
pnpm test:e2e:web

# Run keyboard navigation tests only
pnpm exec playwright test -c platforms/web/apps/web/playwright.config.ts keyboard-navigation.spec.ts

# Run sidebar tests only
pnpm exec playwright test -c platforms/web/apps/web/playwright.config.ts sidebar-keyboard.spec.ts

# Run with UI (debug mode)
pnpm exec playwright test -c platforms/web/apps/web/playwright.config.ts keyboard-navigation.spec.ts --ui
```

### Specific Tests

```bash
# Modal tests only
pnpm exec playwright test -c platforms/web/apps/web/playwright.config.ts keyboard-navigation.spec.ts --grep "ModalDialog"

# Settings modal tests
pnpm exec playwright test -c platforms/web/apps/web/playwright.config.ts keyboard-navigation.spec.ts --grep "SettingsModal"

# Sidebar rail navigation
pnpm exec playwright test -c platforms/web/apps/web/playwright.config.ts sidebar-keyboard.spec.ts --grep "Collapsed Mode"
```

### Accessibility Tests

```bash
# Run all Axe-core accessibility tests
pnpm test:a11y:widgets

# Run specific accessibility test
pnpm exec playwright test -c platforms/web/apps/web/playwright.config.ts sidebar-keyboard.spec.ts --grep "accessibility"
```

## Test Coverage

### Modal Tests (`keyboard-navigation.spec.ts`)

**ModalDialog Focus Trap:**

- ✅ Focuses modal on open
- ✅ Tab cycles forward through focusable elements
- ✅ Shift+Tab cycles backward through focusable elements
- ✅ Escape key closes modal
- ✅ Overlay click closes modal
- ✅ Focus restoration to trigger on close
- ✅ ARIA attributes (role, aria-modal, aria-labelledby)
- ✅ Axe-core accessibility scan

**SettingsModal Navigation:**

- ✅ Tab through main sections
- ✅ Navigate into panels and back with Escape
- ✅ Toggle switches with Space/Enter
- ✅ Navigate dropdowns/segmented controls with arrow keys
- ✅ Axe-core accessibility scan

**IconPickerModal Navigation:**

- ✅ Navigate icon grid with arrow keys
- ✅ Select color and icon with keyboard
- ✅ Tab through controls
- ✅ Axe-core accessibility scan

**DiscoverySettingsModal Navigation:**

- ✅ Tab through form controls
- ✅ Operate range sliders with arrow keys
- ✅ Toggle switches with Space
- ✅ Axe-core accessibility scan

### Sidebar Tests (`sidebar-keyboard.spec.ts`)

**Expanded Mode:**

- ✅ Navigate main items with Tab
- ✅ Navigate project list with Tab
- ✅ Activate items with Enter/Space
- ✅ Navigate between sections with Tab

**Collapsed Mode (Rail):**

- ✅ Collapse/expand sidebar with keyboard
- ✅ Navigate rail buttons with arrow keys (Up/Down)
- ✅ Wrap around rail with arrow keys
- ✅ Show tooltip on rail button focus

**Modal Context:**

- ✅ Open project settings modal from sidebar
- ✅ Focus modal when opened from sidebar
- ✅ Return focus to sidebar after closing modal
- ✅ Maintain focus trap in modal with Tab cycles

**Accessibility:**

- ✅ Proper ARIA attributes (role="navigation", aria-label)
- ✅ Rail buttons have accessible names
- ✅ Axe-core accessibility scan (expanded)
- ✅ Axe-core accessibility scan (collapsed)

**Keyboard Shortcuts:**

- ✅ Open settings with keyboard
- ✅ Toggle sidebar collapse with keyboard

## Test Utilities

The `keyboard-utils.ts` file provides reusable helper functions:

### Focus Management

```ts
// Get currently focused element
const focused = await getFocusedElement(page);

// Press key with delay
await pressKey(page, "Tab", { delay: 100 });
```

### Focus Trap Testing

```ts
// Test Tab cycles within container
await testTabCycle(page, "[role='dialog']", { cycles: 2 });

// Test Shift+Tab cycles backward
await testShiftTabCycle(page, "[role='dialog']");

// Test focus doesn't escape container
await testFocusTrap(page, "[role='dialog']", "#trigger");
```

### Focus Restoration

```ts
// Test focus returns to trigger after closing
await testFocusRestoration(
  page,
  "[role='dialog']",
  "#trigger",
  "escape", // or "click"
);
```

### Arrow Key Navigation

```ts
// Test arrow navigation in lists
await testArrowNavigation(page, "[role='menu']", { wrap: true });

// Test Home/End keys
await testHomeEndKeys(page, "[role='menu']");
```

### Accessibility Testing

```ts
// Run Axe-core scan on element
await runAxeScan(page, "[role='dialog']");

// Run Axe-core scan with excluded rules
await runAxeScan(page, "[role='dialog']", {
  excludedRules: ["color-contrast"],
});

// Check ARIA attributes
await checkAriaAttributes(page, "[role='dialog']", {
  "aria-modal": "true",
  "aria-labelledby": "dialog-title",
});
```

## A11y Test Patterns

### 1. Focus Trap Verification

```ts
test("focus stays in modal", async ({ page }) => {
  await page.click("#open-modal");
  const modal = page.locator("[role='dialog']");

  // Tab many times - should never leave modal
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    const focused = await page.locator(":focus").first();

    const isInModal = await modal.evaluate(
      (modal, focused) => modal.contains(focused),
      await focused.elementHandle(),
    );

    expect(isInModal).toBe(true);
  }
});
```

### 2. Focus Restoration

```ts
test("focus returns to trigger", async ({ page }) => {
  const trigger = page.locator("#open-modal");

  // Store trigger reference
  await trigger.focus();
  const triggerId = await trigger.evaluate((el) => el.id);

  // Open and close modal
  await trigger.click();
  await page.keyboard.press("Escape");

  // Verify focus returned
  const focused = await page.locator(":focus").first();
  const focusedId = await focused.evaluate((el) => el?.id);

  expect(focusedId).toBe(triggerId);
});
```

### 3. Arrow Key Navigation

```ts
test("arrow keys navigate list", async ({ page }) => {
  const list = page.locator("[role='menu']");
  const firstItem = list.locator("[role='menuitem']").first();

  // Focus first item
  await firstItem.focus();

  // ArrowDown should move to next item
  await page.keyboard.press("ArrowDown");
  const focused = await page.locator(":focus").first();

  // Should be different item
  expect(await focused.evaluate((el) => el.textContent)).not.toBe(
    await firstItem.evaluate((el) => el.textContent),
  );
});
```

### 4. Axe-Core Integration

```ts
test("passes accessibility scan", async ({ page }) => {
  await page.goto("/modal");
  await page.click("#open-modal");

  // Run Axe scan
  await runAxeScan(page, "[role='dialog']");

  // Or use checkA11y from @axe-core/playwright
  await checkA11y(page, "[role='dialog']");
});
```

## WCAG 2.1 Compliance

These tests verify WCAG 2.1 Level AA compliance:

### Focus Visible (2.4.7)

- All interactive elements have visible focus indicator
- Focus indicator has contrast ratio ≥ 3:1

### Focus Order (2.4.3)

- Focus moves in logical order
- Tab/Shift+Tab follow predictable sequence

### Keyboard (2.1.1)

- All functionality available via keyboard
- No keyboard trap (except modals intentionally)
- Focus indicator always visible

### Modal Pattern (ARIA Authoring Practices)

- `role="dialog"` attribute present
- `aria-modal="true"` set
- `aria-labelledby` references title
- Focus trapped while open
- Focus restored to trigger on close
- Escape key closes modal

### Character Key Shortcuts (2.1.4)

- Turn off shortcut: Allow user to disable
- Remap shortcut: Allow user to change
- Active only on focus: Shortcut only works when element has focus

## Debugging Failed Tests

### Enable Browser DevTools

```bash
# Run with headed mode
npx playwright test keyboard-navigation.spec.ts --headed

# Run with debug mode (pauses execution)
npx playwright test keyboard-navigation.spec.ts --debug
```

### View Focus State

```ts
// Add debugging to see what's focused
test("debug focus", async ({ page }) => {
  await page.click("#open-modal");

  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");

    const focused = await page.locator(":focus").first();
    console.log(
      `Focus ${i}:`,
      await focused.evaluate((el) => ({
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        textContent: el.textContent?.slice(0, 50),
      })),
    );
  }
});
```

### Screenshot on Failure

```ts
test("with screenshot", async ({ page }) => {
  await page.click("#open-modal");

  // Screenshot on failure
  await expect(page.locator("[role='dialog']")).toBeVisible();

  // Or always screenshot
  await page.screenshot({ path: "modal-state.png" });
});
```

## Continuous Integration

These tests run in CI on every PR:

```yaml
# .github/workflows/test.yml
- name: Run E2E tests
  run: pnpm test:e2e

- name: Run accessibility tests
  run: pnpm test:a11y:widgets

- name: Upload test results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Related Documentation

- [Playwright Documentation](https://playwright.dev)
- [Axe-Core Documentation](https://www.deque.com/axe/)
- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Modal Boundaries](./MODAL_BOUNDARIES.md)

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

