import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Defines the header variant shown in chat templates.
public enum ChatHeaderViewMode: String, CaseIterable, Identifiable {
    case chat
    case compose

    /// The raw identifier used for SwiftUI identity.
    public var id: String { rawValue }
}

/// Represents a sidebar item in template chat layouts.
public struct ChatSidebarItem: Identifiable {
    /// Stable identifier for the sidebar item.
    public let id: UUID
    /// Display title for the item.
    public let title: String
    /// SF Symbols name for the leading icon.
    public let systemIcon: String

    /// Creates a sidebar item model.
    /// - Parameters:
    ///   - id: The stable identifier for the item.
    ///   - title: The visible title for the item.
    ///   - systemIcon: The SF Symbols name used for the leading icon.
    public init(id: UUID = UUID(), title: String, systemIcon: String) {
        self.id = id
        self.title = title
        self.systemIcon = systemIcon
    }
}

/// Describes the role of a message in template chat layouts.
public enum ChatMessageRole {
    case user
    case assistant
}

/// Represents a message in template chat layouts.
public struct ChatMessageItem: Identifiable {
    /// Stable identifier for the message.
    public let id: UUID
    /// Role of the message author.
    public let role: ChatMessageRole
    /// Message content text.
    public let content: String

    /// Creates a message item model.
    /// - Parameters:
    ///   - id: The stable identifier for the message.
    ///   - role: The author role (user or assistant).
    ///   - content: The message content.
    public init(id: UUID = UUID(), role: ChatMessageRole, content: String) {
        self.id = id
        self.role = role
        self.content = content
    }
}

/// Renders the chat header block with model picker and action buttons.
public struct ChatHeaderBlockView: View {
    @Environment(\.chatUITheme) private var theme
    @Environment(\.colorScheme) private var scheme

    @Binding private var isSidebarOpen: Bool
    @Binding private var viewMode: ChatHeaderViewMode
    @Binding private var selectedModel: String
    private let models: [String]
    private let onDownload: () -> Void
    private let onShare: () -> Void

    /// Creates a header block view for chat templates.
    /// - Parameters:
    ///   - isSidebarOpen: Binding that controls whether the sidebar is visible.
    ///   - viewMode: Binding for the current header mode (chat vs compose).
    ///   - selectedModel: Binding for the currently selected model label.
    ///   - models: The available model labels displayed in the picker.
    ///   - onDownload: Action invoked when the download button is tapped.
    ///   - onShare: Action invoked when the share button is tapped.
    public init(
        isSidebarOpen: Binding<Bool>,
        viewMode: Binding<ChatHeaderViewMode>,
        selectedModel: Binding<String>,
        models: [String],
        onDownload: @escaping () -> Void = {},
        onShare: @escaping () -> Void = {}
    ) {
        self._isSidebarOpen = isSidebarOpen
        self._viewMode = viewMode
        self._selectedModel = selectedModel
        self.models = models
        self.onDownload = onDownload
        self.onShare = onShare
    }

    /// The content and behavior of this view.
    public var body: some View {
        HStack(spacing: FSpacing.s12) {
            ChatUIButton(variant: .ghost, size: .icon, accessibilityLabel: "Toggle sidebar") {
                isSidebarOpen.toggle()
            } content: {
                Image(systemName: "sidebar.left")
            }

            Button {
                viewMode = viewMode == .compose ? .chat : .compose
            } label: {
                HStack(spacing: FSpacing.s8) {
                    if viewMode == .compose {
                        Image(systemName: "bubble.left")
                            .foregroundStyle(FColor.iconTertiary)
                        Text("Chat")
                            .foregroundStyle(FColor.textTertiary)
                    } else {
                        Image(systemName: "sparkles")
                            .foregroundStyle(FColor.accentBlue)
                        Text("Compose")
                            .foregroundStyle(FColor.accentBlue)
                    }
                }
                .font(FType.rowTitle())
                .padding(.horizontal, FSpacing.s16)
                .padding(.vertical, FSpacing.s8)
                .background(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(FColor.bgApp)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .stroke(
                            FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight),
                            lineWidth: 1
                        )
                )
            }
            .buttonStyle(.plain)
            .accessibilityLabel(Text(viewMode == .compose ? "Switch to Chat" : "Switch to Compose"))

            Menu {
                ForEach(models, id: \.self) { model in
                    Button(model) { selectedModel = model }
                }
            } label: {
                HStack(spacing: FSpacing.s8) {
                    Text("ChatGPT")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)
                    Text(selectedModel)
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textTertiary)
                    Image(systemName: "chevron.down")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(FColor.iconTertiary)
                }
                .padding(.vertical, FSpacing.s4)
                .padding(.horizontal, FSpacing.s8)
            }
            .buttonStyle(.plain)

            Spacer()

            ChatUIButton(variant: .ghost, size: .icon, accessibilityLabel: "Download conversation") {
                onDownload()
            } content: {
                Image(systemName: "arrow.down.circle")
            }

            ChatUIButton(variant: .ghost, size: .icon, accessibilityLabel: "Share conversation") {
                onShare()
            } content: {
                Image(systemName: "square.and.arrow.up")
            }
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s8)
        .background(FColor.bgApp)
        .overlay(
            Rectangle()
                .fill(FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight))
                .frame(height: 1),
            alignment: .bottom
        )
    }
}

/// Renders the sidebar block for chat templates.
public struct ChatSidebarBlockView: View {
    @Environment(\.chatUITheme) private var theme
    @Environment(\.colorScheme) private var scheme
    @Binding private var selectedItemID: UUID?
    private let title: String
    private let items: [ChatSidebarItem]
    private let onNewChat: () -> Void

    /// Creates a sidebar block view for chat templates.
    /// - Parameters:
    ///   - title: The sidebar section title.
    ///   - items: The sidebar item models to display.
    ///   - selectedItemID: Binding to the currently selected item.
    ///   - onNewChat: Action invoked when the new chat button is tapped.
    public init(
        title: String,
        items: [ChatSidebarItem],
        selectedItemID: Binding<UUID?>,
        onNewChat: @escaping () -> Void = {}
    ) {
        self.title = title
        self.items = items
        self._selectedItemID = selectedItemID
        self.onNewChat = onNewChat
    }

    /// The content and behavior of this view.
    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s12) {
            HStack {
                Text(title)
                    .font(FType.sectionTitle())
                    .foregroundStyle(FColor.textTertiary)

                Spacer()

                ChatUIButton(variant: .ghost, size: .icon, accessibilityLabel: "New chat") {
                    onNewChat()
                } content: {
                    Image(systemName: "square.and.pencil")
                }
            }
            .padding(.horizontal, FSpacing.s16)
            .padding(.top, FSpacing.s12)

            ScrollView {
                LazyVStack(alignment: .leading, spacing: FSpacing.s8) {
                    ForEach(items) { item in
                        ListItemView(
                            systemIcon: item.systemIcon,
                            title: item.title,
                            trailing: .none,
                            isSelected: item.id == selectedItemID
                        ) {
                            selectedItemID = item.id
                        }
                    }
                }
                .padding(.horizontal, FSpacing.s12)
                .padding(.bottom, FSpacing.s16)
            }
        }
        .background(FColor.bgApp)
        .overlay(
            Rectangle()
                .fill(FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight))
                .frame(width: 1),
            alignment: .trailing
        )
    }
}

/// Renders the message list block for chat templates.
public struct ChatMessagesBlockView: View {
    private let messages: [ChatMessageItem]

    /// Creates a messages block view.
    /// - Parameter messages: The message models to render in order.
    public init(messages: [ChatMessageItem]) {
        self.messages = messages
    }

    /// The content and behavior of this view.
    public var body: some View {
        ScrollView {
            LazyVStack(spacing: FSpacing.s16) {
                ForEach(messages) { message in
                    ChatMessageRow(message: message)
                }
            }
            .padding(.horizontal, FSpacing.s16)
            .padding(.vertical, FSpacing.s16)
            .frame(maxWidth: 640)
            .frame(maxWidth: .infinity, alignment: .center)
        }
        .background(FColor.bgApp)
    }
}

/// Renders the input composer block for chat templates.
public struct ChatInputBlockView: View {
    @Binding private var text: String
    private let isProcessing: Bool
    private let modelShortName: String
    private let onSend: () -> Void
    @Environment(\.chatUITheme) private var theme
    @State private var isSearchEnabled = false
    @State private var isResearchEnabled = false
    @State private var isRecording = false
    @State private var isWebSearchActive = false

    /// Creates an input block view with state bindings.
    /// - Parameters:
    ///   - text: Binding to the composer text.
    ///   - isProcessing: Whether the composer should be disabled and show processing state.
    ///   - modelShortName: The short model label displayed in the toolbar.
    ///   - onSend: Action invoked when a non-empty message is sent.
    /// - Important: `onSend` is only called when the send button is enabled.
    public init(
        text: Binding<String>,
        isProcessing: Bool,
        modelShortName: String = "5.2 Pro",
        onSend: @escaping () -> Void
    ) {
        self._text = text
        self.isProcessing = isProcessing
        self.modelShortName = modelShortName
        self.onSend = onSend
    }

    private var canSendMessage: Bool {
        !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isProcessing
    }

    /// The content and behavior of this view.
    public var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: FSpacing.s8) {
                if isWebSearchActive {
                    HStack(spacing: FSpacing.s4) {
                        Image(systemName: "globe")
                            .font(.system(size: 13, weight: .semibold))
                        Text("Search")
                            .font(.system(size: DesignTokens.Typography.Caption.size, weight: DesignTokens.Typography.Caption.weight))
                    }
                    .foregroundStyle(FColor.textPrimary.opacity(0.9))
                    .padding(.vertical, FSpacing.s4)
                    .padding(.horizontal, FSpacing.s8)
                    .background(FColor.bgCardAlt)
                    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                ZStack(alignment: .topLeading) {
                    if text.isEmpty {
                        Text(isWebSearchActive ? "Search the web" : "Ask anything")
                            .font(.system(size: DesignTokens.Typography.Body.size, weight: DesignTokens.Typography.Body.weight))
                            .tracking(DesignTokens.Typography.Body.tracking)
                            .foregroundStyle(FColor.textTertiary)
                            .padding(.horizontal, FSpacing.s16)
                            .padding(.vertical, FSpacing.s12)
                            .accessibilityHidden(true)
                    }

                    Group {
                        if #available(iOS 16.0, macOS 13.0, *) {
                            TextEditor(text: $text)
                                .scrollContentBackground(.hidden)
                        } else {
                            TextEditor(text: $text)
                        }
                    }
                    .font(.system(size: DesignTokens.Typography.Body.size, weight: DesignTokens.Typography.Body.weight))
                    .tracking(DesignTokens.Typography.Body.tracking)
                    .foregroundStyle(FColor.textPrimary)
                    .padding(.horizontal, FSpacing.s16)
                    .padding(.vertical, FSpacing.s12)
                    .frame(minHeight: 24)
                    .disabled(isProcessing)
                    .accessibilityLabel(Text("Message input"))
                }
            }
            .padding(.horizontal, FSpacing.s16)
            .padding(.vertical, FSpacing.s12)

            Rectangle()
                .fill(FColor.divider.opacity(0.2))
                .frame(height: 1)

            HStack(spacing: FSpacing.s4) {
                HStack(spacing: FSpacing.s4) {
                    chatInputIconButton(icon: .plusLg, label: "Add attachment") {}
                    chatInputToggleButton(
                        icon: .globe,
                        label: "Search",
                        isActive: isSearchEnabled
                    ) {
                        isSearchEnabled.toggle()
                        isWebSearchActive = isSearchEnabled
                    }
                    chatInputToggleButton(
                        icon: .telescope,
                        label: "Research",
                        isActive: isResearchEnabled
                    ) {
                        isResearchEnabled.toggle()
                    }
                    chatInputIconButton(icon: .operator, label: "Tools") {}

                    Text(modelShortName)
                        .font(.system(size: DesignTokens.Typography.Caption.size, weight: DesignTokens.Typography.Caption.weight))
                        .tracking(DesignTokens.Typography.Caption.tracking)
                        .foregroundStyle(FColor.accentBlue)
                        .padding(.horizontal, FSpacing.s8)
                        .padding(.vertical, FSpacing.s4)
                        .background(FColor.accentBlue.opacity(0.2))
                        .clipShape(RoundedRectangle(cornerRadius: theme.buttonCornerRadius, style: .continuous))
                        .padding(.leading, FSpacing.s4)
                }

                Spacer()

                HStack(spacing: FSpacing.s4) {
                    Button(action: {}) {
                        HStack(spacing: FSpacing.s4) {
                            ChatGPTIconView(.arrowRotateCw, size: 12, color: FColor.textTertiary)
                            Text("Auto-clear")
                                .font(.system(size: DesignTokens.Typography.BodySmall.size, weight: DesignTokens.Typography.BodySmall.weight))
                                .tracking(DesignTokens.Typography.BodySmall.tracking)
                        }
                        .foregroundStyle(FColor.textTertiary)
                        .lineLimit(1)
                        .fixedSize(horizontal: true, vertical: false)
                        .padding(.vertical, FSpacing.s8)
                        .padding(.horizontal, FSpacing.s12)
                        .background(DesignTokens.Colors.Background.tertiary)
                        .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(Text("Auto-clear"))

                    chatInputIconButton(icon: .clock, label: "History") {}

                    Button(action: {
                        isRecording.toggle()
                    }) {
                        ChatGPTIconView(.mic, size: 16, color: isRecording ? FColor.accentRed : FColor.iconTertiary)
                            .frame(width: 32, height: 32)
                            .background(isRecording ? FColor.accentRed.opacity(0.2) : Color.clear)
                            .clipShape(RoundedRectangle(cornerRadius: theme.buttonCornerRadius, style: .continuous))
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(Text("Voice input"))

                    Button(action: {}) {
                        ChatGPTIconView(.headphones, size: 16, color: Color.white)
                            .frame(width: 32, height: 32)
                            .background(
                                LinearGradient(
                                    colors: [
                                        DesignTokens.Colors.Accent.purple,
                                        DesignTokens.Colors.Accent.red
                                    ],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .clipShape(Circle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(Text("Advanced features"))

                    Button(action: {
                        guard canSendMessage else { return }
                        onSend()
                    }) {
                        ChatGPTIconView(.goFilled, size: 14, color: Color.white)
                            .frame(width: 32, height: 32)
                            .background(FColor.accentGreen)
                            .clipShape(Circle())
                    }
                    .buttonStyle(.plain)
                    .disabled(!canSendMessage)
                    .accessibilityLabel(Text("Send"))
                }
            }
            .padding(.horizontal, FSpacing.s12)
            .padding(.vertical, FSpacing.s8)
        }
        .background(FColor.bgCard)
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .shadow(
            color: Color.black.opacity(theme.appShadowOpacity * 0.2),
            radius: theme.appShadowRadius * 0.3,
            x: 0,
            y: theme.appShadowYOffset * 0.15
        )
        .padding(FSpacing.s16)
        .background(FColor.bgApp)
        .overlay(Rectangle().fill(FColor.divider.opacity(0.1)).frame(height: 1), alignment: .top)
    }

    @ViewBuilder
    private func chatInputIconButton(icon: ChatGPTIcon, label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            ChatGPTIconView(icon, size: 16, color: FColor.iconTertiary)
                .frame(width: 32, height: 32)
                .background(Color.clear)
                .clipShape(RoundedRectangle(cornerRadius: theme.buttonCornerRadius, style: .continuous))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text(label))
    }

    @ViewBuilder
    private func chatInputToggleButton(
        icon: ChatGPTIcon,
        label: String,
        isActive: Bool,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            HStack(spacing: FSpacing.s4) {
                ChatGPTIconView(icon, size: 16, color: isActive ? FColor.accentBlue : FColor.iconTertiary)
                if isActive {
                    Text(label)
                        .font(.system(size: DesignTokens.Typography.BodySmall.size, weight: DesignTokens.Typography.BodySmall.weight))
                        .tracking(DesignTokens.Typography.BodySmall.tracking)
                        .foregroundStyle(FColor.accentBlue)
                }
            }
            .padding(.horizontal, FSpacing.s8)
            .padding(.vertical, FSpacing.s4)
            .background(isActive ? FColor.accentBlue.opacity(0.2) : Color.clear)
            .clipShape(RoundedRectangle(cornerRadius: theme.buttonCornerRadius, style: .continuous))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text(label))
    }
}

private struct ChatMessageRow: View {
    let message: ChatMessageItem
    @State private var isHovering = false

    var body: some View {
        Group {
            if message.role == .assistant {
                VStack(alignment: .leading, spacing: FSpacing.s8) {
                    Text(message.content)
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)
                        .textSelection(.enabled)

                    HStack(spacing: FSpacing.s8) {
                        messageActionButton(systemName: "doc.on.doc", label: "Copy")
                        messageActionButton(systemName: "hand.thumbsup", label: "Thumbs up")
                        messageActionButton(systemName: "hand.thumbsdown", label: "Thumbs down")
                        messageActionButton(systemName: "square.and.arrow.up", label: "Share")
                        messageActionButton(systemName: "arrow.clockwise", label: "Regenerate")
                        messageActionButton(systemName: "ellipsis", label: "More")
                    }
                    .opacity(isHovering ? 1 : 0)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            } else {
                HStack {
                    Spacer(minLength: 0)
                    VStack(alignment: .trailing, spacing: FSpacing.s4) {
                        Text(message.content)
                            .font(FType.rowTitle())
                            .foregroundStyle(Color.white)
                            .padding(.horizontal, FSpacing.s16)
                            .padding(.vertical, FSpacing.s12)
                            .background(FColor.accentGreen)
                            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                            .textSelection(.enabled)

                        HStack(spacing: FSpacing.s4) {
                            messageActionButton(systemName: "doc.on.doc", label: "Copy")
                            messageActionButton(systemName: "pencil", label: "Edit")
                        }
                        .opacity(isHovering ? 1 : 0)
                    }
                }
            }
        }
        #if os(macOS)
        .onHover { isHovering = $0 }
        #else
        .onAppear { isHovering = true }
        #endif
    }

    @ViewBuilder
    private func messageActionButton(systemName: String, label: String) -> some View {
        Button(action: {}) {
            Image(systemName: systemName)
                .font(.system(size: 12, weight: .regular))
                .foregroundStyle(FColor.textTertiary)
                .frame(width: 24, height: 24)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text(label))
    }
}
