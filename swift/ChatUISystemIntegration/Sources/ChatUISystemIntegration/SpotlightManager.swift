import Foundation
import CoreSpotlight
#if canImport(MobileCoreServices)
import MobileCoreServices
#endif

/// Manages Spotlight search integration for chat history
public class SpotlightManager {
    
    public enum SpotlightError: Error, LocalizedError {
        case indexingFailed(Error)
        case searchFailed(Error)
        case invalidContent
        
        public var errorDescription: String? {
            switch self {
            case .indexingFailed(let error):
                return "Failed to index content: \(error.localizedDescription)"
            case .searchFailed(let error):
                return "Failed to search: \(error.localizedDescription)"
            case .invalidContent:
                return "Invalid content for indexing"
            }
        }
    }
    
    private let searchableIndex = CSSearchableIndex.default()
    
    public init() {}
    
    // MARK: - Indexing Chat Messages
    
    /// Index a chat message for Spotlight search
    public func indexChatMessage(_ message: ChatMessage) async throws {
        let attributeSet = CSSearchableItemAttributeSet(contentType: .text)
        
        // Set basic attributes
        attributeSet.title = "Chat with \(message.sender)"
        attributeSet.contentDescription = message.content
        attributeSet.keywords = extractKeywords(from: message.content)
        
        // Set timestamps
        attributeSet.contentCreationDate = message.timestamp
        attributeSet.contentModificationDate = message.timestamp
        
        // Set additional metadata
        attributeSet.displayName = message.sender
        attributeSet.textContent = message.content
        
        // Create searchable item
        let item = CSSearchableItem(
            uniqueIdentifier: message.id,
            domainIdentifier: "com.chatui.messages",
            attributeSet: attributeSet
        )
        
        // Set expiration (optional - messages don't expire by default)
        // item.expirationDate = Date().addingTimeInterval(60 * 60 * 24 * 365) // 1 year
        
        do {
            try await searchableIndex.indexSearchableItems([item])
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    /// Index multiple chat messages
    public func indexChatMessages(_ messages: [ChatMessage]) async throws {
        let items = messages.map { message -> CSSearchableItem in
            let attributeSet = CSSearchableItemAttributeSet(contentType: .text)
            
            attributeSet.title = "Chat with \(message.sender)"
            attributeSet.contentDescription = message.content
            attributeSet.keywords = extractKeywords(from: message.content)
            attributeSet.contentCreationDate = message.timestamp
            attributeSet.contentModificationDate = message.timestamp
            attributeSet.displayName = message.sender
            attributeSet.textContent = message.content
            
            return CSSearchableItem(
                uniqueIdentifier: message.id,
                domainIdentifier: "com.chatui.messages",
                attributeSet: attributeSet
            )
        }
        
        do {
            try await searchableIndex.indexSearchableItems(items)
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    // MARK: - Removing Items
    
    /// Remove a specific chat message from Spotlight index
    public func removeChatMessage(withId id: String) async throws {
        do {
            try await searchableIndex.deleteSearchableItems(withIdentifiers: [id])
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    /// Remove multiple chat messages from Spotlight index
    public func removeChatMessages(withIds ids: [String]) async throws {
        do {
            try await searchableIndex.deleteSearchableItems(withIdentifiers: ids)
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    /// Remove all chat messages from Spotlight index
    public func removeAllChatMessages() async throws {
        do {
            try await searchableIndex.deleteSearchableItems(withDomainIdentifiers: ["com.chatui.messages"])
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    /// Remove all indexed items
    public func removeAllIndexedItems() async throws {
        do {
            try await searchableIndex.deleteAllSearchableItems()
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    // MARK: - Search
    
    /// Search for chat messages in Spotlight
    public func searchChatMessages(query: String, limit: Int = 20) async throws -> [String] {
        let queryString = "contentDescription == \"*\(query)*\"cd || textContent == \"*\(query)*\"cd"
        let searchQuery = CSSearchQuery(queryString: queryString, attributes: ["uniqueIdentifier"])
        
        return try await withCheckedThrowingContinuation { continuation in
            var identifiers: [String] = []
            
            searchQuery.foundItemsHandler = { items in
                identifiers.append(contentsOf: items.map { $0.uniqueIdentifier })
            }
            
            searchQuery.completionHandler = { error in
                if let error = error {
                    continuation.resume(throwing: SpotlightError.searchFailed(error))
                } else {
                    continuation.resume(returning: Array(identifiers.prefix(limit)))
                }
            }
            
            searchQuery.start()
        }
    }
    
    // MARK: - Helper Methods
    
    private func extractKeywords(from text: String) -> [String] {
        // Simple keyword extraction - split by whitespace and filter short words
        let words = text.components(separatedBy: .whitespacesAndNewlines)
        return words
            .filter { $0.count > 3 } // Only words longer than 3 characters
            .map { $0.lowercased() }
            .filter { !commonStopWords.contains($0) }
    }
    
    private let commonStopWords: Set<String> = [
        "the", "and", "for", "are", "but", "not", "you", "all", "can", "her",
        "was", "one", "our", "out", "day", "get", "has", "him", "his", "how",
        "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did",
        "its", "let", "put", "say", "she", "too", "use"
    ]
}

// MARK: - UTType Extension

extension UTType {
    static let chatMessage = UTType(exportedAs: "com.chatui.chat-message")
}
