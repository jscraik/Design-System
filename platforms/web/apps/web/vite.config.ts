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
        manualChunks(id) {
          if (id.includes("@astudio/ui")) {
            if (id.includes("/dist/")) {
              if (id.includes("/chat.")) return "astudio-chat";
              if (
                id.includes("/settings.") ||
                id.includes("/account-") ||
                id.includes("/SettingRow-") ||
                id.includes("/DiscoverySettingsModal")
              ) {
                return "astudio-settings";
              }
              if (id.includes("/forms.") || id.includes("/form-") || id.includes("/range-slider")) {
                return "astudio-forms";
              }
              if (id.includes("/layout.") || id.includes("/tabs-")) {
                return "astudio-navigation";
              }
              if (id.includes("/progress-") || id.includes("/chart-")) {
                return "astudio-data";
              }
              if (id.includes("/button-") || id.includes("/icon-button") || id.includes("/card-")) {
                return "astudio-base";
              }
              if (id.includes("/utils-")) return "astudio-utils";
              if (id.includes("/templates.")) return "astudio-templates";
              if (id.includes("/showcase.")) return "astudio-showcase";
              if (id.includes("/dev.")) return "astudio-dev";
              return "astudio-core";
            }
            return "astudio-core";
          }
          if (id.includes("@astudio/tokens") || id.includes("/packages/tokens/")) {
            return "astudio-tokens";
          }
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
            if (id.includes("lodash")) {
              return "lodash";
            }
            return "vendor";
          }
          if (id.includes("/packages/ui/dist/")) {
            if (id.includes("/chat.")) return "astudio-chat";
            if (
              id.includes("/settings.") ||
              id.includes("/account-") ||
              id.includes("/SettingRow-") ||
              id.includes("/DiscoverySettingsModal")
            ) {
              return "astudio-settings";
            }
            if (id.includes("/forms.") || id.includes("/form-") || id.includes("/range-slider")) {
              return "astudio-forms";
            }
            if (id.includes("/layout.") || id.includes("/tabs-")) {
              return "astudio-navigation";
            }
            if (id.includes("/progress-") || id.includes("/chart-")) {
              return "astudio-data";
            }
            if (id.includes("/button-") || id.includes("/icon-button") || id.includes("/card-")) {
              return "astudio-base";
            }
            if (id.includes("/utils-")) return "astudio-utils";
            if (id.includes("/templates.")) return "astudio-templates";
            if (id.includes("/showcase.")) return "astudio-showcase";
            if (id.includes("/dev.")) return "astudio-dev";
            return "astudio-core";
          }
          return undefined;
        },
      },
    },
  },
});
