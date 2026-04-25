## Simplification Review: JSC-217 Agent Design Boundary Guard

### Findings (severity-ranked)

1. **Medium - Boundary import ban is broader than the stated JSC-217 ownership scope**
   **Evidence:** `scripts/check-agent-design-boundaries.mjs:17`, `scripts/check-agent-design-boundaries.mjs:96`, `scripts/check-agent-design-boundaries.mjs:102`
   **Why this is unnecessary complexity:** The rule currently blocks markdown/YAML parser libraries for every file under `packages/design-system-guidance/src/**`, regardless of whether the code is related to `DESIGN.md` ownership. That is stricter than the issue intent and creates future false-positive maintenance surface for unrelated guidance features.
   **Remediation:** Narrow the guard to explicit `DESIGN.md` ownership signals only (deep engine-src imports plus semantic-owner symbol checks), or scope the parser-import block to files/modules that actually implement `DESIGN.md` contract paths.

2. **Low - Self-test requires an exact issue count, making the test brittle**
   **Evidence:** `scripts/check-agent-design-boundaries.mjs:200`
   **Why this is unnecessary complexity:** `issues.length !== 3` couples the self-test to current internal rule count/order. Any legitimate future rule addition can fail self-test even when required protections still work, increasing maintenance overhead with little protection gain.
   **Remediation:** Assert only required invariants (presence of deep-import, parser-import, semantic-owner hits) and drop the exact-count constraint.

### Scope check
The change is generally aligned with JSC-217 and remains focused; the two items above are targeted simplifications to keep the boundary guard strict without widening beyond current requirements.

WROTE: artifacts/reviews/jsc217-simplify.md
