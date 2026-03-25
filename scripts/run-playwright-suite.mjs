import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const suite = process.argv[2];
const extraArgs = process.argv[3] === "--" ? process.argv.slice(4) : process.argv.slice(3);

const suiteConfigs = {
  "web-visual": {
    label: "web visual tests",
    browser: "chromium",
    prebuild: ["pnpm", "-C", "packages/ui", "build:visual"],
    command: [
      "pnpm",
      "exec",
      "playwright",
      "test",
      "-c",
      "platforms/web/apps/web/playwright.visual.config.ts",
    ],
  },
  "storybook-visual": {
    label: "storybook visual tests",
    browser: "chromium",
    prebuild: ["pnpm", "-C", "packages/ui", "build:visual"],
    command: [
      "pnpm",
      "exec",
      "playwright",
      "test",
      "-c",
      "platforms/web/apps/storybook/playwright.visual.config.ts",
    ],
  },
};

if (!suite || !(suite in suiteConfigs)) {
  console.error(
    `Unknown or missing Playwright suite "${suite ?? ""}". Expected one of: ${Object.keys(
      suiteConfigs,
    ).join(", ")}`,
  );
  process.exit(1);
}

const selectedSuite = suiteConfigs[suite];
const shouldSkipBrowserCheck = extraArgs.includes("--list") || extraArgs.includes("--help");

function runCommand(command, label) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    console.error(`FAIL: ${label}`);
    process.exit(result.status ?? 1);
  }
}

async function ensureBrowserAvailable(browserName) {
  const playwright = await import("playwright");
  const browserType = playwright[browserName];
  const executablePath = browserType?.executablePath?.();

  if (!executablePath || existsSync(executablePath)) {
    return;
  }

  console.error(`FAIL: ${selectedSuite.label} browser preflight`);
  console.error(`Missing Playwright ${browserName} executable: ${executablePath}`);
  console.error("Remediation: pnpm exec playwright install chromium");
  process.exit(1);
}

if (!shouldSkipBrowserCheck && selectedSuite.browser) {
  await ensureBrowserAvailable(selectedSuite.browser);
}

runCommand(selectedSuite.prebuild, `${selectedSuite.label} prebuild`);
runCommand([...selectedSuite.command, ...extraArgs], selectedSuite.label);
