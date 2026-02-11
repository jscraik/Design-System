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
    const backgroundHighContrast =
      (this.tokens.colors.background as Record<
        string,
        { primary: string; secondary: string; tertiary: string }
      >).highContrast ?? this.tokens.colors.background.dark;
    const textHighContrast =
      (this.tokens.colors.text as Record<
        string,
        { primary: string; secondary: string; tertiary: string; inverted: string }
      >).highContrast ?? this.tokens.colors.text.dark;
    const iconHighContrast =
      (this.tokens.colors.icon as Record<
        string,
        {
          primary: string;
          secondary: string;
          tertiary: string;
          inverted: string;
          accent: string;
          statusError: string;
          statusWarning: string;
          statusSuccess: string;
        }
      >).highContrast ?? this.tokens.colors.icon.dark;
    const borderHighContrast =
      (this.tokens.colors.border as Record<
        string,
        { light: string; default: string; heavy: string }
      >).highContrast ?? {
        light: this.tokens.colors.border.dark.light,
        default: this.tokens.colors.border.dark.default,
        heavy: this.tokens.colors.border.dark.heavy,
      };
    const accentHighContrast =
      (this.tokens.colors.accent as Record<
        string,
        {
          gray: string;
          red: string;
          orange: string;
          yellow: string;
          green: string;
          blue: string;
          purple: string;
          pink: string;
          foreground: string;
        }
      >).highContrast ?? this.tokens.colors.accent.dark;
    const interactiveHighContrast =
      (this.tokens.colors.interactive as Record<string, { ring: string }>).highContrast ??
      this.tokens.colors.interactive.dark;

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
  --foundation-bg-high-contrast-1: ${backgroundHighContrast.primary};
  --foundation-bg-high-contrast-2: ${backgroundHighContrast.secondary};
  --foundation-bg-high-contrast-3: ${backgroundHighContrast.tertiary};

  /* High contrast text */
  --foundation-text-high-contrast-primary: ${textHighContrast.primary};
  --foundation-text-high-contrast-secondary: ${textHighContrast.secondary};
  --foundation-text-high-contrast-tertiary: ${textHighContrast.tertiary};
  --foundation-text-high-contrast-inverted: ${textHighContrast.inverted};

  /* High contrast icon */
  --foundation-icon-high-contrast-primary: ${iconHighContrast.primary};
  --foundation-icon-high-contrast-secondary: ${iconHighContrast.secondary};
  --foundation-icon-high-contrast-tertiary: ${iconHighContrast.tertiary};
  --foundation-icon-high-contrast-inverted: ${iconHighContrast.inverted};
  --foundation-icon-high-contrast-accent: ${iconHighContrast.accent};
  --foundation-icon-high-contrast-status-error: ${iconHighContrast.statusError};
  --foundation-icon-high-contrast-status-warning: ${iconHighContrast.statusWarning};
  --foundation-icon-high-contrast-status-success: ${iconHighContrast.statusSuccess};

  /* High contrast borders */
  --foundation-border-high-contrast-light: ${borderHighContrast.light};
  --foundation-border-high-contrast-default: ${borderHighContrast.default};
  --foundation-border-high-contrast-heavy: ${borderHighContrast.heavy};

  /* High contrast accents */
  --foundation-accent-gray-high-contrast: ${accentHighContrast.gray};
  --foundation-accent-red-high-contrast: ${accentHighContrast.red};
  --foundation-accent-orange-high-contrast: ${accentHighContrast.orange};
  --foundation-accent-yellow-high-contrast: ${accentHighContrast.yellow};
  --foundation-accent-green-high-contrast: ${accentHighContrast.green};
  --foundation-accent-blue-high-contrast: ${accentHighContrast.blue};
  --foundation-accent-purple-high-contrast: ${accentHighContrast.purple};
  --foundation-accent-pink-high-contrast: ${accentHighContrast.pink};
  --foundation-accent-foreground-high-contrast: ${accentHighContrast.foreground};

  /* High contrast interactive */
  --foundation-interactive-high-contrast-ring: ${interactiveHighContrast.ring};

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
`;

    return cssContent;
  }

  /**
   * Generate semantic alias variables (theme-aware) derived from foundation tokens.
   *
   * This is the "Alias" layer in the Brand → Alias → Mapped flow:
   * - Brand: `--foundation-*` variables (audit/source values)
   * - Alias: `--ds-*` variables (semantic names that vary by theme + high contrast)
   * - Mapped: app/UI runtime slots (e.g. `--background`) live in `@design-studio/ui`
   */
  async generateAliasesCSS(): Promise<string> {
    return `/*
  Design system alias variables.

  Purpose:
  - Provide stable semantic variables for consumption by the UI theme layer.
  - Keep theme switching in CSS (via [data-theme] + prefers-contrast).
  - Avoid referencing --foundation-* directly in app/component code.
*/

:root,
:where([data-theme="light"]) {
  /* Backgrounds */
  --ds-bg-primary: var(--foundation-bg-light-1);
  --ds-bg-secondary: var(--foundation-bg-light-2);
  --ds-bg-muted: var(--foundation-bg-light-3);
  --ds-bg-card: var(--foundation-bg-light-1);
  --ds-bg-popover: var(--foundation-bg-light-1);

  /* Text */
  --ds-fg: var(--foundation-text-light-primary);
  --ds-fg-secondary: var(--foundation-text-light-secondary);
  --ds-fg-muted: var(--foundation-text-light-tertiary);
  --ds-fg-inverted: var(--foundation-text-dark-primary);

  /* Icons */
  --ds-icon: var(--foundation-icon-light-primary);
  --ds-icon-secondary: var(--foundation-icon-light-secondary);
  --ds-icon-muted: var(--foundation-icon-light-tertiary);
  --ds-icon-inverted: var(--foundation-icon-light-inverted);

  /* Borders */
  --ds-border: var(--foundation-border-light);
  --ds-border-subtle: var(--foundation-border-light);
  --ds-border-strong: var(--foundation-border-heavy);

  /* Accents */
  --ds-accent-gray: var(--foundation-accent-gray-light);
  --ds-accent-red: var(--foundation-accent-red-light);
  --ds-accent-orange: var(--foundation-accent-orange-light);
  --ds-accent-yellow: var(--foundation-accent-yellow-light);
  --ds-accent-green: var(--foundation-accent-green-light);
  --ds-accent-blue: var(--foundation-accent-blue-light);
  --ds-accent-purple: var(--foundation-accent-purple-light);
  --ds-accent-pink: var(--foundation-accent-pink-light);

  /* Foreground for text/icons on top of accent backgrounds */
  --ds-accent-foreground: var(--foundation-text-dark-primary);

  /* Focus ring */
  --ds-ring: var(--foundation-focus-ring);
}

:where([data-theme="dark"]) {
  /* Backgrounds */
  --ds-bg-primary: var(--foundation-bg-dark-1);
  --ds-bg-secondary: var(--foundation-bg-dark-2);
  --ds-bg-muted: var(--foundation-bg-dark-3);
  --ds-bg-card: var(--foundation-bg-dark-1);
  --ds-bg-popover: var(--foundation-bg-dark-2);

  /* Text */
  --ds-fg: var(--foundation-text-dark-primary);
  --ds-fg-secondary: var(--foundation-text-dark-secondary);
  --ds-fg-muted: var(--foundation-text-dark-tertiary);
  --ds-fg-inverted: var(--foundation-text-light-primary);

  /* Icons */
  --ds-icon: var(--foundation-icon-dark-primary);
  --ds-icon-secondary: var(--foundation-icon-dark-secondary);
  --ds-icon-muted: var(--foundation-icon-dark-tertiary);
  --ds-icon-inverted: var(--foundation-icon-dark-inverted);

  /* Borders */
  --ds-border: var(--foundation-border-dark-light);
  --ds-border-subtle: var(--foundation-border-dark-light);
  --ds-border-strong: var(--foundation-border-dark-default);

  /* Accents */
  --ds-accent-gray: var(--foundation-accent-gray);
  --ds-accent-red: var(--foundation-accent-red);
  --ds-accent-orange: var(--foundation-accent-orange);
  --ds-accent-yellow: var(--foundation-accent-yellow);
  --ds-accent-green: var(--foundation-accent-green);
  --ds-accent-blue: var(--foundation-accent-blue);
  --ds-accent-purple: var(--foundation-accent-purple);
  --ds-accent-pink: var(--foundation-accent-pink);

  /* Foreground for text/icons on top of accent backgrounds */
  --ds-accent-foreground: var(--foundation-text-dark-primary);

  /* Focus ring */
  --ds-ring: var(--foundation-focus-ring);
}

@media (prefers-contrast: high) {
  :root,
  :where([data-theme="light"]),
  :where([data-theme="dark"]) {
    /* Backgrounds */
    --ds-bg-primary: var(--foundation-bg-high-contrast-1);
    --ds-bg-secondary: var(--foundation-bg-high-contrast-2);
    --ds-bg-muted: var(--foundation-bg-high-contrast-3);
    --ds-bg-card: var(--foundation-bg-high-contrast-1);
    --ds-bg-popover: var(--foundation-bg-high-contrast-2);

    /* Text */
    --ds-fg: var(--foundation-text-high-contrast-primary);
    --ds-fg-secondary: var(--foundation-text-high-contrast-secondary);
    --ds-fg-muted: var(--foundation-text-high-contrast-tertiary);
    --ds-fg-inverted: var(--foundation-text-high-contrast-inverted);

    /* Icons */
    --ds-icon: var(--foundation-icon-high-contrast-primary);
    --ds-icon-secondary: var(--foundation-icon-high-contrast-secondary);
    --ds-icon-muted: var(--foundation-icon-high-contrast-tertiary);
    --ds-icon-inverted: var(--foundation-icon-high-contrast-inverted);

    /* Borders */
    --ds-border: var(--foundation-border-high-contrast-default);
    --ds-border-subtle: var(--foundation-border-high-contrast-light);
    --ds-border-strong: var(--foundation-border-high-contrast-heavy);

    /* Accents */
    --ds-accent-gray: var(--foundation-accent-gray-high-contrast);
    --ds-accent-red: var(--foundation-accent-red-high-contrast);
    --ds-accent-orange: var(--foundation-accent-orange-high-contrast);
    --ds-accent-yellow: var(--foundation-accent-yellow-high-contrast);
    --ds-accent-green: var(--foundation-accent-green-high-contrast);
    --ds-accent-blue: var(--foundation-accent-blue-high-contrast);
    --ds-accent-purple: var(--foundation-accent-purple-high-contrast);
    --ds-accent-pink: var(--foundation-accent-pink-high-contrast);

    /* Foreground for text/icons on top of accent backgrounds */
    --ds-accent-foreground: var(--foundation-accent-foreground-high-contrast);

    /* Focus ring */
    --ds-ring: var(--foundation-interactive-high-contrast-ring);
  }
}
`;
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
    const aliasesContent = await this.generateAliasesCSS();
    const manifest = await this.generateManifest(cssContent);

    // Determine output paths relative to packages/tokens
    const cssOutputPath = join(process.cwd(), "src/foundations.css");
    const aliasesOutputPath = join(process.cwd(), "src/aliases.css");
    const manifestOutputPath = join(process.cwd(), "docs/outputs/manifest.json");

    await mkdir(dirname(cssOutputPath), { recursive: true });
    await mkdir(dirname(aliasesOutputPath), { recursive: true });
    await mkdir(dirname(manifestOutputPath), { recursive: true });

    // Write files
    await writeFile(cssOutputPath, cssContent, "utf8");
    await writeFile(aliasesOutputPath, aliasesContent, "utf8");
    await writeFile(manifestOutputPath, JSON.stringify(manifest, null, 2), "utf8");

    console.log("✅ Token generation complete");
    console.log(`   CSS: ${cssOutputPath}`);
    console.log(`   Aliases: ${aliasesOutputPath}`);
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
