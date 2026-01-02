import Foundation
import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIMCP

/// Main chat experience powered by MCP tools.
struct ChatView: View {
    let mcpClient: MCPClient?
    
    @State private var messages: [ChatMessage] = []
    @State private var inputText = ""
    @State private var isProcessing = false
    @State private var errorMessage: String?

    private var canSendMessage: Bool {
        !inputText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isProcessing
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Messages
            ScrollView {
                LazyVStack(spacing: FSpacing.s16) {
                    if messages.isEmpty {
                        EmptyStateView()
                    } else {
                        ForEach(messages) { message in
                            MessageRow(message: message)
                        }
                    }
                    
                    if isProcessing {
                        ProcessingIndicator()
                    }
                    
                    if let error = errorMessage {
                        ErrorMessageView(message: error)
                    }
                }
                .padding(FSpacing.s16)
            }
            
            SettingsDivider()
            
            // Input
            ChatInputView(
                text: $inputText,
                isProcessing: isProcessing,
                onSend: sendMessage
            )
        }
        .navigationTitle("Chat")
        .navigationSubtitle("Powered by MCP Tools")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button(action: {}) {
                    Image(systemName: "ellipsis.circle")
                        .foregroundStyle(FColor.iconSecondary)
                }
                .accessibilityLabel("More options")
                .accessibilityHint("Chat actions and settings")
            }
        }
    }
    
    private func sendMessage() {
        let trimmedMessage = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedMessage.isEmpty else { return }
        guard let client = mcpClient else {
            errorMessage = "MCP client unavailable"
            return
        }
        
        let userMessage = ChatMessage(role: .user, content: trimmedMessage)
        messages.append(userMessage)
        
        let messageText = trimmedMessage
        inputText = ""
        isProcessing = true
        errorMessage = nil
        
        Task {
            do {
                // Example: Call a display tool
                let response = try await client.callTool(
                    name: "display_chat",
                    arguments: ["message": messageText]
                )
                
                await MainActor.run {
                    if let result = response.result {
                        let assistantMessage = ChatMessage(
                            role: .assistant,
                            content: "Received response",
                            widgetData: extractWidgetData(from: result)
                        )
                        messages.append(assistantMessage)
                    }
                    isProcessing = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isProcessing = false
                }
            }
        }
    }
    
    private func extractWidgetData(from result: MCPToolCallResult) -> WidgetData? {
        // Check if structured content can be converted to WidgetData
        if result.structuredContent != nil {
            // Try to extract widget data from structured content
            do {
                let data = try JSONEncoder().encode(result.structuredContent)
                return try JSONDecoder().decode(WidgetData.self, from: data)
            } catch {
                return nil
            }
        }
        return nil
    }
}

// MARK: - Chat Message Model

/// Chat message model used by the macOS app.
struct ChatMessage: Identifiable {
    let id = UUID()
    let role: Role
    let content: String
    let widgetData: WidgetData?
    
    /// Author role for a chat message.
    enum Role {
        case user
        case assistant
    }
    
    /// Creates a chat message.
    /// - Parameters:
    ///   - role: Message author role.
    ///   - content: The message content.
    ///   - widgetData: Optional widget payload to render.
    init(role: Role, content: String, widgetData: WidgetData? = nil) {
        self.role = role
        self.content = content
        self.widgetData = widgetData
    }
}

// MARK: - Subviews

/// Empty state shown when no messages exist.
struct EmptyStateView: View {
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

/// Renders a single chat message row.
struct MessageRow: View {
    let message: ChatMessage
    
    var body: some View {
        HStack(alignment: .top, spacing: FSpacing.s12) {
            // Avatar
            Circle()
                .fill(message.role == .user ? FColor.accentBlue : FColor.accentGreen)
                .frame(width: 32, height: 32)
                .overlay(
                    Image(systemName: message.role == .user ? "person.fill" : "sparkles")
                        .font(.system(size: 14))
                        .foregroundStyle(.white)
                        .accessibilityHidden(true)
                )
            
            // Content
            VStack(alignment: .leading, spacing: FSpacing.s8) {
                VStack(alignment: .leading, spacing: FSpacing.s8) {
                    Text(message.role == .user ? "You" : "Assistant")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                    
                    Text(message.content)
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textSecondary)
                        .textSelection(.enabled)
                }
                .accessibilityElement(children: .combine)
                
                // Widget if present
                if let widgetData = message.widgetData {
                    WidgetRenderer(widgetData: widgetData)
                        .padding(.top, FSpacing.s8)
                }
            }
            
            Spacer()
        }
    }
}

/// Indicates that a response is being processed.
struct ProcessingIndicator: View {
    var body: some View {
        HStack(spacing: FSpacing.s8) {
            ProgressView()
                .scaleEffect(0.8)
            
            Text("Processing...")
                .font(FType.caption())
                .foregroundStyle(FColor.textTertiary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Processing")
    }
}

/// Error banner shown in the message list.
struct ErrorMessageView: View {
    let message: String
    @Environment(\.chatUITheme) private var theme
    
    var body: some View {
        HStack(spacing: FSpacing.s12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(FColor.accentRed)
                .accessibilityHidden(true)
            
            Text(message)
                .font(FType.caption())
                .foregroundStyle(FColor.textSecondary)
        }
        .padding(FSpacing.s12)
        .background(FColor.accentRed.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: theme.cardCornerRadius))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Error: \(message)")
    }
}

/// Input bar for composing a message.
struct ChatInputView: View {
    @Binding var text: String
    let isProcessing: Bool
    let onSend: () -> Void

    private var canSendMessage: Bool {
        !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isProcessing
    }
    
    var body: some View {
        HStack(spacing: FSpacing.s12) {
            InputView(
                text: $text,
                placeholder: "Type a message...",
                variant: .default,
                submitLabel: .send
            ) {
                onSend()
            }
            .disabled(isProcessing)
            
            ChatUIButton(
                systemName: "arrow.up",
                variant: .default,
                size: .icon,
                isDisabled: !canSendMessage,
                accessibilityLabel: "Send"
            ) {
                onSend()
            }
        }
        .padding(FSpacing.s16)
    }
}

// Preview support requires Xcode
// Open Package.swift in Xcode to view previews

/*
#Preview("ChatView - Empty") {
    ChatView(mcpClient: nil)
        .frame(width: 800, height: 600)
}

#Preview("ChatView - With Messages") {
    let view = ChatView(mcpClient: nil)
    view.messages = [
        ChatMessage(role: .user, content: "Hello, how are you?"),
        ChatMessage(role: .assistant, content: "I'm doing well, thank you! How can I help you today?")
    ]
    view
        .frame(width: 800, height: 600)
}
*/
