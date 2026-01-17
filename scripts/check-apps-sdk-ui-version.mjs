#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync } from "fs";

function readJsonFromGit(ref, path) {
  const raw = execSync(`git show ${ref}:${path}`, { encoding: "utf8" });
  return JSON.parse(raw);
}

const baseRefEnv = process.env.GITHUB_BASE_REF;
const baseRef = baseRefEnv ? `origin/${baseRefEnv}` : "HEAD~1";
const headPath = "packages/ui/package.json";

let baseVersion = null;
try {
  const basePkg = readJsonFromGit(baseRef, headPath);
  baseVersion = basePkg.dependencies?.["@openai/apps-sdk-ui"] ?? null;
} catch {
  baseVersion = null;
}

const headPkg = JSON.parse(readFileSync(headPath, "utf8"));
const headVersion = headPkg.dependencies?.["@openai/apps-sdk-ui"] ?? null;
const changed = baseVersion !== headVersion;

const output = process.env.GITHUB_OUTPUT;
if (output) {
  const line = `changed=${changed ? "true" : "false"}\n`;
  execSync(`printf '${line}' >> ${output}`);
}

console.log(
  `apps-sdk-ui version (base: ${baseVersion ?? "unknown"}, head: ${headVersion ?? "unknown"})`,
);
console.log(`apps-sdk-ui changed: ${changed ? "true" : "false"}`);
