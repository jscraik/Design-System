/**
 * Testing utilities for components
 */
import * as React from "react";

/**
 * Test wrapper that provides necessary context
 */
export function TestWrapper({ children }: { children: React.ReactNode }) {
  return <div className="dark bg-foundation-bg-dark-1">{children}</div>;
}

/**
 * Mock data generators for testing
 */
export const mockData = {
  models: [
    { name: "GPT-4o", shortName: "4o", description: "Fast and efficient" },
    { name: "GPT-4", shortName: "4", description: "Most capable" },
    { name: "GPT-3.5 Turbo", shortName: "3.5", description: "Quick responses" },
  ],

  messages: [
    {
      id: "1",
      role: "user" as const,
      content: "Hello, how are you?",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "assistant" as const,
      content: "I'm doing well, thank you! How can I help you today?",
      timestamp: new Date(),
    },
  ],

  conversations: [
    { id: "1", title: "General Chat", lastMessage: "Hello there!" },
    { id: "2", title: "Code Review", lastMessage: "Let's look at this function..." },
    { id: "3", title: "Project Planning", lastMessage: "What are the next steps?" },
  ],
};

/**
 * Accessibility testing helpers
 */
export const a11y = {
  /**
   * Check if element has proper ARIA attributes
   */
  hasAriaLabel: (element: Element): boolean => {
    return element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby");
  },

  /**
   * Check if interactive element is keyboard accessible
   */
  isKeyboardAccessible: (element: Element): boolean => {
    const tabIndex = element.getAttribute("tabindex");
    const role = element.getAttribute("role");
    const tagName = element.tagName.toLowerCase();

    // Interactive elements that are naturally focusable
    const interactiveElements = ["button", "input", "select", "textarea", "a"];

    return (
      interactiveElements.includes(tagName) ||
      (tabIndex !== null && parseInt(tabIndex) >= 0) ||
      role === "button" ||
      role === "link"
    );
  },
};

/**
 * Performance testing helpers
 */
export const perf = {
  /**
   * Measure component render time
   */
  measureRender: async (renderFn: () => void): Promise<number> => {
    const start = performance.now();
    renderFn();
    // Wait for next frame
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const end = performance.now();
    return end - start;
  },
};
