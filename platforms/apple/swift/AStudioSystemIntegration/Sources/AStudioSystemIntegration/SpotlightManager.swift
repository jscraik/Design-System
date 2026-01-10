import Foundation
import CoreSpotlight
#if canImport(UniformTypeIdentifiers)
import UniformTypeIdentifiers
#endif

/// Manages Spotlight search integration for chat history
public class SpotlightManager {
    
    /// Errors thrown by Spotlight operations.
    public enum SpotlightError: Error, LocalizedError {
        case indexingFailed(Error)
        case searchFailed(Error)
        case invalidContent
        
        /// A localized description of the error.
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
    
    /// Creates a Spotlight manager.
    public init() {}
    
    // MARK: - Indexing Chat Messages
    
    /// Index a chat message for Spotlight search.
    /// - Parameter message: The message to index.
    /// - Throws: `SpotlightError` when indexing fails.
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
            domainIdentifier: "com.astudio.messages",
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
    
    /// Index multiple chat messages.
    /// - Parameter messages: The messages to index.
    /// - Throws: `SpotlightError` when indexing fails.
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
                domainIdentifier: "com.astudio.messages",
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
    
    /// Remove a specific chat message from Spotlight index.
    /// - Parameter id: The message identifier to remove.
    /// - Throws: `SpotlightError` when removal fails.
    public func removeChatMessage(withId id: String) async throws {
        do {
            try await searchableIndex.deleteSearchableItems(withIdentifiers: [id])
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    /// Remove multiple chat messages from Spotlight index.
    /// - Parameter ids: The message identifiers to remove.
    /// - Throws: `SpotlightError` when removal fails.
    public func removeChatMessages(withIds ids: [String]) async throws {
        do {
            try await searchableIndex.deleteSearchableItems(withIdentifiers: ids)
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    /// Remove all chat messages from Spotlight index.
    /// - Throws: `SpotlightError` when removal fails.
    public func removeAllChatMessages() async throws {
        do {
            try await searchableIndex.deleteSearchableItems(withDomainIdentifiers: ["com.astudio.messages"])
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    /// Remove all indexed items.
    /// - Throws: `SpotlightError` when removal fails.
    public func removeAllIndexedItems() async throws {
        do {
            try await searchableIndex.deleteAllSearchableItems()
        } catch {
            throw SpotlightError.indexingFailed(error)
        }
    }
    
    // MARK: - Search

    /// Search for chat messages in Spotlight.
    /// - Parameters:
    ///   - query: The query string to search for.
    ///   - limit: The maximum number of identifiers to return.
    /// - Returns: Matching message identifiers.
    /// - Throws: `SpotlightError` when the search fails.
    public func searchChatMessages(query: String, limit: Int = 20) async throws -> [String] {
        // Sanitize query to prevent injection attacks
        let sanitized = sanitizeSpotlightQuery(query)

        // Validate query length
        guard sanitized.count <= 100 else {
            throw SpotlightError.invalidContent
        }

        let escapedQuery = sanitized
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
        let queryString = "contentDescription == \"*\(escapedQuery)*\"cd || textContent == \"*\(escapedQuery)*\"cd"
        let clampedLimit = max(0, limit)
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
                    continuation.resume(returning: Array(identifiers.prefix(clampedLimit)))
                }
            }
            
            searchQuery.start()
        }
    }
    
    // MARK: - Helper Methods

    /// Sanitizes Spotlight query to prevent injection attacks
    /// - Parameter query: Raw query string
    /// - Returns: Sanitized query string
    private func sanitizeSpotlightQuery(_ query: String) -> String {
        // Allow only alphanumeric, spaces, and basic punctuation
        let allowed = CharacterSet.alphanumerics
            .union(CharacterSet.whitespaces)
            .union(CharacterSet(charactersIn: ".!?@-_"))

        return String(query.unicodeScalars.filter { allowed.contains($0) })
            .trimmingCharacters(in: .whitespaces)
    }

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
    /// UTType for chat message indexing.
    static let chatMessage = UTType(exportedAs: "com.astudio.chat-message")
}
