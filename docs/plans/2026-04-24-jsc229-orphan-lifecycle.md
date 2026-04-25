# JSC-229 Orphan Lifecycle Decisions

Last updated: 2026-04-24

## Table of Contents

- [Purpose](#purpose)
- [Decisions](#decisions)
- [Validation](#validation)

## Purpose

JSC-229 resolves the dead-code audit findings that were too ambiguous for
automatic deletion. Each candidate is either removed, wired into a discoverable
command, or documented as an intentional prototype surface.

## Decisions

- `scripts/add-autodocs-tags.mjs`: removed. It was a one-shot migration helper
  with no call sites beyond its own comment, and keeping it suggested an active
  docs-generation workflow that does not exist.
- `scripts/theme-propagation.test.mjs`: kept and wired into
  `pnpm test:theme-propagation`. `pnpm test:web:property` now runs it before
  the template-preview resilience property test.
- `scripts/harness_pr_pipeline.py`: kept and exposed through
  `pnpm harness:pr-pipeline`. It remains a local helper for the
  `harness.contract.json` risk-tier/evidence gates rather than an implicit CI
  dependency.
- `packages/validation-prototype/**`: kept and exposed through
  `pnpm validation-prototype:build` and `pnpm validation-prototype:analyze`.
  The prototype remains the tree-shaking validation fixture referenced by
  `docs/validation/README.md`.
- `doc:lint` / `docs:lint`: `docs:lint` is canonical. `doc:lint` remains as a
  compatibility alias that delegates to `pnpm docs:lint`, so the command body
  cannot drift.

## Validation

```bash
pnpm test:theme-propagation
pnpm test:web:property
pnpm harness:pr-pipeline --help
pnpm validation-prototype:build
pnpm doc:lint
pnpm docs:lint
pnpm format:check
git diff --check
```
