import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes
import ChatUIMCP

struct ChatView: View {
    let mcpClient: MCPClient?
    
    @State private var messages: [ChatMessage] = []
    @State private var inputText = ""
    @State private var isProcessing = false
    @State private var errorMessage: String?
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            ChatHeaderView()
            
            SettingsDivider()
            
            // Messages
            ScrollView {
                VStack(spacing: FSpacing.s16) {
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
    }
    
    private func sendMessage() {
        guard !inputText.isEmpty, let client = mcpClient else { return }
        
        let userMessage = ChatMessage(role: .user, content: inputText)
        messages.append(userMessage)
        
        let messageText = inputText
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
        if let structured = result.structuredContent {
            // Try to extract widget data from structured content
            // This is a simplified implementation - real implementation would parse the structure
            return nil
        }
        return nil
    }
}

// MARK: - Chat Message Model

struct ChatMessage: Identifiable {
    let id = UUID()
    let role: Role
    let content: String
    let widgetData: WidgetData?
    
    enum Role {
        case user
        case assistant
    }
    
    init(role: Role, content: String, widgetData: WidgetData? = nil) {
        self.role = role
        self.content = content
        self.widgetData = widgetData
    }
}

// MARK: - Subviews

struct ChatHeaderView: View {
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: FSpacing.s4) {
                Text("Chat")
                    .font(FType.title())
                    .foregroundStyle(FColor.textPrimary)
                
                Text("Powered by MCP Tools")
                    .font(FType.caption())
                    .foregroundStyle(FColor.textSecondary)
            }
            
            Spacer()
            
            Button(action: {}) {
                Image(systemName: "ellipsis.circle")
                    .font(.system(size: 18))
                    .foregroundStyle(FColor.iconSecondary)
            }
            .buttonStyle(.plain)
        }
        .padding(FSpacing.s16)
    }
}

struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            Image(systemName: "bubble.left.and.bubble.right")
                .font(.system(size: 48))
                .foregroundStyle(FColor.iconTertiary)
            
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
                )
            
            // Content
            VStack(alignment: .leading, spacing: FSpacing.s8) {
                Text(message.role == .user ? "You" : "Assistant")
                    .font(FType.sectionTitle())
                    .foregroundStyle(FColor.textPrimary)
                
                Text(message.content)
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textSecondary)
                
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
    }
}

struct ErrorMessageView: View {
    let message: String
    
    var body: some View {
        HStack(spacing: FSpacing.s12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(FColor.accentRed)
            
            Text(message)
                .font(FType.caption())
                .foregroundStyle(FColor.textSecondary)
        }
        .padding(FSpacing.s12)
        .background(FColor.accentRed.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius))
    }
}

struct ChatInputView: View {
    @Binding var text: String
    let isProcessing: Bool
    let onSend: () -> Void
    
    var body: some View {
        HStack(spacing: FSpacing.s12) {
            TextField("Type a message...", text: $text)
                .textFieldStyle(.plain)
                .font(FType.rowTitle())
                .padding(FSpacing.s12)
                .background(FColor.bgCard)
                .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius))
                .onSubmit(onSend)
                .disabled(isProcessing)
            
            Button(action: onSend) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.system(size: 28))
                    .foregroundStyle(text.isEmpty ? FColor.iconTertiary : FColor.accentBlue)
            }
            .buttonStyle(.plain)
            .disabled(text.isEmpty || isProcessing)
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
