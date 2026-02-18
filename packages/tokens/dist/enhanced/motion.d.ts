/**
 * @design-studio/tokens - Enhanced Motion
 *
 * Motion system inspired by Geist design system.
 * Provides consistent animation timing and duration across components.
 *
 * Easing Functions:
 * - swift: cubic-bezier(0.175, 0.885, 0.32, 1.1) - For overlays, popovers (slight overshoot)
 * - standard: cubic-bezier(0.4, 0, 0.2, 1) - For standard transitions (ease-in-out)
 * - easeOut: cubic-bezier(0, 0, 0.2, 1) - For exit animations (ease-out)
 *
 * Durations (ms):
 * - micro: 75 - Micro-interactions (hover, focus)
 * - fast: 150 - Fast transitions (dropdowns, toggles)
 * - standard: 200 - Standard transitions (modals, drawers)
 * - moderate: 250 - Moderate transitions (page transitions)
 * - slow: 350 - Slow transitions (complex animations)
 * - complex: 500 - Complex animations (multi-stage)
 * - long: 1000 - Long animations (hero, intro)
 * - extraLong: 1400 - Extra long animations (special cases)
 */
/**
 * Easing functions as CSS custom properties
 */
export declare const easingCSSVars: {
    readonly "--ds-easing-swift": "cubic-bezier(0.175, 0.885, 0.32, 1.1)";
    readonly "--ds-easing-standard": "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly "--ds-easing-ease-out": "cubic-bezier(0, 0, 0.2, 1)";
    readonly "--ds-easing-ease-in": "cubic-bezier(0.4, 0, 1, 1)";
    readonly "--ds-easing-linear": "linear";
};
/**
 * Easing functions for JavaScript/TypeScript usage
 */
export declare const easing: {
    readonly swift: "cubic-bezier(0.175, 0.885, 0.32, 1.1)";
    readonly standard: "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly easeOut: "cubic-bezier(0, 0, 0.2, 1)";
    readonly easeIn: "cubic-bezier(0.4, 0, 1, 1)";
    readonly linear: "linear";
};
/**
 * Easing function type
 */
export type EasingToken = keyof typeof easing;
/**
 * Duration tokens as CSS custom properties (in ms)
 */
export declare const durationCSSVars: {
    readonly "--ds-duration-micro": "75ms";
    readonly "--ds-duration-fast": "150ms";
    readonly "--ds-duration-standard": "200ms";
    readonly "--ds-duration-moderate": "250ms";
    readonly "--ds-duration-slow": "350ms";
    readonly "--ds-duration-complex": "500ms";
    readonly "--ds-duration-long": "1000ms";
    readonly "--ds-duration-extra-long": "1400ms";
};
/**
 * Duration tokens for JavaScript/TypeScript usage (in ms)
 */
export declare const duration: {
    readonly micro: 75;
    readonly fast: 150;
    readonly standard: 200;
    readonly moderate: 250;
    readonly slow: 350;
    readonly complex: 500;
    readonly long: 1000;
    readonly extraLong: 1400;
};
/**
 * Duration type
 */
export type DurationToken = keyof typeof duration;
/**
 * Motion token patterns for common UI elements
 * Maps elements to their recommended easing + duration
 */
export declare const motionTokens: {
    readonly overlay: {
        readonly enter: {
            readonly easing: "cubic-bezier(0.175, 0.885, 0.32, 1.1)";
            readonly duration: 200;
        };
        readonly exit: {
            readonly easing: "cubic-bezier(0, 0, 0.2, 1)";
            readonly duration: 150;
        };
    };
    readonly popover: {
        readonly enter: {
            readonly easing: "cubic-bezier(0.175, 0.885, 0.32, 1.1)";
            readonly duration: 150;
        };
        readonly exit: {
            readonly easing: "cubic-bezier(0, 0, 0.2, 1)";
            readonly duration: 150;
        };
    };
    readonly dropdown: {
        readonly enter: {
            readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly duration: 150;
        };
        readonly exit: {
            readonly easing: "cubic-bezier(0, 0, 0.2, 1)";
            readonly duration: 75;
        };
    };
    readonly toggle: {
        readonly active: {
            readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly duration: 75;
        };
        readonly inactive: {
            readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly duration: 75;
        };
    };
    readonly tab: {
        readonly enter: {
            readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly duration: 150;
        };
        readonly exit: {
            readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly duration: 150;
        };
    };
    readonly tooltip: {
        readonly enter: {
            readonly easing: "cubic-bezier(0.175, 0.885, 0.32, 1.1)";
            readonly duration: 150;
        };
        readonly exit: {
            readonly easing: "cubic-bezier(0, 0, 0.2, 1)";
            readonly duration: 75;
        };
    };
    readonly focus: {
        readonly enter: {
            readonly easing: "cubic-bezier(0, 0, 0.2, 1)";
            readonly duration: 75;
        };
        readonly exit: {
            readonly easing: "cubic-bezier(0, 0, 0.2, 1)";
            readonly duration: 75;
        };
    };
    readonly page: {
        readonly enter: {
            readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly duration: 250;
        };
        readonly exit: {
            readonly easing: "cubic-bezier(0, 0, 0.2, 1)";
            readonly duration: 250;
        };
    };
};
/**
 * Helper to get easing value
 */
export declare function getEasing(token: EasingToken): string;
/**
 * Helper to get duration value
 */
export declare function getDuration(token: DurationToken): number;
/**
 * Helper to build CSS transition string
 */
export declare function transition(properties: string | string[], options?: {
    easing?: EasingToken;
    duration?: DurationToken;
    delay?: DurationToken;
}): string;
/**
 * Helper to get motion token for element
 */
export declare function getMotion(element: keyof typeof motionTokens, phase: "enter" | "exit" | "active" | "inactive"): {
    easing: string;
    duration: number;
};
/**
 * Micro-interaction tokens for hover and press feedback
 *
 * These are subtle animations that provide immediate feedback for user interactions.
 * Based on user's design engineering analysis of Radix UI improvements.
 */
export declare const microInteractions: {
    /**
     * Hover micro-interaction
     * Subtle lift effect on hover
     */
    readonly hover: {
        readonly translateY: "-1px";
        readonly scale: "1.01";
        readonly duration: 75;
        readonly easing: "cubic-bezier(0, 0, 0.2, 1)";
    };
    /**
     * Press/active micro-interaction
     * Subtle scale down on press
     */
    readonly press: {
        readonly scale: "0.98";
        readonly duration: 75;
        readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
};
/**
 * Micro-interaction CSS variables
 */
export declare const microInteractionCSSVars: {
    readonly "--ds-micro-hover-translate-y": "-1px";
    readonly "--ds-micro-hover-scale": "1.01";
    readonly "--ds-micro-hover-duration": "75ms";
    readonly "--ds-micro-hover-easing": "cubic-bezier(0, 0, 0.2, 1)";
    readonly "--ds-micro-press-scale": "0.98";
    readonly "--ds-micro-press-duration": "75ms";
    readonly "--ds-micro-press-easing": "cubic-bezier(0.4, 0, 0.2, 1)";
};
/**
 * Helper to build hover transition string
 */
export declare function hoverTransition(properties?: string | string[]): string;
/**
 * Helper to build press transition string
 */
export declare function pressTransition(properties?: string | string[]): string;
//# sourceMappingURL=motion.d.ts.map