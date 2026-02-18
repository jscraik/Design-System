# Foundation Spec — Design System Setup

## 1) One-sentence summary
Ensure the design system enforces zero token drift across tokens → theme → components → templates → surfaces, with Storybook as the visual source of truth.  
Evidence: docs/design-system/CHARTER.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 2) Core problem (single sentence)
UI engineers struggle to keep ChatGPT surfaces consistent because the system is WIP and alignment can drift between tokens, components, templates, and tests, causing visual inconsistency and rework.  
Evidence: docs/design-system/CHARTER.md; docs/design-system/UPSTREAM_ALIGNMENT.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

Anti-goal: introducing new components or new tokens as part of this effort.  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 3) Target user + context
- Primary user: Design-system maintainer / UI engineer working in the monorepo.  
  Evidence: docs/design-system/CHARTER.md; docs/guides/COMPONENT_CREATION.md
- Job they are trying to accomplish: keep components and templates aligned with token foundations and Apps SDK UI.  
  Evidence: docs/design-system/CHARTER.md; docs/design-system/COVERAGE_MATRIX.md
- When/where this happens: during PR reviews, Storybook validation, and scheduled audits.  
  Evidence: platforms/web/apps/storybook/README.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Current workaround(s): manual spot checks + drift suite run notes; no single PRD defining success.  
  Evidence: docs/design-system/UPSTREAM_ALIGNMENT.md; Evidence gap: no PRD/roadmap file found.
- Constraints: local dev + CI only; no backend services, no auth, no PII handling.  
  Evidence gap: not explicitly documented in repo; included as scope constraint.

## 4) Success
- Primary metric: zero drift detected between tokens → theme → components (any drift blocks acceptance).  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Guardrails: strict a11y across all surfaces, block on any Storybook visual diff, no raw tokens anywhere.  
  Evidence: packages/widgets/tests/a11y.spec.ts; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Activation definition: a DS change passes automated checks + Storybook visuals + manual review and is visible in Storybook as the canonical output.  
  Evidence: packages/ui/STORYBOOK_GUIDE.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Measurement method + cadence: per‑PR gates (drift=0, visual diffs=0, a11y violations=0, test pass rate=100%) plus monthly audits.  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md; Evidence gap: no repo doc codifies numeric gates.

## 4.1) Risks & tradeoffs (PM view)
- Risk: zero‑drift + no‑waiver policy may slow iteration; tradeoff is higher consistency and lower UX regressions.  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Risk: strict a11y across all surfaces may surface legacy violations; tradeoff is higher accessibility compliance.  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md; packages/widgets/tests/a11y.spec.ts

## 4.2) Transcript‑derived recommendations
- Use explicit rules to generate tokens and import into Token Studio; treat output as draft and audit for missing aliases or misplaced typography.  
  Evidence: docs/transcripts/rYzstFEY0t8.cleaned.md
- Maintain four collections: Brand → Alias → Mapped + Responsive (type/spacing); alias must reference brand and mapped is the only tier used by components.  
  Evidence: docs/transcripts/rYzstFEY0t8.cleaned.md; docs/transcripts/L-tpK7Eeuow.cleaned.md
- Merge separate light/dark or desktop/mobile collections into single collections with modes to simplify mode‑swap.  
  Evidence: docs/transcripts/rYzstFEY0t8.cleaned.md
- For responsive “jumper” variables, define only the combinations used in designs (design‑first audit).  
  Evidence: docs/transcripts/L-tpK7Eeuow.cleaned.md
- Use numeric **100-scale** naming (expandable with 50/25 steps) instead of “light/dark” labels to keep scales extensible.  
  Evidence: docs/transcripts/L-tpK7Eeuow.md
- Build lighter tints from **white** and darker shades from **black** to preserve scale math; deviations require explicit rationale.  
  Evidence: docs/transcripts/L-tpK7Eeuow.md
- Keep size/spacing scales aligned to a **single base grid** (multiples of 4 or 8) to avoid inconsistent jumps.  
  Evidence: docs/transcripts/L-tpK7Eeuow.md
- Keep the scope starter‑system oriented: focus on foundational components + publishing workflow rather than advanced theming.  
  Evidence: docs/transcripts/opTANvl9G1g.cleaned.md

## 5) MVP scope
### Must-have
- Align design-system docs to a single token-driven implementation.  
  Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
- Enforce Apps SDK UI-first posture when upstream coverage exists.  
  Evidence: docs/design-system/CHARTER.md; packages/ui/eslint-rules-apps-sdk-first.js
- Allow token changes only for fixes (no new tokens).  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Align design-system templates only (no new components).  
  Evidence: platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Run automated + visual + manual drift detection on every PR and scheduled audits.  
  Evidence: packages/ui/src/tests/design-system-policy.test.ts; platforms/web/apps/storybook/README.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Enforce strict a11y across all surfaces.  
  Evidence: packages/widgets/tests/a11y.spec.ts; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

### Explicitly out of scope (for V1)
- New component creation.  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- New token creation (fixes only).  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Non–design-system templates or app-specific redesigns.  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 6) User stories (top 5–10)
1. As a DS maintainer, I want Storybook to be the visual source of truth so that I can detect drift quickly.  
   - Acceptance criteria: Given a DS change, when Storybook runs, then diffs are detected and block merges if any visual drift appears.  
   - Edge cases: Storybook build fails; visual diff is unrelated to DS templates.  
   Evidence: packages/ui/STORYBOOK_GUIDE.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

2. As a DS maintainer, I want automated checks to prevent raw token usage anywhere so that token drift is eliminated.  
   - Acceptance criteria: Given a raw token usage, when lint/policy runs, then the build fails.  
   - Edge cases: Raw tokens in docs or generated outputs.  
   Evidence: packages/ui/eslint-rules-no-raw-tokens.js; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

3. As a DS maintainer, I want Apps SDK UI-first enforcement so that upstream parity improves over time.  
   - Acceptance criteria: Given an upstream component exists, when a local equivalent is imported, then lint fails with a preferred re-export message.  
   - Edge cases: Allowed fallback paths or missing coverage matrix entries.  
   Evidence: packages/ui/eslint-rules-apps-sdk-first.js; docs/design-system/COVERAGE_MATRIX.md

4. As a UI engineer, I want design-system templates aligned to the token-driven docs so that web surfaces match Storybook.  
   - Acceptance criteria: Given a design-system template, when rendered, then colors/spacing/typography match Storybook outputs.  
   - Edge cases: Template references legacy foundation tokens or stale CSS.  
   Evidence: platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx; packages/ui/src/styles/theme.css

5. As a DS maintainer, I want strict a11y checks across all surfaces so that regressions are blocked.  
   - Acceptance criteria: Given a widget or Storybook page, when a11y checks run with strict mode, then violations block merge.  
   - Edge cases: Third-party widget content or flaky a11y results.  
   Evidence: packages/widgets/tests/a11y.spec.ts; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

6. As a DS maintainer, I want a staged rollout (Storybook → web → widgets) so that issues are detected before broader exposure.  
   - Acceptance criteria: Given a DS change, when it is released, then Storybook validation precedes web and widget adoption.  
   - Edge cases: Urgent fixes requiring accelerated rollout.  
   Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 7) Primary journey (happy path)
1) Update/fix tokens in DTCG and regenerate outputs.  
Evidence: packages/tokens/README.md
2) Verify token-driven DesignSystemDocs in Storybook (visual truth).  
Evidence: packages/ui/STORYBOOK_GUIDE.md; packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
3) Align design-system templates to match Storybook outputs.  
Evidence: platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx
4) Run automated policy checks + Storybook visual regression + manual review.  
Evidence: packages/ui/src/tests/design-system-policy.test.ts; platforms/web/apps/storybook/README.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
5) Confirm strict a11y checks across all surfaces.  
Evidence: packages/widgets/tests/a11y.spec.ts; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## Evidence Gaps
- No dedicated PRD/roadmap defines activation metrics or release policy in repo docs.  
Evidence gap: repo scan did not locate PRD/roadmap.
- Numeric success thresholds and local‑only constraints are not codified in repo docs.  
Evidence gap: no governance doc lists these values.

## Evidence Map
| Source | Why it matters |
| --- | --- |
| docs/design-system/CHARTER.md | Governance scope + Apps SDK UI rules |
| docs/design-system/UPSTREAM_ALIGNMENT.md | Drift context + upstream alignment |
| docs/design-system/COVERAGE_MATRIX.md | Component coverage + fallback metadata |
| packages/tokens/README.md | Token source of truth + generation/validation |
| packages/ui/STORYBOOK_GUIDE.md | Storybook as QA surface |
| platforms/web/apps/storybook/README.md | Storybook operations + verification |
| packages/ui/eslint-rules-no-raw-tokens.js | Raw token enforcement |
| packages/ui/eslint-rules-apps-sdk-first.js | Apps SDK-first enforcement |
| packages/ui/src/tests/design-system-policy.test.ts | Policy gate coverage |
| packages/ui/src/design-system/showcase/DesignSystemDocs.tsx | Token-driven docs surface |
| packages/ui/src/styles/theme.css | Token → theme mapping |
| platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx | Template alignment surface |
| packages/widgets/tests/a11y.spec.ts | Strict a11y surface coverage |
| .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md | User-confirmed decisions |
| docs/transcripts/rYzstFEY0t8.cleaned.md | Token workflow + 3‑tier + responsive rules |
| docs/transcripts/L-tpK7Eeuow.cleaned.md | Responsive “jumper” variables guidance |
| docs/transcripts/opTANvl9G1g.cleaned.md | Starter system + publishing focus |
| docs/design-system/collections/brand-collection-rules.md | Codified brand collection rules |
| docs/design-system/collections/alias-collection-rules.md | Codified alias collection rules |
| docs/design-system/collections/mapped-collection-rules.md | Codified mapped collection rules |
| docs/design-system/collections/responsive-collection-rules.md | Codified responsive collection rules |
