import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders the chat template with selectable layout variants.
public struct ChatVariantsTemplateView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private enum Variant: String, CaseIterable, Identifiable {
        case splitSidebar = "Split Sidebar"
        case compact = "Compact"
        case contextRail = "Context Rail"

        var id: String { rawValue }
    }

    @State private var selectedVariant: Variant = .splitSidebar
    @State private var isSidebarOpen = true
    @State private var viewMode: ChatHeaderViewMode = .chat
    @State private var selectedModel = "ChatGPT 5.2 Pro"
    @State private var selectedThreadID: UUID? = nil
    @State private var messages: [ChatMessageItem]
    @State private var inputText = ""
    @State private var isProcessing = false

    private let models = [
        "ChatGPT 5.2 Pro",
        "GPT-5.2 Codex Medium",
        "GPT-5.2 Codex Large"
    ]

    private let sidebarItems = [
        ChatSidebarItem(title: "General", systemIcon: "bubble.left.and.bubble.right.fill"),
        ChatSidebarItem(title: "Design review", systemIcon: "paintbrush.fill"),
        ChatSidebarItem(title: "Template audit", systemIcon: "doc.text.fill")
    ]

    /// Creates a chat variants template view.
    /// - Parameter messages: Initial message list to display.
    public init(messages: [ChatMessageItem] = ChatTemplateView.sampleMessages) {
        _messages = State(initialValue: messages)
    }

    /// The content and behavior of this view.
    public var body: some View {
        VStack(spacing: 0) {
            TemplateHeaderBarView(
                title: "Chat Variants",
                trailing: AnyView(variantPicker)
            )

            Group {
                switch selectedVariant {
                case .splitSidebar:
                    ChatVariantSplitSidebar(
                        sidebar: { sidebarView },
                        header: { headerView },
                        messages: { messagesView },
                        composer: { composerView }
                    )
                case .compact:
                    ChatVariantCompact(
                        header: { headerView },
                        messages: { messagesView },
                        composer: { composerView }
                    )
                case .contextRail:
                    ChatVariantContextRail(
                        sidebar: { sidebarView },
                        header: { headerView },
                        messages: { messagesView },
                        composer: { composerView },
                        contextPanel: { contextPanelView }
                    )
                }
            }
            .animation(reduceMotion ? nil : .easeInOut(duration: 0.2), value: selectedVariant)
        }
        .background(FColor.bgApp)
    }

    private var variantPicker: some View {
        Picker("Chat variants", selection: $selectedVariant) {
            ForEach(Variant.allCases) { variant in
                Text(variant.rawValue).tag(variant)
            }
        }
        .pickerStyle(.segmented)
        .frame(maxWidth: 320)
        .accessibilityLabel("Chat variants")
    }

    @ViewBuilder
    private var sidebarView: some View {
        if isSidebarOpen {
            ChatSidebarBlockView(
                title: "Threads",
                items: sidebarItems,
                selectedItemID: $selectedThreadID
            )
            .frame(minWidth: 240, maxWidth: 300, maxHeight: .infinity)
        } else {
            EmptyView()
        }
    }

    private var headerView: some View {
        ChatHeaderBlockView(
            isSidebarOpen: $isSidebarOpen,
            viewMode: $viewMode,
            selectedModel: $selectedModel,
            models: models
        )
    }

    private var messagesView: some View {
        ChatMessagesBlockView(messages: messages)
    }

    private var composerView: some View {
        ChatInputBlockView(text: $inputText, isProcessing: isProcessing) {
            sendMessage()
        }
    }

    private var contextPanelView: some View {
        VStack(alignment: .leading, spacing: FSpacing.s12) {
            Text("Context")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)

            SettingsCardView {
                VStack(alignment: .leading, spacing: FSpacing.s8) {
                    Text("Pinned files")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)

                    Text("No items pinned yet.")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
                .padding(FSpacing.s16)
            }
        }
        .padding(FSpacing.s16)
        .frame(minWidth: 220, maxWidth: 260, maxHeight: .infinity)
        .background(FColor.bgApp)
        .overlay(
            Rectangle()
                .frame(width: 1)
                .foregroundStyle(FColor.divider.opacity(0.2)),
            alignment: .leading
        )
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
                ChatMessageItem(role: .assistant, content: "Here’s another layout variant.")
            )
            isProcessing = false
        } else {
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                messages.append(
                    ChatMessageItem(role: .assistant, content: "Here’s another layout variant.")
                )
                isProcessing = false
            }
        }
    }
}

// MARK: - SwiftUI Previews
// Note: Previews work in Xcode but cannot be compiled via Swift Package Manager command line.
// This is expected behavior - open this file in Xcode to see the previews.

/*
#Preview("Chat Variants Template - Light") {
    ChatVariantsTemplateView()
        .frame(width: 980, height: 720)
        .environment(\.colorScheme, .light)
}

#Preview("Chat Variants Template - Dark") {
    ChatVariantsTemplateView()
        .frame(width: 980, height: 720)
        .environment(\.colorScheme, .dark)
}
*/
