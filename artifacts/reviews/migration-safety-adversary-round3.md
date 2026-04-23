# Migration Safety Adversary Review (Round 3)

## Findings

### 1. [high] Recovery commands can be bricked by design-manifest corruption
- Evidence: `docs/plans/2026-04-23-agent-design-engine-plan.md:624-628` requires all `astudio design *` commands to validate the compatibility manifest before any handler runs and fail closed on manifest errors; `docs/plans/2026-04-23-agent-design-engine-plan.md:295-299` includes `migrate --rollback`, `migrate --resume`, and `doctor` in `astudio design *`.
- Break path: If a migration leaves `partial`/`failed` state and the design manifest is missing/corrupt, the pre-handler gate blocks rollback/resume/doctor themselves, removing the only intended recovery surface and potentially trapping repos in an unrecoverable transition state.
- Remediation: Add a narrowly-scoped recovery bypass: permit `migrate --rollback` and `doctor` to run with a minimal built-in schema path when manifest loading fails, while keeping write-heavy non-recovery design commands gated.

### 2. [high] Rollback compatibility trusts mutable metadata without authenticity guarantees
- Evidence: `docs/plans/2026-04-23-agent-design-engine-plan.md:577-580` defines required rollback metadata fields and compatibility checks (`writtenByWrapperVersion`, `legacySupportEndsAt`, checksums) but does not require signature/HMAC/immutable attestation for metadata integrity.
- Break path: A tampered rollback metadata file can alter support-window fields and path/checksum tuples in ways the current algorithm may accept, leading to unauthorized or incorrect rollback mutations and state corruption.
- Remediation: Treat rollback metadata as untrusted input: add authenticity (signed metadata or manifest-attested digest), canonical path allowlists, and strict path-root checks before any mutation.

### 3. [medium] Legacy support enforcement can prematurely refuse valid rollback due to stale embedded expiry
- Evidence: `docs/plans/2026-04-23-agent-design-engine-plan.md:579` requires checking embedded `legacySupportEndsAt` during rollback; `docs/plans/2026-04-23-agent-design-engine-plan.md:633-637` defines support as the later of two dynamic conditions (time and release-count).
- Break path: Metadata written earlier can carry an older `legacySupportEndsAt` that no longer reflects the current published “later-of” policy, causing false `unsupported` refusals while rollback should still be permitted by current release policy.
- Remediation: Compute support eligibility from current release metadata/manifest at runtime and use stored `legacySupportEndsAt` only as advisory provenance (or require monotonic recomputation and compare against current policy value).

## Residual Risks
- `docs/plans/2026-04-23-agent-design-engine-plan.md:586-589` declares collision-safe quarantine and idempotency but does not yet define concurrent-writer locking semantics; implementation should include atomic create semantics (`O_EXCL`/equivalent) and race tests.

WROTE: artifacts/reviews/migration-safety-adversary-round3.md
