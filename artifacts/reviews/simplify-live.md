## Simplification Analysis

### Core Purpose
The JSC-208 changes add a `design` command surface (lint/diff/export/check-brand/init/migrate/doctor), plus a new `agent-design-engine` parser/linter/exporter and guidance migration support. The code needs to remain deterministic and policy-safe while keeping the command/runtime contract minimal.

### Unnecessary Complexity Found
- `packages/design-system-guidance/src/types.ts:52`, `packages/design-system-guidance/src/cli.ts:18`, `packages/design-system-guidance/src/core.ts:821`
- `MigrationOptions.yes` is parsed and threaded through CLI calls but never read in `migrateGuidanceConfig`.
- Suggested simplification: remove `yes` from `MigrationOptions`, CLI parse path, and migrate call payload unless an explicit confirmation behavior is implemented.

- `packages/cli/src/commands/design.ts:45`
- `DesignArgs.active` is declared but never consumed by any command.
- Suggested simplification: remove `active?: boolean` from `DesignArgs`.

- `packages/agent-design-engine/src/parser.ts:125`, `packages/agent-design-engine/src/parser.ts:134`, `packages/agent-design-engine/src/types.ts:79`
- `manifestDefaultProfile` and `profileSource = "manifest-default"` are effectively unreachable because `parseFrontmatterBlock` enforces `brandProfile` as required.
- Suggested simplification: drop the fallback/profile source branch and remove `manifestDefaultProfile` from `ParseOptions` unless missing `brandProfile` is a planned near-term schema change.

- `packages/agent-design-engine/src/lint.ts:15`, `packages/agent-design-engine/src/lint.ts:16`
- `bodyText(contract)` is recomputed inside `predicatePasses` for every rule, rebuilding the same lowercased text repeatedly.
- Suggested simplification: compute normalized contract text once in `lintDesignContract` and pass it into predicate evaluation.

### Code to Remove
- `packages/design-system-guidance/src/types.ts:52` + call plumbing in `packages/design-system-guidance/src/cli.ts:154`
  Reason: dead option (`yes`) in migration path.
- `packages/cli/src/commands/design.ts:45`
  Reason: unused arg field (`active`).
- `packages/agent-design-engine/src/types.ts:79` + parser branch at `packages/agent-design-engine/src/parser.ts:125-138`
  Reason: unreachable fallback/profile source mode with current required frontmatter contract.
- Estimated LOC reduction: 20-35 lines (without behavior changes).

### Simplification Recommendations
1. Remove dead migration confirmation plumbing
   - Current: `--yes` is accepted and propagated for guidance migration with no runtime effect.
   - Proposed: remove the option from migration types/CLI path until confirmation semantics exist.
   - Impact: small LOC reduction, clearer CLI contract, less user confusion.

2. Collapse unreachable profile fallback branch
   - Current: parser supports `manifestDefaultProfile` despite required `brandProfile` frontmatter.
   - Proposed: resolve profile from `profileOverride ?? frontmatter.brandProfile` only.
   - Impact: simpler parse path and fewer impossible states.

3. Hoist lint normalization out of per-rule predicate
   - Current: repeated `bodyText(...).toLowerCase()` per rule.
   - Proposed: precompute once per lint run and pass to predicate matcher.
   - Impact: lower repeated work and easier predicate testing.

### YAGNI Violations
- `MigrationOptions.yes` in guidance migration
- Why it violates YAGNI: confirmation flag exists without behavior.
- What to do instead: remove it now; reintroduce when interactive confirmation logic is actually required.

- `DesignArgs.active`
- Why it violates YAGNI: no command uses it.
- What to do instead: delete field; re-add only with a concrete command behavior.

- `manifestDefaultProfile` fallback path
- Why it violates YAGNI: frontmatter requirement means the fallback is not part of current valid-input behavior.
- What to do instead: remove fallback/profile-source branch or relax schema intentionally (one direction only).

### Final Assessment
Total potential LOC reduction: ~2-4% across touched TypeScript sources
Complexity score: Medium
Recommended action: Proceed with simplifications

WROTE: artifacts/reviews/simplify-live.md
