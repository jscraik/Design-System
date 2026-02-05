import { describe, expect, it } from "vitest";

import { colorTokens } from "../src/colors.js";
import { sizeTokens } from "../src/sizes.js";
import { spaceTokens, spacingScale } from "../src/spacing.js";
import { typographyTokens } from "../src/typography.js";

describe("Token Validation", () => {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;

  function hexToRgb(hex: string) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
  }

  function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
    const [rs, gs, bs] = [r, g, b].map((value) => {
      const normalized = value / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function contrastRatio(foreground: string, background: string) {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);
    const l1 = relativeLuminance(fg);
    const l2 = relativeLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  describe("Color Tokens", () => {
    it("should have valid hex colors for background.light", () => {
      Object.entries(colorTokens.background.light).forEach(([_key, value]) => {
        expect(value).toMatch(hexPattern);
      });
    });

    it("should have valid hex colors for background.dark", () => {
      Object.entries(colorTokens.background.dark).forEach(([_key, value]) => {
        expect(value).toMatch(hexPattern);
      });
    });

    it("should have valid hex colors for text.light", () => {
      Object.entries(colorTokens.text.light).forEach(([_key, value]) => {
        expect(value).toMatch(hexPattern);
      });
    });

    it("should have valid hex colors for text.dark", () => {
      Object.entries(colorTokens.text.dark).forEach(([_key, value]) => {
        expect(value).toMatch(hexPattern);
      });
    });

    it("should have valid hex colors for icon.light", () => {
      Object.entries(colorTokens.icon.light).forEach(([_key, value]) => {
        expect(value).toMatch(hexPattern);
      });
    });

    it("should have valid hex colors for icon.dark", () => {
      Object.entries(colorTokens.icon.dark).forEach(([_key, value]) => {
        expect(value).toMatch(hexPattern);
      });
    });

    it("should have valid hex colors for accent.light", () => {
      Object.entries(colorTokens.accent.light).forEach(([_key, value]) => {
        expect(value).toMatch(hexPattern);
      });
    });

    it("should have valid hex colors for accent.dark", () => {
      Object.entries(colorTokens.accent.dark).forEach(([_key, value]) => {
        expect(value).toMatch(hexPattern);
      });
    });

    it("should have matching keys for light and dark variants", () => {
      const backgroundLightKeys = Object.keys(colorTokens.background.light).sort();
      const backgroundDarkKeys = Object.keys(colorTokens.background.dark).sort();
      expect(backgroundLightKeys).toEqual(backgroundDarkKeys);

      const textLightKeys = Object.keys(colorTokens.text.light).sort();
      const textDarkKeys = Object.keys(colorTokens.text.dark).sort();
      expect(textLightKeys).toEqual(textDarkKeys);

      const iconLightKeys = Object.keys(colorTokens.icon.light).sort();
      const iconDarkKeys = Object.keys(colorTokens.icon.dark).sort();
      expect(iconLightKeys).toEqual(iconDarkKeys);

      const accentLightKeys = Object.keys(colorTokens.accent.light).sort();
      const accentDarkKeys = Object.keys(colorTokens.accent.dark).sort();
      expect(accentLightKeys).toEqual(accentDarkKeys);
    });

    it("should include canonical accent hue keys", () => {
      const expectedAccentKeys = [
        "blue",
        "foreground",
        "gray",
        "green",
        "orange",
        "pink",
        "purple",
        "red",
        "yellow",
      ];

      const accentLightKeys = Object.keys(colorTokens.accent.light).sort();
      const accentDarkKeys = Object.keys(colorTokens.accent.dark).sort();

      expect(accentLightKeys).toEqual(expectedAccentKeys.sort());
      expect(accentDarkKeys).toEqual(expectedAccentKeys.sort());
    });

    it("should meet focus ring contrast against primary backgrounds", () => {
      const lightRing = colorTokens.interactive.light.ring;
      const darkRing = colorTokens.interactive.dark.ring;
      expect(lightRing).toMatch(hexPattern);
      expect(darkRing).toMatch(hexPattern);

      const lightContrast = contrastRatio(lightRing, colorTokens.background.light.primary);
      const darkContrast = contrastRatio(darkRing, colorTokens.background.dark.primary);

      expect(lightContrast).toBeGreaterThanOrEqual(3);
      expect(darkContrast).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Spacing Tokens", () => {
    it("should have all positive numbers", () => {
      spacingScale.forEach((value) => {
        expect(typeof value).toBe("number");
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it("should be in descending order", () => {
      for (let i = 0; i < spacingScale.length - 1; i++) {
        expect(spacingScale[i]).toBeGreaterThanOrEqual(spacingScale[i + 1]);
      }
    });

    it("should have at least 10 values", () => {
      expect(spacingScale.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Touch Target Tokens", () => {
    it("should enforce minimum hit target size", () => {
      expect(sizeTokens.hitTarget).toBeGreaterThanOrEqual(44);
    });
  });

  describe("Typography Tokens", () => {
    it("should have a valid font family", () => {
      expect(typeof typographyTokens.fontFamily).toBe("string");
      expect(typographyTokens.fontFamily.trim()).not.toBe("");
    });

    it("should have valid font sizes", () => {
      Object.entries(typographyTokens).forEach(([key, value]) => {
        if (key === "fontFamily") return;

        const token = value as { size?: number };
        expect(typeof token.size).toBe("number");
        expect(token.size).toBeGreaterThan(0);
      });
    });

    it("should have valid line heights", () => {
      Object.entries(typographyTokens).forEach(([key, value]) => {
        if (key === "fontFamily") return;

        const token = value as { lineHeight?: number };
        expect(typeof token.lineHeight).toBe("number");
        expect(token.lineHeight).toBeGreaterThan(0);
      });
    });

    it("should have valid font weights", () => {
      Object.entries(typographyTokens).forEach(([key, value]) => {
        if (key === "fontFamily") return;

        const token = value as {
          weight?: number;
          emphasisWeight?: number;
        };
        expect(typeof token.weight).toBe("number");
        expect(token.weight).toBeGreaterThanOrEqual(100);
        expect(token.weight).toBeLessThanOrEqual(900);

        if (token.emphasisWeight !== undefined) {
          expect(typeof token.emphasisWeight).toBe("number");
          expect(token.emphasisWeight).toBeGreaterThanOrEqual(100);
          expect(token.emphasisWeight).toBeLessThanOrEqual(900);
        }
      });
    });

    it("should have valid tracking values", () => {
      Object.entries(typographyTokens).forEach(([key, value]) => {
        if (key === "fontFamily") return;

        const token = value as { tracking?: number };
        expect(typeof token.tracking).toBe("number");
      });
    });

    it("should have line height greater than or equal to font size", () => {
      Object.entries(typographyTokens).forEach(([key, value]) => {
        if (key === "fontFamily") return;

        const token = value as { lineHeight?: number; size?: number };
        expect(token.lineHeight).toBeGreaterThanOrEqual(token.size);
      });
    });

    it("should include the responsive type scale keys", () => {
      const requiredKeys = [
        "hero",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "paragraphLg",
        "paragraphMd",
        "paragraphSm",
        "heading1",
        "heading2",
        "heading3",
        "body",
        "bodySmall",
        "caption",
      ];

      requiredKeys.forEach((key) => {
        expect(typographyTokens).toHaveProperty(key);
      });
    });

    it("should include paragraph spacing for responsive type tokens", () => {
      const responsiveKeys = [
        "hero",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "paragraphLg",
        "paragraphMd",
        "paragraphSm",
        "caption",
      ];

      responsiveKeys.forEach((key) => {
        const token = typographyTokens[key as keyof typeof typographyTokens] as {
          paragraphSpacing?: number;
        };

        expect(typeof token.paragraphSpacing).toBe("number");
        expect(token.paragraphSpacing).toBeGreaterThan(0);
        expect(spacingScale).toContain(token.paragraphSpacing);
      });
    });

    it("should enforce base paragraph size of 16px", () => {
      expect(typographyTokens.paragraphMd.size).toBe(16);
      expect(typographyTokens.body.size).toBe(16);
    });

    it("should keep the heading scale in descending order", () => {
      const { hero, h1, h2, h3, h4, h5, h6 } = typographyTokens;

      expect(hero.size).toBeGreaterThan(h1.size);
      expect(h1.size).toBeGreaterThan(h2.size);
      expect(h2.size).toBeGreaterThan(h3.size);
      expect(h3.size).toBeGreaterThan(h4.size);
      expect(h4.size).toBeGreaterThan(h5.size);
      expect(h5.size).toBeGreaterThan(h6.size);
    });

    it("should keep the paragraph scale in descending order", () => {
      const { paragraphLg, paragraphMd, paragraphSm, caption } = typographyTokens;

      expect(paragraphLg.size).toBeGreaterThan(paragraphMd.size);
      expect(paragraphMd.size).toBeGreaterThan(paragraphSm.size);
      expect(paragraphSm.size).toBeGreaterThan(caption.size);
    });

    it("should keep responsive line heights within readable ratios", () => {
      const responsiveTokens = [
        typographyTokens.hero,
        typographyTokens.h1,
        typographyTokens.h2,
        typographyTokens.h3,
        typographyTokens.h4,
        typographyTokens.h5,
        typographyTokens.h6,
        typographyTokens.paragraphLg,
        typographyTokens.paragraphMd,
        typographyTokens.paragraphSm,
        typographyTokens.caption,
        typographyTokens.heading1,
        typographyTokens.heading2,
        typographyTokens.heading3,
        typographyTokens.body,
        typographyTokens.bodySmall,
      ];

      responsiveTokens.forEach(({ size, lineHeight }) => {
        const ratio = lineHeight / size;
        expect(ratio).toBeGreaterThanOrEqual(1.1);
        expect(ratio).toBeLessThanOrEqual(1.6);
      });
    });

    it("should align base paragraph sizing with spacing tokens", () => {
      expect(spaceTokens.s16).toBe(typographyTokens.paragraphMd.size);
      expect(spaceTokens.s24).toBe(typographyTokens.paragraphMd.lineHeight);
      expect(spacingScale).toContain(typographyTokens.paragraphMd.size);
      expect(spacingScale).toContain(typographyTokens.paragraphMd.lineHeight);
    });
  });
});
