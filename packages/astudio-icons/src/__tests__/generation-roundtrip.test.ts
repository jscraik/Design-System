import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { transform } from "@svgr/core";
import { describe, expect, it } from "vitest";
import svgrConfig from "../../svgr.config";

const SRC_ROOT = new URL("..", import.meta.url).pathname;
const SVG_ROOT = join(SRC_ROOT, "svg");
const REACT_ROOT = join(SRC_ROOT, "react");

const toComponentName = (value: string) => {
  return value
    .split(/[-_\s]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
};

const normalize = (value: string) => value.trim().replace(/\r\n/g, "\n");

const listSvgFiles = (category: string) => {
  const dir = join(SVG_ROOT, category);
  return readdirSync(dir)
    .filter((entry) => entry.endsWith(".svg"))
    .map((entry) => ({ category, name: entry }));
};

describe("Icon generation round-trip", () => {
  it("matches SVGR output for each SVG source", async () => {
    const categories = readdirSync(SVG_ROOT).filter((entry) => !entry.startsWith("."));
    const files = categories.flatMap((category) => listSvgFiles(category));

    for (const file of files) {
      const svgPath = join(SVG_ROOT, file.category, file.name);
      const svgCode = readFileSync(svgPath, "utf8");
      const componentName = toComponentName(file.name.replace(/\.svg$/, ""));

      const generated = await transform(
        svgCode,
        {
          ...svgrConfig,
          icon: false,
          typescript: true,
        },
        { componentName, filePath: svgPath },
      );

      const componentPath = join(REACT_ROOT, file.category, `${componentName}.tsx`);
      const componentCode = readFileSync(componentPath, "utf8");

      expect(normalize(componentCode)).toBe(normalize(generated));
    }
  });
});
