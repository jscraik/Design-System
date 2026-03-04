# Release Process

Step-by-step guide for releasing design system packages.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Release track](#release-track)
- [Run the GitHub workflow](#run-the-github-workflow)
- [Local commands (optional)](#local-commands-optional)
- [GitHub/npm setup](#githubnpm-setup)
- [Rollback procedure](#rollback-procedure)
- [Pre-release checklist](#pre-release-checklist)
- [Post-release](#post-release)

## Prerequisites

- Clean working tree (no uncommitted changes)
- Up-to-date `main` branch
- npm publish permission for `@brainwav/design-system-guidance` (restricted)

## Release track

This repository now publishes only one package via GitHub Actions:

1. **Restricted guidance track** (`@brainwav/design-system-guidance`) — managed by `.github/workflows/release-guidance.yml`.

`.github/workflows/release.yml` is retained as a manual guardrail validator only and does not publish.

## Run the GitHub workflow

Use GitHub Actions workflow **Release Guidance Package** (`release-guidance.yml`):
- `publish = false` → validate only
- `publish = true` → validate + publish
- optional `npm_tag` (default `latest`)

## Local commands (optional)

### Validate before publishing

```bash
pnpm release:guidance:validate
```

This runs:
- `pnpm design-system-guidance:type-check`
- `pnpm design-system-guidance:build`
- `pnpm design-system-guidance:check:ci`

### Manual publish
```bash
pnpm -C packages/design-system-guidance publish --access restricted --no-git-checks
```

## GitHub/npm setup

1. Add repository secret: `BRAINWAV_NPM_TOKEN`.
2. Ensure token has access to publish `@brainwav/design-system-guidance`.
3. (Optional) Enable npm Trusted Publisher (OIDC) later and remove token usage when ready.

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
- [ ] `pnpm release:guidance:validate` passes
- [ ] Version bump is correct
- [ ] CHANGELOG/release notes are accurate

## Post-release

1. Verify published versions:

```bash
npm view @brainwav/design-system-guidance
```

2. Update dependents and run integration tests.
3. Monitor issues and prepare hotfix if needed.
