import { describe, expect, it } from "vitest";

import {
  flipForRTL,
  getDirection,
  getLogicalProperty,
  getRTLUtils,
  getStartEnd,
  getTextAlign,
  isRTL,
  RTL_LANGUAGES,
} from "./rtl";

describe("RTL Utilities", () => {
  describe("isRTL", () => {
    it("returns true for RTL languages", () => {
      expect(isRTL("ar")).toBe(true);
      expect(isRTL("he")).toBe(true);
      expect(isRTL("fa")).toBe(true);
      expect(isRTL("ur")).toBe(true);
    });

    it("returns false for LTR languages", () => {
      expect(isRTL("en")).toBe(false);
      expect(isRTL("es")).toBe(false);
      expect(isRTL("fr")).toBe(false);
      expect(isRTL("de")).toBe(false);
    });

    it("handles locale with region code", () => {
      expect(isRTL("ar-SA")).toBe(true);
      expect(isRTL("he-IL")).toBe(true);
      expect(isRTL("en-US")).toBe(false);
      expect(isRTL("en-GB")).toBe(false);
    });

    it("handles case insensitivity", () => {
      expect(isRTL("AR")).toBe(true);
      expect(isRTL("He")).toBe(true);
      expect(isRTL("EN")).toBe(false);
    });
  });

  describe("getDirection", () => {
    it("returns rtl for RTL languages", () => {
      expect(getDirection("ar")).toBe("rtl");
      expect(getDirection("he")).toBe("rtl");
    });

    it("returns ltr for LTR languages", () => {
      expect(getDirection("en")).toBe("ltr");
      expect(getDirection("es")).toBe("ltr");
    });
  });

  describe("getLogicalProperty", () => {
    it("converts left to inline-start for LTR", () => {
      expect(getLogicalProperty("left", "ltr")).toBe("inset-inline-start");
    });

    it("converts left to inline-end for RTL", () => {
      expect(getLogicalProperty("left", "rtl")).toBe("inset-inline-end");
    });

    it("converts right to inline-end for LTR", () => {
      expect(getLogicalProperty("right", "ltr")).toBe("inset-inline-end");
    });

    it("converts right to inline-start for RTL", () => {
      expect(getLogicalProperty("right", "rtl")).toBe("inset-inline-start");
    });

    it("converts margin-left correctly", () => {
      expect(getLogicalProperty("margin-left", "ltr")).toBe("margin-inline-start");
      expect(getLogicalProperty("margin-left", "rtl")).toBe("margin-inline-end");
    });

    it("converts padding-right correctly", () => {
      expect(getLogicalProperty("padding-right", "ltr")).toBe("padding-inline-end");
      expect(getLogicalProperty("padding-right", "rtl")).toBe("padding-inline-start");
    });
  });

  describe("flipForRTL", () => {
    it("returns LTR value when not RTL", () => {
      expect(flipForRTL("left", "right", false)).toBe("left");
      expect(flipForRTL(10, -10, false)).toBe(10);
    });

    it("returns RTL value when RTL", () => {
      expect(flipForRTL("left", "right", true)).toBe("right");
      expect(flipForRTL(10, -10, true)).toBe(-10);
    });
  });

  describe("getTextAlign", () => {
    it("returns left for LTR", () => {
      expect(getTextAlign("ltr")).toBe("left");
    });

    it("returns right for RTL", () => {
      expect(getTextAlign("rtl")).toBe("right");
    });
  });

  describe("getStartEnd", () => {
    it("returns correct values for LTR", () => {
      const result = getStartEnd("ltr");
      expect(result.start).toBe("left");
      expect(result.end).toBe("right");
    });

    it("returns correct values for RTL", () => {
      const result = getStartEnd("rtl");
      expect(result.start).toBe("right");
      expect(result.end).toBe("left");
    });
  });

  describe("getRTLUtils", () => {
    it("returns correct utilities for LTR locale", () => {
      const utils = getRTLUtils("en-US");
      expect(utils.isRTL).toBe(false);
      expect(utils.direction).toBe("ltr");
      expect(utils.textAlign).toBe("left");
      expect(utils.start).toBe("left");
      expect(utils.end).toBe("right");
    });

    it("returns correct utilities for RTL locale", () => {
      const utils = getRTLUtils("ar-SA");
      expect(utils.isRTL).toBe(true);
      expect(utils.direction).toBe("rtl");
      expect(utils.textAlign).toBe("right");
      expect(utils.start).toBe("right");
      expect(utils.end).toBe("left");
    });

    it("flip function works correctly", () => {
      const ltrUtils = getRTLUtils("en");
      const rtlUtils = getRTLUtils("ar");

      expect(ltrUtils.flip("←", "→")).toBe("←");
      expect(rtlUtils.flip("←", "→")).toBe("→");
    });
  });

  describe("RTL_LANGUAGES", () => {
    it("contains expected RTL languages", () => {
      expect(RTL_LANGUAGES).toContain("ar");
      expect(RTL_LANGUAGES).toContain("he");
      expect(RTL_LANGUAGES).toContain("fa");
      expect(RTL_LANGUAGES).toContain("ur");
    });

    it("does not contain LTR languages", () => {
      expect(RTL_LANGUAGES).not.toContain("en");
      expect(RTL_LANGUAGES).not.toContain("es");
      expect(RTL_LANGUAGES).not.toContain("fr");
    });
  });
});
