import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Validate required environment variables for production builds
  if (mode === "production" && !env.WORKER_DOMAIN_BASE) {
    throw new Error(
      "WORKER_DOMAIN_BASE is required for production builds. " +
        "Set this in your .env file or Cloudflare environment variables.",
    );
  }

  return {
    base: env.WORKER_DOMAIN_BASE || "/",
    plugins: [
      cloudflare({
        // Configure Cloudflare plugin for widget assets
        persist: {
          path: ".wrangler/state/v3",
        },
      }),
    ],
    build: {
      // Build configuration for Cloudflare Workers
      target: "esnext",
      rollupOptions: {
        // External dependencies that should be bundled by Cloudflare
        external: ["cloudflare:workers"],
      },
    },
    environments: {
      // Client environment for widget assets
      client: {
        build: {
          outDir: "dist/client",
          emptyOutDir: true,
          rollupOptions: {
            // Copy widget assets from the widgets package
            input: {
              // This will be populated by the widget discovery
            },
          },
        },
      },
      // Worker environment for the MCP server
      worker: {
        build: {
          outDir: "dist/worker",
          lib: {
            entry: "src/worker/index.ts",
            formats: ["es"],
          },
          rollupOptions: {
            external: ["cloudflare:workers", "@modelcontextprotocol/sdk"],
          },
        },
      },
    },
  };
});
