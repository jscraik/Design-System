# Task Route: Test MCP Integration

Last updated: 2026-03-05

## Doc requirements

- Audience: Developers and AI coding agents
- Scope: Validate MCP contract and local integration readiness
- Non-scope: Production deployment tuning
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
- Local environment can run Node tests

## Happy Path (15 minutes)

```bash
pnpm test:mcp-contract
pnpm mcp:start
```

## Validation

```bash
pnpm onboarding:parity:check
pnpm onboarding:outcome:check
```

## Fallback Path

If MCP contract test fails:

1. Re-run with verbose Node output.
2. Confirm changed tool metadata and response shape.
3. Re-run contract test before starting MCP server.

## Expected Output

- MCP contract tests pass.
- MCP server starts without immediate initialization errors.
