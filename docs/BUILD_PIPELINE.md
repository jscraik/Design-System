# Enhanced Monorepo Build Pipeline

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

The build pipeline provides unified orchestration for npm packages (web + widgets) with version synchronization, incremental builds, and token validation.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Verify](#verify)
- [Architecture](#architecture)
- [Build pipeline stages](#build-pipeline-stages)
- [Incremental builds](#incremental-builds)
- [CI/CD integration](#cicd-integration)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+
- pnpm 10.27.0

## Overview

The build pipeline is designed to:

- **Web Builds**: Build all JS/TS packages and web apps
- **Version Synchronization**: Keep versions consistent across package.json files
- **Incremental Builds**: Only rebuild what has changed to save time
- **Token Validation**: Ensure token outputs match DTCG source
- **CI/CD Integration**: Automated testing and validation in GitHub Actions

## Quick Start

```bash
# Build all web packages
pnpm build

# Build specific target
pnpm build:web
pnpm build:widgets

# Clean build (no incremental)
pnpm build:clean
```

## Verify

- Web: `pnpm build:web` produces `packages/*/dist` bundles.
- Tokens: `pnpm validate:tokens` reports zero blocking errors.

## Architecture

```
scripts/
├── build-pipeline.mjs              # Main build orchestrator
└── version-sync.mjs                # Version synchronization

.github/workflows/
└── ci.yml                          # CI/CD configuration
```

## Build Pipeline Stages

### 1. Version Synchronization

Version synchronization is a separate, explicit step (it is not run automatically by the build pipeline):

```bash
pnpm sync:versions
```

**CI guard:**

```bash
pnpm sync:versions:check
```

**What it does:**

- Reads version from root `package.json`
- Updates npm package.json files

**Note:** The build pipeline only runs version synchronization when invoked with `--sync-versions`.

### 2. Token Generation

Generates design tokens for web usage:

```bash
pnpm generate:tokens
```

**Outputs:**

- `packages/tokens/src/foundations.css` - CSS custom properties
- `packages/tokens/docs/outputs/manifest.json` - Validation manifest

### 3. Token Validation

Validates token structure and output consistency:

```bash
pnpm validate:tokens
```

**Checks:**

- DTCG schema compliance
- Required token categories present
- Output files updated and deterministic

### 4. Web Package Builds

Builds all npm packages:

- `packages/ui` - React component library
- `packages/runtime` - Widget runtime
- `packages/tokens` - Design tokens
- `packages/widgets` - Widget implementations

### 5. Testing

Runs web test suites:

```bash
pnpm test                    # Unit tests
pnpm test:e2e:web           # E2E tests
pnpm test:a11y:widgets      # Accessibility tests
pnpm test:mcp-contract      # MCP contract tests
```

## Incremental Builds

The pipeline uses file modification times to determine what needs rebuilding:

**Token Regeneration:**

- Checks: `packages/tokens/src/*.ts`
- Outputs: CSS + manifest

**npm Package Builds:**

- Checks: `src/**/*`, `package.json`, `tsconfig.json`
- Outputs: `dist/` directory

To force a clean build:

```bash
pnpm build:clean
```

## CI/CD Integration

### GitHub Actions Workflow

The CI workflow runs on Ubuntu:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest]
```

**Jobs:**

1. **Build** - Runs build pipeline
2. **A11y** - Accessibility testing
3. **Visual** - Visual regression testing

### Build Artifacts

Artifacts are uploaded per job:

- `build-artifacts-web` - npm package dist folders
- `.build-cache/` - Build manifest for incremental builds

## Configuration

### Build Pipeline Options

```bash
node scripts/build-pipeline.mjs [options]

Options:
  --platforms <list>    Comma-separated list (web)
  --sync-versions       Synchronize versions before building
  --no-incremental      Disable incremental builds
  --skip-tests          Skip running tests
  --help                Show help message
```

### Package Configuration

**npm Packages:**

```json
{
  "name": "@design-studio/ui",
  "version": "0.0.1", // Synchronized by build pipeline
  "scripts": {
    "build": "tsc && vite build"
  }
}
```

## Troubleshooting

### Symptom: Token validation fails after edits

Cause: Tokens were not regenerated.
Fix:

```bash
pnpm generate:tokens
pnpm validate:tokens
```

### Build Cache Issues

If incremental builds aren't detecting changes:

```bash
rm -rf .build-cache/
pnpm build:clean
```

## Performance

**Typical Build Times:**

- **Incremental (no changes)**: ~0.5s
- **Incremental (token changes)**: ~2s
- **Incremental (single package)**: ~5s
- **Clean build (web)**: ~30s

**Optimization Tips:**

1. Use incremental builds during development
2. Run platform-specific builds when possible
3. Skip tests during rapid iteration
4. Use `--skip-tests` flag for faster builds

## Related Documentation

- [Token Generation](../packages/tokens/README.md)
- [CI/CD Workflow](../.github/workflows/ci.yml)
- [Version Synchronization](./VERSION_SYNC.md)

## Risks and assumptions

- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)
