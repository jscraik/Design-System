/**
 * JSON Render Utilities
 *
 * Helper functions for working with json-render trees and components.
 */
import type { UITree } from "@json-render/core";

/**
 * Validate a UI tree structure.
 * Checks for common issues like missing keys, invalid references, etc.
 */
export function validateTree(tree: UITree): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check root exists
  if (!tree.root) {
    errors.push("Missing 'root' property");
  } else if (!tree.elements[tree.root]) {
    errors.push(`Root element '${tree.root}' not found in elements`);
  }

  // Check all elements
  for (const [id, element] of Object.entries(tree.elements)) {
    // Check key matches ID
    if (element.key !== id) {
      errors.push(`Element '${id}' has mismatched key '${element.key}'`);
    }

    // Check children references
    if (element.children) {
      for (const childId of element.children) {
        if (!tree.elements[childId]) {
          errors.push(`Element '${id}' references non-existent child '${childId}'`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get all element IDs in a tree (depth-first traversal).
 */
export function getAllElementIds(tree: UITree): string[] {
  const ids: string[] = [];
  const visited = new Set<string>();

  function traverse(elementId: string) {
    if (visited.has(elementId)) return;
    visited.add(elementId);
    ids.push(elementId);

    const element = tree.elements[elementId];
    if (element?.children) {
      for (const childId of element.children) {
        traverse(childId);
      }
    }
  }

  if (tree.root) {
    traverse(tree.root);
  }

  return ids;
}

/**
 * Count elements by type in a tree.
 */
export function countElementsByType(tree: UITree): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const element of Object.values(tree.elements)) {
    counts[element.type] = (counts[element.type] || 0) + 1;
  }

  return counts;
}

/**
 * Get tree depth (maximum nesting level).
 */
export function getTreeDepth(tree: UITree): number {
  function getDepth(elementId: string): number {
    const element = tree.elements[elementId];
    if (!element?.children || element.children.length === 0) {
      return 1;
    }

    const childDepths = element.children.map((childId) => getDepth(childId));
    return 1 + Math.max(...childDepths);
  }

  return tree.root ? getDepth(tree.root) : 0;
}

/**
 * Format a UI tree as a readable string (for debugging).
 */
export function formatTree(tree: UITree, indent = 0): string {
  const lines: string[] = [];

  function formatElement(elementId: string, level: number) {
    const element = tree.elements[elementId];
    if (!element) return;

    const prefix = "  ".repeat(level);
    const propsStr = JSON.stringify(element.props);
    lines.push(`${prefix}${element.type} (${elementId}) ${propsStr}`);

    if (element.children) {
      for (const childId of element.children) {
        formatElement(childId, level + 1);
      }
    }
  }

  if (tree.root) {
    formatElement(tree.root, indent);
  }

  return lines.join("\n");
}

/**
 * Create a simple metric tree (helper for quick prototyping).
 */
export function createMetricTree(
  label: string,
  value: number | string,
  format?: "currency" | "percent" | "number" | "duration",
): UITree {
  return {
    root: "metric-1",
    elements: {
      "metric-1": {
        key: "metric-1",
        type: "Metric",
        props: { label, value, format },
      },
    },
  };
}

/**
 * Create a metrics grid tree (helper for quick prototyping).
 */
export function createMetricsGrid(
  metrics: Array<{
    label: string;
    value: number | string;
    format?: "currency" | "percent" | "number" | "duration";
  }>,
  columns: "1" | "2" | "3" | "4" = "2",
): UITree {
  const elements: UITree["elements"] = {
    "grid-1": {
      key: "grid-1",
      type: "Grid",
      props: { columns, gap: "md" },
      children: metrics.map((_, i) => `metric-${i + 1}`),
    },
  };

  metrics.forEach((metric, i) => {
    elements[`metric-${i + 1}`] = {
      key: `metric-${i + 1}`,
      type: "Metric",
      props: metric,
    };
  });

  return {
    root: "grid-1",
    elements,
  };
}

/**
 * Merge multiple trees into a stack.
 */
export function mergeTreesIntoStack(
  trees: UITree[],
  direction: "vertical" | "horizontal" = "vertical",
): UITree {
  const elements: UITree["elements"] = {
    "stack-1": {
      key: "stack-1",
      type: "Stack",
      props: { direction, gap: "md" },
      children: trees.map((_, i) => `tree-${i + 1}`),
    },
  };

  trees.forEach((tree, i) => {
    // Prefix all element IDs to avoid conflicts
    const prefix = `tree-${i + 1}-`;
    for (const [id, element] of Object.entries(tree.elements)) {
      const newId = id === tree.root ? `tree-${i + 1}` : `${prefix}${id}`;
      elements[newId] = {
        ...element,
        key: newId,
        children: element.children?.map((childId) =>
          childId === tree.root ? `tree-${i + 1}` : `${prefix}${childId}`,
        ),
      };
    }
  });

  return {
    root: "stack-1",
    elements,
  };
}
