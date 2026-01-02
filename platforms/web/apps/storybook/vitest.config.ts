import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
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
