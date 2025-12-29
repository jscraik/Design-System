import fc from 'fast-check';
import { describe, expect, test } from 'vitest';

import { TokenGenerator } from '../src/generator.js';
import { spacingScale } from '../src/spacing.js';

/**
 * Property 1: Token Generation Consistency
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 * 
 * For any design token update, both CSS custom properties and Swift constants 
 * should be generated with identical values and the build should validate 
 * consistency across all platforms
 */

describe('Token Generation Properties', () => {
    test('Property 1: Token Generation Consistency', () => {
        fc.assert(fc.asyncProperty(
            // Generate arbitrary color tokens that match our structure
            fc.record({
                colors: fc.record({
                    background: fc.record({
                        light: fc.record({
                            primary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            secondary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            tertiary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`)
                        }),
                        dark: fc.record({
                            primary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            secondary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            tertiary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`)
                        })
                    }),
                    text: fc.record({
                        light: fc.record({
                            primary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            secondary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            tertiary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            inverted: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`)
                        }),
                        dark: fc.record({
                            primary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            secondary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            tertiary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            inverted: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`)
                        })
                    }),
                    icon: fc.record({
                        light: fc.record({
                            primary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            secondary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            tertiary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            inverted: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`)
                        }),
                        dark: fc.record({
                            primary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            secondary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            tertiary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            inverted: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`)
                        })
                    }),
                    accent: fc.record({
                        light: fc.record({
                            blue: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            red: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            orange: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            green: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            purple: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`)
                        }),
                        dark: fc.record({
                            blue: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            red: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            orange: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            green: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`),
                            purple: fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h.toUpperCase()}`)
                        })
                    })
                }),
                spacing: fc.array(fc.integer({ min: 0, max: 256 }), { minLength: 12, maxLength: 12 }),
                typography: fc.record({
                    fontFamily: fc.constantFrom("SF Pro", "Helvetica", "Arial", "Inter"),
                    heading1: fc.record({
                        size: fc.integer({ min: 24, max: 48 }),
                        lineHeight: fc.integer({ min: 28, max: 56 }),
                        weight: fc.constantFrom(400, 500, 600, 700),
                        tracking: fc.float({ min: -1, max: 1 })
                    }),
                    heading2: fc.record({
                        size: fc.integer({ min: 18, max: 32 }),
                        lineHeight: fc.integer({ min: 22, max: 40 }),
                        weight: fc.constantFrom(400, 500, 600, 700),
                        tracking: fc.float({ min: -1, max: 1 })
                    }),
                    heading3: fc.record({
                        size: fc.integer({ min: 14, max: 24 }),
                        lineHeight: fc.integer({ min: 18, max: 32 }),
                        weight: fc.constantFrom(400, 500, 600, 700),
                        tracking: fc.float({ min: -1, max: 1 })
                    }),
                    body: fc.record({
                        size: fc.integer({ min: 12, max: 20 }),
                        lineHeight: fc.integer({ min: 16, max: 28 }),
                        weight: fc.constantFrom(400, 500, 600),
                        emphasisWeight: fc.constantFrom(500, 600, 700),
                        tracking: fc.float({ min: -1, max: 1 })
                    }),
                    bodySmall: fc.record({
                        size: fc.integer({ min: 10, max: 16 }),
                        lineHeight: fc.integer({ min: 14, max: 22 }),
                        weight: fc.constantFrom(400, 500, 600),
                        emphasisWeight: fc.constantFrom(500, 600, 700),
                        tracking: fc.float({ min: -1, max: 1 })
                    }),
                    caption: fc.record({
                        size: fc.integer({ min: 8, max: 14 }),
                        lineHeight: fc.integer({ min: 12, max: 18 }),
                        weight: fc.constantFrom(400, 500, 600),
                        emphasisWeight: fc.constantFrom(500, 600, 700),
                        tracking: fc.float({ min: -1, max: 1 })
                    })
                })
            }),
            async (generatedTokens) => {
                // Create a generator with the generated tokens
                const generator = new TestTokenGenerator(generatedTokens);

                // Generate both outputs
                const swiftOutput = await generator.generateSwift();
                const cssOutput = await generator.generateCSS();

                // Test 1: Swift output should contain all color values
                Object.entries(generatedTokens.colors.background.light).forEach(([name, value]) => {
                    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
                    expect(swiftOutput).toContain(`public static let light${capitalizedName} = Color(hex: "${value}")`);
                });

                Object.entries(generatedTokens.colors.background.dark).forEach(([name, value]) => {
                    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
                    expect(swiftOutput).toContain(`public static let dark${capitalizedName} = Color(hex: "${value}")`);
                });

                // Test 2: CSS output should contain all color values
                expect(cssOutput).toContain(`--foundation-bg-dark-1: ${generatedTokens.colors.background.dark.primary};`);
                expect(cssOutput).toContain(`--foundation-bg-light-1: ${generatedTokens.colors.background.light.primary};`);
                expect(cssOutput).toContain(`--foundation-text-dark-primary: ${generatedTokens.colors.text.dark.primary};`);
                expect(cssOutput).toContain(`--foundation-text-light-primary: ${generatedTokens.colors.text.light.primary};`);

                // Test 3: Typography values should match
                expect(swiftOutput).toContain(`public static let fontFamily = "${generatedTokens.typography.fontFamily}"`);
                expect(cssOutput).toContain(`"${generatedTokens.typography.fontFamily}"`);

                expect(swiftOutput).toContain(`public static let size: CGFloat = ${generatedTokens.typography.heading1.size}`);
                expect(cssOutput).toContain(`--foundation-heading1-size: ${generatedTokens.typography.heading1.size}px;`);

                // Test 4: Spacing values should match
                generatedTokens.spacing.forEach((value) => {
                    expect(swiftOutput).toContain(`${value}`);
                    expect(cssOutput).toContain(`--foundation-space-${value}: ${value}px;`);
                });

                // Test 5: Accessibility features should be present
                expect(swiftOutput).toContain('public enum Accessibility');
                expect(swiftOutput).toContain('focusRing');
                expect(swiftOutput).toContain('HighContrast');
                expect(swiftOutput).toContain('Animation');

                expect(cssOutput).toContain('--foundation-focus-ring');
                expect(cssOutput).toContain('@media (prefers-contrast: high)');
                expect(cssOutput).toContain('@media (prefers-reduced-motion: reduce)');

                // Test 6: Output should be deterministic (same input = same output)
                const swiftOutput2 = await generator.generateSwift();
                const cssOutput2 = await generator.generateCSS();

                expect(swiftOutput).toBe(swiftOutput2);
                expect(cssOutput).toBe(cssOutput2);

                // Test 7: Manifest generation should work
                const assetCatalogOutput = await generator.generateAssetCatalog();
                const manifest = await generator.generateManifest(swiftOutput, cssOutput, assetCatalogOutput);
                expect(manifest.version).toBe("1.0.0");
                expect(manifest.sha256.swift).toHaveLength(64); // SHA256 hex length
                expect(manifest.sha256.css).toHaveLength(64);
                expect(manifest.sha256.assetCatalog).toHaveLength(64); // Asset Catalog hash
                expect(manifest.generated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // ISO string

            }
        ), {
            numRuns: 100,
            timeout: 30000 // 30 seconds timeout for async operations
        });
    });

    test('Token Generation with Real Data', async () => {
        // Test with actual token data to ensure it works with real values
        const generator = new TokenGenerator();

        const swiftOutput = await generator.generateSwift();
        const cssOutput = await generator.generateCSS();
        const assetCatalogOutput = await generator.generateAssetCatalog();
        const manifest = await generator.generateManifest(swiftOutput, cssOutput, assetCatalogOutput);

        // Verify real token values are present
        expect(swiftOutput).toContain('Color(hex: "#FFFFFF")'); // background.light.primary
        expect(swiftOutput).toContain('Color(hex: "#212121")'); // background.dark.primary
        expect(swiftOutput).toContain('public static let fontFamily = "SF Pro"');

        expect(cssOutput).toContain('--foundation-bg-light-1: #FFFFFF;');
        expect(cssOutput).toContain('--foundation-bg-dark-1: #212121;');
        expect(cssOutput).toContain('"SF Pro"');

        // Verify spacing scale
        spacingScale.forEach(value => {
            expect(swiftOutput).toContain(`${value}`);
            expect(cssOutput).toContain(`--foundation-space-${value}: ${value}px;`);
        });

        // Verify manifest structure
        expect(manifest.version).toBe("1.0.0");
        expect(manifest.sha256.swift).toHaveLength(64);
        expect(manifest.sha256.css).toHaveLength(64);
        expect(manifest.sha256.assetCatalog).toHaveLength(64);
        expect(new Date(manifest.generated)).toBeInstanceOf(Date);
    });

    test('Deterministic Output', async () => {
        // Test that the same input always produces the same output
        const generator = new TokenGenerator();

        const swift1 = await generator.generateSwift();
        const css1 = await generator.generateCSS();
        const assetCatalog1 = await generator.generateAssetCatalog();

        // Wait a bit to ensure timestamp differences don't affect determinism
        await new Promise(resolve => setTimeout(resolve, 10));

        const swift2 = await generator.generateSwift();
        const css2 = await generator.generateCSS();
        const assetCatalog2 = await generator.generateAssetCatalog();

        // Outputs should be identical (deterministic)
        expect(swift1).toBe(swift2);
        expect(css1).toBe(css2);
        expect(assetCatalog1).toBe(assetCatalog2);

        // Manifests should have different timestamps but same content hashes
        const manifest1 = await generator.generateManifest(swift1, css1, assetCatalog1);
        const manifest2 = await generator.generateManifest(swift2, css2, assetCatalog2);

        expect(manifest1.sha256.swift).toBe(manifest2.sha256.swift);
        expect(manifest1.sha256.css).toBe(manifest2.sha256.css);
        expect(manifest1.sha256.assetCatalog).toBe(manifest2.sha256.assetCatalog);
    });
});

// Test helper class that extends TokenGenerator to accept custom tokens
class TestTokenGenerator extends TokenGenerator {
    constructor(private customTokens: Record<string, unknown>) {
        super();
        // Override the tokens property
        (this as { tokens: Record<string, unknown> }).tokens = customTokens;
    }
}
