# Implementation Plan: Gold-Standard UI Design System (Apps SDK UI–First)

## Overview

This implementation plan converts the design into discrete coding tasks organized into phased gates with explicit deliverables and CI pass criteria. Each gate ends with a testable Definition of Done (DoD).

**Gate Model:**

- **G0 Foundation**: Governance + metadata + generators in place
- **G1 Tokens**: Deterministic, validated, aligned outputs
- **G2 Enforcement**: Lint + CI checks prevent drift and forbidden imports
- **G3 Components**: Apps SDK UI-first wrappers complete; Radix fallbacks isolated
- **G4 Runtime + Widgets**: Host adapter seam and widget wiring stable
- **G5 Verification**: Drift, a11y, parity, perf budgets enforced in CI

## Tasks

### G0: Governance + Inventory

- [ ] 0.1 Create design system charter
  - Create `docs/design-system/CHARTER.md`
  - MUST include: scope, non-goals, supported surfaces, Apps SDK UI-first rule, Radix fallback rule, release rules, required evidence for PRs
  - **DoD:** Charter exists + referenced from root README or docs/index.md
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 0.2 Create Upstream Alignment Log
  - Create `docs/design-system/UPSTREAM_ALIGNMENT.md`
  - Fields: pinned version, last verified (auto-stamped), drift suite definition, delta register template
  - **DoD:** Log exists + CI writes "last verified" stamp on successful drift run
  - _Requirements: 1.8_

- [ ] 0.3 Create Design System Contract Index
  - Create `docs/design-system/CONTRACT.md`
  - Links to: charter, tokens schema, alias map spec, coverage matrix, enforcement rules, testing gates
  - **DoD:** Single-page index navigates to all governing artifacts
  - _Requirements: 1.1_

- [ ] 0.4 Create Component Coverage Matrix generator (product-driven)
  - Create `scripts/generate-coverage-matrix.ts`
  - Inputs (authoritative):
    - Public exports from `packages/ui/src/index.ts`
    - Radix fallback components under `packages/ui/src/components/**/fallback/**`
    - Widget usage by scanning `packages/widgets/**` for imports
  - Outputs (deterministic):
    - `docs/design-system/COVERAGE_MATRIX.json` (authoritative, machine-checkable)
    - `docs/design-system/COVERAGE_MATRIX.md` (derived, human-readable)
  - Matrix row schema: `name`, `source` (upstream_reexport|upstream_wrapper|radix_fallback|local_primitive), `upstream`, `fallback`, `why_missing_upstream`, `migration_trigger`, `a11y_contract_ref`, `status`
  - **DoD:** Generator produces identical outputs across runs (deterministic ordering + stable formatting)
  - _Requirements: 4.2, 10a.4, 10a.5_

**Gate G0 DoD:** Docs exist, matrix generator produces deterministic md+json.

---

### G1: Tokens (Apps SDK UI baseline + determinism)

- [ ] 1.1 Pin token schema in-repo
  - Add `packages/tokens/schema/dtcg.schema.json`
  - Ensure `index.dtcg.json` references `$schema`
  - **DoD:** Validator fails if `$schema` missing or mismatched
  - _Requirements: 2.1_

- [ ] 1.2 Implement Token Alias Map
  - Create `packages/tokens/src/alias-map.ts`
  - Must map semantic tokens → foundation tokens and resolve modes (light/dark/high-contrast)
  - **DoD:** Alias map covers all semantic tokens in required categories (bg/text/icon/border/accent/space/type/radius/motion)
  - _Requirements: 2.3_

- [ ] 1.3 Token validator upgrades
  - Update `packages/tokens/src/validation/token-validator.ts`
  - Add: mode completeness checks, contrast checks for defined text/bg pairs, alias-map resolution checks, deterministic error codes + fix suggestions
  - **DoD:** Invalid tokens fail with stable error codes; CI logs show actionable suggestions
  - _Requirements: 2.8_

- [ ] 1.4 Deterministic generator + manifest
  - Update `packages/tokens/src/generator.ts`
  - Generate: CSS vars, Tailwind preset, TS types, Swift constants, xcassets
  - Generate `manifest.json` including SHA-256, token counts, pinned apps-sdk-ui version, and schema version
  - **DoD:** Running generation twice yields identical hashes and no git diff
  - _Requirements: 2.5, 2.7_

- [ ] 1.5 Property tests (token core)
  - **Property 1: Token Pipeline Determinism**: For any token source, running generation twice produces identical hashes
  - **Property 2: Token Alias Map Validity**: All semantic tokens resolve across all modes
  - **Property 3: Mode Completeness**: Every token has values for light/dark/high-contrast
  - **Property 4: Contrast Thresholds**: Declared text/bg pairs meet WCAG AA contrast
  - **DoD:** Tests run in CI; no flaky time-based fields (timestamps normalized)
  - **Validates:** Requirements 2.3, 2.7, 2.8, 8.2

**Gate G1 DoD:** `pnpm tokens:validate && pnpm tokens:generate && pnpm test:tokens` passes and is deterministic.

---

### G2: Enforcement Infrastructure (prevent drift, enforce foundation rule)

- [ ] 2.1 ESLint: Radix import restriction
  - Disallow `@radix-ui/*` imports outside `**/fallback/**`
  - Allow waivers via: `// @astudio-waiver radix-fallback: <reason> (expires YYYY-MM-DD)`
  - **DoD:** CI fails if Radix import appears outside fallback directories without waiver
  - _Requirements: 10a.1_

- [ ] 2.2 ESLint: "Apps SDK UI first" import preference
  - Disallow importing local equivalents when upstream exists (config-based map from coverage JSON)
  - **DoD:** PR fails if Button etc. is reimplemented instead of wrapped/re-exported
  - _Requirements: 10a.2, 10a.6_

- [ ] 2.3 CI: Coverage matrix up-to-date
  - Add CI step: run generator and `git diff --exit-code` on matrix outputs
  - Add `pnpm ds:matrix:generate` and `pnpm ds:matrix:check` scripts
  - PR guidance in failure message: "You added/changed public exports or widget usage; re-run `pnpm ds:matrix:generate` and commit the updated matrix."
  - **DoD:** PRs cannot merge if matrix is out of date
  - _Requirements: 10a.4, 10a.5_

- [ ] 2.4 CI: apps-sdk-ui version change gate
  - Add GitHub Action step that detects changes to pinned version of `@openai/apps-sdk-ui`
  - IF version changed, CI MUST:
    - Run upstream drift tests: `pnpm test:drift`
    - Update `docs/design-system/UPSTREAM_ALIGNMENT.md` "last verified" timestamp via `pnpm ds:alignment:stamp`
    - Require that the PR includes the updated alignment stamp (fail if not committed)
  - **DoD:** An apps-sdk-ui upgrade PR cannot merge without drift tests passing and alignment stamp updated
  - _Requirements: 10a.3_

**Gate G2 DoD:** Lint + CI checks prevent forbidden imports and matrix drift.

---

### G3: Component Library Alignment (Apps SDK UI-first)

- [ ] 3.1 Audit and update Apps SDK UI re-exports
  - Update `packages/ui/src/integrations/apps-sdk/index.ts`
  - Ensure re-exports match supported set (from Apps SDK examples + product needs)
  - **DoD:** Coverage matrix shows all upstream-used components as re-export or wrapper
  - _Requirements: 4.1_

- [ ] 3.2 Normalize wrapper naming and export surface
  - Decide one pattern: re-export upstream names directly OR prefix with `AppsSDK*` consistently
  - Document stable export policy in `CONTRACT.md`
  - **DoD:** Export policy documented and consistently applied
  - _Requirements: 4.1, 4.2_

- [ ] 3.3 Move and isolate Radix fallbacks
  - Move all Radix-based implementations into `components/**/fallback/**`
  - Add required header block to each: `why_missing_upstream`, `migration_trigger`, `a11y_contract_ref`
  - **DoD:** Every fallback component has the header and appears in matrix JSON
  - _Requirements: 4.4_

- [ ] 3.4 Token consumption static analysis
  - Implement ESLint rule/check: no raw hex colors in components, no raw spacing px except via tokens
  - **DoD:** PR fails on violations
  - _Requirements: 2.9, 4.10_

- [ ] 3.5 Property test: No parallel components
  - **Property 5: No Parallel Components**: For any Apps SDK UI export, verify no local parallel implementation exists
  - **DoD:** Test runs in CI
  - **Validates:** Requirements 4.3

- [ ] 3.6 Property test: Semantic token consumption
  - **Property 6: Semantic Token Consumption**: For any component, verify no hardcoded hex/px values
  - **DoD:** Test runs in CI
  - **Validates:** Requirements 4.10

- [ ] 3.7 Documentation mapping
  - Each component doc includes: upstream mapping (or fallback rationale), version pinned reference
  - **DoD:** Doc coverage check: public export requires doc entry
  - _Requirements: 9.4_

**Gate G3 DoD:** UI export surface matches matrix; fallbacks are isolated and documented; lint enforces token usage.

---

### G4: @design-studio/runtime Host Adapter + Widget Wiring

- [ ] 4.1 Implement HostAdapter
  - Create `packages/runtime/src/host-adapter.ts`
  - Typed wrapper over `window.openai`: detect presence, provide safe no-op/error surfaces for non-host contexts (storybook/dev)
  - **DoD:** Runtime works in widget + storybook (mock host)
  - _Requirements: 10b.1_

- [ ] 4.2 Implement mock host + fixtures
  - Create `packages/runtime/src/mock-host.ts`
  - Provide deterministic responses and event simulation
  - **DoD:** Storybook/widget gallery can run without ChatGPT host
  - _Requirements: 10b.2_

- [ ] 4.3 HostProvider React context
  - Create `packages/runtime/src/host-provider.tsx`
  - **DoD:** Components/widgets only interact with host via context (no direct global access)
  - _Requirements: 10b.1_

- [ ] 4.4 Contract tests for host adapter
  - Verify HostAdapter implements all documented Apps SDK APIs
  - Verify mock host returns valid responses
  - **DoD:** Contract tests pass in CI
  - **Validates:** Requirements 10b.3

- [ ] 4.5 Widget integration migration
  - Replace direct `window.openai` access in widgets with HostAdapter
  - Update `packages/widgets/src/shared/widget-base.tsx` and `openai-hooks.ts`
  - Add widgetState budget validation utility (warn + optionally hard fail in CI)
  - **DoD:** Widgets compile and run in both host + mock environments
  - _Requirements: 6.1, 6.3, 6.4, 6.8_

**Gate G4 DoD:** No direct `window.openai` usage outside runtime; widgets use adapter; budget checks exist.

---

### G5: Verification (drift, a11y, parity, perf)

- [ ] 5.1 Create upstream drift + replacement detector suite
  - Create `packages/ui/src/__tests__/drift/`
  - Add drift tests (snapshots/contract tests) for upstream Apps SDK UI components used (derived from `COVERAGE_MATRIX.json` rows with `source=upstream_*`)
  - Add "replacement detector" (warning by default): If `@openai/apps-sdk-ui` exports a component that plausibly replaces any `radix_fallback`, emit CI warning listing fallback name, suggested replacement, location
  - **DoD:** Drift tests run on normal PRs affecting wrappers/tokens; mandatory on apps-sdk-ui version bumps; replacement detector produces actionable warnings
  - _Requirements: 10.10_

- [ ] 5.2 A11y gate
  - Storybook + axe (web)
  - Keyboard nav smoke tests for overlays/fallbacks
  - **DoD:** CI fails on WCAG 2.2 AA tagged violations
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 10.3_

- [ ] 5.3 Property test: Focus state contrast
  - **Property 7: Focus State Contrast**: For any interactive component, focus state meets WCAG contrast
  - **DoD:** Test runs in CI
  - **Validates:** Requirements 8.3

- [ ] 5.4 Property test: Touch target size
  - **Property 8: Touch Target Size**: For any interactive element, minimum 44x44px dimensions
  - **DoD:** Test runs in CI
  - **Validates:** Requirements 8.6

- [ ] 5.5 Cross-platform token parity check
  - Compare CSS vs Swift outputs for key tokens (colors, spacing, type)
  - **DoD:** Mismatch fails CI with token path diff
  - _Requirements: 16.4_

- [ ] 5.6 Perf budgets
  - Bundle size limits for `@design-studio/ui` and widgets
  - Optional render budget checks in playwright (time-to-interactive threshold)
  - **DoD:** Budgets enforced as CI thresholds
  - _Requirements: 10.8_

**Gate G5 DoD:** Drift + a11y + parity + perf checks all enforced in CI.

---

### G6: Figma Make Private Package Publishing

- [ ] 6.1 Set up Figma org private registry configuration
  - Create `.npmrc.figma.template` with placeholder for org-scoped registry auth
  - Document admin key generation process in `docs/design-system/FIGMA_MAKE_SETUP.md`
  - Add `@astudio` scope configuration pointing to Figma's org registry
  - **DoD:** Template exists with clear instructions; actual key stored securely (not committed)
  - _Requirements: 20.2_

- [ ] 6.2 Create @design-studio/tokens package
  - Create `packages/astudio-tokens/` package structure
  - Re-export CSS variables from `@design-studio/tokens`
  - Re-export Tailwind preset from `@design-studio/tokens`
  - Re-export TypeScript token types
  - Ensure React 18+ and Vite compatibility
  - Add `package.json` with `@design-studio/tokens` name and proper exports
  - **DoD:** Package builds and exports all token formats; `pnpm build:astudio-tokens` succeeds
  - _Requirements: 20.1, 20.3_

- [ ] 6.3 Create @design-studio/ui package
  - Create `packages/astudio-ui/` package structure
  - Re-export Apps SDK UI-first component wrappers from `@design-studio/ui`
  - Ensure React 18+ and Vite compatibility (peer deps)
  - Add `package.json` with `@design-studio/ui` name and proper exports
  - Depend on `@design-studio/tokens` for token consumption
  - **DoD:** Package builds and exports all components; `pnpm build:astudio-ui` succeeds
  - _Requirements: 20.1, 20.4_

- [ ] 6.4 Create @design-studio/icons package with SVG sources
  - Create `packages/astudio-icons/` package structure
  - Create `src/svg/` directory for SVG source files
  - Organize SVGs into category subdirectories: `arrows/`, `interface/`, `settings/`, `chat-tools/`, `account-user/`, `platform/`, `misc/`
  - Copy/migrate existing icons from `packages/ui/src/icons/` to SVG sources
  - **DoD:** SVG sources organized by category; all existing icons migrated
  - _Requirements: 20.5, 20.6_

- [ ] 6.5 Implement SVGR icon component generation
  - Add SVGR build step to generate React components from SVGs
  - Create `src/react/` output directory for generated components
  - Generate typed `IconName` union from SVG filenames
  - Create `<Icon name="..." />` renderer component with size/color props
  - Re-export upstream icons from `@openai/apps-sdk-ui` (Download, Sparkles, etc.)
  - **DoD:** `pnpm build:astudio-icons` generates React components; IconName type is complete
  - _Requirements: 20.5, 20.7_

- [ ] 6.6 Create icon category index exports
  - Create category barrel exports: `src/arrows.ts`, `src/interface.ts`, etc.
  - Create main `src/index.ts` with tree-shaking-friendly exports
  - Export category constants for runtime category filtering
  - **DoD:** Icons importable by category; tree-shaking works (verified via bundle analysis)
  - _Requirements: 20.6_

- [ ] 6.7 Create Figma Make guidelines folder
  - Create `packages/astudio-make-template/guidelines/` directory
  - Create `Guidelines.md` with overview of design system usage in Make
  - Create `overview-components.md` documenting available components and usage patterns
  - Create `overview-icons.md` documenting icon categories and naming conventions
  - Create `design-tokens/colors.md`, `design-tokens/spacing.md`, `design-tokens/typography.md`
  - **DoD:** Guidelines folder complete with all required documentation
  - _Requirements: 20.9_

- [ ] 6.8 Create Figma Make template file
  - Create `packages/astudio-make-template/` package
  - Create Make-compatible project structure
  - Configure package.json to install `@design-studio/tokens`, `@design-studio/ui`, `@design-studio/icons`
  - Include `guidelines/` folder in template
  - **DoD:** Template can be used to bootstrap a Make file with all packages installed
  - _Requirements: 20.8, 20.10_

- [ ] 6.9 Implement version synchronization
  - Add script `scripts/sync-astudio-versions.ts`
  - Synchronize versions across all three `@design-studio/*` packages
  - Tie versions to main design system version in root `package.json`
  - **DoD:** Running `pnpm ds:astudio:sync-versions` updates all package versions consistently
  - _Requirements: 20.11_

- [ ] 6.10 Add Figma registry publish workflow
  - Create GitHub Action workflow `.github/workflows/publish-astudio.yml`
  - Trigger on release tags or manual dispatch
  - Build all three packages
  - Publish to Figma org private registry using stored auth token
  - **DoD:** Workflow publishes packages to Figma registry on release
  - _Requirements: 20.1, 20.2_

- [ ] 6.11 Property test: Icon category completeness
  - **Property 9: Icon Category Completeness**: For any icon in SVG sources, it belongs to exactly one category
  - **DoD:** Test runs in CI
  - **Validates:** Requirements 20.6

- [ ] 6.12 Property test: Icon component generation round-trip
  - **Property 10: Icon Generation Round-Trip**: For any SVG source, generated React component renders equivalent visual output
  - **DoD:** Test runs in CI (snapshot comparison)
  - **Validates:** Requirements 20.5

**Gate G6 DoD:** All three `@design-studio/*` packages build successfully; publish workflow configured; guidelines complete.

---

## Supporting Scripts

Add these `pnpm` scripts to root `package.json`:

| Script | Description |
| ------ | ----------- |
| `ds:matrix:generate` | Runs `scripts/generate-coverage-matrix.ts` |
| `ds:matrix:check` | Verifies no diff after generation |
| `ds:alignment:stamp` | Updates `UPSTREAM_ALIGNMENT.md` "last verified" field (CI use) |
| `test:drift` | Runs drift suite |
| `tokens:validate` | Validates token files against schema and alias map |
| `tokens:generate` | Generates all platform token outputs |
| `test:tokens` | Runs token property tests |
| `build:astudio-tokens` | Builds `@design-studio/tokens` package |
| `build:astudio-ui` | Builds `@design-studio/ui` package |
| `build:astudio-icons` | Builds `@design-studio/icons` package (includes SVGR generation) |
| `build:astudio` | Builds all `@design-studio/*` packages |
| `ds:astudio:sync-versions` | Synchronizes versions across all `@design-studio/*` packages |
| `publish:astudio` | Publishes all `@design-studio/*` packages to Figma org registry |

## Property Test Index

| Property | Test File | Validates |
| -------- | --------- | --------- |
| Property 1: Token Pipeline Determinism | `packages/tokens/src/__tests__/determinism.test.ts` | Req 2.7 |
| Property 2: Token Alias Map Validity | `packages/tokens/src/__tests__/alias-map.test.ts` | Req 2.3 |
| Property 3: Mode Completeness | `packages/tokens/src/__tests__/modes.test.ts` | Req 2.6 |
| Property 4: Contrast Thresholds | `packages/tokens/src/__tests__/contrast.test.ts` | Req 8.2 |
| Property 5: No Parallel Components | `packages/ui/src/__tests__/no-parallel.test.ts` | Req 4.3 |
| Property 6: Semantic Token Consumption | `packages/ui/src/__tests__/token-usage.test.ts` | Req 4.10 |
| Property 7: Focus State Contrast | `packages/ui/src/__tests__/focus-contrast.test.ts` | Req 8.3 |
| Property 8: Touch Target Size | `packages/ui/src/__tests__/touch-targets.test.ts` | Req 8.6 |
| Property 9: Icon Category Completeness | `packages/astudio-icons/src/__tests__/category-completeness.test.ts` | Req 20.6 |
| Property 10: Icon Generation Round-Trip | `packages/astudio-icons/src/__tests__/generation-roundtrip.test.ts` | Req 20.5 |

## Notes

- All tasks are required for comprehensive coverage
- Each gate has a testable Definition of Done
- Property tests validate universal correctness properties
- ESLint waivers require expiration dates to prevent permanent debt
- Coverage matrix JSON is authoritative; markdown is derived
- apps-sdk-ui version appears in: token manifest, upstream alignment log, coverage matrix JSON
- G6 packages (`@design-studio/*`) are published to Figma's org private registry, not npm public
- Figma Make requires React 18+ and Vite compatibility for all packages
- Icon SVG sources are the single source of truth; React components are generated via SVGR
- Guidelines folder is critical for Make AI to use components correctly
