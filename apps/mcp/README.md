# MCP Server (apps/mcp)

Local MCP server used to expose ChatUI widgets and tool contracts for ChatGPT integration.

## Run

From the repo root:

```bash
pnpm mcp:dev    # development mode
pnpm mcp:start  # production mode
```

## Tests

```bash
pnpm test:mcp-contract
```

## Files

- `server.js` and `enhanced-server.js`: MCP server entry points
- `tool-contracts.json`: Tool contract definitions used in tests

## Related docs

- `docs/architecture/WIDGET_ARCHITECTURE.md`
- `docs/guides/CHATGPT_INTEGRATION.md`
