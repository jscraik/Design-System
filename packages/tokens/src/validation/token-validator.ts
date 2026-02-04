import { readFile } from "fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { tokenAliasMap, type TokenAliasMap } from "../alias-map.js";

type ValidationError = {
  code: string;
  message: string;
  suggestion: string;
};

type ValidationResult = {
  errors: ValidationError[];
};

// DTCG-compliant token types
type DtcgDimensionValue = { value: number; unit: "px" | "rem" | "em" | "%" };
type DtcgColorToken = { $value: string; $type: "color" };
type DtcgDimensionToken = { $value: DtcgDimensionValue; $type: "dimension" };

type DtcgRoot = {
  color: Record<string, Record<string, Record<string, DtcgColorToken>>>;
  space: Record<string, DtcgDimensionToken>;
  radius: Record<string, DtcgDimensionToken>;
  size: Record<string, DtcgDimensionToken>;
  shadow: Record<string, { $value: unknown[]; $type: "shadow" }>;
  type: Record<string, DtcgDimensionToken | Record<string, unknown>>;
};

type NonColorAliasCategory = "space" | "radius" | "size" | "shadow" | "type";
const NON_COLOR_ALIAS_VALUE_ALLOWLIST: Record<
  NonColorAliasCategory,
  ReadonlySet<string | number>
> = {
  space: new Set(),
  radius: new Set(),
  size: new Set(),
  shadow: new Set(),
  type: new Set(),
};

const CONTRAST_PAIRS = [
  { background: "background.primary", text: "text.primary", min: 4.5 },
  { background: "background.secondary", text: "text.primary", min: 4.5 },
  { background: "background.tertiary", text: "text.secondary", min: 4.5 },
];

function resolveDtcgPath(): string {
  try {
    const url = new URL("../tokens/index.dtcg.json", import.meta.url);
    if (url.protocol === "file:") {
      return fileURLToPath(url);
    }
  } catch {
    // fall through to cwd-based resolution
  }
  return resolve(process.cwd(), "src/tokens/index.dtcg.json");
}

async function loadDtcgTokens(): Promise<DtcgRoot> {
  const dtcgPath = resolveDtcgPath();
  const raw = await readFile(dtcgPath, "utf8");
  return JSON.parse(raw) as DtcgRoot;
}

function resolvePath(root: DtcgRoot, path: string): { $value?: string | number | DtcgDimensionValue } | null {
  const parts = path.split(".");
  let current: unknown = root;
  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return (current as { $value?: string | number | DtcgDimensionValue }) ?? null;
}

function isTokenGroup(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  return Object.values(value).some((entry) => {
    if (!entry || typeof entry !== "object") return false;
    return "$value" in (entry as Record<string, unknown>);
  });
}

function collectModeKeys(value: Record<string, { $value?: unknown }>): string[] {
  return Object.keys(value).sort();
}

function validateModeCompleteness(root: DtcgRoot): ValidationError[] {
  const errors: ValidationError[] = [];
  const categories = ["background", "text", "icon", "border", "accent", "interactive"] as const;

  for (const category of categories) {
    const light = root.color?.[category]?.light ?? {};
    const dark = root.color?.[category]?.dark ?? {};
    const highContrast = root.color?.[category]?.highContrast ?? {};
    const lightKeys = collectModeKeys(light);
    const darkKeys = collectModeKeys(dark);
    const highContrastKeys = collectModeKeys(highContrast);

    const missingInDark = lightKeys.filter((key) => !darkKeys.includes(key));
    const missingInLight = darkKeys.filter((key) => !lightKeys.includes(key));
    const missingInHighContrastFromLight = lightKeys.filter((key) => !highContrastKeys.includes(key));
    const missingInHighContrastFromDark = darkKeys.filter((key) => !highContrastKeys.includes(key));
    const missingInLightFromHighContrast = highContrastKeys.filter((key) => !lightKeys.includes(key));
    const missingInDarkFromHighContrast = highContrastKeys.filter((key) => !darkKeys.includes(key));

    if (
      missingInDark.length > 0 ||
      missingInLight.length > 0 ||
      missingInHighContrastFromLight.length > 0 ||
      missingInHighContrastFromDark.length > 0 ||
      missingInLightFromHighContrast.length > 0 ||
      missingInDarkFromHighContrast.length > 0
    ) {
      errors.push({
        code: "TOKEN_MODE_MISSING",
        message: `Color mode mismatch in '${category}'.`,
        suggestion: `Ensure light, dark, and highContrast mode tokens have matching keys. Missing dark: ${missingInDark.join(", ") || "none"}. Missing light: ${missingInLight.join(", ") || "none"}. Missing highContrast (from light): ${missingInHighContrastFromLight.join(", ") || "none"}. Missing highContrast (from dark): ${missingInHighContrastFromDark.join(", ") || "none"}. Missing light (from highContrast): ${missingInLightFromHighContrast.join(", ") || "none"}. Missing dark (from highContrast): ${missingInDarkFromHighContrast.join(", ") || "none"}.`,
      });
    }
  }

  return errors;
}

function validateAliasMap(root: DtcgRoot, aliasMap: TokenAliasMap): ValidationError[] {
  const errors: ValidationError[] = [];

  const colorCategories = Object.entries(aliasMap.color);
  for (const [category, mapping] of colorCategories) {
    for (const [tokenName, modes] of Object.entries(mapping)) {
      for (const [mode, value] of Object.entries(modes)) {
        if ("value" in value) {
          errors.push({
            code: "TOKEN_ALIAS_RAW_VALUE",
            message: `Alias '${category}.${tokenName}.${mode}' uses a raw value instead of a token path.`,
            suggestion:
              "Replace raw values with a brand token path reference in packages/tokens/src/alias-map.ts.",
          });
          continue;
        }
        if ("path" in value) {
          const token = resolvePath(root, value.path);
          if (!token || token.$value === undefined) {
            errors.push({
              code: "TOKEN_ALIAS_MISSING",
              message: `Alias '${category}.${tokenName}.${mode}' references missing path '${value.path}'.`,
              suggestion: "Update the alias map or add the missing token to the DTCG source.",
            });
          }
        }
      }
    }
  }

  const nonModeCategories: Array<
    [NonColorAliasCategory, Record<string, { path?: string; value?: string | number }>]
  > = [
    ["space", aliasMap.space],
    ["radius", aliasMap.radius],
    ["shadow", aliasMap.shadow],
    ["size", aliasMap.size],
    ["type", aliasMap.type],
  ];

  for (const [category, mapping] of nonModeCategories) {
    for (const [tokenName, value] of Object.entries(mapping)) {
      if ("value" in value && value.value !== undefined) {
        const allowlist = NON_COLOR_ALIAS_VALUE_ALLOWLIST[category];
        if (!allowlist.has(value.value)) {
          errors.push({
            code: "TOKEN_ALIAS_COMPUTED_VALUE_NOT_ALLOWED",
            message: `Alias '${category}.${tokenName}' uses computed value '${value.value}' outside the allowlist.`,
            suggestion: `Prefer a brand path reference (${category}.*) or add the value to the allowlist in token-validator.ts.`,
          });
        }
        continue;
      }
      if ("path" in value && value.path) {
        const expectedPrefix = `${category}.`;
        if (!value.path.startsWith(expectedPrefix)) {
          errors.push({
            code: "TOKEN_ALIAS_NON_COLOR_BRAND_PATH",
            message: `Alias '${category}.${tokenName}' must reference a Brand path starting with '${expectedPrefix}'.`,
            suggestion: `Update the alias to reference a Brand token (for example: ${expectedPrefix}${tokenName}).`,
          });
          continue;
        }
        const token = resolvePath(root, value.path);
        if (!token || token.$value === undefined) {
          if (category === "type" && token && isTokenGroup(token)) {
            continue;
          }
          errors.push({
            code: "TOKEN_ALIAS_MISSING",
            message: `Alias '${category}.${tokenName}' references missing path '${value.path}'.`,
            suggestion: "Update the alias map or add the missing token to the DTCG source.",
          });
        }
      }
    }
  }

  return errors;
}

function validateAliasCoverage(root: DtcgRoot, aliasMap: TokenAliasMap): ValidationError[] {
  const errors: ValidationError[] = [];
  const categories = ["background", "text", "icon", "border", "accent", "interactive"] as const;

  for (const category of categories) {
    const lightKeys = Object.keys(root.color?.[category]?.light ?? {});
    const aliasKeys = Object.keys(aliasMap.color[category] ?? {});
    const missing = lightKeys.filter((key) => !aliasKeys.includes(key));

    if (missing.length > 0) {
      errors.push({
        code: "TOKEN_ALIAS_VALUE_MISSING",
        message: `Alias map missing ${category} tokens: ${missing.join(", ")}.`,
        suggestion: "Update packages/tokens/src/alias-map.ts to cover all tokens.",
      });
    }
  }

  return errors;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(foreground: string, background: string): number | null {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (!fg || !bg) return null;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type ModeAliases = { light: unknown; dark: unknown; highContrast: unknown };

function resolveAliasColor(
  root: DtcgRoot,
  category: keyof TokenAliasMap["color"],
  tokenName: string,
  mode: keyof ModeAliases,
  aliasMap: TokenAliasMap,
): string | null {
  const alias = aliasMap.color[category]?.[tokenName]?.[mode];
  if (!alias) return null;
  if ("value" in alias && typeof alias.value === "string") {
    return alias.value;
  }
  if ("path" in alias) {
    const token = resolvePath(root, alias.path);
    if (token && typeof token.$value === "string") {
      return token.$value;
    }
  }
  return null;
}

function validateContrast(root: DtcgRoot, aliasMap: TokenAliasMap): ValidationError[] {
  const errors: ValidationError[] = [];
  const modes: Array<keyof ModeAliases> = ["light", "dark", "highContrast"];

  for (const pair of CONTRAST_PAIRS) {
    const [backgroundCategory, backgroundToken] = pair.background.split(".");
    const [textCategory, textToken] = pair.text.split(".");

    for (const mode of modes) {
      const background = resolveAliasColor(
        root,
        backgroundCategory as keyof TokenAliasMap["color"],
        backgroundToken,
        mode,
        aliasMap,
      );
      const text = resolveAliasColor(
        root,
        textCategory as keyof TokenAliasMap["color"],
        textToken,
        mode,
        aliasMap,
      );

      if (!background || !text) {
        continue;
      }

      const ratio = contrastRatio(text, background);
      if (ratio !== null && ratio < pair.min) {
        errors.push({
          code: "TOKEN_CONTRAST_FAIL",
          message: `Contrast ratio ${ratio.toFixed(2)} for ${pair.text} on ${pair.background} (${mode}) is below ${pair.min}.`,
          suggestion: "Adjust token values or update the contrast pair thresholds.",
        });
      }
    }
  }

  return errors;
}

export async function validateTokens(): Promise<ValidationResult> {
  const root = await loadDtcgTokens();
  const errors = [
    ...validateModeCompleteness(root),
    ...validateAliasMap(root, tokenAliasMap),
    ...validateAliasCoverage(root, tokenAliasMap),
    ...validateContrast(root, tokenAliasMap),
  ];

  return { errors };
}

type NonColorAliasValueAllowlist = Readonly<{
  [K in keyof typeof NON_COLOR_ALIAS_VALUE_ALLOWLIST]: ReadonlySet<string>;
}>;

export type { ValidationError, NonColorAliasValueAllowlist };

/**
 * Read-only view of the non-color alias value allowlist.
 * The underlying configuration should only be modified within this module.
 */
export const NON_COLOR_ALIAS_VALUE_ALLOWLIST_READONLY =
  NON_COLOR_ALIAS_VALUE_ALLOWLIST as NonColorAliasValueAllowlist;
