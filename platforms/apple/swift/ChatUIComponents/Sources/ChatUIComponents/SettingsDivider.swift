import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders a 1pt divider for separating settings rows.
///
/// - Example:
/// ```swift
/// SettingsDivider()
/// ```
public struct SettingsDivider: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme
    
    /// Creates a settings divider.
    public init() {}
    
    /// The content and behavior of this view.
    public var body: some View {
        Rectangle()
            .fill(FColor.divider)
            .opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight)
            .frame(height: 1)
    }
}
