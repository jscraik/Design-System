# UI Design System Contract Index

Last updated: 2026-01-09

This index links all governing artifacts for the UI design system.

## Governance

- Charter: `docs/design-system/CHARTER.md`
- Upstream alignment: `docs/design-system/UPSTREAM_ALIGNMENT.md`

## Tokens

- DTCG source of truth: `packages/tokens/src/tokens/index.dtcg.json`
- Schema version: `packages/tokens/SCHEMA_VERSION`
- Schema definition: `packages/tokens/schema/dtcg.schema.json`
- Alias map: `packages/tokens/src/alias-map.ts`

## Coverage and Enforcement

- Coverage matrix (JSON): `docs/design-system/COVERAGE_MATRIX.json`
- Coverage matrix (MD): `docs/design-system/COVERAGE_MATRIX.md`
- Matrix generator: `scripts/generate-coverage-matrix.ts`
- ESLint enforcement rules: `packages/ui/eslint-rules-*.js`

## Export Naming Policy

- Apps SDK UI components are re-exported with the `AppsSDK*` prefix (for example, `AppsSDKButton`).
- Local components must not duplicate upstream Apps SDK UI capabilities; prefer wrappers or re-exports.
- Any fallback component must live under `components/**/fallback/**` with required metadata headers.

## QA Gates

- Token validation: `pnpm validate:tokens`
- Token generation: `pnpm generate:tokens`
- Token parity checks: `pnpm tokens:validate`
- Coverage matrix check: `pnpm ds:matrix:check`
- Linting: `pnpm lint`
- Drift suite: `pnpm test:drift`
- Storybook a11y: `pnpm storybook:test`
- Widget a11y: `pnpm test:a11y:widgets:ci`
- UI verification (includes focus/touch property tests): `pnpm test`
- Bundle size budgets: `pnpm bundle:monitor:strict`

## Required Updates When Changing UI

- Update component docs and coverage matrix.
- Run drift tests if apps-sdk-ui changes.
- Include migration notes for breaking changes.
