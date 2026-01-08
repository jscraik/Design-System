# @chatui/runtime

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Platform Runtime Team (confirm)
- Review cadence: Each release (confirm)

Host adapters and helpers for ChatGPT Apps SDK widgets.

## Table of contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Quick start](#quick-start)
- [Verify](#verify)
- [widgetSessionId](#widgetsessionid-observability)
- [Troubleshooting](#troubleshooting)
- [Related docs](#related-docs)

## Prerequisites

- React 19.x
- Apps SDK UI runtime in the host environment (ChatGPT or local harness)

## Install

```bash
pnpm add @chatui/runtime
# or
npm install @chatui/runtime
```

## Usage

```ts
import { HostProvider, createEmbeddedHost } from "@chatui/runtime";

const host = createEmbeddedHost();

export function App() {
  return (
    <HostProvider host={host}>
      {/* your widget */}
    </HostProvider>
  );
}
```

## Verify

- In ChatGPT embed mode, ensure `window.openai` is available.
- In standalone mode, ensure your host adapter returns mock tool responses.

## widgetSessionId (observability)

The ChatGPT host attaches a per-widget session identifier on tool responses:

- `_meta["openai/widgetSessionId"]` (tool result metadata)

In a widget, you can access it via `window.openai.toolResponseMetadata` or
`host.toolResponseMetadata` in embedded mode:

```ts
const sessionId = (window.openai?.toolResponseMetadata as Record<string, unknown> | undefined)?.[
  "openai/widgetSessionId"
];

// Use this to correlate logs or client-side telemetry across tool calls
```

This ID is stable for the lifetime of the mounted widget instance and rotates
when the widget unmounts.

## Troubleshooting

### Symptom: `window.openai` is undefined

Cause: You are not running inside the ChatGPT Apps SDK host.
Fix: Use `createStandaloneHost()` and wrap your app in `HostProvider`.

### Symptom: `toolResponseMetadata` is empty

Cause: The MCP server is not returning `_meta` with `openai/widgetSessionId`.
Fix: Update the tool response to include `_meta["openai/widgetSessionId"]`.

## Related docs

- `packages/runtime/docs/WIDGET_SESSION_ID.md`
- `docs/architecture/WIDGET_ARCHITECTURE.md`
