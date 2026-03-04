# Release Process

Step-by-step guide for releasing design system packages.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Release tracks](#release-tracks)
- [Track A: Public `@design-studio/*` packages](#track-a-public-design-studio-packages)
- [Track B: Restricted `@brainwav/design-system-guidance`](#track-b-restricted-brainwavdesign-system-guidance)
- [Rollback procedure](#rollback-procedure)
- [Pre-release checklist](#pre-release-checklist)
- [Post-release](#post-release)

## Prerequisites

- Clean working tree (no uncommitted changes)
- Up-to-date `main` branch
- npm publish permissions for required scopes:
  - `@design-studio/*` (public)
  - `@brainwav/design-system-guidance` (restricted)
- GitHub token for release automation

## Release tracks

This repository has two release tracks:

1. **Public track** (`@design-studio/*`) — managed by Changesets in `.github/workflows/release.yml`.
2. **Restricted guidance track** (`@brainwav/design-system-guidance`) — managed by `.github/workflows/release-guidance.yml`.

`@brainwav/design-system-guidance` is intentionally excluded from the Changesets publish flow via `.changeset/config.json`.

## Track A: Public `@design-studio/*` packages

### 1) Create a changeset

```bash
pnpm changeset
```

### 2) Commit the changeset

```bash
git add .changeset/*.md
git commit -m "changes: <summary>"
```

### 3) Merge to `main`

The release workflow (`.github/workflows/release.yml`) will:
- run release validation gates (`type-check`, token validation, policy, matrix check, build)
- open/update a Changesets release PR when changesets exist
- publish when the release PR is merged

### 4) Manual local public release command (if needed)

```bash
pnpm release:public
```

This runs:
- `pnpm build:lib`
- `pnpm release` (`changeset publish`)

## Track B: Restricted `@brainwav/design-system-guidance`

### 1) Bump `packages/design-system-guidance/package.json` version

Use semver and commit the version change to `main`.

### 2) Run guidance release workflow

Use GitHub Actions workflow **Release Guidance Package** (`release-guidance.yml`):
- `publish = false` to validate only
- `publish = true` to validate + publish
- optional `npm_tag` (default `latest`)

### 3) Local validation command (optional)

```bash
pnpm release:guidance:validate
```

This runs:
- `pnpm design-system-guidance:type-check`
- `pnpm design-system-guidance:build`
- `pnpm design-system-guidance:check:ci`

### 4) Local publish command (optional/manual)

```bash
pnpm -C packages/design-system-guidance publish --access restricted --no-git-checks
```

## Rollback procedure

If a release breaks:

1. Identify offending commit/version.
2. Revert the release commit:

```bash
git revert <release-commit-hash>
```

3. Ship a patch release via the same track used originally.

## Pre-release checklist

- [ ] `pnpm test` passes
- [ ] `pnpm test:policy` passes
- [ ] `pnpm ds:matrix:check` passes
- [ ] `pnpm build:lib` passes
- [ ] `pnpm release:guidance:validate` passes (if guidance package changed)
- [ ] Version bump is correct
- [ ] CHANGELOG/release notes are accurate

## Post-release

1. Verify published versions:

```bash
npm view @design-studio/ui
npm view @design-studio/tokens
npm view @design-studio/runtime
npm view @brainwav/design-system-guidance
```

2. Update dependents and run integration tests.
3. Monitor issues and prepare hotfix if needed.
