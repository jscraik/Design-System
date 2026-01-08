/**
 * Mock Host Adapter
 *
 * Provides a mock implementation of the Host interface for testing.
 * Enables testing of components that depend on the runtime host abstraction.
 */

import type { Host } from "@chatui/runtime";

/**
 * Mock message data for testing
 */
export interface MockMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: number;
}

/**
 * Mock thread data for testing
 */
export interface MockThread {
  id: string;
  title: string;
  messages: MockMessage[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Mock host configuration
 */
export interface MockHostConfig {
  /** Mock messages to return */
  messages?: MockMessage[];
  /** Mock threads to return */
  threads?: MockThread[];
  /** Mock user info */
  user?: {
    id: string;
    name: string;
    email?: string;
  };
  /** Mock model info */
  model?: {
    id: string;
    name: string;
    provider?: string;
  };
  /** Mock API responses */
  api?: {
    chat?: {
      completions: (messages: MockMessage[]) => Promise<{
        message: MockMessage;
      }>;
    };
  };
}

/**
 * Create a mock host for testing
 */
export function createMockHost(config: MockHostConfig = {}): Host {
  const {
    messages = [],
    threads = [],
    user = { id: "test-user", name: "Test User" },
    model = { id: "gpt-4", name: "GPT-4" },
    api = {},
  } = config;

  return {
    // Environment info
    isEmbedded: true,
    isStandalone: false,
    environment: "chatgpt",

    // User info
    getUser: async () => user,

    // Model info
    getModel: async () => model,
    setModel: async (modelId) => ({
      id: modelId,
      name: `Model ${modelId}`,
    }),

    // Thread management
    getThreads: async () => threads,
    getThread: async (threadId) =>
      threads.find((t) => t.id === threadId) || null,
    createThread: async () => ({
      id: `thread-${Date.now()}`,
      title: "New Thread",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
    deleteThread: async (threadId) => {
      // Mock deletion
      return true;
    },
    updateThread: async (threadId, updates) => {
      const thread = threads.find((t) => t.id === threadId);
      return thread ? { ...thread, ...updates } : null;
    },

    // Message management
    getMessages: async (threadId) => {
      const thread = threads.find((t) => t.id === threadId);
      return thread?.messages || messages;
    },
    sendMessage: async (threadId, content) => {
      const newMessage: MockMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        createdAt: Date.now(),
      };

      if (api.chat?.completions) {
        return api.chat.completions([newMessage]);
      }

      return {
        message: {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `Mock response to: ${content}`,
          createdAt: Date.now(),
        },
      };
    },

    // Settings
    getSettings: async () => ({}),
    setSetting: async (key, value) => ({ [key]: value }),

    // Events (no-op for tests)
    on: () => {},
    off: () => {},
    emit: () => {},
  };
}

/**
 * Create a mock standalone host (for testing standalone mode)
 */
export function createMockStandaloneHost(config: MockHostConfig = {}): Host {
  return {
    ...createMockHost(config),
    isEmbedded: false,
    isStandalone: true,
    environment: "standalone",
  };
}

/**
 * Create a mock host with specific API responses
 */
export function createMockHostWithApi(apiConfig: MockHostConfig["api"] = {}) {
  return createMockHost({ api: apiConfig });
}
