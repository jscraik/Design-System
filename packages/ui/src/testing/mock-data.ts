/**
 * Mock Data
 *
 * Sample data for testing ChatUI components.
 * Provides realistic test data that matches production schemas.
 */

import type { MockMessage, MockThread } from "./host-mock";

/**
 * Mock user data
 */
export const mockUsers = {
  standard: {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
  },
  premium: {
    id: "user-456",
    name: "Premium User",
    email: "premium@example.com",
  },
};

/**
 * Mock model data
 */
export const mockModels = {
  gpt4: {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
  },
  gpt35: {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
  },
  claude: {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic",
  },
};

/**
 * Mock messages
 */
export const mockMessages: MockMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Hello, how are you?",
    createdAt: Date.now() - 10000,
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "I'm doing well, thank you! How can I help you today?",
    createdAt: Date.now() - 9000,
  },
  {
    id: "msg-3",
    role: "user",
    content: "Can you explain React hooks?",
    createdAt: Date.now() - 8000,
  },
  {
    id: "msg-4",
    role: "assistant",
    content:
      "React hooks are functions that let you use state and other React features in functional components...",
    createdAt: Date.now() - 7000,
  },
];

/**
 * Mock threads
 */
export const mockThreads: MockThread[] = [
  {
    id: "thread-1",
    title: "React Hooks Discussion",
    messages: [mockMessages[0], mockMessages[1], mockMessages[2], mockMessages[3]],
    createdAt: Date.now() - 10000,
    updatedAt: Date.now() - 7000,
  },
  {
    id: "thread-2",
    title: "TypeScript Tips",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "What's a utility type?",
        createdAt: Date.now() - 5000,
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          "TypeScript utility types are built-in types that help with common type transformations...",
        createdAt: Date.now() - 4000,
      },
    ],
    createdAt: Date.now() - 5000,
    updatedAt: Date.now() - 4000,
  },
  {
    id: "thread-3",
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

/**
 * Mock settings
 */
export const mockSettings = {
  theme: "dark",
  fontSize: "medium",
  streaming: true,
  model: "gpt-4",
  language: "en",
};

/**
 * Mock configuration data
 */
export const mockConfig = {
  chat: {
    maxMessages: 50,
    streamingEnabled: true,
    typingIndicator: true,
  },
  ui: {
    showAvatars: true,
    showTimestamps: true,
    compactMode: false,
  },
  features: {
    voiceInput: false,
    imageUpload: true,
    codeHighlight: true,
  },
};

/**
 * Helper to create a mock user message
 */
export function createUserMessage(content: string): MockMessage {
  return {
    id: `msg-${Date.now()}`,
    role: "user",
    content,
    createdAt: Date.now(),
  };
}

/**
 * Helper to create a mock assistant message
 */
export function createAssistantMessage(content: string): MockMessage {
  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content,
    createdAt: Date.now(),
  };
}

/**
 * Helper to create a mock thread
 */
export function createThread(
  title: string,
  messages: MockMessage[] = []
): MockThread {
  return {
    id: `thread-${Date.now()}`,
    title,
    messages,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Mock error responses
 */
export const mockErrors = {
  network: {
    message: "Network error: Unable to reach the server",
    code: "NETWORK_ERROR",
  },
  auth: {
    message: "Authentication failed: Invalid credentials",
    code: "AUTH_ERROR",
  },
  rateLimit: {
    message: "Rate limit exceeded: Please try again later",
    code: "RATE_LIMIT_ERROR",
  },
};
