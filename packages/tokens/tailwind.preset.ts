import type { Config } from "tailwindcss";

const preset: Config = {
  theme: {
    extend: {
      colors: {
        foundation: {
          "bg-dark-1": "var(--foundation-bg-dark-1)",
          "bg-dark-2": "var(--foundation-bg-dark-2)",
          "bg-dark-3": "var(--foundation-bg-dark-3)",
          "bg-light-1": "var(--foundation-bg-light-1)",
          "bg-light-2": "var(--foundation-bg-light-2)",
          "bg-light-3": "var(--foundation-bg-light-3)",
          "text-dark-primary": "var(--foundation-text-dark-primary)",
          "text-dark-secondary": "var(--foundation-text-dark-secondary)",
          "text-dark-tertiary": "var(--foundation-text-dark-tertiary)",
          "text-light-primary": "var(--foundation-text-light-primary)",
          "text-light-secondary": "var(--foundation-text-light-secondary)",
          "text-light-tertiary": "var(--foundation-text-light-tertiary)",
          "icon-dark-primary": "var(--foundation-icon-dark-primary)",
          "icon-dark-secondary": "var(--foundation-icon-dark-secondary)",
          "icon-dark-tertiary": "var(--foundation-icon-dark-tertiary)",
          "icon-dark-inverted": "var(--foundation-icon-dark-inverted)",
          "icon-light-primary": "var(--foundation-icon-light-primary)",
          "icon-light-secondary": "var(--foundation-icon-light-secondary)",
          "icon-light-tertiary": "var(--foundation-icon-light-tertiary)",
          "icon-light-inverted": "var(--foundation-icon-light-inverted)",
          "accent-blue": "var(--foundation-accent-blue)",
          "accent-red": "var(--foundation-accent-red)",
          "accent-orange": "var(--foundation-accent-orange)",
          "accent-green": "var(--foundation-accent-green)",
          "accent-blue-light": "var(--foundation-accent-blue-light)",
          "accent-red-light": "var(--foundation-accent-red-light)",
          "accent-orange-light": "var(--foundation-accent-orange-light)",
          "accent-green-light": "var(--foundation-accent-green-light)",
        },
      },
      spacing: {
        "128": "128px",
        "64": "64px",
        "48": "48px",
        "40": "40px",
        "32": "32px",
        "24": "24px",
        "16": "16px",
        "12": "12px",
        "8": "8px",
        "4": "4px",
        "2": "2px",
        "0": "0px",
      },
      fontFamily: {
        foundation: ["var(--foundation-font-family)", "sans-serif"],
      },
    },
  },
};

export default preset;
