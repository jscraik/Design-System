#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const REQUIRED_FILES = [
  "README.md",
  "docs/README.md",
  "docs/guides/README.md",
  "docs/QUICK_START.md",
  "docs/guides/ONBOARDING_COMMAND_CENTER.md",
  "docs/guides/tasks/add-token.md",
  "docs/guides/tasks/ship-widget.md",
  "docs/guides/tasks/test-mcp-integration.md",
  "docs/guides/tasks/full-path-token-widget-mcp.md",
];

const REQUIRED_PATTERNS = {
  "README.md": [/ONBOARDING_COMMAND_CENTER\.md/, /onboarding/i],
  "docs/README.md": [/ONBOARDING_COMMAND_CENTER\.md/],
  "docs/guides/README.md": [/ONBOARDING_COMMAND_CENTER\.md/],
  "docs/QUICK_START.md": [/Status:\s*Redirecting\s+to\s+Onboarding\s+Command\s+Center/i],
};

const FORBIDDEN_PATTERNS = {
  "docs/QUICK_START.md": [/pnpm\s+test:mcp(?!-contract)\b/, /packages\/widgets\/dist\//],
};

async function read(relPath) {
  return readFile(path.join(ROOT, relPath), "utf8");
}

async function main() {
  const errors = [];

  for (const file of REQUIRED_FILES) {
    try {
      await read(file);
    } catch {
      errors.push(`Missing required onboarding file: ${file}`);
    }
  }

  for (const [file, patterns] of Object.entries(REQUIRED_PATTERNS)) {
    try {
      const content = await read(file);
      for (const pattern of patterns) {
        if (!pattern.test(content)) {
          errors.push(`Missing required pattern in ${file}: ${pattern}`);
        }
      }
    } catch {
      // existence already checked
    }
  }

  for (const [file, patterns] of Object.entries(FORBIDDEN_PATTERNS)) {
    try {
      const content = await read(file);
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          errors.push(`Forbidden onboarding drift pattern found in ${file}: ${pattern}`);
        }
      }
    } catch {
      // existence already checked
    }
  }

  if (errors.length > 0) {
    console.error("❌ Onboarding parity check failed:");
    for (const err of errors) console.error(`- ${err}`);
    process.exit(1);
  }

  console.log("✅ Onboarding parity check passed");
}

main().catch((error) => {
  console.error("Unexpected error in onboarding parity check:", error);
  process.exit(1);
});
