# MCP Server (platforms/mcp)

Local MCP server used to expose ChatUI widgets and tool contracts for ChatGPT integration.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Verify](#verify)
- [Tests](#tests)
- [Files](#files)
- [Troubleshooting](#troubleshooting)
- [Related docs](#related-docs)

## Prerequisites

- Node.js 18+
- pnpm

## Quick start

From the repo root:

```bash
pnpm mcp:dev    # development mode
pnpm mcp:start  # production mode
```

The server listens on `PORT` (defaults to `8787`).

## Verify

- Open `http://localhost:8787` (or your `PORT`) and confirm the server responds.
- Run a widget harness in `platforms/web/apps/web` and verify widgets render.

## Tests

```bash
pnpm test:mcp-contract
```

## Files

- `server.js` and `enhanced-server.js`: MCP server entry points
- `tool-contracts.json`: Tool contract definitions used in tests

## Troubleshooting

### Symptom: Server fails to start

Cause: Port already in use.
Fix:

```bash
PORT=8790 pnpm mcp:dev
```

### Symptom: Widgets do not render

Cause: Widget bundles are not built.
Fix:

```bash
pnpm build:widgets
```

## Related docs

- `docs/architecture/WIDGET_ARCHITECTURE.md`
- `docs/guides/CHATGPT_INTEGRATION.md`
