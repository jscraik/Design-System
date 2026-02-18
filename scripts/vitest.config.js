import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    globals: true,
    include: ["**/*.test.{js,mjs,ts}"],
    exclude: ["node_modules", "dist", ".build-cache", ".test-build-pipeline"],
    reporter: ["verbose"],
    pool: "forks",
    singleThread: true,
  },
});
