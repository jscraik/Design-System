import SwiftUI
import ChatUIFoundation
import ChatUIThemes
#if os(macOS)
import AppKit
#endif

/// Glass-style background surface for macOS with reduced-transparency fallback.
public struct GlassBackgroundView: View {
    public enum Role {
        case sidebar
        case content
        case chrome
    }

    private let role: Role
    private let cornerRadius: CGFloat?
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme

    public init(role: Role, cornerRadius: CGFloat? = nil) {
        self.role = role
        self.cornerRadius = cornerRadius
    }

    public var body: some View {
        #if os(macOS)
        if FAccessibility.prefersReducedTransparency || theme.surfaceStyle == .solid {
            fallbackBackground
        } else {
            VisualEffectView(material: materialForRole, blendingMode: .behindWindow)
                .overlay(glassOverlay)
                .overlay(borderOverlay)
                .clipShape(clipShape)
        }
        #else
        fallbackBackground
        #endif
    }

    private var fallbackBackground: some View {
        FColor.bgApp
    }

    #if os(macOS)
    private var materialForRole: NSVisualEffectView.Material {
        switch role {
        case .sidebar:
            return .sidebar
        case .content:
            return .underWindowBackground
        case .chrome:
            return .windowBackground
        }
    }
    #endif

    private var borderOverlay: some View {
        RoundedRectangle(cornerRadius: cornerRadius ?? 0, style: .continuous)
            .stroke(
                FColor.divider.opacity(
                    scheme == .dark ? theme.appBorderOpacityDark : theme.appBorderOpacityLight
                ),
                lineWidth: cornerRadius == nil ? 0 : 1
            )
    }

    private var clipShape: some Shape {
        RoundedRectangle(cornerRadius: cornerRadius ?? 0, style: .continuous)
    }

    private var glassOverlay: some View {
        let highlight = scheme == .dark ? Color.white.opacity(0.06) : Color.white.opacity(0.18)
        let shadow = scheme == .dark ? Color.black.opacity(0.18) : Color.black.opacity(0.08)
        return LinearGradient(
            colors: [highlight, Color.clear, shadow],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .opacity(0.7)
    }
}
