import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";
import { parsePlaywrightHost, parsePlaywrightPort } from "../../../../packages/widgets/src/playwright-env.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultPort = 5173;

let baseURL: string;
let host: string;
let webPort: number;

if (process.env.PLAYWRIGHT_BASE_URL) {
  baseURL = process.env.PLAYWRIGHT_BASE_URL;
  // Parse host/port only for display/logging purposes if needed, but we won't use them for webServer
  host = "127.0.0.1";
  webPort = defaultPort;
} else {
  host = parsePlaywrightHost(process.env.PLAYWRIGHT_WEB_HOST, "127.0.0.1", "web");
  webPort = parsePlaywrightPort(process.env.PLAYWRIGHT_WEB_PORT ?? process.env.PORT, defaultPort, "web");
  baseURL = `http://${host}:${webPort}`;
}
const reuseExistingServer =
  process.env.PLAYWRIGHT_REUSE_SERVER === "1" ||
  process.env.PLAYWRIGHT_REUSE_SERVER === "true" ||
  !process.env.CI;

const webServer = process.env.PLAYWRIGHT_BASE_URL
  ? {
      url: baseURL,
      reuseExistingServer: true,
      timeout: 180_000,
    }
  : {
      command: `pnpm dev --host ${host} --port ${webPort} --strictPort`,
      url: baseURL,
      reuseExistingServer,
      timeout: 180_000,
      cwd: path.join(__dirname),
    };

export default defineConfig({
  testDir: path.join(__dirname, "tests"),
  testIgnore: ["**/visual/**", "**/template-preview-resilience.test.mjs"],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer,
});
