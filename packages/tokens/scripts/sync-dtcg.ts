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

type DtcgToken<T = string | number> = { value: T; type?: string };
type DtcgShadowValue = Array<{
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
}>;
type DtcgRoot = {
  color: {
    background: {
      light: { primary: DtcgToken; secondary: DtcgToken; tertiary: DtcgToken };
      dark: { primary: DtcgToken; secondary: DtcgToken; tertiary: DtcgToken };
    };
    text: {
      light: {
        primary: DtcgToken;
        secondary: DtcgToken;
        tertiary: DtcgToken;
        inverted: DtcgToken;
      };
      dark: {
        primary: DtcgToken;
        secondary: DtcgToken;
        tertiary: DtcgToken;
        inverted: DtcgToken;
      };
    };
    icon: {
      light: {
        primary: DtcgToken;
        secondary: DtcgToken;
        tertiary: DtcgToken;
        inverted: DtcgToken;
        accent: DtcgToken;
        statusError: DtcgToken;
        statusWarning: DtcgToken;
        statusSuccess: DtcgToken;
      };
      dark: {
        primary: DtcgToken;
        secondary: DtcgToken;
        tertiary: DtcgToken;
        inverted: DtcgToken;
        accent: DtcgToken;
        statusError: DtcgToken;
        statusWarning: DtcgToken;
        statusSuccess: DtcgToken;
      };
    };
    border: {
      light: {
        light: DtcgToken;
        heavy: DtcgToken;
      };
      dark: {
        default: DtcgToken;
        light: DtcgToken;
      };
    };
    accent: {
      light: {
        gray: DtcgToken;
        red: DtcgToken;
        orange: DtcgToken;
        yellow: DtcgToken;
        green: DtcgToken;
        blue: DtcgToken;
        purple: DtcgToken;
        pink: DtcgToken;
        foreground: DtcgToken;
      };
      dark: {
        gray: DtcgToken;
        red: DtcgToken;
        orange: DtcgToken;
        yellow: DtcgToken;
        green: DtcgToken;
        blue: DtcgToken;
        purple: DtcgToken;
        pink: DtcgToken;
        foreground: DtcgToken;
      };
    };
    interactive: {
      light: { ring: DtcgToken };
      dark: { ring: DtcgToken };
    };
  };
  space: Record<string, DtcgToken>;
  radius: Record<string, DtcgToken>;
  size: Record<string, DtcgToken>;
  shadow: Record<string, DtcgToken<DtcgShadowValue>>;
  type: {
    fontFamily: DtcgToken;
    web: {
      heading1: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
      heading2: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
      heading3: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
      body: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        emphasisWeight: DtcgToken;
        tracking: DtcgToken;
      };
      bodySmall: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        emphasisWeight: DtcgToken;
        tracking: DtcgToken;
      };
      caption: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
      cardTitle: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
      listTitle: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
      listSubtitle: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
      buttonLabel: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
      buttonLabelSmall: {
        size: DtcgToken;
        lineHeight: DtcgToken;
        weight: DtcgToken;
        tracking: DtcgToken;
      };
    };
  };
};

function getValue<T>(token: DtcgToken<T>, path: string): T {
  if (!token || token.value === undefined) {
    throw new Error(`Missing token value at ${path}`);
  }
  return token.value;
}

function buildColors(dtcg: DtcgRoot) {
  const c = dtcg.color;
  return {
    background: {
      light: {
        primary: getValue(c.background.light.primary, "color.background.light.primary"),
        secondary: getValue(c.background.light.secondary, "color.background.light.secondary"),
        tertiary: getValue(c.background.light.tertiary, "color.background.light.tertiary"),
      },
      dark: {
        primary: getValue(c.background.dark.primary, "color.background.dark.primary"),
        secondary: getValue(c.background.dark.secondary, "color.background.dark.secondary"),
        tertiary: getValue(c.background.dark.tertiary, "color.background.dark.tertiary"),
      },
    },
    text: {
      light: {
        primary: getValue(c.text.light.primary, "color.text.light.primary"),
        secondary: getValue(c.text.light.secondary, "color.text.light.secondary"),
        tertiary: getValue(c.text.light.tertiary, "color.text.light.tertiary"),
        inverted: getValue(c.text.light.inverted, "color.text.light.inverted"),
      },
      dark: {
        primary: getValue(c.text.dark.primary, "color.text.dark.primary"),
        secondary: getValue(c.text.dark.secondary, "color.text.dark.secondary"),
        tertiary: getValue(c.text.dark.tertiary, "color.text.dark.tertiary"),
        inverted: getValue(c.text.dark.inverted, "color.text.dark.inverted"),
      },
    },
    icon: {
      light: {
        primary: getValue(c.icon.light.primary, "color.icon.light.primary"),
        secondary: getValue(c.icon.light.secondary, "color.icon.light.secondary"),
        tertiary: getValue(c.icon.light.tertiary, "color.icon.light.tertiary"),
        inverted: getValue(c.icon.light.inverted, "color.icon.light.inverted"),
        accent: getValue(c.icon.light.accent, "color.icon.light.accent"),
        statusError: getValue(c.icon.light.statusError, "color.icon.light.statusError"),
        statusWarning: getValue(c.icon.light.statusWarning, "color.icon.light.statusWarning"),
        statusSuccess: getValue(c.icon.light.statusSuccess, "color.icon.light.statusSuccess"),
      },
      dark: {
        primary: getValue(c.icon.dark.primary, "color.icon.dark.primary"),
        secondary: getValue(c.icon.dark.secondary, "color.icon.dark.secondary"),
        tertiary: getValue(c.icon.dark.tertiary, "color.icon.dark.tertiary"),
        inverted: getValue(c.icon.dark.inverted, "color.icon.dark.inverted"),
        accent: getValue(c.icon.dark.accent, "color.icon.dark.accent"),
        statusError: getValue(c.icon.dark.statusError, "color.icon.dark.statusError"),
        statusWarning: getValue(c.icon.dark.statusWarning, "color.icon.dark.statusWarning"),
        statusSuccess: getValue(c.icon.dark.statusSuccess, "color.icon.dark.statusSuccess"),
      },
    },
    border: {
      light: {
        light: getValue(c.border.light.light, "color.border.light.light"),
        heavy: getValue(c.border.light.heavy, "color.border.light.heavy"),
      },
      dark: {
        default: getValue(c.border.dark.default, "color.border.dark.default"),
        light: getValue(c.border.dark.light, "color.border.dark.light"),
      },
    },
    accent: {
      light: {
        gray: getValue(c.accent.light.gray, "color.accent.light.gray"),
        red: getValue(c.accent.light.red, "color.accent.light.red"),
        orange: getValue(c.accent.light.orange, "color.accent.light.orange"),
        yellow: getValue(c.accent.light.yellow, "color.accent.light.yellow"),
        green: getValue(c.accent.light.green, "color.accent.light.green"),
        blue: getValue(c.accent.light.blue, "color.accent.light.blue"),
        purple: getValue(c.accent.light.purple, "color.accent.light.purple"),
        pink: getValue(c.accent.light.pink, "color.accent.light.pink"),
        foreground: getValue(c.accent.light.foreground, "color.accent.light.foreground"),
      },
      dark: {
        gray: getValue(c.accent.dark.gray, "color.accent.dark.gray"),
        red: getValue(c.accent.dark.red, "color.accent.dark.red"),
        orange: getValue(c.accent.dark.orange, "color.accent.dark.orange"),
        yellow: getValue(c.accent.dark.yellow, "color.accent.dark.yellow"),
        green: getValue(c.accent.dark.green, "color.accent.dark.green"),
        blue: getValue(c.accent.dark.blue, "color.accent.dark.blue"),
        purple: getValue(c.accent.dark.purple, "color.accent.dark.purple"),
        pink: getValue(c.accent.dark.pink, "color.accent.dark.pink"),
        foreground: getValue(c.accent.dark.foreground, "color.accent.dark.foreground"),
      },
    },
    interactive: {
      light: {
        ring: getValue(c.interactive.light.ring, "color.interactive.light.ring"),
      },
      dark: {
        ring: getValue(c.interactive.dark.ring, "color.interactive.dark.ring"),
      },
    },
  } as const;
}

function buildSpacing(dtcg: DtcgRoot) {
  const space = dtcg.space;
  return [
    getValue(space.s128, "space.s128"),
    getValue(space.s64, "space.s64"),
    getValue(space.s48, "space.s48"),
    getValue(space.s40, "space.s40"),
    getValue(space.s32, "space.s32"),
    getValue(space.s24, "space.s24"),
    getValue(space.s16, "space.s16"),
    getValue(space.s12, "space.s12"),
    getValue(space.s8, "space.s8"),
    getValue(space.s4, "space.s4"),
    getValue(space.s2, "space.s2"),
    getValue(space.s0, "space.s0"),
  ] as const;
}

function buildRadius(dtcg: DtcgRoot) {
  const radius = dtcg.radius;
  return {
    r6: getValue(radius.r6, "radius.r6"),
    r8: getValue(radius.r8, "radius.r8"),
    r10: getValue(radius.r10, "radius.r10"),
    r12: getValue(radius.r12, "radius.r12"),
    r16: getValue(radius.r16, "radius.r16"),
    r18: getValue(radius.r18, "radius.r18"),
    r21: getValue(radius.r21, "radius.r21"),
    r24: getValue(radius.r24, "radius.r24"),
    r30: getValue(radius.r30, "radius.r30"),
    round: getValue(radius.round, "radius.round"),
  } as const;
}

function buildShadows(dtcg: DtcgRoot) {
  const shadow = dtcg.shadow;
  return {
    card: getValue(shadow.card, "shadow.card"),
    pip: getValue(shadow.pip, "shadow.pip"),
    pill: getValue(shadow.pill, "shadow.pill"),
    close: getValue(shadow.close, "shadow.close"),
  } as const;
}

function buildSizes(dtcg: DtcgRoot) {
  const size = dtcg.size;
  return {
    controlHeight: getValue(size.controlHeight, "size.controlHeight"),
    cardHeaderHeight: getValue(size.cardHeaderHeight, "size.cardHeaderHeight"),
    hitTarget: getValue(size.hitTarget, "size.hitTarget"),
  } as const;
}

function buildTypography(dtcg: DtcgRoot) {
  const t = dtcg.type;
  // Use web platform values as default
  const web = t.web;
  return {
    fontFamily: getValue(t.fontFamily, "type.fontFamily"),
    heading1: {
      size: getValue(web.heading1.size, "type.web.heading1.size"),
      lineHeight: getValue(web.heading1.lineHeight, "type.web.heading1.lineHeight"),
      weight: getValue(web.heading1.weight, "type.web.heading1.weight"),
      tracking: getValue(web.heading1.tracking, "type.web.heading1.tracking"),
    },
    heading2: {
      size: getValue(web.heading2.size, "type.web.heading2.size"),
      lineHeight: getValue(web.heading2.lineHeight, "type.web.heading2.lineHeight"),
      weight: getValue(web.heading2.weight, "type.web.heading2.weight"),
      tracking: getValue(web.heading2.tracking, "type.web.heading2.tracking"),
    },
    heading3: {
      size: getValue(web.heading3.size, "type.web.heading3.size"),
      lineHeight: getValue(web.heading3.lineHeight, "type.web.heading3.lineHeight"),
      weight: getValue(web.heading3.weight, "type.web.heading3.weight"),
      tracking: getValue(web.heading3.tracking, "type.web.heading3.tracking"),
    },
    body: {
      size: getValue(web.body.size, "type.web.body.size"),
      lineHeight: getValue(web.body.lineHeight, "type.web.body.lineHeight"),
      weight: getValue(web.body.weight, "type.web.body.weight"),
      emphasisWeight: getValue(web.body.emphasisWeight, "type.web.body.emphasisWeight"),
      tracking: getValue(web.body.tracking, "type.web.body.tracking"),
    },
    bodySmall: {
      size: getValue(web.bodySmall.size, "type.web.bodySmall.size"),
      lineHeight: getValue(web.bodySmall.lineHeight, "type.web.bodySmall.lineHeight"),
      weight: getValue(web.bodySmall.weight, "type.web.bodySmall.weight"),
      emphasisWeight: getValue(web.bodySmall.emphasisWeight, "type.web.bodySmall.emphasisWeight"),
      tracking: getValue(web.bodySmall.tracking, "type.web.bodySmall.tracking"),
    },
    caption: {
      size: getValue(web.caption.size, "type.web.caption.size"),
      lineHeight: getValue(web.caption.lineHeight, "type.web.caption.lineHeight"),
      weight: getValue(web.caption.weight, "type.web.caption.weight"),
      emphasisWeight: getValue(web.caption.emphasisWeight, "type.web.caption.emphasisWeight"),
      tracking: getValue(web.caption.tracking, "type.web.caption.tracking"),
    },
    cardTitle: {
      size: getValue(web.cardTitle.size, "type.web.cardTitle.size"),
      lineHeight: getValue(web.cardTitle.lineHeight, "type.web.cardTitle.lineHeight"),
      weight: getValue(web.cardTitle.weight, "type.web.cardTitle.weight"),
      tracking: getValue(web.cardTitle.tracking, "type.web.cardTitle.tracking"),
    },
    listTitle: {
      size: getValue(web.listTitle.size, "type.web.listTitle.size"),
      lineHeight: getValue(web.listTitle.lineHeight, "type.web.listTitle.lineHeight"),
      weight: getValue(web.listTitle.weight, "type.web.listTitle.weight"),
      tracking: getValue(web.listTitle.tracking, "type.web.listTitle.tracking"),
    },
    listSubtitle: {
      size: getValue(web.listSubtitle.size, "type.web.listSubtitle.size"),
      lineHeight: getValue(web.listSubtitle.lineHeight, "type.web.listSubtitle.lineHeight"),
      weight: getValue(web.listSubtitle.weight, "type.web.listSubtitle.weight"),
      tracking: getValue(web.listSubtitle.tracking, "type.web.listSubtitle.tracking"),
    },
    buttonLabel: {
      size: getValue(web.buttonLabel.size, "type.web.buttonLabel.size"),
      lineHeight: getValue(web.buttonLabel.lineHeight, "type.web.buttonLabel.lineHeight"),
      weight: getValue(web.buttonLabel.weight, "type.web.buttonLabel.weight"),
      tracking: getValue(web.buttonLabel.tracking, "type.web.buttonLabel.tracking"),
    },
    buttonLabelSmall: {
      size: getValue(web.buttonLabelSmall.size, "type.web.buttonLabelSmall.size"),
      lineHeight: getValue(web.buttonLabelSmall.lineHeight, "type.web.buttonLabelSmall.lineHeight"),
      weight: getValue(web.buttonLabelSmall.weight, "type.web.buttonLabelSmall.weight"),
      tracking: getValue(web.buttonLabelSmall.tracking, "type.web.buttonLabelSmall.tracking"),
    },
  } as const;
}

const dtcgRaw = await readFile(dtcgPath, "utf8");
const dtcg = JSON.parse(dtcgRaw);

const colorTokens = buildColors(dtcg);
const spacingScale = buildSpacing(dtcg);
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
    "Spacing scale values in descending order (px).",
    `export const spacingScale = ${JSON.stringify(spacingScale)} as const;`,
  ),
);

await writeFile(
  typographyPath,
  formatTokenFile(
    "Typography tokens for web usage. Sizes, line heights, and tracking are numeric CSS values.",
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
