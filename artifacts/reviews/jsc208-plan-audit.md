# JSC-208 Plan Audit (Unchecked Items)

Date: 2026-04-24
Plan: `docs/plans/2026-04-23-agent-design-engine-plan.md`
Scope focus: Phase 0, Phase 5 docs/adoption, roadmap/Linear consistency.

## 1) Already satisfied (unchecked in plan, but evidence exists)

### Phase 0

- `Phase 0 / "Vendor parity fixtures or document the chosen subtree/submodule strategy."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:672`)
  - Status: **Satisfied via vendored fixtures path**.
  - Evidence:
    - Vendored parity fixtures exist in-repo: `packages/agent-design-engine/tests/parity/atmospheric-glass.DESIGN.md`, `packages/agent-design-engine/tests/parity/totality-festival.DESIGN.md` (see inventory at `packages/agent-design-engine/tests` via file tree and `rg --files`).
    - Parity fixture ownership is documented: `FORJAMIE.md:69` and baseline pinned at `FORJAMIE.md:186`.

- `Phase 0 / "Confirm package naming for the internal engine before publishing any package-scoped command in docs."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:673`)
  - Status: **Satisfied**.
  - Evidence:
    - Canonical package name is set: `packages/agent-design-engine/package.json:2` (`"@brainwav/agent-design-engine"`).
    - Package-scoped commands are already using that package path/name consistently: `package.json:112-115`, `docs/guides/AGENT_DESIGN_WORKFLOW.md:22`.

- `Phase 0 / "Keep validation commands path-based until package naming is final."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:674`)
  - Status: **Satisfied**.
  - Evidence:
    - Path-based validation commands in plan: `docs/plans/2026-04-23-agent-design-engine-plan.md:701-703`.
    - Path-based workflow docs: `docs/guides/AGENT_DESIGN_WORKFLOW.md:64-69`.

- `Phase 0 / "Add or update the implementation issue/roadmap entry that points to this plan."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:676`)
  - Status: **Satisfied (Linear linkage exists)**.
  - Evidence:
    - Plan contains explicit Linear tracking and milestone issue map: `docs/plans/2026-04-23-agent-design-engine-plan.md:860-878`.
    - Linear parent issue `JSC-208` description includes canonical-plan pointer to this plan path, and child issues (`JSC-209`..`JSC-215`) exist with the same pointer (fetched live from Linear).

## 2) Still missing

### Phase 0

- `Phase 0 / "Inventory system-design examples, fixtures, parser tests, and exporter snapshots."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:671`)
  - Status: **Missing as an explicit inventory artifact**.
  - Evidence:
    - Current test corpus is minimal and does not show explicit exported snapshot inventory artifact: `packages/agent-design-engine/tests/engine.test.mjs:1-79`, `packages/agent-design-engine/tests` contains only `fixtures/*` and `parity/*` files.
    - No dedicated inventory doc found in `docs/`/`artifacts/` for this checklist item.

- `Phase 0 / "Confirm that v1 profile definitions remain in design-system-guidance."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:675`)
  - Status: **Missing / currently contradicted by implementation**.
  - Evidence:
    - Profile support is hardcoded in engine parser (`SUPPORTED_PROFILES`): `packages/agent-design-engine/src/parser.ts:7`.
    - Guidance package types/core do not define v1 brand profiles; they define rollout modes and migration state: `packages/design-system-guidance/src/types.ts:29-63`, `packages/design-system-guidance/src/core.ts:42-53`.

### Phase 5

- `"Update docs/guides/PRIVATE_GUIDANCE_PACKAGE.md."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:799`)
  - Status: **Missing (not updated for design-md/astudio design adoption flow)**.
  - Evidence:
    - Doc is still narrow init/check content and last updated 2026-03-04: `docs/guides/PRIVATE_GUIDANCE_PACKAGE.md:3-53`.

- `"Add docs/guides/DESIGN_MD_CONTRACT.md."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:800`)
  - Status: **Missing**.
  - Evidence:
    - File absent from `docs/guides/` listing (no `DESIGN_MD_CONTRACT.md` present).

- `"Update docs/design-system/CONTRACT.md."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:801`)
  - Status: **Missing for JSC-208 contract surfaces**.
  - Evidence:
    - Current contract index has no `DESIGN.md`/`astudio design`/compatibility-manifest coverage: `docs/design-system/CONTRACT.md:1-106`.

- `"Update release checklist with compatibility manifest requirements."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:803`)
  - Status: **Missing**.
  - Evidence:
    - Release checklist does not mention design compatibility manifest requirements: `docs/guides/RELEASE_CHECKLIST.md:17-66`.

- `"Add rollout notes for legacy, beta, and GA states."` (`docs/plans/2026-04-23-agent-design-engine-plan.md:804`)
  - Status: **Missing**.
  - Evidence:
    - No targeted rollout-state notes found in Phase 5 docs surfaces (`docs/guides/PRIVATE_GUIDANCE_PACKAGE.md`, `docs/design-system/CONTRACT.md`, `docs/guides/RELEASE_CHECKLIST.md`).

### Roadmap / Linear consistency

- Status synchronization is incomplete.
  - Evidence:
    - Plan text records focused local progress/gates (`docs/plans/2026-04-23-agent-design-engine-plan.md:69-72`), but key milestone child issues such as `JSC-209` (M0) and `JSC-214` (M5) are still `Triage` in Linear (fetched live).
  - Impact:
    - The plan-to-Linear link exists, but execution state is not yet synchronized.

## 3) Should remain deferred (for now)

These unchecked items are implementation-hardening backlog outside the requested focus lane and should remain unchecked until code+tests are delivered:

- Phase 2 fixture expansion from source contract docs: `docs/plans/2026-04-23-agent-design-engine-plan.md:716`.
- Phase 3 migration safety hardening (`init --force` policy, strict decoding tests, transition table, rollback/authenticity/path/checksum, quarantine/race tests): `docs/plans/2026-04-23-agent-design-engine-plan.md:740`, `:743`, `:745`, `:748-751`.
- Phase 4 protocol hardening (JSON schema fixtures, exit normalization/tests, manifest-gating scope tests, recovery payload fixtures, structured retry command shape, output-mode policy tests): `docs/plans/2026-04-23-agent-design-engine-plan.md:774`, `:776-783`.

Reason to defer: these are code/test deliverables tied to M2-M4 acceptance gates, not documentation-only checkbox flips.
