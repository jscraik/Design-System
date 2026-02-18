/**
 * @design-studio/effects - Advanced UI Effects Components
 *
 * Public API exports for all effect components, hooks, and utilities.
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export type { MagneticButtonProps } from "./components/button";
// Button Components
export { MagneticButton } from "./components/button";
export type { HoloCardProps } from "./components/card";
// Card Components
export { HoloCard, holoColors } from "./components/card";
export type { ScrollProgressProps, StickyRevealProps, TocMarkerProps } from "./components/scroll";
// Scroll Components
export { ScrollProgress, StickyReveal, TocMarker } from "./components/scroll";
export type {
  GlowTextProps,
  GradientTextProps,
} from "./components/text";
// Text Components
export {
  GlowText,
  GradientText,
  gradientPresets,
} from "./components/text";
export type { LiquidToggleProps } from "./components/toggle";
// Toggle Components
export { LiquidToggle } from "./components/toggle";

// ============================================================================
// HOOKS
// ============================================================================

export type {
  ViewTransitionOptions,
  ViewTransitionType,
  ViewTransitionWrapperProps,
} from "./components/view-transition";
// View Transition Hook & Components
export {
  useViewTransition,
  ViewTransitionWrapper,
  viewTransitions,
} from "./components/view-transition";
export type {
  MousePosition,
  ScrollPosition,
  UseMousePositionOptions,
  UseMousePositionReturn,
  UseScrollPositionOptions,
} from "./hooks";
export {
  useMousePosition,
  useReducedMotion,
  useScrollPosition,
} from "./hooks";

// ============================================================================
// UTILS
// ============================================================================

export type { TimelineConfig } from "./utils/animation";

export {
  buildScrollAnimation,
  buildTransition,
  durations,
  easings,
  getReducedMotionDuration,
} from "./utils/animation";
export { cn } from "./utils/cn";
export {
  generateFilterId,
  generateHoloFilter,
  generateLiquidFilter,
} from "./utils/svg-filters";

// ============================================================================
// STYLES
// ============================================================================

// Import styles directly in your app:
// import "@design-studio/effects/styles/animations.css";
// import "@design-studio/effects/styles/filters.css";
// import "@design-studio/effects/styles/base.css";
