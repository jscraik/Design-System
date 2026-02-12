/**
 * @design-studio/effects - Advanced UI Effects Components
 *
 * Public API exports for all effect components, hooks, and utilities.
 */
export { LiquidToggle } from './components/toggle';
export type { LiquidToggleProps } from './components/toggle';
export { MagneticButton } from './components/button';
export type { MagneticButtonProps } from './components/button';
export { HoloCard, holoColors } from './components/card';
export type { HoloCardProps } from './components/card';
export { GlowText, GradientText, gradientPresets, } from './components/text';
export type { GlowTextProps, GradientTextProps, } from './components/text';
export { StickyReveal } from './components/scroll';
export type { StickyRevealProps } from './components/scroll';
export { useMousePosition, useScrollPosition, useReducedMotion, } from './hooks';
export type { MousePosition, UseMousePositionOptions, UseMousePositionReturn, ScrollPosition, UseScrollPositionOptions, } from './hooks';
export { generateLiquidFilter, generateHoloFilter, generateFilterId, } from './utils/svg-filters';
export { easings, durations, getReducedMotionDuration, buildTransition, buildScrollAnimation, } from './utils/animation';
export type { TimelineConfig } from './utils/animation';
export { cn } from './utils/cn';
//# sourceMappingURL=index.d.ts.map