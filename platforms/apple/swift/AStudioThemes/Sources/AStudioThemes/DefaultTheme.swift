import SwiftUI

/// Default theme with native macOS styling as alternative to ChatGPT theme
public enum DefaultTheme {

    // MARK: - App Shell

    /// App-level corner radius (12pt) - native macOS style
    public static let appCornerRadius: CGFloat = 12

    /// App shadow opacity (0.2)
    public static let appShadowOpacity: Double = 0.2

    /// App shadow radius (16pt)
    public static let appShadowRadius: CGFloat = 16

    /// App shadow Y offset (8pt)
    public static let appShadowYOffset: CGFloat = 8

    /// App border opacity in light mode (0.18)
    public static let appBorderOpacityLight: Double = 0.18

    /// App border opacity in dark mode (0.14)
    public static let appBorderOpacityDark: Double = 0.14

    // MARK: - Corner Radii

    /// Card corner radius (8pt) - native macOS style
    public static let cardCornerRadius: CGFloat = 8

    /// Backwards-compatible alias for card corner radius
    public static let cardRadius: CGFloat = cardCornerRadius

    /// Row corner radius (8pt) - native macOS style
    public static let rowCornerRadius: CGFloat = 8

    /// Pill corner radius (999pt)
    public static let pillCornerRadius: CGFloat = 999

    /// Button corner radius (6pt) - native macOS style
    public static let buttonRadius: CGFloat = 6

    /// Input corner radius (8pt) - native macOS style
    public static let inputRadius: CGFloat = 8

    // MARK: - Shadows

    /// Subtle card shadow color
    public static let cardShadow = Color.black.opacity(0.05)

    /// Card shadow radius (4pt)
    public static let cardShadowRadius: CGFloat = 4

    /// Card shadow offset
    public static let cardShadowOffset = CGSize(width: 0, height: 1)

    // MARK: - Borders

    /// Card border opacity in light mode (0.2)
    public static let cardBorderOpacityLight: Double = 0.2

    /// Card border opacity in dark mode (0.15)
    public static let cardBorderOpacityDark: Double = 0.15

    /// Divider opacity in light mode (0.3)
    public static let dividerOpacityLight: Double = 0.3

    /// Divider opacity in dark mode (0.2)
    public static let dividerOpacityDark: Double = 0.2

    // MARK: - Materials

    /// Sidebar material for native macOS feel
    public static let sidebarMaterial = Material.regularMaterial

    /// Background material for native macOS feel
    public static let backgroundMaterial = Material.regularMaterial

    // MARK: - Row Metrics

    /// Row horizontal padding (10pt)
    public static let rowHPadding: CGFloat = 10

    /// Row vertical padding (8pt)
    public static let rowVPadding: CGFloat = 8

    /// Row icon size (16pt)
    public static let rowIconSize: CGFloat = 16

    /// Row chevron size (12pt)
    public static let rowChevronSize: CGFloat = 12

    // MARK: - Interaction Overlays

    /// Hover overlay opacity in light mode (0.4)
    public static let hoverOverlayOpacityLight: Double = 0.4

    /// Hover overlay opacity in dark mode (0.35)
    public static let hoverOverlayOpacityDark: Double = 0.35

    /// Pressed overlay opacity in light mode (0.5)
    public static let pressedOverlayOpacityLight: Double = 0.5

    /// Pressed overlay opacity in dark mode (0.45)
    public static let pressedOverlayOpacityDark: Double = 0.45

    // MARK: - Spacing

    /// Standard macOS message spacing (12pt)
    public static let messageSpacing: CGFloat = 12

    /// Standard macOS section spacing (20pt)
    public static let sectionSpacing: CGFloat = 20

    /// Standard macOS container padding (16pt)
    public static let containerPadding: CGFloat = 16
}
