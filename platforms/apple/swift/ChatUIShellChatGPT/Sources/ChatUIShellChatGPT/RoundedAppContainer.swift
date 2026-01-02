import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Container that clips content to ChatGPT app corner radius with border and shadow.
public struct RoundedAppContainer<Content: View>: View {
    @ViewBuilder let content: () -> Content
    private let useGlassBackground: Bool
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme
    
    /// Creates a rounded container for a full app shell.
    /// - Parameters:
    ///   - useGlassBackground: Whether to render the glass background when available.
    ///   - content: The content to wrap.
    public init(
        useGlassBackground: Bool = true,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.content = content
        self.useGlassBackground = useGlassBackground
    }
    
    public var body: some View {
        ZStack {
            if useGlassBackground
                && theme.surfaceStyle == .glass
                && !FAccessibility.prefersReducedTransparency
                && !FAccessibility.prefersHighContrast {
                GlassBackgroundView(role: .chrome, cornerRadius: theme.appCornerRadius)
            }
            content()
        }
        .clipShape(RoundedRectangle(cornerRadius: theme.appCornerRadius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: theme.appCornerRadius, style: .continuous)
                .stroke(
                    FColor.divider.opacity(
                        scheme == .dark ? theme.appBorderOpacityDark : theme.appBorderOpacityLight
                    ),
                    lineWidth: 1
                )
        )
        .shadow(
            color: Color.black.opacity(theme.appShadowOpacity),
            radius: theme.appShadowRadius,
            x: 0,
            y: theme.appShadowYOffset
        )
    }
}
