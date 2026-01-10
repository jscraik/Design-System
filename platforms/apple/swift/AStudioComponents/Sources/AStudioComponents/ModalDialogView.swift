import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders a modal dialog with optional title and description.
///
/// ### Discussion
/// Uses an overlay and accessibility modal traits to convey focus.
///
/// - Example:
/// ```swift
/// ModalDialogView(isPresented: $showDialog, title: "Settings") {
///     ModalBodyView { Text("Content") }
/// }
/// ```
public struct ModalDialogView<Content: View>: View {
    @Binding private var isPresented: Bool
    private let title: String?
    private let description: String?
    private let maxWidth: CGFloat
    private let showOverlay: Bool
    private let onClose: (() -> Void)?
    private let content: Content

    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme

    /// Creates a modal dialog view.
    ///
    /// - Parameters:
    ///   - isPresented: Binding controlling presentation.
    ///   - title: Optional title string.
    ///   - description: Optional description string.
    ///   - maxWidth: Maximum dialog width (default: `520`).
    ///   - showOverlay: Whether to show the dimmed overlay.
    ///   - onClose: Optional callback invoked when dismissing.
    ///   - content: Content builder for the dialog body.
    public init(
        isPresented: Binding<Bool>,
        title: String? = nil,
        description: String? = nil,
        maxWidth: CGFloat = 520,
        showOverlay: Bool = true,
        onClose: (() -> Void)? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self._isPresented = isPresented
        self.title = title
        self.description = description
        self.maxWidth = maxWidth
        self.showOverlay = showOverlay
        self.onClose = onClose
        self.content = content()
    }

    /// The content and behavior of this view.
    public var body: some View {
        if isPresented {
            ZStack {
                if showOverlay {
                    Color.black.opacity(FAccessibility.prefersReducedTransparency ? 0.7 : 0.5)
                        .ignoresSafeArea()
                        .onTapGesture {
                            dismiss()
                        }
                }

                VStack(spacing: 0) {
                    if let title {
                        ModalHeaderView(
                            title: title,
                            subtitle: description,
                            onClose: { dismiss() }
                        )
                    }

                    content
                }
                .frame(maxWidth: maxWidth, maxHeight: .infinity, alignment: .top)
                .background(FColor.bgCard)
                .clipShape(RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous)
                        .stroke(
                            FColor.divider.opacity(
                                scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight
                            ),
                            lineWidth: 1
                        )
                )
                .shadow(color: FColor.bgCardAlt.opacity(0.35), radius: 18, x: 0, y: 10)
                .padding(FSpacing.s24)
                .accessibilityElement(children: .contain)
                .accessibilityAddTraits(.isModal)
                #if os(macOS)
                .onExitCommand {
                    dismiss()
                }
                #endif
            }
            .animation(FAccessibility.prefersReducedMotion ? nil : .easeInOut(duration: 0.2), value: isPresented)
        }
    }

    private func dismiss() {
        onClose?()
        isPresented = false
    }
}

/// Renders a modal header with title, subtitle, and optional close action.
public struct ModalHeaderView: View {
    private let title: String
    private let subtitle: String?
    private let onClose: (() -> Void)?

    /// Creates a modal header view.
    ///
    /// - Parameters:
    ///   - title: Title string.
    ///   - subtitle: Optional subtitle string.
    ///   - onClose: Optional close action.
    public init(title: String, subtitle: String? = nil, onClose: (() -> Void)? = nil) {
        self.title = title
        self.subtitle = subtitle
        self.onClose = onClose
    }

    /// The content and behavior of this view.
    public var body: some View {
        HStack(alignment: .center, spacing: FSpacing.s12) {
            VStack(alignment: .leading, spacing: FSpacing.s4) {
                Text(title)
                    .font(FType.title())
                    .foregroundStyle(FColor.textPrimary)
                if let subtitle {
                    Text(subtitle)
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
            }

            Spacer()

            if let onClose {
                ChatUIButton(
                    systemName: "xmark",
                    variant: .ghost,
                    size: .icon,
                    accessibilityLabel: "Close dialog",
                    accessibilityHint: "Dismiss the dialog"
                ) {
                    onClose()
                }
            }
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s12)
        .background(FColor.bgCardAlt)
        .overlay(SettingsDivider(), alignment: .bottom)
    }
}

/// Renders the body content for a modal dialog.
public struct ModalBodyView<Content: View>: View {
    private let content: Content

    /// Creates a modal body view.
    ///
    /// - Parameter content: Content builder.
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    /// The content and behavior of this view.
    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s12) {
            content
        }
        .padding(FSpacing.s16)
    }
}

/// Renders a footer area for modal dialog actions.
public struct ModalFooterView<Content: View>: View {
    private let content: Content

    /// Creates a modal footer view.
    ///
    /// - Parameter content: Content builder.
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    /// The content and behavior of this view.
    public var body: some View {
        HStack {
            Spacer()
            content
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s12)
        .background(FColor.bgCardAlt)
        .overlay(SettingsDivider(), alignment: .top)
    }
}
