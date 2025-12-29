import path from "node:path";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(__dirname, ".storybook"),
      tags: {
        include: ["autodocs"],
      },
    }),
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
});
