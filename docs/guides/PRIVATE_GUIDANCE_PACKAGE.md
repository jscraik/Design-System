# Private Guidance Package (`@brainwav/design-system-guidance`)

Last updated: 2026-03-04

## Table of Contents
- [Purpose](#purpose)
- [Install](#install)
- [Initialize config](#initialize-config)
- [Run checks](#run-checks)
- [CI behavior](#ci-behavior)
- [What the checker enforces](#what-the-checker-enforces)

## Purpose
Use `@brainwav/design-system-guidance` to provide reusable design-system guidance and enforcement to consumer projects.

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

## What the checker enforces
- Required config exists and is valid.
- Required docs exist and include `## Table of Contents`.
- No deprecated `@design-studio/astudio-icons` imports.
- Warn on raw hex colors.
- Warn on raw `px` literals.
