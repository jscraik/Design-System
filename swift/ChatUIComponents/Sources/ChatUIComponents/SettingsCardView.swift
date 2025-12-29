import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// A rounded container with ChatGPT-style background and border for grouping settings
public struct SettingsCardView<Content: View>: View {
    private let content: Content
    @Environment(\.colorScheme) private var scheme
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        VStack(spacing: 0) {
            content
        }
        .background(FColor.bgCard)
        .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous)
                .stroke(
                    FColor.divider.opacity(
                        scheme == .dark ? ChatGPTTheme.cardBorderOpacityDark : ChatGPTTheme.cardBorderOpacityLight
                    ),
                    lineWidth: 1
                )
        )
    }
}