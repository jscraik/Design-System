import SwiftUI

/// ChatGPT theme with pixel-perfect constants matching the web application
public enum ChatGPTTheme {
    
    // MARK: - Corner Radii
    
    /// App-level corner radius (18pt)
    public static let appCornerRadius: CGFloat = 18
    
    /// Card corner radius (12pt)
    public static let cardCornerRadius: CGFloat = 12
    
    /// Row corner radius (10pt)
    public static let rowCornerRadius: CGFloat = 10
    
    /// Pill corner radius (999pt for fully rounded)
    public static let pillCornerRadius: CGFloat = 999
    
    // MARK: - Shadows
    
    /// App shadow opacity (0.45)
    public static let appShadowOpacity: Double = 0.45
    
    /// App shadow radius (30pt)
    public static let appShadowRadius: CGFloat = 30
    
    /// App shadow Y offset (18pt)
    public static let appShadowYOffset: CGFloat = 18
    
    // MARK: - Border Opacities
    
    /// Card border opacity in light mode (0.35)
    public static let cardBorderOpacityLight: Double = 0.35
    
    /// Card border opacity in dark mode (0.20)
    public static let cardBorderOpacityDark: Double = 0.20
    
    /// Divider opacity in light mode (0.35)
    public static let dividerOpacityLight: Double = 0.35
    
    /// Divider opacity in dark mode (0.25)
    public static let dividerOpacityDark: Double = 0.25
    
    // MARK: - Row Metrics
    
    /// Row horizontal padding (12pt)
    public static let rowHPadding: CGFloat = 12
    
    /// Row vertical padding (10pt)
    public static let rowVPadding: CGFloat = 10
    
    /// Row icon size (18pt)
    public static let rowIconSize: CGFloat = 18
    
    /// Row chevron size (14pt)
    public static let rowChevronSize: CGFloat = 14
    
    // MARK: - Interaction Overlays
    
    /// Hover overlay opacity in light mode (0.55)
    public static let hoverOverlayOpacityLight: Double = 0.55
    
    /// Hover overlay opacity in dark mode (0.55)
    public static let hoverOverlayOpacityDark: Double = 0.55
    
    /// Pressed overlay opacity in light mode (0.70)
    public static let pressedOverlayOpacityLight: Double = 0.70
    
    /// Pressed overlay opacity in dark mode (0.70)
    public static let pressedOverlayOpacityDark: Double = 0.70
}