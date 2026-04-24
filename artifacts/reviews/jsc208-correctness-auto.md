# JSC-208 Correctness Auto Review

## High

1. `design migrate` resolves migration target to raw `cwd` (not project root), so running from a subdirectory can fail with `E_INTERNAL` even when a valid repo-level config exists.
- Evidence (code): `packages/cli/src/commands/design.ts:679-683` passes `targetPath: cwd` into `migrateGuidanceConfig`, while design discovery resolves project root separately (`packages/cli/src/commands/design.ts:195-203`, `:421-425`).
- Evidence (live repro): `node dist/index.js --cwd <repo>/sub design migrate --to design-md --dry-run --json` returned `E_INTERNAL` with `ENOENT ... <repo>/sub/.design-system-guidance.json`, exit `1`.
- Why this is correctness-impacting: the same command shape behaves differently based only on caller directory depth, breaking deterministic automation and making valid migrations fail.
- Remediation: resolve migration target to the same root used by discovery (`findProjectRoot(commandCwd(argv))`) and use that root consistently for migration and doctor guidance checks.

2. `design init` can mutate disk and still return an error, leaving partial side effects.
- Evidence (code): `packages/cli/src/commands/design.ts:646-650` writes `DESIGN.md` before validation, then `packages/cli/src/commands/design.ts:661` parses and validates provenance (which can throw).
- Evidence (live repro): in a temp repo missing `docs/design-system/*` sources, `design init --write --force --yes --json` returned `E_DESIGN_SCHEMA_INVALID` (exit `2`) but still created `DESIGN.md`.
- Why this is correctness-impacting: callers see failure and may retry/rollback under a false assumption of no mutation.
- Remediation: preflight required provenance inputs before writing, or write to temp + validate + atomic rename so failed init is side-effect free.

3. `design check-brand` strict mode is logically tautological for successful parses, so it cannot detect profile mismatch drift.
- Evidence (code): `packages/cli/src/commands/design.ts:609-615` parses with `profileOverride: argv.profile`, then computes `ok` as `resolvedProfile === (argv.profile ?? contract.brandProfile)`.
- Evidence (live repro): `design check-brand --profile astudio-default@1 --strict --json` always returns `ok: true` when parse succeeds.
- Why this is correctness-impacting: strict mode gives false confidence and cannot enforce intended profile-resolution policy.
- Remediation: compare against an independent expected source (for example: frontmatter vs allowed/default profile policy), and emit deterministic mismatch findings/failure in strict mode.

## Medium

4. Lint finding line numbers are offset because section line numbers are computed after frontmatter stripping.
- Evidence (code): `packages/agent-design-engine/src/parser.ts:97-108` strips frontmatter and passes body to `parseSections`; `packages/agent-design-engine/src/parser.ts:40-49` records `line: index + 1` relative to stripped body.
- Why this is correctness-impacting: machine/human diagnostics point to wrong file lines, reducing fix accuracy and violating evidence fidelity expectations.
- Remediation: track frontmatter line count and add that offset when assigning section/finding line numbers.

## Residual risk

- Existing CLI tests do not cover the subdirectory migration root mismatch or init partial-side-effect failure path, so these regressions can persist while current suites pass.

WROTE: artifacts/reviews/jsc208-correctness-auto.md
