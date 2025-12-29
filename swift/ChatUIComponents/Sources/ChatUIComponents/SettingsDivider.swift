import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// A 1pt height divider for separating settings rows
public struct SettingsDivider: View {
    @Environment(\.colorScheme) private var scheme
    
    public init() {}
    
    public var body: some View {
        Rectangle()
            .fill(FColor.divider)
            .opacity(scheme == .dark ? ChatGPTTheme.dividerOpacityDark : ChatGPTTheme.dividerOpacityLight)
            .frame(height: 1)
    }
}