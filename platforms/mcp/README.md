# MCP Server (platforms/mcp)

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: MCP Integrations Team (confirm)
- Review cadence: Each release (confirm)

Local MCP server used to expose aStudio widgets and tool contracts for ChatGPT integration.

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

### Using MCP Inspector

To debug and test the MCP server with the interactive inspector:

```bash
cd platforms/mcp
pnpm inspector
```

This will launch the MCP Inspector, which provides a web-based UI for testing MCP server tools and capabilities.

## Verify

- Open `http://localhost:8787` (or your `PORT`) and confirm the server responds.
- Run a widget harness in `platforms/web/apps/web` and verify widgets render.

## Tests

### Tool Contract Tests

```bash
pnpm test:contract          # Run tool contract validation tests
```

### JSON-RPC Integration Tests

```bash
# Start the server first in one terminal
pnpm dev

# Then run integration tests in another terminal
pnpm test:jsonrpc
```

### Manual CLI Testing

Since the MCP Inspector CLI has module resolution issues, use our custom test CLI:

```bash
# Start the server first
pnpm dev

# In another terminal, test various methods:
pnpm test:cli tools/list
pnpm test:cli resources/list
pnpm test:cli tools/call '{"name":"example_widget","arguments":{}}'

# Use custom server URL
MCP_TEST_URL=http://localhost:8797 pnpm test:cli tools/list
```

### Run All Tests

```bash
pnpm test                   # Runs both contract and JSON-RPC tests
```

From the repo root:

```bash
pnpm mcp:test               # All tests
pnpm mcp:test:contract      # Contract tests only
pnpm mcp:test:jsonrpc       # JSON-RPC integration tests
pnpm mcp:test:cli tools/list # Manual CLI testing
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

- `MCP_TESTING_GUIDE.md` - Comprehensive testing guide and workarounds for MCP Inspector CLI issues
- `docs/architecture/WIDGET_ARCHITECTURE.md`
- `docs/guides/CHATGPT_INTEGRATION.md`
