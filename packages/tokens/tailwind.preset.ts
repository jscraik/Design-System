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
          "icon-dark-accent": "var(--foundation-icon-dark-accent)",
          "icon-dark-status-error": "var(--foundation-icon-dark-status-error)",
          "icon-dark-status-warning": "var(--foundation-icon-dark-status-warning)",
          "icon-dark-status-success": "var(--foundation-icon-dark-status-success)",
          "icon-light-primary": "var(--foundation-icon-light-primary)",
          "icon-light-secondary": "var(--foundation-icon-light-secondary)",
          "icon-light-tertiary": "var(--foundation-icon-light-tertiary)",
          "icon-light-inverted": "var(--foundation-icon-light-inverted)",
          "icon-light-accent": "var(--foundation-icon-light-accent)",
          "icon-light-status-error": "var(--foundation-icon-light-status-error)",
          "icon-light-status-warning": "var(--foundation-icon-light-status-warning)",
          "icon-light-status-success": "var(--foundation-icon-light-status-success)",
          // Border colors
          "border-light": "var(--foundation-border-light)",
          "border-heavy": "var(--foundation-border-heavy)",
          "border-dark-default": "var(--foundation-border-dark-default)",
          "border-dark-light": "var(--foundation-border-dark-light)",
          // Accent colors (dark mode default)
          "accent-gray": "var(--foundation-accent-gray)",
          "accent-red": "var(--foundation-accent-red)",
          "accent-orange": "var(--foundation-accent-orange)",
          "accent-yellow": "var(--foundation-accent-yellow)",
          "accent-green": "var(--foundation-accent-green)",
          "accent-blue": "var(--foundation-accent-blue)",
          "accent-purple": "var(--foundation-accent-purple)",
          "accent-pink": "var(--foundation-accent-pink)",
          // Accent colors (light mode)
          "accent-gray-light": "var(--foundation-accent-gray-light)",
          "accent-red-light": "var(--foundation-accent-red-light)",
          "accent-orange-light": "var(--foundation-accent-orange-light)",
          "accent-yellow-light": "var(--foundation-accent-yellow-light)",
          "accent-green-light": "var(--foundation-accent-green-light)",
          "accent-blue-light": "var(--foundation-accent-blue-light)",
          "accent-purple-light": "var(--foundation-accent-purple-light)",
          "accent-pink-light": "var(--foundation-accent-pink-light)",
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
        "paragraph-hero": "var(--foundation-hero-paragraph-spacing)",
        "paragraph-h1": "var(--foundation-h-1-paragraph-spacing)",
        "paragraph-h2": "var(--foundation-h-2-paragraph-spacing)",
        "paragraph-h3": "var(--foundation-h-3-paragraph-spacing)",
        "paragraph-h4": "var(--foundation-h-4-paragraph-spacing)",
        "paragraph-h5": "var(--foundation-h-5-paragraph-spacing)",
        "paragraph-h6": "var(--foundation-h-6-paragraph-spacing)",
        "paragraph-lg": "var(--foundation-paragraph-lg-paragraph-spacing)",
        "paragraph-md": "var(--foundation-paragraph-md-paragraph-spacing)",
        "paragraph-sm": "var(--foundation-paragraph-sm-paragraph-spacing)",
        "paragraph-caption": "var(--foundation-caption-paragraph-spacing)",
      },
      fontSize: {
        // Foundation typography scale
        hero: [
          "var(--foundation-hero-size)",
          {
            lineHeight: "var(--foundation-hero-line)",
            letterSpacing: "var(--foundation-hero-tracking)",
            fontWeight: "var(--foundation-hero-weight)",
          },
        ],
        h1: [
          "var(--foundation-h-1-size)",
          {
            lineHeight: "var(--foundation-h-1-line)",
            letterSpacing: "var(--foundation-h-1-tracking)",
            fontWeight: "var(--foundation-h-1-weight)",
          },
        ],
        h2: [
          "var(--foundation-h-2-size)",
          {
            lineHeight: "var(--foundation-h-2-line)",
            letterSpacing: "var(--foundation-h-2-tracking)",
            fontWeight: "var(--foundation-h-2-weight)",
          },
        ],
        h3: [
          "var(--foundation-h-3-size)",
          {
            lineHeight: "var(--foundation-h-3-line)",
            letterSpacing: "var(--foundation-h-3-tracking)",
            fontWeight: "var(--foundation-h-3-weight)",
          },
        ],
        h4: [
          "var(--foundation-h-4-size)",
          {
            lineHeight: "var(--foundation-h-4-line)",
            letterSpacing: "var(--foundation-h-4-tracking)",
            fontWeight: "var(--foundation-h-4-weight)",
          },
        ],
        h5: [
          "var(--foundation-h-5-size)",
          {
            lineHeight: "var(--foundation-h-5-line)",
            letterSpacing: "var(--foundation-h-5-tracking)",
            fontWeight: "var(--foundation-h-5-weight)",
          },
        ],
        h6: [
          "var(--foundation-h-6-size)",
          {
            lineHeight: "var(--foundation-h-6-line)",
            letterSpacing: "var(--foundation-h-6-tracking)",
            fontWeight: "var(--foundation-h-6-weight)",
          },
        ],
        "paragraph-lg": [
          "var(--foundation-paragraph-lg-size)",
          {
            lineHeight: "var(--foundation-paragraph-lg-line)",
            letterSpacing: "var(--foundation-paragraph-lg-tracking)",
            fontWeight: "var(--foundation-paragraph-lg-weight-regular)",
          },
        ],
        "paragraph-md": [
          "var(--foundation-paragraph-md-size)",
          {
            lineHeight: "var(--foundation-paragraph-md-line)",
            letterSpacing: "var(--foundation-paragraph-md-tracking)",
            fontWeight: "var(--foundation-paragraph-md-weight-regular)",
          },
        ],
        "paragraph-sm": [
          "var(--foundation-paragraph-sm-size)",
          {
            lineHeight: "var(--foundation-paragraph-sm-line)",
            letterSpacing: "var(--foundation-paragraph-sm-tracking)",
            fontWeight: "var(--foundation-paragraph-sm-weight-regular)",
          },
        ],
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
        "card-title": [
          "var(--foundation-card-title-size)",
          {
            lineHeight: "var(--foundation-card-title-line)",
            letterSpacing: "var(--foundation-card-title-tracking)",
            fontWeight: "var(--foundation-card-title-weight)",
          },
        ],
        "list-title": [
          "var(--foundation-list-title-size)",
          {
            lineHeight: "var(--foundation-list-title-line)",
            letterSpacing: "var(--foundation-list-title-tracking)",
            fontWeight: "var(--foundation-list-title-weight)",
          },
        ],
        "list-subtitle": [
          "var(--foundation-list-subtitle-size)",
          {
            lineHeight: "var(--foundation-list-subtitle-line)",
            letterSpacing: "var(--foundation-list-subtitle-tracking)",
            fontWeight: "var(--foundation-list-subtitle-weight)",
          },
        ],
        "button-label": [
          "var(--foundation-button-label-size)",
          {
            lineHeight: "var(--foundation-button-label-line)",
            letterSpacing: "var(--foundation-button-label-tracking)",
            fontWeight: "var(--foundation-button-label-weight)",
          },
        ],
        "button-label-small": [
          "var(--foundation-button-label-small-size)",
          {
            lineHeight: "var(--foundation-button-label-small-line)",
            letterSpacing: "var(--foundation-button-label-small-tracking)",
            fontWeight: "var(--foundation-button-label-small-weight)",
          },
        ],
      },
      fontFamily: {
        foundation: ["var(--foundation-font-family)", "sans-serif"],
      },
      letterSpacing: {
        // Foundation tracking values
        hero: "var(--foundation-hero-tracking)",
        h1: "var(--foundation-h-1-tracking)",
        h2: "var(--foundation-h-2-tracking)",
        h3: "var(--foundation-h-3-tracking)",
        h4: "var(--foundation-h-4-tracking)",
        h5: "var(--foundation-h-5-tracking)",
        h6: "var(--foundation-h-6-tracking)",
        "paragraph-lg": "var(--foundation-paragraph-lg-tracking)",
        "paragraph-md": "var(--foundation-paragraph-md-tracking)",
        "paragraph-sm": "var(--foundation-paragraph-sm-tracking)",
        "heading-1": "var(--foundation-heading-1-tracking)",
        "heading-2": "var(--foundation-heading-2-tracking)",
        "heading-3": "var(--foundation-heading-3-tracking)",
        body: "var(--foundation-body-tracking)",
        "body-small": "var(--foundation-body-small-tracking)",
        caption: "var(--foundation-caption-tracking)",
        "card-title": "var(--foundation-card-title-tracking)",
        "list-title": "var(--foundation-list-title-tracking)",
        "list-subtitle": "var(--foundation-list-subtitle-tracking)",
        "button-label": "var(--foundation-button-label-tracking)",
        "button-label-small": "var(--foundation-button-label-small-tracking)",
      },
      lineHeight: {
        // Foundation line-height values
        hero: "var(--foundation-hero-line)",
        h1: "var(--foundation-h-1-line)",
        h2: "var(--foundation-h-2-line)",
        h3: "var(--foundation-h-3-line)",
        h4: "var(--foundation-h-4-line)",
        h5: "var(--foundation-h-5-line)",
        h6: "var(--foundation-h-6-line)",
        "paragraph-lg": "var(--foundation-paragraph-lg-line)",
        "paragraph-md": "var(--foundation-paragraph-md-line)",
        "paragraph-sm": "var(--foundation-paragraph-sm-line)",
        "heading-1": "var(--foundation-heading-1-line)",
        "heading-2": "var(--foundation-heading-2-line)",
        "heading-3": "var(--foundation-heading-3-line)",
        body: "var(--foundation-body-line)",
        "body-small": "var(--foundation-body-small-line)",
        caption: "var(--foundation-caption-line)",
        "card-title": "var(--foundation-card-title-line)",
        "list-title": "var(--foundation-list-title-line)",
        "list-subtitle": "var(--foundation-list-subtitle-line)",
        "button-label": "var(--foundation-button-label-line)",
        "button-label-small": "var(--foundation-button-label-small-line)",
      },
      borderRadius: {
        6: "var(--foundation-radius-6)",
        8: "var(--foundation-radius-8)",
        10: "var(--foundation-radius-10)",
        12: "var(--foundation-radius-12)",
        16: "var(--foundation-radius-16)",
        18: "var(--foundation-radius-18)",
        21: "var(--foundation-radius-21)",
        24: "var(--foundation-radius-24)",
        30: "var(--foundation-radius-30)",
        round: "var(--foundation-radius-round)",
      },
      boxShadow: {
        "foundation-card": "var(--foundation-shadow-card)",
        "foundation-pip": "var(--foundation-shadow-pip)",
        "foundation-pill": "var(--foundation-shadow-pill)",
        "foundation-close": "var(--foundation-shadow-close)",
      },
    },
  },
};

export default preset;
