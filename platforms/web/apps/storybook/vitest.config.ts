import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));
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

export default defineConfig({
  resolve: {
    alias: {
      "@argos-ci/storybook/internal/vitest-setup-file": argosVitestSetupFilePath,
    },
  },
  test: {
    projects: [
      {
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
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
