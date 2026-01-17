import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Visual regression testing configuration for Storybook.
 * Tests component stories in isolation for faster visual regression detection.
 */
const defaultPort = 6006;
const storybookPort = Number(
  process.env.PLAYWRIGHT_STORYBOOK_PORT ??
    process.env.STORYBOOK_PORT ??
    process.env.PORT ??
    defaultPort,
);
const baseURL = process.env.PLAYWRIGHT_STORYBOOK_BASE_URL ?? `http://localhost:${storybookPort}`;
const reuseExistingServer =
  process.env.PLAYWRIGHT_REUSE_SERVER === "1" ||
  process.env.PLAYWRIGHT_REUSE_SERVER === "true" ||
  !process.env.CI;
export default defineConfig({
  testDir: ".",
  testMatch: "storybook-visual.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report/visual" }],
    [
      "@argos-ci/playwright/reporter",
      {
        uploadToArgos: !!process.env.CI,
        token: process.env.ARGOS_TOKEN,
      },
    ],
  ],

  // Snapshot configuration
  snapshotDir: "./tests/visual/__snapshots__",
  snapshotPathTemplate: "{snapshotDir}/{testFilePath}/{projectName}/{arg}{ext}",

  expect: {
    // Visual comparison settings
    toHaveScreenshot: {
      // Allow 0.1% pixel difference for anti-aliasing
      maxDiffPixelRatio: 0.001,
      // Threshold for color difference (0-1)
      threshold: 0.2,
      // Animation handling
      animations: "disabled",
    },
  },

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Consistent viewport for screenshots
    viewport: { width: 1280, height: 720 },
    // Disable animations for consistent screenshots
    actionTimeout: 10000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Dark mode variant
    {
      name: "chromium-dark",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "dark",
      },
    },
  ],

  webServer: process.env.PLAYWRIGHT_STORYBOOK_BASE_URL
    ? {
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120000,
      }
    : {
        command: `pnpm exec storybook dev -p ${storybookPort}`,
        url: baseURL,
        reuseExistingServer,
        timeout: 120000,
        cwd: __dirname,
      },
});
