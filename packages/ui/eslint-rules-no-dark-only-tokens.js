/**
 * ESLint Rule: No Dark-Only Tokens
 *
 * Prevents dark-only token usage in media mode (darkMode: "media").
 * When using media mode, all dark-mode classes must have a light-mode counterpart.
 *
 * ❌ BAD: `dark:text-white` - has no light mode, breaks in light mode
 * ✅ GOOD: `text-foundation-text-light-primary dark:text-white` - has both
 *
 * Usage:
 *   {
 *     "plugins": { "./eslint-rules-no-dark-only-tokens" },
 *     "rules": { "@astudio/no-dark-only-tokens": "error" }
 *   }
 */

/**
 * Foundation token prefixes that indicate proper light/dark pairing
 * If a class uses these, it's considered properly paired
 */
const FOUNDATION_TOKEN_PREFIXES = [
  // Background colors
  "bg-foundation-bg-",
  "bg-foundation-accent-",
  "bg-foundation-surface-",
  // Text colors
  "text-foundation-text-",
  "text-foundation-icon-",
  // Border colors
  "border-foundation-",
  // Other foundation tokens
  "shadow-foundation-",
  "ring-foundation-",
];

/**
 * Known "always valid" dark tokens that don't need light mode
 * (e.g., white/black that are intentionally dark-only)
 */
const VALID_DARK_ONLY_TOKENS = [
  "dark:divide-white/",
  "dark:divide-black/",
  "dark:border-white/",
  "dark:border-black/",
  "dark:bg-white/",
  "dark:bg-black/",
  "dark:text-white/",
  "dark:text-black/",
  "dark:shadow-white/",
  "dark:shadow-black/",
  "dark:ring-white/",
  "dark:ring-black/",
];

/**
 * Check if a dark token is in the whitelist of valid dark-only tokens
 */
function isValidDarkOnlyToken(token) {
  return VALID_DARK_ONLY_TOKENS.some((valid) => token.startsWith(valid));
}

/**
 * Check if a class is a foundation token (properly paired)
 */
function isFoundationToken(className) {
  return FOUNDATION_TOKEN_PREFIXES.some((prefix) => className.includes(prefix));
}

/**
 * Check if a class string has dark tokens without proper light mode pairing
 * Returns array of problematic dark tokens
 */
function findUnpairedDarkTokens(classValue) {
  // Split by whitespace but handle complex cases
  const tokens = classValue.split(/\s+/);
  const darkTokens = [];
  const lightTokens = new Set();

  // First pass: collect all dark and light tokens
  for (const token of tokens) {
    if (token.startsWith("dark:")) {
      const darkToken = token.slice(5); // Remove "dark:" prefix (length is 5)
      darkTokens.push({ original: token, token: darkToken });
    } else {
      lightTokens.add(token);
    }
  }

  // Second pass: find unpaired dark tokens
  const unpaired = [];
  for (const { original, token } of darkTokens) {
    // Skip if it's a known valid dark-only token
    if (isValidDarkOnlyToken(original)) {
      continue;
    }

    // Check if there's a corresponding light token
    // Priority 1: Foundation token (e.g., text-foundation-text-light-primary pairs with dark:text-white)
    // Priority 2: Utility token with same property (e.g., text-gray-900 pairs with dark:text-white)
    const hasLightPair = Array.from(lightTokens).some((lightToken) => {
      // Same property (before the value)
      const darkProp = token.split("-")[0]; // e.g., "text" from "text-white"
      const lightProp = lightToken.split("-")[0];

      // Properties must match (e.g., "text" === "text", "hover:bg" === "hover:bg")
      if (darkProp !== lightProp) return false;

      // If light token is a foundation token, it's a valid pair
      if (isFoundationToken(lightToken)) return true;

      // If both are utility tokens with same property, it's a valid pair
      return true;
    });

    if (!hasLightPair) {
      unpaired.push(original);
    }
  }

  return unpaired;
}

/**
 * The ESLint rule implementation
 */
const noDarkOnlyTokensRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Prevent dark-only token usage when using media mode dark mode",
      category: "Best Practices",
      recommended: "error",
      url: "https://github.com/your-repo/blob/main/docs/DARK_MODE_TOKENS.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          // Allow exceptions for specific patterns
          allowedPatterns: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      darkOnlyToken:
        "Dark-only token '{{token}}' detected. When using media mode (darkMode: 'media'), all dark mode classes must have a light mode counterpart. Use token pairs like: text-foundation-text-light-primary dark:text-{{color}} or {{light}} dark:{{dark}}",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedPatterns = options.allowedPatterns || [];

    /**
     * Check if a token should be allowed based on allowed patterns
     */
    function isAllowedPattern(token) {
      return allowedPatterns.some((pattern) => token.includes(pattern));
    }

    return {
      // Check JSX className attributes
      JSXAttribute(node) {
        if (node.name?.name !== "className") return;

        const value = node.value;
        if (!value) return;

        // Handle static className="..."
        if (value.type === "Literal") {
          const classValue = value.value;
          if (typeof classValue !== "string") return;

          const unpaired = findUnpairedDarkTokens(classValue);
          for (const token of unpaired) {
            if (isAllowedPattern(token)) continue;

            context.report({
              node,
              messageId: "darkOnlyToken",
              data: { token },
            });
          }
        }
        // Handle template literals className={`...`}
        else if (
          value.type === "JSXExpressionContainer" &&
          value.expression.type === "TemplateLiteral"
        ) {
          for (const quasi of value.expression.quasis) {
            const classValue = quasi.value.cooked;
            if (!classValue) continue;

            const unpaired = findUnpairedDarkTokens(classValue);
            for (const token of unpaired) {
              if (isAllowedPattern(token)) continue;

              context.report({
                node,
                messageId: "darkOnlyToken",
                data: { token },
              });
            }
          }
        }
        // Handle ternary operators
        else if (
          value.type === "JSXExpressionContainer" &&
          value.expression.type === "ConditionalExpression"
        ) {
          const checkExpression = (expr) => {
            if (expr.type === "Literal" && typeof expr.value === "string") {
              const unpaired = findUnpairedDarkTokens(expr.value);
              for (const token of unpaired) {
                if (isAllowedPattern(token)) continue;

                context.report({
                  node,
                  messageId: "darkOnlyToken",
                  data: { token },
                });
              }
            }
          };

          checkExpression(value.expression.consequent);
          checkExpression(value.expression.alternate);
        }
      },

      // Check clsx/cn function calls
      CallExpression(node) {
        if (
          node.callee?.type !== "Identifier" ||
          (node.callee.name !== "clsx" && node.callee.name !== "cn" && node.callee.name !== "cva")
        ) {
          return;
        }

        for (const arg of node.arguments) {
          let classValue = null;

          if (arg.type === "Literal") {
            classValue = arg.value;
          } else if (arg.type === "TemplateLiteral") {
            for (const quasi of arg.quasis) {
              if (quasi.value.cooked) {
                const unpaired = findUnpairedDarkTokens(quasi.value.cooked);
                for (const token of unpaired) {
                  if (isAllowedPattern(token)) continue;

                  context.report({
                    node: arg,
                    messageId: "darkOnlyToken",
                    data: { token },
                  });
                }
              }
            }
          }

          if (typeof classValue !== "string") continue;

          const unpaired = findUnpairedDarkTokens(classValue);
          for (const token of unpaired) {
            if (isAllowedPattern(token)) continue;

            context.report({
              node: arg,
              messageId: "darkOnlyToken",
              data: { token },
            });
          }
        }
      },
    };
  },
};

// ESM export for ESLint flat config
// Rule name: no-dark-only-tokens (used as plugin-name/rule-name)
export default {
  rules: {
    "no-dark-only-tokens": noDarkOnlyTokensRule,
  },
};
