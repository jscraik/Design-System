import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultPort = 5174;
const widgetsPort = Number(process.env.PLAYWRIGHT_WIDGETS_PORT ?? process.env.PORT ?? defaultPort);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${widgetsPort}`;
const webServerURL = new URL("/chat-view", baseURL).toString();
const reuseExistingServer =
  process.env.PLAYWRIGHT_REUSE_SERVER === "1" ||
  process.env.PLAYWRIGHT_REUSE_SERVER === "true" ||
  !process.env.CI;

const webServer = process.env.PLAYWRIGHT_BASE_URL
  ? {
      url: webServerURL,
      reuseExistingServer: true,
      timeout: 120_000,
    }
  : {
      command: `pnpm dev --port ${widgetsPort} --strictPort`,
      url: webServerURL,
      reuseExistingServer,
      timeout: 120_000,
      cwd: path.join(__dirname),
    };

export default defineConfig({
  testDir: path.join(__dirname, "tests"),
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer,
});
