/**
 * Local implementations of Apps SDK UI icons to avoid circular dependencies.
 *
 * These icons replicate the visual appearance of @openai/apps-sdk-ui icons
 * without importing from that package, preventing circular dependency issues
 * during bundling.
 */

import type { IconProps } from "./index";

/**
 * IconSparkles - sparkles decoration icon
 * Local implementation to avoid circular dependency with @openai/apps-sdk-ui
 */
export function IconSparkles({ className = "size-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.39 8.26L21 9.27L16.5 14.14L17.82 21L12 17.27L6.18 21L7.5 14.14L3 9.27L9.61 8.26L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 3L7 8L12 9L8 13L9 18L5 15L1 18L2 13L-2 9L3 8L5 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(12, -1)"
      />
    </svg>
  );
}
