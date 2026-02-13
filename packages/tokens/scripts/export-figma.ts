#!/usr/bin/env node
/**
 * Export design tokens to Figma-compatible DTCG format
 *
 * Figma expects:
 * - Flat token names (color/background/primary)
 * - Mode values as separate columns in the UI
 * - For tokens with modes, we export all mode values and let Figma organize them
 */

import { readFile, writeFile } from "node:fs/promises";

const dtcgPath = new URL("../src/tokens/index.dtcg.json", import.meta.url);
const figmaOutputPath = new URL("../dist/figma-tokens.json", import.meta.url);

// DTCG-compliant types
type DtcgDimensionValue = { value: number; unit: "px" | "rem" | "em" | "%" };
type DtcgColorToken = { $value: string; $type: "color"; $description?: string };
type DtcgDimensionToken = { $value: DtcgDimensionValue; $type: "dimension" };
type DtcgFontFamilyToken = { $value: string; $type: "fontFamily" };
type DtcgFontWeightToken = { $value: number | string; $type: "fontWeight" };
type DtcgLetterSpacingToken = { $value: number; $type: "letterSpacing" };
type DtcgShadowLayer = {
  color: DtcgColorToken;
  offsetX: DtcgDimensionToken;
  offsetY: DtcgDimensionToken;
  blur: DtcgDimensionToken;
  spread: DtcgDimensionToken;
};
type DtcgShadowToken = { $value: DtcgShadowLayer[]; $type: "shadow" };

type DtcgModeSet<T> = {
  light: Record<string, T>;
  dark: Record<string, T>;
};

type DtcgRoot = {
  color: {
    background: DtcgModeSet<DtcgColorToken>;
    text: DtcgModeSet<DtcgColorToken>;
    icon: DtcgModeSet<DtcgColorToken>;
    border: DtcgModeSet<DtcgColorToken>;
    accent: DtcgModeSet<DtcgColorToken>;
    interactive: DtcgModeSet<DtcgColorToken>;
  };
  space: Record<string, DtcgDimensionToken>;
  radius: Record<string, DtcgDimensionToken>;
  size: Record<string, DtcgDimensionToken>;
  shadow: Record<string, DtcgShadowToken>;
  type: {
    fontFamily: DtcgFontFamilyToken;
    web: Record<
      string,
      {
        size?: DtcgDimensionToken;
        lineHeight?: DtcgDimensionToken;
        paragraphSpacing?: DtcgDimensionToken;
        weight?: DtcgFontWeightToken;
        emphasisWeight?: DtcgFontWeightToken;
        tracking?: DtcgLetterSpacingToken;
      }
    >;
  };
};

// Figma-compatible output structure
type FigmaToken =
  | { $type: "color"; $value: string; $description?: string }
  | { $type: "number"; $value: number }
  | { $type: "string"; $value: string };

type FigmaCollection = {
  $collection?: string;
  $description?: string;
  [tokenName: string]: FigmaToken | string | undefined;
};

type FigmaOutput = {
  $schema?: string;
  $description?: string;
  [collectionName: string]: FigmaCollection | string | undefined;
};

/**
 * Flatten color tokens with modes into separate collections
 * Figma handles modes as columns, so we export light and dark as the same variable names
 * but Figma will create them in different modes
 */
function flattenColorTokens(
  colorData: Record<string, DtcgModeSet<DtcgColorToken>>,
  collectionName: string,
): FigmaCollection {
  const collection: FigmaCollection = {
    $collection: collectionName,
    $description: `${collectionName} color tokens with light/dark modes`,
  };

  for (const [category, modeSet] of Object.entries(colorData)) {
    // Get all token names from light mode (assuming light/dark have same keys)
    const tokenNames = Object.keys(modeSet.light);

    for (const tokenName of tokenNames) {
      const lightToken = modeSet.light[tokenName];
      const darkToken = modeSet.dark[tokenName];

      if (!lightToken) continue;

      // Create the base token name (e.g., "background/primary")
      const fullName = `${category}/${tokenName}`;

      // Store light mode value as default
      // Figma will need manual setup for dark mode, or we can use extensions
      collection[fullName] = {
        $type: "color",
        $value: lightToken.$value,
        ...(lightToken.$description ? { $description: lightToken.$description } : {}),
      };

      // Store dark mode value in extensions for reference
      if (darkToken && darkToken.$value !== lightToken.$value) {
        collection[`${fullName}__dark`] = {
          $type: "color",
          $value: darkToken.$value,
          $description: `Dark mode value for ${fullName}`,
        };
      }
    }
  }

  return collection;
}

/**
 * Convert dimension token to Figma-compatible number token
 * Figma only accepts px units for dimensions
 */
function convertDimensionToken(token: DtcgDimensionToken): FigmaToken {
  return {
    $type: "number",
    $value: token.$value.value,
  };
}

/**
 * Flatten spacing tokens
 */
function flattenSpacingTokens(spaceData: Record<string, DtcgDimensionToken>): FigmaCollection {
  const collection: FigmaCollection = {
    $collection: "spacing",
    $description: "Spacing scale tokens (px)",
  };

  for (const [name, token] of Object.entries(spaceData)) {
    collection[name] = convertDimensionToken(token);
  }

  return collection;
}

/**
 * Flatten radius tokens
 */
function flattenRadiusTokens(radiusData: Record<string, DtcgDimensionToken>): FigmaCollection {
  const collection: FigmaCollection = {
    $collection: "radius",
    $description: "Corner radius tokens (px)",
  };

  for (const [name, token] of Object.entries(radiusData)) {
    collection[name] = convertDimensionToken(token);
  }

  return collection;
}

/**
 * Flatten size tokens
 */
function flattenSizeTokens(sizeData: Record<string, DtcgDimensionToken>): FigmaCollection {
  const collection: FigmaCollection = {
    $collection: "size",
    $description: "Size tokens for component dimensions (px)",
  };

  for (const [name, token] of Object.entries(sizeData)) {
    collection[name] = convertDimensionToken(token);
  }

  return collection;
}

/**
 * Flatten shadow tokens - convert to string format for Figma
 * Figma doesn't have a native shadow variable type, so we store as string
 */
function flattenShadowTokens(shadowData: Record<string, DtcgShadowToken>): FigmaCollection {
  const collection: FigmaCollection = {
    $collection: "shadow",
    $description: "Shadow tokens (CSS format)",
  };

  for (const [name, token] of Object.entries(shadowData)) {
    // Convert shadow layers to CSS string
    const shadowStrings = token.$value.map((layer) => {
      const { offsetX, offsetY, blur, spread, color } = layer;
      return `${offsetX.$value.value}px ${offsetY.$value.value}px ${blur.$value.value}px ${spread.$value.value}px ${color.$value}`;
    });

    collection[name] = {
      $type: "string",
      $value: shadowStrings.join(", "),
    };
  }

  return collection;
}

/**
 * Flatten typography tokens
 */
function flattenTypographyTokens(typeData: DtcgRoot["type"]): FigmaCollection {
  const collection: FigmaCollection = {
    $collection: "typography",
    $description: "Typography tokens",
  };

  // Font family
  collection.fontFamily = {
    $type: "string",
    $value: typeData.fontFamily.$value,
  };

  // Typography styles
  for (const [styleName, styleData] of Object.entries(typeData.web)) {
    if (styleData.size) {
      collection[`${styleName}/size`] = convertDimensionToken(styleData.size);
    }
    if (styleData.lineHeight) {
      collection[`${styleName}/lineHeight`] = convertDimensionToken(styleData.lineHeight);
    }
    if (styleData.paragraphSpacing) {
      collection[`${styleName}/paragraphSpacing`] = convertDimensionToken(
        styleData.paragraphSpacing,
      );
    }
    if (styleData.weight) {
      collection[`${styleName}/weight`] = {
        $type: "number",
        $value: typeof styleData.weight.$value === "number" ? styleData.weight.$value : 400,
      };
    }
    if (styleData.tracking) {
      collection[`${styleName}/tracking`] = {
        $type: "number",
        $value: styleData.tracking.$value,
      };
    }
  }

  return collection;
}

/**
 * Generate alternative format: Separate collections for each mode
 * This creates Light and Dark collection files that can be imported separately
 */
function generateModeCollections(colorData: Record<string, DtcgModeSet<DtcgColorToken>>): {
  light: FigmaCollection;
  dark: FigmaCollection;
} {
  const light: FigmaCollection = {
    $collection: "colors-light",
    $description: "Color tokens - Light mode",
  };

  const dark: FigmaCollection = {
    $collection: "colors-dark",
    $description: "Color tokens - Dark mode",
  };

  for (const [category, modeSet] of Object.entries(colorData)) {
    const tokenNames = Object.keys(modeSet.light);

    for (const tokenName of tokenNames) {
      const lightToken = modeSet.light[tokenName];
      const darkToken = modeSet.dark[tokenName];

      const fullName = `${category}/${tokenName}`;

      if (lightToken) {
        light[fullName] = {
          $type: "color",
          $value: lightToken.$value,
        };
      }

      if (darkToken) {
        dark[fullName] = {
          $type: "color",
          $value: darkToken.$value,
        };
      }
    }
  }

  return { light, dark };
}

async function main(): Promise<void> {
  console.log("🎨 Exporting tokens for Figma...\n");

  const dtcgRaw = await readFile(dtcgPath, "utf8");
  const dtcg = JSON.parse(dtcgRaw) as DtcgRoot;

  // Create the main Figma output
  const figmaOutput: FigmaOutput = {
    $schema: "https://designtokens.org/format.json",
    $description: "aStudio Design Tokens - Figma Import Format",
    ...flattenColorTokens(dtcg.color, "colors"),
    ...flattenSpacingTokens(dtcg.space),
    ...flattenRadiusTokens(dtcg.radius),
    ...flattenSizeTokens(dtcg.size),
    ...flattenShadowTokens(dtcg.shadow),
    ...flattenTypographyTokens(dtcg.type),
  };

  // Ensure dist directory exists
  const distPath = new URL("../dist/", import.meta.url);
  try {
    await writeFile(new URL(".gitkeep", distPath), "");
  } catch {
    // Directory might not exist, that's ok
  }

  // Write main output
  await writeFile(figmaOutputPath, JSON.stringify(figmaOutput, null, 2));
  console.log(`✅ Main export: ${figmaOutputPath.pathname}`);

  // Generate separate mode collections for colors
  const { light, dark } = generateModeCollections(dtcg.color);

  const lightPath = new URL("../dist/figma-tokens-light.json", import.meta.url);
  const darkPath = new URL("../dist/figma-tokens-dark.json", import.meta.url);

  await writeFile(lightPath, JSON.stringify(light, null, 2));
  console.log(`✅ Light mode: ${lightPath.pathname}`);

  await writeFile(darkPath, JSON.stringify(dark, null, 2));
  console.log(`✅ Dark mode: ${darkPath.pathname}`);

  // Generate a combined file with all collections
  const combinedOutput: FigmaOutput = {
    $schema: "https://designtokens.org/format.json",
    $description: "aStudio Design Tokens - Complete Figma Import",
    colors: flattenColorTokens(dtcg.color, "colors"),
    spacing: flattenSpacingTokens(dtcg.space),
    radius: flattenRadiusTokens(dtcg.radius),
    size: flattenSizeTokens(dtcg.size),
    shadow: flattenShadowTokens(dtcg.shadow),
    typography: flattenTypographyTokens(dtcg.type),
  };

  const combinedPath = new URL("../dist/figma-tokens-combined.json", import.meta.url);
  await writeFile(combinedPath, JSON.stringify(combinedOutput, null, 2));
  console.log(`✅ Combined: ${combinedPath.pathname}`);

  console.log("\n📦 Export complete!\n");
  console.log("Files generated:");
  console.log("  • figma-tokens.json         - Flat format (easiest for Figma)");
  console.log("  • figma-tokens-combined.json - Organized by collection");
  console.log("  • figma-tokens-light.json   - Colors (light mode only)");
  console.log("  • figma-tokens-dark.json    - Colors (dark mode only)");
  console.log("\n💡 Recommended: Import figma-tokens-combined.json into Figma");
  console.log("   Then manually create Light/Dark modes and copy values.");
}

await main();
