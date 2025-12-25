import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../../packages/ui/src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  viteFinal: async (viteConfig) => {
    // Align with the Vite app setup: Tailwind 4 plugin + workspace FS allow.
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    viteConfig.base = "./";
    viteConfig.server = {
      ...(viteConfig.server ?? {}),
      fs: {
        ...(viteConfig.server?.fs ?? {}),
        allow: [path.resolve(__dirname, "../../")],
      },
    };
    return viteConfig;
  },
};

export default config;
