import { createHash } from "crypto";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { dirname, join } from "path";

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
    swift: string;
    css: string;
    assetCatalog: string;
  };
  generated: string;
}

const MANIFEST_GENERATED_AT = "1970-01-01T00:00:00.000Z";

interface ColorComponents {
  red: string;
  green: string;
  blue: string;
  alpha: string;
}

interface AssetCatalogColor {
  colors: Array<{
    color: {
      "color-space": string;
      components: ColorComponents;
    };
    idiom: string;
    appearances?: Array<{
      appearance: string;
      value: string;
    }>;
  }>;
  info: {
    author: string;
    version: number;
  };
}

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
   * Generate Swift constants from design tokens
   * Output is deterministic - same input produces identical file bytes
   */
  async generateSwift(): Promise<string> {
    const swiftContent = `import SwiftUI
#if canImport(AppKit)
import AppKit
#endif
#if canImport(UIKit)
import UIKit
#endif

/// Design tokens generated from the shared token system
/// This file provides Swift constants that match the CSS custom properties
/// Generated deterministically - same input produces identical output
public enum DesignTokens {
    
    // MARK: - Colors
    
    public enum Colors {
        
        public enum Background {
${this.generateColorConstants("background")}
            
            // Dynamic colors that adapt to system appearance
            public static let primary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.background.light.primary}",
                darkHex: "${this.tokens.colors.background.dark.primary}"
            )
            
            public static let secondary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.background.light.secondary}",
                darkHex: "${this.tokens.colors.background.dark.secondary}"
            )
            
            public static let tertiary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.background.light.tertiary}",
                darkHex: "${this.tokens.colors.background.dark.tertiary}"
            )
        }
        
        public enum Text {
${this.generateColorConstants("text")}
            
            // Dynamic colors that adapt to system appearance
            public static let primary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.text.light.primary}",
                darkHex: "${this.tokens.colors.text.dark.primary}"
            )
            
            public static let secondary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.text.light.secondary}",
                darkHex: "${this.tokens.colors.text.dark.secondary}"
            )
            
            public static let tertiary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.text.light.tertiary}",
                darkHex: "${this.tokens.colors.text.dark.tertiary}"
            )
            
            public static let inverted = Color.dynamicColor(
                lightHex: "${this.tokens.colors.text.light.inverted}",
                darkHex: "${this.tokens.colors.text.dark.inverted}"
            )
        }
        
        public enum Icon {
${this.generateColorConstants("icon")}
            
            // Dynamic colors that adapt to system appearance
            public static let primary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.icon.light.primary}",
                darkHex: "${this.tokens.colors.icon.dark.primary}"
            )
            
            public static let secondary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.icon.light.secondary}",
                darkHex: "${this.tokens.colors.icon.dark.secondary}"
            )
            
            public static let tertiary = Color.dynamicColor(
                lightHex: "${this.tokens.colors.icon.light.tertiary}",
                darkHex: "${this.tokens.colors.icon.dark.tertiary}"
            )
            
            public static let inverted = Color.dynamicColor(
                lightHex: "${this.tokens.colors.icon.light.inverted}",
                darkHex: "${this.tokens.colors.icon.dark.inverted}"
            )

            public static let accent = Color.dynamicColor(
                lightHex: "${this.tokens.colors.icon.light.accent}",
                darkHex: "${this.tokens.colors.icon.dark.accent}"
            )

            public static let statusError = Color.dynamicColor(
                lightHex: "${this.tokens.colors.icon.light.statusError}",
                darkHex: "${this.tokens.colors.icon.dark.statusError}"
            )

            public static let statusWarning = Color.dynamicColor(
                lightHex: "${this.tokens.colors.icon.light.statusWarning}",
                darkHex: "${this.tokens.colors.icon.dark.statusWarning}"
            )

            public static let statusSuccess = Color.dynamicColor(
                lightHex: "${this.tokens.colors.icon.light.statusSuccess}",
                darkHex: "${this.tokens.colors.icon.dark.statusSuccess}"
            )
        }

        public enum Border {
${this.generateColorConstants("border")}

            // Dynamic colors that adapt to system appearance
            public static let light = Color.dynamicColor(
                lightHex: "${this.tokens.colors.border.light.light}",
                darkHex: "${this.tokens.colors.border.dark.light}"
            )

            public static let heavy = Color.dynamicColor(
                lightHex: "${this.tokens.colors.border.light.heavy}",
                darkHex: "${this.tokens.colors.border.dark.default}"
            )
        }
        
        public enum Accent {
${this.generateAccentColorConstants()}

            // Dynamic colors that adapt to system appearance
            public static let gray = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.gray}",
                darkHex: "${this.tokens.colors.accent.dark.gray}"
            )

            public static let red = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.red}",
                darkHex: "${this.tokens.colors.accent.dark.red}"
            )

            public static let orange = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.orange}",
                darkHex: "${this.tokens.colors.accent.dark.orange}"
            )

            public static let yellow = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.yellow}",
                darkHex: "${this.tokens.colors.accent.dark.yellow}"
            )

            public static let green = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.green}",
                darkHex: "${this.tokens.colors.accent.dark.green}"
            )

            public static let blue = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.blue}",
                darkHex: "${this.tokens.colors.accent.dark.blue}"
            )

            public static let purple = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.purple}",
                darkHex: "${this.tokens.colors.accent.dark.purple}"
            )

            public static let pink = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.pink}",
                darkHex: "${this.tokens.colors.accent.dark.pink}"
            )

            public static let foreground = Color.dynamicColor(
                lightHex: "${this.tokens.colors.accent.light.foreground}",
                darkHex: "${this.tokens.colors.accent.dark.foreground}"
            )
        }

        public enum Interactive {
            public static let lightRing = Color(hex: "${this.tokens.colors.interactive.light.ring}")
            public static let darkRing = Color(hex: "${this.tokens.colors.interactive.dark.ring}")

            // Dynamic colors that adapt to system appearance
            public static let ring = Color.dynamicColor(
                lightHex: "${this.tokens.colors.interactive.light.ring}",
                darkHex: "${this.tokens.colors.interactive.dark.ring}"
            )
        }
    }
    
    // MARK: - Typography
    
    public enum Typography {
        public static let fontFamily = "${this.tokens.typography.fontFamily}"
        
${this.generateTypographyConstants()}
    }
    
    // MARK: - Spacing
    
    public enum Spacing {
        public static let scale: [CGFloat] = [${this.tokens.spacing.join(", ")}]
        
        // Convenience accessors
${this.generateSpacingConstants()}
    }
    
    // MARK: - Corner Radius
    
    public enum CornerRadius {
        public static let small: CGFloat = ${this.tokens.radius.r6}
        public static let medium: CGFloat = ${this.tokens.radius.r8}
        public static let large: CGFloat = ${this.tokens.radius.r12}
        public static let extraLarge: CGFloat = ${this.tokens.radius.r16}

        public static let r6: CGFloat = ${this.tokens.radius.r6}
        public static let r8: CGFloat = ${this.tokens.radius.r8}
        public static let r10: CGFloat = ${this.tokens.radius.r10}
        public static let r12: CGFloat = ${this.tokens.radius.r12}
        public static let r16: CGFloat = ${this.tokens.radius.r16}
        public static let r18: CGFloat = ${this.tokens.radius.r18}
        public static let r21: CGFloat = ${this.tokens.radius.r21}
        public static let r24: CGFloat = ${this.tokens.radius.r24}
        public static let r30: CGFloat = ${this.tokens.radius.r30}
        public static let round: CGFloat = ${this.tokens.radius.round}
    }

    // MARK: - Sizes

    public enum Size {
        public static let controlHeight: CGFloat = ${this.tokens.sizes.controlHeight}
        public static let cardHeaderHeight: CGFloat = ${this.tokens.sizes.cardHeaderHeight}
        public static let hitTarget: CGFloat = ${this.tokens.sizes.hitTarget}
    }

    // MARK: - Shadows

    public struct ShadowToken {
        public let color: Color
        public let x: CGFloat
        public let y: CGFloat
        public let blur: CGFloat
        public let spread: CGFloat

        public init(color: Color, x: CGFloat, y: CGFloat, blur: CGFloat, spread: CGFloat) {
            self.color = color
            self.x = x
            self.y = y
            self.blur = blur
            self.spread = spread
        }
    }

    public enum Shadow {
        public static let card = ShadowToken(
            color: Color(hex: "0000000D"),
            x: 0,
            y: 4,
            blur: 16,
            spread: 0
        )

        public static let pip = ShadowToken(
            color: Color(hex: "0000000D"),
            x: 0,
            y: 4,
            blur: 16,
            spread: 0
        )

        public static let pill = ShadowToken(
            color: Color(hex: "0000000A"),
            x: 0,
            y: 10,
            blur: 22,
            spread: 0
        )

        public static let close = ShadowToken(
            color: Color(hex: "00000029"),
            x: 0,
            y: 4,
            blur: 8,
            spread: 0
        )
    }
    
    // MARK: - Accessibility
    
    public enum Accessibility {
        /// Focus ring color for keyboard navigation
        public static let focusRing = Color(hex: "#0285FF")
        
        /// Focus ring width for keyboard navigation
        public static let focusRingWidth: CGFloat = 2
        
        /// High contrast variants
        public enum HighContrast {
            public static let textOnBackground = Color(hex: "#FFFFFF")
            public static let backgroundContrast = Color(hex: "#000000")
            public static let borderContrast = Color(hex: "#FFFFFF")
        }
        
        /// Reduced motion preferences
        public enum Animation {
            public static let duration: Double = 0.25
            public static let reducedDuration: Double = 0.1
            
            /// Returns appropriate animation duration based on system preferences
            public static func duration(respectingMotionPreference: Bool = true) -> Double {
                if respectingMotionPreference {
                    return AccessibilityPreferences.prefersReducedMotion ? reducedDuration : duration
                }
                return duration
            }
        }
        
        /// System accessibility preferences
        public enum AccessibilityPreferences {
            /// Whether the user prefers reduced motion
            public static var prefersReducedMotion: Bool {
                #if os(macOS)
                NSWorkspace.shared.accessibilityDisplayShouldReduceMotion
                #elseif canImport(UIKit)
                UIAccessibility.isReduceMotionEnabled
                #else
                false
                #endif
            }
            
            /// Whether the user prefers high contrast
            public static var prefersHighContrast: Bool {
                #if os(macOS)
                NSWorkspace.shared.accessibilityDisplayShouldIncreaseContrast
                #elseif canImport(UIKit)
                UIAccessibility.isDarkerSystemColorsEnabled
                #else
                false
                #endif
            }
            
            /// Whether the user prefers reduced transparency
            public static var prefersReducedTransparency: Bool {
                #if os(macOS)
                NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency
                #elseif canImport(UIKit)
                UIAccessibility.isReduceTransparencyEnabled
                #else
                false
                #endif
            }
        }
    }
}

// MARK: - Color Extensions

#if canImport(AppKit)
private typealias PlatformColor = NSColor
#elseif canImport(UIKit)
private typealias PlatformColor = UIColor
#endif

private enum HexColorParser {
    static func rgba(from hex: String) -> (red: Double, green: Double, blue: Double, alpha: Double) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        return (
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            alpha: Double(a) / 255
        )
    }
}

#if canImport(AppKit) || canImport(UIKit)
extension PlatformColor {
    convenience init(hex: String) {
        let rgba = HexColorParser.rgba(from: hex)
        self.init(red: rgba.red, green: rgba.green, blue: rgba.blue, alpha: rgba.alpha)
    }
}
#endif

extension Color {
    /// Creates a Color from a hex string
    public init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
    
    /// Creates a dynamic color that adapts to light/dark mode
    public static func dynamicColor(lightHex: String, darkHex: String) -> Color {
        #if canImport(AppKit)
        return Color(PlatformColor(name: nil) { appearance in
            switch appearance.bestMatch(from: [.aqua, .darkAqua]) {
            case .darkAqua:
                return PlatformColor(hex: darkHex)
            default:
                return PlatformColor(hex: lightHex)
            }
        })
        #elseif canImport(UIKit)
        return Color(PlatformColor { traits in
            traits.userInterfaceStyle == .dark
                ? PlatformColor(hex: darkHex)
                : PlatformColor(hex: lightHex)
        })
        #else
        return Color(hex: lightHex)
        #endif
    }
}

// MARK: - Accessibility Extensions
// Note: Accessibility view extensions are defined in AStudioFoundation/FAccessibility.swift
`;

    return swiftContent;
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
  --foundation-high-contrast-text: #ffffff;
  --foundation-high-contrast-bg: #000000;
  --foundation-high-contrast-border: #ffffff;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --foundation-text-dark-primary: var(--foundation-high-contrast-text);
    --foundation-text-light-primary: var(--foundation-high-contrast-bg);
    --foundation-bg-dark-1: var(--foundation-high-contrast-bg);
    --foundation-bg-light-1: var(--foundation-high-contrast-text);
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
  async generateManifest(
    swiftContent: string,
    cssContent: string,
    assetCatalogContent: string,
  ): Promise<GenerationManifest> {
    const swiftHash = createHash("sha256").update(swiftContent).digest("hex");
    const cssHash = createHash("sha256").update(cssContent).digest("hex");
    const assetCatalogHash = createHash("sha256").update(assetCatalogContent).digest("hex");
    const schemaVersion = await this.readSchemaVersion();
    const appsSdkUiVersion = await this.readAppsSdkUiVersion();
    const tokenCount = this.countTokens();

    return {
      version: "1.0.0",
      schemaVersion,
      appsSdkUiVersion,
      tokenCount,
      sha256: {
        swift: swiftHash,
        css: cssHash,
        assetCatalog: assetCatalogHash,
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
    const colorCategories = ["background", "text", "icon", "border", "accent", "interactive"] as const;
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
   * Convert hex color to RGB components (0-1 range)
   */
  private hexToRGB(hex: string): ColorComponents {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    const a =
      cleanHex.length >= 8 ? parseInt(cleanHex.substring(6, 8), 16) / 255 : 1;

    return {
      red: r.toFixed(3),
      green: g.toFixed(3),
      blue: b.toFixed(3),
      alpha: a.toFixed(3),
    };
  }

  /**
   * Generate Asset Catalog colorset JSON
   */
  private generateColorsetJSON(lightColor: string, darkColor: string): AssetCatalogColor {
    return {
      colors: [
        {
          color: {
            "color-space": "srgb",
            components: this.hexToRGB(lightColor),
          },
          idiom: "universal",
        },
        {
          appearances: [
            {
              appearance: "luminosity",
              value: "dark",
            },
          ],
          color: {
            "color-space": "srgb",
            components: this.hexToRGB(darkColor),
          },
          idiom: "universal",
        },
      ],
      info: {
        author: "xcode",
        version: 1,
      },
    };
  }

  /**
   * Generate Asset Catalog structure
   * Returns a deterministic string representation for hashing
   */
  async generateAssetCatalog(): Promise<string> {
    const colorMappings = this.getAssetCatalogMappings()
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    const rootContents = {
      info: {
        author: "xcode",
        version: 1,
      },
    };

    const files: Record<string, string> = {
      "Contents.json": JSON.stringify(rootContents, null, 2),
    };

    for (const mapping of colorMappings) {
      const colorsetJSON = this.generateColorsetJSON(mapping.light, mapping.dark);
      files[`${mapping.name}.colorset/Contents.json`] = JSON.stringify(colorsetJSON, null, 2);
    }

    // Deterministic representation of the actual files written to disk
    return JSON.stringify(files, null, 2);
  }

  /**
   * Write Asset Catalog to disk
   */
  async writeAssetCatalog(basePath: string): Promise<void> {
    const colorMappings = this.getAssetCatalogMappings()
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    // Clean existing Asset Catalog directory
    const assetCatalogPath = join(basePath, "Colors.xcassets");
    try {
      await rm(assetCatalogPath, { recursive: true, force: true });
    } catch {
      // Directory might not exist, that's okay
    }

    // Create Asset Catalog directory
    await mkdir(assetCatalogPath, { recursive: true });

    // Write root Contents.json
    const rootContents = {
      info: {
        author: "xcode",
        version: 1,
      },
    };
    await writeFile(
      join(assetCatalogPath, "Contents.json"),
      JSON.stringify(rootContents, null, 2),
      "utf8",
    );

    // Write each colorset
    for (const mapping of colorMappings) {
      const colorsetPath = join(assetCatalogPath, `${mapping.name}.colorset`);
      await mkdir(colorsetPath, { recursive: true });

      const colorsetJSON = this.generateColorsetJSON(mapping.light, mapping.dark);
      await writeFile(
        join(colorsetPath, "Contents.json"),
        JSON.stringify(colorsetJSON, null, 2),
        "utf8",
      );
    }
  }

  private getAssetCatalogMappings(): Array<{ name: string; light: string; dark: string }> {
    return [
      // Background colors
      {
        name: "foundation-bg-app",
        light: this.tokens.colors.background.light.primary,
        dark: this.tokens.colors.background.dark.primary,
      },
      {
        name: "foundation-bg-card",
        light: this.tokens.colors.background.light.secondary,
        dark: this.tokens.colors.background.dark.secondary,
      },
      {
        name: "foundation-bg-card-alt",
        light: this.tokens.colors.background.light.tertiary,
        dark: this.tokens.colors.background.dark.tertiary,
      },

      // Text colors
      {
        name: "foundation-text-primary",
        light: this.tokens.colors.text.light.primary,
        dark: this.tokens.colors.text.dark.primary,
      },
      {
        name: "foundation-text-secondary",
        light: this.tokens.colors.text.light.secondary,
        dark: this.tokens.colors.text.dark.secondary,
      },
      {
        name: "foundation-text-tertiary",
        light: this.tokens.colors.text.light.tertiary,
        dark: this.tokens.colors.text.dark.tertiary,
      },

      // Icon colors
      {
        name: "foundation-icon-primary",
        light: this.tokens.colors.icon.light.primary,
        dark: this.tokens.colors.icon.dark.primary,
      },
      {
        name: "foundation-icon-secondary",
        light: this.tokens.colors.icon.light.secondary,
        dark: this.tokens.colors.icon.dark.secondary,
      },
      {
        name: "foundation-icon-tertiary",
        light: this.tokens.colors.icon.light.tertiary,
        dark: this.tokens.colors.icon.dark.tertiary,
      },

      // Border colors
      {
        name: "foundation-border-light",
        light: this.tokens.colors.border.light.light,
        dark: this.tokens.colors.border.dark.light,
      },
      {
        name: "foundation-border-heavy",
        light: this.tokens.colors.border.light.heavy,
        dark: this.tokens.colors.border.dark.default,
      },

      // Accent colors
      {
        name: "foundation-accent-gray",
        light: this.tokens.colors.accent.light.gray,
        dark: this.tokens.colors.accent.dark.gray,
      },
      {
        name: "foundation-accent-red",
        light: this.tokens.colors.accent.light.red,
        dark: this.tokens.colors.accent.dark.red,
      },
      {
        name: "foundation-accent-orange",
        light: this.tokens.colors.accent.light.orange,
        dark: this.tokens.colors.accent.dark.orange,
      },
      {
        name: "foundation-accent-yellow",
        light: this.tokens.colors.accent.light.yellow,
        dark: this.tokens.colors.accent.dark.yellow,
      },
      {
        name: "foundation-accent-green",
        light: this.tokens.colors.accent.light.green,
        dark: this.tokens.colors.accent.dark.green,
      },
      {
        name: "foundation-accent-blue",
        light: this.tokens.colors.accent.light.blue,
        dark: this.tokens.colors.accent.dark.blue,
      },
      {
        name: "foundation-accent-purple",
        light: this.tokens.colors.accent.light.purple,
        dark: this.tokens.colors.accent.dark.purple,
      },
      {
        name: "foundation-accent-pink",
        light: this.tokens.colors.accent.light.pink,
        dark: this.tokens.colors.accent.dark.pink,
      },

      // Divider (using tertiary background as base)
      {
        name: "foundation-divider",
        light: this.tokens.colors.background.light.tertiary,
        dark: this.tokens.colors.background.dark.tertiary,
      },
    ];
  }

  /**
   * Generate all outputs and write to appropriate directories
   */
  async generate(): Promise<void> {
    // Generate content
    const swiftContent = await this.generateSwift();
    const cssContent = await this.generateCSS();
    const assetCatalogContent = await this.generateAssetCatalog();
    const manifest = await this.generateManifest(swiftContent, cssContent, assetCatalogContent);

    // Determine output paths relative to packages/tokens
    const swiftOutputPath = join(
      process.cwd(),
      "../../platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/DesignTokens.swift",
    );
    const cssOutputPath = join(process.cwd(), "src/foundations.css");
    const manifestOutputPath = join(process.cwd(), "docs/outputs/manifest.json");
    const assetCatalogBasePath = join(
      process.cwd(),
      "../../platforms/apple/swift/AStudioFoundation/Sources/AStudioFoundation/Resources",
    );

    await mkdir(dirname(swiftOutputPath), { recursive: true });
    await mkdir(dirname(cssOutputPath), { recursive: true });
    await mkdir(dirname(manifestOutputPath), { recursive: true });
    await mkdir(assetCatalogBasePath, { recursive: true });

    // Write files
    await writeFile(swiftOutputPath, swiftContent, "utf8");
    await writeFile(cssOutputPath, cssContent, "utf8");
    await writeFile(manifestOutputPath, JSON.stringify(manifest, null, 2), "utf8");

    // Write Asset Catalog
    await this.writeAssetCatalog(assetCatalogBasePath);

    console.log("✅ Token generation complete");
    console.log(`   Swift: ${swiftOutputPath}`);
    console.log(`   CSS: ${cssOutputPath}`);
    console.log(`   Asset Catalog: ${assetCatalogBasePath}/Colors.xcassets`);
    console.log(`   Manifest: ${manifestOutputPath}`);
    console.log(`   Swift SHA: ${manifest.sha256.swift.substring(0, 8)}...`);
    console.log(`   CSS SHA: ${manifest.sha256.css.substring(0, 8)}...`);
    console.log(`   Asset Catalog SHA: ${manifest.sha256.assetCatalog.substring(0, 8)}...`);
  }

  private generateColorConstants(category: "background" | "text" | "icon" | "border"): string {
    const colors = this.tokens.colors[category];
    const lines: string[] = [];

    // Light colors
    Object.entries(colors.light).forEach(([name, value]) => {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      lines.push(`            public static let light${capitalizedName} = Color(hex: "${value}")`);
    });

    lines.push("");

    // Dark colors
    Object.entries(colors.dark).forEach(([name, value]) => {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      lines.push(`            public static let dark${capitalizedName} = Color(hex: "${value}")`);
    });

    return lines.join("\n");
  }

  private generateAccentColorConstants(): string {
    const lines: string[] = [];

    // Light accent colors
    Object.entries(this.tokens.colors.accent.light).forEach(([name, value]) => {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      lines.push(`            public static let light${capitalizedName} = Color(hex: "${value}")`);
    });

    lines.push("");

    // Dark accent colors
    Object.entries(this.tokens.colors.accent.dark).forEach(([name, value]) => {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      lines.push(`            public static let dark${capitalizedName} = Color(hex: "${value}")`);
    });

    return lines.join("\n");
  }

  private generateTypographyConstants(): string {
    const lines: string[] = [];

    Object.entries(this.tokens.typography).forEach(([key, value]) => {
      if (key === "fontFamily") return; // Already handled above

      // Type assertion: after skipping fontFamily, value is an object with typography properties
      const token = value as {
        size: number;
        lineHeight: number;
        weight: number;
        emphasisWeight?: number;
        tracking: number;
      };

      const enumName = key.charAt(0).toUpperCase() + key.slice(1);
      lines.push(`        public enum ${enumName} {`);
      lines.push(`            public static let size: CGFloat = ${token.size}`);
      lines.push(`            public static let lineHeight: CGFloat = ${token.lineHeight}`);
      lines.push(
        `            public static let weight = Font.Weight.${this.mapFontWeight(token.weight)}`,
      );

      if ("emphasisWeight" in token && token.emphasisWeight !== undefined) {
        lines.push(
          `            public static let emphasisWeight = Font.Weight.${this.mapFontWeight(token.emphasisWeight)}`,
        );
      }

      lines.push(`            public static let tracking: CGFloat = ${token.tracking}`);
      lines.push(`        }`);
      lines.push("");
    });

    return lines.join("\n");
  }

  private generateSpacingConstants(): string {
    const spacingNames = [
      "xxl",
      "xl",
      "lg",
      "lgMd",
      "md",
      "mdSm",
      "sm",
      "smXs",
      "xs",
      "xxs",
      "xxxs",
      "none",
    ];
    const lines: string[] = [];

    this.tokens.spacing.forEach((value, index) => {
      if (index < spacingNames.length) {
        lines.push(`        public static let ${spacingNames[index]}: CGFloat = ${value}`);
      }
    });

    return lines.join("\n");
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
        tracking: number;
      };

      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      lines.push(`  --foundation-${cssKey}-size: ${token.size}px;`);
      lines.push(`  --foundation-${cssKey}-line: ${token.lineHeight}px;`);
      lines.push(`  --foundation-${cssKey}-weight: ${token.weight};`);

      if ("emphasisWeight" in token && token.emphasisWeight !== undefined) {
        lines.push(`  --foundation-${cssKey}-weight-emphasis: ${token.emphasisWeight};`);
      } else {
        lines.push(`  --foundation-${cssKey}-weight-regular: ${token.weight};`);
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

  private mapFontWeight(weight: number): string {
    switch (weight) {
      case 100:
        return "ultraLight";
      case 200:
        return "thin";
      case 300:
        return "light";
      case 400:
        return "regular";
      case 500:
        return "medium";
      case 600:
        return "semibold";
      case 700:
        return "bold";
      case 800:
        return "heavy";
      case 900:
        return "black";
      default:
        return "regular";
    }
  }
}
