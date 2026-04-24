# JSC-208 Testing Strategy Review

## Findings (severity-ranked)

1. **High — Profile compatibility can drift across packages without a parity test.**
- Evidence:
  - `packages/agent-design-engine/src/parser.ts:7` hard-codes supported profiles in `SUPPORTED_PROFILES`.
  - `packages/design-system-guidance/src/profiles.ts:3` defines a separate `SUPPORTED_DESIGN_PROFILES` source.
  - `packages/design-system-guidance/src/compatibility.ts:22` publishes `supportedProfiles` from guidance, not from the engine parser.
  - Existing tests validate parser behavior but not cross-package parity (`packages/agent-design-engine/tests/engine.test.mjs:58-76`).
- Why this matters:
  - A future profile update can be accepted in one surface and rejected in another, while both local test suites still pass.
- Remediation:
  - Add a parity test that imports both profile sources and asserts identical profile IDs/versions.
  - Add one integration test that verifies a profile accepted by parser is also represented in the compatibility manifest.

2. **Medium — Migration/recovery tests do not exercise a real interrupted-write path.**
- Evidence:
  - Migration writes a `partial` state before finalizing (`packages/design-system-guidance/src/core.ts:1176-1185`).
  - Current resume test simulates partial state by editing JSON directly (`packages/cli/tests/cli.test.mjs:857-859`) instead of forcing a write interruption between the two atomic writes.
- Why this matters:
  - The most failure-prone path (I/O interruption during migration finalize) is not validated end-to-end, so regressions in resume semantics could slip through.
- Remediation:
  - Add a fault-injection test for `migrateGuidanceConfig` that fails the second `writeAtomic` call and then verifies `--resume` recovers deterministically with preserved rollback metadata.

3. **Medium — Policy subcontract command migration is unprotected by tests.**
- Evidence:
  - Command runners were changed to `node --import tsx ...` (`scripts/policy/run.mjs:111`, `scripts/policy/run.mjs:119`).
  - Existing script tests shown in this branch focus on build-pipeline behavior, not policy subcontract execution (`scripts/build-pipeline.test.js:360-381`).
- Why this matters:
  - A runtime/Node-flag mismatch can silently break policy gates in CI without being caught by the current test suite.
- Remediation:
  - Add a focused test around `DESIGN_SYSTEM_SUBCONTRACTS` execution that stubs subprocesses and verifies command arrays + failure propagation.

4. **Medium — Generated-artifact hygiene is not strongly enforced for this change surface.**
- Evidence:
  - Policy scan defaults ignore both `node_modules` and `test-results` (`scripts/policy/lib/scan.mjs:4-16`).
  - Current diff includes volatile generated files under those paths (`packages/widgets/node_modules/.vite/deps/_metadata.json:2-6`, `packages/widgets/test-results/.last-run.json:1-4`, `platforms/web/apps/web/test-results/.last-run.json:1-4`).
- Why this matters:
  - Volatile cache/test artifacts can churn in PRs without any test failure, reducing signal quality and reproducibility.
- Remediation:
  - Add a hygiene check in CI that blocks tracked changes under cache/test-output directories (or explicitly whitelists only intentional artifacts).

## Overall verdict
The strategy is **strong for CLI JSON envelope and migrate happy/expected error paths**, but it does **not yet fully protect cross-package profile compatibility drift, interrupted migration recovery realism, or policy/artifact hygiene regressions**.

WROTE: artifacts/reviews/jsc208-he-work-testing.md
