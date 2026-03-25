/**
 * Shadow tokens with offsets, blur, and spread in px plus hex colors.
 *
 * ## Elevation scale
 * Prefer `elevation.*` tokens for general UI depth. They form a visually
 * distinct 7-step scale (xs → 2xl + inner). The legacy `card/pip/pill/close`
 * tokens are kept for backward compatibility and map to `elevation.lg`.
 *
 * ## Accessibility note
 * Shadows must not be the sole indicator of focus or state — always pair with
 * a border or colour change for high-contrast mode compatibility.
 */
/**
 * Semantic elevation scale.
 * Values are CSS shadow strings ready for use in `box-shadow`.
 * Alpha values are intentionally higher than Tailwind defaults (10%)
 * to ensure xs/sm are visually distinguishable on white backgrounds.
 */
export declare const elevation: {
    /** Hairline lift — table rows, subtle chips (6% alpha). */
    readonly xs: "0 1px 2px 0 rgba(0,0,0,0.06)";
    /** Card resting state — inputs, flat cards (12% alpha). */
    readonly sm: "0 1px 3px 0 rgba(0,0,0,0.12), 0 1px 2px -1px rgba(0,0,0,0.08)";
    /** Dropdown menus, context menus (14% alpha). */
    readonly md: "0 4px 6px -1px rgba(0,0,0,0.14), 0 2px 4px -2px rgba(0,0,0,0.10)";
    /** Popover, tooltip, floating panels (14% alpha). */
    readonly lg: "0 10px 15px -3px rgba(0,0,0,0.14), 0 4px 6px -4px rgba(0,0,0,0.10)";
    /** Side sheets, large popovers (16% alpha). */
    readonly xl: "0 20px 25px -5px rgba(0,0,0,0.16), 0 8px 10px -6px rgba(0,0,0,0.10)";
    /** Full-screen dialogs, modals (28% alpha). */
    readonly "2xl": "0 25px 50px -12px rgba(0,0,0,0.28)";
    /** Inset — recessed inputs, pressed states. */
    readonly inner: "inset 0 2px 4px 0 rgba(0,0,0,0.08)";
};
export type ElevationToken = keyof typeof elevation;
export declare const shadowTokens: {
    readonly card: readonly [{
        readonly color: "rgba(0 0 0 / 10%)";
        readonly offsetX: 0;
        readonly offsetY: 10;
        readonly blur: 15;
        readonly spread: -3;
    }, {
        readonly color: "rgba(0 0 0 / 10%)";
        readonly offsetX: 0;
        readonly offsetY: 4;
        readonly blur: 6;
        readonly spread: -4;
    }];
    readonly pip: readonly [{
        readonly color: "rgba(0 0 0 / 10%)";
        readonly offsetX: 0;
        readonly offsetY: 10;
        readonly blur: 15;
        readonly spread: -3;
    }, {
        readonly color: "rgba(0 0 0 / 10%)";
        readonly offsetX: 0;
        readonly offsetY: 4;
        readonly blur: 6;
        readonly spread: -4;
    }];
    readonly pill: readonly [{
        readonly color: "rgba(0 0 0 / 10%)";
        readonly offsetX: 0;
        readonly offsetY: 10;
        readonly blur: 15;
        readonly spread: -3;
    }, {
        readonly color: "rgba(0 0 0 / 10%)";
        readonly offsetX: 0;
        readonly offsetY: 4;
        readonly blur: 6;
        readonly spread: -4;
    }];
    readonly close: readonly [{
        readonly color: "rgba(0 0 0 / 10%)";
        readonly offsetX: 0;
        readonly offsetY: 10;
        readonly blur: 15;
        readonly spread: -3;
    }, {
        readonly color: "rgba(0 0 0 / 10%)";
        readonly offsetX: 0;
        readonly offsetY: 4;
        readonly blur: 6;
        readonly spread: -4;
    }];
};
//# sourceMappingURL=shadows.d.ts.map