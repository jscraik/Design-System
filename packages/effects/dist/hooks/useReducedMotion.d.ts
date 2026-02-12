/**
 * Detects if the user prefers reduced motion.
 *
 * Respects the `prefers-reduced-motion` media query and provides
 * a boolean value for disabling animations for accessibility.
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * return (
 *   <div style={{
 *     transition: prefersReducedMotion ? 'none' : 'transform 0.3s'
 *   }}>
 *     Content
 *   </div>
 * );
 * ```
 *
 * @returns Whether the user prefers reduced motion
 */
export declare function useReducedMotion(): boolean;
//# sourceMappingURL=useReducedMotion.d.ts.map