/**
 * JSON Render integration for aStudio widgets.
 *
 * Provides a constrained catalog and component registry for AI-generated UIs.
 *
 * @see https://github.com/vercel-labs/json-render
 * @see docs/json-render/README.md for complete documentation
 */
export { astudioCatalog, type AStudioCatalog } from "./catalog";
export { astudioRegistry } from "./registry";
export {
  countElementsByType,
  createMetricTree,
  createMetricsGrid,
  formatTree,
  getAllElementIds,
  getTreeDepth,
  mergeTreesIntoStack,
  validateTree,
} from "./utils";
