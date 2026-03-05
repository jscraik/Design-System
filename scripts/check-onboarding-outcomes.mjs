#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const TASK_DOCS = {
  "docs/guides/tasks/add-token.md": {
    requiredHeadings: [
      "## Preconditions",
      "## Happy Path (15 minutes)",
      "## Validation",
      "## Fallback Path",
      "## Expected Output",
    ],
    requiredCommands: [/pnpm\s+generate:tokens/, /pnpm\s+validate:tokens/],
  },
  "docs/guides/tasks/ship-widget.md": {
    requiredHeadings: [
      "## Preconditions",
      "## Happy Path (15 minutes)",
      "## Validation",
      "## Fallback Path",
      "## Expected Output",
    ],
    requiredCommands: [/pnpm\s+build:widget/, /pnpm\s+build:widgets/],
  },
  "docs/guides/tasks/test-mcp-integration.md": {
    requiredHeadings: [
      "## Preconditions",
      "## Happy Path (15 minutes)",
      "## Validation",
      "## Fallback Path",
      "## Expected Output",
    ],
    requiredCommands: [/pnpm\s+test:mcp-contract/],
  },
  "docs/guides/tasks/full-path-token-widget-mcp.md": {
    requiredHeadings: [
      "## Preconditions",
      "## Happy Path (15 minutes)",
      "## Validation",
      "## Fallback Path",
      "## Expected Output",
    ],
    requiredCommands: [/pnpm\s+generate:tokens/, /pnpm\s+build:widget/, /pnpm\s+test:mcp-contract/],
  },
};

async function read(relPath) {
  return readFile(path.join(ROOT, relPath), "utf8");
}

async function main() {
  const errors = [];

  for (const [docPath, contract] of Object.entries(TASK_DOCS)) {
    let content = "";
    try {
      content = await read(docPath);
    } catch {
      errors.push(`Missing task route doc: ${docPath}`);
      continue;
    }

    for (const heading of contract.requiredHeadings) {
      if (!content.includes(heading)) {
        errors.push(`Missing heading  in ${docPath}`);
      }
    }

    for (const command of contract.requiredCommands) {
      if (!command.test(content)) {
        errors.push(`Missing expected command ${command} in ${docPath}`);
      }
    }
  }

  const commandCenter = await read("docs/guides/ONBOARDING_COMMAND_CENTER.md");
  for (const route of Object.keys(TASK_DOCS)) {
    const filename = route.split("/").at(-1);
    if (
      !commandCenter.includes(`./tasks/${filename}`) &&
      !commandCenter.includes(`/docs/guides/tasks/${filename}`)
    ) {
      errors.push(`Command center is missing link to ${route}`);
    }
  }

  if (errors.length > 0) {
    console.error("❌ Onboarding outcome check failed:");
    for (const err of errors) console.error(`- ${err}`);
    process.exit(1);
  }

  console.log("✅ Onboarding outcome check passed");
}

main().catch((error) => {
  console.error("Unexpected error in onboarding outcome check:", error);
  process.exit(1);
});
