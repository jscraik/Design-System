# Getting Started

## Table of Contents
- [Purpose](#purpose)
- [Baseline setup](#baseline-setup)
- [Validation](#validation)

## Purpose
Use this package to bootstrap and validate a repository-local design-system guidance config.

## Baseline setup
Run `design-system-guidance init <path>` to create `.design-system-guidance.json` in the target folder.

The generated config includes:
- `docs`: required markdown docs with ToC headings
- `include`: source paths scanned for token-policy violations
- `ignore`: directory names excluded from recursive scans

## Validation
Run `design-system-guidance check <path>` for warnings, or add `--ci` to fail on any violation.
