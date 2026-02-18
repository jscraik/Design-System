/**
 * ESLint Rule: No Raw Tokens
 *
 * Disallow raw hex colors and raw px spacing in inline styles.
 * Enforces usage of semantic tokens (CSS variables) for inline values.
 */

const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const PX_VALUE_REGEX = /\b\d+(?:\.\d+)?px\b/;
const TOKEN_VAR_REGEX = /var\(--foundation-/;

function isAllowedToken(value) {
  return TOKEN_VAR_REGEX.test(value);
}

function checkStringValue(context, node, value) {
  if (isAllowedToken(value)) return;

  if (HEX_COLOR_REGEX.test(value)) {
    context.report({
      node,
      message: "Raw hex colors are not allowed. Use semantic tokens (CSS variables) instead.",
    });
  }

  if (PX_VALUE_REGEX.test(value)) {
    context.report({
      node,
      message: "Raw px values are not allowed in inline styles. Use tokenized spacing values.",
    });
  }
}

const noRawTokensRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw hex colors and px values in inline styles.",
      category: "Best Practices",
      recommended: "error",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name?.name !== "style") return;

        if (!node.value) return;

        if (node.value.type === "Literal" && typeof node.value.value === "string") {
          checkStringValue(context, node, node.value.value);
          return;
        }

        if (
          node.value.type === "JSXExpressionContainer" &&
          node.value.expression.type === "ObjectExpression"
        ) {
          for (const prop of node.value.expression.properties) {
            if (prop.type !== "Property") continue;
            const valueNode = prop.value;
            if (valueNode.type === "Literal" && typeof valueNode.value === "string") {
              checkStringValue(context, valueNode, valueNode.value);
            } else if (valueNode.type === "TemplateLiteral") {
              const raw = valueNode.quasis.map((quasi) => quasi.value.cooked ?? "").join("");
              if (raw) {
                checkStringValue(context, valueNode, raw);
              }
            }
          }
        }
      },
    };
  },
};

export default {
  rules: {
    "no-raw-tokens": noRawTokensRule,
  },
};
