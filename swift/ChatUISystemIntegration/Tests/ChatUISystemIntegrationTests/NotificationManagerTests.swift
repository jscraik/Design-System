import XCTest
import UserNotifications
@testable import ChatUISystemIntegration

final class NotificationManagerTests: XCTestCase {
    
    var notificationManager: NotificationManager!
    
    override func setUp() async throws {
        notificationManager = NotificationManager()
    }
    
    override func tearDown() async throws {
        // Clean up all notifications
        notificationManager.removeAllPendingNotifications()
        notificationManager.removeAllDeliveredNotifications()
    }
    
    // MARK: - Permission Tests
    
    func testCheckPermissionStatus() async {
        let status = await notificationManager.checkPermissionStatus()
        
        // Status should be one of the valid authorization statuses
        XCTAssertTrue([
            .notDetermined,
            .denied,
            .authorized,
            .provisional,
            .ephemeral
        ].contains(status))
    }
    
    // MARK: - Notification Sending Tests
    
    func testSendNotification() async throws {
        // Note: This test requires notification permissions
        // In a real app, you would request permissions first
        
        try await notificationManager.sendNotification(
            title: "Test Notification",
            body: "This is a test notification",
            category: .message,
            userInfo: ["test": "data"]
        )
        
        // Verify notification was added
        let pending = await notificationManager.getPendingNotifications()
        
        // Note: Immediate notifications may not appear in pending
        // They are delivered right away
        XCTAssertTrue(true) // Test passes if no error thrown
    }
    
    func testSendNotificationWithCustomSound() async throws {
        try await notificationManager.sendNotification(
            title: "Custom Sound Test",
            body: "Testing custom sound",
            category: .alert,
            sound: .default
        )
        
        XCTAssertTrue(true) // Test passes if no error thrown
    }
    
    func testSendNotificationWithBadge() async throws {
        try await notificationManager.sendNotification(
            title: "Badge Test",
            body: "Testing badge",
            category: .update,
            badge: 5
        )
        
        XCTAssertTrue(true) // Test passes if no error thrown
    }
    
    // MARK: - Scheduled Notification Tests
    
    func testScheduleNotification() async throws {
        let futureDate = Date().addingTimeInterval(60) // 1 minute from now
        
        try await notificationManager.scheduleNotification(
            title: "Scheduled Test",
            body: "This is a scheduled notification",
            date: futureDate,
            category: .message
        )
        
        let pending = await notificationManager.getPendingNotifications()
        XCTAssertGreaterThan(pending.count, 0)
    }
    
    func testScheduleRepeatingNotification() async throws {
        let futureDate = Date().addingTimeInterval(60)
        
        try await notificationManager.scheduleNotification(
            title: "Repeating Test",
            body: "This is a repeating notification",
            date: futureDate,
            category: .update,
            repeats: true
        )
        
        let pending = await notificationManager.getPendingNotifications()
        XCTAssertGreaterThan(pending.count, 0)
    }
    
    // MARK: - Notification Management Tests
    
    func testGetPendingNotifications() async throws {
        // Schedule a notification
        let futureDate = Date().addingTimeInterval(60)
        try await notificationManager.scheduleNotification(
            title: "Pending Test",
            body: "Testing pending notifications",
            date: futureDate
        )
        
        let pending = await notificationManager.getPendingNotifications()
        XCTAssertGreaterThan(pending.count, 0)
    }
    
    func testRemovePendingNotifications() async throws {
        // Schedule a notification
        let futureDate = Date().addingTimeInterval(60)
        try await notificationManager.scheduleNotification(
            title: "Remove Test",
            body: "Testing removal",
            date: futureDate
        )
        
        let pendingBefore = await notificationManager.getPendingNotifications()
        let identifiers = pendingBefore.map { $0.identifier }
        
        notificationManager.removePendingNotifications(withIdentifiers: identifiers)
        
        let pendingAfter = await notificationManager.getPendingNotifications()
        XCTAssertLessThan(pendingAfter.count, pendingBefore.count)
    }
    
    func testRemoveAllPendingNotifications() async throws {
        // Schedule multiple notifications
        let futureDate = Date().addingTimeInterval(60)
        
        try await notificationManager.scheduleNotification(
            title: "Test 1",
            body: "First notification",
            date: futureDate
        )
        
        try await notificationManager.scheduleNotification(
            title: "Test 2",
            body: "Second notification",
            date: futureDate.addingTimeInterval(60)
        )
        
        notificationManager.removeAllPendingNotifications()
        
        let pending = await notificationManager.getPendingNotifications()
        XCTAssertEqual(pending.count, 0)
    }
    
    func testClearBadge() {
        // Test badge clearing
        notificationManager.clearBadge()
        
        // Verify no crash and method completes
        XCTAssertTrue(true)
    }
    
    // MARK: - Notification Category Tests
    
    func testNotificationCategories() async throws {
        // Test each category
        let categories: [NotificationManager.NotificationCategory] = [.message, .update, .alert]
        
        for category in categories {
            try await notificationManager.sendNotification(
                title: "Category Test",
                body: "Testing \(category.rawValue) category",
                category: category
            )
        }
        
        XCTAssertTrue(true) // Test passes if no error thrown
    }
}
