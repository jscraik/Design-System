## Simplification Findings (JSC-208)

### 1) Dead migration flag (`--yes`) adds unused surface area
- Severity: Medium
- Evidence:
  - `packages/design-system-guidance/src/types.ts:65`-`73` defines `MigrationOptions.yes`.
  - `packages/design-system-guidance/src/cli.ts:64`-`66` parses `--yes`, and `:148`-`156` forwards it.
  - `packages/design-system-guidance/src/cli.ts:99`-`101` documents `--yes` in usage.
  - `packages/design-system-guidance/src/core.ts:920`-`1024` never reads `options.yes`.
- Why this is unnecessary: The flag is threaded through API + CLI docs but has no behavior, so it increases cognitive load and test surface without value.
- Simplification: Remove `yes` from `MigrationOptions`, CLI parsing, and usage text until a real prompt-bypass flow exists.

### 2) `createEnvelope()` recomputes output mode twice
- Severity: Low
- Evidence:
  - `packages/cli/src/utils/output.ts:11`-`16` computes mode from `process.argv`/`process.env`.
  - `packages/cli/src/utils/output.ts:135` calls `currentOutputMode()` twice in one expression.
- Why this is unnecessary: Repeated global scans for the same value in one code path add noise and make the call site harder to read.
- Simplification: Cache once (`const outputMode = currentOutputMode();`) and spread conditionally from the cached value.

### 3) Custom yargs facade types create extra indirection with no runtime benefit
- Severity: Medium
- Evidence:
  - `packages/cli/src/commands/design.ts:66`-`78` defines `DesignOptionBuilder` and `DesignCommandChain` wrappers.
  - `packages/cli/src/commands/design.ts:471`-`474` casts `yargs` via `as unknown as DesignCommandChain`.
- Why this is unnecessary: The wrappers duplicate a subset of yargs API and require unsafe casts, which increases maintenance burden without changing behavior.
- Simplification: Use native `Argv` typing directly (or a single narrow helper type) and drop the facade interfaces + double cast.

### 4) Rollback metadata validation does extra JSON parsing but uses none of the parsed fields
- Severity: Low
- Evidence:
  - `packages/design-system-guidance/src/core.ts:840`-`855` reads and JSON-parses rollback metadata, only asserting `isObject(parsed)`.
  - No parsed fields are consumed after that check.
- Why this is unnecessary: The function currently does more than a readability check but less than a true schema check; that middle state adds complexity without meaningful guarantees.
- Simplification: Either (a) reduce to existence/readability only, or (b) perform a minimal schema validation and use validated fields.

## Skipped / False-positive notes
- Skipped generated churn (`packages/cli/dist/**`, `*.d.ts.map`, lockfile artifact noise) as non-source simplification targets.
- Skipped `docs/plans/**` findings per repository instruction contract.
- Did not flag defensive migration state transitions in `migrateGuidanceConfig()` as simplification targets because they appear intentional for failure recovery semantics.

WROTE: artifacts/reviews/jsc208-simplify-review.md
