# Simplify Subagent Review

Execution mode: delegated-parallel subagent, read-only source review.
Diff source: unstaged working tree plus untracked source files.
Scope: changed source/package/docs contract files; generated `dist` and map files were ignored except as build-output context.

## Reuse

- [P2] `packages/cli/src/commands/design.ts:129` reimplements repo-root discovery with `findGitRoot`, while the CLI already has `findRepoRoot` in `packages/cli/src/utils/config.ts:54`. The new helper uses a separate root definition (`.git`) from the rest of the CLI (`pnpm-workspace.yaml`), and `resolveDesignContract` also resolves `argv.cwd` directly at `packages/cli/src/commands/design.ts:153` instead of using the existing cwd/config helpers. Consolidate on `resolveCwd` plus `findRepoRoot` so design commands inherit the same workspace-root and config semantics as existing commands.

- [P2] `packages/cli/src/commands/design.ts:156`, `packages/cli/src/commands/design.ts:317`, and `packages/cli/src/commands/design.ts:448` still resolve file/root behavior against ambient `process.cwd()` or raw `path.resolve(argv.file)` even though the CLI exposes `--cwd`/`ASTUDIO_CWD` in `packages/cli/README.md:102`. Reusing the existing cwd helper would avoid duplicated path handling and prevent `astudio --cwd <repo> design lint --file DESIGN.md` from resolving `DESIGN.md` relative to the caller shell instead of the requested cwd.

- [P3] `packages/cli/src/commands/design.ts:94` adds a design-specific envelope emitter even though `packages/cli/src/utils/output.ts:109` already owns envelope creation and masking. The extra `toJsonValue` round trip at `packages/cli/src/commands/design.ts:55` works, but it spreads output-shape policy into the command module. A small shared helper such as `emitEnvelopeData(argv, summary, status, data)` would reduce duplication and keep masking/schema behavior in one place.

## Quality

- [P1] `packages/cli/src/commands/design.ts:270`, `packages/cli/src/commands/design.ts:275`, and each command handler using `raw: any` violate the repo codestyle prohibition on explicit `any` in `CODESTYLE.md`. This is localized and easy to fix with `Argv` and `ArgumentsCamelCase` from `yargs`, plus command-specific option interfaces. It also removes the need for repeated `raw as DesignArgs` casts.

- [P1] `packages/cli/src/commands/design.ts:471` calls `resolveDesignContract` before the doctor command can build a readiness report. Because `resolveDesignContract` throws when no `DESIGN.md` exists at `packages/cli/src/commands/design.ts:185`, `astudio design doctor` cannot satisfy the plan contract that doctor reports nullable design-contract fields in legacy mode without `DESIGN.md` (`docs/plans/2026-04-23-agent-design-engine-plan.md:317` and `docs/plans/2026-04-23-agent-design-engine-plan.md:460`). Move discovery into a guarded branch or add a non-throwing discovery helper for doctor.

- [P1] `packages/design-system-guidance/src/core.ts:931` computes `rollbackMetadataPath` as an absolute path, then stores that same absolute value into the persisted `designContract.rollbackMetadata` at `packages/design-system-guidance/src/core.ts:944`, `packages/design-system-guidance/src/core.ts:951`, and `packages/design-system-guidance/src/core.ts:959`. This makes `.design-system-guidance.json` machine-local after migration. Store a repo-relative metadata pointer in config and return the resolved absolute path separately in `rollbackMetadataPath`.

- [P2] `packages/design-system-guidance/src/cli.ts:145` wires a new public `migrate` command, but the top-level catch at `packages/design-system-guidance/src/cli.ts:169` collapses all thrown `GuidanceError`s to exit code `1`. That means direct `design-system-guidance migrate --to design-md` will not preserve the same `E_DESIGN_WRITE_REQUIRED` exit `3` behavior that the astudio wrapper tests expect. Reuse a small `normalizeGuidanceError` path and exit with `error.exitCode` when available.

- [P2] `packages/cli/src/commands/design.ts:447` migrates guidance state without validating that `DESIGN.md` exists and parses before moving to `design-md`, even though the plan says `migrate --to design-md` "requires or creates a valid DESIGN.md before changing mode" at `docs/plans/2026-04-23-agent-design-engine-plan.md:314`. Gate the migration path through `resolveDesignContract` + `parseDesignContract` when the target mode is `design-md`.

- [P3] `packages/agent-design-engine/src/parser.ts:73` extracts components by matching every capitalized prose word across the body. On the current `DESIGN.md`, headings and normal prose words like "Product", "Surface", "Roles", and "Loading" can become components, making diff/export metadata noisy. Restrict component extraction to code spans, explicit component lists, or known component identifiers from the lifecycle/coverage sources.

## Efficiency

- [P2] `packages/agent-design-engine/src/diff.ts:35` and `packages/agent-design-engine/src/diff.ts:39` parse both sides of a diff independently, and each parse calls `buildRuleProvenance` at `packages/agent-design-engine/src/parser.ts:151`. `buildRuleProvenance` reloads the manifest and hashes every rule source at `packages/agent-design-engine/src/manifest.ts:72`. Diffing two contracts with the same `rootDir` therefore repeats the same file reads and SHA-256 work. Let `diffDesignContracts` build provenance once and pass it into both parses, or add an operation-scoped provenance cache keyed by root dir and manifest path.

- [P3] `packages/design-system-guidance/src/core.ts:691` already reads scannable files concurrently, which is good. The new migration code is not hot-path heavy; no additional efficiency blockers found there beyond the absolute-path rewrite churn noted under quality.

## Skipped

- Generated `packages/cli/dist/**` and `packages/agent-design-engine/dist/**` outputs were not reviewed as first-class source. They should be regenerated after source fixes and checked only for source/dist parity.

- Docs and plan wording were skimmed only where they define command contracts. This pass did not perform a full docs-quality review.

- No source edits were made by this subagent. Findings are behavior-preserving cleanup candidates for the parent implementation pass.

## Validation Suggestions

- `pnpm agent-design:type-check`
- `pnpm agent-design:test`
- `pnpm -C packages/cli test`
- `pnpm design-system-guidance:type-check`
- `pnpm design-system-guidance:build`
- Add targeted regression tests for `astudio --cwd <repo> design lint --file DESIGN.md --json`, `astudio design doctor --json` in a temp repo without `DESIGN.md`, direct `design-system-guidance migrate --to design-md` exit code handling, and persisted relative `designContract.rollbackMetadata`.

WROTE: artifacts/reviews/simplify-subagent-review.md
