import fc from "fast-check";
import { describe, expect, test } from "vitest";

import { TokenGenerator } from "../src/generator.js";
import { spacingScale } from "../src/spacing.js";

/**
 * Property 1: Token Generation Consistency
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 *
 * For any design token update, CSS custom properties
 * should be generated with identical values and the build should validate
 * consistency across outputs
 */

describe("Token Generation Properties", () => {
  test("Property 1: Token Generation Consistency", () => {
    fc.assert(
      fc.asyncProperty(
        // Generate arbitrary color tokens that match our structure
        fc.record({
          colors: fc.record({
            background: fc.record({
              light: fc.record({
                primary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                secondary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                tertiary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
              dark: fc.record({
                primary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                secondary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                tertiary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
            }),
            text: fc.record({
              light: fc.record({
                primary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                secondary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                tertiary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                inverted: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
              dark: fc.record({
                primary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                secondary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                tertiary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                inverted: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
            }),
            icon: fc.record({
              light: fc.record({
                primary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                secondary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                tertiary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                inverted: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
              dark: fc.record({
                primary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                secondary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                tertiary: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                inverted: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
            }),
            border: fc.record({
              light: fc.record({
                light: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                default: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                heavy: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
              dark: fc.record({
                light: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                default: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                heavy: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
            }),
            accent: fc.record({
              light: fc.record({
                gray: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                blue: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                red: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                orange: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                yellow: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                green: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                purple: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                pink: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                foreground: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
              dark: fc.record({
                gray: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                blue: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                red: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                orange: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                yellow: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                green: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                purple: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                pink: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
                foreground: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
            }),
            interactive: fc.record({
              light: fc.record({
                ring: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
              dark: fc.record({
                ring: fc
                  .hexaString({ minLength: 6, maxLength: 6 })
                  .map((h) => `#${h.toUpperCase()}`),
              }),
            }),
          }),
          spacing: fc.array(fc.integer({ min: 0, max: 256 }), { minLength: 12, maxLength: 12 }),
          typography: fc.record({
            fontFamily: fc.constantFrom("SF Pro", "Helvetica", "Arial", "Inter"),
            heading1: fc.record({
              size: fc.integer({ min: 24, max: 48 }),
              lineHeight: fc.integer({ min: 28, max: 56 }),
              weight: fc.constantFrom(400, 500, 600, 700),
              tracking: fc.float({ min: -1, max: 1 }),
            }),
            heading2: fc.record({
              size: fc.integer({ min: 18, max: 32 }),
              lineHeight: fc.integer({ min: 22, max: 40 }),
              weight: fc.constantFrom(400, 500, 600, 700),
              tracking: fc.float({ min: -1, max: 1 }),
            }),
            heading3: fc.record({
              size: fc.integer({ min: 14, max: 24 }),
              lineHeight: fc.integer({ min: 18, max: 32 }),
              weight: fc.constantFrom(400, 500, 600, 700),
              tracking: fc.float({ min: -1, max: 1 }),
            }),
            body: fc.record({
              size: fc.integer({ min: 12, max: 20 }),
              lineHeight: fc.integer({ min: 16, max: 28 }),
              weight: fc.constantFrom(400, 500, 600),
              emphasisWeight: fc.constantFrom(500, 600, 700),
              tracking: fc.float({ min: -1, max: 1 }),
            }),
            bodySmall: fc.record({
              size: fc.integer({ min: 10, max: 16 }),
              lineHeight: fc.integer({ min: 14, max: 22 }),
              weight: fc.constantFrom(400, 500, 600),
              emphasisWeight: fc.constantFrom(500, 600, 700),
              tracking: fc.float({ min: -1, max: 1 }),
            }),
            caption: fc.record({
              size: fc.integer({ min: 8, max: 14 }),
              lineHeight: fc.integer({ min: 12, max: 18 }),
              weight: fc.constantFrom(400, 500, 600),
              emphasisWeight: fc.constantFrom(500, 600, 700),
              tracking: fc.float({ min: -1, max: 1 }),
            }),
          }),
          radius: fc.record({
            r6: fc.integer({ min: 2, max: 12 }),
            r8: fc.integer({ min: 4, max: 16 }),
            r10: fc.integer({ min: 6, max: 20 }),
            r12: fc.integer({ min: 8, max: 24 }),
            r16: fc.integer({ min: 12, max: 32 }),
            r18: fc.integer({ min: 14, max: 36 }),
            r21: fc.integer({ min: 16, max: 42 }),
            r24: fc.integer({ min: 18, max: 48 }),
            r30: fc.integer({ min: 20, max: 60 }),
            round: fc.constant(999),
          }),
          sizes: fc.record({
            controlHeight: fc.integer({ min: 32, max: 64 }),
            cardHeaderHeight: fc.integer({ min: 40, max: 80 }),
            hitTarget: fc.integer({ min: 32, max: 64 }),
          }),
          shadows: fc.record({
            card: fc.array(
              fc.record({
                color: fc
                  .hexaString({ minLength: 6, maxLength: 8 })
                  .map((h) => `#${h.toUpperCase()}`),
                offsetX: fc.integer({ min: -10, max: 10 }),
                offsetY: fc.integer({ min: -10, max: 10 }),
                blur: fc.integer({ min: 0, max: 40 }),
                spread: fc.integer({ min: -10, max: 10 }),
              }),
              { minLength: 1, maxLength: 3 },
            ),
            pip: fc.array(
              fc.record({
                color: fc
                  .hexaString({ minLength: 6, maxLength: 8 })
                  .map((h) => `#${h.toUpperCase()}`),
                offsetX: fc.integer({ min: -10, max: 10 }),
                offsetY: fc.integer({ min: -10, max: 10 }),
                blur: fc.integer({ min: 0, max: 40 }),
                spread: fc.integer({ min: -10, max: 10 }),
              }),
              { minLength: 1, maxLength: 3 },
            ),
            pill: fc.array(
              fc.record({
                color: fc
                  .hexaString({ minLength: 6, maxLength: 8 })
                  .map((h) => `#${h.toUpperCase()}`),
                offsetX: fc.integer({ min: -10, max: 10 }),
                offsetY: fc.integer({ min: -10, max: 10 }),
                blur: fc.integer({ min: 0, max: 40 }),
                spread: fc.integer({ min: -10, max: 10 }),
              }),
              { minLength: 1, maxLength: 3 },
            ),
            close: fc.array(
              fc.record({
                color: fc
                  .hexaString({ minLength: 6, maxLength: 8 })
                  .map((h) => `#${h.toUpperCase()}`),
                offsetX: fc.integer({ min: -10, max: 10 }),
                offsetY: fc.integer({ min: -10, max: 10 }),
                blur: fc.integer({ min: 0, max: 40 }),
                spread: fc.integer({ min: -10, max: 10 }),
              }),
              { minLength: 1, maxLength: 3 },
            ),
          }),
        }),
        async (generatedTokens) => {
          // Create a generator with the generated tokens
          const generator = new TestTokenGenerator(generatedTokens);

          // Generate output
          const cssOutput = await generator.generateCSS();

          // Test 1: CSS output should contain all color values
          expect(cssOutput).toContain(
            `--foundation-bg-dark-1: ${generatedTokens.colors.background.dark.primary};`,
          );
          expect(cssOutput).toContain(
            `--foundation-bg-light-1: ${generatedTokens.colors.background.light.primary};`,
          );
          expect(cssOutput).toContain(
            `--foundation-text-dark-primary: ${generatedTokens.colors.text.dark.primary};`,
          );
          expect(cssOutput).toContain(
            `--foundation-text-light-primary: ${generatedTokens.colors.text.light.primary};`,
          );

          // Test 2: Typography values should match
          expect(cssOutput).toContain(`"${generatedTokens.typography.fontFamily}"`);

          expect(cssOutput).toContain(
            `--foundation-heading-1-size: ${generatedTokens.typography.heading1.size}px;`,
          );

          // Test 3: Spacing values should match
          generatedTokens.spacing.forEach((value) => {
            expect(cssOutput).toContain(`--foundation-space-${value}: ${value}px;`);
          });

          // Test 4: Accessibility features should be present
          expect(cssOutput).toContain("--foundation-focus-ring");
          expect(cssOutput).toContain("@media (prefers-contrast: high)");
          expect(cssOutput).toContain("@media (prefers-reduced-motion: reduce)");

          // Test 5: Output should be deterministic (same input = same output)
          const cssOutput2 = await generator.generateCSS();

          expect(cssOutput).toBe(cssOutput2);

          // Test 6: Manifest generation should work
          const manifest = await generator.generateManifest(cssOutput);
          expect(manifest.version).toBe("1.0.0");
          expect(manifest.sha256.css).toHaveLength(64);
          expect(manifest.generated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // ISO string
        },
      ),
      {
        numRuns: 100,
        timeout: 30000, // 30 seconds timeout for async operations
      },
    );
  });

  test("Token Generation with Real Data", async () => {
    // Test with actual token data to ensure it works with real values
    const generator = new TokenGenerator();

    const cssOutput = await generator.generateCSS();
    const manifest = await generator.generateManifest(cssOutput);

    expect(cssOutput).toContain("--foundation-bg-light-1: #FFFFFF;");
    expect(cssOutput).toContain("--foundation-bg-dark-1: #1A1A1A;");
    expect(cssOutput).toContain('"SF Pro"');

    // Verify spacing scale
    spacingScale.forEach((value) => {
      expect(cssOutput).toContain(`--foundation-space-${value}: ${value}px;`);
    });

    // Verify manifest structure
    expect(manifest.version).toBe("1.0.0");
    expect(manifest.sha256.css).toHaveLength(64);
    expect(new Date(manifest.generated)).toBeInstanceOf(Date);
  });

  test("Manifest includes schema and upstream metadata", async () => {
    const generator = new TokenGenerator();
    const cssOutput = await generator.generateCSS();
    const manifest = await generator.generateManifest(cssOutput);

    expect(manifest.schemaVersion).toBeTruthy();
    expect(manifest.appsSdkUiVersion).toBeTruthy();
    expect(manifest.tokenCount.total).toBeGreaterThan(0);
  });

  test("Deterministic Output", async () => {
    // Test that the same input always produces the same output
    const generator = new TokenGenerator();

    const css1 = await generator.generateCSS();

    // Wait a bit to ensure timestamp differences don't affect determinism
    await new Promise((resolve) => setTimeout(resolve, 10));

    const css2 = await generator.generateCSS();

    // Outputs should be identical (deterministic)
    expect(css1).toBe(css2);

    // Manifests should have different timestamps but same content hashes
    const manifest1 = await generator.generateManifest(css1);
    const manifest2 = await generator.generateManifest(css2);

    expect(manifest1.sha256.css).toBe(manifest2.sha256.css);
  });
});

// Test helper class that extends TokenGenerator to accept custom tokens
class TestTokenGenerator extends TokenGenerator {
  constructor(customTokens: Record<string, unknown>) {
    super();
    // Override the tokens property
    (this as { tokens: Record<string, unknown> }).tokens = customTokens;
  }
}
