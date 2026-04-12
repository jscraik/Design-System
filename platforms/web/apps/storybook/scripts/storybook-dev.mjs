import { spawn } from "node:child_process";
import path from "node:path";

const port = process.env.STORYBOOK_PORT ?? process.env.PORT ?? "6006";
const storybookBin = path.resolve(
  process.cwd(),
  "../../../../node_modules/storybook/dist/bin/dispatcher.js",
);
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

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
