# Private Guidance Package (`@brainwav/design-system-guidance`)

Last updated: 2026-04-24

## Table of Contents
- [Purpose](#purpose)
- [Install](#install)
- [Initialize config](#initialize-config)
- [Run checks](#run-checks)
- [DESIGN.md mode](#designmd-mode)
- [Migration and rollback](#migration-and-rollback)
- [CI behavior](#ci-behavior)
- [Compatibility manifest](#compatibility-manifest)
- [What the checker enforces](#what-the-checker-enforces)
- [Troubleshooting](#troubleshooting)

## Purpose
Use `@brainwav/design-system-guidance` to provide reusable design-system guidance and enforcement to consumer projects.

The package remains the consumer-facing wrapper for rollout policy. It owns
guidance config validation, supported profile definitions, migration state, and
compatibility metadata. The semantic `DESIGN.md` parser and linter live in
`@brainwav/agent-design-engine`.

## Install
```bash
pnpm add -D @brainwav/design-system-guidance
```

## Initialize config
```bash
npx design-system-guidance init .
```

This creates `.design-system-guidance.json` with:
- `docs`: markdown files expected to include a **Table of Contents**
- `include`: source paths scanned for token-policy violations
- `ignore`: directories excluded from scans

## Run checks
Local warning mode:

```bash
npx design-system-guidance check .
```

CI failing mode:

```bash
npx design-system-guidance check . --ci
```

## CI behavior
- Local mode: prints violations but exits `0`.
- CI mode (`--ci` or `CI=1`): exits `1` on any violation.

## DESIGN.md mode

The v2 guidance config adds `designContract` rollout state while preserving the
existing v1 fields:

```json
{
  "schemaVersion": 2,
  "docs": ["docs/design-system/CONTRACT.md"],
  "include": ["src"],
  "ignore": ["node_modules", "dist", ".git"],
  "designContract": {
    "mode": "design-md",
    "migrationState": "active",
    "rollbackMetadata": "artifacts/design-migrations/<id>-guidance-rollback.json"
  }
}
```

`DESIGN.md` owns contract metadata such as `schemaVersion` and `brandProfile`.
`.design-system-guidance.json` owns rollout state only.

## Migration and rollback

Use the aStudio CLI wrapper for adoption:

```bash
pnpm -C packages/cli build
node packages/cli/dist/index.js design migrate --to design-md --dry-run --json
node packages/cli/dist/index.js design migrate --to design-md --write --json
```

Rollback is metadata-gated:

```bash
node packages/cli/dist/index.js design migrate --rollback --dry-run --json
node packages/cli/dist/index.js design migrate --rollback --write --json
```

Rollback refuses unreadable, corrupt, or project-external metadata with
`E_DESIGN_ROLLBACK_METADATA_UNREADABLE`. A successful write rollback quarantines
an existing migrated `DESIGN.md` under `artifacts/design-migrations/` before the
config returns to `legacy` mode.

`init --force` refuses to overwrite v2 or migrated configs until schema-aware
round-trip writing can preserve forward metadata.

## Compatibility manifest

`packages/design-system-guidance/src/compatibility.ts` publishes the v1
compatibility manifest. It records:

- wrapper and engine version compatibility
- supported `DESIGN.md` schemas
- supported `astudio design` command schemas
- supported migration schemas
- supported profile definitions
- the frozen `system-design` parity baseline
- the legacy support window policy

CLI design commands call the manifest gate before emitting design payloads.
Non-design aStudio commands bypass this design compatibility gate.

## What the checker enforces
- Required config exists and is valid.
- Required docs exist and include `## Table of Contents`.
- No deprecated `@design-studio/astudio-icons` imports.
- Warn on raw hex colors.
- Warn on raw `px` literals.
- Design rollout state is parsed strictly when present.

## Troubleshooting

- `E_DESIGN_CONFIG_INVALID`: preserve required v1 fields and use schema version
  `1` or `2`.
- `E_DESIGN_WRITE_REQUIRED`: rerun with `--write` or use `--dry-run`.
- `E_DESIGN_MIGRATION_STATE_INVALID`: use `--resume` only for `partial` or
  `failed` migration state, and use `--rollback` for rollback.
- `E_DESIGN_ROLLBACK_METADATA_UNREADABLE`: restore rollback metadata before
  retrying rollback or resume.
