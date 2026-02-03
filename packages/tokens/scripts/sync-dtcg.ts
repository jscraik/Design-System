import { readFile, writeFile } from "fs/promises";

const dtcgPath = new URL("../src/tokens/index.dtcg.json", import.meta.url);
const colorsPath = new URL("../src/colors.ts", import.meta.url);
const spacingPath = new URL("../src/spacing.ts", import.meta.url);
const typographyPath = new URL("../src/typography.ts", import.meta.url);
const radiusPath = new URL("../src/radius.ts", import.meta.url);
const shadowPath = new URL("../src/shadows.ts", import.meta.url);
const sizePath = new URL("../src/sizes.ts", import.meta.url);

const banner = "// Generated from src/tokens/index.dtcg.json. Do not edit by hand.\n";

function formatTokenFile(doc: string, exportLine: string): string {
  return `${banner}/**\n * ${doc}\n */\n${exportLine}\n`;
}

// DTCG-compliant token types
type DtcgDimensionValue = { value: number; unit: "px" | "rem" | "em" | "%" };
type DtcgColorValue = string;
type DtcgFontFamilyValue = string;
type DtcgFontWeightValue = number | string;
type DtcgLetterSpacingValue = number;

type DtcgDimensionToken = { $value: DtcgDimensionValue; $type: "dimension" };
type DtcgColorToken = { $value: DtcgColorValue; $type: "color"; $description?: string };
type DtcgFontFamilyToken = { $value: DtcgFontFamilyValue; $type: "fontFamily" };
type DtcgFontWeightToken = { $value: DtcgFontWeightValue; $type: "fontWeight" };
type DtcgLetterSpacingToken = { $value: DtcgLetterSpacingValue; $type: "letterSpacing" };

type DtcgShadowLayer = {
  color: DtcgColorToken;
  offsetX: DtcgDimensionToken;
  offsetY: DtcgDimensionToken;
  blur: DtcgDimensionToken;
  spread: DtcgDimensionToken;
};

type DtcgShadowToken = { $value: DtcgShadowLayer[]; $type: "shadow" };

type DtcgTypographyStyle = {
  size?: DtcgDimensionToken;
  lineHeight?: DtcgDimensionToken;
  paragraphSpacing?: DtcgDimensionToken;
  weight?: DtcgFontWeightToken;
  emphasisWeight?: DtcgFontWeightToken;
  tracking?: DtcgLetterSpacingToken;
};

type DtcgRoot = {
  color: {
    background: {
      light: { primary: DtcgColorToken; secondary: DtcgColorToken; tertiary: DtcgColorToken };
      dark: { primary: DtcgColorToken; secondary: DtcgColorToken; tertiary: DtcgColorToken };
    };
    text: {
      light: {
        primary: DtcgColorToken;
        secondary: DtcgColorToken;
        tertiary: DtcgColorToken;
        inverted: DtcgColorToken;
      };
      dark: {
        primary: DtcgColorToken;
        secondary: DtcgColorToken;
        tertiary: DtcgColorToken;
        inverted: DtcgColorToken;
      };
    };
    icon: {
      light: {
        primary: DtcgColorToken;
        secondary: DtcgColorToken;
        tertiary: DtcgColorToken;
        inverted: DtcgColorToken;
        accent: DtcgColorToken;
        statusError: DtcgColorToken;
        statusWarning: DtcgColorToken;
        statusSuccess: DtcgColorToken;
      };
      dark: {
        primary: DtcgColorToken;
        secondary: DtcgColorToken;
        tertiary: DtcgColorToken;
        inverted: DtcgColorToken;
        accent: DtcgColorToken;
        statusError: DtcgColorToken;
        statusWarning: DtcgColorToken;
        statusSuccess: DtcgColorToken;
      };
    };
    border: {
      light: {
        light: DtcgColorToken;
        default: DtcgColorToken;
        heavy: DtcgColorToken;
      };
      dark: {
        default: DtcgColorToken;
        heavy: DtcgColorToken;
        light: DtcgColorToken;
      };
    };
    accent: {
      light: {
        gray: DtcgColorToken;
        red: DtcgColorToken;
        orange: DtcgColorToken;
        yellow: DtcgColorToken;
        green: DtcgColorToken;
        blue: DtcgColorToken;
        purple: DtcgColorToken;
        pink: DtcgColorToken;
        foreground: DtcgColorToken;
      };
      dark: {
        gray: DtcgColorToken;
        red: DtcgColorToken;
        orange: DtcgColorToken;
        yellow: DtcgColorToken;
        green: DtcgColorToken;
        blue: DtcgColorToken;
        purple: DtcgColorToken;
        pink: DtcgColorToken;
        foreground: DtcgColorToken;
      };
    };
    interactive: {
      light: { ring: DtcgColorToken };
      dark: { ring: DtcgColorToken };
    };
  };
  space: Record<string, DtcgDimensionToken>;
  radius: Record<string, DtcgDimensionToken>;
  size: Record<string, DtcgDimensionToken>;
  shadow: Record<string, DtcgShadowToken>;
  type: {
    fontFamily: DtcgFontFamilyToken;
    web: {
      hero: DtcgTypographyStyle;
      h1: DtcgTypographyStyle;
      h2: DtcgTypographyStyle;
      h3: DtcgTypographyStyle;
      h4: DtcgTypographyStyle;
      h5: DtcgTypographyStyle;
      h6: DtcgTypographyStyle;
      paragraphLg: DtcgTypographyStyle;
      paragraphMd: DtcgTypographyStyle;
      paragraphSm: DtcgTypographyStyle;
      heading1: DtcgTypographyStyle;
      heading2: DtcgTypographyStyle;
      heading3: DtcgTypographyStyle;
      body: DtcgTypographyStyle;
      bodySmall: DtcgTypographyStyle;
      caption: DtcgTypographyStyle;
      cardTitle: DtcgTypographyStyle;
      listTitle: DtcgTypographyStyle;
      listSubtitle: DtcgTypographyStyle;
      buttonLabel: DtcgTypographyStyle;
      buttonLabelSmall: DtcgTypographyStyle;
    };
  };
};

function getColorValue(token: DtcgColorToken, path: string): string {
  if (!token || token.$value === undefined) {
    throw new Error(`Missing color token value at ${path}`);
  }
  return token.$value;
}

function getDimensionValue(token: DtcgDimensionToken | undefined, path: string): number {
  if (!token || token.$value === undefined) {
    throw new Error(`Missing dimension token value at ${path}`);
  }
  return token.$value.value;
}

function getFontWeightValue(token: DtcgFontWeightToken | undefined, path: string): number | string {
  if (!token || token.$value === undefined) {
    throw new Error(`Missing font weight token value at ${path}`);
  }
  return token.$value;
}

function getLetterSpacingValue(token: DtcgLetterSpacingToken | undefined, path: string): number {
  if (!token || token.$value === undefined) {
    throw new Error(`Missing letter spacing token value at ${path}`);
  }
  return token.$value;
}

function getShadowValue(token: DtcgShadowToken, path: string): Array<{
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
}> {
  if (!token || token.$value === undefined) {
    throw new Error(`Missing shadow token value at ${path}`);
  }
  return token.$value.map((layer) => ({
    color: layer.color.$value,
    offsetX: layer.offsetX.$value.value,
    offsetY: layer.offsetY.$value.value,
    blur: layer.blur.$value.value,
    spread: layer.spread.$value.value,
  }));
}

function buildColors(dtcg: DtcgRoot) {
  const c = dtcg.color;
  return {
    background: {
      light: {
        primary: getColorValue(c.background.light.primary, "color.background.light.primary"),
        secondary: getColorValue(c.background.light.secondary, "color.background.light.secondary"),
        tertiary: getColorValue(c.background.light.tertiary, "color.background.light.tertiary"),
      },
      dark: {
        primary: getColorValue(c.background.dark.primary, "color.background.dark.primary"),
        secondary: getColorValue(c.background.dark.secondary, "color.background.dark.secondary"),
        tertiary: getColorValue(c.background.dark.tertiary, "color.background.dark.tertiary"),
      },
    },
    text: {
      light: {
        primary: getColorValue(c.text.light.primary, "color.text.light.primary"),
        secondary: getColorValue(c.text.light.secondary, "color.text.light.secondary"),
        tertiary: getColorValue(c.text.light.tertiary, "color.text.light.tertiary"),
        inverted: getColorValue(c.text.light.inverted, "color.text.light.inverted"),
      },
      dark: {
        primary: getColorValue(c.text.dark.primary, "color.text.dark.primary"),
        secondary: getColorValue(c.text.dark.secondary, "color.text.dark.secondary"),
        tertiary: getColorValue(c.text.dark.tertiary, "color.text.dark.tertiary"),
        inverted: getColorValue(c.text.dark.inverted, "color.text.dark.inverted"),
      },
    },
    icon: {
      light: {
        primary: getColorValue(c.icon.light.primary, "color.icon.light.primary"),
        secondary: getColorValue(c.icon.light.secondary, "color.icon.light.secondary"),
        tertiary: getColorValue(c.icon.light.tertiary, "color.icon.light.tertiary"),
        inverted: getColorValue(c.icon.light.inverted, "color.icon.light.inverted"),
        accent: getColorValue(c.icon.light.accent, "color.icon.light.accent"),
        statusError: getColorValue(c.icon.light.statusError, "color.icon.light.statusError"),
        statusWarning: getColorValue(c.icon.light.statusWarning, "color.icon.light.statusWarning"),
        statusSuccess: getColorValue(c.icon.light.statusSuccess, "color.icon.light.statusSuccess"),
      },
      dark: {
        primary: getColorValue(c.icon.dark.primary, "color.icon.dark.primary"),
        secondary: getColorValue(c.icon.dark.secondary, "color.icon.dark.secondary"),
        tertiary: getColorValue(c.icon.dark.tertiary, "color.icon.dark.tertiary"),
        inverted: getColorValue(c.icon.dark.inverted, "color.icon.dark.inverted"),
        accent: getColorValue(c.icon.dark.accent, "color.icon.dark.accent"),
        statusError: getColorValue(c.icon.dark.statusError, "color.icon.dark.statusError"),
        statusWarning: getColorValue(c.icon.dark.statusWarning, "color.icon.dark.statusWarning"),
        statusSuccess: getColorValue(c.icon.dark.statusSuccess, "color.icon.dark.statusSuccess"),
      },
    },
    border: {
      light: {
        light: getColorValue(c.border.light.light, "color.border.light.light"),
        default: getColorValue(c.border.light.default, "color.border.light.default"),
        heavy: getColorValue(c.border.light.heavy, "color.border.light.heavy"),
      },
      dark: {
        default: getColorValue(c.border.dark.default, "color.border.dark.default"),
        heavy: getColorValue(c.border.dark.heavy, "color.border.dark.heavy"),
        light: getColorValue(c.border.dark.light, "color.border.dark.light"),
      },
    },
    accent: {
      light: {
        gray: getColorValue(c.accent.light.gray, "color.accent.light.gray"),
        red: getColorValue(c.accent.light.red, "color.accent.light.red"),
        orange: getColorValue(c.accent.light.orange, "color.accent.light.orange"),
        yellow: getColorValue(c.accent.light.yellow, "color.accent.light.yellow"),
        green: getColorValue(c.accent.light.green, "color.accent.light.green"),
        blue: getColorValue(c.accent.light.blue, "color.accent.light.blue"),
        purple: getColorValue(c.accent.light.purple, "color.accent.light.purple"),
        pink: getColorValue(c.accent.light.pink, "color.accent.light.pink"),
        foreground: getColorValue(c.accent.light.foreground, "color.accent.light.foreground"),
      },
      dark: {
        gray: getColorValue(c.accent.dark.gray, "color.accent.dark.gray"),
        red: getColorValue(c.accent.dark.red, "color.accent.dark.red"),
        orange: getColorValue(c.accent.dark.orange, "color.accent.dark.orange"),
        yellow: getColorValue(c.accent.dark.yellow, "color.accent.dark.yellow"),
        green: getColorValue(c.accent.dark.green, "color.accent.dark.green"),
        blue: getColorValue(c.accent.dark.blue, "color.accent.dark.blue"),
        purple: getColorValue(c.accent.dark.purple, "color.accent.dark.purple"),
        pink: getColorValue(c.accent.dark.pink, "color.accent.dark.pink"),
        foreground: getColorValue(c.accent.dark.foreground, "color.accent.dark.foreground"),
      },
    },
    interactive: {
      light: {
        ring: getColorValue(c.interactive.light.ring, "color.interactive.light.ring"),
      },
      dark: {
        ring: getColorValue(c.interactive.dark.ring, "color.interactive.dark.ring"),
      },
    },
  } as const;
}

function buildSpacing(dtcg: DtcgRoot) {
  const space = dtcg.space;
  return [
    getDimensionValue(space.s128, "space.s128"),
    getDimensionValue(space.s64, "space.s64"),
    getDimensionValue(space.s48, "space.s48"),
    getDimensionValue(space.s40, "space.s40"),
    getDimensionValue(space.s32, "space.s32"),
    getDimensionValue(space.s24, "space.s24"),
    getDimensionValue(space.s16, "space.s16"),
    getDimensionValue(space.s12, "space.s12"),
    getDimensionValue(space.s8, "space.s8"),
    getDimensionValue(space.s4, "space.s4"),
    getDimensionValue(space.s2, "space.s2"),
    getDimensionValue(space.s0, "space.s0"),
  ] as const;
}

function buildSpacingTokens(dtcg: DtcgRoot) {
  const space = dtcg.space;
  return {
    s128: getDimensionValue(space.s128, "space.s128"),
    s64: getDimensionValue(space.s64, "space.s64"),
    s48: getDimensionValue(space.s48, "space.s48"),
    s40: getDimensionValue(space.s40, "space.s40"),
    s32: getDimensionValue(space.s32, "space.s32"),
    s24: getDimensionValue(space.s24, "space.s24"),
    s16: getDimensionValue(space.s16, "space.s16"),
    s12: getDimensionValue(space.s12, "space.s12"),
    s8: getDimensionValue(space.s8, "space.s8"),
    s4: getDimensionValue(space.s4, "space.s4"),
    s2: getDimensionValue(space.s2, "space.s2"),
    s0: getDimensionValue(space.s0, "space.s0"),
  } as const;
}

function buildRadius(dtcg: DtcgRoot) {
  const radius = dtcg.radius;
  return {
    r6: getDimensionValue(radius.r6, "radius.r6"),
    r8: getDimensionValue(radius.r8, "radius.r8"),
    r10: getDimensionValue(radius.r10, "radius.r10"),
    r12: getDimensionValue(radius.r12, "radius.r12"),
    r16: getDimensionValue(radius.r16, "radius.r16"),
    r18: getDimensionValue(radius.r18, "radius.r18"),
    r21: getDimensionValue(radius.r21, "radius.r21"),
    r24: getDimensionValue(radius.r24, "radius.r24"),
    r30: getDimensionValue(radius.r30, "radius.r30"),
    round: getDimensionValue(radius.round, "radius.round"),
  } as const;
}

function buildShadows(dtcg: DtcgRoot) {
  const shadow = dtcg.shadow;
  return {
    card: getShadowValue(shadow.card, "shadow.card"),
    pip: getShadowValue(shadow.pip, "shadow.pip"),
    pill: getShadowValue(shadow.pill, "shadow.pill"),
    close: getShadowValue(shadow.close, "shadow.close"),
  } as const;
}

function buildSizes(dtcg: DtcgRoot) {
  const size = dtcg.size;
  return {
    controlHeight: getDimensionValue(size.controlHeight, "size.controlHeight"),
    cardHeaderHeight: getDimensionValue(size.cardHeaderHeight, "size.cardHeaderHeight"),
    hitTarget: getDimensionValue(size.hitTarget, "size.hitTarget"),
  } as const;
}

function buildTypography(dtcg: DtcgRoot) {
  const t = dtcg.type;
  // Use web platform values
  const web = t.web;
  return {
    fontFamily: t.fontFamily.$value,
    hero: {
      size: getDimensionValue(web.hero.size, "type.web.hero.size"),
      lineHeight: getDimensionValue(web.hero.lineHeight, "type.web.hero.lineHeight"),
      paragraphSpacing: getDimensionValue(web.hero.paragraphSpacing, "type.web.hero.paragraphSpacing"),
      weight: getFontWeightValue(web.hero.weight, "type.web.hero.weight"),
      tracking: getLetterSpacingValue(web.hero.tracking, "type.web.hero.tracking"),
    },
    h1: {
      size: getDimensionValue(web.h1.size, "type.web.h1.size"),
      lineHeight: getDimensionValue(web.h1.lineHeight, "type.web.h1.lineHeight"),
      paragraphSpacing: getDimensionValue(web.h1.paragraphSpacing, "type.web.h1.paragraphSpacing"),
      weight: getFontWeightValue(web.h1.weight, "type.web.h1.weight"),
      tracking: getLetterSpacingValue(web.h1.tracking, "type.web.h1.tracking"),
    },
    h2: {
      size: getDimensionValue(web.h2.size, "type.web.h2.size"),
      lineHeight: getDimensionValue(web.h2.lineHeight, "type.web.h2.lineHeight"),
      paragraphSpacing: getDimensionValue(web.h2.paragraphSpacing, "type.web.h2.paragraphSpacing"),
      weight: getFontWeightValue(web.h2.weight, "type.web.h2.weight"),
      tracking: getLetterSpacingValue(web.h2.tracking, "type.web.h2.tracking"),
    },
    h3: {
      size: getDimensionValue(web.h3.size, "type.web.h3.size"),
      lineHeight: getDimensionValue(web.h3.lineHeight, "type.web.h3.lineHeight"),
      paragraphSpacing: getDimensionValue(web.h3.paragraphSpacing, "type.web.h3.paragraphSpacing"),
      weight: getFontWeightValue(web.h3.weight, "type.web.h3.weight"),
      tracking: getLetterSpacingValue(web.h3.tracking, "type.web.h3.tracking"),
    },
    h4: {
      size: getDimensionValue(web.h4.size, "type.web.h4.size"),
      lineHeight: getDimensionValue(web.h4.lineHeight, "type.web.h4.lineHeight"),
      paragraphSpacing: getDimensionValue(web.h4.paragraphSpacing, "type.web.h4.paragraphSpacing"),
      weight: getFontWeightValue(web.h4.weight, "type.web.h4.weight"),
      tracking: getLetterSpacingValue(web.h4.tracking, "type.web.h4.tracking"),
    },
    h5: {
      size: getDimensionValue(web.h5.size, "type.web.h5.size"),
      lineHeight: getDimensionValue(web.h5.lineHeight, "type.web.h5.lineHeight"),
      paragraphSpacing: getDimensionValue(web.h5.paragraphSpacing, "type.web.h5.paragraphSpacing"),
      weight: getFontWeightValue(web.h5.weight, "type.web.h5.weight"),
      tracking: getLetterSpacingValue(web.h5.tracking, "type.web.h5.tracking"),
    },
    h6: {
      size: getDimensionValue(web.h6.size, "type.web.h6.size"),
      lineHeight: getDimensionValue(web.h6.lineHeight, "type.web.h6.lineHeight"),
      paragraphSpacing: getDimensionValue(web.h6.paragraphSpacing, "type.web.h6.paragraphSpacing"),
      weight: getFontWeightValue(web.h6.weight, "type.web.h6.weight"),
      tracking: getLetterSpacingValue(web.h6.tracking, "type.web.h6.tracking"),
    },
    paragraphLg: {
      size: getDimensionValue(web.paragraphLg.size, "type.web.paragraphLg.size"),
      lineHeight: getDimensionValue(web.paragraphLg.lineHeight, "type.web.paragraphLg.lineHeight"),
      paragraphSpacing: getDimensionValue(
        web.paragraphLg.paragraphSpacing,
        "type.web.paragraphLg.paragraphSpacing",
      ),
      weight: getFontWeightValue(web.paragraphLg.weight, "type.web.paragraphLg.weight"),
      emphasisWeight: getFontWeightValue(
        web.paragraphLg.emphasisWeight,
        "type.web.paragraphLg.emphasisWeight",
      ),
      tracking: getLetterSpacingValue(web.paragraphLg.tracking, "type.web.paragraphLg.tracking"),
    },
    paragraphMd: {
      size: getDimensionValue(web.paragraphMd.size, "type.web.paragraphMd.size"),
      lineHeight: getDimensionValue(web.paragraphMd.lineHeight, "type.web.paragraphMd.lineHeight"),
      paragraphSpacing: getDimensionValue(
        web.paragraphMd.paragraphSpacing,
        "type.web.paragraphMd.paragraphSpacing",
      ),
      weight: getFontWeightValue(web.paragraphMd.weight, "type.web.paragraphMd.weight"),
      emphasisWeight: getFontWeightValue(
        web.paragraphMd.emphasisWeight,
        "type.web.paragraphMd.emphasisWeight",
      ),
      tracking: getLetterSpacingValue(web.paragraphMd.tracking, "type.web.paragraphMd.tracking"),
    },
    paragraphSm: {
      size: getDimensionValue(web.paragraphSm.size, "type.web.paragraphSm.size"),
      lineHeight: getDimensionValue(web.paragraphSm.lineHeight, "type.web.paragraphSm.lineHeight"),
      paragraphSpacing: getDimensionValue(
        web.paragraphSm.paragraphSpacing,
        "type.web.paragraphSm.paragraphSpacing",
      ),
      weight: getFontWeightValue(web.paragraphSm.weight, "type.web.paragraphSm.weight"),
      emphasisWeight: getFontWeightValue(
        web.paragraphSm.emphasisWeight,
        "type.web.paragraphSm.emphasisWeight",
      ),
      tracking: getLetterSpacingValue(web.paragraphSm.tracking, "type.web.paragraphSm.tracking"),
    },
    heading1: {
      size: getDimensionValue(web.heading1.size, "type.web.heading1.size"),
      lineHeight: getDimensionValue(web.heading1.lineHeight, "type.web.heading1.lineHeight"),
      weight: getFontWeightValue(web.heading1.weight, "type.web.heading1.weight"),
      tracking: getLetterSpacingValue(web.heading1.tracking, "type.web.heading1.tracking"),
    },
    heading2: {
      size: getDimensionValue(web.heading2.size, "type.web.heading2.size"),
      lineHeight: getDimensionValue(web.heading2.lineHeight, "type.web.heading2.lineHeight"),
      weight: getFontWeightValue(web.heading2.weight, "type.web.heading2.weight"),
      tracking: getLetterSpacingValue(web.heading2.tracking, "type.web.heading2.tracking"),
    },
    heading3: {
      size: getDimensionValue(web.heading3.size, "type.web.heading3.size"),
      lineHeight: getDimensionValue(web.heading3.lineHeight, "type.web.heading3.lineHeight"),
      weight: getFontWeightValue(web.heading3.weight, "type.web.heading3.weight"),
      tracking: getLetterSpacingValue(web.heading3.tracking, "type.web.heading3.tracking"),
    },
    body: {
      size: getDimensionValue(web.body.size, "type.web.body.size"),
      lineHeight: getDimensionValue(web.body.lineHeight, "type.web.body.lineHeight"),
      weight: getFontWeightValue(web.body.weight, "type.web.body.weight"),
      emphasisWeight: getFontWeightValue(web.body.emphasisWeight, "type.web.body.emphasisWeight"),
      tracking: getLetterSpacingValue(web.body.tracking, "type.web.body.tracking"),
    },
    bodySmall: {
      size: getDimensionValue(web.bodySmall.size, "type.web.bodySmall.size"),
      lineHeight: getDimensionValue(web.bodySmall.lineHeight, "type.web.bodySmall.lineHeight"),
      weight: getFontWeightValue(web.bodySmall.weight, "type.web.bodySmall.weight"),
      emphasisWeight: getFontWeightValue(
        web.bodySmall.emphasisWeight,
        "type.web.bodySmall.emphasisWeight",
      ),
      tracking: getLetterSpacingValue(web.bodySmall.tracking, "type.web.bodySmall.tracking"),
    },
    caption: {
      size: getDimensionValue(web.caption.size, "type.web.caption.size"),
      lineHeight: getDimensionValue(web.caption.lineHeight, "type.web.caption.lineHeight"),
      paragraphSpacing: getDimensionValue(web.caption.paragraphSpacing, "type.web.caption.paragraphSpacing"),
      weight: getFontWeightValue(web.caption.weight, "type.web.caption.weight"),
      emphasisWeight: getFontWeightValue(web.caption.emphasisWeight, "type.web.caption.emphasisWeight"),
      tracking: getLetterSpacingValue(web.caption.tracking, "type.web.caption.tracking"),
    },
    cardTitle: {
      size: getDimensionValue(web.cardTitle.size, "type.web.cardTitle.size"),
      lineHeight: getDimensionValue(web.cardTitle.lineHeight, "type.web.cardTitle.lineHeight"),
      weight: getFontWeightValue(web.cardTitle.weight, "type.web.cardTitle.weight"),
      tracking: getLetterSpacingValue(web.cardTitle.tracking, "type.web.cardTitle.tracking"),
    },
    listTitle: {
      size: getDimensionValue(web.listTitle.size, "type.web.listTitle.size"),
      lineHeight: getDimensionValue(web.listTitle.lineHeight, "type.web.listTitle.lineHeight"),
      weight: getFontWeightValue(web.listTitle.weight, "type.web.listTitle.weight"),
      tracking: getLetterSpacingValue(web.listTitle.tracking, "type.web.listTitle.tracking"),
    },
    listSubtitle: {
      size: getDimensionValue(web.listSubtitle.size, "type.web.listSubtitle.size"),
      lineHeight: getDimensionValue(web.listSubtitle.lineHeight, "type.web.listSubtitle.lineHeight"),
      weight: getFontWeightValue(web.listSubtitle.weight, "type.web.listSubtitle.weight"),
      tracking: getLetterSpacingValue(web.listSubtitle.tracking, "type.web.listSubtitle.tracking"),
    },
    buttonLabel: {
      size: getDimensionValue(web.buttonLabel.size, "type.web.buttonLabel.size"),
      lineHeight: getDimensionValue(web.buttonLabel.lineHeight, "type.web.buttonLabel.lineHeight"),
      weight: getFontWeightValue(web.buttonLabel.weight, "type.web.buttonLabel.weight"),
      tracking: getLetterSpacingValue(web.buttonLabel.tracking, "type.web.buttonLabel.tracking"),
    },
    buttonLabelSmall: {
      size: getDimensionValue(web.buttonLabelSmall.size, "type.web.buttonLabelSmall.size"),
      lineHeight: getDimensionValue(web.buttonLabelSmall.lineHeight, "type.web.buttonLabelSmall.lineHeight"),
      weight: getFontWeightValue(web.buttonLabelSmall.weight, "type.web.buttonLabelSmall.weight"),
      tracking: getLetterSpacingValue(web.buttonLabelSmall.tracking, "type.web.buttonLabelSmall.tracking"),
    },
  } as const;
}

const dtcgRaw = await readFile(dtcgPath, "utf8");
const dtcg = JSON.parse(dtcgRaw) as DtcgRoot;

const colorTokens = buildColors(dtcg);
const spacingScale = buildSpacing(dtcg);
const spaceTokens = buildSpacingTokens(dtcg);
const radiusTokens = buildRadius(dtcg);
const shadowTokens = buildShadows(dtcg);
const sizeTokens = buildSizes(dtcg);
const typographyTokens = buildTypography(dtcg);

await writeFile(
  colorsPath,
  formatTokenFile(
    "Color design tokens grouped by category and scheme. Values are hex colors in #RRGGBB format.",
    `export const colorTokens = ${JSON.stringify(colorTokens, null, 2)} as const;`,
  ),
);

await writeFile(
  spacingPath,
  formatTokenFile(
    "Spacing scale values (px), including named values and a descending scale.",
    `export const spaceTokens = ${JSON.stringify(spaceTokens, null, 2)} as const;\nexport const spacingScale = ${JSON.stringify(spacingScale)} as const;`,
  ),
);

await writeFile(
  typographyPath,
  formatTokenFile(
    "Typography tokens for web usage. Sizes, line heights, and tracking are numeric values.",
    `export const typographyTokens = ${JSON.stringify(typographyTokens, null, 2)} as const;`,
  ),
);

await writeFile(
  radiusPath,
  formatTokenFile(
    "Corner radius tokens in px.",
    `export const radiusTokens = ${JSON.stringify(radiusTokens, null, 2)} as const;`,
  ),
);

await writeFile(
  shadowPath,
  formatTokenFile(
    "Shadow tokens with offsets, blur, and spread in px plus hex colors.",
    `export const shadowTokens = ${JSON.stringify(shadowTokens, null, 2)} as const;`,
  ),
);

await writeFile(
  sizePath,
  formatTokenFile(
    "Size tokens in px for common component dimensions.",
    `export const sizeTokens = ${JSON.stringify(sizeTokens, null, 2)} as const;`,
  ),
);

console.log("✅ Token files generated from DTCG source");
