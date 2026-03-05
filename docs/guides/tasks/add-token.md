# Task Route: Add a Token

Last updated: 2026-03-05

## Doc requirements

- Audience: Developers and AI coding agents
- Scope: Safely adding token data and validating outputs
- Non-scope: Full token architecture theory
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Weekly

## Table of Contents

- [Preconditions](#preconditions)
- [Happy Path (15 minutes)](#happy-path-15-minutes)
- [Validation](#validation)
- [Fallback Path](#fallback-path)
- [Expected Output](#expected-output)

## Preconditions

- Repo cloned and dependencies installed
- Preflight passes

## Happy Path (15 minutes)

1. Edit token source in `packages/tokens/src/tokens/index.dtcg.json`.
2. Generate token outputs.
3. Validate token integrity.

```bash
pnpm generate:tokens
pnpm validate:tokens
pnpm ds:matrix:check
```

## Validation

```bash
pnpm onboarding:parity:check
pnpm onboarding:outcome:check
```

## Fallback Path

If generation fails:

1. Confirm JSON syntax and schema keys.
2. Re-run token generation.
3. Re-run validation commands.

## Expected Output

- Generated token files update without schema errors.
- Token validation passes.
