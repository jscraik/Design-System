/**
 * ESLint Rule: Radix fallback only
 *
 * Disallow @radix-ui/* imports outside components/.../fallback/ paths.
 * unless an explicit waiver comment is present.
 */

const radixFallbackOnlyRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Restrict Radix imports to fallback components.",
      category: "Best Practices",
      recommended: "error",
    },
    schema: [],
    messages: {
      disallowed:
        "Radix primitives are only allowed under components/**/fallback/**. " +
        "Move this component to a fallback directory or add a waiver comment.",
    },
  },
  create(context) {
    const filename = context.filename.replace(/\\/g, "/");
    const isFallbackPath = filename.includes("/fallback/");
    const comments = context.getSourceCode().getAllComments();
    const waiverRegex = /@astudio-waiver\s+radix-fallback:\s*.+\(expires\s+\d{4}-\d{2}-\d{2}\)/i;
    const hasWaiver = comments.some((comment) => waiverRegex.test(comment.value));

    return {
      ImportDeclaration(node) {
        if (isFallbackPath || hasWaiver) return;
        const source = node.source.value;
        if (typeof source === "string" && source.startsWith("@radix-ui/")) {
          context.report({ node, messageId: "disallowed" });
        }
      },
    };
  },
};

export default {
  rules: {
    "radix-fallback-only": radixFallbackOnlyRule,
  },
};
