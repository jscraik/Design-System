#!/usr/bin/env tsx
/**
 * DesignStudio Import Migration Script
 *
 * Migrates all import statements from @astudio/* to @design-studio/*
 *
 * Usage:
 *   npx tsx scripts/migration/migrate-imports.ts [--apply] [--dry-run] [--verbose]
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

interface Options {
  apply: boolean;
  dryRun: boolean;
  verbose: boolean;
  path?: string;
}

// Migration mapping
const MIGRATIONS = {
  "@astudio/ui": "@design-studio/ui",
  "@astudio/runtime": "@design-studio/runtime",
  "@astudio/tokens": "@design-studio/tokens",
  "@astudio/icons": "@design-studio/ui/icons",
} as const;

// Files to ignore
const IGNORE_PATTERNS = [
  "node_modules",
  "dist",
  "build",
  ".git",
  "packages/design-studio-*",
  "scripts/migration",
  ".spec",
  "coverage",
];

function shouldIgnoreFile(filePath: string): boolean {
  return IGNORE_PATTERNS.some((pattern) => filePath.includes(pattern));
}

function getAllFiles(dir: string, extensions: string[] = [".ts", ".tsx", ".js", ".jsx"]): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        if (!shouldIgnoreFile(fullPath)) {
          files.push(...getAllFiles(fullPath, extensions));
        }
      } else if (extensions.includes(extname(entry))) {
        if (!shouldIgnoreFile(fullPath)) {
          files.push(fullPath);
        }
      }
    }
  } catch (_error) {
    // Directory doesn't exist or isn't accessible
  }

  return files;
}

function migrateImports(
  content: string,
  _filePath: string,
): { changed: boolean; content: string; changes: string[] } {
  let newContent = content;
  const changes: string[] = [];
  let changed = false;

  for (const [from, to] of Object.entries(MIGRATIONS)) {
    const regex = new RegExp(`from ['"](${from})`, "g");
    const matches = content.match(regex);

    if (matches) {
      newContent = newContent.replace(regex, `from '${to}'`);
      changes.push(
        `  ${from} → ${to} (${matches.length} occurrence${matches.length > 1 ? "s" : ""})`,
      );
      changed = true;
    }
  }

  return { changed, content: newContent, changes };
}

function main() {
  const args = process.argv.slice(2);
  const options: Options = {
    apply: args.includes("--apply"),
    dryRun: args.includes("--dry-run") || !args.includes("--apply"),
    verbose: args.includes("--verbose"),
  };

  const basePath = process.cwd();
  const files = getAllFiles(basePath);

  console.log(`🔍 Found ${files.length} files to check\n`);

  let totalChanged = 0;
  const changedFiles: string[] = [];

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const result = migrateImports(content, file);

    if (result.changed) {
      totalChanged++;
      changedFiles.push(file);

      const relativePath = relative(basePath, file);
      console.log(`✓ ${relativePath}`);

      if (options.verbose && result.changes.length > 0) {
        result.changes.forEach((change) => console.log(change));
      }

      if (options.apply) {
        writeFileSync(file, result.content, "utf-8");
      }
    }
  }

  console.log(`\n${options.dryRun ? "Dry run results:" : "Migration complete:"}`);
  console.log(`  Files checked: ${files.length}`);
  console.log(`  Files to change: ${totalChanged}`);

  if (options.dryRun && totalChanged > 0) {
    console.log(`\n⚠️  This was a dry run. To apply changes, run with --apply`);
  }

  if (totalChanged === 0) {
    console.log(`\n✨ No imports need migration!`);
  }
}

main();
