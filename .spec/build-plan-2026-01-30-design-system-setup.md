# Build Plan — Design System Setup

## 0) Outcome → opportunities → solution
- Outcome: Zero drift between tokens → theme → components → templates, with Storybook as visual source of truth.  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md; packages/ui/STORYBOOK_GUIDE.md
- Top user opportunities: remove duplicate docs sources, tighten policy gates, align design-system templates only.  
Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx; packages/ui/src/tests/design-system-policy.test.ts; platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx
- Chosen solution: consolidate docs to token-driven surface, enforce Apps SDK-first + no raw tokens, and require strict a11y + visual regression for all surfaces.  
Evidence: packages/ui/eslint-rules-apps-sdk-first.js; packages/ui/eslint-rules-no-raw-tokens.js; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Why alternatives were rejected: Allowing drift or waivers undermines the primary success metric.  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 0.1) Key assumptions & risks (top 3–5)
| Assumption | Impact | Uncertainty | Mitigation |
| --- | --- | --- | --- |
| Storybook remains the canonical visual source | High | Low | Enforce visual regression on every PR |
| Strict a11y across all surfaces is feasible | High | Medium | Stage rollout, fix violations per surface |
| No new components needed for alignment | Medium | Medium | Validate against coverage matrix gaps |
| Zero drift tolerance is achievable | High | Medium | Tighten automation + manual review |
| Token fixes only are sufficient | Medium | Medium | Escalate if new token required |
Evidence: packages/ui/STORYBOOK_GUIDE.md; docs/design-system/COVERAGE_MATRIX.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 0.2) Performance budgets (frontend)
- Storybook DesignSystemDocs initial render ≤ 2s on dev machine; template render ≤ 1s after first load.  
Evidence gap: no performance budgets documented in repo.

## 0.3) Reliability SLOs
- Drift SLO: 0 drift occurrences per PR and per monthly audit.  
- Visual diff SLO: 0 diffs per PR.  
- A11y SLO: 0 violations across Storybook/web/widgets in strict mode.  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md; Evidence gap: numeric SLOs not codified in repo docs.

## 0.4) Security & data scope
- No authN/authZ changes; no PII; local dev + CI only.  
Evidence gap: not explicitly documented in repo.

## 0.5) Data/ML applicability
- Data/ML pipelines and model evals are out of scope.  
Evidence gap: no explicit data/ML scope statement in repo.

## 1) Epics (sequenced)
Epic 1: Token-driven documentation consolidation and drift elimination.  
Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx
Epic 2: Policy/QA gate tightening (Apps SDK-first, no raw tokens, strict a11y, visual regression).  
Evidence: packages/ui/eslint-rules-apps-sdk-first.js; packages/widgets/tests/a11y.spec.ts
Epic 3: Design-system template alignment and staged rollout across surfaces.  
Evidence: platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 1.1) CI/CD gate commands (required)
- `pnpm lint` + `pnpm test:policy`  
- `pnpm ds:matrix:check`  
- `pnpm test:drift`  
- `pnpm storybook:test` and `pnpm test:visual:storybook`  
- `pnpm test:a11y:widgets:ci`  
Evidence: docs/design-system/CONTRACT.md

## 2) Stories per epic (each w/ AC)
### Epic 1 — Docs consolidation
- Story: Make DesignSystemDocs a single token-driven implementation for all surfaces.  
  - Acceptance criteria: Given DesignSystemDocs is imported, when used in templates and Storybook, then it renders identical token-driven content with no raw tokens.  
  - Telemetry/events: Drift count (0), Storybook render status.  
  - Tests: Visual regression snapshots + policy checks.  
  Evidence: packages/ui/src/design-system/showcase/DesignSystemDocs.tsx; packages/ui/eslint-rules-no-raw-tokens.js

### Epic 2 — Policy/QA gates
- Story: Enforce Apps SDK-first imports and no raw tokens across UI code.  
  - Acceptance criteria: Given an upstream component exists, when local imports are used, then lint fails with a preferred re-export.  
  - Telemetry/events: Lint failure counts by rule.  
  - Tests: Lint + policy tests in `design-system-policy.test.ts`.  
  Evidence: packages/ui/eslint-rules-apps-sdk-first.js; packages/ui/src/tests/design-system-policy.test.ts

- Story: Require strict a11y checks across Storybook, web templates, and widgets.  
  - Acceptance criteria: Given any a11y violation, when tests run with strict mode, then the merge is blocked.  
  - Telemetry/events: A11y violation counts; strict-mode pass rate.  
  - Tests: Playwright + Axe with strict enforcement.  
  Evidence: packages/widgets/tests/a11y.spec.ts; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

- Story: Block on any Storybook visual diff.  
  - Acceptance criteria: Given a visual diff, when Storybook visual regression runs, then the pipeline fails.  
  - Telemetry/events: Visual diff count.  
  - Tests: `pnpm test:visual:storybook` (if available).  
  Evidence: platforms/web/apps/storybook/README.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

### Epic 3 — Template alignment + staged rollout
- Story: Align design-system templates only (no new components) to match Storybook.  
  - Acceptance criteria: Given DS templates, when rendered, then tokens/typography/spacing match Storybook outputs.  
  - Telemetry/events: Template snapshot diffs.  
  - Tests: Template registry + visual snapshots.  
  Evidence: platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx; platforms/web/apps/web/src/generated/template-registry.ts

- Story: Implement staged rollout (Storybook → web → widgets) with rollback plan.  
  - Acceptance criteria: Given a DS change, when released, then Storybook validation precedes web and widgets; rollback can revert tokens and component/template changes.  
  - Telemetry/events: Rollout phase status + rollback events.  
  - Tests: Rollback checklist in release verification.  
  Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 2.1) TDD Guidance (non-negotiable for non-trivial work)
- Follow TDD for stories with branching logic and error handling.  
Evidence: /Users/jamiecraik/.codex/instructions/CODESTYLE.md

## 2.2) Component Registry Guidance
- Use existing components; do not add new ones in this scope.  
Evidence: docs/design-system/COVERAGE_MATRIX.md; .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 3) Data + contracts (lightweight)
- Entities: Tokens, themes, components, templates, QA gates.  
Evidence: docs/architecture/DESIGN_SYSTEM_FLOW.md
- Key fields: token ids, CSS var names, coverage matrix metadata, visual snapshot ids.  
Evidence: packages/tokens/README.md; docs/design-system/COVERAGE_MATRIX.md
- API/routes: none (local tooling and Storybook surfaces).  
Evidence: platforms/web/apps/storybook/README.md
- Permissions/auth: none (local dev + CI).  
Evidence: platforms/web/apps/storybook/README.md

## 4) Test strategy
- Unit: policy checks and token validation.  
Evidence: packages/ui/src/tests/design-system-policy.test.ts
- Integration: Storybook + template rendering consistency.  
Evidence: platforms/web/apps/storybook/README.md; platforms/web/apps/web/src/generated/template-registry.ts
- E2E: widget a11y suite and surface navigation.  
Evidence: packages/widgets/tests/a11y.spec.ts
- Failure-mode tests: drift detection, a11y violations, visual diffs.  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 4.1) Fixtures/data strategy
- Use deterministic Storybook args and fixed fixture data for visual/a11y tests to avoid flaky diffs.  
Evidence gap: no explicit fixture strategy documented in repo.

## 5) Release & measurement plan
- Feature flags: none planned; staged rollout substitutes for flags.  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Rollout: staged (Storybook → web → widgets).  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Monitoring: logs + metrics + alerts for drift and test failures.  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md
- Measurement window + owner: per release + monthly audit, owned by design system DRI.  
Evidence: .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md

## 6) DevEx quickstart references
- Storybook dev/test workflow.  
Evidence: packages/ui/STORYBOOK_GUIDE.md; platforms/web/apps/storybook/README.md
- Token generation/validation workflow.  
Evidence: packages/tokens/README.md

## 6.1) Fast local verification (golden path)
- `pnpm test:policy`  
- `pnpm ds:matrix:check`  
- `pnpm test:drift`  
Evidence gap: no single “fast path” documented in repo; derived from contract gates.

## Evidence Gaps
- No repo doc explicitly codifies strict a11y and zero‑drift policy.  
Evidence gap: not found in repo docs.
- Performance budgets, fixture strategy, and SLOs are not codified in repo docs.  
Evidence gap: no spec/guide found.
- Fast local verification sequence is not documented in repo docs.  
Evidence gap: no quick‑path guide found.

## Evidence Map
| Source | Why it matters |
| --- | --- |
| .spec/lite-prd-2026-01-30-design-system-setup-clarification-session.md | User-confirmed policy decisions |
| packages/ui/src/design-system/showcase/DesignSystemDocs.tsx | Token-driven docs surface |
| packages/ui/eslint-rules-apps-sdk-first.js | Apps SDK-first enforcement |
| packages/ui/eslint-rules-no-raw-tokens.js | Raw token enforcement |
| packages/ui/src/tests/design-system-policy.test.ts | Policy gate tests |
| packages/widgets/tests/a11y.spec.ts | A11y gate tests |
| platforms/web/apps/storybook/README.md | Storybook operations |
| platforms/web/apps/web/src/templates/design-system/DesignSystemDocsTemplate.tsx | Template alignment surface |
| platforms/web/apps/web/src/generated/template-registry.ts | Template registry references |
| docs/architecture/DESIGN_SYSTEM_FLOW.md | Token pipeline model |
| docs/design-system/CONTRACT.md | CI/CD gate commands |
| docs/design-system/COVERAGE_MATRIX.md | Component coverage + metadata |
| packages/tokens/README.md | Token generation + validation |
