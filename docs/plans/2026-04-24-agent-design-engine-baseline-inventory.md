# Agent Design Engine Baseline Inventory

Last updated: 2026-04-24

## Table of Contents

- [Purpose](#purpose)
- [Frozen Baseline](#frozen-baseline)
- [Vendored Fixtures](#vendored-fixtures)
- [Intentional Deltas](#intentional-deltas)
- [Validation](#validation)

## Purpose

This inventory records the `system-design` material used by JSC-208 so the
agent-design engine does not depend on a local checkout outside this repo.

## Frozen Baseline

- Source: `https://github.com/jscraik/system-design.md.git`
- Commit: `8ecd4645b957e6a683a05fb9c79cd6c9028873d0`
- Import strategy: vendored fixture files in `packages/agent-design-engine/tests/parity/`
- Ongoing authority: this repository, not `/Users/jamiecraik/dev/system-design`

## Vendored Fixtures

The first parity slice is intentionally small and source-controlled:

- `packages/agent-design-engine/tests/parity/atmospheric-glass.DESIGN.md`
- `packages/agent-design-engine/tests/parity/totality-festival.DESIGN.md`
- `packages/agent-design-engine/tests/fixtures/valid-design.md`
- `packages/agent-design-engine/tests/fixtures/invalid-design.md`

The source-derived rule fixture contract is enforced through
`packages/agent-design-engine/rules/agent-design.rules.v1.json`. Each manifest
entry names a fixture, stable predicate, severity, and source document.

## Intentional Deltas

Known baseline gaps are treated as v1 bug fixes:

- Numeric spacing values must not crash parser validation.
- Formatted headings must not bypass section-order and rule linting.
- Machine output is schema-first; unsupported human text export behavior is not
  carried forward from the source project.

## Validation

Use the package-local engine gates after changing fixtures or manifest entries:

```bash
pnpm -C packages/agent-design-engine type-check
pnpm -C packages/agent-design-engine test
```
