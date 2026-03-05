# Task Route: Full Path (Token + Widget + MCP)

Last updated: 2026-03-05

## Doc requirements

- Audience: Developers and AI coding agents
- Scope: End-to-end onboarding integration path
- Non-scope: Advanced performance tuning
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

```bash
pnpm generate:tokens
pnpm build:widget
pnpm test:mcp-contract
```

## Validation

```bash
pnpm validate:tokens
pnpm onboarding:check
```

## Fallback Path

If any step fails:

1. Stop and fix the failing step first.
2. Re-run only the failed step and its validation.
3. Continue to the next stage after pass.

## Expected Output

- Token, widget, and MCP route checks all pass in one run.
