import preset from "../tokens/tailwind.preset";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}", "../ui/src/**/*.{ts,tsx}"],
};
