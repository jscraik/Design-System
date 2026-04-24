# JSC-223 Dead Code Audit (packages + scripts)

## Scope
- Read-only audit across `packages/**` and `scripts/**`.
- Goal: identify obvious dead code, stale package surfaces, duplicated helpers, and high-risk cleanup candidates.

## Findings (severity-ranked)

### 1) CRITICAL: Tracked zero-byte root artifacts appear accidental and should be removed
- Evidence: `EOF` (empty tracked file), `npm` (empty tracked file), `{` (empty tracked file).
- Evidence command: `git ls-files -- EOF npm "{"` returns all three as tracked.
- Risk: accidental artifacts in repo root can leak into release/test workflows, confuse tooling, and hide real intended files.
- Suggested remediation: remove these files and add a guard (pre-commit or CI check) to block accidental root artifact names.

### 2) HIGH: `scripts/harness_pr_pipeline.py` has no runtime call-sites in scripts/workflows/package scripts
- Evidence: [scripts/harness_pr_pipeline.py](/Users/jamiecraik/dev/design-system-agent-engine-worktree/scripts/harness_pr_pipeline.py:1)
- Evidence: no matches for `harness_pr_pipeline.py` in `.github/**`, `scripts/**`, `package.json`, or `Makefile`.
- Risk: stale automation surface that can silently drift and mislead maintainers about active CI policy paths.
- Suggested remediation: either wire it into a real workflow/command contract or archive/delete it.

### 3) MEDIUM: `scripts/add-autodocs-tags.mjs` appears orphaned (self-reference only)
- Evidence: [scripts/add-autodocs-tags.mjs](/Users/jamiecraik/dev/design-system-agent-engine-worktree/scripts/add-autodocs-tags.mjs:1)
- Evidence: no call-sites beyond self-doc comment (`rg` shows only this file).
- Risk: maintenance burden and false discoverability for a script that is not actually part of operational flow.
- Suggested remediation: either document+wire into a command (`package.json`/workflow) or remove.

### 4) MEDIUM: `scripts/theme-propagation.test.mjs` looks unexecuted by current test entrypoints
- Evidence: [scripts/theme-propagation.test.mjs](/Users/jamiecraik/dev/design-system-agent-engine-worktree/scripts/theme-propagation.test.mjs:1)
- Evidence: [package.json](/Users/jamiecraik/dev/design-system-agent-engine-worktree/package.json:60) through [package.json](/Users/jamiecraik/dev/design-system-agent-engine-worktree/package.json:116) defines test scripts, but none execute `theme-propagation.test.mjs`.
- Evidence: CI workflow runs `pnpm test:drift` and other checks, but no job references this test file ([.github/workflows/ci.yml](/Users/jamiecraik/dev/design-system-agent-engine-worktree/.github/workflows/ci.yml:79)).
- Risk: dead test gives false confidence and can rot while appearing to exist as safety coverage.
- Suggested remediation: either include it in an existing test script/CI lane or delete/move it to archived experiments.

### 5) LOW: Duplicate docs lint command surface (`doc:lint` and `docs:lint`) creates drift risk
- Evidence: [package.json](/Users/jamiecraik/dev/design-system-agent-engine-worktree/package.json:94) (`doc:lint`) and [package.json](/Users/jamiecraik/dev/design-system-agent-engine-worktree/package.json:109) (`docs:lint`) run the same command.
- Risk: split command surface invites inconsistent use and future divergence.
- Suggested remediation: keep one canonical command and alias intentionally (or remove one entry).

### 6) LOW: `packages/validation-prototype` appears largely isolated from active workspace flows
- Evidence: [packages/validation-prototype/package.json](/Users/jamiecraik/dev/design-system-agent-engine-worktree/packages/validation-prototype/package.json:2)
- Evidence: references are mostly docs/prototype context, not active root scripts/workflows.
- Risk: prototype package may remain stale while increasing workspace cognitive load.
- Suggested remediation: decide lifecycle explicitly: archive, move under `docs/validation/prototype`, or wire into repeatable benchmark command.

## Notes on confidence
- High confidence for findings 1-5 (direct structural evidence and missing call-sites).
- Finding 6 is lifecycle-oriented (possible intentional retention) and should be treated as a cleanup decision, not immediate deletion.

WROTE: artifacts/reviews/jsc223-deadcode-audit.md
