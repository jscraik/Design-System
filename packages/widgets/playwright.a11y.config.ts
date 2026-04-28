import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";
import { parsePlaywrightHost, parsePlaywrightPort } from "./src/playwright-env.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultPort = 5174;

let baseURL: string;
let host: string;
let widgetsPort: number;

if (process.env.PLAYWRIGHT_BASE_URL) {
  baseURL = process.env.PLAYWRIGHT_BASE_URL;
  // Parse host/port only for display/logging purposes if needed, but we won't use them for webServer
  host = "127.0.0.1";
  widgetsPort = defaultPort;
} else {
  host = parsePlaywrightHost(process.env.PLAYWRIGHT_WIDGETS_HOST, "127.0.0.1", "widgets");
  widgetsPort = parsePlaywrightPort(process.env.PLAYWRIGHT_WIDGETS_PORT ?? process.env.PORT, defaultPort, "widgets");
  baseURL = `http://${host}:${widgetsPort}`;
}
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
      command: `pnpm dev --host ${host} --port ${widgetsPort} --strictPort`,
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
