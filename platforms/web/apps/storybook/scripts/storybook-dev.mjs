import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const port = process.env.STORYBOOK_PORT ?? process.env.PORT ?? "6006";
const storybookBin = require.resolve("storybook/dist/bin/dispatcher.js");
const args = [storybookBin, "dev", "-p", String(port), "-c", ".storybook"];

const child = spawn("node", args, {
  stdio: "inherit",
});

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("exit", (code, signal) => {
  if (code !== null) {
    process.exit(code);
  }
  if (signal !== null) {
    process.exit(1);
  }
  process.exit(0);
});