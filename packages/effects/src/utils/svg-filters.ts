/**
 * SVG filter generation utilities for liquid and morphing effects
 */

/**
 * Generates an SVG filter string for liquid morph effects
 *
 * @param id - Unique identifier for the filter
 * @returns SVG filter element as string
 */
export function generateLiquidFilter(id: string): string {
  return `
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
      <defs>
        <filter id="${id}">
          <feMorphology
            operator="dilate"
            radius="2"
            in="SourceGraphic"
            result="DILATED"
          />
          <feGaussianBlur
            stdDeviation="3"
            in="DILATED"
            result="BLURRED"
          />
          <feColorMatrix
            in="BLURRED"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="LIQUID"
          />
          <feBlend
            in="SourceGraphic"
            in2="LIQUID"
            mode="normal"
          />
        </filter>
      </defs>
    </svg>
  `;
}

/**
 * Generates an SVG filter for holographic shimmer effects
 *
 * @param id - Unique identifier for the filter
 * @returns SVG filter element as string
 */
export function generateHoloFilter(id: string): string {
  return `
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
      <defs>
        <filter id="${id}">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="3"
            result="NOISE"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="NOISE"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  `;
}

/**
 * Generates unique filter ID for components
 *
 * @param prefix - Component name prefix
 * @returns Unique filter ID
 */
export function generateFilterId(prefix: string): string {
  return `${prefix}-filter-${Math.random().toString(36).substring(2, 9)}`;
}
