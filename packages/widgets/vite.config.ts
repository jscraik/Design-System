import { resolve } from "path";
import { fileURLToPath } from "url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Bundle size budgets - warn at 800KB to accommodate Three.js core chunk
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      // Curated widget set (restyled to Apps SDK UI tokens).
      input: {
        "auth-demo": resolve(__dirname, "src/auth-demo/index.html"),
        "chat-view": resolve(__dirname, "src/chat-view/index.html"),
        "dashboard-widget": resolve(__dirname, "src/dashboard-widget/index.html"),
        "kitchen-sink-lite": resolve(__dirname, "src/kitchen-sink-lite/index.html"),
        "pizzaz-carousel": resolve(__dirname, "src/pizzaz-carousel/index.html"),
        "pizzaz-gallery": resolve(__dirname, "src/pizzaz-gallery/index.html"),
        "pizzaz-markdown": resolve(__dirname, "src/pizzaz-markdown/index.html"),
        "pizzaz-shop": resolve(__dirname, "src/pizzaz-shop/index.html"),
        "pizzaz-table": resolve(__dirname, "src/pizzaz-table/index.html"),
        "search-results": resolve(__dirname, "src/search-results/index.html"),
        "shopping-cart": resolve(__dirname, "src/shopping-cart/index.html"),
        "solar-system": resolve(__dirname, "src/solar-system/index.html"),
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        // Manual chunks to optimize bundle sizes
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-motion";
          }
          if (
            id.includes("node_modules/three-stdlib/") ||
            id.includes("node_modules/postprocessing/")
          ) {
            return "vendor-three-post";
          }
          if (id.includes("node_modules/@react-three/")) {
            return "vendor-three-react";
          }
          if (id.includes("node_modules/three/src/")) {
            const subpath = id.split("node_modules/three/src/")[1] ?? "";
            const segment = subpath.split("/")[0] || "core";
            return `vendor-three-${segment}`;
          }
          if (id.includes("node_modules/three/")) {
            return "vendor-three-core";
          }
          return undefined;
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
