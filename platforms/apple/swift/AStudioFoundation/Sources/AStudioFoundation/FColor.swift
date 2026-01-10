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

    /// Foreground color for text on accent-colored backgrounds
    public static let accentForeground = DesignTokens.Colors.Accent.foreground

    // MARK: - Interactive

    /// Focus ring color for keyboard navigation
    public static let ring = DesignTokens.Colors.Interactive.ring

    // MARK: - Dividers/Borders

    /// Divider and border color
    public static let divider = Color("foundation-divider", bundle: .module)
}

#if DEBUG
/// Previews for design tokens showing all available colors in both light and dark modes
@available(macOS 14.0, *)
struct FColor_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            // Light Mode
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Surfaces")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "App", color: FColor.bgApp)
                        ColorSwatch(name: "Card", color: FColor.bgCard)
                        ColorSwatch(name: "Card Alt", color: FColor.bgCardAlt)
                    }

                    Text("Text")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "Primary", color: FColor.textPrimary)
                        ColorSwatch(name: "Secondary", color: FColor.textSecondary)
                        ColorSwatch(name: "Tertiary", color: FColor.textTertiary)
                    }

                    Text("Icons")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "Primary", color: FColor.iconPrimary)
                        ColorSwatch(name: "Secondary", color: FColor.iconSecondary)
                        ColorSwatch(name: "Tertiary", color: FColor.iconTertiary)
                    }

                    Text("Accents")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "Green", color: FColor.accentGreen)
                        ColorSwatch(name: "Blue", color: FColor.accentBlue)
                        ColorSwatch(name: "Orange", color: FColor.accentOrange)
                        ColorSwatch(name: "Red", color: FColor.accentRed)
                        ColorSwatch(name: "Purple", color: FColor.accentPurple)
                    }

                    Text("Interactive")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "Ring", color: FColor.ring)
                        ColorSwatch(name: "Divider", color: FColor.divider)
                    }
                }
                .padding()
            }
            .preferredColorScheme(.light)
            .previewDisplayName("Light Mode")

            // Dark Mode
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Surfaces")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "App", color: FColor.bgApp)
                        ColorSwatch(name: "Card", color: FColor.bgCard)
                        ColorSwatch(name: "Card Alt", color: FColor.bgCardAlt)
                    }

                    Text("Text")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "Primary", color: FColor.textPrimary)
                        ColorSwatch(name: "Secondary", color: FColor.textSecondary)
                        ColorSwatch(name: "Tertiary", color: FColor.textTertiary)
                    }

                    Text("Icons")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "Primary", color: FColor.iconPrimary)
                        ColorSwatch(name: "Secondary", color: FColor.iconSecondary)
                        ColorSwatch(name: "Tertiary", color: FColor.iconTertiary)
                    }

                    Text("Accents")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "Green", color: FColor.accentGreen)
                        ColorSwatch(name: "Blue", color: FColor.accentBlue)
                        ColorSwatch(name: "Orange", color: FColor.accentOrange)
                        ColorSwatch(name: "Red", color: FColor.accentRed)
                        ColorSwatch(name: "Purple", color: FColor.accentPurple)
                    }

                    Text("Interactive")
                        .font(.title2)
                        .fontWeight(.bold)
                    HStack(spacing: 12) {
                        ColorSwatch(name: "Ring", color: FColor.ring)
                        ColorSwatch(name: "Divider", color: FColor.divider)
                    }
                }
                .padding()
            }
            .preferredColorScheme(.dark)
            .previewDisplayName("Dark Mode")
        }
    }
}

/// Helper view for displaying color swatches in previews
@available(macOS 14.0, *)
private struct ColorSwatch: View {
    let name: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: 8)
                .fill(color)
                .frame(width: 60, height: 60)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.black.opacity(0.1), lineWidth: 1)
                )

            Text(name)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}
#endif