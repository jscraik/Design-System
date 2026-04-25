import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const hasWorkingSharp = (() => {
  try {
    require("sharp");
    return true;
  } catch {
    return false;
  }
})();
const hasArgosReporter = (() => {
  try {
    require("@argos-ci/playwright/reporter");
    return true;
  } catch {
    return false;
  }
})();
const shouldUploadToArgos = !!process.env.CI && !!process.env.ARGOS_TOKEN && hasArgosReporter;
const runFullMatrix =
  process.env.PLAYWRIGHT_VISUAL_FULL_MATRIX === "1" ||
  process.env.PLAYWRIGHT_VISUAL_FULL_MATRIX === "true";
const baseReporter = hasWorkingSharp
  ? ([["html", { outputFolder: "playwright-report/visual" }]] as const)
  : ([["line"]] as const);
const reporter = [
  ...baseReporter,
  ...(shouldUploadToArgos
    ? ([
        [
          "@argos-ci/playwright/reporter",
          {
            uploadToArgos: true,
            token: process.env.ARGOS_TOKEN,
          },
        ],
      ] as const)
    : []),
];

/**
 * Visual regression testing configuration for the web app.
 * Uses Playwright's screenshot comparison for detecting visual changes.
 */
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter,

  // Snapshot configuration
  snapshotDir: "./tests/visual/__snapshots__",
  snapshotPathTemplate: "{snapshotDir}/{testFilePath}/{projectName}/{arg}{ext}",

  expect: {
    // Visual comparison settings
    toHaveScreenshot: {
      // Allow small Chromium renderer variance between local and GitHub macOS runners.
      maxDiffPixelRatio: 0.01,
      // Threshold for color difference (0-1)
      threshold: 0.2,
      // Animation handling
      animations: "disabled",
    },
  },

  use: {
    baseURL: "http://127.0.0.1:5176",
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
    ...(runFullMatrix
      ? [
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
          },
          {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
          },
          // Mobile viewports
          {
            name: "mobile-chrome",
            use: { ...devices["Pixel 5"] },
          },
          {
            name: "mobile-safari",
            use: { ...devices["iPhone 12"] },
          },
        ]
      : []),
  ],

  webServer: {
    command: "pnpm dev --host 127.0.0.1 --port 5176 --strictPort",
    url: "http://127.0.0.1:5176",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    cwd: __dirname,
  },
});
