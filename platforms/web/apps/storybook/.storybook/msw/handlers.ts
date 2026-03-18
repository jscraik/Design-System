/**
 * Shared MSW handler definitions for Storybook stories.
 *
 * Usage in a story:
 * ```ts
 * import { http, HttpResponse } from "msw";
 * import { handlers } from ".storybook/msw/handlers";
 *
 * export const LoadingState: Story = {
 *   parameters: {
 *     msw: {
 *       handlers: [handlers.messages.loading],
 *     },
 *   },
 * };
 * ```
 *
 * Pattern guide:
 * - Keep handlers small and composable — one export per data state
 * - Prefer realistic shapes over minimal ones; agents use these for context
 * - Use `HttpResponse.json()` for typed JSON, `new HttpResponse(null, { status })` for empty
 * - Export raw handler arrays for use in `parameters.msw.handlers`
 */

import { HttpResponse, http } from "msw";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// ─── FIXTURES ─────────────────────────────────────────────────────────────────

export const fixtures = {
  messages: {
    single: (): Message[] => [
      {
        id: "msg-1",
        role: "user",
        content: "Hello, can you help me with my design system?",
        createdAt: new Date("2026-03-15T10:00:00Z").toISOString(),
      },
    ],

    conversation: (): Message[] => [
      {
        id: "msg-1",
        role: "user",
        content: "Hello, can you help me with my design system?",
        createdAt: new Date("2026-03-15T10:00:00Z").toISOString(),
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "Of course! I can help you build a robust design system. What aspect would you like to focus on — tokens, components, or documentation?",
        createdAt: new Date("2026-03-15T10:00:05Z").toISOString(),
      },
      {
        id: "msg-3",
        role: "user",
        content: "Let's start with component stories and interaction testing.",
        createdAt: new Date("2026-03-15T10:00:30Z").toISOString(),
      },
    ],

    long: (): Message[] =>
      Array.from({ length: 20 }, (_, i) => ({
        id: `msg-${i + 1}`,
        role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
        content: i % 2 === 0 ? `User message ${i + 1}` : `Assistant response ${i + 1}`,
        createdAt: new Date(Date.now() - (20 - i) * 30000).toISOString(),
      })),
  },
};

// ─── HANDLERS ─────────────────────────────────────────────────────────────────

export const handlers = {
  /** GET /api/messages → 200 with realistic conversation data */
  messages: {
    success: http.get("/api/messages", () => HttpResponse.json(fixtures.messages.conversation())),

    /** GET /api/messages → 200 with empty array (no messages yet) */
    empty: http.get("/api/messages", () => HttpResponse.json([] as Message[])),

    /** GET /api/messages → delays 2s to test loading states */
    loading: http.get("/api/messages", async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return HttpResponse.json(fixtures.messages.conversation());
    }),

    /** GET /api/messages → 500 server error */
    error: http.get(
      "/api/messages",
      () => new HttpResponse(null, { status: 500, statusText: "Internal Server Error" }),
    ),

    /** GET /api/messages → 401 unauthorised */
    unauthorized: http.get(
      "/api/messages",
      () => new HttpResponse(null, { status: 401, statusText: "Unauthorised" }),
    ),
  },

  /** POST /api/messages → 201 with new message */
  sendMessage: {
    success: http.post("/api/messages", async ({ request }) => {
      const body = (await request.json()) as { content: string };
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: body.content,
        createdAt: new Date().toISOString(),
      };
      return HttpResponse.json(newMessage, { status: 201 });
    }),

    /** POST /api/messages → 429 rate limited */
    rateLimited: http.post(
      "/api/messages",
      () =>
        new HttpResponse(null, {
          status: 429,
          statusText: "Too Many Requests",
          headers: { "Retry-After": "60" },
        }),
    ),
  },

  /** SSE /api/stream → streaming token response */
  stream: {
    success: http.get("/api/stream", () => {
      const tokens = ["Hello", " from", " the", " design", " system", "!"];
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for (const token of tokens) {
            await new Promise((r) => setTimeout(r, 100));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });
      return new HttpResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }),
  },

  /** GET /api/settings → user settings */
  settings: {
    success: http.get("/api/settings", () =>
      HttpResponse.json({
        theme: "dark",
        language: "en",
        notifications: true,
        model: "gpt-5.4",
      }),
    ),
  },
};

// ─── PRESET COLLECTIONS ───────────────────────────────────────────────────────
// Use these in `parameters.msw.handlers` for common scenario compositions.

/** All happy-path handlers — for "default" stories */
export const happyPathHandlers = [
  handlers.messages.success,
  handlers.sendMessage.success,
  handlers.settings.success,
];

/** Simulate a new user with no messages */
export const emptyStateHandlers = [
  handlers.messages.empty,
  handlers.sendMessage.success,
  handlers.settings.success,
];

/** Simulate slow network */
export const slowNetworkHandlers = [handlers.messages.loading, handlers.settings.success];

/** Simulate a network failure */
export const errorHandlers = [handlers.messages.error];
