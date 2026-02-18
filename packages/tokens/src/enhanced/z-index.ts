/**
 * @design-studio/tokens - Enhanced Z-Index
 *
 * Semantic z-index layers inspired by Geist design system.
 * Prevents z-index conflicts and provides clear stacking context.
 *
 * Usage:
 *   import { zIndex } from "@design-studio/tokens";
 *   <div style={{ zIndex: zIndex.modal }}>
 *
 * Layers (lowest to highest):
 * - behind: -1 - Behind content (e.g., background patterns)
 * - base: 0 - Default stacking context
 * - raised: 1 - Slightly raised (e.g., cards with shadows)
 * - dropdown: 10 - Dropdown menus
 * - sticky: 20 - Sticky headers
 * - header: 50 - Fixed headers
 * - modalBackdrop: 100 - Modal backdrop
 * - modal: 101 - Modal content
 * - popover: 200 - Popovers and tooltips
 * - tooltip: 1000 - Tooltips (highest)
 * - maximum: 99999 - Emergency override (avoid use)
 */

/**
 * Z-index layers as CSS custom properties
 */
export const zIndexCSSVars = {
  "--ds-z-behind": "-1",
  "--ds-z-base": "0",
  "--ds-z-raised": "1",
  "--ds-z-dropdown": "10",
  "--ds-z-sticky": "20",
  "--ds-z-header": "50",
  "--ds-z-modal-backdrop": "100",
  "--ds-z-modal": "101",
  "--ds-z-popover": "200",
  "--ds-z-tooltip": "1000",
  "--ds-z-maximum": "99999",
} as const;

/**
 * Z-index layers for JavaScript/TypeScript usage
 */
export const zIndex = {
  behind: -1,
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  header: 50,
  modalBackdrop: 100,
  modal: 101,
  popover: 200,
  tooltip: 1000,
  maximum: 99999,
} as const;

/**
 * Z-index layer type
 */
export type ZIndexToken = keyof typeof zIndex;

/**
 * Helper to get z-index value
 */
export function getZIndex(token: ZIndexToken): number {
  return zIndex[token];
}
