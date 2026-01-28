import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const entries = {
  index: resolve(__dirname, "src/index.ts"),
  app: resolve(__dirname, "src/app/index.ts"),
  icons: resolve(__dirname, "src/icons/index.ts"),
  dev: resolve(__dirname, "src/dev.ts"),
  base: resolve(__dirname, "src/components/ui/base/index.ts"),
  "data-display": resolve(__dirname, "src/components/ui/data-display/index.ts"),
  feedback: resolve(__dirname, "src/components/ui/feedback/index.ts"),
  forms: resolve(__dirname, "src/components/ui/forms/index.ts"),
  chat: resolve(__dirname, "src/app/chat/index.ts"),
  layout: resolve(__dirname, "src/components/ui/layout/index.ts"),
  navigation: resolve(__dirname, "src/components/ui/navigation/index.ts"),
  overlays: resolve(__dirname, "src/components/ui/overlays/index.ts"),
  modals: resolve(__dirname, "src/app/modals/index.ts"),
  settings: resolve(__dirname, "src/app/settings/index.ts"),
  showcase: resolve(__dirname, "src/design-system/showcase/index.ts"),
  styles: resolve(__dirname, "src/styles.ts"),
  templates: resolve(__dirname, "src/templates/index.ts"),
  experimental: resolve(__dirname, "src/experimental.ts"),
};

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      outDir: "dist",
    }),
  ],
  resolve: {
    alias: {
      // Updated to use DesignStudio package names
      "@design-studio/runtime": resolve(__dirname, "../runtime/src"),
      "@design-studio/tokens": resolve(__dirname, "../tokens/src"),
    },
  },
  build: {
    lib: {
      entry: entries,
      name: "DesignStudioUI",
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        // Enable build-time code splitting for category imports
        manualChunks: (id) => {
          // Group UI components by category for optimal tree-shaking
          if (id.includes("/src/components/ui/base/")) {
            return "base";
          }
          if (id.includes("/src/components/ui/chat/")) {
            return "chat";
          }
          if (id.includes("/src/components/ui/navigation/")) {
            return "navigation";
          }
          if (id.includes("/src/components/ui/overlays/")) {
            return "overlays";
          }
          if (id.includes("/src/components/ui/forms/")) {
            return "forms";
          }
          if (id.includes("/src/components/ui/layout/")) {
            return "layout";
          }
          if (id.includes("/src/components/ui/data-display/")) {
            return "data-display";
          }
          if (id.includes("/src/components/ui/feedback/")) {
            return "feedback";
          }
          if (id.includes("/src/icons/")) {
            return "icons";
          }
          if (id.includes("/src/app/")) {
            return "app";
          }
          if (id.includes("/src/templates/")) {
            return "templates";
          }
          // Default chunk for utilities and other exports
          return undefined;
        },
      },
    },
    cssCodeSplit: false,
    outDir: "dist",
  },
});
