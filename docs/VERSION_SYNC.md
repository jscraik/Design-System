# Version Synchronization

Last updated: 2026-01-04

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

This guide explains how versions are synchronized across npm packages.

## Table of contents

- [Why this exists](#why-this-exists)
- [Commands](#commands)
- [How it works](#how-it-works)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)

## Why this exists

- NPM packages need matching versions for releases.
- The build pipeline depends on a single source of truth: the root `package.json` version.

## Commands

### Sync everything (recommended)

```bash
pnpm sync:versions
```

This script updates:

- `packages/*/package.json` versions

## How it works

The scripts read the version from the root `package.json` and update:

- NPM packages: `packages/ui`, `packages/runtime`, `packages/tokens`, `packages/widgets`, `packages/cloudflare-template`

## Verify

```bash
pnpm sync:versions
rg -n \"\\\"version\\\"\" packages/*/package.json
```

## Troubleshooting

**Missing package version**

- Ensure the package exists under `packages/` and has a `package.json`.
