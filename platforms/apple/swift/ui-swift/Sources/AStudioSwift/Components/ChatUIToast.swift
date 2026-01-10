import SwiftUI
import UserNotifications
import os

private let toastLogger = Logger(subsystem: "AStudioSwift", category: "ChatUIToast")

/// A native macOS toast notification component with system integration.
public struct ChatUIToast: View {
    
    /// Visual styles for toasts.
    public enum Style {
        case info
        case success
        case warning
        case error
    }
    
    /// Placement options for toast presentation.
    public enum Position {
        case top
        case bottom
        case topLeading
        case topTrailing
        case bottomLeading
        case bottomTrailing
    }
    
    internal let message: String
    private let style: Style
    private let duration: TimeInterval
    private let showIcon: Bool
    private let onDismiss: (() -> Void)?
    
    @State private var isVisible = true
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    
    /// Creates a toast view.
    ///
    /// - Parameters:
    ///   - message: Toast message text.
    ///   - style: Visual style (default: `.info`).
    ///   - duration: Auto-dismiss duration in seconds (0 disables).
    ///   - showIcon: Whether to show the leading icon.
    ///   - onDismiss: Optional dismiss callback.
    public init(
        message: String,
        style: Style = .info,
        duration: TimeInterval = 3.0,
        showIcon: Bool = true,
        onDismiss: (() -> Void)? = nil
    ) {
        self.message = message
        self.style = style
        self.duration = duration
        self.showIcon = showIcon
        self.onDismiss = onDismiss
    }
    
    /// The content and behavior of this view.
    public var body: some View {
        if isVisible {
            HStack(spacing: DesignTokens.Spacing.sm) {
                // Icon
                if showIcon {
                    Image(systemName: iconForStyle(style))
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(iconColorForStyle(style))
                        .accessibilityHidden(true)
                }
                
                // Message
                Text(message)
                    .font(.system(size: scaledFontSize(14)))
                    .foregroundColor(textColorForStyle(style))
                    .multilineTextAlignment(.leading)
                    .fixedSize(horizontal: false, vertical: true)
                
                Spacer()
                
                // Dismiss button
                ChatUIButton(
                    systemName: "xmark",
                    variant: .ghost,
                    size: .icon,
                    accessibilityLabel: "Dismiss",
                    accessibilityHint: "Dismiss notification"
                ) {
                    dismissToast()
                }
                .foregroundColor(textColorForStyle(style))
            }
            .padding(DesignTokens.Spacing.sm)
            .background(backgroundColorForStyle(style))
            .cornerRadius(DesignTokens.CornerRadius.medium)
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.CornerRadius.medium)
                    .stroke(borderColorForStyle(style), lineWidth: 1)
            )
            .shadow(
                color: DesignTokens.Colors.Text.primary.opacity(0.1),
                radius: 8,
                x: 0,
                y: 4
            )
            .transition(
                reduceMotion
                    ? .opacity
                    : .asymmetric(
                        insertion: .move(edge: .top).combined(with: .opacity),
                        removal: .move(edge: .top).combined(with: .opacity)
                    )
            )
            .onAppear {
                // Auto-dismiss after duration
                if duration > 0 {
                    DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
                        dismissToast()
                    }
                }
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel("\(accessibilityLabelForStyle(style)): \(message)")
        }
    }
    
    // MARK: - Helpers
    
    private func dismissToast() {
        if reduceMotion {
            isVisible = false
            onDismiss?()
        } else {
            withAnimation(.easeInOut(duration: animationDuration)) {
                isVisible = false
            }
            
            DispatchQueue.main.asyncAfter(deadline: .now() + animationDuration) {
                onDismiss?()
            }
        }
    }
    
    private func iconForStyle(_ style: Style) -> String {
        switch style {
        case .info:
            return "info.circle.fill"
        case .success:
            return "checkmark.circle.fill"
        case .warning:
            return "exclamationmark.triangle.fill"
        case .error:
            return "xmark.circle.fill"
        }
    }
    
    private func iconColorForStyle(_ style: Style) -> Color {
        switch style {
        case .info:
            return DesignTokens.Colors.Accent.blue
        case .success:
            return DesignTokens.Colors.Accent.green
        case .warning:
            return DesignTokens.Colors.Accent.orange
        case .error:
            return DesignTokens.Colors.Accent.red
        }
    }
    
    private func backgroundColorForStyle(_ style: Style) -> Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        
        if prefersHighContrast {
            return DesignTokens.Accessibility.HighContrast.backgroundContrast
        }
        
        switch style {
        case .info:
            return DesignTokens.Colors.Accent.blue.opacity(0.1)
        case .success:
            return DesignTokens.Colors.Accent.green.opacity(0.1)
        case .warning:
            return DesignTokens.Colors.Accent.orange.opacity(0.1)
        case .error:
            return DesignTokens.Colors.Accent.red.opacity(0.1)
        }
    }
    
    private func textColorForStyle(_ style: Style) -> Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        
        if prefersHighContrast {
            return DesignTokens.Accessibility.HighContrast.textOnBackground
        }
        
        return DesignTokens.Colors.Text.primary
    }
    
    private func borderColorForStyle(_ style: Style) -> Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        
        if prefersHighContrast {
            return DesignTokens.Accessibility.HighContrast.borderContrast
        }
        
        switch style {
        case .info:
            return DesignTokens.Colors.Accent.blue.opacity(0.3)
        case .success:
            return DesignTokens.Colors.Accent.green.opacity(0.3)
        case .warning:
            return DesignTokens.Colors.Accent.orange.opacity(0.3)
        case .error:
            return DesignTokens.Colors.Accent.red.opacity(0.3)
        }
    }
    
    private func accessibilityLabelForStyle(_ style: Style) -> String {
        switch style {
        case .info:
            return "Information"
        case .success:
            return "Success"
        case .warning:
            return "Warning"
        case .error:
            return "Error"
        }
    }
    
    private var animationDuration: Double {
        DesignTokens.Accessibility.Animation.duration()
    }
    
    private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
        ChatUIInput.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)
    }
    
    // MARK: - Public Methods
    
    /// Returns the toast instance for presentation.
    public func show() -> ChatUIToast {
        self
    }
}

// MARK: - Toast Manager

/// Manages toast notifications and system integration.
@MainActor
/// Toast manager that runs on the main actor.
public class ChatUIToastManager: ObservableObject {
    
    /// Active toast items currently displayed.
    @Published public var activeToasts: [ToastItem] = []
    
    /// Shared singleton instance.
    public static let shared = ChatUIToastManager()
    
    private init() {}
    
    /// Represents a toast item in the queue.
    public struct ToastItem: Identifiable {
        /// Unique identifier for the toast item.
        public let id: UUID
        let toast: ChatUIToast
        let position: ChatUIToast.Position
    }
    
    // MARK: - Show Toast
    
    /// Shows a toast with the given configuration.
    public func show(
        _ message: String,
        style: ChatUIToast.Style = .info,
        position: ChatUIToast.Position = .top,
        duration: TimeInterval = 3.0,
        showIcon: Bool = true
    ) {
        let toastId = UUID()
        let toast = ChatUIToast(
            message: message,
            style: style,
            duration: duration,
            showIcon: showIcon
        ) { [weak self] in
            self?.removeToast(id: toastId)
        }
        
        let item = ToastItem(id: toastId, toast: toast.show(), position: position)
        activeToasts.append(item)
        
        // Auto-remove after duration + animation time
        if duration > 0 {
            DispatchQueue.main.asyncAfter(deadline: .now() + duration + 0.3) {
                self.removeToast(id: toastId)
            }
        }
    }
    
    private func removeToast(id: UUID) {
        activeToasts.removeAll { $0.id == id }
    }
    
    // MARK: - System Notifications
    
    /// Request notification permissions
    /// Requests system notification permissions.
    public func requestNotificationPermissions() async -> Bool {
        let center = UNUserNotificationCenter.current()
        
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            return granted
        } catch {
            toastLogger.error("Failed to request notification permissions: \(String(describing: error))")
            return false
        }
    }
    
    /// Send a system notification
    /// Sends a system notification via UserNotifications.
    public func sendSystemNotification(
        title: String,
        body: String,
        identifier: String = UUID().uuidString,
        delay: TimeInterval = 0
    ) async {
        let center = UNUserNotificationCenter.current()
        
        // Check permissions
        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized else {
            toastLogger.notice("Notification permissions not granted")
            return
        }
        
        // Create notification content
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        // Create trigger
        let trigger = delay > 0 
            ? UNTimeIntervalNotificationTrigger(timeInterval: delay, repeats: false)
            : nil
        
        // Create request
        let request = UNNotificationRequest(
            identifier: identifier,
            content: content,
            trigger: trigger
        )
        
        // Schedule notification
        do {
            try await center.add(request)
        } catch {
            toastLogger.error("Failed to schedule notification: \(String(describing: error))")
        }
    }
    
    // MARK: - Convenience Methods
    
    /// Convenience: show an info toast.
    public func showInfo(_ message: String, position: ChatUIToast.Position = .top) {
        show(message, style: .info, position: position)
    }
    
    /// Convenience: show a success toast.
    public func showSuccess(_ message: String, position: ChatUIToast.Position = .top) {
        show(message, style: .success, position: position)
    }
    
    /// Convenience: show a warning toast.
    public func showWarning(_ message: String, position: ChatUIToast.Position = .top) {
        show(message, style: .warning, position: position)
    }
    
    /// Convenience: show an error toast.
    public func showError(_ message: String, position: ChatUIToast.Position = .top) {
        show(message, style: .error, position: position)
    }
}

// MARK: - Toast Container View

/// Container view that displays active toasts.
public struct ChatUIToastContainer: View {
    
    @StateObject private var toastManager = ChatUIToastManager.shared
    
    /// Creates a toast container view.
    public init() {}
    
    /// The content and behavior of this view.
    public var body: some View {
        ZStack {
            // Top toasts
            VStack {
                ForEach(topToasts, id: \.id) { item in
                    item.toast
                        .padding(.horizontal, DesignTokens.Spacing.md)
                }
                Spacer()
            }
            
            // Bottom toasts
            VStack {
                Spacer()
                ForEach(bottomToasts, id: \.id) { item in
                    item.toast
                        .padding(.horizontal, DesignTokens.Spacing.md)
                }
            }
            
            // Corner toasts
            VStack {
                HStack {
                    VStack {
                        ForEach(topLeadingToasts, id: \.id) { item in
                            item.toast
                        }
                        Spacer()
                    }
                    
                    Spacer()
                    
                    VStack {
                        ForEach(topTrailingToasts, id: \.id) { item in
                            item.toast
                        }
                        Spacer()
                    }
                }
                
                HStack {
                    VStack {
                        Spacer()
                        ForEach(bottomLeadingToasts, id: \.id) { item in
                            item.toast
                        }
                    }
                    
                    Spacer()
                    
                    VStack {
                        Spacer()
                        ForEach(bottomTrailingToasts, id: \.id) { item in
                            item.toast
                        }
                    }
                }
            }
            .padding(DesignTokens.Spacing.md)
        }
        .allowsHitTesting(false) // Allow touches to pass through
        .accessibilityElement(children: .contain)
    }
    
    // MARK: - Computed Properties
    
    private var topToasts: [ChatUIToastManager.ToastItem] {
        toastManager.activeToasts.filter { $0.position == .top }
    }
    
    private var bottomToasts: [ChatUIToastManager.ToastItem] {
        toastManager.activeToasts.filter { $0.position == .bottom }
    }
    
    private var topLeadingToasts: [ChatUIToastManager.ToastItem] {
        toastManager.activeToasts.filter { $0.position == .topLeading }
    }
    
    private var topTrailingToasts: [ChatUIToastManager.ToastItem] {
        toastManager.activeToasts.filter { $0.position == .topTrailing }
    }
    
    private var bottomLeadingToasts: [ChatUIToastManager.ToastItem] {
        toastManager.activeToasts.filter { $0.position == .bottomLeading }
    }
    
    private var bottomTrailingToasts: [ChatUIToastManager.ToastItem] {
        toastManager.activeToasts.filter { $0.position == .bottomTrailing }
    }
}

// MARK: - View Modifiers

extension View {
    /// Adds toast notification support to the view.
    public func toastContainer() -> some View {
        self.overlay(
            ChatUIToastContainer()
        )
    }
}
