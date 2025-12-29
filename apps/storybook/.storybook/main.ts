// Storybook 10 configuration for ChatUI Design System
import type { StorybookConfig } from "@storybook/react-vite";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Rollup plugin to remove "use client" and "use server" directives.
 * These directives are for React Server Components but are not needed
 * in client-only environments like Storybook.
 */
function removeModuleDirectives(): Plugin {
  return {
    name: "remove-module-directives",
    enforce: "pre",

    transform(code) {
      // Match both "use client" and "use server" with any quote style
      const useDirectiveRegex = /^(["'])use (client|server)\1;\s*/;

      if (useDirectiveRegex.test(code)) {
        return {
          code: code.replace(useDirectiveRegex, ""),
          map: null,
        };
      }

      return null;
    },
  };
}

const config: StorybookConfig = {
  stories: [
    "../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],

  addons: [
    // Essential addons (Storybook 10)
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  // TypeScript configuration
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },

  // Static directories for assets
  staticDirs: ["../public"],

  viteFinal: async (viteConfig) => {
    // Add plugin to remove "use client" directives, then Tailwind
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    viteConfig.plugins = [
      removeModuleDirectives(),
      ...(viteConfig.plugins ?? []),
      tailwindcss(),
    ];
    viteConfig.base = "./";

    const repoRoot = path.resolve(__dirname, "../../..");
    viteConfig.server = {
      ...(viteConfig.server ?? {}),
      fs: {
        ...(viteConfig.server?.fs ?? {}),
        strict: false,
        allow: [repoRoot, path.resolve(repoRoot, "packages")],
      },
    };

    // Optimize dependencies - exclude Radix UI since it has "use client" directives
    viteConfig.optimizeDeps = {
      ...(viteConfig.optimizeDeps ?? {}),
      include: [
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
      ],
      // Don't pre-bundle Radix UI modules
      exclude: [
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-popper",
        "@radix-ui/react-menu",
        "@radix-ui/react-navigation-menu",
        "@radix-ui/react-tooltip",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-tabs",
        "@radix-ui/react-switch",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-radio-group",
        "@radix-ui/react-slider",
        "@radix-ui/react-separator",
        "@radix-ui/react-label",
        "@radix-ui/react-slot",
        "@radix-ui/react-accordion",
        "@radix-ui/react-collapsible",
        "@radix-ui/react-avatar",
        "@radix-ui/react-progress",
        "@radix-ui/react-visually-hidden",
        "@radix-ui/react-collection",
        "@radix-ui/react-dismissable-layer",
        "@radix-ui/react-focus-guards",
        "@radix-ui/react-focus-scope",
        "@radix-ui/react-roving-focus",
        "@radix-ui/react-context",
        "@radix-ui/react-id",
        "@radix-ui/react-primitive",
      ],
    };

    // Build configuration
    viteConfig.build = {
      ...(viteConfig.build ?? {}),
      rollupOptions: {
        ...(viteConfig.build?.rollupOptions ?? {}),
      },
      // Disable esbuild minification to avoid parsing issues
      minify: false,
    };

    // SSR configuration
    viteConfig.ssr = {
      ...(viteConfig.ssr ?? {}),
      // Don't externalize Radix UI
      noExternal: [
        /^@radix-ui\/.*/,
      ],
    };

    return viteConfig;
  },
};

export default config;
