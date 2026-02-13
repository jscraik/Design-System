# UI component tooling (web)

Last updated: 2026-01-04

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or monthly (whichever is sooner)

## Contents

- [Doc requirements](#doc-requirements)
- [Web (React + Tailwind + Vite)](#web-react-tailwind-vite)
  - [1) Author components + stories](#1-author-components-stories)
  - [2) Run Storybook for component development](#2-run-storybook-for-component-development)
  - [3) Interaction tests (Storybook + Vitest)](#3-interaction-tests-storybook-vitest)
  - [4) Visual regression (Storybook + Playwright)](#4-visual-regression-storybook-playwright)
  - [5) Visual regression (Web app + Playwright)](#5-visual-regression-web-app-playwright)
  - [6) Accessibility regression (widgets)](#6-accessibility-regression-widgets)
- [Argos integration (optional, CI-first)](#argos-integration-optional-ci-first)
  - [Storybook Vitest uploads](#storybook-vitest-uploads)
  - [Playwright uploads (web + Storybook)](#playwright-uploads-web-storybook)
  - [First baseline build (required by Argos)](#first-baseline-build-required-by-argos)
  - [Argos auth](#argos-auth)
  - [Argos CLI upload (when you generate screenshots yourself)](#argos-cli-upload-when-you-generate-screenshots-yourself)
- [Install / update dependencies](#install-update-dependencies)
- [Related docs](#related-docs)

This guide maps the approved UI tooling to this repo in the order you should use it.

**📖 For complete component creation workflow**, see [COMPONENT_CREATION.md](./COMPONENT_CREATION.md) for the end-to-end process from planning to release.

## Web (React + Tailwind + Vite)

### 1) Author components + stories

- Components live in `packages/ui/src/components/**` and `packages/ui/src/templates/**`.
- Stories are colocated as `*.stories.tsx` and aggregated in `packages/ui/src/storybook/**`.
- Start new components with `pnpm new:component`.

### 2) Run Storybook for component development

- Command: `pnpm dev:storybook`
- Storybook app: `platforms/web/apps/storybook/`

### 3) Interaction tests (Storybook + Vitest)

- Command: `pnpm storybook:test`
- Optional port override: `VITEST_BROWSER_PORT=63315 pnpm storybook:test`

### 4) Visual regression (Storybook + Playwright)

- Command: `pnpm test:visual:storybook`
- Update baselines: `pnpm test:visual:storybook:update`
- Config: `platforms/web/apps/storybook/playwright.visual.config.ts`

### 5) Visual regression (Web app + Playwright)

- Command: `pnpm test:visual:web`
- Config: `platforms/web/apps/web/playwright.visual.config.ts`

### 6) Accessibility regression (widgets)

- Command: `pnpm test:a11y:widgets`
- Config: `packages/widgets/playwright.a11y.config.ts`

## Argos integration (optional, CI-first)

Argos uploads are wired into Playwright configs and Storybook Vitest runs. Uploads are only enabled in CI.

### Storybook Vitest uploads

- Config: `platforms/web/apps/storybook/vitest.config.ts`
- Uses `@storybook/addon-vitest` and `@argos-ci/storybook` Vitest plugin.

### Playwright uploads (web + Storybook)

- Configs:
  - `platforms/web/apps/web/playwright.visual.config.ts`
  - `platforms/web/apps/storybook/playwright.visual.config.ts`
- Uses `@argos-ci/playwright` reporter.

### First baseline build (required by Argos)

1. Ensure the Argos project is connected to the repo (GitHub App or token-based).
2. Run CI on `main` to generate the first baseline build.
3. Open a PR to see visual diffs and checks.

### Argos auth

- If you are not using the GitHub App integration, set `ARGOS_TOKEN` in CI secrets.

### Argos CLI upload (when you generate screenshots yourself)

- Install: `pnpm add -D @argos-ci/cli`
- Upload (repo script): `pnpm argos:upload` (uses `ARGOS_TOKEN`)
- Upload (direct): `pnpm exec -- argos upload ./screenshots`
- Token: prefer `ARGOS_TOKEN`; `--token=<token>` is available if needed.
- Directory: `./screenshots`

## Install / update dependencies

After pulling changes that include new tooling:

```
pnpm install
```

## Related docs

- `packages/ui/STORYBOOK_GUIDE.md`
- `docs/KEYBOARD_NAVIGATION_TESTS.md`
- `docs/operations/QA_EVIDENCE_SCHEMA.md`

## Risks and assumptions

- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify

- Use `docs/operations/QA_EVIDENCE_SCHEMA.md` for required commands, outcomes, and artifacts.

## Troubleshooting

- TBD: Add the top 3 failure modes and fixes.
