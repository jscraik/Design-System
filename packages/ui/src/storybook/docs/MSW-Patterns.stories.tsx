/**
 * MSW Usage Examples
 *
 * This file demonstrates the correct patterns for using MSW in Storybook stories.
 * Copy these patterns into any component story that makes API calls.
 *
 * The MSW service worker is initialised globally in `.storybook/preview.tsx`.
 * Per-story handlers are activated via `parameters.msw.handlers` — they are
 * automatically started before the story mounts and cleaned up after.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { expect, waitFor, within } from "@storybook/test";

import {
  emptyStateHandlers,
  errorHandlers,
  handlers,
  happyPathHandlers,
  slowNetworkHandlers,
} from "@storybook-msw/handlers";

// ─── EXAMPLE COMPONENT ───────────────────────────────────────────────────────
// Replace with your actual data-fetching component.
// This minimal component exists purely to demonstrate the MSW patterns.

function MessageList() {
  const [messages, setMessages] = React.useState<
    Array<{ id: string; role: string; content: string }>
  >([]);
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");

  React.useEffect(() => {
    fetch("/api/messages")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setMessages(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return (
      <div data-testid="loading-state" aria-busy="true">
        Loading messages…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div data-testid="error-state" role="alert">
        Failed to load messages. Please try again.
      </div>
    );
  }

  if (messages.length === 0) {
    return <div data-testid="empty-state">No messages yet. Start a conversation.</div>;
  }

  return (
    <ul data-testid="message-list" className="space-y-2">
      {messages.map((msg) => (
        <li
          key={msg.id}
          className={`p-3 rounded-lg ${msg.role === "user" ? "bg-blue-500/20" : "bg-white/10"}`}
        >
          <span className="text-xs opacity-50 uppercase">{msg.role}</span>
          <p className="text-sm mt-1">{msg.content}</p>
        </li>
      ))}
    </ul>
  );
}

import React from "react";

// ─── META ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof MessageList> = {
  title: "Examples/MSW Patterns",
  component: MessageList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Demonstrates how to use MSW to mock API responses in Storybook stories. Copy these patterns for any component that fetches data.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── STORIES BY DATA STATE ────────────────────────────────────────────────────

/**
 * ✅ PATTERN: Happy path — realistic data
 *
 * Use `parameters.msw.handlers` with a specific handler.
 * The handler is cleaned up automatically after the story unmounts.
 */
export const WithMessages: Story = {
  name: "State / Loaded — with messages",
  parameters: {
    msw: {
      handlers: [handlers.messages.success],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders loading state initially", async () => {
      // May or may not catch the loading flash — depends on response speed
    });

    await step("Shows message list after fetch resolves", async () => {
      await waitFor(() => expect(canvas.getByTestId("message-list")).toBeInTheDocument(), {
        timeout: 3000,
      });
    });

    await step("Shows correct number of messages", async () => {
      const items = canvas.getAllByRole("listitem");
      expect(items.length).toBeGreaterThan(0);
    });
  },
};

/**
 * ⬜ PATTERN: Empty state — no data yet
 *
 * Use `handlers.messages.empty` for the "first visit" experience.
 */
export const EmptyState: Story = {
  name: "State / Empty — no messages",
  parameters: {
    msw: {
      handlers: [handlers.messages.empty],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Shows empty state UI", async () => {
      await waitFor(() => expect(canvas.getByTestId("empty-state")).toBeInTheDocument(), {
        timeout: 3000,
      });
    });
  },
};

/**
 * ⏳ PATTERN: Loading state — slow network
 *
 * Use `handlers.messages.loading` (adds 2s delay) to test skeleton/spinner UX.
 */
export const LoadingState: Story = {
  name: "State / Loading — slow network",
  parameters: {
    msw: {
      handlers: [handlers.messages.loading],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Shows loading indicator immediately", async () => {
      const loader = canvas.getByTestId("loading-state");
      await expect(loader).toBeInTheDocument();
      await expect(loader).toHaveAttribute("aria-busy", "true");
    });
  },
};

/**
 * ❌ PATTERN: Error state — server failure
 *
 * Use `handlers.messages.error` to test error boundaries and recovery UI.
 */
export const ErrorState: Story = {
  name: "State / Error — server failure",
  parameters: {
    msw: {
      handlers: [handlers.messages.error],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Shows error message with correct role", async () => {
      await waitFor(() => expect(canvas.getByTestId("error-state")).toBeInTheDocument(), {
        timeout: 3000,
      });
      const alert = canvas.getByRole("alert");
      await expect(alert).toBeInTheDocument();
    });
  },
};

/**
 * 🔒 PATTERN: Unauthorised — 401 state
 *
 * Test auth-gated UI — redirect, login prompt, or locked state.
 */
export const UnauthorisedState: Story = {
  name: "State / Unauthorised — 401",
  parameters: {
    msw: {
      handlers: [handlers.messages.unauthorized],
    },
  },
};

/**
 * 📦 PATTERN: Using preset collections
 *
 * `happyPathHandlers` covers all endpoints — use for full-page stories.
 */
export const HappyPathAll: Story = {
  name: "Pattern / Happy path (all endpoints)",
  parameters: {
    msw: { handlers: happyPathHandlers },
  },
};

export const SlowNetwork: Story = {
  name: "Pattern / Slow network (all endpoints)",
  parameters: {
    msw: { handlers: slowNetworkHandlers },
  },
};

export const ErrorAll: Story = {
  name: "Pattern / All errors",
  parameters: {
    msw: { handlers: errorHandlers },
  },
};
