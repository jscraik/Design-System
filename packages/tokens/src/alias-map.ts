import { colorTokens } from "./colors.js";
import { radiusTokens } from "./radius.js";
import { shadowTokens } from "./shadows.js";
import { sizeTokens } from "./sizes.js";
import { spacingScale } from "./spacing.js";
import { typographyTokens } from "./typography.js";

type AliasPath = {
  path: string;
};

type AliasValue = AliasPath | { value: string | number };

type ModeAlias = {
  light: AliasValue;
  dark: AliasValue;
  highContrast: AliasValue;
};

type ColorAliasMap = {
  [token: string]: ModeAlias;
};

export type TokenAliasMap = {
  color: {
    background: ColorAliasMap;
    text: ColorAliasMap;
    icon: ColorAliasMap;
    border: ColorAliasMap;
    accent: ColorAliasMap;
    interactive: ColorAliasMap;
  };
  space: Record<string, AliasValue>;
  radius: Record<string, AliasValue>;
  shadow: Record<string, AliasValue>;
  size: Record<string, AliasValue>;
  type: Record<string, AliasValue>;
  motion: Record<string, AliasValue>;
};

function buildModeMap(
  category: "background" | "text" | "icon" | "border" | "accent" | "interactive",
): ColorAliasMap {
  const tokens = colorTokens[category];
  const keys = Object.keys(tokens.light);
  const map: ColorAliasMap = {};

  for (const key of keys) {
    map[key] = {
      light: { path: `color.${category}.light.${key}` },
      dark: { path: `color.${category}.dark.${key}` },
      // High contrast defaults to dark tokens until dedicated HC tokens exist.
      highContrast: { path: `color.${category}.dark.${key}` },
    };
  }

  return map;
}

function buildSpaceMap(values: readonly number[]): Record<string, AliasValue> {
  return Object.fromEntries(values.map((value) => [String(value), { path: `space.s${value}` }]));
}

function buildRecordMap<T extends Record<string, unknown>>(
  record: T,
  prefix: string,
): Record<string, AliasValue> {
  return Object.fromEntries(Object.keys(record).map((key) => [key, { path: `${prefix}.${key}` }]));
}

function buildTypographyMap(record: typeof typographyTokens): Record<string, AliasValue> {
  return Object.fromEntries(
    Object.keys(record).map((key) => {
      if (key === "fontFamily") {
        return [key, { path: "type.fontFamily" }];
      }
      return [key, { path: `type.web.${key}` }];
    }),
  );
}

export const tokenAliasMap: TokenAliasMap = {
  color: {
    background: buildModeMap("background"),
    text: buildModeMap("text"),
    icon: buildModeMap("icon"),
    border: buildModeMap("border"),
    accent: buildModeMap("accent"),
    interactive: buildModeMap("interactive"),
  },
  space: buildSpaceMap(spacingScale),
  radius: buildRecordMap(radiusTokens, "radius"),
  shadow: buildRecordMap(shadowTokens, "shadow"),
  size: buildRecordMap(sizeTokens, "size"),
  type: buildTypographyMap(typographyTokens),
  motion: {
    standard: { value: 0.25 },
    fast: { value: 0.15 },
    slow: { value: 0.35 },
    reduced: { value: 0.1 },
  },
};
