import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

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
const runFullMatrix =
  process.env.PLAYWRIGHT_VISUAL_FULL_MATRIX === "1" ||
  process.env.PLAYWRIGHT_VISUAL_FULL_MATRIX === "true";
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
export default defineConfig({
  testDir: ".",
  testMatch: "storybook-visual.spec.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  // The protected settings exemplar slice is sequential and can run hot late in the dark-theme sweep.
  // Give it extra headroom so the gate reflects real regressions instead of long-run starvation.
  timeout: 90000,
  reporter,

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
        ]
      : []),
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
