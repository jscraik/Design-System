---
title: feat: Onboarding Command Center MVP (15-minute success)
type: feat
status: active
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

### Implementation Phases
#### Phase 1: Foundation (Week 1)
- Create canonical command-center doc (new file): `docs/guides/ONBOARDING_COMMAND_CENTER.md`.
- Add explicit links from:
  - `/Users/jamiecraik/dev/design-system/README.md`
  - `/Users/jamiecraik/dev/design-system/docs/README.md`
  - `/Users/jamiecraik/dev/design-system/docs/guides/README.md`
- Add “authority note” in superseded quick-start docs (for example `/Users/jamiecraik/dev/design-system/docs/QUICK_START.md`).

**Success criteria**
- One canonical onboarding link appears in all three top-level readme surfaces.
- Superseded docs point users to command center in first screenful.

**Estimated effort**: 2-3 days

#### Phase 2: Core task routes (Week 2-3)
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

**Success criteria**
- Each task route can be executed independently.
- Each route has explicit validation commands and failure recovery notes.

**Estimated effort**: 5-7 days

#### Phase 3: Guardrails + quality staging (Week 4)
- Add command-drift checks for onboarding docs (script-level or policy-level).
- Extend existing doc validation to include critical onboarding command parity.
- Define phased quality-rule re-enable roadmap doc:
  - Phase A: warning-only checks for currently-disabled a11y/correctness subsets
  - Phase B: fail-on-new-violations
  - Phase C: incremental fail-on-touched-files

**Success criteria**
- `pnpm doc:lint` continues to pass.
- New onboarding drift checks run in CI or documented local gate.
- Quality re-enable roadmap has explicit entry/exit criteria.

**Estimated effort**: 3-5 days

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
- [ ] Canonical onboarding command-center doc exists and is linked from root README, docs README, and guides README.
- [ ] Three task routes exist: add token, ship widget, test MCP integration.
- [ ] Each task route includes prerequisites, happy path, failure modes, and validation commands.
- [ ] Deterministic agent checklist is included and references preflight conventions.
- [ ] Superseded onboarding docs clearly redirect to canonical command center.

### Non-Functional Requirements
- [ ] Primary onboarding happy paths are executable in <=15 minutes on a clean repo clone (target).
- [ ] No broken internal links across onboarding docs.
- [ ] Owner/review-cadence metadata is set for command-center and new task-route docs.

### Quality Gates
- [ ] `pnpm doc:lint` passes.
- [ ] `node /Users/jamiecraik/dev/design-system/scripts/check-doc-links.mjs` passes.
- [ ] Onboarding command-parity check passes (new or extended script).
- [ ] Plan for phased quality-rule re-enablement documented and approved.

## Success Metrics
- **Primary KPI:** % of new users/agents achieving first meaningful success in 15 minutes.
- **Secondary KPIs:**
  - Median time-to-first-success.
  - Reduction in onboarding-related clarification requests.
  - Reduction in conflicting “start here” instructions.

## Dependencies & Prerequisites
- Maintainer bandwidth to curate authoritative route content.
- Agreement on canonical route ownership.
- CI slot for doc parity checks (if introduced as required gate).

## Risk Analysis & Mitigation
- **Risk:** Over-consolidation hides useful advanced detail.
  - **Mitigation:** Keep deep docs intact; command center links outward by task depth.
- **Risk:** Authority ambiguity persists if old docs stay unchanged.
  - **Mitigation:** Add explicit redirect banners and update index pages in same change set.
- **Risk:** Quality-rule re-enable scope explodes.
  - **Mitigation:** Stage by warning -> new violations -> touched files only.

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
