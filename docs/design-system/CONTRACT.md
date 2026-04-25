# UI Design System Contract Index

Last updated: 2026-04-24
Owner: Jamie Scott Craik (@jscraik)
Review cadence: Every release or monthly (whichever is sooner)

This index links all governing artifacts for the UI design system.

## Table of Contents

- [Governance](#governance)
- [Agent Design Contract](#agent-design-contract)
- [Tokens](#tokens)
- [Coverage and Enforcement](#coverage-and-enforcement)
- [Export Naming Policy](#export-naming-policy)
- [QA Gates](#qa-gates)
- [Required Updates When Changing UI](#required-updates-when-changing-ui)

## Governance

- Charter: `docs/design-system/CHARTER.md`
- Professional UI contract: `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- Agent routing guide: `docs/design-system/AGENT_UI_ROUTING.md`
- Agent design contract guide: `docs/guides/DESIGN_MD_CONTRACT.md`
- Upstream alignment: `docs/design-system/UPSTREAM_ALIGNMENT.md`
- RFC template: `docs/workflows/RFC_TEMPLATE.md`
- Transcripts index (training/reference): `docs/transcripts/README.md`

## Agent Design Contract

- Repo contract: `DESIGN.md`
- Semantic engine: `packages/agent-design-engine`
- Guidance wrapper and compatibility manifest: `packages/design-system-guidance`
- CLI entrypoint: `astudio design ...` in `packages/cli`
- Baseline inventory: `docs/plans/2026-04-24-agent-design-engine-baseline-inventory.md`
- Implementation plan: `docs/plans/2026-04-23-agent-design-engine-plan.md`

`DESIGN.md` owns design contract metadata and body requirements. The guidance
config `.design-system-guidance.json` owns rollout state only. Agents should run
the design CLI before changing UI so they can read the active profile, rule
manifest version, rule pack version, and rule source digests.

Required rule-source provenance for v1:

- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- `docs/design-system/AGENT_UI_ROUTING.md`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/COVERAGE_MATRIX.json`

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
- Component lifecycle manifest: `docs/design-system/COMPONENT_LIFECYCLE.json`
- Enforcement exemptions ledger: `docs/design-system/ENFORCEMENT_EXEMPTIONS.json`
- DESIGN.md contract guide: `docs/guides/DESIGN_MD_CONTRACT.md`
- Agent design rules manifest: `packages/agent-design-engine/rules/agent-design.rules.v1.json`
- Guidance compatibility manifest: `packages/design-system-guidance/src/compatibility.ts`
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
- Agent design engine: `pnpm -C packages/agent-design-engine test`
- Agent design CLI: `pnpm -C packages/cli build` and `pnpm -C packages/cli test`
- Guidance wrapper: `pnpm -C packages/design-system-guidance check:ci`

### Token Tiering Checklist (manual gate)
- Brand tier contains all raw values (DTCG + foundations output).  
- Alias tier maps only to Brand paths (no raw hex).  
- Mapped tier is the only source used by UI components/templates.  
- Responsive collection covers heading + paragraph scales with line-height + spacing, and paragraph.md resolves to 16px.
- Collections follow transcript rules (brand/alias/mapped/responsive + modes consolidation).

## Required Updates When Changing UI

- Update component docs and coverage matrix.
- Update `DESIGN.md` when the UI contract, required states, profile, token
  notes, or component-routing expectations change.
- Run drift tests if apps-sdk-ui changes.
- Include migration notes for breaking changes.
