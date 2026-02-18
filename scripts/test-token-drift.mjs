#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const upstreamPackagePath = resolve("node_modules/@openai/apps-sdk-ui/package.json");
const upstreamStylesDir = resolve("node_modules/@openai/apps-sdk-ui/dist/es/styles");
const upstreamStyleFiles = ["variables-primitive.css", "variables-semantic.css"];
const foundationPath = resolve("packages/tokens/src/foundations.css");

function readFileOrThrow(path) {
  if (!existsSync(path)) {
    throw new Error(`Missing required file: ${path}`);
  }
  return readFileSync(path, "utf8");
}

function extractHexSet(css) {
  const regex = /#([0-9a-fA-F]{6,8})/g;
  const values = new Set();
  let match;

  while ((match = regex.exec(css))) {
    values.add(`#${match[1].toLowerCase()}`);
  }

  return values;
}

function extractFoundationHex(css) {
  const regex = /--foundation-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6,8})/g;
  const entries = [];
  let match;

  while ((match = regex.exec(css))) {
    entries.push({ name: match[1], value: match[2].toLowerCase() });
  }

  return entries;
}

function resolveBaseHex(value) {
  if (value.length === 9) {
    return `#${value.slice(1, 7)}`;
  }
  return null;
}

function extractUpstreamRadiusPx(css) {
  const regex = /--radius-[^:]+:\s*([0-9.]+)(rem|px)/g;
  const values = new Set();
  let match;

  while ((match = regex.exec(css))) {
    const amount = Number.parseFloat(match[1]);
    const unit = match[2];
    if (Number.isNaN(amount)) continue;
    const pxValue = unit === "rem" ? amount * 16 : amount;
    values.add(Number(pxValue.toFixed(4)));
  }

  return values;
}

function extractFoundationRadiusPx(css) {
  const regex = /--foundation-radius-[^:]+:\s*([0-9.]+)px/g;
  const values = new Set();
  let match;

  while ((match = regex.exec(css))) {
    const amount = Number.parseFloat(match[1]);
    if (Number.isNaN(amount)) continue;
    values.add(Number(amount.toFixed(4)));
  }

  return values;
}

function extractUpstreamFontWeights(css) {
  const regex = /--font-weight-[^:]+:\s*([0-9]+);/g;
  const values = new Set();
  let match;

  while ((match = regex.exec(css))) {
    const amount = Number.parseInt(match[1], 10);
    if (Number.isNaN(amount)) continue;
    values.add(amount);
  }

  return values;
}

function extractFoundationFontWeights(css) {
  const regex = /--foundation-[^:]+-weight[^:]*:\s*([0-9]+);/g;
  const values = new Set();
  let match;

  while ((match = regex.exec(css))) {
    const amount = Number.parseInt(match[1], 10);
    if (Number.isNaN(amount)) continue;
    values.add(amount);
  }

  return values;
}

function extractUpstreamSpacingBase(css) {
  const regex = /--spacing:\s*([0-9.]+)(rem|px)/;
  const match = regex.exec(css);
  if (!match) return null;
  const amount = Number.parseFloat(match[1]);
  if (Number.isNaN(amount)) return null;
  const unit = match[2];
  return unit === "rem" ? amount * 16 : amount;
}

function extractFoundationSpacingPx(css) {
  const regex = /--foundation-space-[^:]+:\s*([0-9.]+)px/g;
  const values = new Set();
  let match;

  while ((match = regex.exec(css))) {
    const amount = Number.parseFloat(match[1]);
    if (Number.isNaN(amount)) continue;
    values.add(Number(amount.toFixed(4)));
  }

  return values;
}

function extractUpstreamTypographyPairs(css) {
  const sizeRegex = /--font-([a-z0-9-]+)-size:\s*([0-9.]+)(rem|px)/g;
  const lineRegex = /--font-([a-z0-9-]+)-line-height:\s*([0-9.]+)(rem|px)/g;
  const sizes = new Map();
  const lines = new Map();
  let match;

  while ((match = sizeRegex.exec(css))) {
    const name = match[1];
    const amount = Number.parseFloat(match[2]);
    if (Number.isNaN(amount)) continue;
    const unit = match[3];
    const px = unit === "rem" ? amount * 16 : amount;
    sizes.set(name, Number(px.toFixed(4)));
  }

  while ((match = lineRegex.exec(css))) {
    const name = match[1];
    const amount = Number.parseFloat(match[2]);
    if (Number.isNaN(amount)) continue;
    const unit = match[3];
    const px = unit === "rem" ? amount * 16 : amount;
    lines.set(name, Number(px.toFixed(4)));
  }

  const pairs = new Set();
  for (const [name, size] of sizes.entries()) {
    const line = lines.get(name);
    if (line !== undefined) {
      pairs.add(`${size}:${line}`);
    }
  }

  return pairs;
}

function extractFoundationTypographyPairs(css) {
  const sizeRegex = /--foundation-([a-z0-9-]+)-size:\s*([0-9.]+)px/g;
  const lineRegex = /--foundation-([a-z0-9-]+)-line:\s*([0-9.]+)px/g;
  const sizes = new Map();
  const lines = new Map();
  let match;

  while ((match = sizeRegex.exec(css))) {
    const name = match[1];
    const amount = Number.parseFloat(match[2]);
    if (Number.isNaN(amount)) continue;
    sizes.set(name, Number(amount.toFixed(4)));
  }

  while ((match = lineRegex.exec(css))) {
    const name = match[1];
    const amount = Number.parseFloat(match[2]);
    if (Number.isNaN(amount)) continue;
    lines.set(name, Number(amount.toFixed(4)));
  }

  const pairs = new Set();
  for (const [name, size] of sizes.entries()) {
    const line = lines.get(name);
    if (line !== undefined) {
      pairs.add(`${size}:${line}`);
    }
  }

  return pairs;
}

function extractFoundationShadows(css) {
  const regex = /--foundation-shadow-[^:]+:\s*([^;]+);/g;
  const values = [];
  let match;

  while ((match = regex.exec(css))) {
    values.push(match[1].trim());
  }

  return values;
}

function normalizeShadow(value) {
  return value.replace(/0px/g, "0").replace(/\s+/g, " ").trim();
}

function loadUpstreamVersion() {
  if (!existsSync(upstreamPackagePath)) {
    return "unknown";
  }
  try {
    const raw = readFileSync(upstreamPackagePath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.version ?? "unknown";
  } catch {
    return "unknown";
  }
}

function main() {
  try {
    const upstreamVersion = loadUpstreamVersion();
    const foundationCss = readFileOrThrow(foundationPath);

    const upstreamCss = upstreamStyleFiles
      .map((file) => readFileOrThrow(resolve(upstreamStylesDir, file)))
      .join("\n");
    const upstreamShadowText = normalizeShadow(upstreamCss);

    const upstreamHex = extractHexSet(upstreamCss);
    const foundationEntries = extractFoundationHex(foundationCss);
    const upstreamRadius = extractUpstreamRadiusPx(upstreamCss);
    const foundationRadius = extractFoundationRadiusPx(foundationCss);
    const upstreamWeights = extractUpstreamFontWeights(upstreamCss);
    const foundationWeights = extractFoundationFontWeights(foundationCss);
    const upstreamSpacingBase = extractUpstreamSpacingBase(upstreamCss);
    const foundationSpacing = extractFoundationSpacingPx(foundationCss);
    const upstreamTypographyPairs = extractUpstreamTypographyPairs(upstreamCss);
    const foundationTypographyPairs = extractFoundationTypographyPairs(foundationCss);
    const foundationShadows = extractFoundationShadows(foundationCss);

    const missingColors = [];
    const missingRadius = [];
    const missingWeights = [];
    const spacingMismatches = [];
    const typographyMismatches = [];
    const shadowMismatches = [];

    for (const entry of foundationEntries) {
      const base = resolveBaseHex(entry.value);
      const matches = upstreamHex.has(entry.value) || (base && upstreamHex.has(base));
      if (!matches) {
        missingColors.push(entry);
      }
    }

    for (const radius of foundationRadius) {
      if (!upstreamRadius.has(radius)) {
        missingRadius.push(radius);
      }
    }

    for (const weight of foundationWeights) {
      if (!upstreamWeights.has(weight)) {
        missingWeights.push(weight);
      }
    }

    if (upstreamSpacingBase) {
      for (const space of foundationSpacing) {
        if (space % upstreamSpacingBase !== 0) {
          spacingMismatches.push(space);
        }
      }
    }

    if (upstreamTypographyPairs.size > 0) {
      for (const pair of foundationTypographyPairs) {
        if (!upstreamTypographyPairs.has(pair)) {
          typographyMismatches.push(pair);
        }
      }
    }

    if (foundationShadows.length > 0) {
      for (const shadow of foundationShadows) {
        const normalizedShadow = normalizeShadow(shadow);
        if (!upstreamShadowText.includes(normalizedShadow)) {
          shadowMismatches.push(shadow);
        }
      }
    }

    if (missingColors.length > 0 || missingRadius.length > 0 || missingWeights.length > 0) {
      console.error("Apps SDK UI token drift detected.");
      console.error(`Upstream version: ${upstreamVersion}`);
      if (missingColors.length > 0) {
        console.error("Foundation colors not found upstream:");
        missingColors.forEach((entry) => {
          console.error(`- ${entry.name}: ${entry.value}`);
        });
      }
      if (missingRadius.length > 0) {
        console.error("Foundation radius values not found upstream (px):");
        missingRadius.forEach((value) => {
          console.error(`- ${value}`);
        });
      }
      if (missingWeights.length > 0) {
        console.error("Foundation font weights not found upstream:");
        missingWeights.forEach((value) => {
          console.error(`- ${value}`);
        });
      }
      process.exit(1);
    }

    console.log("Apps SDK UI token drift check passed.");
    console.log(`Upstream version: ${upstreamVersion}`);
    console.log(`Checked ${foundationEntries.length} foundation color values.`);
    if (spacingMismatches.length > 0) {
      console.warn("Spacing values not aligned to upstream spacing base:");
      spacingMismatches.forEach((value) => {
        console.warn(`- ${value}px`);
      });
    }
    if (typographyMismatches.length > 0) {
      console.warn("Typography size/line-height pairs not found upstream (size:line):");
      typographyMismatches.forEach((pair) => {
        console.warn(`- ${pair}`);
      });
    }
    if (shadowMismatches.length > 0) {
      console.warn("Shadows not found upstream:");
      shadowMismatches.forEach((shadow) => {
        console.warn(`- ${shadow}`);
      });
    }
  } catch (error) {
    console.error("Token drift check failed:", error);
    process.exit(1);
  }
}

main();
