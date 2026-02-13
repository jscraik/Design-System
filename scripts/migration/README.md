# DesignStudio Migration Scripts

This directory contains automated migration scripts for transitioning from `@astudio/*` to `@design-studio/*`.

> **Status (as-of 2026-02-06):** The broader `packages/design-studio-*` migration plan is currently paused. These scripts may need a refresh before use.

## Available Scripts

### 1. Import Path Migration

**Script:** `migrate-imports.ts`

Migrates import statements from `@astudio/*` to `@design-studio/*`.

```bash
npx tsx scripts/migration/migrate-imports.ts [--apply] [--dry-run] [--verbose]
```

**What it does:**
- Finds TypeScript/TSX/JS/JSX files (excluding common build/output folders)
- Replaces:
  - `@astudio/ui` → `@design-studio/ui`
  - `@astudio/runtime` → `@design-studio/runtime`
  - `@astudio/tokens` → `@design-studio/tokens`
  - `@astudio/icons` → `@design-studio/ui/icons`

### 2. Package Reference Migration

**Script:** `migrate-package-refs.ts`

Updates `package.json` references related to the migration plan.

```bash
npx tsx scripts/migration/migrate-package-refs.ts [--apply] [--dry-run] [--verbose]
```

## Verification

After running migrations, verify:

```bash
# Type check (repo-level)
pnpm -r type-check

# Run tests (repo-level)
pnpm test

# Build (repo-level)
pnpm build
```
