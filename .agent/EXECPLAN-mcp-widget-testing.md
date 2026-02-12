# Add Widget Testing MCP without Duplication

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. This plan follows `/Users/jamiecraik/dev/aStudio/.agent/PLANS.md`.

## Purpose / Big Picture

We want one consolidated MCP implementation that exposes widget testing capabilities without duplicating logic across `platforms/mcp/server.js` and `platforms/mcp/enhanced-server.js`. After this change, a developer can start the MCP server and discover a dedicated set of widget preview tools (one per widget) using `tools/list`, then call a tool to render any widget for manual or automated testing. The same server factory is reused by both entry points, so changes to widget tooling or metadata are made once. Success is visible by running `pnpm -C platforms/mcp test:contract` and `pnpm -C platforms/mcp test:jsonrpc` and by calling `tools/list` to see the widget preview tools.

## Progress

- [x] (2026-01-09 01:50Z) Added shared HTTP server helper to remove duplicated transport logic.
- [x] (2026-01-09 02:00Z) Added auto-generated widget preview tools backed by the widget manifest.
- [x] (2026-01-09 02:05Z) Updated tool-contract tests to require core tool contracts and allow generated widget preview tools.
- [x] (2026-01-09 02:20Z) Run MCP contract and JSON-RPC tests; record results.
      Evidence: `pnpm -C platforms/mcp test:contract` (6 passed) and `pnpm -C platforms/mcp test:jsonrpc` (6 passed).

## Surprises & Discoveries

- Observation: (none yet)
  Evidence: (none yet)

## Decision Log

- Decision: Use enhanced-server as the single source of tool/resource definitions and make `server.js` a thin wrapper.
  Rationale: Removes duplicated tool registration while preserving existing import paths and scripts.
  Date/Author: 2026-01-09 / Codex

- Decision: Add a shared HTTP server helper instead of duplicating Streamable HTTP boilerplate.
  Rationale: Keeps direct-run behavior consistent and avoids repeating rate limiting and transport setup.
  Date/Author: 2026-01-09 / Codex

- Decision: Generate one preview tool per widget using the manifest rather than a single dynamic tool.
  Rationale: Apps SDK expects `openai/outputTemplate` in tool metadata; per-widget tools are the safest way to render arbitrary widgets.
  Date/Author: 2026-01-09 / Codex

## Outcomes & Retrospective

- Widget preview tools are auto-generated per widget manifest, and both MCP entry points now reuse a single implementation. Contract and JSON-RPC tests pass. No unexpected regressions observed.

## Context and Orientation

The MCP implementation lives in `platforms/mcp/server.js` (legacy) and `platforms/mcp/enhanced-server.js` (enhanced). Both files currently duplicate resource registration, tool schemas, and HTTP transport wiring. Widget resources are built from `packages/widgets/dist/src` and a manifest at `packages/widgets/src/sdk/generated/widget-manifest.js`. Tool contracts are validated by `platforms/mcp/tests/tool-contract.test.mjs`, which currently requires exact parity with `platforms/mcp/tool-contracts.json`.

Key terms used in this plan:

- "Widget preview tool": a tool that renders a specific widget via `openai/outputTemplate` metadata so it can be inspected in Apps SDK clients.
- "Server factory": a shared module that creates and returns an `McpServer` instance with all tools/resources registered.

## Plan of Work

First, extend `platforms/mcp/enhanced-server.js` to auto-generate preview tools named `widget_preview_<widgetName>` from the widget manifest. Each preview tool must set `openai/outputTemplate` to the widget’s manifest URI and return `structuredContent` with the widget name and optional payload.

Second, introduce a shared HTTP server helper under `platforms/mcp/lib/http-server.js` that wires Streamable HTTP, DNS rebinding protection, and deterministic rate limiting. Both entry points should call this helper instead of duplicating transport boilerplate.

Third, update `platforms/mcp/server.js` to act as a thin wrapper around `createEnhancedChatUiServer`, preserving the legacy export name while removing duplicated tool/resource definitions. Update `platforms/mcp/enhanced-server.js` to use the shared HTTP server helper for direct-run behavior.

Fourth, update `platforms/mcp/tests/tool-contract.test.mjs` to require that the core tool contracts (from `tool-contracts.json`) are a subset of registered tools, and add validation for generated `widget_preview_*` tools (ensuring outputTemplate includes the widget name, visibility is public, and readOnlyHint is true). Do not require an explicit contract entry for every widget preview tool.

Finally, run MCP contract and JSON-RPC tests from `platforms/mcp` and record outputs in this plan’s Progress section.

## Concrete Steps

1. Create shared module:
   - `platforms/mcp/lib/http-server.js`

2. Update entry points:
   - `platforms/mcp/enhanced-server.js`
   - `platforms/mcp/server.js`

3. Update contract tests:
   - `platforms/mcp/tests/tool-contract.test.mjs`

4. Run tests (from repo root or `platforms/mcp`):
   - `pnpm -C platforms/mcp test:contract`
   - `pnpm -C platforms/mcp test:jsonrpc`

Expected outcomes:

- `tools/list` contains `widget_preview_<widgetName>` for each widget in the manifest.
- Contract tests pass, verifying core tools and generated preview tools.
- JSON-RPC tests pass.

## Validation and Acceptance

Acceptance is achieved when:

- Running the MCP server and calling `tools/list` shows the widget preview tools.
- Running `pnpm -C platforms/mcp test:contract` passes with no missing or extra core tools.
- Running `pnpm -C platforms/mcp test:jsonrpc` passes.

## Idempotence and Recovery

These changes are additive and safe to repeat. If a test fails, re-run after correcting the reported issue. No data migrations are involved. If needed, revert to the previous server files by checking git history.

## Artifacts and Notes

Include short command outputs in the Progress section after running tests. Keep logs limited to the final pass/fail summary.

## Interfaces and Dependencies

The shared factory should export:

- `createChatUiServer()` and `createEnhancedChatUiServer()` returning `McpServer` instances.
- A helper `createHttpServer({ createServer, label })` that starts Streamable HTTP handling.

The widget preview tool handler must return:

- `structuredContent: { widgetName: string, payload?: object, locale?: string }`
- `content` with a JSON fallback string.

Use existing dependencies: `@modelcontextprotocol/sdk`, `zod`, `zod-to-json-schema`, and `packages/widgets/src/shared/widget-registry`.
