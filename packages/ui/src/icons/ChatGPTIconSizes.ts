export const chatGPTIconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  key: 32,
  toggle: { width: 44, height: 24 },
} as const;

export type ChatGPTIconSizes = typeof chatGPTIconSizes;

// Helper to get Tailwind size class from pixel size
export function getSizeClass(size: keyof typeof chatGPTIconSizes): string {
  const pixelSize = chatGPTIconSizes[size];
  if (typeof pixelSize === "object") {
    return `w-[${pixelSize.width}px] h-[${pixelSize.height}px]`;
  }
  return `size-[${pixelSize}px]`;
}

// Utility for dynamic icon sizing
export function getIconSizeInPixels(
  size: keyof typeof chatGPTIconSizes,
): number | { width: number; height: number } {
  return chatGPTIconSizes[size];
}
