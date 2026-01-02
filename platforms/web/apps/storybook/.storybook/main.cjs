// Storybook configuration for ChatUI Design System (CJS for Node ESM projects)
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../../../../..");
const uiRoot = path.join(repoRoot, "packages/ui/src");
const uiStorybookRoot = path.join(uiRoot, "storybook");

/**
 * Rollup plugin to remove "use client" and "use server" directives.
 * These directives are for React Server Components but are not needed
 * in client-only environments like Storybook.
 */
function removeModuleDirectives() {
  return {
    name: "remove-module-directives",
    enforce: "pre",

    transform(code) {
      // Match both "use client" and "use server" with any quote style
      const useDirectiveRegex = /^("|')use (client|server)\1;\s*/;

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

/** @type {import("@storybook/react-vite").StorybookConfig} */
const config = {
  stories: [
    // Overview pages (top level)
    {
      directory: path.join(uiStorybookRoot, "docs"),
      title: "Overview",
      files: "**/*.mdx",
    },
    {
      directory: path.join(uiStorybookRoot, "docs"),
      title: "Overview",
      files: "**/*.stories.tsx",
    },

    // Design System
    {
      directory: path.join(uiStorybookRoot, "design-system"),
      title: "Design System",
      files: "**/*.stories.tsx",
      // Use titlePrefix to avoid "Design System Design Tokens"
      titlePrefix: "",
    },

    // Templates (organized layout examples)
    {
      directory: path.join(uiRoot, "templates"),
      title: "Templates",
      files: "**/*.stories.tsx",
    },

    // Chat Components (core chat features)
    {
      directory: path.join(uiRoot, "app/chat"),
      title: "Components/Chat",
      files: "**/*.stories.tsx",
    },

    // Settings Components
    {
      directory: path.join(uiRoot, "app/settings"),
      title: "Components/Settings",
      files: "**/*.stories.tsx",
    },

    // UI Primitives (organized by category)
    {
      directory: path.join(uiRoot, "components/ui/base"),
      title: "Components/UI/Base",
      files: "**/*.stories.tsx",
    },
    {
      directory: path.join(uiRoot, "components/ui/forms"),
      title: "Components/UI/Forms",
      files: "**/*.stories.tsx",
    },
    {
      directory: path.join(uiRoot, "components/ui/navigation"),
      title: "Components/UI/Navigation",
      files: "**/*.stories.tsx",
    },
    {
      directory: path.join(uiRoot, "components/ui/overlays"),
      title: "Components/UI/Overlays",
      files: "**/*.stories.tsx",
    },
    {
      directory: path.join(uiRoot, "components/ui/feedback"),
      title: "Components/UI/Feedback",
      files: "**/*.stories.tsx",
    },
    {
      directory: path.join(uiRoot, "components/ui/data-display"),
      title: "Components/UI/Data Display",
      files: "**/*.stories.tsx",
    },
    {
      directory: path.join(uiRoot, "components/ui/chat"),
      title: "Components/UI/Chat UI",
      files: "**/*.stories.tsx",
    },

    // Modals
    {
      directory: path.join(uiRoot, "app/modals"),
      title: "Components/Modals",
      files: "**/*.stories.tsx",
    },

    // Design System Showcase (documentation components)
    {
      directory: path.join(uiRoot, "design-system/showcase"),
      title: "Documentation",
      files: "**/*.stories.tsx",
    },

    // App Pages
    {
      directory: path.join(uiStorybookRoot, "pages"),
      title: "Pages",
      files: "**/*.stories.tsx",
    },

    // Root App
    {
      directory: path.join(uiStorybookRoot, "App"),
      title: "App",
      files: "**/*.stories.tsx",
    },
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {
    autodocs: "tag",
  },

  sidebar: {
    renderLabel: ({ title, type }) => {
      if (type === "story") {
        return title.replace(/^[^.]+\./, "");
      }
      return title;
    },
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  staticDirs: ["../public"],

  viteFinal: async (viteConfig) => {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    viteConfig.plugins = [removeModuleDirectives(), ...(viteConfig.plugins ?? []), tailwindcss()];
    viteConfig.base = "./";

    viteConfig.resolve = {
      ...(viteConfig.resolve ?? {}),
      alias: {
        ...(viteConfig.resolve?.alias ?? {}),
        "@chatui/ui": path.join(repoRoot, "packages/ui/src"),
        "@chatui/runtime": path.join(repoRoot, "packages/runtime/src"),
      },
    };

    viteConfig.server = {
      ...(viteConfig.server ?? {}),
      fs: {
        ...(viteConfig.server?.fs ?? {}),
        strict: false,
        allow: [repoRoot, path.resolve(repoRoot, "packages")],
      },
    };

    viteConfig.optimizeDeps = {
      ...(viteConfig.optimizeDeps ?? {}),
      include: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/blocks"],
    };

    viteConfig.build = {
      ...(viteConfig.build ?? {}),
      rollupOptions: {
        ...(viteConfig.build?.rollupOptions ?? {}),
        external: ["@storybook/addon-docs", "@storybook/blocks", "@storybook/addon-a11y"],
      },
      minify: false,
    };

    viteConfig.ssr = {
      ...(viteConfig.ssr ?? {}),
      noExternal: true,
    };

    return viteConfig;
  },
};

module.exports = config;
