import SwiftUI

public extension View {
    /// Applies a platform-appropriate tooltip or accessibility hint.
    ///
    /// - Parameter text: Tooltip text to show or announce.
    @ViewBuilder
    func chatUITooltip(_ text: String?) -> some View {
        if let text, !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            #if os(macOS)
            self.help(text)
            #else
            self.accessibilityHint(Text(text))
            #endif
        } else {
            self
        }
    }
}
