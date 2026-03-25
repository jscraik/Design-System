# Getting Started

## Table of Contents
- [Purpose](#purpose)
- [Baseline setup](#baseline-setup)
- [Scope model](#scope-model)
- [Validation](#validation)

## Purpose
Use this package to bootstrap and validate a repository-local design-system guidance config.

## Baseline setup
Run `design-system-guidance init <path>` to create `.design-system-guidance.json` in the target folder.

The generated config includes:
- `docs`: required markdown docs with ToC headings
- `include`: source paths scanned for token-policy violations
- `ignore`: directory names excluded from recursive scans
- `scopes.error`: exact protected-surface globs that should fail in CI
- `scopes.warn`: broader product/UI globs that should report warnings without failing CI
- `scopes.exempt`: globs excluded from pattern-rule evaluation
- `scopePrecedence`: tie-break order when a file matches more than one scope
- `exemptionLedger`: optional path to a tracked JSON ledger of time-bounded rule exemptions

## Scope model
Scope-aware enforcement lets one config validate both protected product surfaces and broader reusable UI code.

Use it like this:

- put exact product surfaces in `scopes.error`
- put broader app, component, or showcase surfaces in `scopes.warn`
- put token/theme internals or generated artifacts in `scopes.exempt`
- add a tracked ledger when temporary exemptions are needed for specific file + rule combinations

## Validation
Run `design-system-guidance check <path>` for warnings, or add `--ci` to fail on errors.
