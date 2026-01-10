/**
 * ESLint Rule: UI Subpath Imports
 *
 * Enforces that @astudio/ui imports only use published subpaths
 * (prevents deep/internal imports that bypass the package surface).
 */

const ALLOWED_SUBPATHS = new Set([
  "app",
  "base",
  "chat",
  "data-display",
  "dev",
  "experimental",
  "feedback",
  "icons",
  "modals",
  "navigation",
  "overlays",
  "settings",
  "showcase",
  "styles.css",
  "templates",
]);

const uiSubpathImportsRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require @astudio/ui imports to use published subpaths (no deep/internal imports).",
      category: "Best Practices",
      recommended: "error",
      url: "https://github.com/your-repo/blob/main/docs/architecture/repo-map.md",
    },
    schema: [],
    messages: {
      disallowedSubpath:
        "Invalid @astudio/ui subpath '{{subpath}}'. Use a published entry point ({{allowed}}).",
      deepImport:
        "Deep import '{{source}}' is not allowed. Import only from published @astudio/ui subpaths.",
    },
  },
  create(context) {
    const allowedList = Array.from(ALLOWED_SUBPATHS).join(", ");

    const checkSource = (node, source) => {
      if (source === "@astudio/ui") return;
      if (!source.startsWith("@astudio/ui/")) return;

      const subpath = source.slice("@astudio/ui/".length);
      if (!subpath) return;

      if (subpath.includes("/")) {
        context.report({
          node,
          messageId: "deepImport",
          data: { source },
        });
        return;
      }

      if (!ALLOWED_SUBPATHS.has(subpath)) {
        context.report({
          node,
          messageId: "disallowedSubpath",
          data: { subpath, allowed: allowedList },
        });
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
    "ui-subpath-imports": uiSubpathImportsRule,
  },
};
