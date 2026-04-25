---
title: "Agent Design Engine: DESIGN.md Contract, CLI, and Guidance Migration"
type: feat
status: draft
date: 2026-04-23
schema_version: 1
plan_route: fresh
plan_depth: deep
origin:
  - /Users/jamiecraik/dev/system-design
  - docs/audits/AGENT_UI_MARCH_2026_AUDIT.md
  - docs/guides/PRIVATE_GUIDANCE_PACKAGE.md
  - docs/cli-specs/astudio-cli-gold-standard-2026.md
---

# Agent Design Engine: DESIGN.md Contract, CLI, and Guidance Migration

## Table of Contents

- [Purpose](#purpose)
- [Current Evidence](#current-evidence)
- [Non-Negotiable Decisions](#non-negotiable-decisions)
- [Target Architecture](#target-architecture)
- [Contract Model](#contract-model)
- [CLI Contract](#cli-contract)
- [Migration And Rollback](#migration-and-rollback)
- [Implementation Plan](#implementation-plan)
- [Execution Milestones And Proceed Rules](#execution-milestones-and-proceed-rules)
- [Linear Tracking](#linear-tracking)
- [Validation Gates](#validation-gates)
- [Risks And Controls](#risks-and-controls)
- [Post-v1 Backlog](#post-v1-backlog)
- [Out Of Scope](#out-of-scope)
- [Next Stage Handoff](#next-stage-handoff)

## Purpose

Build an agent-first design-system contract that coding agents can reliably use when designing UI in consumer projects.

The system must let an agent answer these questions without guessing:

- Which design contract applies to this project or package?
- Which tokens, profile, and UI composition rules are canonical?
- Which deviations are warnings, failures, or accepted exceptions?
- Which command output is safe to parse and act on?
- How can a project adopt or roll back the contract without corrupting state?

This plan replaces the prior chat-only planning notes. It is the durable execution plan for implementing the optimal agent-useful UI design contract inside this monorepo.

## Current Evidence

The existing repo already has strong raw material:

- `packages/tokens` owns DTCG token source and generated outputs.
- `docs/design-system/CONTRACT.md` defines current token governance and QA gates.
- `packages/design-system-guidance` publishes `@brainwav/design-system-guidance` as the consumer-facing private guidance package.
- `packages/cli` already has an agent-oriented `astudio` CLI envelope, safety flags, and JSON output patterns.
- `docs/audits/AGENT_UI_MARCH_2026_AUDIT.md` identifies that guidance is too thin for professional agent-generated UI.

The external project at `/Users/jamiecraik/dev/system-design` is useful as a migration source, not as an ongoing authority. It provides a `DESIGN.md` parser/linter/export concept and fixtures worth porting, but it also has known behavior gaps that must be treated as explicit deltas:

- numeric spacing values can crash parser validation
- formatted headings can bypass section-order linting
- advertised text output format behavior is incomplete

2026-04-24 implementation evidence:

- Auto-review and helper-swarm artifacts were written to `artifacts/reviews/jsc208-correctness-auto.md`, `artifacts/reviews/jsc208-testing-auto.md`, `artifacts/reviews/jsc208-simplify-auto.md`, `artifacts/reviews/jsc208-plan-audit.md`, `artifacts/reviews/jsc208-implementation-gap-audit.md`, and `artifacts/reviews/jsc208-validation-audit.md`.
- Focused fixes landed for parser line numbers, explicit component extraction, profile error coverage, non-mutating init validation, project-root migration targeting, corrupt rollback metadata refusal, rollback quarantine, structured recovery payloads, design compatibility manifests, and CLI Biome command parity.
- Follow-up CLI protocol fixtures landed for every `astudio design *` success command plus policy, discovery, profile, and unavailable-recovery error cases. The fixtures validate the `astudio.command.v1` envelope with JSON Schema and assert the one-line stdout / empty-stderr byte contract.
- Local focused gates passed for `packages/agent-design-engine`, `packages/cli`, and `packages/design-system-guidance`.
- Root release-readiness gates passed for `pnpm test:policy`, `pnpm validate:tokens`, `pnpm ds:matrix:check`, `pnpm docs:lint`, `pnpm design-system-guidance:check:ci`, `pnpm test:e2e:web`, `pnpm test:a11y:widgets`, `pnpm build`, and `git diff --check`.
- Release readiness note: the focused JSC-208 path is green locally. Browser-backed gates require Playwright Chromium plus an unsandboxed macOS launch path; once that environment was available, the web E2E, widget a11y, and aggregate build gates passed. Remaining rollout risk is deeper migration fault-injection/race coverage and wrapper/engine boundary enforcement before GA.

## Non-Negotiable Decisions

1. Create `packages/agent-design-engine` as the internal semantic engine.
2. Keep `packages/design-system-guidance` as the consumer-facing wrapper and rollout policy package.
3. Add `astudio design ...` commands through `packages/cli`.
4. Treat `/Users/jamiecraik/dev/system-design` as a frozen migration baseline only.
5. Make `DESIGN.md` the design contract source of truth.
6. Keep `.design-system-guidance.json` as rollout state only.
7. Fail on ambiguous design-contract discovery instead of silently choosing the wrong contract.
8. Make every machine-facing command deterministic, schema-versioned, and parseable by agents.
9. Keep the semantic engine brand-agnostic.
10. Make migration and rollback transactional enough for CI and agent automation.
11. Preserve the existing `astudio.command.v1` outer JSON envelope.
12. Preserve existing aStudio exit-code meanings.

## Target Architecture

### Package Responsibilities

`packages/agent-design-engine` owns:

- `DESIGN.md` frontmatter and body parser
- semantic model
- lint rules
- machine-checkable professional UI rules compiled from `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- machine-checkable agent UI routing rules compiled from `docs/design-system/AGENT_UI_ROUTING.md`
- normalized model generation
- normalized design diff
- token export primitives
- profile comparison primitives
- finding IDs, severities, and schema definitions
- parity fixtures from the frozen `system-design` baseline

`packages/design-system-guidance` owns:

- consumer config file validation
- rollout mode selection
- legacy compatibility behavior
- CI mode behavior
- exception and ratchet policy
- profile resolution
- migration messaging
- wrapper release compatibility manifest

`packages/cli` owns:

- `astudio design ...` command registration
- `astudio.command.v1` envelope
- global safety flags
- JSON/plain output selection
- process exit behavior
- agent-mode recovery hints

Optional later extraction:

- Versioned profiles live in `packages/design-system-guidance` for v1.
- A separate `packages/design-profiles` package is post-GA only, triggered if profile data needs an independent release cadence or grows beyond wrapper ownership.

### Boundary Enforcement

The boundary must be enforced mechanically:

- `agent-design-engine` exposes only stable APIs through package `exports`.
- No package may import `agent-design-engine/src/**`.
- `design-system-guidance` may not parse markdown/YAML for `DESIGN.md`.
- `design-system-guidance` may not implement semantic lint, diff, token export, or profile comparison logic.
- `pnpm agent-design:boundaries` fails on deep imports and duplicate parser/rule ownership; `pnpm test:policy` runs the same guard as a design-system subcontract.

## Contract Model

### DESIGN.md Frontmatter

`DESIGN.md` owns the design contract metadata:

```yaml
---
schemaVersion: agent-design.v1
brandProfile: astudio-default@1
---
```

Contract-bearing fields must not live in `.design-system-guidance.json`.

Required frontmatter fields:

- `schemaVersion`
- `brandProfile`

### Professional UI Rule Sources

The v1 semantic contract is not limited to frontmatter and tokens. It must make the existing professional UI rules machine-checkable.

Required v1 rule sources:

- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- `docs/design-system/AGENT_UI_ROUTING.md`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/COVERAGE_MATRIX.json`

The enforceable rule contract must be represented by a canonical machine manifest, `agent-design.rules.v1`. Markdown remains the explanatory source for humans, but v1 findings must be generated from manifest entries with stable IDs, predicates, severities, source references, and fixture names. A rule cannot be enforced from prose alone.

The engine must expose stable finding IDs for at least these rule groups:

- `ui.hierarchy.*`: one primary title, meaningful section grouping, support-copy quality, CTA emphasis, and metadata emphasis.
- `ui.surface-role.*`: `shell`, `section`, `row`, `state`, and `accent` role discipline.
- `ui.state.*`: required async states, empty/error recovery expectations, and state presentation severity.
- `ui.focus.*`: scoped focus affordances and no bare global focus-ring rules.
- `ui.motion.*`: compositor-only motion, timing caps, and reduced-motion fallback.
- `ui.viewport-input.*`: dynamic viewport safety, safe-area handling, touch targets, non-hover access, and accessible names.
- `ui.routing.*`: component routing order, lifecycle manifest use, and default refusal to create duplicate abstractions.

Every finding produced from these rule groups must include a `sourceRef` that points to the manifest entry and its source document or JSON file. Contract-resolving JSON payloads must include provenance fields:

- `ruleManifestVersion`
- `rulePackVersion`
- `ruleSourceDigests`

`ruleSourceDigests` must include content digests for every rule source that affected the result. If a rule source is absent, unreadable, or not represented in the manifest, the command fails before semantic evaluation with `E_DESIGN_SCHEMA_INVALID`, exit `2`.

Gate 2 must fail unless these rule groups are represented by manifest entries, fixtures, and snapshot-tested findings. A passing syntax/token contract alone is not sufficient for v1.

### Brand Profile Resolution

Profile resolution must be deterministic.

Precedence:

1. `--profile <name@version>` for local exploratory commands only.
2. `DESIGN.md` frontmatter `brandProfile`.
3. wrapper default profile from the active compatibility manifest.

CI mode must reject `--profile` overrides unless an explicit `--allow-profile-override` flag is added in a later plan. This keeps CI inheritance tied to the checked-in contract.

Every contract-resolving JSON payload must include:

- `resolvedProfile`
- `profileSource`: `cli-override`, `design-frontmatter`, or `manifest-default`
- `profileVersion`

Profile-specific deterministic errors:

- `E_DESIGN_PROFILE_UNKNOWN`: exit `2`
- `E_DESIGN_PROFILE_UNSUPPORTED`: exit `3`
- `E_DESIGN_PROFILE_OVERRIDE_FORBIDDEN`: exit `3`

### Guidance Config

`.design-system-guidance.json` owns rollout state only:

```json
{
  "schemaVersion": 2,
  "docs": ["docs/guides/DESIGN_SYSTEM_ADOPTION.md"],
  "include": ["src/**/*.{ts,tsx,js,jsx}"],
  "ignore": ["node_modules", "dist", "build"],
  "designContract": {
    "mode": "legacy",
    "migrationState": "not-started"
  }
}
```

Existing v1 guidance config requires `docs` and may also include `include`, `ignore`, `scopes`, `scopePrecedence`, and `exemptionLedger`. The v2 `designContract` field is additive; it does not replace the current v1 guidance fields. The migration must use a dual-read adapter:

- v1 configs remain valid in `legacy` mode.
- v2 configs preserve current v1 fields and add `designContract`.
- migration to v2 must be lossless for `docs`, `include`, `ignore`, `scopes`, `scopePrecedence`, and `exemptionLedger`.
- v1 removal is blocked until adoption is measured and rollback tests cover v1/v2 transitions.
- decoding must be strict by supported schema version: v1 wrappers may accept only v1-compatible fields, and v2 wrappers must explicitly parse and preserve `designContract`.
- if `designContract.mode` cannot be represented by the running wrapper, commands must fail closed with `E_DESIGN_COMPATIBILITY_UNSUPPORTED` and exit `3`.
- unknown future `schemaVersion` values must fail with `E_DESIGN_SCHEMA_INVALID` rather than being coerced to `Number(...)`.

Valid `mode` values:

- `legacy`: current guidance checks remain active; `DESIGN.md` is optional and ignored by default.
- `design-md`: `DESIGN.md` is required; semantic engine checks run; wrapper policy checks still run.

Valid `migrationState` values:

- `not-started`
- `initialized`
- `active`
- `partial`
- `failed`
- `rolled-back`

### Discovery Rules

Every contract-consuming command resolves one effective design contract. `diff` is a two-input comparison command and uses the separate diff payload rules below.

Resolution order:

1. `--file <path>` always wins.
2. If `--scope root` is passed, use `<git-root>/DESIGN.md`.
3. If `--scope nearest` is passed, search from cwd upward to git root and use the nearest `DESIGN.md`.
4. If running in CI, require `--file` or `--scope`; otherwise fail with `E_DESIGN_DISCOVERY_REQUIRED`.
5. If running locally without `--file` or `--scope`, search from cwd upward to git root.
6. If the local search finds exactly one candidate, use it.
7. If the local search finds multiple candidates, fail with `E_DESIGN_CONTRACT_AMBIGUOUS` and require `--file` or `--scope root|nearest`.
8. If no contract is found in `design-md` mode, fail with `E_DESIGN_CONTRACT_MISSING`.

Every contract-resolving command JSON result must include:

- `resolvedDesignFile`
- `discoveryMode`
- `candidateDesignFiles`
- `designSchemaVersion`
- `brandProfile`
- `resolvedProfile`
- `profileSource`
- `profileVersion`
- `ruleManifestVersion`
- `rulePackVersion`
- `ruleSourceDigests`

These fields may be `null` only when the command has not resolved a contract by design, such as `init` before generation, `migrate --rollback` when operating only from rollback metadata, `doctor` in `legacy` mode without a `DESIGN.md`, or when resolution fails before a contract and rule pack are selected. `diff` is exempt from this singular-field requirement because it has explicit before/after inputs and uses the two-input payload fields defined below. `diff` must still report before/after rule provenance so agents can replay and triage semantic regressions deterministically.

This makes monorepo behavior explicit instead of depending on where an agent happened to run a command.

## CLI Contract

### Commands

Add these commands:

```bash
astudio design lint [--file DESIGN.md] [--scope root|nearest] [--warnings-as-errors]
astudio design diff --before old.md --after new.md [--fail-on-regression]
astudio design export [--file DESIGN.md] [--scope root|nearest] --format tailwind@4|dtcg@2025|json@agent-design.v1 [--out path] [--write]
astudio design check-brand [--file DESIGN.md] [--scope root|nearest] [--profile astudio-default@1] [--strict]
astudio design init [--target .] [--write] [--dry-run] [--force --yes]
astudio design migrate --to design-md [--write] [--dry-run] [--yes]
astudio design migrate --rollback [--write] [--dry-run] [--yes]
astudio design migrate --resume [--write] [--dry-run] [--yes]
astudio design doctor [--file DESIGN.md] [--scope root|nearest] [--active --exec]
```

### Command Contract Matrix

This matrix is the normative command contract. Do not redefine command behavior in later sections; reference this matrix instead.

| Command | Inputs | Legacy mode behavior | Write or exec gate | Output fields | Failure mapping |
| --- | --- | --- | --- | --- | --- |
| `lint` | optional `--file` or `--scope`; optional `--warnings-as-errors` | in CI, requires `--file` or `--scope` and otherwise fails with `E_DESIGN_DISCOVERY_REQUIRED`; locally requires `--file`, `--scope`, or one discoverable `DESIGN.md` and otherwise fails with `E_DESIGN_CONTRACT_MISSING` | read-only | singular design-contract fields | error finding exits `1`; warning only exits `0`; warning plus `--warnings-as-errors` exits `1` |
| `diff` | required `--before` and `--after`; optional `--fail-on-regression` | independent of project mode because it compares explicit files | read-only | diff two-input fields plus before/after rule provenance; no singular `resolvedDesignFile` | missing input, unsupported format, invalid input schema, or parse failure exits `2`; runtime/internal/execution failure exits `1`; regression exits `1` in CI or with `--fail-on-regression`; otherwise exits `0` |
| `export` | optional `--file` or `--scope`; required `--format`; optional `--out` | in CI, requires `--file` or `--scope` and otherwise fails with `E_DESIGN_DISCOVERY_REQUIRED`; locally requires `--file`, `--scope`, or one discoverable `DESIGN.md` and otherwise fails with `E_DESIGN_CONTRACT_MISSING` | read-only unless `--out`; `--out` requires `--write` | singular design-contract fields plus artifact metadata | unsupported export target, input validation failure, or schema validation failure exits `2`; semantic validation failure before export exits `1`; missing `--write` exits `3` with `E_POLICY`; write denial exits `3` |
| `check-brand` | optional `--file` or `--scope`; optional `--profile`; optional `--strict` | in CI, requires `--file` or `--scope` and otherwise fails with `E_DESIGN_DISCOVERY_REQUIRED`; locally requires `--file`, `--scope`, or one discoverable `DESIGN.md` and otherwise fails with `E_DESIGN_CONTRACT_MISSING` | read-only | singular design-contract fields plus resolved profile fields | required profile violation exits `1`; advisory mismatch exits `0`; advisory mismatch plus `--strict` exits `1`; unknown profile exits `2`; unsupported profile or forbidden CI override exits `3` |
| `init` | optional `--target`; optional `--dry-run`; optional `--force --yes` | may create a candidate `DESIGN.md` and v2 rollout state | writes only with `--write`; dry-run requires no `--write`; overwrite requires `--force --yes`; must refuse force-overwrite of existing v2 or migrated config until schema-aware round-trip writing preserves `designContract` and forward metadata | singular design-contract fields when generated or discovered | missing `--write` exits `3` with `E_POLICY` only when not `--dry-run` and a mutation would occur; overwrite refusal exits `3`; v2/migrated force-overwrite refusal exits `3`; inconsistent state exits `1`; successful dry run exits `0` |
| `migrate --to design-md` | optional `--dry-run`; optional `--yes` | requires or creates a valid `DESIGN.md` before changing mode | writes only with `--write`; dry-run requires no `--write` | migration artifact fields plus singular design-contract fields | missing `--write` exits `3` with `E_POLICY` only when not `--dry-run` and a mutation would occur; overwrite refusal exits `3`; invalid input/config exits `2`; semantic failure exits `1`; partial completion exits `4`; successful dry run exits `0` |
| `migrate --rollback` | optional `--dry-run`; optional `--yes` | restores previous rollout mode when compatible metadata exists | writes only with `--write`; dry-run requires no `--write` | rollback artifact fields | missing `--write` exits `3` with `E_POLICY` only when not `--dry-run` and a mutation would occur; unreadable rollback metadata exits `3`; incompatible state exits `1`; successful dry run exits `0` |
| `migrate --resume` | optional `--dry-run`; optional `--yes` | resumes `partial` or `failed` migration when metadata is readable | writes only with `--write`; dry-run requires no `--write` | migration artifact fields | missing `--write` exits `3` with `E_POLICY` only when not `--dry-run` and a mutation would occur; unreadable rollback metadata exits `3`; incompatible state exits `1`; partial completion exits `4`; successful dry run exits `0` |
| `doctor` | optional `--file` or `--scope`; optional `--active --exec` | reports `mode: legacy`, nullable design-contract fields, and exits `0` unless config, compatibility, or active checks fail | read-only by default; active checks require `--active --exec` | nullable singular design-contract fields | config-shape failure exits `2`; incompatible package versions exit `3`; actionable semantic/runtime problem exits `1`; healthy state exits `0` |

### Safety Flags

- `lint`, `diff`, `check-brand`, and default `doctor` are read-only.
- `export` is read-only unless `--out` is provided; `--out` requires `--write`.
- `init` and `migrate` require `--write` only for non-dry-run mutations.
- `--dry-run` never changes state and does not require `--write`.
- `doctor` may run optional active checks only with `--active --exec`.
- `init` must default to dry-run when overwrite would occur.
- Non-interactive overwrite requires `--force --yes`.
- `init --force --yes` must not replace an existing v2 or migrated `.design-system-guidance.json` with a v1 baseline. Until a schema-aware round-trip writer exists, force-init must fail with `E_POLICY`, exit `3`, and leave the file unchanged. After the writer exists, force-init may proceed only if it preserves `designContract`, unknown forward-compatible fields, and rollback metadata pointers.

### Exit Codes

Exit codes must preserve the existing aStudio CLI meaning:

- `0`: success, including warnings that do not cross the configured failure threshold
- `1`: semantic finding failure, brand violation, diff regression, runtime/internal failure, or external execution error
- `2`: invalid usage, invalid input, invalid config shape, unsupported format, schema validation failure, or discovery contract validation failure
- `3`: permission, safety, or compatibility refusal
- `4`: partial completion
- `130`: abort

Exit precedence:

```text
abort 130 > partial 4 > permission/policy 3 > usage 2 > failure 1 > success 0
```

Runtime class must be encoded in structured error codes such as `E_INTERNAL` or `E_EXEC`, not by redefining exit code `4`.

Design commands must not leak raw child-process exit codes. If a design command needs to call an external process, it must map the raw child status into the deterministic classes above before serializing JSON or returning the process exit code:

- child start failure, non-zero child exit, signal termination, or timeout: `E_EXEC`, exit `1`
- operator abort: exit `130`
- explicit partial completion after side effects: `E_PARTIAL`, exit `4`

Existing generic helpers such as `handleRun` may be reused only if they pass this normalization contract for design commands.

Deterministic error-code mapping:

- `E_DESIGN_DISCOVERY_REQUIRED`: exit `2`
- `E_DESIGN_CONTRACT_AMBIGUOUS`: exit `2`
- `E_DESIGN_CONTRACT_MISSING`: exit `2`
- `E_DESIGN_UNSUPPORTED_FORMAT`: exit `2`
- `E_DESIGN_CONFIG_INVALID`: exit `2`
- `E_DESIGN_SCHEMA_INVALID`: exit `2`
- `E_DESIGN_WRITE_REQUIRED`: exit `3`
- `E_POLICY`: exit `3`
- `E_DESIGN_COMPATIBILITY_UNSUPPORTED`: exit `3`
- `E_DESIGN_ROLLBACK_METADATA_UNREADABLE`: exit `3`
- `E_DESIGN_MANIFEST_MISSING`: exit `3`
- `E_DESIGN_MANIFEST_INVALID`: exit `3`
- `E_DESIGN_PROFILE_UNSUPPORTED`: exit `3`
- `E_DESIGN_PROFILE_OVERRIDE_FORBIDDEN`: exit `3`
- `E_DESIGN_PROFILE_UNKNOWN`: exit `2`
- `E_DESIGN_SEMANTIC_FINDING`: exit `1`
- `E_DESIGN_BRAND_VIOLATION`: exit `1`
- `E_DESIGN_DIFF_REGRESSION`: exit `1`
- `E_INTERNAL`: exit `1`
- `E_EXEC`: exit `1`

### JSON Output

`--json` must emit exactly one JSON object per run and keep the existing `astudio.command.v1` outer envelope:

- top-level `schema`
- top-level `meta`
- top-level `summary`
- top-level `status`
- top-level `data`
- top-level `errors`

Design-specific fields live under `data`. Do not add new required top-level fields to `astudio.command.v1`.

The top-level `status` enum remains unchanged: `success`, `warn`, or `error`.

Required outer envelope shape:

The example below is illustrative for `design lint`. The required outer envelope is normative; command-specific `data` fields are governed by the per-command payload matrix.

```json
{
  "schema": "astudio.command.v1",
  "meta": {
    "tool": "astudio",
    "version": "0.0.1",
    "timestamp": "2026-04-23T00:00:00.000Z",
    "outputMode": "json"
  },
  "summary": "design lint",
  "status": "error",
  "data": {
    "kind": "astudio.design.lint.v1",
    "command": "design lint",
    "exitCode": 1,
    "resolvedDesignFile": "/absolute/path/DESIGN.md",
    "discoveryMode": "nearest",
    "candidateDesignFiles": ["/absolute/path/DESIGN.md"],
    "designSchemaVersion": "agent-design.v1",
    "brandProfile": "astudio-default@1",
    "resolvedProfile": "astudio-default@1",
    "profileSource": "design-frontmatter",
    "profileVersion": "1",
    "ruleManifestVersion": "agent-design.rules.v1",
    "rulePackVersion": "astudio-professional-ui@1",
    "ruleSourceDigests": {
      "docs/design-system/PROFESSIONAL_UI_CONTRACT.md": "sha256:...",
      "docs/design-system/AGENT_UI_ROUTING.md": "sha256:...",
      "docs/design-system/COMPONENT_LIFECYCLE.json": "sha256:...",
      "docs/design-system/COVERAGE_MATRIX.json": "sha256:..."
    },
    "findings": [],
    "artifacts": []
  },
  "errors": []
}
```

Failure payload rules:

- `data.kind`, `data.command`, and `data.exitCode` are always present for design commands.
- `data.discoveryMode` and `data.candidateDesignFiles` are present for contract-resolving commands and omitted for `diff`.
- `data.resolvedDesignFile`, `data.designSchemaVersion`, and `data.brandProfile` are nullable on discovery and parse failures.
- `diff` replaces singular contract fields with `data.beforeFile`, `data.afterFile`, `data.beforeDesignSchemaVersion`, `data.afterDesignSchemaVersion`, `data.beforeRuleManifestVersion`, `data.afterRuleManifestVersion`, `data.beforeRulePackVersion`, `data.afterRulePackVersion`, `data.beforeRuleSourceDigests`, `data.afterRuleSourceDigests`, `data.ruleContextDelta`, and `data.brandProfileDelta`.
- `errors[]` must include deterministic `code`, `message`, `hint`, and `recovery` for every `status: "error"` result.
- warning-only results use `status: "warn"` or `status: "success"` according to command policy, keep exit `0`, and put advisory findings in `data.findings`; they must not be forced into `errors[]`.
- `recovery.fix_suggestion` is required when the CLI can express a deterministic remediation in prose.
- `recovery.nextCommand` is required only when a safe retry command can be expressed deterministically. In JSON mode it must be a structured object with `argv: string[]`, optional `cwd`, and optional `env`; shell-interpreted command strings are forbidden.
- `recovery.recoveryUnavailableReason` is required when no deterministic safe remediation or retry command exists.
- Policy and safety refusals must never invent a `nextCommand`; they must provide one only when it is side-effect-safe and complete.

Per-command design payload fields:

| Command kind | Required design payload fields | Omitted or nullable fields |
| --- | --- | --- |
| `astudio.design.lint.v1` | `resolvedDesignFile`, `discoveryMode`, `candidateDesignFiles`, `designSchemaVersion`, `brandProfile`, `resolvedProfile`, `profileSource`, `profileVersion`, `ruleManifestVersion`, `rulePackVersion`, `ruleSourceDigests`, `findings` | contract fields nullable only when resolution, rule-pack resolution, or parsing fails |
| `astudio.design.diff.v1` | `beforeFile`, `afterFile`, `beforeDesignSchemaVersion`, `afterDesignSchemaVersion`, `beforeRuleManifestVersion`, `afterRuleManifestVersion`, `beforeRulePackVersion`, `afterRulePackVersion`, `beforeRuleSourceDigests`, `afterRuleSourceDigests`, `ruleContextDelta`, `brandProfileDelta`, `findings`, `diff` | omits singular `resolvedDesignFile`, `discoveryMode`, and `candidateDesignFiles` |
| `astudio.design.export.v1` | `resolvedDesignFile`, `discoveryMode`, `candidateDesignFiles`, `designSchemaVersion`, `brandProfile`, `resolvedProfile`, `profileSource`, `profileVersion`, `ruleManifestVersion`, `rulePackVersion`, `ruleSourceDigests`, `format`, `artifacts` | `artifacts` empty for dry-run or stdout-only export |
| `astudio.design.checkBrand.v1` | `resolvedDesignFile`, `discoveryMode`, `candidateDesignFiles`, `designSchemaVersion`, `brandProfile`, `resolvedProfile`, `profileSource`, `profileVersion`, `ruleManifestVersion`, `rulePackVersion`, `ruleSourceDigests`, `findings` | contract fields nullable only when resolution, rule-pack resolution, or parsing fails |
| `astudio.design.init.v1` | `target`, `wouldCreate`, `wouldModify`, `wouldOverwrite`, `artifacts`, nullable singular design-contract fields | contract fields nullable before a file is generated |
| `astudio.design.migrate.v1` | `migrationState`, `rollbackMetadata`, `artifacts`, `wouldModify`, nullable singular design-contract fields | contract fields nullable on rollback-only failures |
| `astudio.design.doctor.v1` | `mode`, `checks`, `nextActions`, `resolvedDesignFile`, `discoveryMode`, `candidateDesignFiles`, nullable singular design-contract fields | contract fields nullable in `legacy` mode without a `DESIGN.md` |

Determinism requirements:

- stable key ordering in snapshots
- stable finding IDs
- deterministic finding sort order
- absolute paths in JSON
- LF line endings
- UTF-8 output
- locale-independent number formatting
- normalized path separators in machine fields
- stdout contains only the JSON object when `--json` is active
- stderr is reserved for process diagnostics
- `--agent` and CI mode must default to `--json` for `astudio design` commands unless the caller explicitly selects `--plain`.
- machine callers in `--agent` or CI mode must never receive human-oriented output by omission; omission means JSON, not refusal.
- `E_POLICY` for output mode is reserved for incompatible explicit combinations, such as requesting `--plain` while also requiring machine JSON fixtures.
- `meta.outputMode` must be present and set to `json` or `plain` for every design command output.

### Schema Versions

Initial schema IDs:

- `astudio.design.lint.v1`
- `astudio.design.diff.v1`
- `astudio.design.export.v1`
- `astudio.design.checkBrand.v1`
- `astudio.design.init.v1`
- `astudio.design.migrate.v1`
- `astudio.design.doctor.v1`
- `agent-design.normalizedModel.v1`
- `agent-design.diff.v1`

Breaking output changes require a schema version bump.

## Migration And Rollback

### Frozen Baseline

Before implementation, record the exact upstream repository URL and commit used as the parity baseline.

Create a parity fixture set from that baseline:

- valid examples
- invalid examples
- exporter snapshots
- parser edge cases
- semantic lint findings

The fixture snapshot must be vendored into this repo or pinned through an explicit git subtree/submodule decision. Release artifacts must never depend on `/Users/jamiecraik/dev/system-design` existing on a machine.

Each intentional behavior difference must be classified:

- `bugfix`
- `behavioral-change`
- `breaking`

Each delta must include:

- fixture evidence
- reason for the change
- migration note
- temporary compatibility flag if the change is non-trivial for consumers

### Adoption Flow

`astudio design init`:

- reads the selected profile
- previews generated `DESIGN.md`
- previews `.design-system-guidance.json` rollout-state changes
- reports `wouldCreate`, `wouldModify`, and `wouldOverwrite`
- writes only when safety flags permit it

`astudio design migrate --to design-md`:

- validates current guidance config
- validates canonical `DESIGN.md`
- runs semantic lint
- runs brand check
- writes rollback metadata before mutation
- writes `migrationState: partial` before any irreversible mutation
- writes temp artifacts
- validates temp `DESIGN.md` and temp `.design-system-guidance.json` together
- commits by atomic rename where the platform supports it
- updates `mode: design-md` and `migrationState: active` in the final commit step
- emits migration artifact details

`astudio design migrate --rollback`:

- reads versioned rollback metadata
- restores previous rollout mode when compatible backup metadata exists
- marks `migrationState` as `rolled-back`
- quarantines migrated `DESIGN.md` to a deterministic, collision-safe rollback artifact path unless the operator explicitly passes a future `--keep-design-md` option
- reports ignored artifacts
- reports remaining manual cleanup

`astudio design migrate --resume`:

- resumes a `partial` or `failed` migration when rollback metadata is readable
- fails with exit `3` when metadata is unreadable and reports the exact operator action

Migration transition table:

| Current mode | Current state | Metadata | Allowed command | Required behavior |
| --- | --- | --- | --- | --- |
| `legacy` | `not-started` | absent | `init`, `migrate --to design-md --dry-run` | preview only unless `--write` is present |
| `legacy` | `initialized` | optional | `migrate --to design-md` | write rollback metadata, set `partial`, then mutate |
| `legacy` | `partial` | readable | `migrate --resume`, `migrate --rollback`, `doctor` | resume or rollback; `doctor` prints both valid commands |
| `legacy` | `failed` | readable | `migrate --resume`, `migrate --rollback`, `doctor` | resume or rollback; `doctor` prints both valid commands |
| `design-md` | `partial` | readable | `migrate --resume`, `migrate --rollback`, `doctor` | complete activation or rollback; no other design command may mutate |
| `design-md` | `active` | optional | normal read/check/export commands | healthy migrated state |
| `design-md` | `rolled-back` | readable | `doctor`, `migrate --to design-md` | report rolled-back state and require explicit remigration |
| any | any non-terminal state | missing or unreadable | `doctor`, `migrate --rollback` | fail closed with `E_DESIGN_ROLLBACK_METADATA_UNREADABLE`, exit `3`, and no side effects; rollback is permitted only as a deterministic fail-closed no-op |

All combinations not listed are invalid states. `doctor` must detect every invalid `(mode, migrationState, metadata)` combination and return a deterministic next action; it must not special-case only `partial` and `failed`.

Rollback metadata schema:

- schema ID: `astudio.design.rollback.v1`
- required fields: `schema`, `writtenByWrapperVersion`, `writtenAt`, `sourceMode`, `targetMode`, `sourceSchemaVersion`, `targetSchemaVersion`, `guidanceConfigPath`, `guidanceConfigChecksum`, `designFilePath`, `designFileChecksum`, `rollbackArtifactDir`, `legacySupportEndsAtAtWrite`, `operationId`, `metadataDigest`, and `metadataSignature`
- backward-read guarantee: current wrapper must read rollback metadata for the entire published legacy support window, not merely the previous two minor versions
- compatibility algorithm: read `schema`; verify `metadataDigest` and `metadataSignature` against the release manifest or configured local signing key; verify all paths are under the project root or declared artifact root; reject symlink escape and absolute-path substitution; compute rollback eligibility from the current release metadata using the later-of policy; treat `legacySupportEndsAtAtWrite` as provenance only; verify `writtenByWrapperVersion` is within the published legacy support window; verify config and design-file checksums match before mutation; then restore source mode using atomic temp writes
- unreadable metadata must fail closed with exit `3`
- `doctor` must detect every non-healthy state in the migration transition table and print the next valid command
- missing or unreadable metadata must never trigger best-effort rollback mutation. `doctor` must emit one canonical remediation path, either restore the metadata from the recorded artifact location or rerun migration after manually clearing the invalid partial state.

Rollback quarantine behavior:

- quarantine paths use `artifacts/design-migrations/<operationId>/<contentHash>-DESIGN.md`
- `operationId` is deterministic for a migration attempt and includes the UTC timestamp plus a short hash of the original guidance config checksum
- existing quarantine files are never overwritten; writers must use atomic create semantics such as `O_EXCL` or an equivalent platform-safe operation; collisions append `-<n>` and are reported in JSON artifacts
- repeated rollback and remigration attempts must be idempotent and must not delete older quarantine artifacts
- concurrent rollback attempts must be covered by race tests that prove only one writer wins each quarantine path
- retention cleanup is explicit future work; v1 may report stale quarantine artifacts but must not prune them automatically

### Compatibility Manifest

Every wrapper release must include a compatibility manifest:

```json
{
  "wrapperVersion": "0.0.3",
  "engineVersionRange": "0.1.x",
  "minWrapper": "0.0.3",
  "maxWrapperTested": "0.0.x",
  "supportedDesignSchemas": ["agent-design.v1"],
  "supportedCommandSchemas": [
    "astudio.design.lint.v1",
    "astudio.design.diff.v1",
    "astudio.design.export.v1",
    "astudio.design.checkBrand.v1",
    "astudio.design.init.v1",
    "astudio.design.migrate.v1",
    "astudio.design.doctor.v1"
  ],
  "supportedMigrationSchemas": [
    "astudio.design.rollback.v1"
  ],
  "parityBaseline": {
    "source": "https://github.com/jscraik/system-design.md.git",
    "commit": "8ecd4645b957e6a683a05fb9c79cd6c9028873d0"
  }
}
```

The CLI must resolve the top-level command before loading the design compatibility manifest. Non-design commands bypass design manifest validation in v1 so a broken design manifest cannot brick unrelated aStudio commands.

For normal `astudio design *` commands, the wrapper must load and validate the compatibility manifest before any design handler runs. Missing, corrupt, unreadable, or schema-invalid manifests fail closed with `E_DESIGN_MANIFEST_MISSING` or `E_DESIGN_MANIFEST_INVALID`, exit `3`, and no side effects.
Design command startup must fail with exit `3` when wrapper and engine versions are incompatible.
In v1, manifest command-schema gating applies only to `astudio design *` commands. Existing non-design aStudio commands are out of scope unless they later opt into `data.kind`.
Before any design handler runs, the CLI or wrapper must resolve the command kind that would be emitted under `data.kind` and reject the command with exit `3` if that schema is not listed in the active compatibility manifest.
This pre-handler compatibility check must run before filesystem writes, migration state changes, rollback metadata mutation, and external execution.
After execution, JSON fixture tests must also assert that every emitted `data.kind` is listed in `supportedCommandSchemas`; this post-run assertion is a safety net, not the first guard.

Recovery exception: `astudio design doctor` and `astudio design migrate --rollback --dry-run` must still run a minimal built-in recovery path when the compatibility manifest is missing or corrupt. This recovery path may read config, inspect rollback metadata, and emit diagnostics, but it must not perform writes, external execution, migration state changes, or rollback metadata mutation. A write-capable rollback still requires a valid compatibility manifest and authenticated rollback metadata before mutation.

### Legacy Support Window

Legacy support remains available until the later of:

- 90 days after the GA tag timestamp
- two minor wrapper releases after GA

The computed end-of-life date must be published in release metadata.

Release metadata must also include:

- `legacySupportEndsAt`
- `legacyModeAllowed`
- `minimumWrapperForDesignMd`

After the published support window ends, legacy mode refusal exits `3` with a deterministic remediation hint.

## Implementation Plan

### Phase 0: Plan Hardening And Baseline Capture

Goal: make the execution surface unambiguous before coding.

Tasks:

- [x] Record the frozen `system-design` baseline commit.
- [x] Inventory `system-design` examples, fixtures, parser tests, and exporter snapshots.
- [x] Vendor parity fixtures or document the chosen subtree/submodule strategy.
- [x] Confirm package naming for the internal engine before publishing any package-scoped command in docs.
- [x] Keep validation commands path-based until package naming is final.
- [x] Confirm that v1 profile definitions remain in `design-system-guidance`.
- [ ] Add or update the implementation issue/roadmap entry that points to this plan.

Validation:

- baseline commit recorded in this plan or linked artifact
- no unresolved package naming conflict
- v1 profile ownership confirmed as `design-system-guidance`

### Phase 1: Engine Skeleton And Parity Harness

Goal: create the internal package with tests before adding aStudio-specific behavior.

Tasks:

- [x] Create `packages/agent-design-engine`.
- [x] Add TypeScript build, type-check, and test scripts.
- [x] Define public exports only.
- [x] Add parser/model interfaces.
- [x] Add fixture loader and snapshot harness.
- [x] Import frozen parity fixtures from `system-design`.
- [x] Add explicit delta fixtures for known behavior fixes.

Validation:

```bash
pnpm -C packages/agent-design-engine type-check
pnpm -C packages/agent-design-engine test
```

### Phase 2: Semantic Contract Implementation

Goal: make `DESIGN.md` parseable, lintable, diffable, and exportable.

Tasks:

- [x] Implement frontmatter parser for `schemaVersion` and `brandProfile`.
- [x] Implement body parser and normalized semantic model.
- [x] Implement lint finding model with stable IDs and severities.
- [x] Add canonical `agent-design.rules.v1` manifest with source references, predicates, severities, fixture names, and rule source digests.
- [x] Implement machine-checkable rule groups for hierarchy, surface roles, state, focus, motion, viewport/input, and component routing.
- [x] Add fixtures derived from `PROFESSIONAL_UI_CONTRACT.md`, `AGENT_UI_ROUTING.md`, `COMPONENT_LIFECYCLE.json`, and `COVERAGE_MATRIX.json`.
- [x] Add rule provenance to contract-resolving payloads and finding snapshots.
- [x] Implement normalized model schema `agent-design.normalizedModel.v1`.
- [x] Implement semantic diff schema `agent-design.diff.v1`.
- [x] Add before/after rule provenance and `ruleContextDelta` to semantic diff output.
- [x] Implement token export targets `json@agent-design.v1`, `dtcg@2025`, and `tailwind@4`.
- [x] Add deterministic output canonicalization.

Validation:

```bash
pnpm -C packages/agent-design-engine test
pnpm -C packages/agent-design-engine type-check
```

### Phase 3: Guidance Wrapper Migration

Goal: keep consumers stable while adding `design-md` mode.

Tasks:

- [x] Update `.design-system-guidance.json` schema to separate rollout state from contract metadata.
- [x] Add v1/v2 dual-read support for existing guidance config.
- [x] Preserve `docs`, `include`, `ignore`, `scopes`, `scopePrecedence`, and `exemptionLedger` during migration.
- [x] Block `init --force --yes` from overwriting v2 or migrated guidance config until schema-aware round-trip writing preserves `designContract` and unknown forward metadata.
- [x] Add `legacy` and `design-md` mode handling.
- [x] Add compatibility manifest validation.
- [x] Add strict v1/v2 config decoding and downgrade/unsupported-mode refusal tests.
- [x] Add wrapper-to-engine integration path.
- [x] Add boundary checks preventing wrapper parser/rule duplication.
- [x] Keep existing legacy checks operational.
- [x] Add transactional migration, rollback, and resume state handling.
- [ ] Implement the migration transition table and crash-safe `partial` marker before mutation.
- [ ] Implement required rollback metadata fields, authenticity checks, path-root checks, compatibility algorithm, and checksum validation.
- [x] Add rollback quarantine behavior for migrated `DESIGN.md`.
- [ ] Add collision-safe quarantine paths, atomic create semantics, repeated rollback/remigration tests, and concurrent-writer race tests.

Validation:

```bash
pnpm -C packages/design-system-guidance type-check
pnpm -C packages/design-system-guidance build
pnpm -C packages/design-system-guidance check:ci
```

### Phase 4: CLI Integration

Goal: expose the engine through agent-safe `astudio design` commands.

Tasks:

- [x] Register `astudio design lint`.
- [x] Register `astudio design diff`.
- [x] Register `astudio design export`.
- [x] Register `astudio design check-brand`.
- [x] Register `astudio design init`.
- [x] Register `astudio design migrate`.
- [x] Register `astudio design doctor`.
- [x] Add command JSON schemas and fixtures.
- [x] Keep `astudio.command.v1` outer envelope unchanged and put design payload under `data`.
- [x] Add per-command exit-code tests.
- [ ] Add design-command exit normalization for external execution so raw child exits cannot leak.
- [x] Resolve top-level command before design manifest validation so non-design aStudio commands bypass design manifest checks.
- [x] Scope compatibility manifest command gating to `astudio design *`.
- [x] Add profile-resolution precedence and profile error tests.
- [ ] Add recovery payload fixtures for policy, safety, compatibility, discovery, profile, and execution failures, including unavailable-recovery cases.
- [x] Represent `recovery.nextCommand` as structured argv/cwd/env JSON in machine mode and reject shell-string retry commands.
- [x] Add agent/CI output-mode tests proving omitted mode defaults to JSON and explicit incompatible modes fail with `E_POLICY`.
- [x] Ensure command output follows existing `astudio.command.v1` envelope.

Validation:

```bash
pnpm -C packages/cli test
pnpm -C packages/cli build
```

### Phase 5: Docs, Adoption, And Release

Goal: make the feature operational for humans and agents.

Tasks:

- [x] Update `docs/guides/PRIVATE_GUIDANCE_PACKAGE.md`.
- [x] Add `docs/guides/DESIGN_MD_CONTRACT.md`.
- [x] Update `docs/design-system/CONTRACT.md`.
- [x] Update CLI agent guide with `astudio design` workflows.
- [x] Update release checklist with compatibility manifest requirements.
- [x] Add rollout notes for legacy, beta, and GA states.
- [x] Update `FORJAMIE.md` if implementation changes package structure, commands, or operating model.

Validation:

```bash
pnpm docs:lint
pnpm design-system-guidance:check:ci
```

### Phase 6: Full Verification And Release Readiness

Goal: prove the integrated path before rollout.

Tasks:

- [x] Run engine tests.
- [x] Run CLI tests.
- [x] Run guidance tests.
- [x] Run root policy checks.
- [x] Run token and matrix checks if docs or token contracts changed.
- [x] Produce release readiness notes with remaining risks.

Validation:

```bash
pnpm -C packages/agent-design-engine test
pnpm -C packages/cli test
pnpm -C packages/design-system-guidance check:ci
pnpm test:policy
pnpm validate:tokens
pnpm ds:matrix:check
```

## Execution Milestones And Proceed Rules

Use this table as the implementation control surface. Each milestone must end with the listed validation command output captured in the implementation notes or release-readiness artifact. Do not proceed on inferred success.

| Milestone | Build | Test | Proceed when | Stop when |
| --- | --- | --- | --- | --- |
| M0: baseline and naming | no package build yet | baseline and naming checks from Gate 0 | frozen `system-design` baseline, package ownership, and profile ownership are recorded | baseline commit, package name, or profile owner is ambiguous |
| M1: engine skeleton | `pnpm -C packages/agent-design-engine type-check` | `pnpm -C packages/agent-design-engine test` | public exports, fixture harness, and frozen parity fixtures pass | parser ownership, package exports, or parity fixture strategy is unclear |
| M2: semantic contract | `pnpm -C packages/agent-design-engine type-check` | `pnpm -C packages/agent-design-engine test` | `DESIGN.md`, normalized model, rule manifest, lint, diff, export, rule provenance, and deterministic snapshots pass Gate 2 | syntax/token checks pass but professional UI rule fixtures or provenance are missing |
| M3: guidance wrapper migration | `pnpm -C packages/design-system-guidance build` | `pnpm -C packages/design-system-guidance check:ci` plus package type-check | v1/v2 config preservation, migration state machine, rollback metadata, quarantine, manifest compatibility, and race tests pass Gate 3 | any migration command can erase config state, mutate without rollback metadata, or continue after unreadable metadata |
| M4: CLI integration | `pnpm -C packages/cli build` | `pnpm -C packages/cli test` | all `astudio design` commands satisfy JSON envelope, exit-code, output-mode, recovery, profile, compatibility, and byte-protocol tests in Gate 4 | raw child exits leak, stdout contains non-JSON in JSON mode, or recovery commands are shell strings |
| M5: docs and adoption | no new package build required unless docs tooling invokes it | `pnpm docs:lint` and `pnpm design-system-guidance:check:ci` | adoption, rollback, troubleshooting, and agent workflow docs are machine-actionable and current | docs describe commands, schemas, or rollback behavior not implemented in M1-M4 |
| M6: release readiness | package builds from M1, M3, and M4 | full verification command set from Phase 6 | every required command passes, or blockers are recorded with exact command, exit code, and failure text | any blocker lacks exact reproduction evidence or a rollback/adoption risk remains unclassified |

Proceed policy:

- Do not start the next milestone until the current milestone's validation and gate are both satisfied.
- If a validation command is unavailable because the package does not exist yet, the milestone must include the package creation task before validation can be marked complete.
- If a gate fails, fix the plan or implementation before adding scope.
- If a failure is environmental rather than code-related, record the exact command, exit code, stderr/stdout summary, and the blocked gate.
- Do not mark a milestone complete from review text alone; completion requires local validation evidence.

## Linear Tracking

The repo plan is canonical. Linear tracks execution state, ownership, and milestone sequencing. Do not duplicate this full plan into Linear; link to this file and keep the issue descriptions focused on execution evidence.

Parent issue:

- `JSC-208`: [Agent Design Engine: DESIGN.md contract and agent UI guidance](https://linear.app/jscraik/issue/JSC-208/agent-design-engine-designmd-contract-and-agent-ui-guidance)

Milestone issues:

| Milestone | Linear issue | Dependency |
| --- | --- | --- |
| M0: baseline and naming | `JSC-209`: [Capture frozen system-design baseline and package ownership](https://linear.app/jscraik/issue/JSC-209/m0-capture-frozen-system-design-baseline-and-package-ownership) | none |
| M1: engine skeleton | `JSC-210`: [Create agent-design-engine skeleton and parity harness](https://linear.app/jscraik/issue/JSC-210/m1-create-agent-design-engine-skeleton-and-parity-harness) | blocked by `JSC-209` |
| M2: semantic contract | `JSC-211`: [Implement DESIGN.md semantic contract and rule manifest](https://linear.app/jscraik/issue/JSC-211/m2-implement-designmd-semantic-contract-and-rule-manifest) | blocked by `JSC-210` |
| M3: guidance wrapper migration | `JSC-212`: [Add guidance wrapper migration and rollback safety](https://linear.app/jscraik/issue/JSC-212/m3-add-guidance-wrapper-migration-and-rollback-safety) | blocked by `JSC-211` |
| M4: CLI integration | `JSC-213`: [Add astudio design CLI commands and JSON protocol](https://linear.app/jscraik/issue/JSC-213/m4-add-astudio-design-cli-commands-and-json-protocol) | blocked by `JSC-212` |
| M5: docs and adoption | `JSC-214`: [Document adoption, rollback, and agent workflows](https://linear.app/jscraik/issue/JSC-214/m5-document-adoption-rollback-and-agent-workflows) | blocked by `JSC-213` |
| M6: release readiness | `JSC-215`: [Run release-readiness verification for Agent Design Engine](https://linear.app/jscraik/issue/JSC-215/m6-run-release-readiness-verification-for-agent-design-engine) | blocked by `JSC-214` |

Linear completion rule:

- A Linear milestone issue may move to done only after the matching milestone validation commands and gate pass locally, or after blockers are recorded with exact command, exit code, and failure text.
- The parent issue may move to done only after all milestone issues are done and Gate 6 has either passed or documented all remaining release blockers.

## Validation Gates

Do not start the next phase until the current phase passes its gate.

Gate 0:

- frozen baseline selected
- package ownership confirmed
- profile ownership confirmed

Gate 1:

- engine package builds
- parity fixtures run
- explicit deltas documented

Gate 2:

- semantic model, lint, diff, and export schemas are snapshot-tested
- canonical `agent-design.rules.v1` manifest is snapshot-tested and maps every enforced rule to a source reference
- professional UI rule groups are machine-checkable and fixture-backed
- agent UI routing rules are machine-checkable and fixture-backed
- finding snapshots prove stable `sourceRef`, `ruleManifestVersion`, `rulePackVersion`, and `ruleSourceDigests`
- diff snapshots prove before/after rule provenance and `ruleContextDelta`
- deterministic output tests pass

Gate 3:

- guidance wrapper supports both `legacy` and `design-md`
- compatibility manifest rejects unsupported engine versions
- compatibility manifest rejects unsupported command schemas
- non-design aStudio commands bypass design compatibility manifest loading in v1
- rollback behavior is tested
- migration transition table is fully tested across valid and invalid state combinations
- fault-injection tests cover interruption at each migration step
- unreadable rollback metadata fails closed with exit `3`
- unreadable rollback metadata produces no rollback mutation and `doctor` reports one canonical remediation
- rollback metadata required fields, authenticity, path-root checks, and checksum compatibility are fixture-tested across the full support window
- migrated `DESIGN.md` quarantine paths are collision-safe and idempotent across repeated rollback/remigration attempts
- quarantine writes use atomic create semantics and pass concurrent-writer race tests
- `migrate --resume` is idempotent after repeated invocation
- `migrate --rollback` is idempotent after repeated invocation
- rollback metadata readability covers the full published legacy support window
- strict v1/v2 config decoding prevents silent split-brain across wrapper versions
- `init --force --yes` cannot erase v2 or migrated rollout state
- legacy end-of-life calculation is covered by time-boundary tests

Gate 4:

- every CLI command has JSON schema fixtures
- exit-code matrix tests pass
- design-command external execution normalizes raw child exits to deterministic classes
- every deterministic error-code mapping has a fixture
- every error-status result has `hint` and `recovery`; deterministic safe retries include structured `nextCommand`; unavailable recoveries include `recoveryUnavailableReason`; warning-only results stay out of `errors[]`
- profile-resolution precedence and profile error paths are fixture-tested
- compatibility manifest gating is proven scoped to `astudio design *`
- missing/corrupt manifest fails closed before normal design command handler dispatch, does not affect non-design commands, and still permits read-only recovery diagnostics for `doctor` and rollback dry-runs
- CI discovery ambiguity fails deterministically
- `diff` has two-input payload tests, before/after rule provenance, and `ruleContextDelta` independent of singular design-contract discovery
- `--json` byte-level protocol tests prove stdout contains exactly one JSON object
- `--json` byte-level protocol tests prove stderr is empty on non-diagnostic runs
- JSON fixtures prove stable key order, stable finding order, normalized paths, and fixed locale-sensitive formatting
- agent/CI output-mode tests prove omitted output mode defaults to JSON and explicit incompatible output modes get `E_POLICY`

Gate 5:

- docs explain adoption, rollback, and troubleshooting
- agent guide includes machine-parseable workflow examples

Gate 6:

- integrated verification commands pass or blockers are recorded with exact failure text

## Risks And Controls

Risk: split source of truth between `DESIGN.md` and config.

Control: contract metadata lives only in `DESIGN.md`; config stores rollout state only; contradictions fail validation.

Risk: monorepo command runs use the wrong design contract.

Control: CI requires `--file` or `--scope`; local discovery reports candidates and fails on ambiguity unless exactly one contract candidate exists.

Risk: wrapper and engine drift.

Control: package exports, deep-import ban, compatibility manifest, startup compatibility check, and integration tests.

Risk: agent parses unstable command output.

Control: one-object JSON output, existing `astudio.command.v1` envelope, design payload under `data.kind`, stable finding IDs, deterministic ordering, and explicit exit-code matrix.

Risk: migration leaves half-applied state.

Control: staged validation, temp writes, atomic rename where supported, versioned rollback metadata, `partial`/`failed` states, `migrate --resume`, `migrate --rollback`, and doctor diagnostics.

Risk: profile rules leak into the engine.

Control: engine accepts profile data but does not own profile definitions; the wrapper owns v1 versioned profile data.

Risk: parity with `system-design` becomes a moving target.

Control: frozen baseline commit, parity snapshots, classified deltas, and changelog entries for new divergence.

## Post-v1 Backlog

These items are intentionally not part of v1 implementation because they add optional surface area without improving the first safe migration path.

- Add optional `DESIGN.md` frontmatter fields such as `owner`, `lastReviewed`, `exceptions`, and `packageScope`.
- Consider a read-only `--allow-ambiguous-read` escape hatch if monorepo users prove they need exploratory reads across multiple candidates.
- Extract `packages/design-profiles` only after GA if profile data needs an independent release cadence or grows beyond wrapper ownership.
- Add richer multi-profile comparison reports after the single-profile `check-brand` contract is stable.

## Out Of Scope

- Rewriting the visual component library.
- Fixing all current token-validation and matrix freshness failures.
- Publishing a public package.
- Building an interactive design editor.
- Replacing Figma or Apps SDK source contracts.
- Migrating every consumer project in the first implementation pass.

## Next Stage Handoff

Recommended next stage: `he-work`.

The JSC-208 vertical slice is implemented and locally validated. The next stage should stay in `he-work` for pre-GA hardening, not first-package creation.

Recommended next implementation tasks:

1. Expand migration tests with repeated rollback/remigration, concurrent-writer collision paths, and fault injection around the `partial` marker.
2. Prove wrapper/engine boundary checks with deep-import and parser/rule-duplication guards.
3. Expand rollback metadata authenticity, path-root, checksum-compatibility, and support-window coverage before GA.
