import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/*.stories.*"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/app/components/**/*.tsx"],
      exclude: ["**/*.stories.*", "**/*.test.*", "**/index.ts", "src/vendor/**"],
    },
  },
  resolve: {
    alias: {
      "@chatui/tokens": path.resolve(__dirname, "../tokens/src"),
      // Mock the vendor re-exports to avoid apps-sdk-ui ESM issues
      "./vendor/appsSdkUi": path.resolve(__dirname, "./src/test/__mocks__/vendor/appsSdkUi.tsx"),
      "../vendor/appsSdkUi": path.resolve(__dirname, "./src/test/__mocks__/vendor/appsSdkUi.tsx"),
      "../../vendor/appsSdkUi": path.resolve(
        __dirname,
        "./src/test/__mocks__/vendor/appsSdkUi.tsx",
      ),
      "../../../vendor/appsSdkUi": path.resolve(
        __dirname,
        "./src/test/__mocks__/vendor/appsSdkUi.tsx",
      ),
      // Alias for test utils - support both old and new paths
      "../../../test/utils": path.resolve(__dirname, "./src/test/utils.tsx"),
      "../../../../test/utils": path.resolve(__dirname, "./src/test/utils.tsx"),
    },
  },
});
