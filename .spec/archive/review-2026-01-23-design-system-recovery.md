# Design System Recovery Audit — aStudio

Date: 2026-01-23
Mode: Review (no implementation)

## Objective

Provide an in-depth audit of the aStudio design system status and a recovery plan to get the project fully on track as a design system. 
Evidence: user request (2026-01-23).

## Definition of “Fully On Track” (Required; Missing)

The audit does not define measurable success criteria for “fully on track,” which makes completion unverifiable and weakens governance accountability. 
Evidence gap: no success criteria section in this report.

Proposed measurable criteria to confirm (targets + dates required):

- Drift suite: 100% pass rate on latest apps-sdk-ui version with stamped alignment log.
- Coverage matrix: explicit target for reduction of Radix fallbacks (percentage or count).
- A11y: zero WCAG 2.2 AA violations in widget and Storybook a11y runs.
- Governance: owners + review cadence set across all core design-system docs.
Evidence gap: targets and dates not defined in repo or report.

### Success Criteria (Proposed; Needs Confirmation)

| Area | Target | Evidence | Due date |
| --- | --- | --- | --- |
| Drift suite | 100% pass on latest apps-sdk-ui version | `pnpm test:drift` logs + alignment stamp | 2026-02-07 |
| Coverage matrix | Radix fallbacks reduced by 10% from current baseline | `docs/design-system/COVERAGE_MATRIX.md` | 2026-03-01 |
| A11y | 0 WCAG 2.2 AA violations on widgets + Storybook a11y runs | `pnpm test:a11y:widgets`, `pnpm storybook:test` | 2026-02-15 |
| Governance | Owner + review cadence set for core DS docs | Docs headers | 2026-02-01 |
| Evidence retention | Audit artifacts stored for 30 days minimum | `docs/operations/` | 2026-02-15 |

**Confirmation needed:** targets and dates should be validated and adjusted by Jamie.

## Scope

This review covers design system governance, design tokens, component coverage, QA gates, and documentation pathways that influence UI consistency across web, widgets, and desktop shells. 
Evidence: docs/design-system/CHARTER.md; docs/design-system/CONTRACT.md.

Out of scope: implementation changes to components, tokens, or infrastructure. 
Evidence: user request (2026-01-23).

## Current State Snapshot

The repo already defines a design-system-first posture (Apps SDK UI as canonical), with governance artifacts, token sources of truth, coverage mapping, and QA gates documented. 
Evidence: docs/design-system/CHARTER.md; docs/design-system/CONTRACT.md; packages/tokens/README.md.

There is a documented component creation workflow, tooling/QA guide, Storybook surface, and keyboard/a11y test suite for widgets and key UI flows. 
Evidence: docs/guides/COMPONENT_CREATION.md; docs/guides/UI_COMPONENT_TOOLING.md; platforms/web/apps/storybook/README.md; docs/KEYBOARD_NAVIGATION_TESTS.md.

Design-system documentation is indexed and cross-referenced, and there are existing audits and gap analyses that establish baseline compliance and remaining gaps. 
Evidence: docs/README.md; docs/architecture/APPS_SDK_GAP_ANALYSIS.md.

## Findings (What Is Working)

### 1) Governance artifacts exist and describe non-negotiable rules

The charter and contract index define Apps SDK UI primacy, Radix fallback policy, required evidence for design system PRs, and explicit QA gates for drift, coverage, a11y, and tokens. 
Evidence: docs/design-system/CHARTER.md; docs/design-system/CONTRACT.md.

### 2) Token system and audit layer are clearly defined

Tokens are centralized in a canonical DTCG bundle with generated CSS and Tailwind preset, and the repo’s docs reinforce that tokens are an audit/extension layer rather than the primary styling interface. 
Evidence: packages/tokens/README.md; README.md; docs/architecture/cross-platform-design.md.

### 3) Component coverage is tracked and generated

A generated coverage matrix maps upstream vs fallback coverage and provides an explicit migration trigger for replacing Radix fallbacks when Apps SDK UI catches up. 
Evidence: docs/design-system/COVERAGE_MATRIX.md; docs/design-system/CONTRACT.md.

### 4) QA surfaces and tests are defined

Storybook is established as the primary UI QA/documentation surface, with interaction tests and visual regression hooks documented, and there is a specific keyboard/a11y test suite for widgets. 
Evidence: platforms/web/apps/storybook/README.md; docs/guides/UI_COMPONENT_TOOLING.md; docs/KEYBOARD_NAVIGATION_TESTS.md.

## Gaps & Risks (Why “Off-Track” Exists)

### 1) Ownership and review cadence are consistently marked as TBD

Multiple key docs (charter, tokens, UI component tooling, and design guidelines) lack confirmed owners and review cadence, which undermines governance accountability and maintenance. 
Evidence: docs/design-system/CHARTER.md; packages/tokens/README.md; docs/guides/UI_COMPONENT_TOOLING.md; docs/guides/DESIGN_GUIDELINES.md.

### 2) Upstream alignment evidence is not stamped

The upstream alignment log is defined but the “Last verified” stamp is empty, meaning drift test results or verification cadence is not evidenced in the repository. 
Evidence: docs/design-system/UPSTREAM_ALIGNMENT.md.

### 3) RFC process referenced without a visible template or workflow

The charter requires RFCs for changes, but there is no visible RFC template or documented workflow in the repo index, increasing the risk of inconsistent approvals. 
Evidence: docs/design-system/CHARTER.md; docs/README.md.

### 4) Tooling and component creation docs contain placeholders

The component tooling guide explicitly lists risks/assumptions, verification, and troubleshooting as TBD, which weakens the “definition of done” for design-system changes. 
Evidence: docs/guides/UI_COMPONENT_TOOLING.md.

### 5) Coverage matrix shows heavy reliance on Radix fallbacks

A large portion of the component library remains Radix fallback-based, which is acceptable per policy but indicates ongoing parity debt and migration overhead. 
Evidence: docs/design-system/COVERAGE_MATRIX.md; docs/design-system/CHARTER.md.

### 6) QA gates are documented but not evidenced in this audit

While QA gates are defined, the audit has no recorded proof of recent drift, coverage, or a11y runs. This is a confidence gap rather than a confirmed failure. 
Evidence: docs/design-system/CONTRACT.md; Evidence gap: no CI artifacts in this audit.

### 7) Success criteria and personas are missing

The report lacks explicit personas, user pain, and measurable success criteria for the recovery plan, which makes the outcome non-auditable. 
Evidence gap: no persona/problem or success metrics section in this report.

### 8) Review-only scope conflicts with required process changes

The report is labeled “Review (no implementation)” yet the recovery plan requires new governance artifacts and verification outputs, which blurs scope boundaries. 
Evidence: Mode: Review (no implementation); Recovery Plan — Top actions.

### 9) Security/privacy requirements for governance workflows are undefined

There is no explicit security/privacy requirement for design-system governance workflows (authN/Z, secrets classification, retention), which is a governance gap for a production UI system. 
Evidence gap: no security/privacy requirements section in this report.

### 10) Reliability/observability criteria for QA gates are undefined

The report does not define SLOs, retries/timeouts, or evidence retention for drift/coverage/a11y gates, so reliability of evidence is unclear. 
Evidence gap: no reliability criteria section in this report.

### 11) CI/CD gate commands and infra constraints are not enumerated

The audit references QA gates but does not list where they run or the exact commands, leaving enforcement ambiguous. 
Evidence gap: no CI/CD gate listing in this report.

## Recommendations (Prioritized)

### P0 — Governance and evidence basics (next 7–14 days)

- Assign owners and review cadence for core design-system docs (Charter, Contract, Tokens, Design Guidelines, Component Tooling). 
Evidence: docs/design-system/CHARTER.md; packages/tokens/README.md; docs/guides/DESIGN_GUIDELINES.md; docs/guides/UI_COMPONENT_TOOLING.md.

- Establish and record a first upstream alignment stamp after running drift tests; update the alignment log with timestamp and version. 
Evidence: docs/design-system/UPSTREAM_ALIGNMENT.md; docs/design-system/CONTRACT.md.

- Add or link an RFC workflow/template and reference it from Charter and Contract. 
Evidence: docs/design-system/CHARTER.md; docs/design-system/CONTRACT.md; docs/README.md.

- Define “fully on track” success criteria with measurable targets and a verification window. 
Evidence gap: success criteria missing in report.

- Add a governance data model for alignment stamps, owners, and review cadence (required fields + storage location). 
Evidence gap: no data model specified in report.

### P1 — Reduce ambiguity in component workflows (next 30 days)

- Replace TBD sections in UI component tooling with concrete risks/assumptions, verification steps, and top failure modes. 
Evidence: docs/guides/UI_COMPONENT_TOOLING.md.

- Align component creation guide with the QA gate list in Contract (drift, coverage, a11y) and reference the exact commands. 
Evidence: docs/guides/COMPONENT_CREATION.md; docs/design-system/CONTRACT.md.

- Publish QA gate evidence requirements (artifacts, pass/fail thresholds, and storage location). 
Evidence gap: no evidence schema defined in report.

- Add security/privacy requirements for governance workflows (authN/Z, secrets classification, retention). 
Evidence gap: no security/privacy requirements section.

- Add reliability expectations for QA gates (timeouts, retries, degraded-mode behavior). 
Evidence gap: no reliability criteria defined.

- Enumerate CI/CD gate commands and where they run (pre-merge/nightly/release). 
Evidence gap: no CI/CD gate list in report.

### P2 — Coverage and parity debt management (next 60–90 days)

- Add a migration queue for Radix fallbacks that are eligible for upstream replacement, with a lightweight decision log. 
Evidence: docs/design-system/COVERAGE_MATRIX.md; docs/design-system/UPSTREAM_ALIGNMENT.md.

- Audit coverage matrix statuses against actual usage in widgets and web surfaces to ensure parity claims remain accurate. 
Evidence: docs/design-system/COVERAGE_MATRIX.md; README.md.

- Add surface-specific risk summaries (web, widgets, desktop) to make recovery progress auditable by surface. 
Evidence gap: no surface-specific breakdown in report.

## Recovery Plan — aStudio Design System

### 1) Context snapshot (1–2 sentences)

The design system has strong artifacts and policies, but governance ownership, evidence of upstream alignment, and workflow completeness are not yet locked down, which makes consistency and compliance hard to enforce at scale. 
Evidence: docs/design-system/CHARTER.md; docs/design-system/UPSTREAM_ALIGNMENT.md; docs/guides/UI_COMPONENT_TOOLING.md.

### 2) Stabilization gates (must be true before build work)

- Owners and review cadences are set for Charter, Contract, Tokens, Design Guidelines, and Component Tooling. 
Evidence: docs/design-system/CHARTER.md; packages/tokens/README.md; docs/guides/DESIGN_GUIDELINES.md; docs/guides/UI_COMPONENT_TOOLING.md.
- Upstream alignment log has a verified stamp with version and date. 
Evidence: docs/design-system/UPSTREAM_ALIGNMENT.md.
- RFC workflow/template exists and is linked from Charter + Contract. 
Evidence: docs/design-system/CHARTER.md; docs/design-system/CONTRACT.md.

- Success criteria for “fully on track” are defined with targets and verification windows. 
Evidence gap: no success criteria section in report.

- QA gate evidence schema is defined (artifacts, thresholds, storage location). 
Evidence gap: no evidence schema defined in report.

- Security/privacy requirements for governance workflows are documented. 
Evidence gap: no security/privacy requirements section.

- Reliability expectations for QA gates (timeouts, retries, rollback/degraded-mode) are documented. 
Evidence gap: no reliability criteria section.

- CI/CD gate commands and enforcement points are documented. 
Evidence gap: no CI/CD gate list in report.

### 3) Stop / Continue / Start

#### Stop
- Shipping design-system changes without recorded owners, review cadence, or alignment stamp. 
Evidence: docs/design-system/CHARTER.md; docs/design-system/UPSTREAM_ALIGNMENT.md.

#### Continue
- Apps SDK UI-first policy, Radix fallback isolation, and existing QA gates (drift, a11y, coverage, tokens). 
Evidence: docs/design-system/CHARTER.md; docs/design-system/CONTRACT.md.

#### Start
- A lightweight RFC flow for design-system changes and explicit verification steps in component tooling docs. 
Evidence: docs/design-system/CHARTER.md; docs/guides/UI_COMPONENT_TOOLING.md.

### 4) Top actions (next 14 days)

- Action: Set owners + review cadence for core design-system docs and add a short maintenance note. 
  - Owner: Design Systems Team (confirm). 
  - Done when: Owners and cadences are filled in and dates are set. 
  - Evidence: docs/design-system/CHARTER.md; docs/guides/DESIGN_GUIDELINES.md; packages/tokens/README.md; docs/guides/UI_COMPONENT_TOOLING.md.

- Action: Run drift suite and write the alignment stamp. 
  - Owner: Design Systems Team. 
  - Done when: “Last verified” and “Alignment Stamp” are filled with ISO timestamp + version. 
  - Evidence: docs/design-system/UPSTREAM_ALIGNMENT.md; docs/design-system/CONTRACT.md.

- Action: Publish RFC workflow/template and link it in Charter + Contract + docs index. 
  - Owner: Design Systems Team. 
  - Done when: RFC template exists and links appear in Charter and Contract. 
  - Evidence: docs/design-system/CHARTER.md; docs/design-system/CONTRACT.md; docs/README.md.

- Action: Define success criteria for “fully on track” and add them to the report. 
  - Owner: Design Systems Team (confirm). 
  - Done when: Criteria, targets, and dates are documented. 
  - Evidence: Evidence gap until defined.

- Action: Publish QA gate evidence schema + CI/CD gate list. 
  - Owner: Design Systems Team (confirm). 
  - Done when: Evidence artifacts, thresholds, commands, and storage locations are documented. 
  - Evidence: Evidence gap until defined.

- Action: Add security/privacy requirements for governance workflows. 
  - Owner: Design Systems Team (confirm). 
  - Done when: AuthN/Z assumptions, secrets classification, and retention rules are documented. 
  - Evidence: Evidence gap until defined.

### 5) Key risks & assumptions (top 3–5)

| Risk/Assumption | Impact | Uncertainty | Mitigation |
| --- | --- | --- | --- |
| Owners/review cadence remain TBD | Governance drift, inconsistent updates | Medium | Set owners + calendar reminders | 
| Drift tests not run regularly | Upstream/UI divergence | Medium | Schedule drift suite in CI with stamp output | 
| RFC process absent | Changes bypass review | Medium | Add RFC template + requirement in PR checklist | 
| Radix fallback debt persists | Parity gap with Apps SDK UI | Medium | Track migration queue + align with upstream releases | 
| QA gates not evidenced | Reduced confidence in releases | Medium | Capture run artifacts in reports | 
Evidence: docs/design-system/CHARTER.md; docs/design-system/UPSTREAM_ALIGNMENT.md; docs/design-system/CONTRACT.md; docs/design-system/COVERAGE_MATRIX.md.

### 6) ExecPlan gate (only if significant build work is required)

If recovery requires significant feature work, follow the ExecPlan sequence in `~/.codex/instructions/plans.md` or repo `.agent/PLANS.md`. 
Evidence: /Users/jamiecraik/.codex/instructions/plans.md; Evidence gap: repo `.agent/PLANS.md` not found in this audit.

### 7) Evidence

Sources:
- docs/design-system/CHARTER.md
- docs/design-system/CONTRACT.md
- docs/design-system/UPSTREAM_ALIGNMENT.md
- docs/design-system/COVERAGE_MATRIX.md
- docs/guides/COMPONENT_CREATION.md
- docs/guides/UI_COMPONENT_TOOLING.md
- docs/guides/DESIGN_GUIDELINES.md
- docs/KEYBOARD_NAVIGATION_TESTS.md
- packages/tokens/README.md
- platforms/web/apps/storybook/README.md
- docs/README.md
- docs/architecture/APPS_SDK_GAP_ANALYSIS.md
- docs/architecture/cross-platform-design.md
Evidence: sources listed above.

Evidence gaps:
- No CI run artifacts for drift/coverage/a11y in this audit.
- RFC template/workflow file not located in repo index.
- Doc owners/review cadences remain TBD across multiple governance files. 
- Success criteria for “fully on track” are not defined.
- QA gate evidence schema and CI/CD gate list are not defined.
- Security/privacy requirements for governance workflows are not defined.
- Reliability expectations for QA gates are not defined.
Evidence gap: audit-only; no build/run evidence collected.

## Evidence Map

| ID | Source | Notes |
| --- | --- | --- |
| E1 | docs/design-system/CHARTER.md | Governance rules and Apps SDK UI primacy |
| E2 | docs/design-system/CONTRACT.md | Contract index + QA gates |
| E3 | docs/design-system/UPSTREAM_ALIGNMENT.md | Alignment log and drift suite expectations |
| E4 | docs/design-system/COVERAGE_MATRIX.md | Coverage and fallback status |
| E5 | docs/guides/COMPONENT_CREATION.md | Component workflow and DoD |
| E6 | docs/guides/UI_COMPONENT_TOOLING.md | Tooling sequence + TBD placeholders |
| E7 | docs/guides/DESIGN_GUIDELINES.md | UI design rules and a11y checklist |
| E8 | docs/KEYBOARD_NAVIGATION_TESTS.md | Keyboard/a11y test coverage |
| E9 | packages/tokens/README.md | Token source of truth and audit layer |
| E10 | platforms/web/apps/storybook/README.md | Storybook QA surface |
| E11 | docs/README.md | Doc index and governance links |
| E12 | docs/architecture/APPS_SDK_GAP_ANALYSIS.md | Compliance baseline and gaps |
| E13 | docs/architecture/cross-platform-design.md | Token single-source and drift rules |
Evidence: sources listed in the table.
