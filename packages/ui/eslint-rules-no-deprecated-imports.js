/**
 * ESLint Rule: No Deprecated Imports
 *
 * Prevents importing from deprecated or archived package paths.
 * Helps maintain clean architecture by preventing use of old patterns.
 *
 * Rationale:
 * - Some packages are archived but kept for reference
 * - Temp directories should never be imported by production code
 * - Deprecated exports should migrate to new locations
 *
 * Deprecated Patterns:
 * - _temp directories - Archived Figma exports (reference only)
 * - _temp_import - Temporary import structure
 * - @chatui/ui/dev - Dev-only exports, not for production
 */

const noDeprecatedImportsRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow imports from deprecated package paths and archived code.",
      category: "Best Practices",
      recommended: "error",
    },
    schema: [
      {
        type: "object",
        properties: {
          deprecatedPatterns: {
            type: "array",
            items: { type: "string" },
            description:
              "Array of import patterns to disallow (supports wildcards)",
          },
          deprecatedPaths: {
            type: "array",
            items: { type: "string" },
            description: "Array of specific import paths to disallow",
          },
          customMessages: {
            type: "object",
            additionalProperties: { type: "string" },
            description:
              "Custom error messages for specific deprecated imports",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      deprecatedImport:
        "Import from '{{source}}' is deprecated. {{message}}",
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const deprecatedPatterns = options.deprecatedPatterns || [
      "**/_temp/**",
      "**/_temp_import/**",
      "**/node_modules/**/*.temp/**",
    ];
    const deprecatedPaths = options.deprecatedPaths || [];
    const customMessages = options.customMessages || {
      "@chatui/ui/dev":
        "Dev-only export. Use @chatui/ui/* or @chatui/ui/experimental outside local harnesses.",
    };

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

    const checkSource = (node, source) => {
      // Check deprecated paths
      for (const deprecatedPath of deprecatedPaths) {
        if (source === deprecatedPath || source.startsWith(deprecatedPath + "/")) {
          context.report({
            node,
            messageId: "deprecatedImport",
            data: {
              source,
              message:
                customMessages[source] ||
                `This import path is deprecated and should not be used.`,
            },
          });
          return;
        }
      }

      // Check deprecated patterns
      for (const pattern of deprecatedPatterns) {
        const regex = globToRegex(pattern);
        if (regex.test(source)) {
          context.report({
            node,
            messageId: "deprecatedImport",
            data: {
              source,
              message: `This import path matches the deprecated pattern '${pattern}'.`,
            },
          });
          return;
        }
      }
    };

    return {
      ImportDeclaration(node) {
        checkSource(node, node.source.value);
      },
      ExportNamedDeclaration(node) {
        if (node.source) checkSource(node, node.source.value);
      },
      ExportAllDeclaration(node) {
        if (node.source) checkSource(node, node.source.value);
      },
    };
  },
};

export default {
  rules: {
    "no-deprecated-imports": noDeprecatedImportsRule,
  },
};
