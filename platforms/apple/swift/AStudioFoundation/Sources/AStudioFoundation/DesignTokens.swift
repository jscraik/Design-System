import SwiftUI
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
            public static let lightPrimary = Color(hex: "#FFFFFF")
            public static let lightSecondary = Color(hex: "#E8E8E8")
            public static let lightTertiary = Color(hex: "#F3F3F3")

            public static let darkPrimary = Color(hex: "#212121")
            public static let darkSecondary = Color(hex: "#303030")
            public static let darkTertiary = Color(hex: "#414141")
            
            // Dynamic colors that adapt to system appearance
            public static let primary = Color.dynamicColor(
                lightHex: "#FFFFFF",
                darkHex: "#212121"
            )
            
            public static let secondary = Color.dynamicColor(
                lightHex: "#E8E8E8",
                darkHex: "#303030"
            )
            
            public static let tertiary = Color.dynamicColor(
                lightHex: "#F3F3F3",
                darkHex: "#414141"
            )
        }
        
        public enum Text {
            public static let lightPrimary = Color(hex: "#0D0D0D")
            public static let lightSecondary = Color(hex: "#5D5D5D")
            public static let lightTertiary = Color(hex: "#8F8F8F")
            public static let lightInverted = Color(hex: "#FFFFFF")

            public static let darkPrimary = Color(hex: "#FFFFFF")
            public static let darkSecondary = Color(hex: "#CDCDCD")
            public static let darkTertiary = Color(hex: "#AFAFAF")
            public static let darkInverted = Color(hex: "#0D0D0D")
            
            // Dynamic colors that adapt to system appearance
            public static let primary = Color.dynamicColor(
                lightHex: "#0D0D0D",
                darkHex: "#FFFFFF"
            )
            
            public static let secondary = Color.dynamicColor(
                lightHex: "#5D5D5D",
                darkHex: "#CDCDCD"
            )
            
            public static let tertiary = Color.dynamicColor(
                lightHex: "#8F8F8F",
                darkHex: "#AFAFAF"
            )
            
            public static let inverted = Color.dynamicColor(
                lightHex: "#FFFFFF",
                darkHex: "#0D0D0D"
            )
        }
        
        public enum Icon {
            public static let lightPrimary = Color(hex: "#0D0D0D")
            public static let lightSecondary = Color(hex: "#5D5D5D")
            public static let lightTertiary = Color(hex: "#8F8F8F")
            public static let lightInverted = Color(hex: "#FFFFFF")
            public static let lightAccent = Color(hex: "#0285FF")
            public static let lightStatusError = Color(hex: "#E02E2A")
            public static let lightStatusWarning = Color(hex: "#E25507")
            public static let lightStatusSuccess = Color(hex: "#008635")

            public static let darkPrimary = Color(hex: "#FFFFFF")
            public static let darkSecondary = Color(hex: "#CDCDCD")
            public static let darkTertiary = Color(hex: "#AFAFAF")
            public static let darkInverted = Color(hex: "#0D0D0D")
            public static let darkAccent = Color(hex: "#48AAFF")
            public static let darkStatusError = Color(hex: "#FF8583")
            public static let darkStatusWarning = Color(hex: "#FF9E6C")
            public static let darkStatusSuccess = Color(hex: "#40C977")
            
            // Dynamic colors that adapt to system appearance
            public static let primary = Color.dynamicColor(
                lightHex: "#0D0D0D",
                darkHex: "#FFFFFF"
            )
            
            public static let secondary = Color.dynamicColor(
                lightHex: "#5D5D5D",
                darkHex: "#CDCDCD"
            )
            
            public static let tertiary = Color.dynamicColor(
                lightHex: "#8F8F8F",
                darkHex: "#AFAFAF"
            )
            
            public static let inverted = Color.dynamicColor(
                lightHex: "#FFFFFF",
                darkHex: "#0D0D0D"
            )

            public static let accent = Color.dynamicColor(
                lightHex: "#0285FF",
                darkHex: "#48AAFF"
            )

            public static let statusError = Color.dynamicColor(
                lightHex: "#E02E2A",
                darkHex: "#FF8583"
            )

            public static let statusWarning = Color.dynamicColor(
                lightHex: "#E25507",
                darkHex: "#FF9E6C"
            )

            public static let statusSuccess = Color.dynamicColor(
                lightHex: "#008635",
                darkHex: "#40C977"
            )
        }

        public enum Border {
            public static let lightLight = Color(hex: "#0D0D0D0D")
            public static let lightDefault = Color(hex: "#0D0D0D26")
            public static let lightHeavy = Color(hex: "#0D0D0D26")

            public static let darkDefault = Color(hex: "#FFFFFF26")
            public static let darkHeavy = Color(hex: "#FFFFFF26")
            public static let darkLight = Color(hex: "#FFFFFF0D")

            // Dynamic colors that adapt to system appearance
            public static let light = Color.dynamicColor(
                lightHex: "#0D0D0D0D",
                darkHex: "#FFFFFF0D"
            )

            public static let heavy = Color.dynamicColor(
                lightHex: "#0D0D0D26",
                darkHex: "#FFFFFF26"
            )
        }
        
        public enum Accent {
            public static let lightGray = Color(hex: "#8F8F8F")
            public static let lightRed = Color(hex: "#E02E2A")
            public static let lightOrange = Color(hex: "#E25507")
            public static let lightYellow = Color(hex: "#C08C00")
            public static let lightGreen = Color(hex: "#008635")
            public static let lightBlue = Color(hex: "#0285FF")
            public static let lightPurple = Color(hex: "#934FF2")
            public static let lightPink = Color(hex: "#E3008D")
            public static let lightForeground = Color(hex: "#FFFFFF")

            public static let darkGray = Color(hex: "#ABABAB")
            public static let darkRed = Color(hex: "#FF8583")
            public static let darkOrange = Color(hex: "#FF9E6C")
            public static let darkYellow = Color(hex: "#FFD666")
            public static let darkGreen = Color(hex: "#40C977")
            public static let darkBlue = Color(hex: "#5A9FF5")
            public static let darkPurple = Color(hex: "#BA8FF7")
            public static let darkPink = Color(hex: "#FF6BC7")
            public static let darkForeground = Color(hex: "#FFFFFF")

            // Dynamic colors that adapt to system appearance
            public static let gray = Color.dynamicColor(
                lightHex: "#8F8F8F",
                darkHex: "#ABABAB"
            )

            public static let red = Color.dynamicColor(
                lightHex: "#E02E2A",
                darkHex: "#FF8583"
            )

            public static let orange = Color.dynamicColor(
                lightHex: "#E25507",
                darkHex: "#FF9E6C"
            )

            public static let yellow = Color.dynamicColor(
                lightHex: "#C08C00",
                darkHex: "#FFD666"
            )

            public static let green = Color.dynamicColor(
                lightHex: "#008635",
                darkHex: "#40C977"
            )

            public static let blue = Color.dynamicColor(
                lightHex: "#0285FF",
                darkHex: "#5A9FF5"
            )

            public static let purple = Color.dynamicColor(
                lightHex: "#934FF2",
                darkHex: "#BA8FF7"
            )

            public static let pink = Color.dynamicColor(
                lightHex: "#E3008D",
                darkHex: "#FF6BC7"
            )

            public static let foreground = Color.dynamicColor(
                lightHex: "#FFFFFF",
                darkHex: "#FFFFFF"
            )
        }

        public enum Interactive {
            public static let lightRing = Color(hex: "#0285FF")
            public static let darkRing = Color(hex: "#0285FF")

            // Dynamic colors that adapt to system appearance
            public static let ring = Color.dynamicColor(
                lightHex: "#0285FF",
                darkHex: "#0285FF"
            )
        }
    }
    
    // MARK: - Typography
    
    public enum Typography {
        public static let fontFamily = "SF Pro"
        
        public enum Heading1 {
            public static let size: CGFloat = 36
            public static let lineHeight: CGFloat = 40
            public static let weight = Font.Weight.semibold
            public static let tracking: CGFloat = -0.1
        }

        public enum Heading2 {
            public static let size: CGFloat = 24
            public static let lineHeight: CGFloat = 28
            public static let weight = Font.Weight.semibold
            public static let tracking: CGFloat = -0.25
        }

        public enum Heading3 {
            public static let size: CGFloat = 18
            public static let lineHeight: CGFloat = 26
            public static let weight = Font.Weight.semibold
            public static let tracking: CGFloat = -0.45
        }

        public enum Body {
            public static let size: CGFloat = 16
            public static let lineHeight: CGFloat = 26
            public static let weight = Font.Weight.regular
            public static let emphasisWeight = Font.Weight.semibold
            public static let tracking: CGFloat = -0.4
        }

        public enum BodySmall {
            public static let size: CGFloat = 14
            public static let lineHeight: CGFloat = 18
            public static let weight = Font.Weight.regular
            public static let emphasisWeight = Font.Weight.semibold
            public static let tracking: CGFloat = -0.3
        }

        public enum Caption {
            public static let size: CGFloat = 12
            public static let lineHeight: CGFloat = 16
            public static let weight = Font.Weight.regular
            public static let emphasisWeight = Font.Weight.semibold
            public static let tracking: CGFloat = -0.1
        }

        public enum CardTitle {
            public static let size: CGFloat = 17
            public static let lineHeight: CGFloat = 23
            public static let weight = Font.Weight.medium
            public static let tracking: CGFloat = -0.43
        }

        public enum ListTitle {
            public static let size: CGFloat = 17
            public static let lineHeight: CGFloat = 24
            public static let weight = Font.Weight.regular
            public static let tracking: CGFloat = -0.4
        }

        public enum ListSubtitle {
            public static let size: CGFloat = 14
            public static let lineHeight: CGFloat = 20
            public static let weight = Font.Weight.regular
            public static let tracking: CGFloat = -0.18
        }

        public enum ButtonLabel {
            public static let size: CGFloat = 15
            public static let lineHeight: CGFloat = 24
            public static let weight = Font.Weight.medium
            public static let tracking: CGFloat = -0.24
        }

        public enum ButtonLabelSmall {
            public static let size: CGFloat = 14
            public static let lineHeight: CGFloat = 20
            public static let weight = Font.Weight.semibold
            public static let tracking: CGFloat = -0.3
        }

    }
    
    // MARK: - Spacing
    
    public enum Spacing {
        public static let scale: [CGFloat] = [128, 64, 48, 40, 32, 24, 16, 12, 8, 4, 2, 0]
        
        // Convenience accessors
        public static let xxl: CGFloat = 128
        public static let xl: CGFloat = 64
        public static let lg: CGFloat = 48
        public static let lgMd: CGFloat = 40
        public static let md: CGFloat = 32
        public static let mdSm: CGFloat = 24
        public static let sm: CGFloat = 16
        public static let smXs: CGFloat = 12
        public static let xs: CGFloat = 8
        public static let xxs: CGFloat = 4
        public static let xxxs: CGFloat = 2
        public static let none: CGFloat = 0
    }
    
    // MARK: - Corner Radius
    
    public enum CornerRadius {
        public static let small: CGFloat = 6
        public static let medium: CGFloat = 8
        public static let large: CGFloat = 12
        public static let extraLarge: CGFloat = 16

        public static let r6: CGFloat = 6
        public static let r8: CGFloat = 8
        public static let r10: CGFloat = 10
        public static let r12: CGFloat = 12
        public static let r16: CGFloat = 16
        public static let r18: CGFloat = 18
        public static let r21: CGFloat = 21
        public static let r24: CGFloat = 24
        public static let r30: CGFloat = 30
        public static let round: CGFloat = 999
    }

    // MARK: - Sizes

    public enum Size {
        public static let controlHeight: CGFloat = 44
        public static let cardHeaderHeight: CGFloat = 56
        public static let hitTarget: CGFloat = 44
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
