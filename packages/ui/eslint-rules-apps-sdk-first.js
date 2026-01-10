/**
 * ESLint Rule: Apps SDK UI first
 *
 * Disallow importing local equivalents when upstream Apps SDK UI components exist.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const appsSdkFirstRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Prefer Apps SDK UI re-exports when upstream components exist.",
      category: "Best Practices",
      recommended: "error",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowInPatterns: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferAppsSdk:
        "Use the Apps SDK UI re-export '{{preferred}}' instead of local '{{name}}'.",
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const allowInPatterns = options.allowInPatterns || [];

    const globToRegex = (pattern) => {
      let regex = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
      regex = regex.replace(/\*\*/g, ".*");
      regex = regex.replace(/(?<!\.)\*/g, "[^/]*");
      regex = regex.replace(/\?/g, ".");
      return new RegExp("^" + regex + "$");
    };

    const isAllowed = (filePath) => {
      return allowInPatterns.some((pattern) => {
        const regex = globToRegex(pattern);
        return regex.test(filePath);
      });
    };

    const upstreamMap = new Map();
    try {
      const cwd =
        typeof globalThis.process !== "undefined" && typeof globalThis.process.cwd === "function"
          ? globalThis.process.cwd()
          : ".";
      const matrixPath = resolve(cwd, "docs/design-system/COVERAGE_MATRIX.json");
      const raw = readFileSync(matrixPath, "utf8");
      const rows = JSON.parse(raw);
      for (const row of rows) {
        if (row.source === "upstream_reexport" && row.upstream && row.name) {
          upstreamMap.set(row.upstream, row.name);
        }
      }
    } catch {
      // Ignore if matrix not available; no-op enforcement.
    }

    return {
      ImportDeclaration(node) {
        const filename = context.filename.replace(/\\/g, "/");
        if (isAllowed(filename)) return;

        const source = node.source.value;
        if (typeof source !== "string") return;
        if (!source.startsWith("@astudio/ui")) return;

        for (const specifier of node.specifiers) {
          if (specifier.type !== "ImportSpecifier") continue;
          const importedName = specifier.imported.name;
          const preferred = upstreamMap.get(importedName);
          if (preferred && importedName !== preferred) {
            context.report({
              node: specifier,
              messageId: "preferAppsSdk",
              data: { name: importedName, preferred },
            });
          }
        }
      },
    };
  },
};

export default {
  rules: {
    "apps-sdk-first": appsSdkFirstRule,
  },
};
