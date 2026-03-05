---
title: "feat: Onboarding Command Center MVP (15-minute success)"
type: feat
status: completed
date: 2026-03-05
origin: docs/brainstorms/2026-03-05-onboarding-command-center-brainstorm.md
---

# ✨ feat: Onboarding Command Center MVP (15-minute success)

## Overview
Ship a 30-day onboarding MVP that gives both humans and AI coding agents one canonical way to reach first meaningful success in 15 minutes (see brainstorm: `docs/brainstorms/2026-03-05-onboarding-command-center-brainstorm.md`).

This plan consolidates fragmented onboarding guidance into a single command-center path with task-oriented routes:
1. Add a token safely
2. Ship/update a widget
3. Verify MCP integration

It also adds a deterministic agent-entry checklist and doc-authority guardrails so contributors stop guessing which docs are current (see brainstorm: `docs/brainstorms/2026-03-05-onboarding-command-center-brainstorm.md`).

## Problem Statement
Current onboarding is useful but split across many surfaces (root README, docs index, quick starts, and multiple guides), which increases time-to-first-success and inconsistency.

Evidence:
- Root quick-start and workflow references are broad and multi-surface (`/Users/jamiecraik/dev/design-system/README.md:80`, `/Users/jamiecraik/dev/design-system/README.md:487`).
- A second quick-start exists with drift signals (`/Users/jamiecraik/dev/design-system/docs/QUICK_START.md:65` uses `pnpm test:mcp`, while canonical script is `pnpm test:mcp-contract` in `/Users/jamiecraik/dev/design-system/README.md:127`).
- Golden-path guidance exists but is not the canonical first stop (`/Users/jamiecraik/dev/design-system/docs/guides/DESIGN_SYSTEM_ADOPTION.md:97`).
- Many docs still contain unresolved ownership metadata (`Owner: TBD`) creating trust ambiguity (for example `/Users/jamiecraik/dev/design-system/docs/guides/CHATGPT_INTEGRATION.md:10`).

## Proposed Solution
Create an **Onboarding Command Center** documentation/product surface that becomes the single source of truth for first-week onboarding.

Core solution elements:
- One canonical entrypoint with explicit authority status and links to all task routes.
- Three task playbooks (token/widget/MCP) optimized for <=15-minute first success.
- Deterministic AI-agent checklist aligned with existing preflight conventions.
- Light governance checks to detect stale links, conflicting quick starts, and drift in critical onboarding commands.

Selected because adoption speed is the primary objective and the horizon is 30 days (see brainstorm: `docs/brainstorms/2026-03-05-onboarding-command-center-brainstorm.md`).

## Premortem (Failure scenario at 2026-09-05)
### What went wrong
- The “single source of truth” never became authoritative because legacy docs still ranked high in repo search and were easier to find.
- Onboarding got longer, not shorter: users had to hop between command center, task routes, and legacy references with conflicting commands.
- Agent and human instructions diverged; agents passed local checks but failed real workflows due missing contextual steps.
- Ownership drift returned (`Owner: TBD`) and no one maintained route accuracy.
- CI validated links but missed semantic drift (commands existed but no longer matched expected outcomes).

### False assumptions
- **Assumption:** One new entry doc is enough to change behavior.  
  **Reality:** discovery behavior is path-dependent; old docs continued to dominate.
- **Assumption:** 15-minute success is achievable uniformly.  
  **Reality:** environment/tool install variance (vale, playwright, MCP runtime) made this unreliable.
- **Assumption:** command parity checks will catch onboarding drift.  
  **Reality:** checks caught syntax presence, not correctness of end-to-end outcomes.

### Edge cases missed
- Returning contributors deep-linking directly into archived docs from old bookmarks.
- Partial environments (no vale, no browser deps, no MCP endpoint) causing “false onboarding failures.”
- Task crossover: users needing token + widget + MCP in one workflow, not isolated routes.
- Non-default shells/OS differences changing command behavior and copy-paste reliability.

### Integration issues overlooked
- Incomplete alignment between `README.md`, `docs/README.md`, `docs/guides/README.md`, and route docs.
- CI and local docs checks passed while runtime verification steps were stale.
- `design-system-guidance` rules did not yet encode onboarding authority or command-result invariants.

### What users hated
- “I did exactly what docs said and it still failed.”
- Too many “source of truth” claims across docs.
- No quick fallback path when prerequisites are missing.
- Agent outputs that looked correct but were not executable.

### Revisions required (applied in this plan)
- Add a **Phase 0 baseline + discovery control** before shipping new docs.
- Add **outcome-based validation** (not just link/command presence checks).
- Add **fallback paths** for missing tools/endpoints.
- Add **owner SLA + review cadence** as launch blockers.
- Add **adoption telemetry + rollback triggers** tied to user pain signals.

## Research Summary
### Local research (completed)
- **Repo patterns:** Existing strong docs foundation but fragmented onboarding flows.
- **Machine-readable governance:** Available and reusable via `/Users/jamiecraik/dev/design-system/packages/design-system-guidance/rules.json:21` (`docs-toc`).
- **Preflight pattern for deterministic starts:** `/Users/jamiecraik/dev/design-system/scripts/codex-preflight.sh:4`.
- **Doc link validation:** `/Users/jamiecraik/dev/design-system/scripts/check-doc-links.mjs:144`.
- **Quality debt baseline for staged re-enablement:** `/Users/jamiecraik/dev/design-system/biome.json:57` and `:58`.

### Learnings research
- No `docs/solutions/` directory found in this repository; nearest institutional learnings are in `FORJAMIE.md` and audit/review artifacts.

### External research decision
Skipped. This initiative is documentation/workflow architecture with strong local patterns and no high-risk payment/security/API unknowns.

### SpecFlow analysis status
Attempted via `spec-flow-analyzer`, but agent execution failed due environment model quota limits. Equivalent flow/edge-case analysis is included manually under **System-Wide Impact** and **Integration Test Scenarios**.

## Technical Approach
### Architecture
This is a documentation+workflow architecture change, not a runtime product feature.

Layers:
1. **Entry layer** — One canonical command-center doc.
2. **Task layer** — Focused playbooks (token/widget/MCP).
3. **Agent parity layer** — Deterministic checklist for AI coding agents.
4. **Guardrail layer** — Validation checks for command drift and stale references.

### Persona Flows (SpecFlow-style coverage)
1. **New developer (human):** clone -> install -> choose task route -> run happy-path commands -> validate expected outcome.
2. **Returning maintainer:** jump directly to specific route -> use troubleshooting and advanced links -> update docs with authority rules intact.
3. **AI coding agent:** run deterministic checklist -> execute target task route -> run route-level validation -> produce evidence.

Edge cases to cover:
- User starts from superseded docs.
- Required tool missing (`vale`, `pnpm`, `node`).
- Command drift between docs and `package.json` scripts.
- MCP endpoint reachable but contract test fails.
- CI green for code, but onboarding docs stale/conflicting.

### Scope Boundaries (YAGNI)
In scope for this MVP:
- Canonical onboarding path + three high-frequency task routes.
- Deterministic agent checklist.
- Command/link drift guardrails for onboarding docs.

Out of scope for this MVP:
- Full redesign of every doc in the repository.
- Broad runtime architecture changes in UI/runtime/tokens packages.
- Immediate full re-enablement of all disabled Biome rules.

### Implementation Phases
#### Phase 0: Baseline + discovery control (Days 1-2)
- Inventory all current onboarding entrypoints and classify each as:
  - authoritative
  - redirecting
  - archived
- Capture baseline onboarding timing and failure points for:
  - human first-run
  - agent first-run
- Define rollback trigger thresholds (for example: >20% increase in onboarding failures week-over-week).

**Success criteria**
- Baseline metrics and source map are documented before any route migration.
- Every legacy onboarding page has an assigned status.

**Estimated effort**: 1-2 days

#### Phase 1: Foundation + authority migration (Week 1)
- Create canonical command-center doc (new file): `docs/guides/ONBOARDING_COMMAND_CENTER.md`.
- Add explicit links from:
  - `/Users/jamiecraik/dev/design-system/README.md`
  - `/Users/jamiecraik/dev/design-system/docs/README.md`
  - `/Users/jamiecraik/dev/design-system/docs/guides/README.md`
- Add status banners in superseded quick-start docs (for example `/Users/jamiecraik/dev/design-system/docs/QUICK_START.md`) with “why + where to go now.”
- Set owner + review cadence in command-center and all new task-route docs.

**Success criteria**
- One canonical onboarding link appears in all three top-level readme surfaces.
- Superseded docs point users to command center in first screenful.
- No new onboarding doc ships with `Owner: TBD`.

**Estimated effort**: 2-3 days

#### Phase 2: Core task routes + fallback paths (Week 2-3)
- Define three task-first routes with concrete commands and expected outputs:
  - `docs/guides/tasks/add-token.md`
  - `docs/guides/tasks/ship-widget.md`
  - `docs/guides/tasks/test-mcp-integration.md`
- Include deterministic agent startup checklist derived from:
  - `/Users/jamiecraik/dev/design-system/scripts/codex-preflight.sh`
  - `/Users/jamiecraik/dev/design-system/AGENTS.md`
- Ensure each task route includes:
  - Preconditions
  - 15-minute “happy path”
  - Common failure modes
  - Minimal validation commands
  - **Fallback path** for missing tools/endpoints
- Add one cross-route journey (“token + widget + MCP”) to catch integration friction.

**Success criteria**
- Each task route can be executed independently.
- Each route has explicit validation commands and failure recovery notes.
- Fallback path exists and is tested for at least one known-missing prerequisite.

**Estimated effort**: 5-7 days

#### Phase 3: Outcome-based guardrails + quality staging (Week 4)
- Add command-drift checks for onboarding docs (script-level or policy-level).
- Extend existing doc validation to include critical onboarding command parity.
- Add outcome checks (expected artifact/result assertions), not only command presence.
- Define phased quality-rule re-enable roadmap doc:
  - Phase A: warning-only checks for currently-disabled a11y/correctness subsets
  - Phase B: fail-on-new-violations
  - Phase C: incremental fail-on-touched-files

**Success criteria**
- `pnpm doc:lint` continues to pass.
- New onboarding drift checks run in CI or documented local gate.
- Outcome checks validate at least one expected result per task route.
- Quality re-enable roadmap has explicit entry/exit criteria.

**Estimated effort**: 3-5 days

#### Phase 4: Adoption checkpoint + rollback decision (End of month 1)
- Run human + agent onboarding canary week using real newcomer workflows.
- Compare against baseline collected in Phase 0.
- Decide: expand, iterate, or rollback authority changes based on measured outcomes.

**Success criteria**
- KPI review completed with explicit go/no-go decision.
- Rollback runbook either exercised (if needed) or confirmed unnecessary with evidence.

**Estimated effort**: 1-2 days

### Execution Backlog (Issue-ready)
- [x] `docs/work/onboarding-entrypoint-inventory.md`: baseline map of all onboarding entrypoints + authority status.
- [x] `docs/work/onboarding-baseline-metrics.md`: baseline timing/failure capture for human + agent first runs.
- [x] `docs/guides/ONBOARDING_COMMAND_CENTER.md`: write canonical start page with authority banner.
- [x] `docs/guides/tasks/add-token.md`: 15-minute flow with checkpoints and rollback hints.
- [x] `docs/guides/tasks/ship-widget.md`: build + verify widget path with expected artifacts.
- [x] `docs/guides/tasks/test-mcp-integration.md`: local/deployed MCP verification path.
- [x] `docs/guides/tasks/full-path-token-widget-mcp.md`: cross-route integration journey.
- [x] `README.md`: replace/route competing onboarding entrypoints to command center.
- [x] `docs/README.md`: declare command center as onboarding source of truth.
- [x] `docs/guides/README.md`: add task-route navigation section.
- [x] `docs/QUICK_START.md`: add explicit redirect banner + correct stale command examples.
- [x] `scripts/` check addition/update: onboarding command-parity validation.
- [x] `scripts/` check addition/update: onboarding outcome assertions for each task route.
- [x] `.github/workflows/ci.yml` (if adopted): wire onboarding parity check into CI gates.
- [x] `docs/work/onboarding-rollback-runbook.md`: rollback criteria + steps + owner.

## Alternative Approaches Considered
1. **Policy-first guidance expansion** (rejected for MVP)
   - Strong long-term governance, but slower user-perceived improvement in first 30 days.
2. **Quality-gate recovery first** (rejected for MVP)
   - Important but does not directly reduce onboarding friction quickly.

Chosen approach remains the brainstorm-selected adoption-speed path (see brainstorm: `docs/brainstorms/2026-03-05-onboarding-command-center-brainstorm.md`).

## System-Wide Impact
### Interaction Graph
- Contributor/agent starts in command-center doc → chooses task route → runs task commands → validates outcome.
- Task route updates call into existing commands (`pnpm build:widget`, `pnpm test:mcp-contract`, etc.) → those commands trigger package/platform scripts.
- Doc authority updates in README/docs indexes redirect discovery flows to one canonical source.

### Error & Failure Propagation
- Broken or stale command in a task route → user fails local run → onboarding confidence drops → repeated support churn.
- Broken links in onboarding docs → navigation dead ends → task abandonment.
- Missing agent checklist step → inconsistent toolchain state → false negatives in build/test outcomes.

### State Lifecycle Risks
- Partial migration risk: canonical doc added but older docs still positioned as authoritative.
- Inconsistent command updates across docs can reintroduce drift.
- Mitigation: explicit “authority banner” + centralized command snippets + link/command parity checks.

### API Surface Parity
No runtime API shape changes expected. Parity scope is **documentation + workflow interfaces**:
- Human surface parity: root README, docs index, guides index.
- Agent surface parity: AGENTS.md workflow expectations and preflight steps.

### Integration Test Scenarios
1. New human contributor follows command center -> token route -> reaches expected validation output within 15 minutes.
2. AI agent follows deterministic checklist -> widget route -> builds widget without missing prerequisite loops.
3. MCP route validates deployed/local endpoint path and contract command alignment.
4. Broken-link simulation in onboarding route fails doc lint/link checks.
5. Intentional command mismatch (`test:mcp` vs `test:mcp-contract`) is detected by parity check.

## Acceptance Criteria
### Functional Requirements
- [x] Canonical onboarding command-center doc exists and is linked from root README, docs README, and guides README.
- [x] Three task routes exist: add token, ship widget, test MCP integration.
- [x] Cross-route journey exists for token + widget + MCP combined flow.
- [x] Each task route includes prerequisites, happy path, failure modes, and validation commands.
- [x] Each task route includes a fallback path for missing prerequisite/tool/endpoint scenarios.
- [x] Deterministic agent checklist is included and references preflight conventions.
- [x] Superseded onboarding docs clearly redirect to canonical command center.
- [x] Baseline onboarding inventory and metrics are documented before authority migration.

### Non-Functional Requirements
- [ ] Primary onboarding happy paths are executable in <=15 minutes on a clean repo clone (target).
- [x] No broken internal links across onboarding docs.
- [x] Owner/review-cadence metadata is set for command-center and new task-route docs.
- [x] Rollback criteria and runbook are documented before full authority cutover.

### Quality Gates
- [x] `pnpm doc:lint` passes.
- [x] `node /Users/jamiecraik/dev/design-system/scripts/check-doc-links.mjs` passes.
- [x] Onboarding command-parity check passes (new or extended script).
- [x] Onboarding outcome assertions pass for all three primary task routes.
- [x] Plan for phased quality-rule re-enablement documented and approved.

## Success Metrics
- **Primary KPI:** % of new users/agents achieving first meaningful success in 15 minutes.
- **Secondary KPIs:**
  - Median time-to-first-success.
  - Reduction in onboarding-related clarification requests.
  - Reduction in conflicting “start here” instructions.
  - Fallback-path success rate when prerequisites are missing.
  - Drift incident rate (command exists but expected outcome fails).

### Measurement Plan
- Weekly onboarding smoke run (human + agent) against the three task routes.
- Track completion time and failure point per route.
- Record failures in a small onboarding log doc (for example `docs/work/onboarding-command-center-metrics.md`).
- Gate graduation from MVP when:
  - At least 80% of smoke runs complete within 15 minutes.
  - No unresolved command/link drift findings remain for command-center routes.
  - Fallback-path success is >=70% for seeded missing-prerequisite tests.
- Trigger rollback review if either condition holds for 2 consecutive weeks:
  - Time-to-first-success degrades by >20% vs baseline.
  - Support/clarification incidents increase by >25% vs baseline.

## Dependencies & Prerequisites
- Maintainer bandwidth to curate authoritative route content.
- Agreement on canonical route ownership.
- CI slot for doc parity checks (if introduced as required gate).

## Assumption Register (must be validated early)
- **A1:** Contributors will start from canonical entrypoints once linked prominently.
- **A2:** A 15-minute path is feasible across common local environments.
- **A3:** Command parity checks can detect meaningful onboarding drift.
- **A4:** Agent checklist + task routes remain synchronized over time.
- **A5:** Owners/review cadence assignments are sustained after launch.

## Risk Analysis & Mitigation
- **Risk:** Over-consolidation hides useful advanced detail.
  - **Mitigation:** Keep deep docs intact; command center links outward by task depth.
- **Risk:** Authority ambiguity persists if old docs stay unchanged.
  - **Mitigation:** Add explicit redirect banners and update index pages in same change set.
- **Risk:** Legacy entrypoints remain dominant in search/bookmarks.
  - **Mitigation:** authority-status inventory + redirect banners + periodic “top entrypoint” audit.
- **Risk:** Quality-rule re-enable scope explodes.
  - **Mitigation:** Stage by warning -> new violations -> touched files only.
- **Risk:** Checks validate syntax but miss real onboarding outcomes.
  - **Mitigation:** add outcome assertions with expected artifacts/results for each task route.
- **Risk:** Missing prerequisites create false failure signals and poor trust.
  - **Mitigation:** explicit fallback paths and seeded missing-prerequisite tests in canary week.

## Technical Review Findings (2026-03-05)
### High-priority adjustments
1. **Define exact parity-check contract before implementation.**
   - Add a named script target (for example `onboarding:parity:check`) and specify fail conditions (missing canonical link, stale command mismatch, missing task-route doc).
2. **Make ownership explicit to prevent command-center drift.**
   - Set owner + review cadence on command-center docs at creation time (avoid repeating `Owner: TBD` drift).
3. **Add rollback strategy for authority migration.**
   - If new command-center path causes confusion, retain prior quick-start content as archived references with explicit status labels.

### Medium-priority adjustments
1. **Set phased quality debt targets.**
   - For each Biome phase, define measurable exit criteria (for example: “0 new violations” then “N touched-file remediations per sprint”).
2. **Define KPI instrumentation source.**
   - Specify where onboarding timing data is recorded and who validates it weekly.

### Technical review acceptance add-ons
- [x] A concrete `onboarding:parity:check` command is defined in `package.json` (or equivalent script runner).
- [x] A concrete onboarding outcome-assertion check exists for token/widget/MCP routes.
- [x] Command-center owner and review cadence are set on all new onboarding docs.
- [x] Rollback notes are documented for command-center authority changes.
- [x] Phase 0 baseline metrics exist before authority migration.

## Resource Requirements
- 1 doc owner + 1 technical reviewer.
- 1-2 short validation sessions (human + agent walk-through).
- No new external services required for MVP.

## Future Considerations
- Promote command-center checks into `@brainwav/design-system-guidance` rules.
- Add task telemetry (optional) for ongoing onboarding KPI measurement.
- Extend task routes to release and security workflows once MVP stabilizes.

## Documentation Plan
Update/add:
- `docs/guides/ONBOARDING_COMMAND_CENTER.md` (new)
- `docs/guides/tasks/add-token.md` (new)
- `docs/guides/tasks/ship-widget.md` (new)
- `docs/guides/tasks/test-mcp-integration.md` (new)
- `README.md` (link to canonical command center)
- `docs/README.md` (link and authority positioning)
- `docs/guides/README.md` (task-route index)
- `docs/QUICK_START.md` (redirect and drift correction)
- `FORJAMIE.md` (required update when changes land)

## AI-Era Considerations
- AI accelerates authoring; this plan requires explicit human review for command accuracy and authority conflicts.
- Agent prompts/checklists should remain deterministic and short to reduce execution variance.
- Any AI-generated doc updates must pass doc/link/parity gates before merge.

## Sources & References
### Origin
- **Brainstorm document:** `docs/brainstorms/2026-03-05-onboarding-command-center-brainstorm.md`
- Carried-forward decisions:
  - Adoption speed is primary goal.
  - 30-day MVP scope.
  - Task-based routes + deterministic agent checklist.

### Internal References
- Onboarding and quick-start:
  - `/Users/jamiecraik/dev/design-system/README.md:80`
  - `/Users/jamiecraik/dev/design-system/docs/QUICK_START.md:65`
  - `/Users/jamiecraik/dev/design-system/docs/guides/DESIGN_SYSTEM_ADOPTION.md:97`
- Agent preflight pattern:
  - `/Users/jamiecraik/dev/design-system/scripts/codex-preflight.sh:4`
  - `/Users/jamiecraik/dev/design-system/scripts/codex-preflight.sh:108`
- Doc validation pattern:
  - `/Users/jamiecraik/dev/design-system/scripts/check-doc-links.mjs:144`
  - `/Users/jamiecraik/dev/design-system/scripts/check-doc-links.mjs:148`
- Machine-readable guidance rules:
  - `/Users/jamiecraik/dev/design-system/packages/design-system-guidance/rules.json:21`
- Quality-rule baseline for staged re-enable:
  - `/Users/jamiecraik/dev/design-system/biome.json:57`
  - `/Users/jamiecraik/dev/design-system/biome.json:58`

### External References
- Not required for this planning pass; initiative grounded in internal repo patterns.

### Related Work
- Prior maturity analysis:
  - `/Users/jamiecraik/dev/design-system/reports/design-system-maturity-audit-2026-02-05.md`
- Living project memory:
  - `/Users/jamiecraik/dev/design-system/FORJAMIE.md`
