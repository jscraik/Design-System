/**
 * Vite configuration for tree-shaking validation prototype
 *
 * This tests the manualChunks approach for DesignStudio
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        "category-imports": "./category-imports.tsx",
        "per-component": "./per-component-imports.tsx",
        minimal: "./minimal-imports.tsx",
      },
      name: "DesignStudioPrototype",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split by category for optimal caching
          if (id.includes("/base/")) return "base";
          if (id.includes("/navigation/")) return "navigation";
          if (id.includes("/overlays/")) return "overlays";
          if (id.includes("/forms/")) return "forms";
          if (id.includes("/chat/")) return "chat";

          // Vendor chunks
          if (id.includes("node_modules/react")) return "react-vendor";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
  esbuild: {
    // Preserve names for better debugging
    keepNames: true,
  },
});
