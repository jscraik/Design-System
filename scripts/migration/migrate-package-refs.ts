#!/usr/bin/env tsx
/**
 * DesignStudio Package Reference Migration Script
 *
 * Updates package.json files to reference @design-studio/* packages
 *
 * Usage:
 *   npx tsx scripts/migration/migrate-package-refs.ts [--apply] [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface Options {
  apply: boolean;
  dryRun: boolean;
  verbose: boolean;
}

// Migration mapping for package.json
const PACKAGE_MIGRATIONS = {
  "@astudio/ui": "@design-studio/ui",
  "@astudio/runtime": "@design-studio/runtime",
  "@astudio/tokens": "@design-studio/tokens",
  "@astudio/icons": "@design-studio/ui", // Icons merged into ui
} as const;

function getAllPackageJsonFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        if (entry !== "node_modules" && entry !== ".git" && !entry.startsWith("design-studio-")) {
          files.push(...getAllPackageJsonFiles(fullPath));
        }
      } else if (entry === "package.json") {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or isn't accessible
  }

  return files;
}

function migratePackageJson(
  content: string,
  filePath: string,
): {
  changed: boolean;
  content: string;
  changes: string[];
} {
  const pkg: PackageJson = JSON.parse(content);
  const changes: string[] = [];
  let changed = false;

  const migrateDeps = (deps: Record<string, string> | undefined, depType: string) => {
    if (!deps) return;

    for (const [name, version] of Object.entries(deps)) {
      if (PACKAGE_MIGRATIONS[name as keyof typeof PACKAGE_MIGRATIONS]) {
        const newName = PACKAGE_MIGRATIONS[name as keyof typeof PACKAGE_MIGRATIONS];
        delete deps[name];
        deps[newName] = version;
        changes.push(`  ${depType}: ${name} → ${newName}`);
        changed = true;
      }
    }
  };

  migrateDeps(pkg.dependencies, "dependencies");
  migrateDeps(pkg.devDependencies, "devDependencies");
  migrateDeps(pkg.peerDependencies, "peerDependencies");

  return {
    changed,
    content: JSON.stringify(pkg, null, 2) + "\n",
    changes,
  };
}

function main() {
  const args = process.argv.slice(2);
  const options: Options = {
    apply: args.includes("--apply"),
    dryRun: args.includes("--dry-run") || !args.includes("--apply"),
    verbose: args.includes("--verbose"),
  };

  const basePath = process.cwd();
  const files = getAllPackageJsonFiles(basePath);

  console.log(`🔍 Found ${files.length} package.json files\n`);

  let totalChanged = 0;

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const result = migratePackageJson(content, file);

    if (result.changed) {
      totalChanged++;

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
    console.log(`\n✨ No package references need migration!`);
  }
}

main();
