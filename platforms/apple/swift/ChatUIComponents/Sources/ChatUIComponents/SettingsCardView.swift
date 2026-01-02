import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders a rounded container for grouping settings.
///
/// ### Discussion
/// Uses theme-provided corner radii and border opacities.
///
/// - Example:
/// ```swift
/// SettingsCardView { SettingRowView(title: "General") }
/// ```
public struct SettingsCardView<Content: View>: View {
    private let content: Content
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme
    
    /// Creates a settings card view.
    ///
    /// - Parameter content: Content builder.
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    /// The content and behavior of this view.
    public var body: some View {
        VStack(spacing: 0) {
            content
        }
        .background(cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous)
                .stroke(
                    FColor.divider.opacity(
                        scheme == .dark ? theme.cardBorderOpacityDark : theme.cardBorderOpacityLight
                    ),
                    lineWidth: 1
                )
        )
    }

    private var cardBackground: some View {
        FColor.bgCard
            .opacity(scheme == .dark ? theme.cardBackgroundOpacityDark : theme.cardBackgroundOpacityLight)
    }
}
