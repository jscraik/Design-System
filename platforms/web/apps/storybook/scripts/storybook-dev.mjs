import { spawn } from "node:child_process";

const port = process.env.STORYBOOK_PORT ?? process.env.PORT ?? "6006";
const args = ["exec", "storybook", "dev", "-p", String(port), "-c", ".storybook"];

const child = spawn("pnpm", args, {
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
