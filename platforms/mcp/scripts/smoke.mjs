import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const widgetPath = path.resolve(process.cwd(), "platforms/web/apps/web/dist/widget.html");

try {
  const stats = statSync(widgetPath);
  if (!stats.size) {
    throw new Error("Widget bundle is empty");
  }
  const html = readFileSync(widgetPath, "utf8");
  if (!html.includes("<html")) {
    throw new Error("Widget bundle does not look like HTML");
  }
  console.log(`OK: widget bundle found at ${widgetPath}`);
} catch (error) {
  console.error("Embed smoke check failed.");
  console.error("Build the widget first: pnpm build:widget");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
