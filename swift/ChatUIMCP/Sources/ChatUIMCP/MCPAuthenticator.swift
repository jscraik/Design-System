import Foundation
import Security

/// Handles authentication for MCP tool calls using macOS Keychain
public class MCPAuthenticator {
    private let keychainService = "com.chatui.mcp"
    private let defaultAccount = "mcp-token"
    
    public init() {}
    
    /// Store authentication token in Keychain
    /// - Parameters:
    ///   - token: Authentication token to store
    ///   - account: Account identifier (defaults to "mcp-token")
    /// - Throws: MCPError if storage fails
    public func storeToken(_ token: String, account: String = "mcp-token") throws {
        guard let tokenData = token.data(using: .utf8) else {
            throw MCPError.authenticationRequired
        }
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: account,
            kSecValueData as String: tokenData
        ]
        
        // Delete existing item if present
        SecItemDelete(query as CFDictionary)
        
        // Add new item
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw MCPError.authenticationRequired
        }
    }
    
    /// Retrieve authentication token from Keychain
    /// - Parameter account: Account identifier (defaults to "mcp-token")
    /// - Returns: Authentication token
    /// - Throws: MCPError if retrieval fails
    public func retrieveToken(account: String = "mcp-token") throws -> String {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess,
              let data = result as? Data,
              let token = String(data: data, encoding: .utf8) else {
            throw MCPError.authenticationRequired
        }
        
        return token
    }
    
    /// Delete authentication token from Keychain
    /// - Parameter account: Account identifier (defaults to "mcp-token")
    /// - Throws: MCPError if deletion fails
    public func deleteToken(account: String = "mcp-token") throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: account
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw MCPError.authenticationRequired
        }
    }
    
    /// Check if authentication token exists
    /// - Parameter account: Account identifier (defaults to "mcp-token")
    /// - Returns: True if token exists, false otherwise
    public func hasToken(account: String = "mcp-token") -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: account,
            kSecReturnData as String: false
        ]
        
        let status = SecItemCopyMatching(query as CFDictionary, nil)
        return status == errSecSuccess
    }
    
    /// Update existing authentication token
    /// - Parameters:
    ///   - token: New authentication token
    ///   - account: Account identifier (defaults to "mcp-token")
    /// - Throws: MCPError if update fails
    public func updateToken(_ token: String, account: String = "mcp-token") throws {
        guard let tokenData = token.data(using: .utf8) else {
            throw MCPError.authenticationRequired
        }
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: account
        ]
        
        let attributes: [String: Any] = [
            kSecValueData as String: tokenData
        ]
        
        let status = SecItemUpdate(query as CFDictionary, attributes as CFDictionary)
        
        if status == errSecItemNotFound {
            // Token doesn't exist, create it
            try storeToken(token, account: account)
        } else if status != errSecSuccess {
            throw MCPError.authenticationRequired
        }
    }
}
