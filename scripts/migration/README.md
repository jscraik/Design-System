# DesignStudio Migration Scripts

This directory contains automated migration scripts for transitioning from AStudio to DesignStudio.

## Available Scripts

### 1. Import Path Migration

**Script:** `migrate-imports.ts`

Migrates all import statements from `@design-studio/*` to `@design-studio/*`.

```bash
npx tsx scripts/migration/migrate-imports.ts
```

**What it does:**
- Finds all TypeScript/TSX files
- Replaces `@design-studio/ui` → `@design-studio/ui`
- Replaces `@design-studio/runtime` → `@design-studio/runtime`
- Replaces `@design-studio/tokens` → `@design-studio/tokens`
- Replaces `@design-studio/icons` → `@design-studio/ui/icons`

### 2. Component Migration

**Script:** `migrate-components.ts`

Migrates component files from AStudio to DesignStudio structure.

```bash
npx tsx scripts/migration/migrate-components.ts
```

**What it does:**
- Copies components from `packages/ui/src` to `packages/design-studio-ui/src`
- Updates file headers and documentation
- Creates new index files with proper exports

### 3. Package Reference Migration

**Script:** `migrate-package-refs.ts`

Updates package.json references.

```bash
npx tsx scripts/migration/migrate-package-refs.ts
```

**What it does:**
- Updates workspace dependencies
- Updates import paths in package.json
- Updates peer dependencies

## Usage

### Run All Migrations

```bash
# Dry run (preview changes)
pnpm migrate:dry

# Apply migrations
pnpm migrate:apply
```

### Run Individual Migrations

```bash
npx tsx scripts/migration/migrate-imports.ts --apply
npx tsx scripts/migration/migrate-components.ts --apply
npx tsx scripts/migration/migrate-package-refs.ts --apply
```

## Options

- `--dry-run`: Preview changes without applying
- `--apply`: Apply changes
- `--verbose`: Show detailed output
- `--path <path>`: Only migrate specific path

## Verification

After running migrations, verify:

```bash
# Type check
pnpm -r type-check

# Run tests
pnpm -r test

# Build
pnpm -r build
```
