/**
 * ESLint Rule: No console in Production
 *
 * Prevents console.log, console.warn, console.error, etc. in production code.
 * Debugging statements should be removed or replaced with proper logging.
 *
 * Rationale:
 * - Console statements in production code clutter the browser console
 * - They may expose sensitive information
 * - A proper logging framework should be used for production debugging
 *
 * Allowed: console methods in tests, config files, and specific dev contexts
 * Disallowed: console.log/warn/error/debug in production UI components
 */

const noConsoleInProductionRule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow console methods in production code. Use a proper logging framework instead.",
      category: "Best Practices",
      recommended: "warn",
    },
    schema: [
      {
        type: "object",
        properties: {
          allow: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unexpected:
        "Unexpected console.{{method}}(). Use a proper logging framework or remove this statement.",
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const allowedMethods = new Set(options.allow || []);

    // Console methods to check
    const consoleMethods = new Set([
      "log",
      "warn",
      "error",
      "info",
      "debug",
      "trace",
      "assert",
      "dir",
      "dirxml",
      "table",
      "group",
      "groupCollapsed",
      "groupEnd",
      "clear",
      "count",
      "countReset",
      "profile",
      "profileEnd",
      "time",
      "timeLog",
      "timeEnd",
      "timeStamp",
      "context",
    ]);

    return {
      MemberExpression(node) {
        // Check for console.method() calls
        if (
          node.object.type === "Identifier" &&
          node.object.name === "console" &&
          node.property.type === "Identifier" &&
          consoleMethods.has(node.property.name) &&
          !allowedMethods.has(node.property.name)
        ) {
          // Check if this is a call (parent is CallExpression)
          if (node.parent.type === "CallExpression" && node.parent.callee === node) {
            context.report({
              node: node.parent,
              messageId: "unexpected",
              data: { method: node.property.name },
            });
          }
        }
      },
    };
  },
};

export default {
  rules: {
    "no-console-in-production": noConsoleInProductionRule,
  },
};
