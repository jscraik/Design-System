import { spawn } from "node:child_process";
import { chromium } from "playwright";

const INSPECTOR_URL_PREFIX = "http://localhost:6274";
const SERVER_PORT = "8798";

function waitForLine(stream, matcher, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for: ${matcher}`));
    }, timeoutMs);

    const onData = (data) => {
      const text = data.toString();
      if (text.includes(matcher)) {
        clearTimeout(timeout);
        stream.off("data", onData);
        resolve(text);
      }
    };

    stream.on("data", onData);
  });
}

async function run() {
  const inspector = spawn(
    "npx",
    ["@modelcontextprotocol/inspector", "node", "enhanced-server.js"],
    {
      cwd: new URL("..", import.meta.url).pathname,
      env: {
        ...process.env,
        MCP_BIND_HOST: "127.0.0.1",
        PORT: SERVER_PORT,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  inspector.stdout.on("data", (data) => process.stdout.write(data.toString()));
  inspector.stderr.on("data", (data) => process.stderr.write(data.toString()));

  const tokenLinePromise = waitForLine(inspector.stdout, "Session token:");
  await waitForLine(inspector.stdout, "MCP Inspector is up and running");
  const tokenLine = await tokenLinePromise;
  const tokenMatch = tokenLine.match(/Session token:\s*([a-f0-9]+)/i);
  if (!tokenMatch) {
    throw new Error("Inspector auth token not found in output.");
  }
  const token = tokenMatch[1];

  const url = `${INSPECTOR_URL_PREFIX}/?MCP_PROXY_AUTH_TOKEN=${token}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector("#root", { timeout: 10000 });
  await page.waitForFunction(
    () => /Inspector|MCP|Tools/i.test(document.body.innerText),
    undefined,
    { timeout: 15000 },
  );

  await browser.close();
  inspector.kill("SIGINT");
}

run().catch((error) => {
  console.error("Inspector Playwright smoke test failed:", error);
  process.exitCode = 1;
});
