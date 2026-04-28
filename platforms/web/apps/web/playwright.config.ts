import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultPort = 5173;

function parseHost(value: string | undefined, fallback: string): string {
  const hostValue = (value ?? fallback).trim();
  if (!/^[A-Za-z0-9.-]+$/.test(hostValue)) {
    throw new Error(`Invalid Playwright web host: ${hostValue}`);
  }
  return hostValue;
}

function parsePort(value: string | undefined, fallback: number): number {
  const rawValue = value ?? String(fallback);
  const port = Number(rawValue);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid Playwright web port: ${rawValue}`);
  }
  return port;
}

const host = parseHost(process.env.PLAYWRIGHT_WEB_HOST, "127.0.0.1");
const webPort = parsePort(process.env.PLAYWRIGHT_WEB_PORT ?? process.env.PORT, defaultPort);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${webPort}`;
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
