import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");

let html = readFileSync(indexPath, "utf8");

// Inline <link rel="stylesheet" ... href="..."> tags
html = html.replace(
  /<link\s+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
  (match, href) => {
    const cssPath = path.join(distDir, href.replace(/^\//, ""));
    const css = readFileSync(cssPath, "utf8");
    return `<style>\n${css}\n</style>`;
  }
);

// Inline Vite module scripts
html = html.replace(
  /<script\s+type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
  (match, src) => {
    const jsPath = path.join(distDir, src.replace(/^\//, ""));
    const js = readFileSync(jsPath, "utf8");
    return `<script type="module">\n${js}\n</script>`;
  }
);

// Write widget html for MCP server embedding.
const outPath = path.join(distDir, "widget.html");
writeFileSync(outPath, html, "utf8");

console.log(`Wrote ${outPath}`);
