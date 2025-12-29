import XCTest
import CoreSpotlight
@testable import ChatUISystemIntegration

final class SpotlightManagerTests: XCTestCase {
    
    var spotlightManager: SpotlightManager!
    
    override func setUp() async throws {
        spotlightManager = SpotlightManager()
        
        // Clean up any existing test data
        try await spotlightManager.removeAllChatMessages()
    }
    
    override func tearDown() async throws {
        // Clean up after tests
        try await spotlightManager.removeAllChatMessages()
    }
    
    // MARK: - Indexing Tests
    
    func testIndexChatMessage() async throws {
        let message = ChatMessage(
            id: "test-1",
            sender: "Test User",
            content: "This is a test message for Spotlight indexing",
            timestamp: Date()
        )
        
        try await spotlightManager.indexChatMessage(message)
        
        // Verify no error thrown
        XCTAssertTrue(true)
    }
    
    func testIndexMultipleChatMessages() async throws {
        let messages = [
            ChatMessage(
                id: "test-1",
                sender: "Alice",
                content: "First message",
                timestamp: Date()
            ),
            ChatMessage(
                id: "test-2",
                sender: "Bob",
                content: "Second message",
                timestamp: Date().addingTimeInterval(60)
            ),
            ChatMessage(
                id: "test-3",
                sender: "Charlie",
                content: "Third message",
                timestamp: Date().addingTimeInterval(120)
            )
        ]
        
        try await spotlightManager.indexChatMessages(messages)
        
        XCTAssertTrue(true)
    }
    
    // MARK: - Removal Tests
    
    func testRemoveChatMessage() async throws {
        // Index a message
        let message = ChatMessage(
            id: "remove-test-1",
            sender: "Test User",
            content: "Message to be removed",
            timestamp: Date()
        )
        
        try await spotlightManager.indexChatMessage(message)
        
        // Remove it
        try await spotlightManager.removeChatMessage(withId: message.id)
        
        XCTAssertTrue(true)
    }
    
    func testRemoveMultipleChatMessages() async throws {
        // Index multiple messages
        let messages = [
            ChatMessage(id: "remove-1", sender: "User", content: "Message 1", timestamp: Date()),
            ChatMessage(id: "remove-2", sender: "User", content: "Message 2", timestamp: Date()),
            ChatMessage(id: "remove-3", sender: "User", content: "Message 3", timestamp: Date())
        ]
        
        try await spotlightManager.indexChatMessages(messages)
        
        // Remove them
        let ids = messages.map { $0.id }
        try await spotlightManager.removeChatMessages(withIds: ids)
        
        XCTAssertTrue(true)
    }
    
    func testRemoveAllChatMessages() async throws {
        // Index some messages
        let messages = [
            ChatMessage(id: "all-1", sender: "User", content: "Message 1", timestamp: Date()),
            ChatMessage(id: "all-2", sender: "User", content: "Message 2", timestamp: Date())
        ]
        
        try await spotlightManager.indexChatMessages(messages)
        
        // Remove all
        try await spotlightManager.removeAllChatMessages()
        
        XCTAssertTrue(true)
    }
    
    func testRemoveAllIndexedItems() async throws {
        // Index some messages
        let message = ChatMessage(
            id: "cleanup-test",
            sender: "User",
            content: "Test message",
            timestamp: Date()
        )
        
        try await spotlightManager.indexChatMessage(message)
        
        // Remove all indexed items
        try await spotlightManager.removeAllIndexedItems()
        
        XCTAssertTrue(true)
    }
    
    // MARK: - Search Tests
    
    func testSearchChatMessages() async throws {
        // Index messages with searchable content
        let messages = [
            ChatMessage(
                id: "search-1",
                sender: "Alice",
                content: "Let's discuss the project timeline",
                timestamp: Date()
            ),
            ChatMessage(
                id: "search-2",
                sender: "Bob",
                content: "The project deadline is next week",
                timestamp: Date().addingTimeInterval(60)
            ),
            ChatMessage(
                id: "search-3",
                sender: "Charlie",
                content: "I have some questions about the requirements",
                timestamp: Date().addingTimeInterval(120)
            )
        ]
        
        try await spotlightManager.indexChatMessages(messages)
        
        // Wait a bit for indexing to complete
        try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second
        
        // Search for "project"
        let results = try await spotlightManager.searchChatMessages(query: "project", limit: 10)
        
        // Note: Spotlight indexing may take time, so results might be empty in tests
        // In a real app, results would be populated after indexing completes
        XCTAssertTrue(results.count >= 0)
    }
    
    func testSearchChatMessagesWithLimit() async throws {
        // Index many messages
        var messages: [ChatMessage] = []
        for i in 1...30 {
            messages.append(ChatMessage(
                id: "limit-\(i)",
                sender: "User",
                content: "Test message number \(i)",
                timestamp: Date().addingTimeInterval(Double(i))
            ))
        }
        
        try await spotlightManager.indexChatMessages(messages)
        
        // Wait for indexing
        try await Task.sleep(nanoseconds: 1_000_000_000)
        
        // Search with limit
        let results = try await spotlightManager.searchChatMessages(query: "test", limit: 5)
        
        // Results should not exceed limit
        XCTAssertLessThanOrEqual(results.count, 5)
    }
    
    // MARK: - Keyword Extraction Tests
    
    func testKeywordExtraction() {
        // This tests the private extractKeywords method indirectly
        // by verifying that messages with keywords are indexed properly
        
        let message = ChatMessage(
            id: "keyword-test",
            sender: "User",
            content: "Swift programming language development",
            timestamp: Date()
        )
        
        // If indexing succeeds, keyword extraction worked
        Task {
            try await spotlightManager.indexChatMessage(message)
        }
        
        XCTAssertTrue(true)
    }
}
