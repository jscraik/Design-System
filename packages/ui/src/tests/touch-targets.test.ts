import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

type TargetRule = {
  path: string;
  description: string;
  patterns: RegExp[];
};

const ROOT_DIR = resolve(process.cwd(), "..", "..");
const TARGET_RULES: TargetRule[] = [
  {
    path: join(ROOT_DIR, "packages/ui/src/components/ui/base/Button/fallback/Button.tsx"),
    description: "Buttons use control height tokens for 44px touch targets.",
    patterns: [/foundation-size-control-height/, /foundation-size-hit-target/],
  },
  {
    path: join(ROOT_DIR, "packages/ui/src/components/ui/base/IconButton/IconButton.tsx"),
    description: "Icon buttons declare the hit target token as a minimum size.",
    patterns: [/foundation-size-hit-target/],
  },
  {
    path: join(ROOT_DIR, "packages/ui/src/components/ui/base/Input/Input.tsx"),
    description: "Inputs use control height tokens for touch targets.",
    patterns: [/foundation-size-control-height/],
  },
  {
    path: join(ROOT_DIR, "packages/ui/src/components/ui/base/Select/fallback/Select.tsx"),
    description: "Select triggers use control height tokens for touch targets.",
    patterns: [/foundation-size-control-height/],
  },
  {
    path: join(ROOT_DIR, "packages/ui/src/components/ui/base/Textarea/Textarea.tsx"),
    description: "Textareas default to at least 44px height.",
    patterns: [/min-h-16/, /foundation-size-control-height/],
  },
];

describe("Touch target size (component policy)", () => {
  test("Interactive components declare 44px minimum sizes", () => {
    const violations: string[] = [];

    for (const rule of TARGET_RULES) {
      const content = readFileSync(rule.path, "utf8");
      const matches = rule.patterns.some((pattern) => pattern.test(content));
      if (!matches) {
        violations.push(`${rule.path}: ${rule.description}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
