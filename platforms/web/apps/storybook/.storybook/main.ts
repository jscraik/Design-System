import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../../../..");
const uiRoot = path.join(repoRoot, "packages/ui/src");
const uiStorybookRoot = path.join(uiRoot, "storybook");
const toStorybookRelative = (absolutePath: string) =>
  path.relative(__dirname, absolutePath).split(path.sep).join(path.posix.sep);

/**
 * Rollup plugin to remove "use client" and "use server" directives.
 * These directives are for React Server Components but are not needed
 * in client-only environments like Storybook.
 */
function removeModuleDirectives() {
  return {
    name: "remove-module-directives",
    enforce: "pre",

    transform(code: string) {
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

const config = {
  stories: [
    // Overview pages (top level)
    {
      directory: toStorybookRelative(path.join(uiStorybookRoot, "docs")),
      title: "Overview",
      files: "**/*.mdx",
    },
    {
      directory: toStorybookRelative(path.join(uiStorybookRoot, "docs")),
      title: "Overview",
      files: "**/*.stories.tsx",
    },

    // Design System
    {
      directory: toStorybookRelative(path.join(uiStorybookRoot, "design-system")),
      title: "Design System",
      files: "**/*.stories.tsx",
      // Use titlePrefix to avoid "Design System Design Tokens"
      titlePrefix: "",
    },

    // Templates (organized layout examples)
    {
      directory: toStorybookRelative(path.join(uiRoot, "templates")),
      title: "Templates",
      files: "**/*.stories.tsx",
    },

    // Chat Components (core chat features)
    {
      directory: toStorybookRelative(path.join(uiRoot, "app/chat")),
      title: "Components/Chat",
      files: "**/*.stories.tsx",
    },

    // Settings Components
    {
      directory: toStorybookRelative(path.join(uiRoot, "app/settings")),
      title: "Components/Settings",
      files: "**/*.stories.tsx",
    },

    // UI Primitives (organized by category)
    {
      directory: toStorybookRelative(path.join(uiRoot, "components/ui/base")),
      title: "Components/UI/Base",
      files: "**/*.stories.tsx",
    },
    {
      directory: toStorybookRelative(path.join(uiRoot, "components/ui/forms")),
      title: "Components/UI/Forms",
      files: "**/*.stories.tsx",
    },
    {
      directory: toStorybookRelative(path.join(uiRoot, "components/ui/navigation")),
      title: "Components/UI/Navigation",
      files: "**/*.stories.tsx",
    },
    {
      directory: toStorybookRelative(path.join(uiRoot, "components/ui/overlays")),
      title: "Components/UI/Overlays",
      files: "**/*.stories.tsx",
    },
    {
      directory: toStorybookRelative(path.join(uiRoot, "components/ui/feedback")),
      title: "Components/UI/Feedback",
      files: "**/*.stories.tsx",
    },
    {
      directory: toStorybookRelative(path.join(uiRoot, "components/ui/data-display")),
      title: "Components/UI/Data Display",
      files: "**/*.stories.tsx",
    },
    {
      directory: toStorybookRelative(path.join(uiRoot, "components/ui/chat")),
      title: "Components/UI/Chat UI",
      files: "**/*.stories.tsx",
    },

    // Modals
    {
      directory: toStorybookRelative(path.join(uiRoot, "app/modals")),
      title: "Components/Modals",
      files: "**/*.stories.tsx",
    },

    // Design System Showcase (documentation components)
    {
      directory: toStorybookRelative(path.join(uiRoot, "design-system/showcase")),
      title: "Documentation",
      files: "**/*.stories.tsx",
    },

    // App Pages
    {
      directory: toStorybookRelative(path.join(uiStorybookRoot, "pages")),
      title: "Pages",
      files: "**/*.stories.tsx",
    },

    // Root App
    {
      directory: toStorybookRelative(path.join(uiStorybookRoot, "App")),
      title: "App",
      files: "**/*.stories.tsx",
    },
  ],

  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {
    autodocs: "tag",
  },

  sidebar: {
    renderLabel: ({ title, type }: { title: string; type: string }) => {
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
      propFilter: (prop: { parent?: { fileName?: string } }) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName ?? "") : true,
    },
  },

  staticDirs: ["../public"],

  viteFinal: async (viteConfig: any) => {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    viteConfig.plugins = [removeModuleDirectives(), ...(viteConfig.plugins ?? []), tailwindcss()];
    viteConfig.base = "./";

    viteConfig.resolve = {
      ...(viteConfig.resolve ?? {}),
      alias: {
        ...(viteConfig.resolve?.alias ?? {}),
        "@astudio/ui": path.join(repoRoot, "packages/ui/src"),
        "@astudio/runtime": path.join(repoRoot, "packages/runtime/src"),
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
      include: [
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        "@storybook/addon-docs/blocks",
        "@radix-ui/react-visually-hidden",
        "@radix-ui/react-dialog",
        "@radix-ui/react-popover",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-tooltip",
        "@radix-ui/react-portal",
        "@radix-ui/react-presence",
        "@radix-ui/react-dismissable-layer",
        "@radix-ui/react-focus-scope",
        "@radix-ui/react-focus-guards",
      ],
    };

    viteConfig.build = {
      ...(viteConfig.build ?? {}),
      rollupOptions: {
        ...(viteConfig.build?.rollupOptions ?? {}),
        external: [
          "@storybook/addon-docs",
          "@storybook/addon-docs/blocks",
          "@storybook/addon-a11y",
        ],
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

export default config;
