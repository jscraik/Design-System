import SwiftUI
import ChatUIFoundation

/// Renders the main chat layout with optional sidebar and context panel.
///
/// ### Discussion
/// Compose this layout using slots for sidebar, header, messages, composer, and context panel.
///
/// - Example:
/// ```swift
/// ChatShell(
///     sidebar: { SidebarView() },
///     header: { HeaderView() },
///     messages: { MessagesView() },
///     composer: { ComposerView() },
///     contextPanel: { ContextPanelView() }
/// )
/// ```
public struct ChatShell<Sidebar: View, Header: View, Messages: View, Composer: View, ContextPanel: View>: View {
    private let sidebar: Sidebar
    private let header: Header
    private let messages: Messages
    private let composer: Composer
    private let contextPanel: ContextPanel
    private let spacing: CGFloat
    private let padding: CGFloat

    /// Creates a chat shell layout.
    ///
    /// - Parameters:
    ///   - spacing: Spacing between regions.
    ///   - padding: Outer padding.
    ///   - sidebar: Sidebar content builder.
    ///   - header: Header content builder.
    ///   - messages: Messages list builder.
    ///   - composer: Composer input builder.
    ///   - contextPanel: Context panel builder.
    public init(
        spacing: CGFloat = CGFloat(FSpacing.s16),
        padding: CGFloat = CGFloat(FSpacing.s16),
        @ViewBuilder sidebar: () -> Sidebar,
        @ViewBuilder header: () -> Header,
        @ViewBuilder messages: () -> Messages,
        @ViewBuilder composer: () -> Composer,
        @ViewBuilder contextPanel: () -> ContextPanel
    ) {
        self.spacing = spacing
        self.padding = padding
        self.sidebar = sidebar()
        self.header = header()
        self.messages = messages()
        self.composer = composer()
        self.contextPanel = contextPanel()
    }

    /// The content and behavior of this view.
    public var body: some View {
        HStack(spacing: spacing) {
            sidebar
            VStack(spacing: spacing) {
                header
                VStack(spacing: 0) {
                    messages
                    composer
                }
            }
            contextPanel
        }
        .padding(padding)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(FColor.bgApp)
    }
}

/// Renders a chat layout with a sidebar but no context panel.
public struct ChatVariantSplitSidebar<Sidebar: View, Header: View, Messages: View, Composer: View>: View {
    private let sidebar: Sidebar
    private let header: Header
    private let messages: Messages
    private let composer: Composer
    private let spacing: CGFloat
    private let padding: CGFloat

    /// Creates a split sidebar variant.
    ///
    /// - Parameters:
    ///   - spacing: Spacing between regions.
    ///   - padding: Outer padding.
    ///   - sidebar: Sidebar content builder.
    ///   - header: Header content builder.
    ///   - messages: Messages list builder.
    ///   - composer: Composer input builder.
    public init(
        spacing: CGFloat = CGFloat(FSpacing.s16),
        padding: CGFloat = CGFloat(FSpacing.s16),
        @ViewBuilder sidebar: () -> Sidebar,
        @ViewBuilder header: () -> Header,
        @ViewBuilder messages: () -> Messages,
        @ViewBuilder composer: () -> Composer
    ) {
        self.spacing = spacing
        self.padding = padding
        self.sidebar = sidebar()
        self.header = header()
        self.messages = messages()
        self.composer = composer()
    }

    /// The content and behavior of this view.
    public var body: some View {
        ChatShell(
            spacing: spacing,
            padding: padding,
            sidebar: { sidebar },
            header: { header },
            messages: { messages },
            composer: { composer },
            contextPanel: { EmptyView() }
        )
    }
}

/// Renders a compact chat layout without sidebar or context panel.
public struct ChatVariantCompact<Header: View, Messages: View, Composer: View>: View {
    private let header: Header
    private let messages: Messages
    private let composer: Composer
    private let spacing: CGFloat
    private let padding: CGFloat

    /// Creates a compact chat variant.
    ///
    /// - Parameters:
    ///   - spacing: Spacing between regions.
    ///   - padding: Outer padding.
    ///   - header: Header content builder.
    ///   - messages: Messages list builder.
    ///   - composer: Composer input builder.
    public init(
        spacing: CGFloat = CGFloat(FSpacing.s16),
        padding: CGFloat = CGFloat(FSpacing.s16),
        @ViewBuilder header: () -> Header,
        @ViewBuilder messages: () -> Messages,
        @ViewBuilder composer: () -> Composer
    ) {
        self.spacing = spacing
        self.padding = padding
        self.header = header()
        self.messages = messages()
        self.composer = composer()
    }

    /// The content and behavior of this view.
    public var body: some View {
        ChatShell(
            spacing: spacing,
            padding: padding,
            sidebar: { EmptyView() },
            header: { header },
            messages: { messages },
            composer: { composer },
            contextPanel: { EmptyView() }
        )
    }
}

/// Renders a chat layout with sidebar and context panel.
public struct ChatVariantContextRail<Sidebar: View, Header: View, Messages: View, Composer: View, ContextPanel: View>: View {
    private let sidebar: Sidebar
    private let header: Header
    private let messages: Messages
    private let composer: Composer
    private let contextPanel: ContextPanel
    private let spacing: CGFloat
    private let padding: CGFloat

    /// Creates a context rail variant.
    ///
    /// - Parameters:
    ///   - spacing: Spacing between regions.
    ///   - padding: Outer padding.
    ///   - sidebar: Sidebar content builder.
    ///   - header: Header content builder.
    ///   - messages: Messages list builder.
    ///   - composer: Composer input builder.
    ///   - contextPanel: Context panel builder.
    public init(
        spacing: CGFloat = CGFloat(FSpacing.s16),
        padding: CGFloat = CGFloat(FSpacing.s16),
        @ViewBuilder sidebar: () -> Sidebar,
        @ViewBuilder header: () -> Header,
        @ViewBuilder messages: () -> Messages,
        @ViewBuilder composer: () -> Composer,
        @ViewBuilder contextPanel: () -> ContextPanel
    ) {
        self.spacing = spacing
        self.padding = padding
        self.sidebar = sidebar()
        self.header = header()
        self.messages = messages()
        self.composer = composer()
        self.contextPanel = contextPanel()
    }

    /// The content and behavior of this view.
    public var body: some View {
        ChatShell(
            spacing: spacing,
            padding: padding,
            sidebar: { sidebar },
            header: { header },
            messages: { messages },
            composer: { composer },
            contextPanel: { contextPanel }
        )
    }
}
