# JSC-208 Simplify/Dead-Code Review (Read-only)

## Scope
- Reviewed current working diff on `jscraik/jsc-208-agent-design-engine` (including uncommitted changes).
- Focus: unnecessary abstraction, duplicated logic, generated artifact churn, and cleanup work better parked in JSC-223.

## Severity-ranked findings

### 1) High: Generated runtime/test artifacts are tracked and currently dirty
- Evidence:
  - `packages/widgets/node_modules/.vite/deps/_metadata.json:2-5` contains Vite cache hashes (`hash`, `configHash`, `lockfileHash`, `browserHash`).
  - `packages/widgets/node_modules/.vite/deps/react-dom_client.js:1-8` is generated prebundle glue from Vite.
  - `packages/widgets/test-results/.last-run.json:1-4` and `platforms/web/apps/web/test-results/.last-run.json:1-4` are ephemeral test run state.
  - `.gitignore:70-75` and `.gitignore:81-84` already mark `**/test-results/` and `**/node_modules/.vite/` as ignore paths.
- Why this is unnecessary:
  - These files are machine-local and non-deterministic; tracking them creates noisy diffs and merge churn with zero product value.
- Remediation:
  - Remove these paths from Git index (`git rm --cached ...`) and keep them ignored.
  - Keep branch diff source-focused (CLI/guidance/engine code + docs).

### 2) Medium: `packages/cli/tests/cli.test.mjs` is a single 993-line integration omnibus with repeated setup blocks
- Evidence:
  - `packages/cli/tests/cli.test.mjs:1-993` total file size.
  - Repeated temp project setup calls at `:469`, `:542`, `:563`, `:593`, `:611`, `:645`, `:675`, `:693`, `:722`, `:752`, `:798`, `:820`, `:844`, `:873`, `:895`, `:928`, `:946`, `:971`.
  - Repeated migration invocation/assertion blocks across `:529-590`, `:644-719`, `:721-749`, `:797-993`.
- Why this is unnecessary:
  - The same setup/assert scaffolding is copied many times, raising maintenance cost and making failures harder to isolate.
- Remediation:
  - Split into focused files (e.g. `design-json-contract.test.mjs`, `design-migrate.test.mjs`, `design-discovery.test.mjs`).
  - Centralize repeated temp-project builders and migration assertion helpers in `tests/test-utils.mjs`.

### 3) Medium: `design migrate` performs migration state validation twice
- Evidence:
  - `packages/cli/src/commands/design.ts:725-733` calls `migrateGuidanceConfig` with `dryRun: true`.
  - `packages/cli/src/commands/design.ts:735-743` calls `migrateGuidanceConfig` again with user-supplied write/dry-run flags.
- Why this is unnecessary:
  - This duplicates parse/state validation and error plumbing in a hot path, and expands behavior surface without a clear additional guarantee.
- Remediation:
  - Fold into one call path: run design contract validation first, then execute a single `migrateGuidanceConfig` call with actual user flags.

### 4) Medium: `--yes` is threaded through guidance migration but has no effect in core logic
- Evidence:
  - `packages/design-system-guidance/src/types.ts:94-102` defines `MigrationOptions.yes`.
  - `packages/design-system-guidance/src/cli.ts:64-66`, `:96`, `:101`, `:155` parse, document, and pass `--yes`.
  - `packages/cli/src/commands/design.ts:732` and `:742` forward `yes` into migration calls.
  - `packages/design-system-guidance/src/core.ts:1064-1199` migration implementation never reads `options.yes`.
- Why this is unnecessary:
  - It is dead behavioral surface: more API/CLI/docs/tests to maintain without runtime effect.
- Remediation:
  - Either implement a real confirmation-bypass behavior, or remove `yes` from migration option contracts until needed.

### 5) Low: Guidance core includes a custom glob engine that is larger than current requirements justify
- Evidence:
  - `packages/design-system-guidance/src/core.ts:364-428` implements glob parsing and regex generation.
  - `packages/design-system-guidance/src/core.ts:430-480` adds custom specificity ranking + precedence tie-breaks.
- Why this is unnecessary:
  - Bespoke glob semantics are a long-term liability (edge cases, escaping, brace handling, future drift) for a relatively small scope matcher.
- Remediation:
  - Prefer a minimal, well-tested matcher dependency or intentionally narrow scope matching rules (documented) to cut custom parser complexity.

### 6) Low: JSON output mode detection logic is duplicated across command and envelope layers
- Evidence:
  - `packages/cli/src/commands/design.ts:98-100` (`shouldEmitJson`) decides mode using `argv` + CI.
  - `packages/cli/src/index.ts:398-407` recomputes CI/JSON rules in fail-path logic.
  - `packages/cli/src/utils/output.ts:11-17` computes output mode again from process args/env.
- Why this is unnecessary:
  - Parallel policy logic invites subtle drift (especially around CI/agent mode behavior).
- Remediation:
  - Centralize output-mode resolution in one helper and consume it from command handlers + fail-path + envelope emitter.

## Cleanup candidates to move to JSC-223 (not this branch)
- Broad cleanup of existing tracked generated outputs under `node_modules/.vite` and `**/test-results` across the monorepo.
- Test-suite structural refactor of `packages/cli/tests/cli.test.mjs` into focused files/helpers.
- Shared output-mode policy consolidation across CLI layers.

## Estimated reducible liability (if applied)
- Immediate branch cleanup: ~4 tracked generated files removed from active diff.
- Test simplification: ~120-220 LOC of duplicated setup/assertion patterns removable via helper extraction + file split.
- Command/guidance simplification: ~30-60 LOC removable from duplicated migrate/output-mode/dead-option surfaces.
WROTE: artifacts/reviews/jsc208-he-work-simplify.md
