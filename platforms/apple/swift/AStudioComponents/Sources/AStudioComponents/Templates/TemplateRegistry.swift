import SwiftUI

/// Identifies the high-level template variants available in the template gallery.
public enum TemplateID: String, CaseIterable, Identifiable {
    case chatHeader
    case chatSidebar
    case chatMessages
    case chatInput
    case chat
    case chatVariants
    case compose

    /// The raw identifier used for SwiftUI identity.
    public var id: String { rawValue }

    /// A display-ready title for use in lists and pickers.
    public var title: String {
        switch self {
        case .chatHeader:
            return "Chat Header"
        case .chatSidebar:
            return "Chat Sidebar"
        case .chatMessages:
            return "Chat Messages"
        case .chatInput:
            return "Chat Input"
        case .chat:
            return "Chat"
        case .chatVariants:
            return "Chat Variants"
        case .compose:
            return "Compose"
        }
    }

    /// A short description of the template's purpose.
    public var detail: String {
        switch self {
        case .chatHeader:
            return "Header bar for chat surfaces."
        case .chatSidebar:
            return "Sidebar navigation for chats."
        case .chatMessages:
            return "Message list block."
        case .chatInput:
            return "Composer input bar."
        case .chat:
            return "Chat shell with messages and input composer."
        case .chatVariants:
            return "Switchable chat layouts (split, compact, rail)."
        case .compose:
            return "Prompt builder and compose workflow template."
        }
    }
}

/// Describes a template entry and provides a factory for its view.
public struct TemplateDescriptor: Identifiable {
    /// Stable identifier for the template.
    public let id: TemplateID
    /// Display title for the template.
    public let title: String
    /// Short description of the template.
    public let detail: String
    /// Factory that builds the template view.
    public let makeView: () -> AnyView

    /// Creates a descriptor for a template entry.
    /// - Parameters:
    ///   - id: The stable template identifier.
    ///   - title: The display title shown in the template list.
    ///   - detail: A short description of the template.
    ///   - makeView: A factory that builds the template view.
    public init(id: TemplateID, title: String, detail: String, makeView: @escaping () -> AnyView) {
        self.id = id
        self.title = title
        self.detail = detail
        self.makeView = makeView
    }
}

/// Provides the curated list of templates used by the template browser.
public enum TemplateRegistry {
    /// All available template descriptors in display order.
    public static let templates: [TemplateDescriptor] = [
        TemplateDescriptor(
            id: .chatHeader,
            title: TemplateID.chatHeader.title,
            detail: TemplateID.chatHeader.detail,
            makeView: { AnyView(ChatHeaderTemplateView()) }
        ),
        TemplateDescriptor(
            id: .chatSidebar,
            title: TemplateID.chatSidebar.title,
            detail: TemplateID.chatSidebar.detail,
            makeView: { AnyView(ChatSidebarTemplateView()) }
        ),
        TemplateDescriptor(
            id: .chatMessages,
            title: TemplateID.chatMessages.title,
            detail: TemplateID.chatMessages.detail,
            makeView: { AnyView(ChatMessagesTemplateView()) }
        ),
        TemplateDescriptor(
            id: .chatInput,
            title: TemplateID.chatInput.title,
            detail: TemplateID.chatInput.detail,
            makeView: { AnyView(ChatInputTemplateView()) }
        ),
        TemplateDescriptor(
            id: .chat,
            title: TemplateID.chat.title,
            detail: TemplateID.chat.detail,
            makeView: { AnyView(ChatTemplateView()) }
        ),
        TemplateDescriptor(
            id: .chatVariants,
            title: TemplateID.chatVariants.title,
            detail: TemplateID.chatVariants.detail,
            makeView: { AnyView(ChatVariantsTemplateView()) }
        ),
        TemplateDescriptor(
            id: .compose,
            title: TemplateID.compose.title,
            detail: TemplateID.compose.detail,
            makeView: { AnyView(ComposeView()) }
        )
    ]

    /// Returns the descriptor for a matching template identifier.
    /// - Parameter id: The template identifier to look up.
    /// - Returns: The matching descriptor, or `nil` if the ID is not registered.
    public static func template(for id: TemplateID) -> TemplateDescriptor? {
        templates.first { $0.id == id }
    }
}
