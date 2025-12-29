import SwiftUI

/// A native macOS modal dialog component with proper focus management
public struct ChatUIModal<Content: View>: View {
    
    public enum Size {
        case small
        case medium
        case large
        case fullscreen
    }
    
    @Binding private var isPresented: Bool
    private let title: String?
    private let size: Size
    private let onDismiss: (() -> Void)?
    private let content: () -> Content
    
    @FocusState private var isContentFocused: Bool
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    
    public init(
        isPresented: Binding<Bool>,
        title: String? = nil,
        size: Size = .medium,
        onDismiss: (() -> Void)? = nil,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self._isPresented = isPresented
        self.title = title
        self.size = size
        self.onDismiss = onDismiss
        self.content = content
    }
    
    public var body: some View {
        ZStack {
            if isPresented {
                // Backdrop
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        dismissModal()
                    }
                    .accessibilityHidden(true)
                
                // Modal content
                VStack(alignment: .leading, spacing: 0) {
                    // Header
                    if let title = title {
                        modalHeader(title: title)
                    }
                    
                    // Content
                    ScrollView {
                        content()
                            .padding(DesignTokens.Spacing.md)
                    }
                    .focused($isContentFocused)
                }
                .frame(
                    width: widthForSize(size),
                    height: heightForSize(size)
                )
                .background(DesignTokens.Colors.Background.primary)
                .cornerRadius(DesignTokens.CornerRadius.large)
                .shadow(
                    color: DesignTokens.Colors.Text.primary.opacity(0.2),
                    radius: 20,
                    x: 0,
                    y: 8
                )
                .overlay(
                    RoundedRectangle(cornerRadius: DesignTokens.CornerRadius.large)
                        .stroke(borderColor, lineWidth: 1)
                )
                .transition(.asymmetric(
                    insertion: .scale(scale: 0.9).combined(with: .opacity),
                    removal: .scale(scale: 0.95).combined(with: .opacity)
                ))
                .onAppear {
                    // Focus content when modal appears
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        isContentFocused = true
                    }
                }
                .accessibilityElement(children: .contain)
                .accessibilityAddTraits(.isModal)
            }
        }
        .animation(.easeInOut(duration: animationDuration), value: isPresented)
    }
    
    // MARK: - Header
    
    @ViewBuilder
    private func modalHeader(title: String) -> some View {
        HStack {
            Text(title)
                .font(.system(size: scaledFontSize(18), weight: .semibold))
                .foregroundColor(DesignTokens.Colors.Text.primary)
                .accessibilityAddTraits(.isHeader)
            
            Spacer()
            
            ChatUIButton(
                systemName: "xmark",
                variant: .ghost,
                size: .icon,
                accessibilityLabel: "Close",
                accessibilityHint: "Closes the modal dialog"
            ) {
                dismissModal()
            }
        }
        .padding(.horizontal, DesignTokens.Spacing.md)
        .padding(.vertical, DesignTokens.Spacing.sm)
        .background(DesignTokens.Colors.Background.secondary)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(DesignTokens.Colors.Background.tertiary),
            alignment: .bottom
        )
    }
    
    // MARK: - Helpers
    
    private func dismissModal() {
        onDismiss?()
        isPresented = false
    }
    
    private func widthForSize(_ size: Size) -> CGFloat {
        switch size {
        case .small:
            return 400
        case .medium:
            return 600
        case .large:
            return 800
        case .fullscreen:
            return .infinity
        }
    }
    
    private func heightForSize(_ size: Size) -> CGFloat? {
        switch size {
        case .small:
            return 300
        case .medium:
            return 500
        case .large:
            return 700
        case .fullscreen:
            return .infinity
        }
    }
    
    private var borderColor: Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        return prefersHighContrast 
            ? DesignTokens.Accessibility.HighContrast.borderContrast
            : DesignTokens.Colors.Background.tertiary
    }
    
    private var animationDuration: Double {
        DesignTokens.Accessibility.Animation.duration()
    }
    
    private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
        ChatUIInput.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)
    }
}

// MARK: - Alert Dialog

/// A specialized modal for alert dialogs with action buttons
public struct ChatUIAlert: View {
    
    public struct Action {
        let title: String
        let style: ChatUIButtonVariant
        let action: () -> Void
        
        public init(title: String, style: ChatUIButtonVariant = .default, action: @escaping () -> Void) {
            self.title = title
            self.style = style
            self.action = action
        }
        
        public static func cancel(_ action: @escaping () -> Void = {}) -> Action {
            Action(title: "Cancel", style: .secondary, action: action)
        }
        
        public static func destructive(_ title: String, action: @escaping () -> Void) -> Action {
            Action(title: title, style: .destructive, action: action)
        }
        
        public static func `default`(_ title: String, action: @escaping () -> Void) -> Action {
            Action(title: title, style: .default, action: action)
        }
    }
    
    @Binding private var isPresented: Bool
    private let title: String
    private let message: String?
    private let actions: [Action]
    
    public init(
        isPresented: Binding<Bool>,
        title: String,
        message: String? = nil,
        actions: [Action]
    ) {
        self._isPresented = isPresented
        self.title = title
        self.message = message
        self.actions = actions
    }
    
    public var body: some View {
        ChatUIModal(
            isPresented: $isPresented,
            title: title,
            size: .small
        ) {
            VStack(alignment: .leading, spacing: DesignTokens.Spacing.md) {
                if let message = message {
                    Text(message)
                        .font(.system(size: 14))
                        .foregroundColor(DesignTokens.Colors.Text.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                
                HStack(spacing: DesignTokens.Spacing.sm) {
                    Spacer()
                    
                    ForEach(Array(actions.enumerated()), id: \.offset) { index, action in
                        ChatUIButton(
                            action.title,
                            variant: action.style,
                            size: .default
                        ) {
                            action.action()
                            isPresented = false
                        }
                        .accessibilityIdentifier("alert-action-\(index)")
                    }
                }
            }
        }
    }
}

// MARK: - View Modifiers

extension View {
    /// Presents a modal dialog
    public func modal<Content: View>(
        isPresented: Binding<Bool>,
        title: String? = nil,
        size: ChatUIModal<Content>.Size = .medium,
        onDismiss: (() -> Void)? = nil,
        @ViewBuilder content: @escaping () -> Content
    ) -> some View {
        self.overlay(
            ChatUIModal(
                isPresented: isPresented,
                title: title,
                size: size,
                onDismiss: onDismiss,
                content: content
            )
        )
    }
    
    /// Presents an alert dialog
    public func alert(
        isPresented: Binding<Bool>,
        title: String,
        message: String? = nil,
        actions: [ChatUIAlert.Action]
    ) -> some View {
        self.overlay(
            ChatUIAlert(
                isPresented: isPresented,
                title: title,
                message: message,
                actions: actions
            )
        )
    }
}