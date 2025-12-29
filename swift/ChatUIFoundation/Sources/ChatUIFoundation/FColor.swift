import SwiftUI

/// Semantic color API using Asset Catalog with compile-time safety
/// All colors automatically support light/dark mode and high contrast through Asset Catalog
public enum FColor {
    
    // MARK: - Surfaces
    
    /// Window background color
    public static let bgApp = Color("foundation-bg-app", bundle: .module)
    
    /// Section card background color
    public static let bgCard = Color("foundation-bg-card", bundle: .module)
    
    /// Hover/pressed overlay base color
    public static let bgCardAlt = Color("foundation-bg-card-alt", bundle: .module)
    
    // MARK: - Text
    
    /// Primary text color for main content
    public static let textPrimary = Color("foundation-text-primary", bundle: .module)
    
    /// Secondary text color for supporting content
    public static let textSecondary = Color("foundation-text-secondary", bundle: .module)
    
    /// Tertiary text color for subtle content
    public static let textTertiary = Color("foundation-text-tertiary", bundle: .module)
    
    // MARK: - Icons
    
    /// Primary icon color for main icons
    public static let iconPrimary = Color("foundation-icon-primary", bundle: .module)
    
    /// Secondary icon color for supporting icons
    public static let iconSecondary = Color("foundation-icon-secondary", bundle: .module)
    
    /// Tertiary icon color for subtle icons
    public static let iconTertiary = Color("foundation-icon-tertiary", bundle: .module)
    
    // MARK: - Accents
    
    /// Green accent color for success states
    public static let accentGreen = Color("foundation-accent-green", bundle: .module)
    
    /// Blue accent color for primary actions
    public static let accentBlue = Color("foundation-accent-blue", bundle: .module)
    
    /// Orange accent color for warning states
    public static let accentOrange = Color("foundation-accent-orange", bundle: .module)
    
    /// Red accent color for error states
    public static let accentRed = Color("foundation-accent-red", bundle: .module)
    
    /// Purple accent color for special states
    public static let accentPurple = Color("foundation-accent-purple", bundle: .module)
    
    // MARK: - Dividers/Borders
    
    /// Divider and border color
    public static let divider = Color("foundation-divider", bundle: .module)
}