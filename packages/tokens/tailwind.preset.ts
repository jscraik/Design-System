import type { Config } from "tailwindcss";

const preset: Config = {
  theme: {
    extend: {
      colors: {
        foundation: {
          // Background colors
          "bg-dark-1": "var(--foundation-bg-dark-1)",
          "bg-dark-2": "var(--foundation-bg-dark-2)",
          "bg-dark-3": "var(--foundation-bg-dark-3)",
          "bg-light-1": "var(--foundation-bg-light-1)",
          "bg-light-2": "var(--foundation-bg-light-2)",
          "bg-light-3": "var(--foundation-bg-light-3)",
          // Text colors
          "text-dark-primary": "var(--foundation-text-dark-primary)",
          "text-dark-secondary": "var(--foundation-text-dark-secondary)",
          "text-dark-tertiary": "var(--foundation-text-dark-tertiary)",
          "text-light-primary": "var(--foundation-text-light-primary)",
          "text-light-secondary": "var(--foundation-text-light-secondary)",
          "text-light-tertiary": "var(--foundation-text-light-tertiary)",
          // Icon colors
          "icon-dark-primary": "var(--foundation-icon-dark-primary)",
          "icon-dark-secondary": "var(--foundation-icon-dark-secondary)",
          "icon-dark-tertiary": "var(--foundation-icon-dark-tertiary)",
          "icon-dark-inverted": "var(--foundation-icon-dark-inverted)",
          "icon-light-primary": "var(--foundation-icon-light-primary)",
          "icon-light-secondary": "var(--foundation-icon-light-secondary)",
          "icon-light-tertiary": "var(--foundation-icon-light-tertiary)",
          "icon-light-inverted": "var(--foundation-icon-light-inverted)",
          // Accent colors (dark mode default)
          "accent-blue": "var(--foundation-accent-blue)",
          "accent-red": "var(--foundation-accent-red)",
          "accent-orange": "var(--foundation-accent-orange)",
          "accent-green": "var(--foundation-accent-green)",
          // Accent colors (light mode)
          "accent-blue-light": "var(--foundation-accent-blue-light)",
          "accent-red-light": "var(--foundation-accent-red-light)",
          "accent-orange-light": "var(--foundation-accent-orange-light)",
          "accent-green-light": "var(--foundation-accent-green-light)",
        },
      },
      spacing: {
        // Foundation spacing scale
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
      fontSize: {
        // Foundation typography scale
        "heading-1": [
          "var(--foundation-heading-1-size)",
          {
            lineHeight: "var(--foundation-heading-1-line)",
            letterSpacing: "var(--foundation-heading-1-tracking)",
            fontWeight: "var(--foundation-heading-1-weight)",
          },
        ],
        "heading-2": [
          "var(--foundation-heading-2-size)",
          {
            lineHeight: "var(--foundation-heading-2-line)",
            letterSpacing: "var(--foundation-heading-2-tracking)",
            fontWeight: "var(--foundation-heading-2-weight)",
          },
        ],
        "heading-3": [
          "var(--foundation-heading-3-size)",
          {
            lineHeight: "var(--foundation-heading-3-line)",
            letterSpacing: "var(--foundation-heading-3-tracking)",
            fontWeight: "var(--foundation-heading-3-weight)",
          },
        ],
        body: [
          "var(--foundation-body-size)",
          {
            lineHeight: "var(--foundation-body-line)",
            letterSpacing: "var(--foundation-body-tracking)",
            fontWeight: "var(--foundation-body-weight-regular)",
          },
        ],
        "body-emphasis": [
          "var(--foundation-body-size)",
          {
            lineHeight: "var(--foundation-body-line)",
            letterSpacing: "var(--foundation-body-tracking)",
            fontWeight: "var(--foundation-body-weight-emphasis)",
          },
        ],
        "body-small": [
          "var(--foundation-body-small-size)",
          {
            lineHeight: "var(--foundation-body-small-line)",
            letterSpacing: "var(--foundation-body-small-tracking)",
            fontWeight: "var(--foundation-body-small-weight-regular)",
          },
        ],
        "body-small-emphasis": [
          "var(--foundation-body-small-size)",
          {
            lineHeight: "var(--foundation-body-small-line)",
            letterSpacing: "var(--foundation-body-small-tracking)",
            fontWeight: "var(--foundation-body-small-weight-emphasis)",
          },
        ],
        caption: [
          "var(--foundation-caption-size)",
          {
            lineHeight: "var(--foundation-caption-line)",
            letterSpacing: "var(--foundation-caption-tracking)",
            fontWeight: "var(--foundation-caption-weight-regular)",
          },
        ],
        "caption-emphasis": [
          "var(--foundation-caption-size)",
          {
            lineHeight: "var(--foundation-caption-line)",
            letterSpacing: "var(--foundation-caption-tracking)",
            fontWeight: "var(--foundation-caption-weight-emphasis)",
          },
        ],
      },
      fontFamily: {
        foundation: ["var(--foundation-font-family)", "sans-serif"],
      },
      letterSpacing: {
        // Foundation tracking values
        "heading-1": "var(--foundation-heading-1-tracking)",
        "heading-2": "var(--foundation-heading-2-tracking)",
        "heading-3": "var(--foundation-heading-3-tracking)",
        body: "var(--foundation-body-tracking)",
        "body-small": "var(--foundation-body-small-tracking)",
        caption: "var(--foundation-caption-tracking)",
      },
      lineHeight: {
        // Foundation line-height values
        "heading-1": "var(--foundation-heading-1-line)",
        "heading-2": "var(--foundation-heading-2-line)",
        "heading-3": "var(--foundation-heading-3-line)",
        body: "var(--foundation-body-line)",
        "body-small": "var(--foundation-body-small-line)",
        caption: "var(--foundation-caption-line)",
      },
    },
  },
};

export default preset;
