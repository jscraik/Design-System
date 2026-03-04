# @brainwav/design-system-guidance

Private guidance package for enforcing design-system usage in consumer projects.

## Table of Contents
- [Install](#install)
- [Initialize](#initialize)
- [Check](#check)
- [CI mode](#ci-mode)
- [Included guidance](#included-guidance)

## Install
```bash
pnpm add -D @brainwav/design-system-guidance
```

## Initialize
```bash
npx design-system-guidance init .
```

## Check
```bash
npx design-system-guidance check .
```

## CI mode
```bash
npx design-system-guidance check . --ci
```

## Included guidance
- `guidelines/` markdown guidance for tokens, typography, spacing, color, and iconography
- `rules.json` machine-readable policy rules
- CLI commands:
  - `design-system-guidance init [path]`
  - `design-system-guidance check [path] [--ci]`
