# JSC-208 Implementation Gap Audit (Unchecked Phase 1-4 Items)

## Scope and method
- Audited unchecked checklist items in [docs/plans/2026-04-23-agent-design-engine-plan.md](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:705) through line 783 (Phases 2-4).
- Evidence source was live repo code/tests only in `packages/agent-design-engine`, `packages/design-system-guidance`, `packages/cli`, plus plan references.
- No files were modified except this report artifact.

## Implemented but still unchecked
1. Phase 3: block force-init overwrite of migrated/v2 guidance config appears implemented.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:740](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:740)
- Evidence: explicit refusal in [packages/design-system-guidance/src/core.ts:763](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:763), [packages/design-system-guidance/src/core.ts:765](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:765), [packages/design-system-guidance/src/core.ts:767](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:767).
- Assessment: `IMPLEMENTED` (test coverage for this exact branch is not visible in package-local tests).

2. Phase 3: crash-safe `partial` marker before final migration write is implemented.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:748](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:748)
- Evidence: writes rollback metadata, then writes `migrationState: "partial"`, then final config in [packages/design-system-guidance/src/core.ts:1032](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:1032), [packages/design-system-guidance/src/core.ts:1059](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:1059), [packages/design-system-guidance/src/core.ts:1062](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:1062), [packages/design-system-guidance/src/core.ts:1063](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:1063).
- Assessment: `PARTIALLY IMPLEMENTED` (state transitions are guarded but no explicit transition-table artifact/tests found).

3. Phase 4: substantial exit-code coverage exists in CLI tests.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:776](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:776)
- Evidence: exit assertions across policy/usage/failure paths in [packages/cli/tests/cli.test.mjs:100](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/cli.test.mjs:100), [packages/cli/tests/cli.test.mjs:169](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/cli.test.mjs:169), [packages/cli/tests/cli.test.mjs:267](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/cli.test.mjs:267), [packages/cli/tests/cli.test.mjs:295](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/cli.test.mjs:295), [packages/cli/tests/cli.test.mjs:355](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/cli.test.mjs:355), [packages/cli/tests/cli.test.mjs:473](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/cli.test.mjs:473).
- Assessment: `PARTIALLY IMPLEMENTED` (coverage is broad but not an explicit per-command matrix fixture).

## Missing or partial gaps by unchecked item
1. Phase 2 fixtures derived from four rule sources are not present as explicit source-derived fixture set.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:716](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:716)
- Evidence: only two semantic fixtures exist in [packages/agent-design-engine/tests/fixtures/valid-design.md:1](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/agent-design-engine/tests/fixtures/valid-design.md:1) and [packages/agent-design-engine/tests/fixtures/invalid-design.md:1](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/agent-design-engine/tests/fixtures/invalid-design.md:1); tests do not enumerate source-derived fixture catalog in [packages/agent-design-engine/tests/engine.test.mjs:16](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/agent-design-engine/tests/engine.test.mjs:16).
- Assessment: `MISSING/PARTIAL`.

2. Strict v1/v2 decoding + downgrade/unsupported-mode refusal tests are incomplete.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:743](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:743)
- Evidence: strict parsing exists in [packages/design-system-guidance/src/core.ts:182](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:182), [packages/design-system-guidance/src/core.ts:227](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:227), [packages/design-system-guidance/src/core.ts:249](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:249); schema-version refusal test exists in [packages/cli/tests/cli.test.mjs:437](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/cli.test.mjs:437), but no visible unsupported `designContract.mode` refusal test.
- Assessment: `PARTIAL`.

3. Wrapper-boundary checks preventing parser/rule duplication are not implemented.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:745](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:745)
- Evidence: no boundary enforcement test/rule surfaced in guidance package scripts ([packages/design-system-guidance/package.json:1](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/package.json:1)); only integration imports from CLI into engine in [packages/cli/src/commands/design.ts:13](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/commands/design.ts:13) and no policy test artifacts.
- Assessment: `MISSING`.

4. Rollback metadata checks are present but authenticity/compatibility algorithm is incomplete.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:749](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:749)
- Evidence present: schema/path/checksum validation in [packages/design-system-guidance/src/core.ts:851](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:851), [packages/design-system-guidance/src/core.ts:869](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:869), [packages/design-system-guidance/src/core.ts:883](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:883).
- Missing evidence: no compatibility-window/authenticity verification using `writtenByWrapperVersion` before mutation (field written at [packages/design-system-guidance/src/core.ts:1037](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:1037) but not validated in rollback path).
- Assessment: `PARTIAL`.

5. Rollback quarantine behavior for migrated `DESIGN.md` is not implemented.
- Plan items: [docs/plans/2026-04-23-agent-design-engine-plan.md:750](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:750), [docs/plans/2026-04-23-agent-design-engine-plan.md:751](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:751)
- Evidence: migration code writes rollback metadata for config only and no `DESIGN.md` quarantine path/collision handling in [packages/design-system-guidance/src/core.ts:980](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:980), [packages/design-system-guidance/src/core.ts:1032](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:1032).
- Assessment: `MISSING`.

6. Command JSON schema fixtures are not present.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:774](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:774)
- Evidence: no command schema JSON files/fixtures under CLI tests except help text snapshots at [packages/cli/tests/fixtures/help.txt:1](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/fixtures/help.txt:1).
- Assessment: `MISSING`.

7. Design-command external-exit normalization path is not implemented as a dedicated guard.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:777](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:777)
- Evidence: design commands currently do not wrap external child-process calls; normalization helper exists for generic commands in [packages/cli/src/utils/exec.ts:156](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/utils/exec.ts:156), but no design-specific mapping fixture/assertion.
- Assessment: `MISSING/PREVENTIVE GAP`.

8. Compatibility-manifest command gating scoped to `astudio design *` is not evidenced.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:779](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:779)
- Evidence: `SUPPORTED_COMMAND_SCHEMAS` is a static local allowlist in [packages/cli/src/commands/design.ts:29](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/commands/design.ts:29), [packages/cli/src/commands/design.ts:146](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/commands/design.ts:146); no manifest load/validation path in design command startup.
- Assessment: `MISSING`.

9. Recovery payload fixtures and structured `recovery.nextCommand` contract are not implemented.
- Plan items: [docs/plans/2026-04-23-agent-design-engine-plan.md:781](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:781), [docs/plans/2026-04-23-agent-design-engine-plan.md:782](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:782)
- Evidence: `JsonError` has `hint`, `did_you_mean`, `fix_suggestion` only in [packages/cli/src/types.ts:57](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/types.ts:57); no structured recovery object fields.
- Assessment: `MISSING`.

10. Agent/CI output-mode tests are incomplete.
- Plan item: [docs/plans/2026-04-23-agent-design-engine-plan.md:783](/Users/jamiecraik/dev/design-system-agent-engine-worktree/docs/plans/2026-04-23-agent-design-engine-plan.md:783)
- Evidence present: output-mode policy logic in [packages/cli/src/commands/design.ts:98](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/commands/design.ts:98), [packages/cli/src/commands/design.ts:102](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/commands/design.ts:102), and one inverse test (`CI=false` plain mode) in [packages/cli/tests/cli.test.mjs:241](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/tests/cli.test.mjs:241).
- Missing evidence: no explicit tests that omitted mode defaults to JSON in CI/agent and that explicit incompatible mode fails with `E_POLICY`.
- Assessment: `PARTIAL`.

## High-risk blockers to plan completion
1. Missing rollback quarantine + collision/race guarantees
- Risk: rollback/remigration can overwrite or lose migration artifacts for `DESIGN.md`, violating plan’s safety contract.
- Evidence: no quarantine implementation for `DESIGN.md` in [packages/design-system-guidance/src/core.ts:980](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/design-system-guidance/src/core.ts:980).

2. Missing compatibility-manifest gating path for design commands
- Risk: wrapper/engine/schema drift is not fail-closed via compatibility manifest as the plan requires.
- Evidence: no manifest load/check in design command flow around [packages/cli/src/commands/design.ts:507](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/commands/design.ts:507).

3. Missing structured recovery protocol (`recovery.nextCommand` object)
- Risk: machine retries remain string-hint based and non-deterministic for agent workflows.
- Evidence: no recovery object in error schema at [packages/cli/src/types.ts:57](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/cli/src/types.ts:57).

## Summary verdict
- Phase 1 unchecked items: none.
- Phase 2-4 unchecked items audited: 14.
- Status: `2 implemented`, `5 partial`, `7 missing`.
- Plan completion is still blocked primarily by rollback quarantine/race safety, compatibility-manifest gating, and recovery payload contract work.

WROTE: artifacts/reviews/jsc208-implementation-gap-audit.md
