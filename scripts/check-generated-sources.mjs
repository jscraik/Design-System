#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const GENERATED_SOURCE_FILES = [
  "platforms/web/apps/web/TEMPLATE_REGISTRY.json",
  "platforms/web/apps/web/TEMPLATE_REGISTRY.md",
  "platforms/web/apps/web/src/generated/template-registry.ts",
  "packages/widgets/src/sdk/generated/widget-manifest.js",
  "packages/cloudflare-template/src/worker/widget-manifest.generated.ts",
];

const steps = [
  {
    label: "regenerate web template registry",
    command: ["pnpm", "-C", "platforms/web/apps/web", "registry:generate"],
  },
  {
    label: "regenerate widget build manifest",
    command: ["pnpm", "-C", "packages/widgets", "build"],
  },
  {
    label: "regenerate Cloudflare worker manifest",
    command: ["pnpm", "-C", "packages/cloudflare-template", "run", "prebuild"],
  },
  {
    label: "format generated source",
    command: [
      "pnpm",
      "dlx",
      "@biomejs/biome@2.3.11",
      "format",
      "--write",
      "platforms/web/apps/web/TEMPLATE_REGISTRY.json",
      "platforms/web/apps/web/src/generated/template-registry.ts",
      "packages/widgets/src/sdk/generated/widget-manifest.js",
      "packages/cloudflare-template/src/worker/widget-manifest.generated.ts",
    ],
  },
];

function snapshotGeneratedSources() {
  return new Map(
    GENERATED_SOURCE_FILES.map((filePath) => [
      filePath,
      existsSync(filePath) ? readFileSync(filePath, "utf8") : null,
    ]),
  );
}

function runStep({ label, command }) {
  console.log(`generated-source: ${label}`);
  console.log(`  command: ${command.join(" ")}`);

  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    console.error(`generated-source: ${label} failed with exit code ${result.status ?? 1}`);
    process.exit(result.status ?? 1);
  }
}

const before = snapshotGeneratedSources();

for (const step of steps) {
  runStep(step);
}

const after = snapshotGeneratedSources();
const changed = GENERATED_SOURCE_FILES.filter(
  (filePath) => before.get(filePath) !== after.get(filePath),
);

if (changed.length > 0) {
  console.error("generated-source: tracked generated-source files were stale:");
  for (const filePath of changed) {
    console.error(`  - ${filePath}`);
  }
  console.error(
    "generated-source: review the regenerated files, then rerun `pnpm generated-source:check`.",
  );
  process.exit(1);
}

console.log("generated-source: ok");
