#!/usr/bin/env node

import fastGlob from "fast-glob";
const glob = fastGlob;
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateRoot = resolve(__dirname, "..");
const widgetsRoot = resolve(__dirname, "../../widgets");

/**
 * Build script for Cloudflare Workers deployment
 * Copies widget assets and generates manifest for deployment
 */
async function buildWidgets() {
  console.log("🔧 Building widgets for Cloudflare Workers deployment...");

  // Ensure widgets are built
  const widgetsDistPath = resolve(widgetsRoot, "dist");
  if (!existsSync(widgetsDistPath)) {
    console.error("❌ Widgets not built. Run: pnpm -C packages/widgets build");
    process.exit(1);
  }

  // Read the widget manifest
  const manifestPath = resolve(widgetsRoot, "src/sdk/generated/widget-manifest.ts");
  if (!existsSync(manifestPath)) {
    console.error("❌ Widget manifest not found. Ensure widgets are built.");
    process.exit(1);
  }

  // Create client dist directory
  const clientDistPath = resolve(templateRoot, "dist/client");
  mkdirSync(clientDistPath, { recursive: true });

  // Copy widget HTML files to client dist
  const widgetFiles = await glob("src/**/*.html", {
    cwd: widgetsDistPath,
    absolute: true,
  });

  console.log(`📦 Copying ${widgetFiles.length} widget files...`);

  for (const widgetFile of widgetFiles) {
    const relativePath = widgetFile.replace(widgetsDistPath + "/", "");
    const destPath = resolve(clientDistPath, relativePath);

    // Ensure destination directory exists
    mkdirSync(dirname(destPath), { recursive: true });

    // Copy the file
    copyFileSync(widgetFile, destPath);
    console.log(`  ✓ ${relativePath}`);
  }

  // Copy widget assets (CSS, JS)
  const assetFiles = await glob("assets/**/*", {
    cwd: widgetsDistPath,
    absolute: true,
  });

  console.log(`📦 Copying ${assetFiles.length} asset files...`);

  for (const assetFile of assetFiles) {
    const relativePath = assetFile.replace(widgetsDistPath + "/", "");
    const destPath = resolve(clientDistPath, relativePath);

    // Ensure destination directory exists
    mkdirSync(dirname(destPath), { recursive: true });

    // Copy the file
    copyFileSync(assetFile, destPath);
  }

  // Generate worker manifest
  const manifestContent = readFileSync(manifestPath, "utf-8");

  // Convert the TypeScript export to a simple re-export for the worker
  const workerManifestContent = `// Auto-generated widget manifest for Cloudflare Workers
// Generated at: ${new Date().toISOString()}

${manifestContent}`;

  const workerManifestPath = resolve(templateRoot, "src/worker/widget-manifest.generated.ts");
  writeFileSync(workerManifestPath, workerManifestContent);

  console.log("✅ Widget build complete!");
  console.log(`   📁 Client assets: ${clientDistPath}`);
  console.log(`   📄 Worker manifest: ${workerManifestPath}`);
  console.log(`   🎯 Ready for deployment: pnpm deploy`);
}

// Run the build
buildWidgets().catch((error) => {
  console.error("❌ Build failed:", error);
  process.exit(1);
});
