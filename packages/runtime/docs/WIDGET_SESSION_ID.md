# Widget Session ID Pattern

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This document explains the `widgetSessionId` pattern for maintaining state across widget instances in ChatGPT Apps SDK.

## Table of contents

- [Overview](#overview)
- [How it works](#how-it-works)
- [Use cases](#use-cases)
- [Best practices](#best-practices)
- [TypeScript types](#typescript-types)
- [Verify](#verify)
- [Related documentation](#related-documentation)

## Overview

The `widgetSessionId` is a unique identifier that persists across tool calls within the same conversation. It enables widgets to maintain state and context even when the widget is re-rendered or when multiple tool calls occur.

## How It Works

### 1. Server-Side (MCP Tool Handler)

When handling a tool call, include the `widgetSessionId` in the `_meta` field of the response:

```javascript
async function handleToolCall(args, { _meta } = {}) {
  // Generate or retrieve session ID
  const sessionId = _meta?.widgetSessionId || generateSessionId();

  return {
    // Content for the model (narration)
    content: [{ type: "text", text: "Widget displayed successfully" }],

    // Structured content for the widget
    structuredContent: {
      items: args.items,
      // ... other data
    },

    // Widget-only metadata (hidden from model)
    _meta: {
      widgetSessionId: sessionId,
      // ... other widget-specific data
    },
  };
}
```

### 2. Widget-Side (React Component)

Access the session ID from `window.openai.toolResponseMetadata`:

```typescript
import { useEffect, useState } from "react";

function MyWidget() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Access the session ID from the runtime
    const meta = window.openai?.toolResponseMetadata;
    if (meta?.widgetSessionId) {
      setSessionId(meta.widgetSessionId);
    }
  }, []);

  // Use sessionId for state management, API calls, etc.
}
```

### 3. Using with `callTool`

When making subsequent tool calls from the widget, include the session ID:

```typescript
async function addToCart(item: Item) {
  const result = await window.openai.callTool("add_to_cart", {
    item_id: item.id,
    quantity: 1,
  });

  // The response will include the same widgetSessionId
  // allowing state to persist across calls
}
```

## Use Cases

### Shopping Cart

```typescript
// Server-side: Maintain cart state per session
const carts = new Map<string, CartItem[]>();

async function handleAddToCart(args, { _meta }) {
  const sessionId = _meta?.widgetSessionId || generateSessionId();

  // Get or create cart for this session
  const cart = carts.get(sessionId) || [];
  cart.push(args.item);
  carts.set(sessionId, cart);

  return {
    content: [{ type: "text", text: `Added ${args.item.name} to cart` }],
    structuredContent: { cart, total: calculateTotal(cart) },
    _meta: { widgetSessionId: sessionId },
  };
}
```

### Multi-Step Workflows

```typescript
// Track workflow progress per session
const workflows = new Map<string, WorkflowState>();

async function handleWorkflowStep(args, { _meta }) {
  const sessionId = _meta?.widgetSessionId || generateSessionId();

  const state = workflows.get(sessionId) || { step: 0, data: {} };
  state.step++;
  state.data = { ...state.data, ...args };
  workflows.set(sessionId, state);

  return {
    content: [{ type: "text", text: `Completed step ${state.step}` }],
    structuredContent: { currentStep: state.step, progress: state.data },
    _meta: { widgetSessionId: sessionId },
  };
}
```

## Best Practices

1. **Always include `widgetSessionId` in `_meta`** - This ensures state persistence across tool calls.

2. **Generate session IDs server-side** - Use a secure random generator like `crypto.randomUUID()`.

3. **Handle missing session IDs gracefully** - The first tool call won't have a session ID, so generate one.

4. **Don't expose session IDs to the model** - Keep them in `_meta` which is hidden from the model.

5. **Clean up old sessions** - Implement session expiration to prevent memory leaks.

6. **Use session IDs for authorization** - Validate that tool calls come from the expected session.

## TypeScript Types

```typescript
interface ToolResponseMeta {
  widgetSessionId?: string;
  [key: string]: unknown;
}

interface ToolResponse {
  content: Array<{ type: "text"; text: string }>;
  structuredContent: Record<string, unknown>;
  _meta?: ToolResponseMeta;
}

// Extend window.openai types
declare global {
  interface Window {
    openai?: {
      toolResponseMetadata?: ToolResponseMeta;
      callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
      // ... other APIs
    };
  }
}
```

## Verify

- Use `console.log(window.openai?.toolResponseMetadata)` in the widget runtime and confirm `openai/widgetSessionId` exists.

## Related Documentation

- [Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [MCP Server Implementation](../../../platforms/mcp/README.md)
- [Widget Architecture](../../../docs/architecture/WIDGET_ARCHITECTURE.md)
