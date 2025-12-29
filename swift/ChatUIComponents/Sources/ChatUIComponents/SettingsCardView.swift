import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// A rounded container with ChatGPT-style background and border for grouping settings
public struct SettingsCardView<Content: View>: View {
    private let content: Content
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
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
