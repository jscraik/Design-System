import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders the header-only template demo.
public struct ChatHeaderTemplateView: View {
    @State private var isSidebarOpen = true
    @State private var viewMode: ChatHeaderViewMode = .chat
    @State private var selectedModel = "ChatGPT 5.2 Pro"

    private let models = [
        "ChatGPT 5.2 Pro",
        "GPT-5.2 Codex Medium",
        "GPT-5.2 Codex Large"
    ]

    /// Creates a header-only template demo view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        ChatHeaderBlockView(
            isSidebarOpen: $isSidebarOpen,
            viewMode: $viewMode,
            selectedModel: $selectedModel,
            models: models
        )
    }
}

/// Renders the sidebar-only template demo.
public struct ChatSidebarTemplateView: View {
    @State private var selectedID: UUID? = nil

    private let items = [
        ChatSidebarItem(title: "New chat", systemIcon: "bubble.left"),
        ChatSidebarItem(title: "Design review", systemIcon: "paintbrush"),
        ChatSidebarItem(title: "Template audit", systemIcon: "doc.text"),
        ChatSidebarItem(title: "Widget polish", systemIcon: "sparkles")
    ]

    /// Creates a sidebar-only template demo view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        ChatSidebarBlockView(
            title: "Chat",
            items: items,
            selectedItemID: $selectedID
        )
        .frame(minWidth: 260, maxWidth: 320, maxHeight: .infinity)
        .background(FColor.bgApp)
    }
}

/// Renders the messages-only template demo.
public struct ChatMessagesTemplateView: View {
    private let messages = [
        ChatMessageItem(role: .assistant, content: "Welcome back!"),
        ChatMessageItem(role: .user, content: "Show me the message list template."),
        ChatMessageItem(role: .assistant, content: "Here’s a reusable message list block.")
    ]

    /// Creates a messages-only template demo view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        ChatMessagesBlockView(messages: messages)
    }
}

/// Renders the composer-only template demo.
public struct ChatInputTemplateView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var text = ""
    @State private var isProcessing = false

    /// Creates a composer-only template demo view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        ChatInputBlockView(text: $text, isProcessing: isProcessing) {
            guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
            isProcessing = true
            text = ""

            let delay = reduceMotion ? 0.0 : 0.4
            if delay == 0.0 {
                isProcessing = false
            } else {
                DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                    isProcessing = false
                }
            }
        }
    }
}

// MARK: - SwiftUI Previews
// Note: Previews work in Xcode but cannot be compiled via Swift Package Manager command line
// This is expected behavior - open this file in Xcode to see the previews

/*
#Preview("Chat Header Template") {
    ChatHeaderTemplateView()
        .frame(width: 720, height: 120)
}

#Preview("Chat Sidebar Template") {
    ChatSidebarTemplateView()
        .frame(width: 320, height: 680)
}

#Preview("Chat Messages Template") {
    ChatMessagesTemplateView()
        .frame(width: 720, height: 560)
}

#Preview("Chat Input Template") {
    ChatInputTemplateView()
        .frame(width: 720, height: 140)
}
*/
