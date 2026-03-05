# Onboarding Command Center

Last updated: 2026-03-05

## Doc requirements

- Audience: Developers and AI coding agents
- Scope: Canonical first-week onboarding routes
- Non-scope: Deep architecture reference
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Weekly

## Table of Contents

- [Authority Status](#authority-status)
- [Start Here (15-minute goal)](#start-here-15-minute-goal)
- [Task Routes](#task-routes)
- [Deterministic Agent Checklist](#deterministic-agent-checklist)
- [Fallback Path](#fallback-path)
- [Validation](#validation)
- [Related Docs](#related-docs)

## Authority Status

This is the **canonical onboarding entrypoint** for this repository.
If another quick-start conflicts with this page, follow this page and file a drift issue.

## Start Here (15-minute goal)

1. Install dependencies.
2. Pick one task route below.
3. Run the route validation commands.

```bash
pnpm install
```

## Task Routes

- [Add a token safely](./tasks/add-token.md)
- [Ship/update a widget](./tasks/ship-widget.md)
- [Test MCP integration](./tasks/test-mcp-integration.md)
- [Full path: token + widget + MCP](./tasks/full-path-token-widget-mcp.md)

## Deterministic Agent Checklist

Use this sequence before any command-heavy work:

```bash
bash -lc "source scripts/codex-preflight.sh && preflight_repo design-system git,bash,sed,rg,fd,jq,node,pnpm AGENTS.md,docs,scripts"
```

Then run only the task route commands.

## Fallback Path

If prerequisites are missing:

1. Install/repair toolchain (`node`, `pnpm`, `rg`, `fd`, `jq`).
2. Re-run preflight.
3. Continue with the same task route (do not switch guides mid-stream).

## Validation

```bash
pnpm onboarding:check
node scripts/check-doc-links.mjs
```

## Related Docs

- Root overview: [../../README.md](../../README.md)
- Docs index: [../README.md](../README.md)
- Guides index: [./README.md](./README.md)
