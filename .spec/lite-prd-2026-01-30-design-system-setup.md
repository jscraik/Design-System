# Lite PRD — Design System Setup (Demo-Grade)

Date: 2026-01-30

This PRD is demo-grade and focuses on proving consistency across tokens → components → templates → platform surfaces while the design system is WIP.  
Evidence: docs/design-system/CHARTER.md; docs/architecture/DESIGN_SYSTEM_FLOW.md

## 1. One-Sentence Problem
UI engineers building ChatGPT surfaces struggle to keep UI consistent because the design system is still stabilizing and token/component/template alignment can drift, resulting in visual inconsistency and rework.  
Evidence: docs/design-system/CHARTER.md; docs/design-system/UPSTREAM_ALIGNMENT.md; Evidence gap: no explicit PRD statement of this problem exists in repo.

## 2. Demo Goal (What Success Looks Like)
The demo succeeds when token consistency is guaranteed (zero drift between tokens → theme → components), verified by automated, visual, and manual checks on every PR plus scheduled audits.  
Evidence: docs/design-system/UPSTREAM_ALIGNMENT.md; packages/ui/src/tests/design-system-policy.test.ts; platforms/web/apps/storybook/README.md; Evidence gap: explicit success metrics not documented in a PRD.

**Non-goals (demo):** No new components; no new tokens (fixes only).  
Evidence: docs/design-system/CHARTER.md (scope + governance); Evidence gap: non-goals not enumerated in repo PRD.

## 3. Target User (Role-Based)
Primary user: UI engineer/design-system maintainer working in the monorepo, building or updating components and templates under governance rules.  
Evidence: docs/design-system/CHARTER.md (audience + governance); docs/guides/COMPONENT_CREATION.md (developer workflow)

Constraint: Must follow Apps SDK UI first, avoid raw tokens, keep Storybook as visual source of truth, and pass strict a11y checks across all surfaces.  
Evidence: docs/guides/DESIGN_GUIDELINES.md; packages/ui/eslint-rules-apps-sdk-first.js; packages/widgets/tests/a11y.spec.ts; Evidence gap: explicit PRD constraint list not present.

## 4. Core Use Case (Happy Path)
**Start condition:** Engineer needs to verify a design-system change doesn’t introduce token drift.  
Evidence: docs/design-system/UPSTREAM_ALIGNMENT.md; packages/ui/src/tests/design-system-policy.test.ts

**Flow:**
1) Update or inspect tokens in DTCG + generated outputs (fixes only).  
Evidence: packages/tokens/README.md
2) View the token-driven DesignSystemDocs surface in Storybook (visual source of truth).  
Evidence: packages/ui/STORYBOOK_GUIDE.md; packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
3) Align design-system templates only (no new components).  
Evidence: platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx; Evidence gap: explicit template alignment policy not documented.
4) Run drift detection: automated checks + Storybook visual regression + manual review (Storybook + PR + scheduled audit).  
Evidence: packages/ui/src/tests/design-system-policy.test.ts; platforms/web/apps/storybook/README.md; Evidence gap: explicit manual review policy not documented.
5) Run strict a11y checks across all surfaces.  
Evidence: packages/widgets/tests/a11y.spec.ts; Evidence gap: strict mode requirement not documented.

**End condition:** All checks pass and Storybook shows consistent tokens and components across surfaces with zero drift.  
Evidence: packages/ui/STORYBOOK_GUIDE.md; docs/design-system/CONTRACT.md

## 5. Functional Decisions (What It Must Do)
| ID | Function | Notes |
|----|----------|-------|
| F1 | Use DTCG tokens as source of truth and generate CSS outputs | Fixes only; no new tokens. |
| F2 | Provide a single token-driven DesignSystemDocs surface | Storybook is canonical visual source. |
| F3 | Enforce Apps SDK UI alignment via coverage matrix + lint rules | Apps SDK first migration posture. |
| F4 | Align design-system templates only | No new components. |
| F5 | Drift detection via automated + visual + manual review | Any drift blocks acceptance. |
| F6 | Strict a11y checks across all surfaces | Run with strict mode and block on failures. |
Evidence: docs/architecture/DESIGN_SYSTEM_FLOW.md; docs/design-system/COVERAGE_MATRIX.md; packages/ui/eslint-rules-apps-sdk-first.js; platforms/web/apps/storybook/README.md; packages/widgets/tests/a11y.spec.ts

## 6. UX Decisions (What the Experience Is Like)
### 6.1 Entry Point
Design system docs are accessed through Storybook, which is the visual source of truth.  
Evidence: packages/ui/STORYBOOK_GUIDE.md; platforms/web/apps/storybook/README.md

### 6.2 Inputs
No user inputs required; navigation is via tabs and copy actions inside the docs surface.  
Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx; Evidence gap: detailed UX spec not present.

### 6.3 Outputs
Token swatches, typography, spacing, icons, and usage guidance in a single surface.  
Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx; packages/ui/src/design-system/showcase/docs/ColorsTab.tsx

### 6.4 Feedback & States
Provide non-blocking feedback for copy actions and navigation; failures should surface clearly.  
Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx; Evidence gap: explicit state spec not documented.

### 6.5 Errors (Minimum Viable Handling)
If token data fails to load, show a safe fallback or empty state with guidance.  
Evidence gap: no explicit error-state spec found.

## 7. Data & Logic (At a Glance)
### 7.1 Inputs
- DTCG token source (`index.dtcg.json`)
- Generated CSS token outputs
- Apps SDK UI version pin
Evidence: packages/tokens/README.md; docs/design-system/UPSTREAM_ALIGNMENT.md

### 7.2 Processing
DTCG → generated CSS → theme mapping → components/templates → Storybook & app surfaces.  
Evidence: docs/architecture/DESIGN_SYSTEM_FLOW.md; packages/ui/src/styles/theme.css

### 7.3 Outputs
- Design-system docs UI (Storybook + design-system templates)
- Lint/policy/QA results demonstrating alignment
Evidence: packages/ui/STORYBOOK_GUIDE.md; packages/ui/src/tests/design-system-policy.test.ts

## Evidence Gaps
- No dedicated PRD/roadmap describing design system goals and success metrics beyond governance docs.  
Evidence gap: repo scan did not locate PRD/roadmap.
- Manual review policies and strict a11y requirements are not documented explicitly.  
Evidence gap: no doc found that codifies these decisions.

## Evidence Map
| Source | Why it matters |
| --- | --- |
| docs/design-system/CHARTER.md | Governance scope + Apps SDK UI rules |
| docs/design-system/CONTRACT.md | Contract index + required gates |
| docs/design-system/COVERAGE_MATRIX.md | Coverage + fallback policy |
| docs/design-system/UPSTREAM_ALIGNMENT.md | Upstream pin + drift expectations |
| docs/architecture/DESIGN_SYSTEM_FLOW.md | Token → theme → components pipeline |
| packages/tokens/README.md | Token source of truth + generation/validation |
| packages/ui/src/styles/theme.css | Semantic token mapping + theme wiring |
| packages/ui/src/tests/design-system-policy.test.ts | Coverage matrix + raw token guards |
| packages/ui/eslint-rules-apps-sdk-first.js | Apps SDK re-export enforcement |
| packages/ui/eslint-rules-no-raw-tokens.js | Raw token enforcement |
| packages/ui/STORYBOOK_GUIDE.md | Storybook QA surface |
| platforms/web/apps/storybook/README.md | Storybook app operations |
| platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx | Template entrypoint |
| packages/ui/src/design-system/showcase/DesignSystemDocs.tsx | Token-driven docs surface |
| packages/widgets/tests/a11y.spec.ts | Widget a11y checks |
| scripts/theme-propagation.test.mjs | Theme propagation tests |
