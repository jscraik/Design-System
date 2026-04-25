# JSC-208 Correctness Review

## Scope

- Reviewed the active `jscraik/jsc-208-agent-design-engine` diff for correctness risks in the `DESIGN.md` engine, `astudio design` command surface, and guidance migration path.
- The dedicated correctness subagent failed to produce a usable artifact, so this report records the inline coordinator pass.

## Findings

### 1. Medium: Profile support could drift between guidance and engine

- Evidence:
  - `packages/agent-design-engine/src/parser.ts:7` maintains its own supported-profile set.
  - `packages/design-system-guidance/src/profiles.ts:3` publishes supported profile definitions for the compatibility manifest.
  - `packages/design-system-guidance/src/compatibility.ts:22` exposes those guidance profiles to agent consumers.
- Risk:
  - A profile can be published as supported by the wrapper while the engine rejects it, or the reverse, without the old tests failing.
- Remediation:
  - Added a CLI integration parity test in `packages/cli/tests/cli.test.mjs` that reads `supportedDesignProfileIds()` and proves each profile is represented in the compatibility manifest and accepted by `parseDesignContract`.

### 2. Medium: Generated runtime/test artifacts were still in the active branch diff

- Evidence:
  - `packages/widgets/node_modules/.vite/deps/_metadata.json:1`
  - `packages/widgets/node_modules/.vite/deps/react-dom_client.js:1`
  - `packages/widgets/test-results/.last-run.json:1`
  - `platforms/web/apps/web/test-results/.last-run.json:1`
  - `.gitignore:70` and `.gitignore:81` already ignore nested `test-results`, and `.gitignore:84` ignores nested `node_modules/.vite`.
- Risk:
  - These files are volatile validation outputs and can make the branch look behaviorally larger than it is.
- Remediation:
  - Removed the tracked generated files from the branch so the diff stays focused on source, docs, fixtures, and intentional package outputs.

## Deferred Risks

- Real interrupted-write migration fault injection is still next-slice material. Existing tests cover simulated partial state and concurrent writer locks, but not an injected failure between the partial and final atomic writes.
- CLI test-file decomposition is a maintainability cleanup for JSC-223, not a correctness blocker for this branch.

WROTE: artifacts/reviews/jsc208-he-work-correctness.md
