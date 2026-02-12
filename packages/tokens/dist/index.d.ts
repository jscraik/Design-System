/**
 * @design-studio/tokens
 *
 * Design tokens with CSS variables and runtime theming API.
 * Enhanced with Geist-inspired patterns (spacing, z-index, motion, focus).
 *
 * ## Token Categories
 *
 * ### Foundation Tokens (from DTCG)
 * - Colors: Semantic color scales from Apps SDK UI
 * - Spacing: Original 12-step scale from Figma
 * - Typography: Font family and text scales
 * - Radius: Border radius values
 * - Shadows: Shadow presets
 * - Sizes: Control height and other UI sizes
 *
 * ### Enhanced Tokens (Geist-inspired)
 * - Spacing: 10-step scale for fine-grained control
 * - Z-Index: 11-tier semantic layering system
 * - Motion: Easing functions and duration tokens
 * - Focus: Accessible focus ring system
 * - Patterns: Component state patterns (error, loading, required)
 *
 * ## Runtime Theming
 * - ThemeProvider: React context provider for theme switching
 * - useTheme: Hook to access and control theme
 * - useEffectiveTheme: Hook to get current effective theme
 *
 * ## Usage
 *
 * ```tsx
 * // Import tokens
 * import { spacing, zIndex, motion, ThemeProvider, useTheme } from "@design-studio/tokens";
 *
 * // Use in components
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="system">
 *       <MyComponent />
 *     </ThemeProvider>
 *   );
 * }
 *
 * function MyComponent() {
 *   const { theme, setTheme } = useTheme();
 *   return (
 *     <div style={{ zIndex: zIndex.modal, padding: spacing.lg }}>
 *       <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
 *         Toggle theme
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export { colorTokens } from "./colors";
export { spacingScale, spaceTokens } from "./spacing";
export { typographyTokens } from "./typography";
export { radiusTokens } from "./radius";
export { shadowTokens } from "./shadows";
export { sizeTokens } from "./sizes";
export { spacing, spacingCSSVars, spacingPixels, type SpacingToken, getSpacing, } from "./enhanced/spacing";
export { zIndex, zIndexCSSVars, type ZIndexToken, getZIndex, } from "./enhanced/z-index";
export { easing, easingCSSVars, duration, durationCSSVars, motionTokens, microInteractions, microInteractionCSSVars, hoverTransition, pressTransition, type EasingToken, type DurationToken, getEasing, getDuration, transition, getMotion, } from "./enhanced/motion";
export { focus, focusColors, focusStyles, focusRing, focusVisibleCSS, focusCSSVars, } from "./enhanced/focus";
export { formStateStyles, errorStyles, loadingStyles, getStateStyles, withState, stateTransitions, type ComponentState, type StatefulComponentProps, } from "./enhanced/patterns";
export { ThemeProvider, useTheme, useEffectiveTheme, type Theme, type ThemeProviderProps, } from "./theme";
export { THEME_STORAGE_KEY } from "./theme";
//# sourceMappingURL=index.d.ts.map