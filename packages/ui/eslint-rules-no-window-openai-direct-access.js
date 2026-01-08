/**
 * ESLint Rule: No Direct window.openai Access
 *
 * Prevents direct access to window.openai in production code.
 * All ChatGPT environment access should go through the runtime host abstraction.
 *
 * Rationale:
 * - The runtime package provides a host abstraction layer
 * - Direct window.openai access creates tight coupling to ChatGPT
 * - Using createEmbeddedHost() enables testing and standalone modes
 * - Maintains host-agnostic components in @chatui/ui
 *
 * Allowed:
 * - packages/runtime (implements the host abstraction)
 * - platforms/mcp (integration harness)
 * - packages/widgets (widget bundles that embed in ChatGPT)
 * - Test files with mocks
 *
 * Disallowed:
 * - packages/ui (should be host-agnostic)
 */

const noWindowOpenaiDirectAccessRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow direct window.openai access. Use the runtime host abstraction instead.",
      category: "Best Practices",
      recommended: "error",
      url: "https://github.com/chatui/chatui/blob/main/CLAUDE.md#host-adapter-pattern",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowInPatterns: {
            type: "array",
            items: { type: "string" },
            description:
              "Array of glob patterns to allow window.openai access in",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      directAccess:
        "Direct access to 'window.openai' is not allowed. Use the runtime host abstraction instead. " +
        "Import { createEmbeddedHost } from '@chatui/runtime' for ChatGPT apps, " +
        "or { createStandaloneHost } for standalone mode.",
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const allowInPatterns = options.allowInPatterns || [];

    // Convert glob pattern to regex
    const globToRegex = (pattern) => {
      // Escape special regex characters except for * and ?
      let regex = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");

      // Handle ** (matches any number of directories)
      regex = regex.replace(/\*\*/g, ".*");

      // Handle * (matches any number of non-separator characters)
      regex = regex.replace(/(?<!\.)\*/g, "[^/]*");

      // Handle ? (matches one character)
      regex = regex.replace(/\?/g, ".");

      return new RegExp("^" + regex + "$");
    };

    // Simple glob matching
    const isAllowed = (filePath) => {
      return allowInPatterns.some((pattern) => {
        const regex = globToRegex(pattern);
        return regex.test(filePath);
      });
    };

    return {
      MemberExpression(node) {
        if (isAllowed(context.filename)) return;

        // Check for window.openai
        if (
          node.object.type === "MemberExpression" &&
          node.object.object.type === "Identifier" &&
          node.object.object.name === "window" &&
          node.object.property.type === "Identifier" &&
          node.object.property.name === "openai"
        ) {
          context.report({
            node,
            messageId: "directAccess",
          });
        }
      },
    };
  },
};

export default {
  rules: {
    "no-window-openai-direct-access": noWindowOpenaiDirectAccessRule,
  },
};
