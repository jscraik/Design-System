# Tools Handoff (MCP) v1.0

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This document captures the current tool surface area in `platforms/mcp/server.js` and aligns it to Apps SDK tool-design guidelines. It is meant to be the implementation handoff for tools and UI components.

## App-level metadata (global)

- **Name**: `chatui` (MCP server name)
- **Version**: `1.0.0`
- **Auth**: `noauth` (all tools declare `securitySchemes: [{ type: "noauth" }]`)

## Tool inventory

### 1) `display_chat`

- **Name**: `display_chat`
- **Description**: Use this when the user wants a conversation-style interaction or needs a dedicated chat view. This tool only renders a UI and does not modify external data.
- **Input schema**:
  - `seedMessage?: string` — Optional initial message to seed the chat conversation.
- **Output (structuredContent)**:
  - `seedMessage: string` — Seeded message (empty string if not provided).
  - `locale: string` — Locale from `_meta["openai/locale"]` (default `"en"`).
- **Output (content)**: Single text block describing that the chat UI was opened.
- **Output (meta)**:
  - `_meta.clientInfo.userAgent?: string`
  - `_meta.clientInfo.location?: object`
- **Component rendering**: `ui://widget/chat-view.html`
- **Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`, `idempotentHint: true`
- **Tool `_meta`**:
  - `securitySchemes`: `[{ type: "noauth" }]`
  - `openai/outputTemplate`: `ui://widget/chat-view.html`
  - `openai/widgetAccessible`: `false`
  - `openai/visibility`: `public`
  - `openai/toolInvocation/invoking`: `Opening chat interface...`
  - `openai/toolInvocation/invoked`: `Chat interface ready`
  - `openai/fileParams`: `[]`

### 2) `display_search_results`

- **Name**: `display_search_results`
- **Description**: Use this when presenting multiple search results or recommendations the user needs to scan. This tool only renders results and does not perform searches.
- **Input schema**:
  - `query: string`
  - `results: Array<{ id: string | number; title: string; description?: string; url?: string; tags?: string[] }>`
- **Output (structuredContent)**:
  - `query: string`
  - `results: result[]`
  - `locale: string`
- **Output (content)**: Single text block with count and query.
- **Output (meta)**:
  - `_meta.searchContext.location?: object`
  - `_meta.searchContext.timestamp: string`
- **Component rendering**: `ui://widget/search-results.html`
- **Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`, `idempotentHint: true`
- **Tool `_meta`**:
  - `securitySchemes`: `[{ type: "noauth" }]`
  - `openai/outputTemplate`: `ui://widget/search-results.html`
  - `openai/widgetAccessible`: `false`
  - `openai/visibility`: `public`
  - `openai/toolInvocation/invoking`: `Preparing search results...`
  - `openai/toolInvocation/invoked`: `Search results displayed`
  - `openai/fileParams`: `[]`

### 3) `display_table`

- **Name**: `display_table`
- **Description**: Use this when presenting structured tabular data (comparisons, schedules, lists).
- **Input schema**:
  - `title?: string`
  - `columns: string[]`
  - `rows: Array<Record<string, any>>`
- **Output (structuredContent)**:
  - `title?: string`
  - `columns: string[]`
  - `data: Array<Record<string, any>>`
  - `locale: string`
- **Output (content)**: Single text block describing row count (and title if provided).
- **Output (meta)**:
  - `_meta.tableContext.generatedAt: string`
- **Component rendering**: `ui://widget/pizzaz-table.html`
- **Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`, `idempotentHint: true`
- **Tool `_meta`**:
  - `securitySchemes`: `[{ type: "noauth" }]`
  - `openai/outputTemplate`: `ui://widget/pizzaz-table.html`
  - `openai/widgetAccessible`: `false`
  - `openai/visibility`: `public`
  - `openai/toolInvocation/invoking`: `Preparing table...`
  - `openai/toolInvocation/invoked`: `Table displayed`
  - `openai/fileParams`: `[]`

### 4) `display_demo`

- **Name**: `display_demo`
- **Description**: Use this for testing or demonstrating the widget system (kitchen-sink widget). Read-only.
- **Input schema**: `{}`
- **Output (structuredContent)**: `{ demo: true }`
- **Output (content)**: `"Demo widget displayed"`
- **Component rendering**: `ui://widget/kitchen-sink-lite.html`
- **Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`, `idempotentHint: true`
- **Tool `_meta`**:
  - `securitySchemes`: `[{ type: "noauth" }]`
  - `openai/outputTemplate`: `ui://widget/kitchen-sink-lite.html`
  - `openai/widgetAccessible`: `false`
  - `openai/visibility`: `public`
  - `openai/toolInvocation/invoking`: `Loading demo...`
  - `openai/toolInvocation/invoked`: `Demo widget ready`
  - `openai/fileParams`: `[]`

### 5) `display_dashboard`

- **Name**: `display_dashboard`
- **Description**: Use this when the user wants a dashboard-style overview. This tool only renders a UI and does not modify external data.
- **Input schema**: `{}`
- **Output (structuredContent)**:
  - `dashboard: true`
  - `headerText?: string`
  - `stats?: Array<{ label: string; value: string; change: string }>`
  - `recentChats?: Array<{ id: string | number; title: string; model: string; time: string }>`
- **Output (content)**: `"Dashboard displayed"`
- **Component rendering**: `ui://widget/dashboard-widget.html`
- **Annotations**: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`, `idempotentHint: true`
- **Tool `_meta`**:
  - `securitySchemes`: `[{ type: "noauth" }]`
  - `openai/outputTemplate`: `ui://widget/dashboard-widget.html`
  - `openai/widgetAccessible`: `false`
  - `openai/visibility`: `public`
  - `openai/toolInvocation/invoking`: `Opening dashboard...`
  - `openai/toolInvocation/invoked`: `Dashboard ready`
  - `openai/fileParams`: `[]`

## Component resources (UI templates)

Resources are registered per widget and serve `text/html+skybridge` HTML:

- `ui://widget/chat-view.html`
- `ui://widget/dashboard-widget.html`
- `ui://widget/search-results.html`
- `ui://widget/pizzaz-table.html`
- `ui://widget/kitchen-sink-lite.html`
- `ui://widget/pizzaz-carousel.html`
- `ui://widget/pizzaz-gallery.html`
- `ui://widget/pizzaz-markdown.html`
- `ui://widget/solar-system.html`

Resource `_meta` (applied to each widget resource):

- `openai/widgetPrefersBorder: true`
- `openai/widgetDescription: string`
- `openai/widgetCSP`:
  - `connect_domains: []`
  - `resource_domains: ["web-sandbox.oaiusercontent.com"]`

## UI guidelines (Apps SDK)

Use Apps SDK UI for native‑feeling components and consistent tokens. Key display‑mode rules:

### Inline cards

- Keep the surface lightweight; avoid multi‑view flows inside a single card.
- Max **two** primary actions (one primary + one secondary).
- No nested scrolling; cards should auto‑fit content.
- Avoid duplicating ChatGPT inputs (use the system composer instead).

### Inline carousels

- **3–8 items** for scannability.
- Consistent visual hierarchy; max ~2–3 lines of metadata.
- One optional CTA per item.

### Fullscreen

- Use for rich, multi‑step workflows or deep exploration (maps, editors).
- Design around the system composer (conversation stays available).

### PiP

- Use for ongoing sessions (games, live updates).
- Keep controls minimal; close when the session ends.

### Visual design

- **Color:** use system colors for UI, reserve brand color for accents/CTAs only.
- **Typography:** inherit system fonts (no custom fonts).
- **Spacing:** respect system spacing and corner radii.
- **Icons & imagery:** monochrome, outline style; provide alt text; respect aspect ratios.
- **Accessibility:** meet WCAG AA contrast; support text resizing.

## UX principles (Apps SDK)

Design apps that are **conversational, native‑feeling, and composable**. Prioritize:

- **Conversational leverage:** natural language + context enable workflows.
- **Native fit:** seamless hand‑offs between model and tools.
- **Composability:** small, reusable actions the model can mix.

Core principles:

1. **Extract, don’t port** — expose atomic actions instead of mirroring a full app.
2. **Design for conversational entry** — support open‑ended prompts, direct commands, and first‑run onboarding.
3. **Design for the ChatGPT environment** — use UI selectively to clarify actions or show structure.
4. **Optimize for conversation, not navigation** — concise outputs; the model owns routing/state.
5. **Embrace the ecosystem moment** — leverage NL inputs, context, and optional multi‑tool composition.

Pre‑publish checklist (short form):

- Clear conversational value and platform fit.
- Atomic, well‑typed tools with explicit inputs/outputs.
- UI adds meaningful value beyond plain text.
- Task can be completed end‑to‑end inside ChatGPT.
- Responsive performance and discoverable prompts.

Avoid:

- Long‑form/static content dumps.
- Complex multi‑step flows inside a single display mode.
- Ads/upsells or irrelevant messaging.
- Duplicating system composer or exposing sensitive info in cards.

## Widget runtime bridge (window.openai) quick reference

Use the host bridge for UI state and actions. Recommended hooks exist in `@chatui/runtime`:

- `useToolInput()`, `useToolOutput()`, `useToolResponseMetadata()`
- `useTheme()`, `useDisplayMode()`, `useMaxHeight()`, `useLocale()`, `useUserAgent()`
- `useSafeArea()`, `useView()`

Key runtime methods:

- `callTool(name, args)` - invoke tools from the widget (requires tool descriptor to allow component initiation).
- `sendFollowUpMessage({ prompt })` - post a user-authored follow-up.
- `uploadFile(file)` / `getFileDownloadUrl({ fileId })` - file transfer helpers.
- `requestDisplayMode({ mode })`, `requestModal(args)`, `notifyIntrinsicHeight({ height })`
- `openExternal({ href })`, `requestClose()`

Widget state notes:

- `setWidgetState(payload)` persists per widget instance; avoid large payloads.
- If you want the model to see images in follow-ups, use a structured state shape
  such as `{ modelContent, privateContent, imageIds }` and keep it small.

To close a widget from the server, return tool result metadata:

```
metadata: { "openai/closeWidget": true }
```

## File APIs (host bridge)

Supported by `window.openai` (client/host surface):

- `uploadFile(file)` → `{ fileId }`
- `getFileDownloadUrl({ fileId })` → `{ downloadUrl }`

If file params are introduced later, set `_meta["openai/fileParams"]` on tool descriptors accordingly.

## Auth + rate limits

- Current tools assume **no auth** (no linked account required).
- Rate limiting is not implemented at the server level; consider a global or per-tool throttle if external calls are added.

## Error handling expectations

- Tools should return standard MCP errors when inputs are malformed.
- For auth-required tools (future), return `_meta["mcp/www_authenticate"]` with OAuth challenges.

## Test prompts

### Should succeed

- "Open the chat UI"
- "Show me a chat interface with the message ‘Hello’"
- "Show search results for ‘pizza’ with two items"
- "Display a table with columns name and price"
- "Open the demo widget"

### Should fail / be rejected by schema

- `display_search_results` with missing `query` or `results`
- `display_table` with `columns` not an array
- Any tool called with extra unknown top-level fields if input validation is tightened

## Notes / gaps

- No `outputSchema` is declared; schemas are implicit in the tool implementation.
- `openai/widgetAccessible` is `false` for all tools; enable selectively if widget-to-tool calls are desired.
