import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("theme token mapping", () => {
  test("maps full accent palette from alias tokens", () => {
    const themeCss = readFileSync(resolve(process.cwd(), "src/styles/theme.css"), "utf8");

    const expectedMappings = [
      "--accent-gray: var(--ds-accent-gray);",
      "--accent-red: var(--ds-accent-red);",
      "--accent-orange: var(--ds-accent-orange);",
      "--accent-yellow: var(--ds-accent-yellow);",
      "--accent-green: var(--ds-accent-green);",
      "--accent-blue: var(--ds-accent-blue);",
      "--accent-purple: var(--ds-accent-purple);",
      "--accent-pink: var(--ds-accent-pink);",
      "--color-accent-gray: var(--accent-gray);",
      "--color-accent-red: var(--accent-red);",
      "--color-accent-orange: var(--accent-orange);",
      "--color-accent-yellow: var(--accent-yellow);",
      "--color-accent-green: var(--accent-green);",
      "--color-accent-blue: var(--accent-blue);",
      "--color-accent-purple: var(--accent-purple);",
      "--color-accent-pink: var(--accent-pink);",
    ];

    for (const mapping of expectedMappings) {
      expect(themeCss).toContain(mapping);
    }
  });
});
