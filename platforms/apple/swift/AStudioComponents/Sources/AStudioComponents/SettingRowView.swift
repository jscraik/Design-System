import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Trailing content options for `SettingRowView`.
public enum SettingTrailing {
    case none
    case chevron
    case text(String)
    case custom(AnyView)
}

/// Core primitive for settings rows with optional icon, title, subtitle, and trailing content.
///
/// ### Discussion
/// Use `SettingRowView` to render settings lists with consistent spacing and hover states.
///
/// - Example:
/// ```swift
/// SettingRowView(title: "Notifications", trailing: .chevron)
/// ```
public struct SettingRowView: View {
    private let icon: AnyView?
    private let title: String
    private let subtitle: String?
    private let trailing: SettingTrailing
    private let action: (() -> Void)?

    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme
    @State private var isHovering = false
    @State private var isPressed = false

    /// Creates a settings row view.
    ///
    /// - Parameters:
    ///   - icon: Optional leading icon view.
    ///   - title: Primary title text.
    ///   - subtitle: Optional subtitle text.
    ///   - trailing: Trailing content configuration.
    ///   - action: Optional action when tapped.
    public init(
        icon: AnyView? = nil,
        title: String,
        subtitle: String? = nil,
        trailing: SettingTrailing = .none,
        action: (() -> Void)? = nil
    ) {
        self.icon = icon
        self.title = title
        self.subtitle = subtitle
        self.trailing = trailing
        self.action = action
    }

    /// The content and behavior of this view.
    public var body: some View {
        Group {
            if let action {
                Button(action: action) {
                    rowContent
                }
                .buttonStyle(.plain)
                .simultaneousGesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { _ in
                            isPressed = true
                        }
                        .onEnded { _ in
                            isPressed = false
                        }
                )
            } else {
                rowContent
            }
        }
        .onHover { isHovering in
            if Platform.isMac {
                self.isHovering = isHovering
            }
        }
        .background(rowBackground)
        .clipShape(RoundedRectangle(cornerRadius: theme.rowCornerRadius, style: .continuous))
        .padding(.horizontal, FSpacing.s4) // "inset hover" appearance
    }

    private var rowContent: some View {
        HStack(spacing: FSpacing.s12) {
            if let icon {
                icon
                    .frame(width: theme.rowIconSize, height: theme.rowIconSize)
                    .foregroundStyle(FColor.iconSecondary)
                    .accessibilityHidden(true)
            }

            VStack(alignment: .leading, spacing: FSpacing.s2) {
                Text(title)
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textPrimary)
                    .tracking(FType.trackingRow())

                if let subtitle {
                    Text(subtitle)
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                        .tracking(FType.trackingCaption())
                }
            }

            Spacer(minLength: 10)

            trailingView
        }
        .padding(.horizontal, theme.rowHPadding)
        .padding(.vertical, theme.rowVPadding)
        .contentShape(Rectangle())
        .accessibilityElement(children: shouldCombineAccessibility ? .combine : .contain)
    }

    @ViewBuilder
    private var trailingView: some View {
        switch trailing {
        case .none:
            EmptyView()
        case .chevron:
            Image(systemName: "chevron.right")
                .font(.system(size: theme.rowChevronSize, weight: .semibold))
                .foregroundStyle(FColor.iconTertiary)
                .accessibilityHidden(true)
        case .text(let value):
            Text(value)
                .font(FType.rowValue())
                .foregroundStyle(FColor.textSecondary)
                .tracking(FType.trackingRow())
        case .custom(let view):
            view
        }
    }

    private var rowBackground: some View {
        Group {
            if isPressed {
                RoundedRectangle(cornerRadius: theme.rowCornerRadius, style: .continuous)
                    .fill(FColor.bgCardAlt)
                    .opacity(scheme == .dark ? theme.pressedOverlayOpacityDark : theme.pressedOverlayOpacityLight)
            } else if Platform.isMac && isHovering {
                RoundedRectangle(cornerRadius: theme.rowCornerRadius, style: .continuous)
                    .fill(FColor.bgCardAlt)
                    .opacity(scheme == .dark ? theme.hoverOverlayOpacityDark : theme.hoverOverlayOpacityLight)
            } else {
                Color.clear
            }
        }
    }

    private var shouldCombineAccessibility: Bool {
        switch trailing {
        case .custom:
            return false
        case .none, .chevron, .text:
            return true
        }
    }
}

#if DEBUG
/// Previews for SettingRowView demonstrating different configurations
@available(macOS 14.0, *)
struct SettingRowView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            // Basic row
            VStack(alignment: .leading, spacing: 8) {
                Text("Basic Row")
                    .font(.headline)
                SettingRowView(title: "Simple Row")
            }
            .padding()
            .previewDisplayName("Basic")

            // Row with icon
            VStack(alignment: .leading, spacing: 8) {
                Text("Row with Icon")
                    .font(.headline)
                SettingRowView(
                    icon: AnyView(Image(systemName: "gearshape").foregroundStyle(FColor.accentBlue)),
                    title: "Settings"
                )
            }
            .padding()
            .previewDisplayName("With Icon")

            // Row with subtitle
            VStack(alignment: .leading, spacing: 8) {
                Text("Row with Subtitle")
                    .font(.headline)
                SettingRowView(
                    title: "Notifications",
                    subtitle: "Enable push notifications"
                )
            }
            .padding()
            .previewDisplayName("With Subtitle")

            // Row with trailing text
            VStack(alignment: .leading, spacing: 8) {
                Text("Row with Trailing Text")
                    .font(.headline)
                SettingRowView(
                    title: "Storage",
                    trailing: .text("75% used")
                )
            }
            .padding()
            .previewDisplayName("Trailing Text")

            // Row with chevron
            VStack(alignment: .leading, spacing: 8) {
                Text("Row with Chevron")
                    .font(.headline)
                SettingRowView(
                    title: "Advanced",
                    trailing: .chevron
                )
            }
            .padding()
            .previewDisplayName("With Chevron")

            // Clickable row
            VStack(alignment: .leading, spacing: 8) {
                Text("Clickable Row")
                    .font(.headline)
                SettingRowView(
                    icon: AnyView(Image(systemName: "arrow.turn.up.right").foregroundStyle(FColor.accentGreen)),
                    title: "Export Data",
                    action: { print("Export clicked") }
                )
            }
            .padding()
            .previewDisplayName("Clickable")

            // Complete card
            VStack(alignment: .leading, spacing: 16) {
                Text("Settings Card")
                    .font(.title2)
                    .fontWeight(.bold)

                VStack(spacing: 0) {
                    SettingRowView(
                        icon: AnyView(Image(systemName: "bell").foregroundStyle(FColor.accentBlue)),
                        title: "Notifications",
                        trailing: .chevron
                    )
                    Divider()
                    SettingRowView(
                        icon: AnyView(Image(systemName: "lock").foregroundStyle(FColor.accentOrange)),
                        title: "Privacy",
                        trailing: .chevron
                    )
                    Divider()
                    SettingRowView(
                        icon: AnyView(Image(systemName: "paintbrush").foregroundStyle(FColor.accentPurple)),
                        title: "Appearance",
                        subtitle: "Theme and colors"
                    )
                }
                .background(FColor.bgCard)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .padding()
            .previewDisplayName("Complete Card")
        }
    }
}
#endif
