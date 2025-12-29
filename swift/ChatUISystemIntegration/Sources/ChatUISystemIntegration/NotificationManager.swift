import Foundation
#if canImport(AppKit)
import AppKit
#endif
import UserNotifications

/// Manages system notifications using UserNotifications framework
public class NotificationManager: NSObject {
    
    public enum NotificationError: Error, LocalizedError {
        case permissionDenied
        case notificationFailed(Error)
        case invalidConfiguration
        
        public var errorDescription: String? {
            switch self {
            case .permissionDenied:
                return "Notification permission denied"
            case .notificationFailed(let error):
                return "Failed to send notification: \(error.localizedDescription)"
            case .invalidConfiguration:
                return "Invalid notification configuration"
            }
        }
    }
    
    public enum NotificationCategory: String {
        case message = "MESSAGE"
        case update = "UPDATE"
        case alert = "ALERT"
    }
    
    private let center = UNUserNotificationCenter.current()
    
    public override init() {
        super.init()
        center.delegate = self
        setupNotificationCategories()
    }
    
    // MARK: - Permission Management
    
    /// Request notification permissions from the user
    public func requestPermission() async throws -> Bool {
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            return granted
        } catch {
            throw NotificationError.notificationFailed(error)
        }
    }
    
    /// Check current notification permission status
    public func checkPermissionStatus() async -> UNAuthorizationStatus {
        let settings = await center.notificationSettings()
        return settings.authorizationStatus
    }
    
    // MARK: - Notification Categories
    
    private func setupNotificationCategories() {
        let messageCategory = UNNotificationCategory(
            identifier: NotificationCategory.message.rawValue,
            actions: [
                UNNotificationAction(
                    identifier: "REPLY",
                    title: "Reply",
                    options: [.foreground]
                ),
                UNNotificationAction(
                    identifier: "MARK_READ",
                    title: "Mark as Read",
                    options: []
                )
            ],
            intentIdentifiers: [],
            options: []
        )
        
        let updateCategory = UNNotificationCategory(
            identifier: NotificationCategory.update.rawValue,
            actions: [
                UNNotificationAction(
                    identifier: "VIEW",
                    title: "View",
                    options: [.foreground]
                )
            ],
            intentIdentifiers: [],
            options: []
        )
        
        let alertCategory = UNNotificationCategory(
            identifier: NotificationCategory.alert.rawValue,
            actions: [
                UNNotificationAction(
                    identifier: "DISMISS",
                    title: "Dismiss",
                    options: [.destructive]
                )
            ],
            intentIdentifiers: [],
            options: []
        )
        
        center.setNotificationCategories([messageCategory, updateCategory, alertCategory])
    }
    
    // MARK: - Sending Notifications
    
    /// Send a local notification
    public func sendNotification(
        title: String,
        body: String,
        category: NotificationCategory = .message,
        userInfo: [String: Any] = [:],
        sound: UNNotificationSound? = .default,
        badge: NSNumber? = nil
    ) async throws {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.categoryIdentifier = category.rawValue
        content.userInfo = userInfo
        
        if let sound = sound {
            content.sound = sound
        }
        
        if let badge = badge {
            content.badge = badge
        }
        
        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil // Deliver immediately
        )
        
        do {
            try await center.add(request)
        } catch {
            throw NotificationError.notificationFailed(error)
        }
    }
    
    /// Schedule a notification for a specific time
    public func scheduleNotification(
        title: String,
        body: String,
        date: Date,
        category: NotificationCategory = .message,
        userInfo: [String: Any] = [:],
        repeats: Bool = false
    ) async throws {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.categoryIdentifier = category.rawValue
        content.userInfo = userInfo
        content.sound = .default
        
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: repeats)
        
        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: trigger
        )
        
        do {
            try await center.add(request)
        } catch {
            throw NotificationError.notificationFailed(error)
        }
    }
    
    // MARK: - Managing Notifications
    
    /// Get all pending notifications
    public func getPendingNotifications() async -> [UNNotificationRequest] {
        return await center.pendingNotificationRequests()
    }
    
    /// Get all delivered notifications
    public func getDeliveredNotifications() async -> [UNNotification] {
        return await center.deliveredNotifications()
    }
    
    /// Remove pending notifications by identifier
    public func removePendingNotifications(withIdentifiers identifiers: [String]) {
        center.removePendingNotificationRequests(withIdentifiers: identifiers)
    }
    
    /// Remove all pending notifications
    public func removeAllPendingNotifications() {
        center.removeAllPendingNotificationRequests()
    }
    
    /// Remove delivered notifications by identifier
    public func removeDeliveredNotifications(withIdentifiers identifiers: [String]) {
        center.removeDeliveredNotifications(withIdentifiers: identifiers)
    }
    
    /// Remove all delivered notifications
    public func removeAllDeliveredNotifications() {
        center.removeAllDeliveredNotifications()
    }
    
    /// Clear badge count
    public func clearBadge() {
        #if os(macOS)
        NSApplication.shared.dockTile.badgeLabel = nil
        #elseif os(iOS)
        UIApplication.shared.applicationIconBadgeNumber = 0
        #endif
    }
}

// MARK: - UNUserNotificationCenterDelegate

extension NotificationManager: UNUserNotificationCenterDelegate {
    
    /// Handle notification when app is in foreground
    public func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        // Show notification even when app is in foreground
        completionHandler([.banner, .sound, .badge])
    }
    
    /// Handle notification response (user tapped notification)
    public func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo
        let actionIdentifier = response.actionIdentifier
        
        // Post notification for app to handle
        NotificationCenter.default.post(
            name: .notificationActionReceived,
            object: nil,
            userInfo: [
                "actionIdentifier": actionIdentifier,
                "userInfo": userInfo
            ]
        )
        
        completionHandler()
    }
}

// MARK: - Notification Names

extension Notification.Name {
    public static let notificationActionReceived = Notification.Name("notificationActionReceived")
}
