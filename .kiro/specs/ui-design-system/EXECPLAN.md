```md
# Implement Apps SDK UI-first design system gates (through G6 Figma Make)

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This repository defines ExecPlan requirements in `.agent/PLANS.md`. This document must be maintained in accordance with that file.

## Purpose / Big Picture

After this change, contributors can rely on a governed, Apps SDK UI–first design system with deterministic tokens, enforced component coverage, and CI gates that prevent upstream drift and unsafe fallbacks. Designers using Figma Make can install a private set of `@design-studio/*` packages that expose tokens, components, and icons for AI-assisted code generation, with guidelines that teach the system contract and accessibility expectations.

## Progress

- [x] (2026-01-08 00:00Z) Create ExecPlan and record repository orientation.
- [x] (2026-01-08 01:10Z) Implement G0 governance docs and coverage matrix generator, then validate deterministic outputs.
- [x] (2026-01-08 01:45Z) Implement G1 token schema pinning, alias map, validator upgrades, manifest metadata, and token property tests.
- [x] (2026-01-08 02:10Z) Implement G2 enforcement (ESLint rules, CI gates, and scripts) and wire to workflows.
- [x] (2026-01-09 01:10Z) Implement G3 component alignment enforcement (token usage ESLint rule, no-parallel component test, semantic token usage test, documentation mapping via coverage matrix + upstream version reference).
- [x] (2026-01-09 00:30Z) Implement G4 runtime host adapter + widget integration updates (HostAdapter seam, mock host exports, HostProvider wiring, widget budget validation, widget migration off window.openai).
- [x] (2026-01-09 01:30Z) Sync ExecPlan to updated Tasks.md and expand G5.5 parity checks to cover colors + spacing + typography.
- [x] (2026-01-09 02:00Z) Fix parity pipeline (asset catalog alpha support, border token defaults, parity validator mapping) and revalidate tokens.
- [x] (2026-01-09 02:40Z) Implement G5.3/G5.4 component property tests for focus contrast + touch targets; update focus ring tokens and minimum hit targets to satisfy new gates.
- [x] (2026-01-09 03:10Z) Strengthen G5.2 a11y gate coverage with Storybook keyboard smoke tests for Dialog + Popover; update component tests for new focus ring requirements.
- [x] (2026-01-09 03:25Z) Resolve peer dependency warnings (hono, wrangler/workers-types) and approve workerd build scripts to keep install pipeline clean.
- [x] (2026-01-09 03:35Z) Implement G5.1 drift test suite in UI tests (coverage matrix + upstream contract + replacement warnings).
- [x] (2026-01-09 03:50Z) Enforce G5.6 perf budgets with strict CI gating; document QA gate coverage in design system contract.
- [x] (2026-01-09 03:55Z) Complete G5 verification gates (drift, a11y, parity, perf budgets, docs acceptance).
- [x] (2026-01-09 04:10Z) Update ExecPlan format to comply with `.agent/PLANS.md` and expand G6 scope for Figma Make publishing.
- [x] (2026-01-09 04:25Z) Implement G6.1 registry configuration templates and docs.
- [x] (2026-01-09 04:30Z) Implement G6.2 @design-studio/tokens package (exports, build).
- [x] (2026-01-09 04:35Z) Implement G6.3 @design-studio/ui package (exports, build).
- [x] (2026-01-09 05:00Z) Implement G6.4–6.6 @design-studio/icons package (SVG sources, SVGR generation, category exports, Icon renderer) and generate SVG + React outputs.
- [x] (2026-01-09 04:40Z) Implement G6.7 Figma Make guidelines folder.
- [x] (2026-01-09 04:40Z) Implement G6.8 Figma Make template package.
- [x] (2026-01-09 04:45Z) Implement G6.9 version synchronization script and root scripts.
- [x] (2026-01-09 04:50Z) Implement G6.10 publish workflow.
- [x] (2026-01-09 05:05Z) Implement G6.11–6.12 icon property tests and CI wiring; verified locally with `pnpm test:astudio-icons`.

## Surprises & Discoveries

- Observation: Existing token generation already produces a manifest and asset catalog hashes, but it does not include schema or upstream version metadata yet.
  Evidence: `packages/tokens/src/generator.ts` has `GenerationManifest` with `version`, `sha256`, and `generated` only.
- Observation: Radix usage was spread across multiple component folders and required relocation into fallback directories to satisfy enforcement rules.
  Evidence: `rg -n "@radix-ui" packages/ui/src/components/ui` before refactor listed base/navigation/overlays components outside fallback.
- Observation: CSS/Swift parity validation reports mismatched token coverage and currently emits warnings instead of failing CI.
  Evidence: `pnpm tokens:validate` reports missing Swift colorsets and missing CSS semantic tokens for Swift.

## Decision Log

- Decision: Keep Apps SDK UI as the canonical baseline with Radix only as fallback components.
  Rationale: Matches design system requirements and ensures parity with embedded Apps SDK UI widgets.
  Date/Author: 2026-01-08 / Codex
- Decision: Use Storybook keyboard smoke tests to cover baseline accessibility gate for Dialog/Popover.
  Rationale: Lightweight a11y gate signal that exercises keyboard flow without full e2e overhead.
  Date/Author: 2026-01-09 / Codex

## Outcomes & Retrospective

- Pending: G6 implementation in progress.

## Context and Orientation

Work from the repo root `/Users/jamiecraik/dev/aStudio`. The current design system lives in `packages/tokens` (DTCG source + generator), `packages/ui` (Apps SDK UI-first components + icons), `packages/widgets` (embedded widgets), and `docs/design-system` (governance). CI gates are defined in `.github/workflows/ci.yml` and scripts in `scripts/`.

G6 adds new Figma Make packaging under `packages/astudio-*` plus a Make template package that contains guidelines. The goal is to publish `@design-studio/tokens`, `@design-studio/ui`, and `@design-studio/icons` to Figma’s org private registry (`https://npm.figma.com/`) with synchronized versions and documentation for Make AI.

## Plan of Work

1) G6.1: Add `.npmrc.figma.template` and `docs/design-system/FIGMA_MAKE_SETUP.md` documenting how to generate/store the Figma registry token and configure the `@astudio` scope. Use the registry URL from the design spec.
2) G6.2: Create `packages/astudio-tokens` that re-exports values, types, and CSS/tailwind outputs from `@design-studio/tokens`. Provide `package.json` exports and a build script (tsc) so `pnpm build:astudio-tokens` succeeds.
3) G6.3: Create `packages/astudio-ui` that re-exports `@design-studio/ui` components (Apps SDK UI-first wrappers), plus CSS entry points. Add peer deps for React 18+ and build script.
4) G6.4–6.6: Create `packages/astudio-icons` with SVG sources grouped by category, generate React components from SVG (SVGR), create typed `IconName` union, and build a tree-shaking-friendly barrel. Re-export `Download`/`Sparkles` from `@openai/apps-sdk-ui`.
5) G6.7–6.8: Create `packages/astudio-make-template` with guidelines and a Make-compatible template that installs the three packages.
6) G6.9: Add `scripts/sync-astudio-versions.ts` and root scripts to sync versions across all `@design-studio/*` packages to the root `package.json` version.
7) G6.10: Add `.github/workflows/publish-astudio.yml` to publish `@design-studio/*` packages to Figma’s private registry on tag or manual dispatch, using a secret token.
8) G6.11–6.12: Add icon property tests in `packages/astudio-icons/src/__tests__` for category coverage and SVG-to-component round-trip, and wire to CI via a root script.

## Concrete Steps

From `/Users/jamiecraik/dev/aStudio`:

  1) Add new package folders under `packages/` for `astudio-tokens`, `astudio-ui`, `astudio-icons`, and `astudio-make-template` with `package.json`, `src/`, and `tsconfig` files.
  2) Add `scripts/sync-astudio-versions.ts` and root `package.json` scripts:
     - `build:astudio-tokens`, `build:astudio-ui`, `build:astudio-icons`, `build:astudio`, `ds:astudio:sync-versions`, `publish:astudio`.
  3) Add `.npmrc.figma.template` and `docs/design-system/FIGMA_MAKE_SETUP.md`.
  4) Add `publish-astudio` GitHub Actions workflow.
  5) Add `packages/astudio-icons/src/__tests__/*.test.tsx` and wire to CI by adding `pnpm test:astudio-icons` to the web build job.

## Validation and Acceptance

- Run `pnpm build:astudio` and expect all three `@design-studio/*` packages build without errors.
- Run `pnpm ds:astudio:sync-versions` and expect all `@design-studio/*/package.json` versions to match root `package.json`.
- Run `pnpm test:astudio-icons` and expect both icon property tests to pass.
- Confirm `.npmrc.figma.template` and `docs/design-system/FIGMA_MAKE_SETUP.md` exist and describe the Figma registry flow.
- Confirm `.github/workflows/publish-astudio.yml` uses the Figma registry token secret and publishes on release tags or manual dispatch.

## Idempotence and Recovery

- Re-running the version sync script is safe; it re-applies the root version.
- Icon generation can be re-run to regenerate React components from SVG sources; regenerate before release if source SVGs change.
- The publish workflow is safe to re-run on a release tag; it should fail fast if auth is missing.

## Artifacts and Notes

- New docs: `docs/design-system/FIGMA_MAKE_SETUP.md`, `.npmrc.figma.template`.
- New packages: `packages/astudio-tokens`, `packages/astudio-ui`, `packages/astudio-icons`, `packages/astudio-make-template`.
- New scripts: `scripts/sync-astudio-versions.ts`.
- New workflow: `.github/workflows/publish-astudio.yml`.

## Interfaces and Dependencies

- `@design-studio/tokens` re-exports `@design-studio/tokens` values and CSS entry points and exposes `tailwind.preset`.
- `@design-studio/ui` re-exports `@design-studio/ui` components and `styles.css`, with React 18+ peer deps.
- `@design-studio/icons` exposes:

    - `Icon` component accepting `{ name, size, color, className, aria-label, aria-hidden }`
    - `IconName` union derived from SVG filenames
    - category exports for `arrows`, `interface`, `settings`, `chat-tools`, `account-user`, `platform`, `misc`

- The publish workflow writes `.npmrc` with `@astudio:registry=https://npm.figma.com/` and uses a secret token for auth.
```
