import chatUIPreset from "@design-studio/tokens/tailwind.preset";
import type { Config } from "tailwindcss";

/**
 * Base Tailwind configuration for ChatUI projects
 * Extend this in your app/package-specific configs
 */
export const baseTailwindConfig: Partial<Config> = {
  presets: [chatUIPreset],
  content: [
    // Common content patterns - override in extending configs
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Common theme extensions
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    // Common plugins - add more in extending configs
  ],
};

export default baseTailwindConfig;
