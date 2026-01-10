import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders an action button for the compose toolbar.
///
/// - Example:
/// ```swift
/// ComposeActionButton(title: "Run", systemName: "play.circle", style: .secondary) {}
/// ```
public struct ComposeActionButton: View {
    /// Visual styles for `ComposeActionButton`.
    public enum Style {
        case secondary
        case ghost
    }

    @Environment(\.chatUITheme) private var theme
    @Environment(\.colorScheme) private var scheme

    let title: String
    let systemName: String
    let style: Style
    let action: () -> Void

    /// Creates a compose action button.
    ///
    /// - Parameters:
    ///   - title: Button title text.
    ///   - systemName: SF Symbol name for the icon.
    ///   - style: Visual style for the button (default: `.secondary`).
    ///   - action: Action invoked on tap.
    public init(title: String, systemName: String, style: Style = .secondary, action: @escaping () -> Void) {
        self.title = title
        self.systemName = systemName
        self.style = style
        self.action = action
    }

    /// The content and behavior of this view.
    public var body: some View {
        Button(action: action) {
            HStack(spacing: FSpacing.s8) {
                Image(systemName: systemName)
                    .font(.system(size: 12, weight: .semibold))
                Text(title)
                    .font(FType.caption())
            }
            .padding(.vertical, FSpacing.s4)
            .padding(.horizontal, FSpacing.s12)
        }
        .buttonStyle(.plain)
        .foregroundStyle(foregroundColor)
        .background(background)
        .clipShape(RoundedRectangle(cornerRadius: theme.buttonCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: theme.buttonCornerRadius)
                .stroke(borderColor, lineWidth: borderWidth)
        )
        .accessibilityLabel(Text(title))
    }

    private var background: Color {
        switch style {
        case .secondary:
            return FColor.bgCard
        case .ghost:
            return FColor.bgCardAlt
        }
    }

    private var foregroundColor: Color {
        switch style {
        case .secondary:
            return FColor.textPrimary
        case .ghost:
            return FColor.textTertiary
        }
    }

    private var borderWidth: CGFloat {
        switch style {
        case .secondary:
            return 1
        case .ghost:
            return 0
        }
    }

    private var borderColor: Color {
        FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight)
    }
}
