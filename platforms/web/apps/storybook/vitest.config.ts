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
const appsSdkIconMockPath = path.join(_dirname, ".storybook", "mocks", "apps-sdk-ui-icon.tsx");
const appsSdkObjectIconMockPath = path.join(
  _dirname,
  ".storybook",
  "mocks",
  "apps-sdk-ui-object-icon.tsx",
);
const { argosVitestPlugin } = await import(argosVitestPluginUrl);
const enableArgosVitest =
  process.env.ARGOS_VITEST === "1" || process.env.ARGOS_VITEST === "true" || !!process.env.CI;

function appsSdkObjectIconWorkaround() {
  return {
    name: "apps-sdk-object-icon-workaround",
    enforce: "pre" as const,
    resolveId(source: string, importer: string | undefined) {
      if (
        source === "./svg/Object" &&
        importer?.includes("@openai/apps-sdk-ui/dist/es/components/Icon/index.js")
      ) {
        return appsSdkObjectIconMockPath;
      }

      if (
        source.endsWith("/components/Icon/svg/Object") ||
        source.endsWith("/components/Icon/svg/Object.js") ||
        source.endsWith("/components/Icon/svg/Object.tsx")
      ) {
        return appsSdkObjectIconMockPath;
      }

      return null;
    },
  };
}

const storybookProject = {
  extends: true,
  plugins: [
    appsSdkObjectIconWorkaround(),
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
    server: {
      deps: {
        external: ["@openai/apps-sdk-ui"],
      },
    },
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
};

export default defineConfig({
  optimizeDeps: {
    include: [
      "@storybook/addon-docs",
      "@storybook/addon-a11y",
      "@storybook/addon-docs/blocks",
      "@radix-ui/react-visually-hidden",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-portal",
      "@radix-ui/react-presence",
      "@radix-ui/react-dismissable-layer",
      "@radix-ui/react-focus-scope",
      "@radix-ui/react-focus-guards",
    ],
  },

  resolve: {
    alias: {
      "@argos-ci/storybook/internal/vitest-setup-file": argosVitestSetupFilePath,
      "@openai/apps-sdk-ui/components/Icon": appsSdkIconMockPath,
    },
  },
  test: {
    passWithNoTests: true,
    projects: [storybookProject],
  },
});
