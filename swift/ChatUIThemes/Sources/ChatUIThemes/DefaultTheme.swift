import SwiftUI

/// Default theme with native macOS styling as alternative to ChatGPT theme
public enum DefaultTheme {
    
    // MARK: - Corner Radii
    
    /// Card corner radius (8pt) - native macOS style
    public static let cardRadius: CGFloat = 8
    
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
    
    // MARK: - Materials
    
    /// Sidebar material for native macOS feel
    public static let sidebarMaterial = Material.regularMaterial
    
    /// Background material for native macOS feel
    public static let backgroundMaterial = Material.regularMaterial
    
    // MARK: - Spacing
    
    /// Standard macOS message spacing (12pt)
    public static let messageSpacing: CGFloat = 12
    
    /// Standard macOS section spacing (20pt)
    public static let sectionSpacing: CGFloat = 20
    
    /// Standard macOS container padding (16pt)
    public static let containerPadding: CGFloat = 16
}