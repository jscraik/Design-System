# Design System Maturity Audit (2026-02-05)

**As-of date:** 2026-02-05
**Repository:** aStudio (design-studio packages, apps, and governance docs)
**Audience:** Design system maintainers, contributors, and release stakeholders
**Purpose:** Provide an evidence-backed snapshot of design system maturity, highlighting strengths, gaps, and prioritized next actions.

---

## 1) Scope and context

### In scope
- Governance and documentation for the UI design system (charter, contract index, adoption guidance).
- Tokens system (DTCG source of truth, generation, validation, and mapping rules).
- Component coverage and accessibility expectations (coverage matrix, a11y contracts, keyboard navigation tests).
- Enforcement mechanisms (policy/compliance tooling, CI workflows).
- Operational governance relevant to design-system workflows (security/privacy requirements, runbooks, SLOs).

### Out of scope
- Visual correctness of every component (this report is documentation-and-automation evidence-first, not a UI review).
- Runtime behavioral correctness beyond what is enforced by documented test/CI gates.
- Any external systems not represented in repo evidence.

### Primary evidence surfaces reviewed (non-exhaustive)
- Governance and docs:
  - `docs/design-system/CHARTER.md`
  - `docs/design-system/CONTRACT.md`
  - `docs/guides/DESIGN_GUIDELINES.md`
  - `docs/README.md`, `docs/architecture/TOP_LEVEL_INDEX.md`
  - `docs/operations/GOVERNANCE_SECURITY_PRIVACY.md`, `docs/operations/RUNBOOK.md`, `docs/operations/SLOS.md`
- Tokens:
  - `packages/tokens/README.md`
  - `packages/tokens/package.json`
  - `packages/tokens/src/tokens/index.dtcg.json` (path referenced by governance docs)
  - `packages/tokens/schema/dtcg.schema.json`, `packages/tokens/SCHEMA_VERSION` (paths referenced by governance docs)
- Coverage and accessibility:
  - `docs/design-system/COVERAGE_MATRIX.md`
  - `docs/design-system/COVERAGE_MATRIX.json`
  - `docs/design-system/A11Y_CONTRACTS.md`
  - `docs/KEYBOARD_NAVIGATION_TESTS.md`
- Enforcement and CI:
  - `scripts/policy/run.mjs`
  - `scripts/compliance.mjs`
  - `scripts/generate-coverage-matrix.ts`
  - `.github/workflows/ci.yml`
  - `package.json` (root scripts and pinned pnpm version via `packageManager`)
- Architecture decision tracking (noted for alignment):
  - `docs/architecture/001-package-structure.md`
  - `.github/workflows/design-studio-ci.yml`
  - `pnpm-workspace.yaml`

---

## 2) Methodology and rubric

### Method
- **Evidence-first review:** Every requirement is marked based on concrete repo artifacts (documentation, scripts, and CI configuration).
- **Implementation-adjacent validation:** Where possible, requirements are considered stronger when there is both:
  1) documentation (intent), and
  2) an enforcement mechanism (script/CI gate) or a repeatable workflow.
- **Notes capture gaps:** If a requirement is "present" but has clear inconsistencies, missing ownership, drift between ADR and repo reality, or lacks enforcement, it is scored as Partially Met.

### Status rubric
- **Met**
  - Documented and actionable; and either enforced by tooling/CI or demonstrably integrated into standard workflows.
- **Partially Met**
  - Documented but missing enforcement, inconsistently applied, or has material gaps (for example: "Owner: TBD (confirm)", conflicting workflow versions, ADR mismatch).
- **Not Met**
  - Missing, purely aspirational, or no credible evidence of a repeatable workflow/enforcement.

---

## 3) Maturity requirements

### 3.1 Basic maturity requirements

| Requirement | Status | Evidence (paths) | Notes / gaps |
|---|---|---|---|
| A published charter defines non-negotiables (Apps SDK UI–first) | Met | `docs/design-system/CHARTER.md` | Clear governance rules and scope definition. |
| A contract index exists linking governance artifacts | Met | `docs/design-system/CONTRACT.md` | Central index improves discoverability and reduces drift. |
| Design usage guidelines exist (component usage, token rules, a11y expectations) | Met | `docs/guides/DESIGN_GUIDELINES.md` | Includes "Apps SDK UI first" and "avoid raw tokens" guidance plus verification commands. |
| Token "source of truth" is defined (DTCG, schema, version) | Met | `docs/design-system/CHARTER.md`; `docs/design-system/CONTRACT.md`; `packages/tokens/src/tokens/index.dtcg.json`; `packages/tokens/schema/dtcg.schema.json`; `packages/tokens/SCHEMA_VERSION` | Canonical paths are explicitly called out by governance docs. |
| Token tiering policy documented (Brand → Alias → Mapped) | Met | `docs/design-system/CHARTER.md`; `docs/design-system/CONTRACT.md`; `packages/tokens/src/alias-map.ts`; `packages/ui/src/styles/theme.css` (referenced by docs) | Strong architectural constraint; enforcement details captured elsewhere. |
| Documentation index and canonical repo structure guidance exist | Met | `docs/README.md`; `docs/architecture/TOP_LEVEL_INDEX.md`; `README.md` | Clear pointers for "where things live." |
| Security and privacy requirements for governance artifacts documented | Met | `docs/operations/GOVERNANCE_SECURITY_PRIVACY.md` | Explicit prohibited content and retention expectations for audits/evidence. |
| Design system coverage inventory exists (human readable) | Met | `docs/design-system/COVERAGE_MATRIX.md` | Matrix includes source type, rationale, migration triggers, and a11y references. |
| Coverage inventory exists as machine-readable data | Met | `docs/design-system/COVERAGE_MATRIX.json` | Enables tooling and validation beyond markdown. |
| Basic accessibility testing guidance exists | Met | `docs/KEYBOARD_NAVIGATION_TESTS.md` | Includes concrete commands and expected coverage for keyboard/a11y patterns. |
| Local primitive accessibility expectations are documented | Met | `docs/design-system/A11Y_CONTRACTS.md` | Formal contracts exist for many primitives (alerts, modal, selectors, etc.). |
| Package documentation exists for core libraries (UI, runtime, tokens) | Met | `packages/ui/README.md`; `packages/runtime/README.md`; `packages/tokens/README.md` | Some doc headers include "confirm" fields, but core docs exist and are usable. |

### 3.2 Intermediate maturity requirements

| Requirement | Status | Evidence (paths) | Notes / gaps |
|---|---|---|---|
| Token generation workflow exists and is documented | Met | `packages/tokens/README.md`; `packages/tokens/package.json` (`generate`); `package.json` (`generate:tokens`) | Token pipeline is explicit and repeatable. |
| Token validation workflow exists and is integrated into standard commands | Met | `packages/tokens/README.md`; `packages/tokens/package.json` (`validate`); `package.json` (`validate:tokens`) | Strong foundation for preventing token drift. |
| Coverage matrix is generated by script (avoid hand editing) | Met | `docs/design-system/COVERAGE_MATRIX.md` (header); `scripts/generate-coverage-matrix.ts`; `package.json` (`ds:matrix:generate`, `ds:matrix:check`) | Generator-backed, and CI calls the check. |
| Policy checks exist for repo-wide governance rules | Met | `scripts/policy/run.mjs`; `.github/workflows/ci.yml` (Policy checks step) | Enforced in CI on web platform. |
| Compliance lint exists for import/token usage rules | Met | `scripts/compliance.mjs`; `.github/workflows/ci.yml` (Compliance checks step); `package.json` (`lint:compliance`) | Codifies "no forbidden imports / no misuse" expectations. |
| CI gates cover design-system-relevant checks (matrix, compliance, policy) | Met | `.github/workflows/ci.yml` | CI orchestrates matrix, policy, compliance in addition to lint/format/type-check. |
| Storybook is established as a key dev/QA surface (docs and commands) | Met | `packages/ui/STORYBOOK_GUIDE.md`; `docs/guides/UI_COMPONENT_TOOLING.md`; `package.json` (`storybook:*`) | Strong workflow guidance; ownership fields in docs are often TBD. |
| Testing strategy guidance exists (unit vs Storybook vs Playwright) | Met | `docs/testing/guidelines.md`; `docs/guides/UI_COMPONENT_TOOLING.md`; `docs/TEST_PLAN.md` | Clear "smart testing" posture and commands. |
| Version synchronization exists and is gated in CI | Met | `scripts/version-sync.mjs`; `package.json` (`sync:versions`, `sync:versions:check`); `.github/workflows/ci.yml` (Check version synchronization step) | Helps avoid multi-package version drift. |
| Release process is documented and aligns with repo tooling (Changesets) | Met | `docs/guides/RELEASE_CHECKLIST.md`; `README.md`; `.github/workflows/release.yml`; `package.json` (`changeset`, `release`) | Process exists; see advanced-level gap on workflow pnpm version drift. |
| Governance ownership and review cadence are consistently assigned across key docs | Partially Met | `AGENTS.md` (Owner: TBD); `packages/ui/STORYBOOK_GUIDE.md` (Owner: TBD); `packages/cli/README.md` (Owner: TBD); `CHANGELOG.md` (Owner: TBD) | Many documents include "TBD (confirm)" for Owner/Review cadence, reducing governance reliability. |
| Architecture decisions are tracked and consistent with repo structure | Partially Met | `docs/architecture/001-package-structure.md`; `pnpm-workspace.yaml`; `.github/workflows/design-studio-ci.yml` | ADR describes a 3-package target under `packages/design-studio-*`, but the current workspace includes `packages/ui`, `packages/tokens`, `packages/runtime`, etc.; workflow also targets `packages/design-studio-*`. |

### 3.3 Advanced maturity requirements

| Requirement | Status | Evidence (paths) | Notes / gaps |
|---|---|---|---|
| Upstream drift detection exists and is CI-gated on dependency change | Met | `scripts/check-apps-sdk-ui-version.mjs`; `scripts/test-drift.mjs`; `.github/workflows/ci.yml` (Detect change + Run drift tests) | Drift suite runs when Apps SDK UI changes. |
| Upstream alignment stamping exists and is required in CI when upstream changes | Met | `scripts/stamp-upstream-alignment.mjs`; `docs/design-system/UPSTREAM_ALIGNMENT.md`; `.github/workflows/ci.yml` (Stamp + Ensure committed) | Strong "paper trail" mechanism for upstream upgrades. |
| Automated a11y regression exists | Met | `.github/workflows/ci.yml` (a11y job); `package.json` (`test:a11y:widgets:ci`); `packages/widgets/playwright.a11y.config.ts` (path referenced by script) | A11Y_STRICT is enabled in CI for widgets. |
| Automated visual regression exists in CI | Met | `.github/workflows/ci.yml` (visual job); `package.json` (`test:visual:web`, `test:visual:storybook`) | Visual job uploads artifacts on failure and comments on PRs. |
| Operational runbook exists for MCP server and widget pipeline | Met | `docs/operations/RUNBOOK.md` | Includes health checks, troubleshooting, and governance for telemetry. |
| Operational SLOs exist for pipeline/services | Met | `docs/operations/SLOS.md` | SLO targets and error budgets defined; useful maturity signal. |
| Runtime observability contract exists (widgetSessionId) | Met | `packages/runtime/README.md`; `packages/runtime/docs/WIDGET_SESSION_ID.md` | Defines correlation ID metadata and how to access it. |
| Tooling version consistency across CI workflows is aligned to repo baseline | Partially Met | `package.json` (`packageManager: pnpm@10.28.0`); `.github/workflows/ci.yml` (pnpm 10.28.0); `.github/workflows/release.yml` (pnpm 9.15.0); `.github/workflows/publish-astudio.yml` (pnpm 9.15.0) | CI uses pnpm 10.28.0, but release/publish workflows use pnpm 9.15.0, increasing "works in CI but not in release" risk. |
| Security automation beyond policy/compliance lint (for example: CodeQL workflow) is present and enforced | Partially Met | `.github/codeql-config.yml` | Config exists, but no CodeQL workflow evidence is included in the reviewed workflow set. |
| Governance doc lifecycle is enforced (owners/cadence required, reviews scheduled/automated) | Not Met | Multiple docs include "Owner: TBD (confirm)" and "Review cadence: TBD (confirm)" (for example: `AGENTS.md`, `packages/ui/STORYBOOK_GUIDE.md`, `packages/cli/README.md`) | Ownership is documented inconsistently and not enforced by tooling. |
| "Accepted ADR" implementation alignment is maintained (no stale workflows/paths) | Not Met | `docs/architecture/001-package-structure.md`; `.github/workflows/design-studio-ci.yml`; `pnpm-workspace.yaml` | Workflow paths and ADR target structure appear out of sync with current workspace layout. |

---

## 4) Evaluation summary

### Strengths (what is working well)
- **Clear governance foundation:** The design system charter and contract index provide strong, explicit rules and canonical references (`docs/design-system/CHARTER.md`, `docs/design-system/CONTRACT.md`).
- **Token system is structured and tool-supported:** DTCG source of truth, generation, and validation workflows are explicit and scriptable (`packages/tokens/README.md`, `package.json`, `packages/tokens/package.json`).
- **Coverage is treated as a first-class artifact:** The coverage matrix exists in both markdown and JSON and is generator-backed, with CI enforcement (`docs/design-system/COVERAGE_MATRIX.md`, `docs/design-system/COVERAGE_MATRIX.json`, `scripts/generate-coverage-matrix.ts`, `.github/workflows/ci.yml`).
- **Quality gates are real (not aspirational):** Policy checks, compliance lint, drift tests, a11y tests, and visual regression are all present and wired into CI (`scripts/policy/run.mjs`, `scripts/compliance.mjs`, `.github/workflows/ci.yml`).
- **Operational maturity signals exist:** Runbook and SLOs establish expectations and response processes (`docs/operations/RUNBOOK.md`, `docs/operations/SLOS.md`).
- **A11y expectations are formalized:** Local primitive a11y contracts and keyboard navigation guidance reduce ambiguity (`docs/design-system/A11Y_CONTRACTS.md`, `docs/KEYBOARD_NAVIGATION_TESTS.md`).

### Gaps (highest-impact weaknesses observed)
- **Ownership and review cadence are inconsistently assigned:** Multiple key docs still list Owner/Review cadence as TBD, weakening governance accountability (for example: `AGENTS.md`, `packages/ui/STORYBOOK_GUIDE.md`, `packages/cli/README.md`).
- **Release/publish tooling drift risk:** pnpm versions differ between CI and release/publish workflows (`.github/workflows/ci.yml` vs `.github/workflows/release.yml` and `.github/workflows/publish-astudio.yml`).
- **ADR and workflow alignment issues:** ADR 001’s package-structure target and the `design-studio-ci` workflow do not appear aligned to the current repo structure (`docs/architecture/001-package-structure.md`, `.github/workflows/design-studio-ci.yml`, `pnpm-workspace.yaml`).
- **Security automation evidence is incomplete:** CodeQL config exists, but the enforcement workflow is not shown in the reviewed set (`.github/codeql-config.yml`).

### Recommendations (prioritized next actions)

1) **Governance accountability: require owners and review cadence**
- Define owners and review cadence for the design-system governance set first:
  - `docs/design-system/*`
  - `docs/operations/*`
  - `packages/*/README.md`
- Enforce via a lightweight CI check (fail when "Owner: TBD" appears in protected doc sets).

2) **Standardize pnpm versions across CI, release, and publish**
- Align `.github/workflows/release.yml` and `.github/workflows/publish-astudio.yml` to `pnpm@10.28.0` to match `package.json` and main CI (`.github/workflows/ci.yml`).

3) **Reconcile ADR 001 and `design-studio-ci` with repo reality**
- Either execute the migration to `packages/design-studio-*` as specified in `docs/architecture/001-package-structure.md`, or update the ADR and remove/adjust `.github/workflows/design-studio-ci.yml` so it reflects current package paths.

4) **Confirm security automation posture**
- If CodeQL is intended, add or restore a CodeQL workflow (and confirm it uses `.github/codeql-config.yml`).
- If not intended, document the rationale and remove dead config to reduce false confidence.

5) **Continue strengthening evidence-driven gates**
- Maintain and expand:
  - Coverage matrix generator and checks (`scripts/generate-coverage-matrix.ts`, `pnpm ds:matrix:check`)
  - Drift suite and alignment stamping (`pnpm test:drift`, `pnpm ds:alignment:stamp`)
  - A11y contracts and keyboard navigation tests (`docs/design-system/A11Y_CONTRACTS.md`, `docs/KEYBOARD_NAVIGATION_TESTS.md`)

---

## Appendix: Quick evidence index (most cited artifacts)

- Charter and contract index:
  - `docs/design-system/CHARTER.md`
  - `docs/design-system/CONTRACT.md`
- Coverage:
  - `docs/design-system/COVERAGE_MATRIX.md`
  - `docs/design-system/COVERAGE_MATRIX.json`
  - `scripts/generate-coverage-matrix.ts`
- Enforcement:
  - `scripts/policy/run.mjs`
  - `scripts/compliance.mjs`
  - `.github/workflows/ci.yml`
- Tokens:
  - `packages/tokens/README.md`
  - `packages/tokens/package.json`
  - `packages/tokens/src/tokens/index.dtcg.json`
- Accessibility:
  - `docs/design-system/A11Y_CONTRACTS.md`
  - `docs/KEYBOARD_NAVIGATION_TESTS.md`
- Operations:
  - `docs/operations/GOVERNANCE_SECURITY_PRIVACY.md`
  - `docs/operations/RUNBOOK.md`
  - `docs/operations/SLOS.md`