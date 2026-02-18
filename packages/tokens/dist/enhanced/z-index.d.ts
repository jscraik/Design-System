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
export declare const zIndexCSSVars: {
    readonly "--ds-z-behind": "-1";
    readonly "--ds-z-base": "0";
    readonly "--ds-z-raised": "1";
    readonly "--ds-z-dropdown": "10";
    readonly "--ds-z-sticky": "20";
    readonly "--ds-z-header": "50";
    readonly "--ds-z-modal-backdrop": "100";
    readonly "--ds-z-modal": "101";
    readonly "--ds-z-popover": "200";
    readonly "--ds-z-tooltip": "1000";
    readonly "--ds-z-maximum": "99999";
};
/**
 * Z-index layers for JavaScript/TypeScript usage
 */
export declare const zIndex: {
    readonly behind: -1;
    readonly base: 0;
    readonly raised: 1;
    readonly dropdown: 10;
    readonly sticky: 20;
    readonly header: 50;
    readonly modalBackdrop: 100;
    readonly modal: 101;
    readonly popover: 200;
    readonly tooltip: 1000;
    readonly maximum: 99999;
};
/**
 * Z-index layer type
 */
export type ZIndexToken = keyof typeof zIndex;
/**
 * Helper to get z-index value
 */
export declare function getZIndex(token: ZIndexToken): number;
//# sourceMappingURL=z-index.d.ts.map