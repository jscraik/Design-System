import "../preview.css";

import type { Preview } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import React from "react";

import { HostProvider, createMockHost } from "@chatui/runtime";
import { AppsSDKUIProvider } from "@chatui/ui";

// Make React available globally for MDX files
(globalThis as any).React = React;

const host = createMockHost();

// Custom viewports matching ChatGPT widget display modes
const customViewports = {
  // ChatGPT widget inline mode (compact)
  widgetInline: {
    name: "Widget Inline",
    styles: { width: "400px", height: "300px" },
  },
  // ChatGPT widget expanded mode
  widgetExpanded: {
    name: "Widget Expanded",
    styles: { width: "600px", height: "500px" },
  },
  // ChatGPT widget fullscreen mode
  widgetFullscreen: {
    name: "Widget Fullscreen",
    styles: { width: "100%", height: "100%" },
  },
  // Mobile portrait
  mobilePortrait: {
    name: "Mobile Portrait",
    styles: { width: "375px", height: "667px" },
  },
  // Mobile landscape
  mobileLandscape: {
    name: "Mobile Landscape",
    styles: { width: "667px", height: "375px" },
  },
  // Tablet
  tablet: {
    name: "Tablet",
    styles: { width: "768px", height: "1024px" },
  },
  // Desktop
  desktop: {
    name: "Desktop",
    styles: { width: "1280px", height: "800px" },
  },
};

// Background options matching ChatGPT/Apps SDK foundations
const backgrounds = {
  default: "dark",
  values: [
    // Dark theme backgrounds (from foundations.css)
    { name: "dark", value: "#212121" }, // --foundation-bg-dark-1
    { name: "dark-secondary", value: "#303030" }, // --foundation-bg-dark-2
    { name: "dark-tertiary", value: "#414141" }, // --foundation-bg-dark-3
    // Light theme backgrounds (from foundations.css)
    { name: "light", value: "#ffffff" }, // --foundation-bg-light-1
    { name: "light-secondary", value: "#e8e8e8" }, // --foundation-bg-light-2
    { name: "light-tertiary", value: "#f3f3f3" }, // --foundation-bg-light-3
  ],
};

const preview: Preview = {
  parameters: {
    // Actions configuration - auto-detect event handlers
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },

    // Controls configuration
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: "requiredFirst",
    },

    // Viewport configuration
    viewport: {
      viewports: customViewports,
    },

    // Background configuration
    backgrounds,

    // Accessibility testing configuration (WCAG 2.2 AA)
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "focus-order-semantics", enabled: true },
          { id: "landmark-one-main", enabled: false }, // Disabled for component isolation
          { id: "region", enabled: false }, // Disabled for component isolation
          { id: "page-has-heading-one", enabled: false }, // Disabled for component isolation
        ],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"],
        },
      },
    },

    // Documentation configuration
    docs: {
      toc: {
        contentsSelector: ".sbdocs-content",
        headingSelector: "h1, h2, h3",
        title: "Table of Contents",
      },
    },

    // Layout default
    layout: "centered",
  },

  // Global args with mock functions for common callbacks
  args: {
    onClick: fn(),
    onChange: fn(),
    onSubmit: fn(),
    onClose: fn(),
    onOpen: fn(),
    onSelect: fn(),
  },

  // Decorators
  decorators: [
    (Story, context) => {
      // Apply dark/light theme based on backgrounds selection
      const bgValue = context.globals.backgrounds?.value;
      const resolvedBackground =
        backgrounds.values.find((value) => value.name === bgValue)?.value ?? bgValue;
      const lightBackgrounds = new Set([
        "#ffffff",
        "#e8e8e8",
        "#f3f3f3",
        "var(--foundation-bg-light-1)",
        "var(--foundation-bg-light-2)",
        "var(--foundation-bg-light-3)",
      ]);
      const isLight =
        resolvedBackground != null &&
        (lightBackgrounds.has(resolvedBackground) ||
          /--foundation-bg-light-/.test(resolvedBackground));
      const isDark = !isLight;

      return (
        <HostProvider host={host}>
          <AppsSDKUIProvider linkComponent="a">
            <div
              className={isDark ? "dark" : "light"}
              style={{
                backgroundColor: resolvedBackground || "var(--foundation-bg-dark-1)",
                color: isDark
                  ? "var(--foundation-text-dark-primary)"
                  : "var(--foundation-text-light-primary)",
                minHeight: context.parameters.layout === "fullscreen" ? "100vh" : "auto",
                padding: context.parameters.layout === "centered" ? "1rem" : 0,
              }}
            >
              <Story />
            </div>
          </AppsSDKUIProvider>
        </HostProvider>
      );
    },
  ],

  // Enable autodocs for all stories
  tags: ["autodocs"],
};

export default preview;
