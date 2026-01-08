# MCP Testing Quick Reference

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Start Server](#start-server)
- [Run Tests](#run-tests)
  - [All Tests](#all-tests)
  - [Specific Tests](#specific-tests)
- [Manual Testing](#manual-testing)
  - [CLI Tool](#cli-tool)
  - [With curl](#with-curl)
  - [Inspector UI](#inspector-ui)
- [Environment Variables](#environment-variables)
- [Common Workflows](#common-workflows)
  - [Test Workflow](#test-workflow)
  - [Debug Workflow](#debug-workflow)
- [Files](#files)


## Start Server

```bash
pnpm mcp:dev          # Development mode (from root)
pnpm dev              # Development mode (from platforms/mcp)
```

## Run Tests

### All Tests

```bash
pnpm mcp:test         # From root
pnpm test             # From platforms/mcp
```

### Specific Tests

```bash
pnpm mcp:test:contract    # Contract validation
pnpm mcp:test:jsonrpc     # Integration tests (requires running server)
```

## Manual Testing

### CLI Tool

```bash
pnpm mcp:test:cli tools/list                                    # List tools
pnpm mcp:test:cli resources/list                                # List resources
pnpm mcp:test:cli tools/call '{"name":"X","arguments":{}}'      # Call tool
```

### With curl

```bash
curl -X POST http://127.0.0.1:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
```

### Inspector UI

```bash
pnpm mcp:inspector    # Launch web UI
```

## Environment Variables

```bash
PORT=8797                                  # Server port
MCP_TEST_URL=http://localhost:8797         # Test target
WEB_WIDGET_HTML=/path/to/widget.html       # Widget HTML path
WIDGETS_DIST=/path/to/widgets/dist         # Widgets dist path
```

## Common Workflows

### Test Workflow

```bash
pnpm build:widgets                         # 1. Build widgets
pnpm mcp:dev                              # 2. Start server (terminal 1)
pnpm mcp:test:contract                    # 3. Run tests (terminal 2)
pnpm mcp:test:jsonrpc                     # 4. Run integration tests
pnpm mcp:test:cli tools/list              # 5. Manual verification
```

### Debug Workflow

```bash
pnpm mcp:dev                              # Start with logs
pnpm mcp:inspector                        # Open Inspector UI
# Use UI to test tools interactively
```

## Files

- `README.md` - Basic usage
- `MCP_TESTING_GUIDE.md` - Comprehensive testing guide
- `MCP_INSPECTOR_WORKAROUND.md` - CLI bug workaround details
- `tests/tool-contract.test.mjs` - Contract tests
- `tests/jsonrpc-integration.test.mjs` - Integration tests
- `scripts/test-mcp-cli.mjs` - Manual CLI tool
