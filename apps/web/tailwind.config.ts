import type { Config } from "tailwindcss";
import preset from "../../packages/tokens/tailwind.preset";

const config = {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/tokens/src/**/*.{ts,tsx,css}",
  ],
} satisfies Config;

export default config;
