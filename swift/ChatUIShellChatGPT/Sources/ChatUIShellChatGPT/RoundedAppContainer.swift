import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Container that clips content to ChatGPT app corner radius with border and shadow
public struct RoundedAppContainer<Content: View>: View {
    @ViewBuilder let content: () -> Content
    private let useGlassBackground: Bool
    
    public init(
        useGlassBackground: Bool = true,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.content = content
        self.useGlassBackground = useGlassBackground
    }
    
    public var body: some View {
        ZStack {
            if useGlassBackground {
                GlassBackgroundView(role: .chrome, cornerRadius: ChatGPTTheme.appCornerRadius)
            }
            content()
        }
            .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.appCornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: ChatGPTTheme.appCornerRadius, style: .continuous)
                    .stroke(FColor.divider.opacity(0.2), lineWidth: 1)
            )
            .shadow(
                color: Color.black.opacity(ChatGPTTheme.appShadowOpacity),
                radius: ChatGPTTheme.appShadowRadius,
                x: 0,
                y: ChatGPTTheme.appShadowYOffset
            )
    }
}
