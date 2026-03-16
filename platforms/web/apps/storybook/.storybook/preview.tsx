import "./preview.css";
import "dialkit/styles.css";

import { createMockHost, HostProvider } from "@design-studio/runtime";
import { AppsSDKUIProvider } from "@design-studio/ui";
import type { Preview } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { initialize as mswInitialize, mswLoader } from "msw-storybook-addon";
import React from "react";

// Make React available globally for MDX files
(globalThis as any).React = React;

// ─── MSW Service Worker ───────────────────────────────────────────────────────
// Starts the service worker on first load. `onUnhandledRequest: "bypass"` means
// any request without a matching handler is forwarded to the network, not blocked.
// Handlers are applied per-story via `parameters.msw.handlers`.
mswInitialize({ onUnhandledRequest: "bypass" });

let AgentationComponent: React.ComponentType<{ endpoint?: string }> | null = null;
let DialRootComponent: React.ComponentType | null = null;

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  import("agentation").then((mod) => {
    AgentationComponent = mod.Agentation;
  }).catch(() => {
    // agentation unavailable — annotations simply won't appear
  });
  
  import("dialkit").then((mod) => {
    DialRootComponent = mod.DialRoot;
  }).catch(() => {
    // dialkit unavailable
  });
}

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

// ─── Theme globals API (Storybook 9+ best practice) ──────────────────────────
// `globalTypes` defines the toolbar switcher. Stories can override individually:
//   export const DarkOnly: Story = { globals: { theme: 'dark' } };
//
const themeGlobal = {
  description: "Design system theme",
  toolbar: {
    title: "Theme",
    icon: "circlehollow" as const,
    items: [
      { value: "dark", title: "Dark", icon: "moon" as const },
      { value: "light", title: "Light", icon: "sun" as const },
      { value: "highContrast", title: "High Contrast", icon: "accessibility" as const },
    ],
    dynamicTitle: true,
  },
};

const preview: Preview = {
  // ─── Globals API ────────────────────────────────────────────────────────────
  // Defines the available globals and their toolbar controls.
  globalTypes: {
    theme: themeGlobal,
  },

  // Default global values — applied to every story unless overridden.
  initialGlobals: {
    theme: "dark",
  },

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

    // Background configuration — canvas colour only, decoupled from theme logic
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
    options: {
      storySort: {
        order: ["Overview", "Design System", "Documentation", "Templates", "Components"],
        method: "alphabetical",
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

  // ─── Decorators ──────────────────────────────────────────────────────────────
  // Reads `context.globals.theme` (set by toolbar or story-level globals override)
  // and applies the correct data-theme attribute + CSS token values.
  //
  // Per-story theme override example:
  //   export const DarkOnly: Story = { globals: { theme: 'dark' } };
  decorators: [
    (Story, context) => {
      // Read explicit theme global — no longer derived from background hex colour.
      const theme = (context.globals.theme as "dark" | "light" | "highContrast") ?? "dark";
      const isLight = theme === "light";
      const isHighContrast = theme === "highContrast";

      // Background colour for the canvas wrapper
      const bgValue = context.globals.backgrounds?.value;
      const resolvedBackground =
        backgrounds.values.find((value) => value.name === bgValue)?.value ?? bgValue;

      // Derive colorScheme for browser affordances (scrollbars, system UI)
      const colorScheme = isLight ? "light" : "dark";

      return (
        <HostProvider host={host}>
          <AppsSDKUIProvider linkComponent="a">
            <div
              className={theme}
              data-theme={theme}
              data-high-contrast={isHighContrast ? "" : undefined}
              style={{
                backgroundColor: resolvedBackground ||
                  (isLight ? "var(--foundation-bg-light-1)" : "var(--foundation-bg-dark-1)"),
                color: isLight
                  ? "var(--foundation-text-light-primary)"
                  : "var(--foundation-text-dark-primary)",
                colorScheme,
                minHeight: context.parameters.layout === "fullscreen" ? "100vh" : "auto",
                padding:
                  context.parameters.layout === "centered" ? "var(--foundation-space-16)" : 0,
              }}
            >
              <Story />
            </div>
            {/* Dev overlays: Agentation and Dialkit — dev only, never in production builds */}
            {import.meta.env.DEV && AgentationComponent && (
              <AgentationComponent endpoint="http://localhost:4747" />
            )}
            {import.meta.env.DEV && DialRootComponent && (
              <DialRootComponent />
            )}
          </AppsSDKUIProvider>
        </HostProvider>
      );
    },
  ],

  // Enable autodocs for all stories
  tags: ["autodocs"],

  // ─── MSW: activate per-story request handlers ──────────────────────────────
  // Any story with `parameters.msw.handlers` will have those handlers activated
  // before the story mounts and cleaned up after it unmounts.
  loaders: [mswLoader],
};

export default preview;
