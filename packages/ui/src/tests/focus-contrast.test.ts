import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

import { colorTokens } from "@design-studio/tokens";

const ROOT_DIR = resolve(process.cwd(), "..", "..");
const COMPONENTS_DIR = join(ROOT_DIR, "packages/ui/src/components");

const FOCUS_RING_REGEX = /focus(?:-visible)?:ring-([a-z0-9-]+)(?:\/(\d+))?/g;

type Rgba = { r: number; g: number; b: number; a: number };

function collectComponentFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectComponentFiles(fullPath));
      continue;
    }
    if (!fullPath.endsWith(".tsx")) continue;
    if (fullPath.endsWith(".stories.tsx") || fullPath.endsWith(".test.tsx")) continue;
    files.push(fullPath);
  }

  return files;
}

function parseHexColor(hex: string): Rgba | null {
  if (!hex.startsWith("#")) return null;
  const value = hex.replace("#", "");
  if (value.length !== 6 && value.length !== 8) return null;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const a = value.length === 8 ? parseInt(value.slice(6, 8), 16) : 255;

  return { r, g, b, a: a / 255 };
}

function resolveTokenHex(token: string, mode: "light" | "dark"): string | null {
  if (!token.startsWith("foundation-")) return null;
  const parts = token.replace("foundation-", "").split("-");
  const category = parts[0];
  const name = parts.slice(1).join("-");

  const forcedMode = name.startsWith("light-") ? "light" : name.startsWith("dark-") ? "dark" : null;
  const normalizedName = forcedMode ? name.replace(/^(light|dark)-/, "") : name;
  if (forcedMode && forcedMode !== mode) return null;

  const categoryMap: Record<string, keyof typeof colorTokens> = {
    bg: "background",
    background: "background",
    text: "text",
    icon: "icon",
    border: "border",
    accent: "accent",
    interactive: "interactive",
  };

  const resolvedCategory = categoryMap[category];
  if (!resolvedCategory) return null;

  const categoryTokens = colorTokens[resolvedCategory][mode] as Record<string, string>;
  return categoryTokens[normalizedName] ?? null;
}

function applyAlpha(color: Rgba, background: Rgba): Rgba {
  const alpha = color.a;
  const inv = 1 - alpha;
  return {
    r: color.r * alpha + background.r * inv,
    g: color.g * alpha + background.g * inv,
    b: color.b * alpha + background.b * inv,
    a: 1,
  };
}

function channelToLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function relativeLuminance(color: Rgba): number {
  const r = channelToLinear(color.r);
  const g = channelToLinear(color.g);
  const b = channelToLinear(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: Rgba, background: Rgba): number {
  const lum1 = relativeLuminance(foreground);
  const lum2 = relativeLuminance(background);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Focus ring contrast (component policy)", () => {
  test("Foundation focus ring tokens meet contrast on light/dark backgrounds", () => {
    const files = collectComponentFiles(COMPONENTS_DIR);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      let match: RegExpExecArray | null = null;

      while ((match = FOCUS_RING_REGEX.exec(content))) {
        const token = match[1];
        if (!token.startsWith("foundation-")) continue;

        const alphaPercent = match[2] ? Number.parseInt(match[2], 10) : 100;
        const alpha = Number.isNaN(alphaPercent) ? 1 : alphaPercent / 100;

        const forcedMode = token.includes("-light-")
          ? "light"
          : token.includes("-dark-")
            ? "dark"
            : null;

        for (const mode of ["light", "dark"] as const) {
          if (forcedMode && forcedMode !== mode) continue;

          const tokenHex = resolveTokenHex(token, mode);
          if (!tokenHex) {
            violations.push(`${file}: unresolved token ${token}`);
            continue;
          }

          const backgroundHex = colorTokens.background[mode].primary;
          const fg = parseHexColor(tokenHex);
          const bg = parseHexColor(backgroundHex);

          if (!fg || !bg) {
            violations.push(`${file}: invalid color ${tokenHex} or ${backgroundHex}`);
            continue;
          }

          const ring = applyAlpha({ ...fg, a: fg.a * alpha }, bg);
          const ratio = contrastRatio(ring, bg);

          if (ratio < 3) {
            violations.push(
              `${file}: ${token} contrast ${ratio.toFixed(2)} < 3 on ${mode} background`,
            );
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
