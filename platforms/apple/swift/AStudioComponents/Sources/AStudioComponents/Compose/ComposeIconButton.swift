import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders an icon button for the compose toolbar.
///
/// - Example:
/// ```swift
/// ComposeIconButton(systemName: "plus", label: "Add") {}
/// ```
public struct ComposeIconButton: View {
    @Environment(\.chatUITheme) private var theme

    /// Configuration for `ComposeIconButton`.
    public struct Config: Hashable {
        /// SF Symbol name for the icon.
        public let systemName: String
        /// Accessibility label for the icon button.
        public let label: String
        /// Whether the icon is shown as active.
        public let isActive: Bool

        /// Creates an icon button configuration.
        ///
        /// - Parameters:
        ///   - systemName: SF Symbol name.
        ///   - label: Accessibility label text.
        ///   - isActive: Whether the icon is active.
        public init(systemName: String, label: String, isActive: Bool) {
            self.systemName = systemName
            self.label = label
            self.isActive = isActive
        }
    }

    let config: Config
    let action: () -> Void

    /// Creates an icon button from a config object.
    ///
    /// - Parameters:
    ///   - config: Button configuration.
    ///   - action: Action invoked on tap.
    public init(config: Config, action: @escaping () -> Void) {
        self.config = config
        self.action = action
    }

    /// Creates an icon button with explicit values.
    ///
    /// - Parameters:
    ///   - systemName: SF Symbol name.
    ///   - label: Accessibility label text.
    ///   - isActive: Whether the icon is active (default: `false`).
    ///   - action: Action invoked on tap.
    public init(systemName: String, label: String, isActive: Bool = false, action: @escaping () -> Void) {
        self.config = Config(systemName: systemName, label: label, isActive: isActive)
        self.action = action
    }

    /// The content and behavior of this view.
    public var body: some View {
        Button(action: action) {
            ZStack(alignment: .topTrailing) {
                Image(systemName: config.systemName)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(config.isActive ? FColor.accentBlue : FColor.iconTertiary)

                if config.isActive {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundStyle(FColor.accentBlue)
                        .offset(x: 4, y: -4)
                }
            }
            .frame(width: 24, height: 24)
            .background(config.isActive ? FColor.accentBlue.opacity(0.12) : Color.clear)
            .clipShape(RoundedRectangle(cornerRadius: theme.buttonCornerRadius))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text(config.label))
    }
}
