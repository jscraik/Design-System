/**
 * @design-studio/effects - Advanced UI Effects Components
 *
 * Public API exports for all effect components, hooks, and utilities.
 */

// ============================================================================
// COMPONENTS
// ============================================================================

// Toggle Components
export { LiquidToggle } from "./components/toggle";
export type { LiquidToggleProps } from "./components/toggle";

// Button Components
export { MagneticButton } from "./components/button";
export type { MagneticButtonProps } from "./components/button";

// Card Components
export { HoloCard, holoColors } from "./components/card";
export type { HoloCardProps } from "./components/card";

// Text Components
export {
  GlowText,
  GradientText,
  gradientPresets,
} from "./components/text";
export type {
  GlowTextProps,
  GradientTextProps,
} from "./components/text";

// Scroll Components
export { StickyReveal, TocMarker, ScrollProgress } from "./components/scroll";
export type { StickyRevealProps, TocMarkerProps, ScrollProgressProps } from "./components/scroll";

// ============================================================================
// HOOKS
// ============================================================================

export {
  useMousePosition,
  useScrollPosition,
  useReducedMotion,
} from "./hooks";
export type {
  MousePosition,
  UseMousePositionOptions,
  UseMousePositionReturn,
  ScrollPosition,
  UseScrollPositionOptions,
} from "./hooks";

// View Transition Hook & Components
export {
  useViewTransition,
  ViewTransitionWrapper,
  viewTransitions,
} from "./components/view-transition";
export type {
  ViewTransitionOptions,
  ViewTransitionWrapperProps,
  ViewTransitionType,
} from "./components/view-transition";

// ============================================================================
// UTILS
// ============================================================================

export {
  generateLiquidFilter,
  generateHoloFilter,
  generateFilterId,
} from "./utils/svg-filters";

export {
  easings,
  durations,
  getReducedMotionDuration,
  buildTransition,
  buildScrollAnimation,
} from "./utils/animation";
export type { TimelineConfig } from "./utils/animation";

export { cn } from "./utils/cn";

// ============================================================================
// STYLES
// ============================================================================

// Import styles directly in your app:
// import "@design-studio/effects/styles/animations.css";
// import "@design-studio/effects/styles/filters.css";
// import "@design-studio/effects/styles/base.css";
