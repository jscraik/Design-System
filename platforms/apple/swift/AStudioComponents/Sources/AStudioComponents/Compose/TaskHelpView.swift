import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders help popover content for compose tasks.
///
/// - Example:
/// ```swift
/// TaskHelpView(content: "Describe your task here.")
/// ```
public struct TaskHelpView: View {
    let content: String

    /// Creates a task help view.
    ///
    /// - Parameter content: Help text to display.
    public init(content: String) {
        self.content = content
    }

    /// The content and behavior of this view.
    public var body: some View {
        Text(content)
            .font(FType.rowTitle())
            .foregroundStyle(FColor.textPrimary)
            .padding(FSpacing.s16)
            .frame(maxWidth: 320, alignment: .leading)
    }
}
