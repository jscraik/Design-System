import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultPort = 5174;

function parseHost(value: string | undefined, fallback: string): string {
  const hostValue = (value ?? fallback).trim();
  if (!/^[A-Za-z0-9.-]+$/.test(hostValue)) {
    throw new Error(`Invalid Playwright widgets host: ${hostValue}`);
  }
  return hostValue;
}

function parsePort(value: string | undefined, fallback: number): number {
  const rawValue = value ?? String(fallback);
  const port = Number(rawValue);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid Playwright widgets port: ${rawValue}`);
  }
  return port;
}

const host = parseHost(process.env.PLAYWRIGHT_WIDGETS_HOST, "127.0.0.1");
const widgetsPort = parsePort(process.env.PLAYWRIGHT_WIDGETS_PORT ?? process.env.PORT, defaultPort);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${widgetsPort}`;
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
