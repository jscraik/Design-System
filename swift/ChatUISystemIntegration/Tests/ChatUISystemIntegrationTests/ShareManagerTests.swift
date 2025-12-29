import XCTest
@testable import ChatUISystemIntegration

final class ShareManagerTests: XCTestCase {
    
    var shareManager: ShareManager!
    
    override func setUp() async throws {
        shareManager = ShareManager()
    }
    
    // MARK: - Chat Transcript Tests
    
    func testCreateChatTranscript() {
        let messages = [
            ChatMessage(
                id: "1",
                sender: "Alice",
                content: "Hello!",
                timestamp: Date()
            ),
            ChatMessage(
                id: "2",
                sender: "Bob",
                content: "Hi there!",
                timestamp: Date().addingTimeInterval(60)
            ),
            ChatMessage(
                id: "3",
                sender: "Alice",
                content: "How are you?",
                timestamp: Date().addingTimeInterval(120)
            )
        ]
        
        let transcript = shareManager.createChatTranscript(messages: messages)
        
        XCTAssertTrue(transcript.contains("Chat Transcript"))
        XCTAssertTrue(transcript.contains("Alice: Hello!"))
        XCTAssertTrue(transcript.contains("Bob: Hi there!"))
        XCTAssertTrue(transcript.contains("Alice: How are you?"))
    }
    
    func testCreateChatTranscriptEmpty() {
        let transcript = shareManager.createChatTranscript(messages: [])
        
        XCTAssertTrue(transcript.contains("Chat Transcript"))
        XCTAssertTrue(transcript.contains("Generated:"))
    }
    
    func testExportChatHistory() async throws {
        let messages = [
            ChatMessage(
                id: "1",
                sender: "User",
                content: "Test message",
                timestamp: Date()
            )
        ]
        
        let tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("test_export.txt")
        
        try await shareManager.exportChatHistory(messages: messages, to: tempURL)
        
        XCTAssertTrue(FileManager.default.fileExists(atPath: tempURL.path))
        
        let content = try String(contentsOf: tempURL, encoding: .utf8)
        XCTAssertTrue(content.contains("User: Test message"))
        
        // Cleanup
        try? FileManager.default.removeItem(at: tempURL)
    }
    
    // MARK: - Platform-Specific Tests
    
    #if os(macOS)
    func testAvailableServices() {
        let items = ["Test text"]
        let services = shareManager.availableServices(for: items)
        
        // Should have at least some sharing services available
        XCTAssertGreaterThan(services.count, 0)
    }
    
    func testAvailableServicesForURL() {
        let url = URL(string: "https://example.com")!
        let services = shareManager.availableServices(for: [url])
        
        XCTAssertGreaterThan(services.count, 0)
    }
    #endif
    
    // MARK: - Error Handling Tests
    
    func testExportChatHistoryInvalidPath() async {
        let messages = [
            ChatMessage(
                id: "1",
                sender: "User",
                content: "Test",
                timestamp: Date()
            )
        ]
        
        let invalidURL = URL(fileURLWithPath: "/invalid/path/export.txt")
        
        do {
            try await shareManager.exportChatHistory(messages: messages, to: invalidURL)
            XCTFail("Should throw error for invalid path")
        } catch {
            XCTAssertTrue(error is ShareManager.ShareError)
        }
    }
    
    // MARK: - ChatMessage Tests
    
    func testChatMessageCodable() throws {
        let message = ChatMessage(
            id: "test-id",
            sender: "Test User",
            content: "Test content",
            timestamp: Date()
        )
        
        let encoder = JSONEncoder()
        let data = try encoder.encode(message)
        
        let decoder = JSONDecoder()
        let decoded = try decoder.decode(ChatMessage.self, from: data)
        
        XCTAssertEqual(decoded.id, message.id)
        XCTAssertEqual(decoded.sender, message.sender)
        XCTAssertEqual(decoded.content, message.content)
    }
}
