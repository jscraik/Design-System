# UX Spec — Design System Setup

## A) Mental model alignment
- What the user believes is happening: Updating tokens and components should automatically make Storybook and templates consistent across surfaces.  
Evidence: docs/architecture/DESIGN_SYSTEM_FLOW.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- What we must reinforce: Storybook is the visual source of truth and zero drift is required.  
Evidence: packages/ui/STORYBOOK_GUIDE.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- What we must never imply: Raw tokens or ad-hoc styling are acceptable in any surface.  
Evidence: packages/ui/eslint-rules-no-raw-tokens.js; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## B) Information architecture
Entities the user encounters:
- Tokens: DTCG source + generated CSS outputs.  
  Evidence: packages/tokens/README.md
- Theme mapping: semantic CSS variables from foundation tokens.  
  Evidence: packages/ui/src/styles/theme.css
- Design-system docs: Storybook docs surface with tabs for foundations and usage.  
  Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
- Coverage matrix: component mapping + fallback rules.  
  Evidence: docs/design-system/COVERAGE_MATRIX.md
- QA gates: lint/policy, visual regression, a11y checks.  
  Evidence: packages/ui/src/tests/design-system-policy.test.ts; packages/widgets/tests/a11y.spec.ts

Navigation structure:
- Storybook navigation to Design System → DesignSystemDocs with tabbed sections.  
Evidence: packages/ui/STORYBOOK_GUIDE.md; packages/ui/src/design-system/showcase/DesignSystemDocs.tsx

## C) Affordances & actions
For DesignSystemDocs surface:
- Clickable: tab navigation, copy-to-clipboard buttons for tokens.  
  Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
- Editable: none (read-only documentation surface).  
  Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
- Destructive: none.  
  Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
- Needs confirmation: none.  
  Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
- Disabled and why: none documented.  
  Evidence gap: no explicit disabled state spec found.

### C.1) Micro‑interaction states (tabs + copy controls)
- Tabs: hover (subtle background), focus (visible ring), active (accent underline), disabled (muted + no pointer).  
  Evidence gap: micro‑interaction states not documented in repo.
- Copy buttons: hover (icon emphasis), active (brief scale/feedback), success (checkmark or toast), reduced‑motion alternative (static state change).  
  Evidence gap: micro‑interaction states not documented in repo.

## D) System feedback states
For DesignSystemDocs:
- Empty state: show a neutral “No token data available” panel with guidance to regenerate tokens.  
  Evidence gap: state behavior not documented in repo; defined here for clarity.
- Loading state: show a non-blocking skeleton/loader and keep tab chrome visible.  
  Evidence gap: state behavior not documented in repo; defined here for clarity.
- Partial/incomplete data: render available sections and mark missing tabs as “Unavailable.”  
  Evidence gap: state behavior not documented in repo; defined here for clarity.
- Error state(s): show an inline error banner with next steps (regenerate tokens, rerun tests).  
  Evidence gap: state behavior not documented in repo; defined here for clarity.
- Degraded mode: if Storybook build fails, surface an explicit failure notice and treat the change as blocked.  
  Evidence gap: no explicit degraded-mode policy in repo docs.
- Permissions/auth state: not applicable (local docs surface).  
  Evidence: packages/ui/STORYBOOK_GUIDE.md

### D.1) Motion + reduced‑motion policy
- Motion intent: micro‑interactions communicate state (tab change, copy success) with ≤150ms transitions.  
  Evidence gap: motion policy not documented in repo.
- Reduced‑motion: replace animated transitions with instant state changes and persistent visual cues.  
  Evidence gap: reduced‑motion rules not documented in repo.

### D.2) Success confirmation cues
- Storybook visual truth: confirmation is the presence of all DS tabs with no visual diffs flagged.  
  Evidence: packages/ui/STORYBOOK_GUIDE.md; Evidence gap: explicit success cues not documented.
- Copy success: show a success indicator (icon or toast) that confirms token copy.  
  Evidence gap: explicit success cues not documented in repo.

## E) UX acceptance criteria (testable)
- Given a user opens Storybook, when they navigate to DesignSystemDocs, then the surface renders tokens, typography, spacing, icons, and usage tabs without drift.  
Evidence: packages/ui/STORYBOOK_GUIDE.md; packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
- Given a design-system template renders in web, when compared to Storybook, then colors and typography match the canonical docs.  
Evidence: platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx; packages/ui/src/styles/theme.css
- Given a raw token is introduced, when lint/policy checks run, then the build fails.  
Evidence: packages/ui/eslint-rules-no-raw-tokens.js; packages/ui/src/tests/design-system-policy.test.ts
- Given a visual diff exists in Storybook, when visual regression runs, then the change is blocked.  
Evidence: platforms/web/apps/storybook/README.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Given a11y violations occur on any surface, when strict checks run, then the merge is blocked.  
Evidence: packages/widgets/tests/a11y.spec.ts; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Given a tab or copy action occurs, when reduced‑motion is enabled, then state changes are non‑animated but still visible.  
Evidence gap: reduced‑motion behavior not documented in repo.

## F) Visual drift rubric
- Drift includes: token mismatch, typography scale mismatch, spacing scale mismatch, or color swatch inconsistency.  
  Evidence gap: visual drift rubric not documented in repo.
- Non‑drift changes: layout rearrangements inside non‑DS templates (out of scope).  
  Evidence gap: visual drift rubric not documented in repo.

## Evidence Gaps
- Explicit state design (loading/empty/error/partial/degraded) for DesignSystemDocs is not documented.  
Evidence gap: no state-spec doc found.
- Motion and micro‑interaction rules are not documented in repo docs.  
Evidence gap: no motion policy found.
- Visual drift rubric is not codified in repo docs.  
Evidence gap: no rubric found.

## Evidence Map
| Source | Why it matters |
| --- | --- |
| docs/architecture/DESIGN_SYSTEM_FLOW.md | Mental model for token flow |
| packages/tokens/README.md | Token entity definition |
| packages/ui/src/styles/theme.css | Theme mapping entity |
| packages/ui/src/design-system/showcase/DesignSystemDocs.tsx | Docs surface + affordances |
| packages/ui/STORYBOOK_GUIDE.md | Storybook navigation + usage |
| docs/design-system/COVERAGE_MATRIX.md | Coverage matrix entity |
| packages/ui/src/tests/design-system-policy.test.ts | Policy gate evidence |
| packages/ui/eslint-rules-no-raw-tokens.js | Raw token prohibition |
| platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx | Template parity surface |
| packages/widgets/tests/a11y.spec.ts | A11y gate evidence |
| .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md | User-confirmed decisions |
