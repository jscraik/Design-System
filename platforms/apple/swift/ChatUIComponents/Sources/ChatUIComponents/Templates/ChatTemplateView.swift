import Foundation
import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders the full chat template with message list and composer.
public struct ChatTemplateView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var messages: [ChatMessageItem]
    @State private var inputText = ""
    @State private var isProcessing = false

    /// Creates a chat template view.
    /// - Parameter messages: Initial message list to display.
    public init(messages: [ChatMessageItem] = ChatTemplateView.sampleMessages) {
        _messages = State(initialValue: messages)
    }

    /// The content and behavior of this view.
    public var body: some View {
        VStack(spacing: 0) {
            if messages.isEmpty {
                EmptyChatTemplateView()
            } else {
                ChatMessagesBlockView(messages: messages)
            }

            if isProcessing {
                ProcessingIndicator()
            }

            ChatInputBlockView(
                text: $inputText,
                isProcessing: isProcessing,
                onSend: sendMessage
            )
        }
        .background(FColor.bgApp)
    }

    private func sendMessage() {
        let trimmed = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        messages.append(ChatMessageItem(role: .user, content: trimmed))
        inputText = ""
        isProcessing = true

        let delay = reduceMotion ? 0.0 : 0.4
        if delay == 0.0 {
            messages.append(
                ChatMessageItem(role: .assistant, content: "Thanks! Want to explore a template next?")
            )
            isProcessing = false
        } else {
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                messages.append(
                    ChatMessageItem(role: .assistant, content: "Thanks! Want to explore a template next?")
                )
                isProcessing = false
            }
        }
    }

    /// Sample messages for previews and template demos.
    public static let sampleMessages: [ChatMessageItem] = [
        ChatMessageItem(role: .assistant, content: "Welcome back! How can I help?"),
        ChatMessageItem(role: .user, content: "Show me the chat template layout."),
        ChatMessageItem(role: .assistant, content: "This is a reusable chat shell with messages and input."),
    ]
}

private struct EmptyChatTemplateView: View {
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            Image(systemName: "bubble.left.and.bubble.right")
                .font(.system(size: 48))
                .foregroundStyle(FColor.iconTertiary)
                .accessibilityHidden(true)

            Text("Start a conversation")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)

            Text("Type a message below to begin")
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

private struct ProcessingIndicator: View {
    var body: some View {
        HStack(spacing: FSpacing.s8) {
            ProgressView()
                .scaleEffect(0.8)

            Text("Processing...")
                .font(FType.caption())
                .foregroundStyle(FColor.textTertiary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - SwiftUI Previews
// Note: Previews work in Xcode but cannot be compiled via Swift Package Manager command line.
// This is expected behavior - open this file in Xcode to see the previews.

/*
#Preview("Chat Template - Light") {
    ChatTemplateView()
        .frame(width: 900, height: 700)
        .environment(\.colorScheme, .light)
}

#Preview("Chat Template - Dark") {
    ChatTemplateView()
        .frame(width: 900, height: 700)
        .environment(\.colorScheme, .dark)
}

#Preview("Chat Template - Empty State") {
    ChatTemplateView(messages: [])
        .frame(width: 900, height: 700)
        .environment(\.colorScheme, .dark)
}
*/
