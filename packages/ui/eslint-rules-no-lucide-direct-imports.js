/**
 * ESLint Rule: No Direct lucide-react Imports
 *
 * Enforces that all icon imports use the canonical icon system
 * (@chatui/ui/icons) instead of directly importing from lucide-react.
 * This ensures consistent icon styling and maintains the single source
 * of truth for icons across the codebase.
 *
 * Rationale:
 * - The ChatUI codebase has a comprehensive icon system with 350+ ChatGPT icons
 * - Direct lucide-react imports bypass this system and create inconsistency
 * - All icons should be imported from @chatui/ui/icons for:
 *   - Consistent styling with ChatGPT design system
 *   - Proper tree-shaking through centralized exports
 *   - Future-proofing for icon replacements
 *   - Clear icon namespace with Icon* prefix
 *
 * Allowed: import { IconCheckmark, IconSettings } from "@chatui/ui/icons"
 * Disallowed: import { Check, Settings } from "lucide-react"
 */

const noLucideDirectImportsRule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow direct imports from lucide-react. Use @chatui/ui/icons instead.",
      category: "Best Practices",
      recommended: "warn",
      url: "https://github.com/chatui/chatui/blob/main/packages/ui/src/icons/ICON_SYSTEM.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowInPatterns: {
            type: "array",
            items: { type: "string" },
            description:
              "Array of glob patterns to allow lucide-react imports in (e.g., ['**/node_modules/**'])",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      directImport:
        "Direct import from 'lucide-react' is not allowed. Import from '@chatui/ui/icons' instead. " +
        "See packages/ui/src/icons/ICON_SYSTEM.md for available icons.",
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

    const isAllowed = (filePath) => {
      return allowInPatterns.some((pattern) => {
        const regex = globToRegex(pattern);
        return regex.test(filePath);
      });
    };

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (source === "lucide-react" || source.startsWith("lucide-react/")) {
          if (!isAllowed(context.filename)) {
            context.report({
              node,
              messageId: "directImport",
              data: { source },
            });
          }
        }
      },
    };
  },
};

export default {
  rules: {
    "no-lucide-direct-imports": noLucideDirectImportsRule,
  },
};
