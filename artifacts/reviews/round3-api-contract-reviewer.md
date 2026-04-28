# Round 3 API Contract Review

## Severity-ranked findings

### HIGH - Missing explicit coexistence/migration contract for existing `astudio design` command surface
- Evidence:
  - Current repo command truth already exposes legacy `astudio design` command kinds (`lint`, `diff`, `export`, `checkBrand`, `init`, `migrate`, `doctor`) in [`packages/cli/src/commands/design.ts:31`](../../packages/cli/src/commands/design.ts:31) and [`packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json:9`](../../packages/cli/tests/fixtures/design-schemas/astudio-design-command.v1.schema.json:9).
  - The new v1 interface shape in the spec freezes a different public caller-facing set centered on `prepare/components/coverage/propose-abstraction` at [`docs/specs/2026-04-28-agent-native-design-system-spec.md:183`](../../docs/specs/2026-04-28-agent-native-design-system-spec.md:183) and kinds at [`docs/specs/2026-04-28-agent-native-design-system-spec.md:219`](../../docs/specs/2026-04-28-agent-native-design-system-spec.md:219).
  - The plan adds new kinds/commands but does not state a normative compatibility rule for existing design command consumers beyond a local rollback note at [`docs/plans/2026-04-28-agent-native-design-system-plan.md:566`](../../docs/plans/2026-04-28-agent-native-design-system-plan.md:566).
- Risk:
  - External/internal CLI consumers that currently validate `astudio design` output against existing fixture/schema sets can silently drift if command discovery/help/schema behavior changes without a declared coexistence policy.
- Remediation:
  - Add an explicit compatibility section in both plan and spec that states:
    - Existing `astudio design lint|diff|export|check-brand|init|migrate|doctor` remain supported in v1.
    - New agent-native commands are additive.
    - Any deprecation/removal requires explicit versioning (`*.v2`) plus alias/deprecation schedule and migration fixtures.
  - Add acceptance criteria that assert both legacy and new command kinds validate concurrently in the same envelope contract tests.

### MEDIUM - `safetyClass` taxonomy is underspecified relative to recovery rejection rules
- Evidence:
  - Shared validation command shape limits `safetyClass` to `read_only | mutating | interactive` at [`docs/specs/2026-04-28-agent-native-design-system-spec.md:252`](../../docs/specs/2026-04-28-agent-native-design-system-spec.md:252).
  - Recovery rules require rejecting unsafe `nextCommand` for additional classes including `server-start` and `browser-launch` at [`docs/specs/2026-04-28-agent-native-design-system-spec.md:543`](../../docs/specs/2026-04-28-agent-native-design-system-spec.md:543).
- Risk:
  - Implementations may diverge on where `server-start` / `browser-launch` are encoded (new enum values vs subtypes of `interactive`), creating incompatible `errors[].details.recovery` behavior across commands.
- Remediation:
  - Normalize the contract by either:
    - Expanding `safetyClass` enum to include `server_start` and `browser_launch`, or
    - Keeping the 3-value enum and adding a required secondary discriminator (for example `interactionClass`) with explicit values and fixture requirements.
  - Mirror the same taxonomy in plan acceptance criteria and schema fixtures.

## Residual risks
- The plan/spec are strong on envelope and read-only semantics, but implementation still needs deterministic fixture enforcement for help output and parser ambiguity where both legacy and new `astudio design` subcommands coexist.

WROTE: artifacts/reviews/round3-api-contract-reviewer.md
