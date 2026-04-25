# Agent Design Engine

## Table of Contents
- [Purpose](#purpose)
- [Contract](#contract)
- [Validation](#validation)

## Purpose

`@brainwav/agent-design-engine` turns `DESIGN.md` into a deterministic contract that coding agents can parse, lint, diff, and export before building UI.

## Contract

The package owns:

- `DESIGN.md` frontmatter parsing for `schemaVersion` and `brandProfile`
- normalized semantic sections
- machine-checkable professional UI rules with source provenance
- deterministic diff and export payloads

## Validation

```bash
pnpm -C packages/agent-design-engine type-check
pnpm -C packages/agent-design-engine test
```
