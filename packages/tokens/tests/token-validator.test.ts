import { describe, expect, test } from "vitest";

import { tokenAliasMap } from "../src/alias-map.js";
import {
  NON_COLOR_ALIAS_VALUE_ALLOWLIST,
  validateTokens,
} from "../src/validation/token-validator.js";

/**
 * Property 2-4: Alias map validity, mode completeness, and contrast thresholds.
 */

describe("Token Validator Properties", () => {
  test("Token alias map resolves and contrast checks pass", async () => {
    const result = await validateTokens();
    expect(result.errors).toEqual([]);
  });

  test("Non-color aliases use brand paths or allowlisted computed values", () => {
    const categories = ["space", "radius", "size", "shadow", "type"] as const;

    for (const category of categories) {
      for (const [tokenName, alias] of Object.entries(tokenAliasMap[category])) {
        if ("value" in alias) {
          expect(NON_COLOR_ALIAS_VALUE_ALLOWLIST[category].has(alias.value)).toBe(true);
          continue;
        }

        const expectedPrefix = `${category}.`;
        expect(alias.path).toBeDefined();
        expect(alias.path?.startsWith(expectedPrefix)).toBe(true);
        expect(alias.path).toContain(tokenName);
      }
    }
  });
});
