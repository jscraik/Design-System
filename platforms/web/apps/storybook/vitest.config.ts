import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const _dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const argosStorybookPackageJson = require.resolve("@argos-ci/storybook/package.json");
const argosStorybookRoot = path.dirname(argosStorybookPackageJson);
const argosVitestPluginUrl = pathToFileURL(
  path.join(argosStorybookRoot, "dist", "vitest-plugin.js"),
).href;
const argosVitestSetupFilePath = path.join(argosStorybookRoot, "dist", "vitest-setup-file.js");
const { argosVitestPlugin } = await import(argosVitestPluginUrl);
const enableArgosVitest =
  process.env.ARGOS_VITEST === "1" || process.env.ARGOS_VITEST === "true" || !!process.env.CI;
const enableBrowser = process.env.STORYBOOK_BROWSER_TESTS === "1";

const storybookProject = {
  extends: true,
  plugins: [
    storybookTest({ configDir: ".storybook" }),
    ...(enableArgosVitest
      ? [
          argosVitestPlugin({
            uploadToArgos: !!process.env.CI,
            token: process.env.ARGOS_TOKEN,
          }),
        ]
      : []),
  ],
  test: {
    name: "storybook",
    // When disabled, set enabled: false to ensure project exists but browser tests don't run
    ...(enableBrowser
      ? {
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            api: {
              host: "127.0.0.1",
              port: Number(process.env.VITEST_BROWSER_PORT ?? 63315),
              strictPort: false,
            },
          },
        }
      : {
          browser: {
            enabled: false,
          },
        }),
    setupFiles: [".storybook/vitest.setup.ts"],
  },
};

export default defineConfig({
  resolve: {
    alias: {
      "@argos-ci/storybook/internal/vitest-setup-file": argosVitestSetupFilePath,
    },
  },
  test: {
    passWithNoTests: true,
    // Browser mode is controlled within the project config above
    projects: [storybookProject],
  },
});
