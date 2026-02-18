# Cloudflare Template: Migrate ChatUIWidgetServer to Durable Object

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. This plan follows `.agent/PLANS.md`.

## Purpose / Big Picture

Migrate `packages/cloudflare-template` from instantiating `ChatUIWidgetServer` on every `/mcp` request to running the MCP server inside a Cloudflare Durable Object (DO). This aligns configuration with runtime behavior, reduces per-request initialization work, and enables future stateful behavior (caching, sessions, storage) without changing the external HTTP API.

Success is visible by starting `wrangler dev`, calling `GET /mcp` and `POST /mcp` MCP methods successfully, and confirming tools remain discoverable (including tool `_meta` such as `openai/outputTemplate`).

## What is a Durable Object (plain language)

A Cloudflare Durable Object is a single, named instance of code that Cloudflare keeps "sticky" to one location at a time, with a consistent identity and access to durable storage. Requests can be routed to that instance by ID. This is useful when you want one place to keep shared server state (or per-session state) instead of rebuilding it for every request.

In this migration, the DO owns one `ChatUIWidgetServer` instance and forwards requests to it.

## Progress

- [x] (2026-01-09T00:45Z) Created ExecPlan for migrating `ChatUIWidgetServer` to a Durable Object.
- [x] (2026-01-09T00:50Z) Step 1 complete: Updated `packages/cloudflare-template/wrangler.jsonc` to add DO binding `WIDGET_SERVER` and migrations (tag `v1`) introducing `ChatUIWidgetServerDO`.
- [x] (2026-01-09T00:55Z) Step 2 complete: Updated `packages/cloudflare-template/src/worker/index.ts` to export `ChatUIWidgetServerDO` and route `/mcp` through the singleton DO stub via `env.WIDGET_SERVER.idFromName("default")`.
- [x] (2026-01-09T01:00Z) Step 3 complete: Updated `packages/cloudflare-template/README.md` to document DO-hosted MCP server via binding `WIDGET_SERVER` (singleton) and clarify storage is available but not required.
- [x] (2026-01-09T01:05Z) Validation attempt failed: `pnpm` not found when running `pnpm -C packages/cloudflare-template prebuild`.
- [x] (2026-01-09T01:10Z) Validation attempt failed: `prebuild` failed under Node 24 due to a `fast-glob` ESM named export error when running `mise exec -- pnpm -C packages/cloudflare-template prebuild`.
- [x] (2026-01-09T01:15Z) Fix: Updated `packages/cloudflare-template/scripts/build-widgets.mjs` to use a default import for `fast-glob` to avoid Node 24 ESM/CJS named export errors.
- [x] (2026-01-09T01:18Z) Fix: Updated `packages/cloudflare-template/src/worker/index.ts` example tools to reference `kitchen-sink-lite` (manifest key) instead of `enhanced-example-widget`, resolving manifest/typecheck errors.
- [x] (2026-01-09T01:20Z) Validation: `prebuild` succeeded via `mise exec -- pnpm -C packages/cloudflare-template prebuild`.
- [x] (2026-01-09T01:22Z) Validation: `typecheck` succeeded via `mise exec -- pnpm -C packages/cloudflare-template typecheck`.
- [x] (2026-01-09T01:24Z) Validation: `cf-typegen` succeeded via `mise exec -- pnpm -C packages/cloudflare-template cf-typegen`.
- [x] (2026-01-09T01:26Z) Validation: `pnpm -C packages/cloudflare-template dev` encountered EMFILE watch errors; it briefly reported Ready on localhost before shutting down in this environment.
- [x] (2026-01-09T01:35Z) Fix: Added explicit `env.development` DO config in `packages/cloudflare-template/wrangler.jsonc` and updated scripts to run `wrangler dev/types --env development` to surface `WIDGET_SERVER` bindings in local dev/types output.
- [x] (2026-01-09T01:40Z) Validation: `cf-typegen --env development` now surfaces `WIDGET_SERVER` and `durableNamespaces` in the generated types after the env/config change.
- [x] (2026-01-09T01:50Z) Dev verification: `ulimit -n 8192` + `pnpm dev` showed `WIDGET_SERVER` binding; `GET /mcp` and `POST /mcp` (`tools/list`) returned 200 with tool `_meta`; `/src/widgets/demo/kitchen-sink-lite/` returned 200 after redirect.
- [x] (2026-01-09T01:55Z) Docs: Updated `packages/cloudflare-template/README.md` Troubleshooting to add EMFILE watch error guidance (raise `ulimit -n 8192`) and corrected the widgets reference to `@design-studio/widgets` plus manifest path `src/worker/widget-manifest.generated.ts`.
- [x] (2026-01-09T02:00Z) Docs: Added a macOS-specific EMFILE workaround note (`launchctl limit maxfiles`) to `packages/cloudflare-template/README.md` Troubleshooting.
- [ ] (TBD) Run validation commands; record results and any issues.

## Surprises & Discoveries

- Observation: `packages/cloudflare-template` `prebuild` fails under Node 24 due to a `fast-glob` ESM named export error.
  Evidence: Running `mise exec -- pnpm -C packages/cloudflare-template prebuild` triggers an error consistent with "Named export \"glob\" not found" / CJS-vs-ESM named export interop for `fast-glob` in `scripts/build-widgets.mjs` (`import { glob } from "fast-glob";`).
- Observation: The widget manifest does not include `enhanced-example-widget`, so example tools were referencing a non-existent manifest key.
  Evidence: `packages/cloudflare-template/src/worker/widget-manifest.generated.ts` lists `kitchen-sink-lite` but does not list `enhanced-example-widget`; the example tool registrations previously referenced `widgetManifest["enhanced-example-widget"]`, which caused manifest/typecheck errors until aligned.
- Observation: `wrangler dev` can hit EMFILE watch errors in this environment even when prebuild/typecheck/typegen succeed.
  Evidence: Running `pnpm -C packages/cloudflare-template dev` reported EMFILE watch errors and then shut down shortly after briefly showing Ready on `http://localhost:8787`.
- Observation: Follow-up: EMFILE watch errors persisted, but the dev server still accepted requests when raising the file descriptor limit (e.g., `ulimit -n 8192`).
  Evidence: With increased `ulimit`, `pnpm dev` surfaced the `WIDGET_SERVER` binding and returned 200s for `GET /mcp`, `POST /mcp` (`tools/list`), and widget asset requests (after redirect).
- Observation: `wrangler dev` and `wrangler types` did not list the `WIDGET_SERVER` binding (only `ASSETS`/`ENVIRONMENT`), so Durable Object binding recognition needs verification.
  Evidence: Wrangler output during `wrangler dev` / `wrangler types` only surfaced `ASSETS` and `ENVIRONMENT` bindings; generated `packages/cloudflare-template/worker-configuration.d.ts` does not include a `WIDGET_SERVER` binding declaration.
- Observation: Follow-up: The `WIDGET_SERVER` Durable Object binding becomes visible to Wrangler type generation when using `--env development`.
  Evidence: After switching to `wrangler types --env development` (via `pnpm -C packages/cloudflare-template cf-typegen`), the generated `packages/cloudflare-template/worker-configuration.d.ts` includes `WIDGET_SERVER` and `durableNamespaces`.

## Decision Log

- Decision: Use binding name `WIDGET_SERVER` and DO class name `ChatUIWidgetServerDO`.
  Rationale: Explicit, short binding name that matches repo naming conventions; class name clarifies purpose.
  Date/Author: 2026-01-09T00:50Z / Codex

- Decision: Route `/mcp` to a singleton DO instance using `idFromName("default")` (initial migration).
  Rationale: Minimal scope and no need to introduce a session ID contract; can be upgraded later to session-keyed routing if required.
  Date/Author: 2026-01-09T00:50Z / Codex

- Decision: Keep `ChatUIWidgetServer` as the core protocol handler; add a thin DO wrapper that owns initialization and delegates to `handleMcpRequest`.
  Rationale: Minimal code churn; preserves existing MCP behavior, security headers, and tool/resource registration patterns.
  Date/Author: 2026-01-09T00:50Z / Codex

- Decision: Fix `fast-glob` Node 24 interop by using a default import in `packages/cloudflare-template/scripts/build-widgets.mjs`.
  Rationale: Avoids named export interop failures in Node 24 ESM when `fast-glob` is CommonJS; keeps dependencies unchanged.
  Date/Author: 2026-01-09T01:15Z / Codex

- Decision: Align example tools to an existing widget key (`kitchen-sink-lite`) while keeping tool names stable.
  Rationale: Prevents referencing non-existent manifest keys and unblocks typecheck and demo tool discoverability.
  Date/Author: 2026-01-09T01:18Z / Codex

- Decision: Add an explicit `env.development` config and run Wrangler with `--env development` for dev and type generation to ensure `WIDGET_SERVER` Durable Object bindings are surfaced.
  Rationale: Wrangler output/types were not listing the DO binding in this environment; explicit env config reduces ambiguity and improves dev parity.
  Date/Author: 2026-01-09T01:35Z / Codex

## Outcomes & Retrospective (complete after execution)

- Expected outcome: `/mcp` is handled by `ChatUIWidgetServerDO`, asset serving via `ASSETS` remains unchanged, and MCP responses are unchanged except for lifecycle/initialization behavior.
- Unexpected regressions: (TBD)
- Follow-ups: (TBD)

## Context and Orientation

### Current state (after steps 1–3)

- `packages/cloudflare-template/src/worker/index.ts`
  - Exports `ChatUIWidgetServerDO` and routes `/mcp` through the singleton Durable Object stub via `env.WIDGET_SERVER.idFromName("default")`.
  - Keeps widget asset routing (`/src/*`, `/assets/*`) delegated to `env.ASSETS.fetch(request)`.

- `packages/cloudflare-template/wrangler.jsonc`
  - Declares the `WIDGET_SERVER` Durable Object binding for class `ChatUIWidgetServerDO`.
  - Includes a `v1` migration introducing `ChatUIWidgetServerDO`.

- `packages/cloudflare-template/README.md`
  - Documents that the MCP server is hosted in a Durable Object via binding `WIDGET_SERVER` (singleton) and clarifies that durable storage is available but not required for the template's current behavior.

### Target state (remaining work: validation only)

- Validation confirms the DO-backed `/mcp` endpoint works end-to-end:
  - `GET /mcp` capabilities respond successfully.
  - `POST /mcp` `tools/list` and `tools/call` behave as expected.
  - Tool discovery includes tool `_meta` when defined (notably `openai/outputTemplate`).

- Any environment-specific dev constraints (e.g., EMFILE watch limits) are either mitigated or documented as known limitations/workarounds.

## Plan of Work

1. Update `packages/cloudflare-template/wrangler.jsonc` to define DO binding and migrations.
2. Update `packages/cloudflare-template/src/worker/index.ts` to implement `ChatUIWidgetServerDO` and route `/mcp` through the DO.
3. Update `packages/cloudflare-template/README.md` to document DO-backed runtime architecture and any developer workflow implications.
4. Run validation and record results.

## Concrete Steps

### Step 1 — Update `packages/cloudflare-template/wrangler.jsonc`

Goal: Declare DO binding and migration so the runtime environment matches the code.

Edits:

- Add:
  - `durable_objects.bindings[]` with `{ name: "WIDGET_SERVER", class_name: "ChatUIWidgetServerDO" }`
  - `migrations[]` with an initial tag (e.g. `v1`) declaring `new_classes: ["ChatUIWidgetServerDO"]`

Acceptance for this step:

- `wrangler types` runs without schema errors.
- `wrangler dev` starts without complaining about missing DO bindings/classes.

### Step 2 — Update `packages/cloudflare-template/src/worker/index.ts`

Goal: Move MCP server lifecycle into a Durable Object and keep the external API stable.

Edits:

- Update the `Env` interface to include:
  - `WIDGET_SERVER: DurableObjectNamespace`
- Add an exported class `ChatUIWidgetServerDO`:
  - Constructor `(state: DurableObjectState, env: Env)`
  - Owns a `ChatUIWidgetServer` instance
  - Ensures `init()` is executed once (use an `initPromise` guard)
  - Implements `fetch(request)` delegating to `server.handleMcpRequest(request)`
- Update the default `fetch` handler to route `/mcp` through the DO stub:
  - `const id = env.WIDGET_SERVER.idFromName("default")`
  - `return env.WIDGET_SERVER.get(id).fetch(request)`
- Keep `/src/*` and `/assets/*` routing to `env.ASSETS.fetch(request)` unchanged.

Notes:

- Keep tool discovery responses unchanged and ensure tool `_meta` remains included in:
  - `GET /mcp` capabilities response
  - `POST /mcp` with `{"method":"tools/list"}` response

Acceptance for this step:

- `GET /mcp` returns JSON with `resources[]` and `tools[]` (including `_meta` when present).
- `POST /mcp` `tools/list` returns the same tool set (including `_meta`).

### Step 3 — Update `packages/cloudflare-template/README.md`

Goal: Ensure documentation matches the DO-backed implementation.

Edits:

- In configuration/features sections that mention Durable Objects:
  - Clarify that the MCP server runs inside a Durable Object (`ChatUIWidgetServerDO`) via binding `WIDGET_SERVER`.
  - Clarify that DO storage is available for future use (if not used yet, say so explicitly).
- Keep existing dev workflow guidance accurate:
  - `pnpm dev` runs `prebuild` before `wrangler dev` so widget assets and the generated manifest exist.

Acceptance for this step:

- README no longer describes an architecture that differs from actual runtime routing.

## Validation and Acceptance

Run from repo root.

Required commands:

- `pnpm -C packages/cloudflare-template prebuild`
- `pnpm -C packages/cloudflare-template typecheck`
- `pnpm -C packages/cloudflare-template cf-typegen`
- `pnpm -C packages/cloudflare-template dev`

Manual verification (while `pnpm -C packages/cloudflare-template dev` is running):

- `GET http://localhost:8787/mcp`
  - Confirms capabilities JSON
  - Confirms tools include `_meta` (when defined), especially `openai/outputTemplate`
- `POST http://localhost:8787/mcp` with JSON body `{ "method": "tools/list" }`
  - Confirms tools list and `_meta`
- Request a known widget asset path under `/src/...` or `/assets/...` and confirm a 200 response via `ASSETS`.

Optional (stronger confidence):

- `pnpm -C packages/cloudflare-template check`

Acceptance criteria:

- Dev server starts successfully.
- `/mcp` works through the DO binding with correct responses.
- Tool discovery includes `_meta` for widget output templates.
- Asset routes still serve widget files.

## Idempotence and Recovery

- These changes are deterministic and safe to re-run.
- Rollback plan:
  - Revert `/mcp` routing in worker `fetch()` to per-request `ChatUIWidgetServer.serve(request, env)`.
  - Remove `durable_objects` and `migrations` sections from `wrangler.jsonc`.
- Migration discipline:
  - After first deploy, do not rewrite old migrations; add a new migration tag for future DO class changes.

## Risks / Edge Cases

- Singleton DO throughput: All `/mcp` traffic goes to one DO instance. Mitigation: later introduce session-keyed DO routing using a stable session ID if needed.
- Initialization behavior change: `init()` runs once per DO lifecycle instead of once per request. Mitigation: ensure `init()` remains idempotent and does not assume per-request freshness.
- Binding mismatch: If `wrangler.jsonc` and deployed bindings diverge, `/mcp` will fail. Mitigation: keep `cf-typegen` and local `wrangler dev` as required checks in this plan.
