# MCP Inspector CLI Workaround Summary

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Problem](#problem)
- [Solution](#solution)
  - [What Was Added](#what-was-added)
  - [Quick Start](#quick-start)
  - [From Repo Root](#from-repo-root)
- [Files Added/Modified](#files-addedmodified)
  - [New Files](#new-files)
  - [Modified Files](#modified-files)
- [Inspector UI Still Works](#inspector-ui-still-works)
- [Benefits](#benefits)
- [Testing Coverage](#testing-coverage)
- [Next Steps](#next-steps)
- [See Also](#see-also)


## Problem

The `@modelcontextprotocol/inspector` CLI (v0.18.0) has a module resolution bug:

```
Cannot find module .../@modelcontextprotocol/inspector/cli/package.json
```

This prevents using the CLI for testing:

```bash
npx @modelcontextprotocol/inspector --cli --transport http \
  --server-url http://127.0.0.1:8787/mcp \
  --method tools/list
```

## Solution

We've implemented a comprehensive testing solution that doesn't rely on the broken CLI.

### What Was Added

1. **JSON-RPC Integration Tests** (`tests/jsonrpc-integration.test.mjs`)
   - Automated tests using direct HTTP JSON-RPC calls
   - Tests `tools/list`, `tools/call`, `resources/list`, error handling
   - Can run in CI/CD pipelines

2. **Manual Test CLI** (`scripts/test-mcp-cli.mjs`)
   - Custom CLI tool for interactive testing
   - Supports all MCP methods (tools/list, tools/call, resources/list, etc.)
   - Better error messages and output formatting
   - Works around the Inspector CLI bug

3. **Updated Package Scripts**
   - `pnpm test` - Run all tests
   - `pnpm test:contract` - Tool contract validation
   - `pnpm test:jsonrpc` - JSON-RPC integration tests
   - `pnpm test:cli <method> [params]` - Manual CLI testing

4. **Documentation**
   - `MCP_TESTING_GUIDE.md` - Comprehensive testing guide
   - Updated `README.md` with testing instructions
   - Examples for curl, Node.js, and CI/CD

### Quick Start

```bash
# From repo root or platforms/mcp

# 1. Start server (in one terminal)
pnpm dev

# 2. Run automated tests (in another terminal)
pnpm test:contract    # Contract validation
pnpm test:jsonrpc     # Integration tests

# 3. Manual testing
pnpm test:cli tools/list
pnpm test:cli tools/call '{"name":"widget_name","arguments":{}}'
pnpm test:cli resources/list
```

### From Repo Root

```bash
pnpm mcp:test              # All tests
pnpm mcp:test:contract     # Contract tests
pnpm mcp:test:jsonrpc      # Integration tests
pnpm mcp:test:cli tools/list  # Manual CLI
```

## Files Added/Modified

### New Files

- `platforms/mcp/tests/jsonrpc-integration.test.mjs` - Integration tests
- `platforms/mcp/scripts/test-mcp-cli.mjs` - Manual test CLI
- `platforms/mcp/MCP_TESTING_GUIDE.md` - Comprehensive guide

### Modified Files

- `platforms/mcp/package.json` - Added test scripts
- `platforms/mcp/README.md` - Updated with testing docs
- `package.json` - Added root-level MCP test commands

## Inspector UI Still Works

While the CLI is broken, the Inspector UI works fine for visual/interactive testing:

```bash
pnpm inspector
# or from root:
pnpm mcp:inspector
```

This launches a web-based interface for testing the server.

## Benefits

1. **No dependency on broken CLI** - Our tests work independently
2. **Better for CI/CD** - Automated tests can run in pipelines
3. **More flexible** - Custom CLI has better error messages and formatting
4. **Comprehensive coverage** - Contract + integration + manual testing
5. **Well documented** - Clear guides and examples

## Testing Coverage

✅ Tool contract validation  
✅ JSON-RPC protocol compliance  
✅ Tools listing  
✅ Tool execution  
✅ Resource listing  
✅ Error handling  
✅ Malformed request handling  
✅ Manual interactive testing  

## Next Steps

The MCP CLI package is now complete with:

- All dependencies installed (including workarounds for peer deps)
- Comprehensive test suite
- Manual testing tools
- Complete documentation

You can now:

1. Run automated tests in CI/CD
2. Manually test any MCP method
3. Debug issues with detailed error messages
4. Validate tool contracts
5. Test JSON-RPC integration

## See Also

- [MCP_TESTING_GUIDE.md](MCP_TESTING_GUIDE.md) - Full testing documentation
- [README.md](README.md) - Quick start and basic usage
- [tests/jsonrpc-integration.test.mjs](tests/jsonrpc-integration.test.mjs) - Integration test source
- [scripts/test-mcp-cli.mjs](scripts/test-mcp-cli.mjs) - Manual CLI source
