# JSC-219 Correctness Review

## Scope
Reviewed uncommitted changes for correctness/security behavior in:
- rollback metadata authentication/integrity
- path-root checks
- checksum validation
- unsupported `DESIGN.md` schema handling

## Findings (severity ordered)

### 1) High: rollback metadata "authentication" is forgeable (unkeyed deterministic signature)
- Evidence:
  - `packages/design-system-guidance/src/core.ts:1026`
  - `packages/design-system-guidance/src/core.ts:1030`
  - `packages/design-system-guidance/src/core.ts:1221`
- Why this matters:
  - `metadataSignature` is generated as a plain SHA-256 over public values (`metadataDigest` + manifest constants).
  - Verification recomputes the same deterministic value.
  - Any actor who can edit the metadata file can recompute `metadataDigest` and `metadataSignature`, so tampered metadata can still pass verification.
- Remediation suggestion:
  - Use a keyed authenticity primitive (for example HMAC with secret key, or asymmetric signature with protected private key).
  - If a trust root is intentionally unavailable, rename this mechanism to integrity/self-consistency and avoid describing it as authentication.

### 2) Medium: malformed wrapper versions can bypass semver bound checks
- Evidence:
  - `packages/design-system-guidance/src/core.ts:922`
  - `packages/design-system-guidance/src/core.ts:933`
- Why this matters:
  - `compareSemver` parses via `Number(part)` and can produce `NaN` for malformed strings.
  - `assertSupportedWrapperVersion` only checks `< 0` and `> 0`; both comparisons are false for `NaN`, so invalid versions may pass.
- Remediation suggestion:
  - Reject malformed semver strings before numeric comparison, or use a strict semver parser and fail closed.

## Residual risks / test gaps
- No test demonstrates rejection of a forged metadata file where attacker recomputes both `metadataDigest` and `metadataSignature`.
- No test covers malformed `writtenByWrapperVersion` strings (for example `"bogus"`) in rollback metadata validation.

## Coordinator note
Both findings were addressed after review: rollback metadata now uses a local HMAC signing key in the rollback artifact directory, forged public manifest signatures are rejected by CLI coverage, and malformed wrapper versions fail closed before mutation.

WROTE: artifacts/reviews/jsc219-correctness.md
