reviewer: simplify
branch: jscraik/jsc-208-agent-design-engine
mode: read-only
summary:
  core_purpose: "Add a DESIGN.md contract pipeline (parse/lint/diff/export + CLI wiring + guidance migration) with agent-safe JSON envelopes."
  assessed_complexity: medium

files_reviewed:
  - packages/cli/src/commands/design.ts
  - packages/cli/src/index.ts
  - packages/cli/src/commands/index.ts
  - packages/cli/tests/cli.test.mjs
  - packages/design-system-guidance/src/cli.ts
  - packages/design-system-guidance/src/core.ts
  - packages/design-system-guidance/src/index.ts
  - packages/design-system-guidance/src/types.ts
  - packages/agent-design-engine/src/parser.ts
  - packages/agent-design-engine/src/lint.ts
  - packages/agent-design-engine/src/diff.ts
  - packages/agent-design-engine/src/exporters.ts
  - packages/agent-design-engine/src/manifest.ts
  - packages/agent-design-engine/src/types.ts
  - package.json
  - packages/cli/README.md
  - packages/design-system-guidance/README.md
  - DESIGN.md
  - docs/guides/AGENT_DESIGN_WORKFLOW.md
  - FORJAMIE.md

findings:
  - id: SIMP-001
    severity: medium
    file: packages/cli/src/commands/design.ts
    lines: "18-26,48-50,74-89"
    title: "Double-serialization and schema allowlist add defensive complexity with little practical payoff"
    why_unnecessary: "`emitDesign` converts payloads via JSON stringify/parse and then validates `kind` against `SUPPORTED_COMMAND_SCHEMAS`, but every command already constructs known internal payloads. This adds cognitive load and failure paths without guarding an external boundary."
    simplification: "Remove `toJsonValue` and `SUPPORTED_COMMAND_SCHEMAS` gate; emit the known command payload directly through `createEnvelope` (or validate once at command construction if needed)."
    estimated_loc_reduction: 18

  - id: SIMP-002
    severity: medium
    file: packages/agent-design-engine/src/lint.ts
    lines: "7-9,15-39,55-57"
    title: "Rule loop recomputes full contract body text for every predicate"
    why_unnecessary: "`predicatePasses` calls `bodyText(contract)` on every rule evaluation. The body normalization is invariant per lint run and can be computed once."
    simplification: "Compute normalized body text once in `lintDesignContract` and pass it into predicate evaluation. Keep predicate functions pure and tiny."
    estimated_loc_reduction: 6

  - id: SIMP-003
    severity: medium
    file: packages/design-system-guidance/src/cli.ts
    lines: "24-96,145-155"
    title: "Single generic flag parser over-serves all commands and permits ambiguous mode combinations"
    why_unnecessary: "`parseArgs` tracks migrate-only flags for all commands; `migrate` currently accepts potentially conflicting toggles (`--to`, `--rollback`, `--resume`) without an explicit single-mode selection."
    simplification: "Split argument parsing per subcommand or map migrate into one explicit mode enum (`to`, `rollback`, `resume`) with one validator. This reduces flag-state branching and makes behavior obvious."
    estimated_loc_reduction: 20

  - id: SIMP-004
    severity: low
    file: packages/design-system-guidance/src/core.ts
    lines: "245-255"
    title: "Config parser now re-emits unknown keys via spread"
    why_unnecessary: "`parseConfig` returns `{ ...parsed, ...normalizedFields }`, which broadens accepted surface area and keeps arbitrary keys alive. If the goal is predictable migration state, this is extra flexibility you do not currently consume."
    simplification: "Return only declared fields plus specifically whitelisted compatibility fields. Keep permissiveness behind a deliberate allowlist, not blanket spread."
    estimated_loc_reduction: 8

  - id: SIMP-005
    severity: low
    file: packages/cli/src/commands/design.ts
    lines: "291-314"
    title: "Doctor payload carries many fixed null fields"
    why_unnecessary: "The doctor response always emits `contract/resolvedProfile/profileSource/profileVersion` as `null` in this slice. Keeping placeholder keys now increases output and maintenance for no behavior."
    simplification: "Emit only active checks + next actions until those fields are populated by real resolution logic. Add them later when implemented."
    estimated_loc_reduction: 8

skipped_items:
  - path: docs/plans/2026-04-23-agent-design-engine-plan.md
    reason: "Intentionally skipped for removal/simplification recommendations per instruction not to flag docs/plans artifacts for removal."
  - path: packages/cli/dist/**
    reason: "Generated build artifacts; simplification should target source files first."
  - path: packages/agent-design-engine/src/*.js
    reason: "Generated JS artifacts mirrored from TS source in same package."

validation_suggestions:
  - "pnpm -C packages/agent-design-engine test"
  - "pnpm -C packages/design-system-guidance type-check"
  - "pnpm -C packages/design-system-guidance build"
  - "pnpm -C packages/cli test"

estimated_total_loc_reduction: 60

WROTE: artifacts/reviews/simplify.md
