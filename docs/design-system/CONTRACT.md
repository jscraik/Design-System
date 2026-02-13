# UI Design System Contract Index

Last updated: 2026-01-09
Owner: Jamie Scott Craik (@jscraik)
Review cadence: Every release or monthly (whichever is sooner)

This index links all governing artifacts for the UI design system.

## Governance

- Charter: `docs/design-system/CHARTER.md`
- Upstream alignment: `docs/design-system/UPSTREAM_ALIGNMENT.md`
- RFC template: `docs/workflows/RFC_TEMPLATE.md`
- Transcripts index (training/reference): `docs/transcripts/README.md`

## Tokens

- DTCG source of truth: `packages/tokens/src/tokens/index.dtcg.json`
- Schema version: `packages/tokens/SCHEMA_VERSION`
- Schema definition: `packages/tokens/schema/dtcg.schema.json`
- Alias map: `packages/tokens/src/alias-map.ts`

### Token Tiering (Brand → Alias → Mapped)

- **Brand (raw values):** `packages/tokens/src/tokens/index.dtcg.json` → `packages/tokens/src/foundations.css`
- **Alias (semantic intent):** `packages/tokens/src/alias-map.ts`
- **Mapped (usage slots):** `packages/ui/src/styles/theme.css` (`@theme inline` variables)

**Policy:** Raw hex values must appear only in the Brand tier. Alias values must reference Brand paths. Mapped tokens must be the only values used by UI components and templates.

### Responsive Collection (Typography + Spacing)

- **Purpose:** Defines responsive typography and spacing scales across breakpoints (hero, h1–h6, paragraph lg/md/sm/caption, line-height, paragraph spacing).  
- **Sources:** `type`, `space`, and `size` groups in `packages/tokens/src/tokens/index.dtcg.json` and generated outputs in `packages/tokens/src/foundations.css` and `packages/ui/src/styles/theme.css`.  
- **Accessibility constraint:** base paragraph size (`paragraph.md`) MUST resolve to 16px equivalent.  

**Policy:** UI components must consume responsive tokens; no raw px values for responsive typography/spacing.  

### Collection Rules (enforced)

Full rule sets live in dedicated files:

- **Brand collection:** `docs/design-system/collections/brand-collection-rules.md`
- **Alias collection:** `docs/design-system/collections/alias-collection-rules.md`
- **Mapped collection:** `docs/design-system/collections/mapped-collection-rules.md`
- **Responsive collection:** `docs/design-system/collections/responsive-collection-rules.md`

**Mode Cleanup Rules**
- Consolidate light/dark or desktop/mobile into single collections with modes.

Evidence: docs/transcripts/rYzstFEY0t8.cleaned.md

## Coverage and Enforcement

- Coverage matrix (JSON): `docs/design-system/COVERAGE_MATRIX.json`
- Coverage matrix (MD): `docs/design-system/COVERAGE_MATRIX.md`
- Coverage matrix surface usage: `docs/design-system/COVERAGE_MATRIX_SURFACES.json`
- Matrix generator: `scripts/generate-coverage-matrix.ts`
- Policy enforcement rules: `scripts/policy/run.mjs`
- QA evidence schema: `docs/operations/QA_EVIDENCE_SCHEMA.md`
- Governance security/privacy: `docs/operations/GOVERNANCE_SECURITY_PRIVACY.md`

## Export Naming Policy

- Apps SDK UI components are re-exported with the `AppsSDK*` prefix (for example, `AppsSDKButton`).
- Local components must not duplicate upstream Apps SDK UI capabilities; prefer wrappers or re-exports.
- Any fallback component must live under `components/**/fallback/**` with required metadata headers.

## QA Gates

- Token validation: `pnpm validate:tokens`
- Token generation: `pnpm generate:tokens`
- Token parity checks: `pnpm tokens:validate`
- Coverage matrix check: `pnpm ds:matrix:check`
- Linting: `pnpm lint` (Biome) + `pnpm test:policy`
- Drift suite: `pnpm test:drift`
- Storybook a11y: `pnpm storybook:test`
- Widget a11y: `pnpm test:a11y:widgets:ci`
- UI verification (includes focus/touch property tests): `pnpm test`
- Bundle size budgets: `pnpm bundle:monitor:strict`

### Token Tiering Checklist (manual gate)
- Brand tier contains all raw values (DTCG + foundations output).  
- Alias tier maps only to Brand paths (no raw hex).  
- Mapped tier is the only source used by UI components/templates.  
- Responsive collection covers heading + paragraph scales with line-height + spacing, and paragraph.md resolves to 16px.
- Collections follow transcript rules (brand/alias/mapped/responsive + modes consolidation).

## Required Updates When Changing UI

- Update component docs and coverage matrix.
- Run drift tests if apps-sdk-ui changes.
- Include migration notes for breaking changes.
