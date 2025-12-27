import type { Config } from "tailwindcss";
import preset from "../tokens/tailwind.preset";

const config = {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../ui/src/**/*.{ts,tsx}",
    "../tokens/src/**/*.{ts,tsx,css}",
  ],
} satisfies Config;

export default config;
