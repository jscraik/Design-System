import path from "path";

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      // Allow importing workspace packages during dev.
      allow: [path.resolve(__dirname, "../../../..")],
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Category-based manual chunks for optimal tree-shaking
        // This enables imports like: import { Button, Input } from "@design-studio/ui"
        // while only bundling the categories actually used
        manualChunks: (id) => {
          // DesignStudio UI package - split by category
          if (id.includes("@design-studio/ui") || id.includes("/packages/ui/")) {
            // Source files during development
            if (id.includes("/src/components/ui/base/")) {
              return "design-studio-base";
            }
            if (id.includes("/src/components/ui/chat/")) {
              return "design-studio-chat";
            }
            if (id.includes("/src/components/ui/navigation/")) {
              return "design-studio-navigation";
            }
            if (id.includes("/src/components/ui/overlays/")) {
              return "design-studio-overlays";
            }
            if (id.includes("/src/components/ui/forms/")) {
              return "design-studio-forms";
            }
            if (id.includes("/src/components/ui/layout/")) {
              return "design-studio-layout";
            }
            if (id.includes("/src/components/ui/data-display/")) {
              return "design-studio-data";
            }
            if (id.includes("/src/components/ui/feedback/")) {
              return "design-studio-feedback";
            }
            if (id.includes("/src/icons/")) {
              return "design-studio-icons";
            }

            // Built dist files
            if (id.includes("/dist/")) {
              // Category entry points
              if (id.includes("/base.js")) {
                return "design-studio-base";
              }
              if (id.includes("/chat.js")) {
                return "design-studio-chat";
              }
              if (id.includes("/navigation.js")) {
                return "design-studio-navigation";
              }
              if (id.includes("/overlays.js")) {
                return "design-studio-overlays";
              }
              if (id.includes("/forms.js")) {
                return "design-studio-forms";
              }
              if (id.includes("/layout.js")) {
                return "design-studio-layout";
              }
              if (id.includes("/data-display.js")) {
                return "design-studio-data";
              }
              if (id.includes("/feedback.js")) {
                return "design-studio-feedback";
              }
              if (id.includes("/icons.js")) {
                return "design-studio-icons";
              }
              // Main index and other exports
              return "design-studio-core";
            }
          }

          // DesignStudio tokens
          if (id.includes("@design-studio/tokens")) {
            return "design-studio-tokens";
          }

          // DesignStudio runtime
          if (id.includes("@design-studio/runtime")) {
            return "design-studio-runtime";
          }

          // node_modules
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react")) {
              return "react";
            }
            if (id.includes("@radix-ui")) {
              return "radix";
            }
            if (id.includes("lucide-react")) {
              return "icons";
            }
            if (id.includes("@openai")) {
              return "openai";
            }
            return "vendor";
          }

          return undefined;
        },
      },
    },
  },
});
