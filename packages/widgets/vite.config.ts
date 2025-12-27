import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        "kitchen-sink-lite": resolve(
          __dirname,
          "src/kitchen-sink-lite/index.html"
        ),
        "pizzaz-table": resolve(__dirname, "src/pizzaz-table/index.html"),
        "pizzaz-markdown": resolve(
          __dirname,
          "src/pizzaz-markdown/index.html"
        ),
        "pizzaz-carousel": resolve(
          __dirname,
          "src/pizzaz-carousel/index.html"
        ),
        "pizzaz-gallery": resolve(
          __dirname,
          "src/pizzaz-gallery/index.html"
        ),
        "solar-system": resolve(__dirname, "src/solar-system/index.html"),
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: [resolve(__dirname, "../..")],
    },
  },
});
