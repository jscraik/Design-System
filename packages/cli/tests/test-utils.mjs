/**
 * Shared test utilities for CLI tests
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const cliPath = path.resolve(pkgRoot, "src/index.ts");

const baseEnv = {
  ...process.env,
  NO_COLOR: "1",
  TERM: "dumb",
};

/**
 * Run the CLI with given arguments
 * @param {string[]} args - Arguments to pass to the CLI
 * @param {Record<string, string>} envOverrides - Environment variable overrides
 * @returns {Promise<{code: number, stdout: string, stderr: string}>}
 */
export function runCli(args, envOverrides = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["--import", "tsx", cliPath, ...args], {
      cwd: pkgRoot,
      env: { ...baseEnv, ...envOverrides },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
    child.on("error", (err) => {
      resolve({ code: 1, stdout: "", stderr: err instanceof Error ? err.message : "spawn failed" });
    });
  });
}

export { cliPath, pkgRoot, baseEnv };
