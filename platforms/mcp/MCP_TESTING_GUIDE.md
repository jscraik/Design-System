# MCP Testing Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [Known Issue: MCP Inspector CLI](#known-issue-mcp-inspector-cli)
- [Alternative Testing Methods](#alternative-testing-methods)
  - [1. Tool Contract Tests (Fastest)](#1-tool-contract-tests-fastest)
  - [2. JSON-RPC Integration Tests](#2-json-rpc-integration-tests)
  - [3. Manual CLI Testing](#3-manual-cli-testing)
  - [4. MCP Inspector UI](#4-mcp-inspector-ui)
- [Complete Test Suite](#complete-test-suite)
- [Example Test Workflow](#example-test-workflow)
- [Direct JSON-RPC with curl](#direct-json-rpc-with-curl)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
  - [Server not responding](#server-not-responding)
  - [Connection refused](#connection-refused)
  - [Widget not found errors](#widget-not-found-errors)
- [Files](#files)
- [Related Documentation](#related-documentation)


## Overview

This guide explains how to test the MCP server without relying on the broken MCP Inspector CLI.

## Known Issue: MCP Inspector CLI

The `@modelcontextprotocol/inspector` CLI has a module resolution bug that causes:

```
Cannot find module .../@modelcontextprotocol/inspector/cli/package.json
```

This prevents running commands like:

```bash
npx @modelcontextprotocol/inspector --cli --transport http --server-url http://127.0.0.1:8787/mcp --method tools/list
```

## Alternative Testing Methods

### 1. Tool Contract Tests (Fastest)

Tests that all registered tools have proper metadata and contracts:

```bash
pnpm test:contract
# or from root:
pnpm mcp:test:contract
```

**What it validates:**

- All registered tools have contracts
- Required metadata fields are present
- Security schemes are defined
- Output templates are valid
- Golden prompts exist

### 2. JSON-RPC Integration Tests

Tests the server via direct HTTP JSON-RPC calls:

```bash
# Terminal 1: Start the server
pnpm dev

# Terminal 2: Run integration tests
pnpm test:jsonrpc

# or from root:
pnpm mcp:test:jsonrpc
```

**What it tests:**

- `tools/list` returns valid tool definitions
- `tools/call` can execute widget tools
- `resources/list` returns widget resources
- Error handling for invalid methods
- Malformed request handling

### 3. Manual CLI Testing

Custom JSON-RPC test CLI for interactive testing:

```bash
# Terminal 1: Start the server
pnpm dev

# Terminal 2: Test specific methods
pnpm test:cli tools/list
pnpm test:cli resources/list
pnpm test:cli tools/call '{"name":"widget_name","arguments":{}}'

# With custom server URL
MCP_TEST_URL=http://localhost:8797 pnpm test:cli tools/list

# See all options
pnpm test:cli --help
```

**Available methods:**

- `tools/list` - List all available tools
- `tools/call` - Call a specific tool
- `resources/list` - List all resources
- `resources/read` - Read a specific resource
- `prompts/list` - List all prompts
- `prompts/get` - Get a specific prompt

### 4. MCP Inspector UI

While the CLI is broken, the UI still works for visual testing:

```bash
pnpm inspector
```

This launches a web-based interface for testing the MCP server interactively.

## Complete Test Suite

Run all tests together:

```bash
pnpm test
# or from root:
pnpm mcp:test
```

## Example Test Workflow

```bash
# 1. Build widgets (if not already built)
cd /path/to/chatui
pnpm build:widgets

# 2. Start MCP server
cd platforms/mcp
pnpm dev &

# 3. Run contract tests
pnpm test:contract

# 4. Run integration tests
pnpm test:jsonrpc

# 5. Manual testing
pnpm test:cli tools/list
pnpm test:cli resources/list

# 6. Get first tool name and test calling it
TOOL_NAME=$(pnpm -s test:cli tools/list | grep '"name":' | head -1 | cut -d'"' -f4)
pnpm test:cli tools/call "{\"name\":\"$TOOL_NAME\",\"arguments\":{}}"
```

## Direct JSON-RPC with curl

You can also test directly with curl:

```bash
# List tools
curl -X POST http://127.0.0.1:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": 1
  }'

# Call a tool
curl -X POST http://127.0.0.1:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "example_widget",
      "arguments": {}
    },
    "id": 2
  }'
```

## CI/CD Integration

The JSON-RPC integration tests can run in CI:

```yaml
# .github/workflows/test.yml
- name: Build widgets
  run: pnpm build:widgets

- name: Start MCP server
  run: pnpm -C platforms/mcp dev &
  
- name: Wait for server
  run: sleep 2

- name: Run MCP tests
  run: pnpm mcp:test
```

## Troubleshooting

### Server not responding

```bash
# Check if server is running
lsof -i :8787

# Check server logs
pnpm dev
```

### Connection refused

Make sure the server is running on the expected port:

```bash
PORT=8797 pnpm dev
```

Then test with:

```bash
MCP_TEST_URL=http://localhost:8797 pnpm test:cli tools/list
```

### Widget not found errors

Build the widgets first:

```bash
pnpm build:widgets
```

## Files

- `tests/tool-contract.test.mjs` - Contract validation tests
- `tests/jsonrpc-integration.test.mjs` - JSON-RPC integration tests
- `scripts/test-mcp-cli.mjs` - Manual CLI testing tool

## Related Documentation

- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Widget Architecture](../../docs/architecture/WIDGET_ARCHITECTURE.md)
- [ChatGPT Integration Guide](../../docs/guides/CHATGPT_INTEGRATION.md)

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

