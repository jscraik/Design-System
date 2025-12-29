import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// A 1pt height divider for separating settings rows
public struct SettingsDivider: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme
    
    public init() {}
    
    public var body: some View {
        Rectangle()
            .fill(FColor.divider)
            .opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight)
            .frame(height: 1)
    }
}
