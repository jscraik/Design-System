// Generated from src/tokens/index.dtcg.json. Do not edit by hand.
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
export const elevation = {
    /** Hairline lift — table rows, subtle chips (6% alpha). */
    xs: "0 1px 2px 0 rgba(0,0,0,0.06)",
    /** Card resting state — inputs, flat cards (12% alpha). */
    sm: "0 1px 3px 0 rgba(0,0,0,0.12), 0 1px 2px -1px rgba(0,0,0,0.08)",
    /** Dropdown menus, context menus (14% alpha). */
    md: "0 4px 6px -1px rgba(0,0,0,0.14), 0 2px 4px -2px rgba(0,0,0,0.10)",
    /** Popover, tooltip, floating panels (14% alpha). */
    lg: "0 10px 15px -3px rgba(0,0,0,0.14), 0 4px 6px -4px rgba(0,0,0,0.10)",
    /** Side sheets, large popovers (16% alpha). */
    xl: "0 20px 25px -5px rgba(0,0,0,0.16), 0 8px 10px -6px rgba(0,0,0,0.10)",
    /** Full-screen dialogs, modals (28% alpha). */
    "2xl": "0 25px 50px -12px rgba(0,0,0,0.28)",
    /** Inset — recessed inputs, pressed states. */
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.08)",
};
export const shadowTokens = {
    card: [
        {
            color: "rgba(0 0 0 / 10%)",
            offsetX: 0,
            offsetY: 10,
            blur: 15,
            spread: -3,
        },
        {
            color: "rgba(0 0 0 / 10%)",
            offsetX: 0,
            offsetY: 4,
            blur: 6,
            spread: -4,
        },
    ],
    pip: [
        {
            color: "rgba(0 0 0 / 10%)",
            offsetX: 0,
            offsetY: 10,
            blur: 15,
            spread: -3,
        },
        {
            color: "rgba(0 0 0 / 10%)",
            offsetX: 0,
            offsetY: 4,
            blur: 6,
            spread: -4,
        },
    ],
    pill: [
        {
            color: "rgba(0 0 0 / 10%)",
            offsetX: 0,
            offsetY: 10,
            blur: 15,
            spread: -3,
        },
        {
            color: "rgba(0 0 0 / 10%)",
            offsetX: 0,
            offsetY: 4,
            blur: 6,
            spread: -4,
        },
    ],
    close: [
        {
            color: "rgba(0 0 0 / 10%)",
            offsetX: 0,
            offsetY: 10,
            blur: 15,
            spread: -3,
        },
        {
            color: "rgba(0 0 0 / 10%)",
            offsetX: 0,
            offsetY: 4,
            blur: 6,
            spread: -4,
        },
    ],
};
