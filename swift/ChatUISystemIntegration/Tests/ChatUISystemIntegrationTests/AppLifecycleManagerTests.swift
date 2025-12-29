import XCTest
@testable import ChatUISystemIntegration

final class AppLifecycleManagerTests: XCTestCase {
    
    var lifecycleManager: AppLifecycleManager!
    
    override func setUp() async throws {
        lifecycleManager = AppLifecycleManager()
    }
    
    override func tearDown() async throws {
        // Clean up all saved states
        let keys = try lifecycleManager.getAllStateKeys()
        for key in keys {
            try await lifecycleManager.deleteState(forKey: key)
        }
    }
    
    // MARK: - State Persistence Tests
    
    func testSaveAndRestoreState() async throws {
        struct TestState: Codable, Equatable {
            let value: String
            let number: Int
        }
        
        let state = TestState(value: "test", number: 42)
        
        try await lifecycleManager.saveState(state, forKey: "test_state")
        
        let restored = try await lifecycleManager.restoreState(forKey: "test_state", as: TestState.self)
        
        XCTAssertNotNil(restored)
        XCTAssertEqual(restored, state)
    }
    
    func testRestoreNonExistentState() async throws {
        struct TestState: Codable {
            let value: String
        }
        
        let restored = try await lifecycleManager.restoreState(
            forKey: "nonexistent",
            as: TestState.self
        )
        
        XCTAssertNil(restored)
    }
    
    func testDeleteState() async throws {
        struct TestState: Codable {
            let value: String
        }
        
        let state = TestState(value: "test")
        
        try await lifecycleManager.saveState(state, forKey: "delete_test")
        XCTAssertTrue(lifecycleManager.stateExists(forKey: "delete_test"))
        
        try await lifecycleManager.deleteState(forKey: "delete_test")
        XCTAssertFalse(lifecycleManager.stateExists(forKey: "delete_test"))
    }
    
    func testStateExists() async throws {
        struct TestState: Codable {
            let value: String
        }
        
        XCTAssertFalse(lifecycleManager.stateExists(forKey: "exists_test"))
        
        let state = TestState(value: "test")
        try await lifecycleManager.saveState(state, forKey: "exists_test")
        
        XCTAssertTrue(lifecycleManager.stateExists(forKey: "exists_test"))
    }
    
    func testGetAllStateKeys() async throws {
        struct TestState: Codable {
            let value: String
        }
        
        // Save multiple states
        try await lifecycleManager.saveState(TestState(value: "1"), forKey: "state_1")
        try await lifecycleManager.saveState(TestState(value: "2"), forKey: "state_2")
        try await lifecycleManager.saveState(TestState(value: "3"), forKey: "state_3")
        
        let keys = try lifecycleManager.getAllStateKeys()
        
        XCTAssertTrue(keys.contains("state_1"))
        XCTAssertTrue(keys.contains("state_2"))
        XCTAssertTrue(keys.contains("state_3"))
    }
    
    // MARK: - Chat Session Tests
    
    func testSaveAndRestoreChatSession() async throws {
        let messages = [
            ChatMessage(
                id: "1",
                sender: "User",
                content: "Hello",
                timestamp: Date()
            ),
            ChatMessage(
                id: "2",
                sender: "Assistant",
                content: "Hi there!",
                timestamp: Date().addingTimeInterval(60)
            )
        ]
        
        let session = ChatSession(
            id: "session-1",
            title: "Test Chat",
            messages: messages,
            created: Date(),
            lastModified: Date()
        )
        
        try await lifecycleManager.saveChatSession(session)
        
        let restored = try await lifecycleManager.restoreChatSession(id: "session-1")
        
        XCTAssertNotNil(restored)
        XCTAssertEqual(restored?.id, session.id)
        XCTAssertEqual(restored?.title, session.title)
        XCTAssertEqual(restored?.messages.count, session.messages.count)
    }
    
    func testGetAllChatSessions() async throws {
        // Create multiple sessions
        let session1 = ChatSession(
            id: "session-1",
            title: "Chat 1",
            messages: [],
            created: Date(),
            lastModified: Date()
        )
        
        let session2 = ChatSession(
            id: "session-2",
            title: "Chat 2",
            messages: [],
            created: Date().addingTimeInterval(-3600),
            lastModified: Date().addingTimeInterval(-1800)
        )
        
        try await lifecycleManager.saveChatSession(session1)
        try await lifecycleManager.saveChatSession(session2)
        
        let sessions = try await lifecycleManager.getAllChatSessions()
        
        XCTAssertGreaterThanOrEqual(sessions.count, 2)
        
        // Sessions should be sorted by lastModified (most recent first)
        if sessions.count >= 2 {
            XCTAssertGreaterThanOrEqual(
                sessions[0].lastModified,
                sessions[1].lastModified
            )
        }
    }
    
    // MARK: - Complex State Tests
    
    func testSaveComplexState() async throws {
        struct ComplexState: Codable, Equatable {
            let strings: [String]
            let numbers: [Int]
            let nested: NestedState
            
            struct NestedState: Codable, Equatable {
                let value: String
                let flag: Bool
            }
        }
        
        let state = ComplexState(
            strings: ["one", "two", "three"],
            numbers: [1, 2, 3, 4, 5],
            nested: ComplexState.NestedState(value: "nested", flag: true)
        )
        
        try await lifecycleManager.saveState(state, forKey: "complex_state")
        
        let restored = try await lifecycleManager.restoreState(
            forKey: "complex_state",
            as: ComplexState.self
        )
        
        XCTAssertNotNil(restored)
        XCTAssertEqual(restored, state)
    }
    
    // MARK: - Lifecycle Notification Tests
    
    func testLifecycleNotifications() {
        let expectation = XCTestExpectation(description: "Lifecycle notification received")
        
        let observer = NotificationCenter.default.addObserver(
            forName: .appDidBecomeActive,
            object: nil,
            queue: .main
        ) { _ in
            expectation.fulfill()
        }
        
        // Post notification
        NotificationCenter.default.post(name: .appDidBecomeActive, object: nil)
        
        wait(for: [expectation], timeout: 1.0)
        
        NotificationCenter.default.removeObserver(observer)
    }
    
    // MARK: - Error Handling Tests
    
    func testRestoreInvalidState() async {
        struct TestState: Codable {
            let value: String
        }
        
        struct DifferentState: Codable {
            let number: Int
        }
        
        // Save one type
        let state = TestState(value: "test")
        try? await lifecycleManager.saveState(state, forKey: "type_mismatch")
        
        // Try to restore as different type
        do {
            _ = try await lifecycleManager.restoreState(
                forKey: "type_mismatch",
                as: DifferentState.self
            )
            XCTFail("Should throw error for type mismatch")
        } catch {
            XCTAssertTrue(error is AppLifecycleManager.LifecycleError)
        }
    }
}
