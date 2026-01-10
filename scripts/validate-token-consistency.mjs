#!/usr/bin/env node

/**
 * Validate Token Consistency
 *
 * Ensures Swift outputs (asset catalog + DesignTokens.swift) match CSS custom properties.
 * This prevents drift between React and SwiftUI design tokens.
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const CSS_PATH = "packages/tokens/src/foundations.css";
const ASSET_CATALOG_PATH =
  "platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/Resources/Colors.xcassets";
const SWIFT_TOKENS_PATH =
  "platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/DesignTokens.swift";

const COLOR_MAPPINGS = [
  { name: "foundation-bg-app", light: "foundation-bg-light-1", dark: "foundation-bg-dark-1" },
  { name: "foundation-bg-card", light: "foundation-bg-light-2", dark: "foundation-bg-dark-2" },
  {
    name: "foundation-bg-card-alt",
    light: "foundation-bg-light-3",
    dark: "foundation-bg-dark-3",
  },
  {
    name: "foundation-text-primary",
    light: "foundation-text-light-primary",
    dark: "foundation-text-dark-primary",
  },
  {
    name: "foundation-text-secondary",
    light: "foundation-text-light-secondary",
    dark: "foundation-text-dark-secondary",
  },
  {
    name: "foundation-text-tertiary",
    light: "foundation-text-light-tertiary",
    dark: "foundation-text-dark-tertiary",
  },
  {
    name: "foundation-icon-primary",
    light: "foundation-icon-light-primary",
    dark: "foundation-icon-dark-primary",
  },
  {
    name: "foundation-icon-secondary",
    light: "foundation-icon-light-secondary",
    dark: "foundation-icon-dark-secondary",
  },
  {
    name: "foundation-icon-tertiary",
    light: "foundation-icon-light-tertiary",
    dark: "foundation-icon-dark-tertiary",
  },
  {
    name: "foundation-border-light",
    light: "foundation-border-light",
    dark: "foundation-border-dark-light",
  },
  {
    name: "foundation-border-heavy",
    light: "foundation-border-heavy",
    dark: "foundation-border-dark-default",
  },
  {
    name: "foundation-accent-gray",
    light: "foundation-accent-gray-light",
    dark: "foundation-accent-gray",
  },
  {
    name: "foundation-accent-red",
    light: "foundation-accent-red-light",
    dark: "foundation-accent-red",
  },
  {
    name: "foundation-accent-orange",
    light: "foundation-accent-orange-light",
    dark: "foundation-accent-orange",
  },
  {
    name: "foundation-accent-yellow",
    light: "foundation-accent-yellow-light",
    dark: "foundation-accent-yellow",
  },
  {
    name: "foundation-accent-green",
    light: "foundation-accent-green-light",
    dark: "foundation-accent-green",
  },
  {
    name: "foundation-accent-blue",
    light: "foundation-accent-blue-light",
    dark: "foundation-accent-blue",
  },
  {
    name: "foundation-accent-purple",
    light: "foundation-accent-purple-light",
    dark: "foundation-accent-purple",
  },
  {
    name: "foundation-accent-pink",
    light: "foundation-accent-pink-light",
    dark: "foundation-accent-pink",
  },
  {
    name: "foundation-divider",
    light: "foundation-bg-light-3",
    dark: "foundation-bg-dark-3",
  },
];

const TYPOGRAPHY_MAPPINGS = [
  { css: "heading1", swift: "Heading1", emphasis: false },
  { css: "heading2", swift: "Heading2", emphasis: false },
  { css: "heading3", swift: "Heading3", emphasis: false },
  { css: "body", swift: "Body", emphasis: true },
  { css: "body-small", swift: "BodySmall", emphasis: true },
  { css: "caption", swift: "Caption", emphasis: true },
  { css: "card-title", swift: "CardTitle", emphasis: false },
  { css: "list-title", swift: "ListTitle", emphasis: false },
  { css: "list-subtitle", swift: "ListSubtitle", emphasis: false },
  { css: "button-label", swift: "ButtonLabel", emphasis: false },
  { css: "button-label-small", swift: "ButtonLabelSmall", emphasis: false },
];

function validateTokenConsistency() {
  console.log("🔍 Validating token consistency between CSS and Swift...\n");
  const strict = process.argv.includes("--strict") || Boolean(process.env.CI);

  try {
    // Read CSS custom properties
    const cssContent = readFileSync(CSS_PATH, "utf8");
    const cssVars = extractCSSVariables(cssContent);

    console.log(`Found ${cssVars.size} CSS foundation tokens`);

    // Read Swift Asset Catalog colorsets
    const swiftColors = extractSwiftColors(ASSET_CATALOG_PATH);
    const swiftContent = readFileSync(SWIFT_TOKENS_PATH, "utf8");

    console.log(`Found ${swiftColors.size} Swift colorsets\n`);

    // Validate consistency
    const errors = [];
    const warnings = [];

    // Validate colorset structure
    for (const [name, colorset] of swiftColors.entries()) {
      const validation = validateColorset(name, colorset);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
    }

    // Color parity checks (key tokens only)
    for (const mapping of COLOR_MAPPINGS) {
      const lightCss = normalizeHex(cssVars.get(mapping.light));
      const darkCss = normalizeHex(cssVars.get(mapping.dark));
      const colorset = swiftColors.get(mapping.name);

      if (!lightCss) {
        errors.push(`❌ Missing CSS token '${mapping.light}' for ${mapping.name}`);
        continue;
      }
      if (!darkCss) {
        errors.push(`❌ Missing CSS token '${mapping.dark}' for ${mapping.name}`);
        continue;
      }
      if (!colorset) {
        errors.push(`❌ Missing Swift colorset '${mapping.name}'`);
        continue;
      }

      const swiftHex = extractColorsetHex(colorset);
      if (!swiftHex.light || !swiftHex.dark) {
        errors.push(`❌ Colorset '${mapping.name}' missing light/dark values`);
        continue;
      }

      if (swiftHex.light !== lightCss) {
        errors.push(
          `❌ ${mapping.name} light mismatch (CSS ${mapping.light}=${lightCss}, Swift=${swiftHex.light})`,
        );
      }
      if (swiftHex.dark !== darkCss) {
        errors.push(
          `❌ ${mapping.name} dark mismatch (CSS ${mapping.dark}=${darkCss}, Swift=${swiftHex.dark})`,
        );
      }
    }

    // Spacing parity
    const cssSpacing = extractCssSpacing(cssVars);
    const swiftSpacing = extractSwiftSpacing(swiftContent);
    const spacingDiff = compareNumberSets(cssSpacing, swiftSpacing);
    if (spacingDiff.missingInSwift.length > 0) {
      errors.push(
        `❌ Swift spacing scale missing: ${spacingDiff.missingInSwift.join(", ")}`,
      );
    }
    if (spacingDiff.missingInCss.length > 0) {
      errors.push(`❌ CSS spacing scale missing: ${spacingDiff.missingInCss.join(", ")}`);
    }

    // Typography parity
    const cssTypography = extractCssTypography(cssVars);
    const swiftTypography = extractSwiftTypography(swiftContent);
    const fontFamily = extractCssFontFamily(cssContent);
    const swiftFontFamily = extractSwiftFontFamily(swiftContent);

    if (fontFamily && swiftFontFamily && fontFamily !== swiftFontFamily) {
      errors.push(
        `❌ Font family mismatch (CSS ${fontFamily} vs Swift ${swiftFontFamily})`,
      );
    }

    for (const mapping of TYPOGRAPHY_MAPPINGS) {
      const cssToken = cssTypography.get(mapping.css);
      const swiftToken = swiftTypography.get(mapping.swift);

      if (!cssToken) {
        errors.push(`❌ Missing CSS typography token '${mapping.css}'`);
        continue;
      }
      if (!swiftToken) {
        errors.push(`❌ Missing Swift typography token '${mapping.swift}'`);
        continue;
      }

      if (!numbersEqual(cssToken.size, swiftToken.size)) {
        errors.push(
          `❌ ${mapping.swift} size mismatch (CSS ${cssToken.size} vs Swift ${swiftToken.size})`,
        );
      }
      if (!numbersEqual(cssToken.line, swiftToken.lineHeight)) {
        errors.push(
          `❌ ${mapping.swift} lineHeight mismatch (CSS ${cssToken.line} vs Swift ${swiftToken.lineHeight})`,
        );
      }
      if (!numbersEqual(cssToken.tracking, swiftToken.tracking)) {
        errors.push(
          `❌ ${mapping.swift} tracking mismatch (CSS ${cssToken.tracking} vs Swift ${swiftToken.tracking})`,
        );
      }
      if (!numbersEqual(cssToken.weight, swiftToken.weight)) {
        errors.push(
          `❌ ${mapping.swift} weight mismatch (CSS ${cssToken.weight} vs Swift ${swiftToken.weight})`,
        );
      }
      if (mapping.emphasis) {
        if (!numbersEqual(cssToken.emphasisWeight, swiftToken.emphasisWeight)) {
          errors.push(
            `❌ ${mapping.swift} emphasis weight mismatch (CSS ${cssToken.emphasisWeight} vs Swift ${swiftToken.emphasisWeight})`,
          );
        }
      }
    }

    // Print results
    console.log("=".repeat(60));
    console.log("📊 Validation Results");
    console.log("=".repeat(60));

    if (errors.length === 0 && warnings.length === 0) {
      console.log("✅ All tokens are consistent!");
      console.log(`   ${COLOR_MAPPINGS.length} key colors validated across CSS and Swift`);
      console.log(`   ${cssSpacing.size} spacing tokens validated across CSS and Swift`);
      console.log(`   ${TYPOGRAPHY_MAPPINGS.length} typography groups validated across CSS and Swift`);
      return true;
    }

    if (errors.length > 0) {
      console.log("\n❌ Errors found:");
      errors.forEach((error) => console.log(`   ${error}`));
    }

    if (warnings.length > 0) {
      if (strict) {
        errors.push(...warnings.map((warning) => warning.replace("⚠️", "❌")));
      } else {
        console.log("\n⚠️  Warnings (non-blocking):");
        warnings.forEach((warning) => console.log(`   ${warning}`));
      }
    }

    if (errors.length > 0) {
      console.log("\n❌ Token validation failed");
      process.exit(1);
    } else {
      console.log("\n✅ Token validation passed");
      console.log("   Note: Warnings indicate tokens that may not be fully implemented yet");
      return true;
    }
  } catch (error) {
    console.error("❌ Validation failed:", error.message);
    process.exit(1);
  }
}

/**
 * Extract CSS variables (foundation tokens only)
 */
function extractCSSVariables(cssContent) {
  const vars = new Map();
  const baseContent =
    cssContent.split("@media (prefers-contrast: high)")[0] ?? cssContent;
  const colorRegex = /--foundation-([\w-]+):\s*([^;]+);/g;
  let match;

  while ((match = colorRegex.exec(baseContent)) !== null) {
    const [, name, value] = match;
    const key = `foundation-${name}`;
    if (vars.has(key)) continue;
    const trimmed = value.trim();
    if (trimmed.startsWith("var(")) continue;
    vars.set(key, trimmed);
  }

  return vars;
}

/**
 * Extract Swift Asset Catalog colorsets
 */
function extractSwiftColors(assetCatalogPath) {
  const colors = new Map();

  if (!existsSync(assetCatalogPath)) {
    throw new Error(`Asset Catalog not found: ${assetCatalogPath}`);
  }

  const entries = readdirSync(assetCatalogPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.endsWith(".colorset")) {
      const colorsetName = entry.name.replace(".colorset", "");
      const contentsPath = join(assetCatalogPath, entry.name, "Contents.json");

      if (existsSync(contentsPath)) {
        try {
          const contents = JSON.parse(readFileSync(contentsPath, "utf8"));
          colors.set(colorsetName, contents);
        } catch (error) {
          console.warn(`Warning: Could not parse ${contentsPath}: ${error.message}`);
        }
      }
    }
  }

  return colors;
}

function normalizeHex(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("#")) return null;
  const normalized = trimmed.toUpperCase();
  if (normalized.length === 7 || normalized.length === 9) {
    return normalized;
  }
  return null;
}

function componentToHex(value) {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return null;
  const clamped = Math.min(1, Math.max(0, numeric));
  const int = Math.round(clamped * 255);
  return int.toString(16).padStart(2, "0").toUpperCase();
}

function extractColorsetHex(colorset) {
  const light = colorset.colors.find(
    (c) => !c.appearances || c.appearances.length === 0,
  );
  const dark = colorset.colors.find(
    (c) => c.appearances && c.appearances.some((a) => a.value === "dark"),
  );

  return {
    light: colorEntryToHex(light),
    dark: colorEntryToHex(dark),
  };
}

function colorEntryToHex(entry) {
  if (!entry?.color?.components) return null;
  const { red, green, blue, alpha } = entry.color.components;
  const r = componentToHex(red);
  const g = componentToHex(green);
  const b = componentToHex(blue);
  const a = componentToHex(alpha);
  if (!r || !g || !b || !a) return null;
  return a === "FF" ? `#${r}${g}${b}` : `#${r}${g}${b}${a}`;
}

function extractCssSpacing(cssVars) {
  const values = [];
  for (const [name, value] of cssVars.entries()) {
    const match = name.match(/^foundation-space-(\d+)$/);
    if (!match) continue;
    const numeric = parseCssNumber(value);
    if (numeric !== null) {
      values.push(numeric);
    }
  }
  return new Set(values);
}

function extractSwiftSpacing(swiftContent) {
  const match = swiftContent.match(/scale:\s*\[CGFloat\]\s*=\s*\[([^\]]+)\]/);
  if (!match) return new Set();
  const numbers = match[1]
    .split(",")
    .map((value) => Number.parseFloat(value.trim()))
    .filter((value) => !Number.isNaN(value));
  return new Set(numbers);
}

function extractCssTypography(cssVars) {
  const map = new Map();
  for (const mapping of TYPOGRAPHY_MAPPINGS) {
    const prefix = `foundation-${mapping.css}`;
    const size = parseCssNumber(cssVars.get(`${prefix}-size`));
    const line = parseCssNumber(cssVars.get(`${prefix}-line`));
    const weight = parseCssNumber(cssVars.get(`${prefix}-weight`));
    const emphasisWeight = parseCssNumber(cssVars.get(`${prefix}-weight-emphasis`));
    const tracking = parseCssNumber(cssVars.get(`${prefix}-tracking`));
    if (size !== null && line !== null && weight !== null && tracking !== null) {
      map.set(mapping.css, {
        size,
        line,
        weight,
        emphasisWeight: emphasisWeight ?? weight,
        tracking,
      });
    }
  }
  return map;
}

function extractSwiftTypography(swiftContent) {
  const map = new Map();
  for (const mapping of TYPOGRAPHY_MAPPINGS) {
    const regex = new RegExp(
      `enum\\s+${mapping.swift}\\s+\\{[\\s\\S]*?public\\s+static\\s+let\\s+size:\\s+CGFloat\\s*=\\s*([\\d.-]+)[\\s\\S]*?public\\s+static\\s+let\\s+lineHeight:\\s+CGFloat\\s*=\\s*([\\d.-]+)[\\s\\S]*?public\\s+static\\s+let\\s+weight\\s*=\\s*Font\\.Weight\\.([a-zA-Z]+)[\\s\\S]*?public\\s+static\\s+let\\s+tracking:\\s+CGFloat\\s*=\\s*([\\d.-]+)`,
    );
    const match = swiftContent.match(regex);
    if (!match) continue;
    const size = Number.parseFloat(match[1]);
    const lineHeight = Number.parseFloat(match[2]);
    const weight = mapSwiftWeight(match[3]);
    const tracking = Number.parseFloat(match[4]);
    let emphasisWeight = weight;

    if (mapping.emphasis) {
      const emphasisRegex = new RegExp(
        `enum\\s+${mapping.swift}\\s+\\{[\\s\\S]*?public\\s+static\\s+let\\s+emphasisWeight\\s*=\\s*Font\\.Weight\\.([a-zA-Z]+)`,
      );
      const emphasisMatch = swiftContent.match(emphasisRegex);
      if (emphasisMatch) {
        emphasisWeight = mapSwiftWeight(emphasisMatch[1]);
      }
    }

    if (
      [size, lineHeight, weight, tracking, emphasisWeight].some((value) =>
        Number.isNaN(value),
      )
    ) {
      continue;
    }

    map.set(mapping.swift, { size, lineHeight, weight, emphasisWeight, tracking });
  }
  return map;
}

function extractCssFontFamily(cssContent) {
  const match = cssContent.match(/--foundation-font-family:\s*([^;]+);/);
  if (!match) return null;
  const familyList = match[1].split(",").map((item) => item.trim());
  const first = familyList[0];
  return first?.replace(/^"|"$/g, "") ?? null;
}

function extractSwiftFontFamily(swiftContent) {
  const match = swiftContent.match(/fontFamily\s*=\s*"([^"]+)"/);
  return match?.[1] ?? null;
}

function parseCssNumber(value) {
  if (!value) return null;
  const numeric = Number.parseFloat(value.replace(/px$/, ""));
  return Number.isNaN(numeric) ? null : numeric;
}

function mapSwiftWeight(weight) {
  switch (weight) {
    case "regular":
      return 400;
    case "medium":
      return 500;
    case "semibold":
      return 600;
    case "bold":
      return 700;
    default:
      return NaN;
  }
}

function numbersEqual(left, right) {
  return Math.abs(left - right) < 0.01;
}

function compareNumberSets(cssSet, swiftSet) {
  const missingInSwift = [];
  const missingInCss = [];

  for (const value of cssSet) {
    if (!swiftSet.has(value)) missingInSwift.push(value);
  }

  for (const value of swiftSet) {
    if (!cssSet.has(value)) missingInCss.push(value);
  }

  return {
    missingInSwift: missingInSwift.sort((a, b) => a - b),
    missingInCss: missingInCss.sort((a, b) => a - b),
  };
}

/**
 * Validate colorset structure
 */
function validateColorset(name, colorset) {
  const errors = [];

  // Check for required properties
  if (!colorset.colors || !Array.isArray(colorset.colors)) {
    errors.push(`❌ Colorset '${name}' missing 'colors' array`);
    return { valid: false, errors };
  }

  // Check for light and dark variants
  const hasLight = colorset.colors.some((c) => !c.appearances || c.appearances.length === 0);
  const hasDark = colorset.colors.some(
    (c) => c.appearances && c.appearances.some((a) => a.value === "dark"),
  );

  if (!hasLight) {
    errors.push(`❌ Colorset '${name}' missing light mode variant`);
  }

  if (!hasDark) {
    errors.push(`❌ Colorset '${name}' missing dark mode variant`);
  }

  // Validate color format
  for (const color of colorset.colors) {
    if (!color.color) {
      errors.push(`❌ Colorset '${name}' has entry without 'color' property`);
      continue;
    }

    const { components } = color.color;
    if (!components) {
      errors.push(`❌ Colorset '${name}' has color without 'components'`);
      continue;
    }

    // Check for required color components
    const requiredComponents = ["red", "green", "blue", "alpha"];
    for (const component of requiredComponents) {
      if (components[component] === undefined) {
        errors.push(`❌ Colorset '${name}' missing '${component}' component`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateTokenConsistency();
}

export { validateTokenConsistency };
