import { colorTokens } from "./colors.js";
import { spacingScale } from "./spacing.js";
import { typographyTokens } from "./typography.js";
import { radiusTokens } from "./radius.js";
import { shadowTokens } from "./shadows.js";
import { sizeTokens } from "./sizes.js";
/**
 * Design token payload used for generating platform outputs.
 */
export interface DesignTokens {
    colors: typeof colorTokens;
    spacing: typeof spacingScale;
    typography: typeof typographyTokens;
    radius: typeof radiusTokens;
    shadows: typeof shadowTokens;
    sizes: typeof sizeTokens;
}
/**
 * Manifest describing generated outputs and their hashes.
 */
export interface GenerationManifest {
    version: string;
    schemaVersion: string;
    appsSdkUiVersion: string;
    tokenCount: {
        total: number;
        colors: number;
        spacing: number;
        typography: number;
        radius: number;
        shadows: number;
        sizes: number;
    };
    sha256: {
        css: string;
    };
    generated: string;
}
/**
 * Generates platform-specific outputs from DTCG design tokens.
 */
export declare class TokenGenerator {
    private tokens;
    constructor();
    /**
     * Generate CSS custom properties from design tokens
     * This maintains compatibility with existing foundations.css
     */
    generateCSS(): Promise<string>;
    /**
     * Generate manifest with SHA hashes and metadata
     */
    generateManifest(cssContent: string): Promise<GenerationManifest>;
    private readSchemaVersion;
    private readAppsSdkUiVersion;
    private countTokens;
    /**
     * Generate all outputs and write to appropriate directories
     */
    generate(): Promise<void>;
    private generateCSSSpacing;
    private generateCSSTypography;
    private formatShadow;
}
//# sourceMappingURL=generator.d.ts.map