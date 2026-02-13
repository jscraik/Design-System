import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/testing/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/*.stories.*"],
    snapshotDirectory: "./src/tests/__snapshots__",
    snapshotFormat: {},
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/components/**/*.tsx", "src/app/**/*.tsx"],
      exclude: [
        "**/*.stories.*",
        "**/*.test.*",
        "**/index.ts",
        "src/integrations/**",
        "src/testing/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@design-studio/tokens": path.resolve(__dirname, "../tokens/src"),
      "@design-studio/runtime": path.resolve(__dirname, "../runtime/src"),
      // Mock the vendor re-exports to avoid apps-sdk-ui ESM issues
      "./integrations/apps-sdk/vendor": path.resolve(
        __dirname,
        "./src/testing/mocks/appsSdkUi.tsx",
      ),
      "../integrations/apps-sdk/vendor": path.resolve(
        __dirname,
        "./src/testing/mocks/appsSdkUi.tsx",
      ),
      "../../integrations/apps-sdk/vendor": path.resolve(
        __dirname,
        "./src/testing/mocks/appsSdkUi.tsx",
      ),
      "../../../integrations/apps-sdk/vendor": path.resolve(
        __dirname,
        "./src/testing/mocks/appsSdkUi.tsx",
      ),
      "./integrations/apps-sdk": path.resolve(__dirname, "./src/testing/mocks/appsSdkUi.tsx"),
      "../integrations/apps-sdk": path.resolve(__dirname, "./src/testing/mocks/appsSdkUi.tsx"),
      "../../integrations/apps-sdk": path.resolve(__dirname, "./src/testing/mocks/appsSdkUi.tsx"),
      "../../../integrations/apps-sdk": path.resolve(
        __dirname,
        "./src/testing/mocks/appsSdkUi.tsx",
      ),
      // Alias for test utils - support both old and new paths
      "../../../test/utils": path.resolve(__dirname, "./src/testing/utils.tsx"),
      "../../../../test/utils": path.resolve(__dirname, "./src/testing/utils.tsx"),
      "../../../testing/utils": path.resolve(__dirname, "./src/testing/utils.tsx"),
      "../../../../testing/utils": path.resolve(__dirname, "./src/testing/utils.tsx"),
    },
  },
});
