import { resolve } from "node:path";

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
  // Warn handler to handle circular dependencies
  onwarn(warning, warn) {
    // Ignore circular dependency warnings for @openai/apps-sdk-ui components
    // These are safe to ignore as they're re-exports, not actual circular logic
    if (warning.code === "CIRCULAR_DEPENDENCY") {
      const message = warning.toString();
      if (
        message.includes("apps-sdk-ui") ||
        message.includes("apps-sdk") ||
        message.includes("Icon") ||
        message.includes("Download") ||
        message.includes("Sparkles")
      ) {
        return;
      }
    }
    warn(warning);
  },
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
        // Disable manual chunks to avoid circular dependencies with apps-sdk-ui
        // Vite's automatic code splitting will handle this more safely
        manualChunks: undefined,
      },
    },
    cssCodeSplit: false,
    outDir: "dist",
  },
});
