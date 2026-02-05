import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { colorTokens } from "./colors.js";
import { radiusTokens } from "./radius.js";
import { shadowTokens } from "./shadows.js";
import { sizeTokens } from "./sizes.js";
import { spacingScale } from "./spacing.js";
import { typographyTokens } from "./typography.js";

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

const MANIFEST_GENERATED_AT = "1970-01-01T00:00:00.000Z";

/**
 * Generates platform-specific outputs from DTCG design tokens.
 */
export class TokenGenerator {
  private tokens: DesignTokens;

  constructor() {
    this.tokens = {
      colors: colorTokens,
      spacing: spacingScale,
      typography: typographyTokens,
      radius: radiusTokens,
      shadows: shadowTokens,
      sizes: sizeTokens,
    };
  }

  /**
   * Generate CSS custom properties from design tokens
   * This maintains compatibility with existing foundations.css
   */
  async generateCSS(): Promise<string> {
    const cssContent = `/*
  Apps SDK UI audit tokens (from Figma foundations).
  These are reference values for compliance checks and documentation.
  Do not use as styling defaults; prefer Apps SDK UI tokens/classes instead.
  Generated deterministically - same input produces identical output.
*/

:root {
  /* Dark backgrounds */
  --foundation-bg-dark-1: ${this.tokens.colors.background.dark.primary};
  --foundation-bg-dark-2: ${this.tokens.colors.background.dark.secondary};
  --foundation-bg-dark-3: ${this.tokens.colors.background.dark.tertiary};

  /* Dark text */
  --foundation-text-dark-primary: ${this.tokens.colors.text.dark.primary};
  --foundation-text-dark-secondary: ${this.tokens.colors.text.dark.secondary};
  --foundation-text-dark-tertiary: ${this.tokens.colors.text.dark.tertiary};

  /* Dark accents */
  --foundation-accent-gray: ${this.tokens.colors.accent.dark.gray};
  --foundation-accent-red: ${this.tokens.colors.accent.dark.red};
  --foundation-accent-orange: ${this.tokens.colors.accent.dark.orange};
  --foundation-accent-yellow: ${this.tokens.colors.accent.dark.yellow};
  --foundation-accent-green: ${this.tokens.colors.accent.dark.green};
  --foundation-accent-blue: ${this.tokens.colors.accent.dark.blue};
  --foundation-accent-purple: ${this.tokens.colors.accent.dark.purple};
  --foundation-accent-pink: ${this.tokens.colors.accent.dark.pink};

  /* Light backgrounds */
  --foundation-bg-light-1: ${this.tokens.colors.background.light.primary};
  --foundation-bg-light-2: ${this.tokens.colors.background.light.secondary};
  --foundation-bg-light-3: ${this.tokens.colors.background.light.tertiary};

  /* Light text */
  --foundation-text-light-primary: ${this.tokens.colors.text.light.primary};
  --foundation-text-light-secondary: ${this.tokens.colors.text.light.secondary};
  --foundation-text-light-tertiary: ${this.tokens.colors.text.light.tertiary};

  /* Light icon */
  --foundation-icon-light-primary: ${this.tokens.colors.icon.light.primary};
  --foundation-icon-light-secondary: ${this.tokens.colors.icon.light.secondary};
  --foundation-icon-light-tertiary: ${this.tokens.colors.icon.light.tertiary};
  --foundation-icon-light-inverted: ${this.tokens.colors.icon.light.inverted};
  --foundation-icon-light-accent: ${this.tokens.colors.icon.light.accent};
  --foundation-icon-light-status-error: ${this.tokens.colors.icon.light.statusError};
  --foundation-icon-light-status-warning: ${this.tokens.colors.icon.light.statusWarning};
  --foundation-icon-light-status-success: ${this.tokens.colors.icon.light.statusSuccess};

  /* Dark icon */
  --foundation-icon-dark-primary: ${this.tokens.colors.icon.dark.primary};
  --foundation-icon-dark-secondary: ${this.tokens.colors.icon.dark.secondary};
  --foundation-icon-dark-tertiary: ${this.tokens.colors.icon.dark.tertiary};
  --foundation-icon-dark-inverted: ${this.tokens.colors.icon.dark.inverted};
  --foundation-icon-dark-accent: ${this.tokens.colors.icon.dark.accent};
  --foundation-icon-dark-status-error: ${this.tokens.colors.icon.dark.statusError};
  --foundation-icon-dark-status-warning: ${this.tokens.colors.icon.dark.statusWarning};
  --foundation-icon-dark-status-success: ${this.tokens.colors.icon.dark.statusSuccess};

  /* Borders */
  --foundation-border-light: ${this.tokens.colors.border.light.light};
  --foundation-border-heavy: ${this.tokens.colors.border.light.heavy};
  --foundation-border-dark-default: ${this.tokens.colors.border.dark.default};
  --foundation-border-dark-light: ${this.tokens.colors.border.dark.light};

  /* Light accents */
  --foundation-accent-gray-light: ${this.tokens.colors.accent.light.gray};
  --foundation-accent-red-light: ${this.tokens.colors.accent.light.red};
  --foundation-accent-orange-light: ${this.tokens.colors.accent.light.orange};
  --foundation-accent-yellow-light: ${this.tokens.colors.accent.light.yellow};
  --foundation-accent-green-light: ${this.tokens.colors.accent.light.green};
  --foundation-accent-blue-light: ${this.tokens.colors.accent.light.blue};
  --foundation-accent-purple-light: ${this.tokens.colors.accent.light.purple};
  --foundation-accent-pink-light: ${this.tokens.colors.accent.light.pink};

  /* High contrast backgrounds */
  --foundation-bg-high-contrast-1: ${this.tokens.colors.background.highContrast.primary};
  --foundation-bg-high-contrast-2: ${this.tokens.colors.background.highContrast.secondary};
  --foundation-bg-high-contrast-3: ${this.tokens.colors.background.highContrast.tertiary};

  /* High contrast text */
  --foundation-text-high-contrast-primary: ${this.tokens.colors.text.highContrast.primary};
  --foundation-text-high-contrast-secondary: ${this.tokens.colors.text.highContrast.secondary};
  --foundation-text-high-contrast-tertiary: ${this.tokens.colors.text.highContrast.tertiary};
  --foundation-text-high-contrast-inverted: ${this.tokens.colors.text.highContrast.inverted};

  /* High contrast icon */
  --foundation-icon-high-contrast-primary: ${this.tokens.colors.icon.highContrast.primary};
  --foundation-icon-high-contrast-secondary: ${this.tokens.colors.icon.highContrast.secondary};
  --foundation-icon-high-contrast-tertiary: ${this.tokens.colors.icon.highContrast.tertiary};
  --foundation-icon-high-contrast-inverted: ${this.tokens.colors.icon.highContrast.inverted};
  --foundation-icon-high-contrast-accent: ${this.tokens.colors.icon.highContrast.accent};
  --foundation-icon-high-contrast-status-error: ${this.tokens.colors.icon.highContrast.statusError};
  --foundation-icon-high-contrast-status-warning: ${this.tokens.colors.icon.highContrast.statusWarning};
  --foundation-icon-high-contrast-status-success: ${this.tokens.colors.icon.highContrast.statusSuccess};

  /* High contrast borders */
  --foundation-border-high-contrast-light: ${this.tokens.colors.border.highContrast.light};
  --foundation-border-high-contrast-default: ${this.tokens.colors.border.highContrast.default};
  --foundation-border-high-contrast-heavy: ${this.tokens.colors.border.highContrast.heavy};

  /* High contrast accents */
  --foundation-accent-gray-high-contrast: ${this.tokens.colors.accent.highContrast.gray};
  --foundation-accent-red-high-contrast: ${this.tokens.colors.accent.highContrast.red};
  --foundation-accent-orange-high-contrast: ${this.tokens.colors.accent.highContrast.orange};
  --foundation-accent-yellow-high-contrast: ${this.tokens.colors.accent.highContrast.yellow};
  --foundation-accent-green-high-contrast: ${this.tokens.colors.accent.highContrast.green};
  --foundation-accent-blue-high-contrast: ${this.tokens.colors.accent.highContrast.blue};
  --foundation-accent-purple-high-contrast: ${this.tokens.colors.accent.highContrast.purple};
  --foundation-accent-pink-high-contrast: ${this.tokens.colors.accent.highContrast.pink};
  --foundation-accent-foreground-high-contrast: ${this.tokens.colors.accent.highContrast.foreground};

  /* High contrast interactive */
  --foundation-interactive-high-contrast-ring: ${this.tokens.colors.interactive.highContrast.ring};

  /* Spacing scale */
${this.generateCSSSpacing()}

  /* Typography */
  --foundation-font-family:
    "${this.tokens.typography.fontFamily}", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
${this.generateCSSTypography()}

  /* Radius scale */
  --foundation-radius-6: ${this.tokens.radius.r6}px;
  --foundation-radius-8: ${this.tokens.radius.r8}px;
  --foundation-radius-10: ${this.tokens.radius.r10}px;
  --foundation-radius-12: ${this.tokens.radius.r12}px;
  --foundation-radius-16: ${this.tokens.radius.r16}px;
  --foundation-radius-18: ${this.tokens.radius.r18}px;
  --foundation-radius-21: ${this.tokens.radius.r21}px;
  --foundation-radius-24: ${this.tokens.radius.r24}px;
  --foundation-radius-30: ${this.tokens.radius.r30}px;
  --foundation-radius-round: ${this.tokens.radius.round}px;

  /* Size scale */
  --foundation-size-control-height: ${this.tokens.sizes.controlHeight}px;
  --foundation-size-card-header-height: ${this.tokens.sizes.cardHeaderHeight}px;
  --foundation-size-hit-target: ${this.tokens.sizes.hitTarget}px;

  /* Shadows */
  --foundation-shadow-card: ${this.formatShadow(this.tokens.shadows.card)};
  --foundation-shadow-pip: ${this.formatShadow(this.tokens.shadows.pip)};
  --foundation-shadow-pill: ${this.formatShadow(this.tokens.shadows.pill)};
  --foundation-shadow-close: ${this.formatShadow(this.tokens.shadows.close)};

  /* Accessibility */
  --foundation-focus-ring: #0285ff;
  --foundation-focus-ring-width: 2px;
  --foundation-animation-duration: 0.25s;
  --foundation-animation-duration-reduced: 0.1s;
  
  /* High contrast variants */
  --foundation-high-contrast-text: var(--foundation-text-high-contrast-primary);
  --foundation-high-contrast-bg: var(--foundation-bg-high-contrast-1);
  --foundation-high-contrast-border: var(--foundation-border-high-contrast-heavy);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --foundation-text-dark-primary: var(--foundation-high-contrast-text);
    --foundation-text-light-primary: var(--foundation-high-contrast-bg);
    --foundation-bg-dark-1: var(--foundation-high-contrast-bg);
    --foundation-bg-light-1: var(--foundation-high-contrast-text);
    --foundation-focus-ring: var(--foundation-interactive-high-contrast-ring);
    --foundation-focus-ring-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --foundation-animation-duration: var(--foundation-animation-duration-reduced);
  }
  
  * {
    animation-duration: var(--foundation-animation-duration-reduced) !important;
    transition-duration: var(--foundation-animation-duration-reduced) !important;
  }
}

/* Focus ring utilities */
.foundation-focus-ring {
  outline: var(--foundation-focus-ring-width) solid var(--foundation-focus-ring);
  outline-offset: 2px;
}

.foundation-focus-ring:focus-visible {
  outline: var(--foundation-focus-ring-width) solid var(--foundation-focus-ring);
  outline-offset: 2px;
}

/* Accessibility utilities */
.foundation-high-contrast {
  color: var(--foundation-high-contrast-text);
  background-color: var(--foundation-high-contrast-bg);
  border: 1px solid var(--foundation-high-contrast-border);
}

.foundation-reduced-motion {
  animation: none !important;
  transition: none !important;
}
`;

    return cssContent;
  }

  /**
   * Generate manifest with SHA hashes and metadata
   */
  async generateManifest(cssContent: string): Promise<GenerationManifest> {
    const cssHash = createHash("sha256").update(cssContent).digest("hex");
    const schemaVersion = await this.readSchemaVersion();
    const appsSdkUiVersion = await this.readAppsSdkUiVersion();
    const tokenCount = this.countTokens();

    return {
      version: "1.0.0",
      schemaVersion,
      appsSdkUiVersion,
      tokenCount,
      sha256: {
        css: cssHash,
      },
      generated: MANIFEST_GENERATED_AT,
    };
  }

  private async readSchemaVersion(): Promise<string> {
    const schemaPath = new URL("../SCHEMA_VERSION", import.meta.url);
    try {
      const raw = await readFile(schemaPath, "utf8");
      return raw.trim() || "unknown";
    } catch {
      return "unknown";
    }
  }

  private async readAppsSdkUiVersion(): Promise<string> {
    const packagePath = new URL("../../ui/package.json", import.meta.url);
    try {
      const raw = await readFile(packagePath, "utf8");
      const parsed = JSON.parse(raw) as { dependencies?: Record<string, string> };
      return parsed.dependencies?.["@openai/apps-sdk-ui"] ?? "unknown";
    } catch {
      return "unknown";
    }
  }

  private countTokens(): GenerationManifest["tokenCount"] {
    const colorCategories = [
      "background",
      "text",
      "icon",
      "border",
      "accent",
      "interactive",
    ] as const;
    const colors = colorCategories.reduce((count, category) => {
      const keys = Object.keys(this.tokens.colors[category].light);
      return count + keys.length;
    }, 0);
    const spacing = this.tokens.spacing.length;
    const typography = Object.keys(this.tokens.typography).length;
    const radius = Object.keys(this.tokens.radius).length;
    const shadows = Object.keys(this.tokens.shadows).length;
    const sizes = Object.keys(this.tokens.sizes).length;
    const total = colors + spacing + typography + radius + shadows + sizes;

    return {
      total,
      colors,
      spacing,
      typography,
      radius,
      shadows,
      sizes,
    };
  }

  /**
   * Generate all outputs and write to appropriate directories
   */
  async generate(): Promise<void> {
    // Generate content
    const cssContent = await this.generateCSS();
    const manifest = await this.generateManifest(cssContent);

    // Determine output paths relative to packages/tokens
    const cssOutputPath = join(process.cwd(), "src/foundations.css");
    const manifestOutputPath = join(process.cwd(), "docs/outputs/manifest.json");

    await mkdir(dirname(cssOutputPath), { recursive: true });
    await mkdir(dirname(manifestOutputPath), { recursive: true });

    // Write files
    await writeFile(cssOutputPath, cssContent, "utf8");
    await writeFile(manifestOutputPath, JSON.stringify(manifest, null, 2), "utf8");

    console.log("✅ Token generation complete");
    console.log(`   CSS: ${cssOutputPath}`);
    console.log(`   Manifest: ${manifestOutputPath}`);
    console.log(`   CSS SHA: ${manifest.sha256.css.substring(0, 8)}...`);
  }

  private generateCSSSpacing(): string {
    const lines: string[] = [];

    this.tokens.spacing.forEach((value) => {
      lines.push(`  --foundation-space-${value}: ${value}px;`);
    });

    return lines.join("\n");
  }

  private generateCSSTypography(): string {
    const lines: string[] = [];

    Object.entries(this.tokens.typography).forEach(([key, value]) => {
      if (key === "fontFamily") return; // Already handled above

      // Type assertion: after skipping fontFamily, value is an object with typography properties
      const token = value as {
        size: number;
        lineHeight: number;
        weight: number;
        emphasisWeight?: number;
        paragraphSpacing?: number;
        tracking: number;
      };

      const cssKey = key
        .replace(/([A-Z])/g, "-$1")
        .replace(/(\d+)/g, "-$1")
        .toLowerCase();
      lines.push(`  --foundation-${cssKey}-size: ${token.size}px;`);
      lines.push(`  --foundation-${cssKey}-line: ${token.lineHeight}px;`);
      if (token.paragraphSpacing !== undefined) {
        lines.push(`  --foundation-${cssKey}-paragraph-spacing: ${token.paragraphSpacing}px;`);
      }
      lines.push(`  --foundation-${cssKey}-weight: ${token.weight};`);
      lines.push(`  --foundation-${cssKey}-weight-regular: ${token.weight};`);

      if ("emphasisWeight" in token && token.emphasisWeight !== undefined) {
        lines.push(`  --foundation-${cssKey}-weight-emphasis: ${token.emphasisWeight};`);
      }

      lines.push(`  --foundation-${cssKey}-tracking: ${token.tracking}px;`);
      lines.push("");
    });

    return lines.join("\n");
  }

  private formatShadow(
    shadow: ReadonlyArray<{
      color: string;
      offsetX: number;
      offsetY: number;
      blur: number;
      spread: number;
    }>,
  ): string {
    return shadow
      .map(
        (layer) =>
          `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`,
      )
      .join(", ");
  }
}
