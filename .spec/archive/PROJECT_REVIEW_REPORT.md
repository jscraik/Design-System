---
schema_version: 1
mode: review
project: aStudio
---

# Project Review Report: aStudio

**Owner:** Jamie Scott Craik (@jscraik)  
**Date:** 2026-01-15  
**Repo:** /Users/jamiecraik/dev/aStudio  
**Audience:** solo dev  
**Inputs reviewed:** README.md | docs/architecture/README.md | docs/architecture/WIDGET_ARCHITECTURE.md | docs/architecture/cross-platform-design.md | docs/architecture/repo-map.md | docs/BUILD_PIPELINE.md | docs/design-system/CHARTER.md | docs/work/work_outstanding.md | package.json

---

## Acceptance Criteria

- [ ] Project review covers executive summary, vision, current state, evidence of usefulness, gap analysis, viability assessment, and realignment plan.
- [ ] Product gaps are documented: persona clarity, user stories, edge cases, success metrics, and component creation guide.
- [ ] Engineering gaps are identified: API/schema definitions, security requirements, error handling, and performance targets.
- [ ] Operational readiness gaps are listed: dashboards/alerts, rollback plan, runbook, and SLOs.
- [ ] Updated vision statement, scope, and success metrics are defined with measurable targets.
- [ ] Recommended plan includes top priorities for next 14 days and follow-up deliverables.

---

## 1) Executive Summary

- **Recommendation:** Continue (focus on validation + operational readiness)
- **Primary goal:** Speed up Jamie’s solo UI development by maximizing component reuse and visual consistency across surfaces.
- **Why:**
  - Clear solo-developer design-system vision centered on UI consistency and component reuse.
  - Strong build pipeline and security hardening documentation already in place.
  - Architecture and design-system governance are documented and consistent with Apps SDK UI.
- **Biggest missing pieces:**
  - Real user demand evidence and success metrics instrumentation.
  - Operational readiness artifacts (SLOs, runbooks, on-call, incident response).
  - Version baseline alignment (Node) with the gold standard policy.
- **Next 14 days:**
  - Define primary use cases for solo-dev UI consistency workflows; confirm success metrics.
  - Instrument core workflows (widget usage, embed success, MCP tool call success).
  - Establish SLOs + runbook for MCP server and widget delivery pipeline.
  - Align toolchain baselines (Node 24 LTS, pnpm, Biome) and document plan.
  - Resolve Storybook browser test failures by moving to Playwright component tests for Radix-heavy stories.

---

## 2) Original Vision (Reconstructed)

- **Vision statement (then):** Build a cross-platform UI workbench that enables consistent UI and reusable components for a solo developer across embedded widgets, web apps, and desktop surfaces.
- **Problem statement:** A solo developer needs consistent, accessible, and maintainable UI across multiple surfaces (ChatGPT widgets, web apps, desktop) without duplicating component logic and tokens.
  -- **Target users/personas:**
  - Primary: Solo developer (Jamie) building ChatGPT widgets and web apps.
  - Secondary: Desktop surface owner needing coverage across React and Apps SDK UI surfaces.
- **Hypothesis:** A single design-system-first monorepo with shared tokens, runtime abstractions, and widget tooling will reduce duplication and accelerate UI delivery across platforms.
- **Success metrics (intended):** Faster component delivery, coverage across surfaces, fewer UI regressions, and streamlined widget builds.

Sources:

- README.md
- docs/architecture/WIDGET_ARCHITECTURE.md
- docs/design-system/CHARTER.md
- docs/architecture/cross-platform-design.md

---

## 3) Current State (Reality Check)

- **What exists today:**
  - Library-first monorepo with `@astudio/ui`, `@astudio/runtime`, `@astudio/tokens`, widget bundles, and MCP server.
  - Web Widget Gallery + Storybook; widget build pipeline; token sync and build pipeline.
  - Security hardening report and extensive test suite documentation.
- **Who is actually using it (if anyone):** Jamie (solo) for design system and component creation; no external usage metrics in reviewed docs.
- **Evidence of pain (baseline):**
  - Median time to ship a new component: ~48 hours (solo dev baseline).
  - UI inconsistency regressions: baseline unknown; needs instrumentation.
- **Architecture snapshot:**
  - Apps SDK UI–first design system, with Radix fallbacks where needed.
  - Host abstraction (`packages/runtime`) for embedded vs standalone environments.
  - Widget build pipeline producing standalone HTML for MCP consumption.
- **Surface coverage (current):**
  - Coverage is partial; many React components are complete while widget/desktop usage still lags.
  - Surface coverage is tracked in `docs/architecture/cross-platform-design.md` and should be treated as a roadmap rather than a completed mirror.
- **Component authoring guidance (current):**
  - Guidance exists but is scattered across docs; a single “component creation” guide for Jamie is not clearly centralized.
  - Relevant sources today:
    - `docs/guides/UI_COMPONENT_TOOLING.md` (component generator and tooling)
    - `docs/architecture/ui-structure-map.md` (where to add components, stories, tests)
    - `docs/architecture/cross-platform-design.md` (token + state requirements)
- **Known constraints/debt:**
  - Storybook browser tests partially failing due to Radix + Vitest browser runner limitations.
  - Local dev servers blocked in sandboxed environments.
  - Toolchain baseline mismatch between docs (Node 18) and gold baseline (Node 24).

---

## 4) Evidence of Usefulness / Demand

- **User feedback:** N/A — solo dev project; current feedback is owner experience.
- **Behavioral signals:** Not found (no activation/usage/retention metrics).
- **Competitive landscape:** Alternative UI kits and platform-specific UI stacks exist, but this repo differentiates via Apps SDK UI alignment + multi-surface coverage.

If evidence is missing:

- Track widget usage in the Widget Gallery and MCP embeds (event logs).
- Add install/download stats for package consumers (npm) and adoption milestones.
- Capture developer experience feedback via internal surveys or issue templates.

---

## 5) Gap Analysis (What’s missing)

### 5.1 Product gaps

- Missing persona clarity: personas are implied but not explicitly documented.
- Missing core user stories: no PRD-level user stories for widget, MCP, and desktop workflows.
- Missing edge cases / failure UX: error/empty-state standards exist but are not consolidated into a product-level requirement set.
- Missing success metrics instrumentation: no measurable KPI targets or telemetry plan.
- Missing centralized component creation guide: no single, end-to-end component authoring checklist for Jamie (React + Apps SDK UI surfaces + tokens + tests).

### 5.2 Engineering gaps

- Missing API/schema definitions: MCP tool contracts are tested but no single source-of-truth spec found in reviewed docs.
- Missing data model constraints/indexes: N/A — primarily UI and tooling repo, but any persistence in MCP/Tauri apps should have explicit data models.
- Missing security requirements: high-level security guidance exists; operational security requirements for MCP runtime (authz, rate limits, audit logs) need explicit, environment-specific definitions.
- Missing error handling: cross-surface error-handling conventions should be consolidated into a single spec and enforced via lint/test.
- Missing performance targets: no clear latency/size budgets for widgets, MCP tool responses, or desktop render paths.

### 5.3 Operational readiness gaps

- Missing dashboards/alerts: no SLO dashboards or alerting doc.
- Missing rollback plan: partial release checklists exist, but rollback playbook for MCP/widgets is not specified.
- Missing runbook: no centralized runbook for MCP server + widget delivery.
- Missing SLOs/error budget policy: no SLO targets or policy defined.

---

## 6) Viability Assessment

- **Problem severity:** High — multi-surface UI consistency is a real cost center and quality risk.
- **Differentiation / wedge:** Apps SDK UI alignment + shared tokens/runtime + MCP widget delivery pipeline.
- **Feasibility:** High — existing architecture and build pipeline are in place; missing pieces are governance and validation rather than core tech.
- **Go-to-market path (even small):**
  - Internal adoption by teams building ChatGPT widgets and embedded UIs.
  - Public-facing widget templates and MCP examples to drive adoption.
- **Biggest assumptions:**
  - Teams will adopt a unified UI system across React and Apps SDK UI surfaces.
  - Widget demand will justify sustained maintenance.
  - Apps SDK UI alignment will remain stable enough to build on.
- **Kill criteria:**
  - No active widget or UI package consumers after 2–3 quarters.
  - High maintenance burden vs. value delivered (e.g., coverage debt exceeds adoption).
  - Solo-dev time cost exceeds measurable time saved for 2 consecutive quarters (threshold: >25% time overhead vs baseline).

---

## 7) Realignment Plan

### Updated vision statement (now)

Provide a production-grade, Apps SDK UI–aligned cross-platform UI workbench with measurable adoption and operational readiness for ChatGPT widgets, React apps, and desktop surfaces.

### Updated scope

- In:
  - Widget delivery pipeline, MCP integration, and UI coverage via shared tokens.
  - Governance artifacts (SLOs, runbooks, release checklists, metrics).
  - Developer experience tooling and documentation.
  - Production-ready MCP allowlist authN/Z policy and tool capability scoping.
  - Canonical MCP tool contract spec stored with code, referenced in runbook.
- Out:
  - Non-UI backend services unrelated to widget/UI contracts.
  - Marketing sites or non-production experiments.

### Updated success metrics

| Metric                                |                                            Target | Window      | Source                             |
| ------------------------------------- | ------------------------------------------------: | ----------- | ---------------------------------- |
| Widget render success rate            |                                           ≥ 99.5% | 30d         | MCP server logs + client telemetry |
| Widget build time (P95)               |                                           ≤ 5 min | 30d         | CI build logs                      |
| Component reuse rate                  |    ≥ 70% of new UI built from existing components | 30d         | repo stats + design system audit   |
| UI consistency regressions            |                      ≤ 2 visual diffs per release | per release | visual regression reports          |
| Time to new component (idea → merged) | Baseline: 1 day median → Target: ≤ 2 hours median | 30d         | PR timestamps + changelog          |
| Theme change rollout time             |                                         ≤ 2 hours | 30d         | CI build logs + release notes      |
| Surface coverage lag                  |                                         ≤ 30 days | quarterly   | coverage matrix + release notes    |
| UI surface coverage                   |                           ≥ 90% components mapped | quarterly   | design-system coverage matrix      |
| Storybook test pass rate              |                                             ≥ 95% | 30d         | CI test reports                    |
| MCP tool contract compliance          |                                              100% | 30d         | contract test suite                |
| Accessibility regression rate         |          0 WCAG 2.2 AA violations in release gate | per release | a11y CI + manual audit notes       |
| Widget bundle size (P95)              |                       ≤ 250 KB gzipped per widget | 30d         | build artifacts                    |
| Widget first render (P95)             |                      ≤ 1.5 s on mid-tier hardware | 30d         | perf traces                        |
| CI build minutes (per week)           |                                         ≤ 120 min | weekly      | CI billing + logs                  |
| Storage footprint (build artifacts)   |                                            ≤ 5 GB | 30d         | CI artifacts dashboard             |

### Operational readiness (gold baseline)

- **SLO owners (solo):**
  - MCP server availability/latency — Owner: Jamie
  - Widget delivery pipeline (build + hosting) — Owner: Jamie
  - CLI/tooling reliability — Owner: Jamie
- **SLO policy (minimum):**
  - Availability SLO: 99.5% monthly; error budget: 0.5% with alert when 50% burned in 7 days.
  - Latency SLO: P95 tool response ≤ 500 ms (local) / ≤ 1.5 s (remote).
  - Release gate: block if error budget burn > 80% in 30 days.
- **Rollback playbook (minimum):**
  1. Pin last known-good widget build artifact.
  2. Disable problematic MCP tools via allowlist.
  3. Revert release tag and redeploy.
  4. Post-incident note with root cause and follow-up tasks.
- **MCP auth policy (minimum):**
  - Default prod allowlist by tool name + version.
  - Least-privilege tool access; deny unknown tools.
  - Development mode may allow local-only overrides with explicit flag.
- **Tool contract versioning:**
  - Semver for tool schemas; breaking changes require new major version.
  - Canonical spec in `platforms/mcp/contracts/` validated by `pnpm test:mcp-contract`.

### UX edge case standardization (prioritized)

1. Loading states (skeletons, optimistic updates)
2. Empty states (no data, first-run)
3. Error states (tool failure, network failure, auth failure)
4. Offline/limited connectivity handling
5. Missing host capabilities (e.g., no `window.openai`)
6. Slow network timeouts and retry behavior

### Accessibility audit cadence

- Automated a11y checks on every PR; manual audit at least once per release.

---

## 8) Recommended Plan (Actionable)

### Top priorities (next 14 days)

1. Define the solo-dev workflows and top 5 user stories for widget dev + surface coverage (Owner: Jamie) — Done when: PRD draft exists with success metrics and edge cases.
2. Add telemetry events for widget render and MCP tool calls — Done when: dashboards show baseline metrics and error rates.
3. Create MCP + widget runbook and rollback playbook — Done when: runbook has incident steps + owners + contact paths.
4. Align toolchain baselines (Node 24 LTS, pnpm, Biome) — Done when: baseline decision recorded and updated in docs/tooling.
5. Replace Vitest browser Storybook tests with Playwright component tests for Radix-heavy stories — Done when: CI green with new test target and documented rationale.
6. Publish a minimal MCP auth policy (prod allowlist) — Done when: policy document exists and tooling enforces allowlist by default.
7. Define canonical MCP tool contract spec + semver policy — Done when: spec file exists under `platforms/mcp/contracts/` and runbook references it.
8. Create a centralized component creation guide for Jamie — Done when: a single doc covers React + Apps SDK UI surfaces, tokens, tests, and release steps.

### Follow-up deliverables

- [ ] Update PRD (or create new one)
- [ ] Update Tech Spec
- [ ] Add ADR(s) for key decisions
- [ ] Add instrumentation + dashboards
- [ ] Complete ORR checklist before production launch

---

## 9) Appendix

- Key files/docs reviewed:
  - README.md
  - docs/architecture/README.md
  - docs/architecture/WIDGET_ARCHITECTURE.md
  - docs/architecture/cross-platform-design.md
  - docs/architecture/repo-map.md
  - docs/BUILD_PIPELINE.md
  - docs/design-system/CHARTER.md
  - docs/work/work_outstanding.md
  - package.json
- Commands run:
  - bash /Users/jamiecraik/.codex/skills/product-spec/scripts/collect-project-context.sh
- Notes:
  - Review focuses on documented architecture and repo state; no runtime metrics were available.
  - Assumptions applied (gold standard defaults + user inputs): baseline median component shipping time is 48 hours with target ≤ 2 hours; Playwright component tests are the preferred Storybook strategy; MCP auth policy is prod-ready allowlist; tool contracts follow semver.
  - Canonical MCP tool contract spec location: `platforms/mcp/contracts/` (recommended best practice), referenced in runbook docs for operational use.
