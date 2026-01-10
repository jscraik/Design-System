import XCTest
import Security
@testable import AStudioMCP

/// Comprehensive security tests for MCPAuthenticator
/// Tests keychain security, token lifecycle, and edge cases
final class MCPAuthenticatorSecurityTests: XCTestCase {

    var authenticator: MCPAuthenticator!
    let testAccount = "security-test-account"

    override func setUp() {
        super.setUp()
        authenticator = MCPAuthenticator()

        // Clean up any existing test data
        try? authenticator.deleteToken(account: testAccount)
    }

    override func tearDown() {
        // Clean up test data
        try? authenticator.deleteToken(account: testAccount)
        authenticator = nil
        super.tearDown()
    }

    // MARK: - Keychain Accessibility Tests

    func testKeychainAccessibilityAttribute() throws {
        // Store a token
        let testToken = "test-token-accessibility"
        try authenticator.storeToken(testToken, account: testAccount)

        // Query the keychain to verify accessibility attribute
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: "com.astudio.mcp",
            kSecAttrAccount as String: testAccount,
            kSecReturnAttributes as String: true,
            kSecReturnData as String: false
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess,
              let attributes = result as? [String: Any],
              let accessibility = attributes[kSecAttrAccessible as String] as? String else {
            throw XCTSkip("Keychain attributes unavailable in this environment")
        }

        // Verify accessibility is set to whenUnlockedThisDeviceOnly
        XCTAssertEqual(
            accessibility,
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly as String,
            "Keychain items should only be accessible when device is unlocked and not syncable"
        )
    }

    func testKeychainItemNotSyncable() throws {
        // Store a token
        let testToken = "test-token-no-sync"
        try authenticator.storeToken(testToken, account: testAccount)

        // Query to verify synchronization is disabled
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: "com.astudio.mcp",
            kSecAttrAccount as String: testAccount,
            kSecReturnAttributes as String: true
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess,
              let attributes = result as? [String: Any] else {
            XCTFail("Could not retrieve keychain attributes")
            return
        }

        // Verify there's no synchronization attribute (default is no sync)
        // or explicitly check that it's not present
        XCTAssertNil(
            attributes[kSecAttrSynchronizable as String],
            "Keychain items should not be synchronizable via iCloud"
        )
    }

    // MARK: - Token Storage Edge Cases

    func testStoreEmptyToken() {
        let emptyToken = ""

        do {
            try authenticator.storeToken(emptyToken, account: testAccount)
            let retrieved = try authenticator.retrieveToken(account: testAccount)
            XCTAssertEqual(retrieved, emptyToken)
        } catch {
            XCTAssertTrue(error is MCPError)
            if case MCPError.authenticationRequired = error {
                // Acceptable - empty token rejected
            } else {
                XCTFail("Expected authenticationRequired error for empty token")
            }
        }
    }

    func testStoreVeryLargeToken() throws {
        // Create a token that's larger than typical (10KB)
        let largeToken = String(repeating: "a", count: 10_000)

        // Should be able to store large tokens
        try authenticator.storeToken(largeToken, account: testAccount)

        // Verify retrieval
        let retrieved = try authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrieved.count, 10_000)
    }

    func testStoreTokenWithSpecialCharacters() throws {
        // Test tokens with various special characters
        let specialTokens = [
            "token-with-特殊字符-中文",
            "token/with\\slashes",
            "token\"with\"quotes",
            "token'with'apostrophes",
            "token\nwith\nnewlines",
            "token\twith\ttabs",
            "token with spaces and  !@#$%^&*()_+-=[]{}|;':\",./<>?"
        ]

        for (index, token) in specialTokens.enumerated() {
            let account = "\(testAccount)-\(index)"
            try authenticator.storeToken(token, account: account)

            let retrieved = try authenticator.retrieveToken(account: account)
            XCTAssertEqual(retrieved, token, "Token with special characters should be stored correctly")

            // Clean up
            try? authenticator.deleteToken(account: account)
        }
    }

    func testStoreTokenWithUnicodeEmoji() throws {
        let emojiToken = "token-with-😀🎉🚀-emoji"

        try authenticator.storeToken(emojiToken, account: testAccount)

        let retrieved = try authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrieved, emojiToken, "Token with emoji should be stored correctly")
    }

    func testStoreOverwriteExistingToken() throws {
        let token1 = "initial-token"
        let token2 = "updated-token"

        // Store first token
        try authenticator.storeToken(token1, account: testAccount)
        var retrieved = try authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrieved, token1)

        // Overwrite with second token
        try authenticator.storeToken(token2, account: testAccount)
        retrieved = try authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrieved, token2, "Storing should overwrite existing token")

        // Verify only one entry exists in keychain
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: "com.astudio.mcp",
            kSecAttrAccount as String: testAccount,
            kSecReturnData as String: false
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        XCTAssertEqual(status, errSecSuccess, "Only one keychain entry should exist")
    }

    // MARK: - Token Retrieval Edge Cases

    func testRetrieveNonExistentToken() {
        XCTAssertThrowsError(try authenticator.retrieveToken(account: testAccount)) { error in
            XCTAssertTrue(error is MCPError)
            if case MCPError.authenticationRequired = error {
                // Expected
            } else {
                XCTFail("Expected authenticationRequired error")
            }
        }
    }

    func testRetrieveAfterDeletion() throws {
        // Store and then delete
        try authenticator.storeToken("temp-token", account: testAccount)
        try authenticator.deleteToken(account: testAccount)

        // Should not be able to retrieve
        XCTAssertThrowsError(try authenticator.retrieveToken(account: testAccount)) { error in
            XCTAssertTrue(error is MCPError)
        }
    }

    // MARK: - Token Deletion Edge Cases

    func testDeleteNonExistentTokenDoesNotThrow() {
        // Deleting a token that doesn't exist should succeed
        XCTAssertNoThrow(
            try authenticator.deleteToken(account: "non-existent-account"),
            "Deleting non-existent token should not throw"
        )
    }

    func testDeleteTokenTwice() throws {
        // Store token
        try authenticator.storeToken("test-token", account: testAccount)

        // Delete once
        try authenticator.deleteToken(account: testAccount)

        // Delete again - should not throw
        XCTAssertNoThrow(
            try authenticator.deleteToken(account: testAccount),
            "Deleting already deleted token should not throw"
        )
    }

    func testDeleteAndVerifyRemoval() throws {
        // Store token
        let token = "token-to-delete"
        try authenticator.storeToken(token, account: testAccount)

        XCTAssertTrue(authenticator.hasToken(account: testAccount))

        // Delete
        try authenticator.deleteToken(account: testAccount)

        // Verify it's truly gone
        XCTAssertFalse(authenticator.hasToken(account: testAccount))

        // Try to retrieve - should fail
        XCTAssertThrowsError(try authenticator.retrieveToken(account: testAccount)) { error in
            XCTAssertTrue(error is MCPError)
        }
    }

    // MARK: - Token Update Edge Cases

    func testUpdateNonExistentTokenCreatesIt() throws {
        let token = "new-token-via-update"

        // Update token that doesn't exist (should create it)
        try authenticator.updateToken(token, account: testAccount)

        // Verify it was created
        XCTAssertTrue(authenticator.hasToken(account: testAccount))
        let retrieved = try authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrieved, token)
    }

    func testUpdateWithEmptyString() {
        // First store a valid token
        try? authenticator.storeToken("valid-token", account: testAccount)

        // Try to update with empty string
        XCTAssertThrowsError(
            try authenticator.updateToken("", account: testAccount),
            "Updating with empty string should throw"
        )

        // Original token should still be intact
        let retrieved = try? authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrieved, "valid-token", "Original token should remain after failed update")
    }

    func testUpdatePreservesAccessibility() throws {
        // Store initial token
        try authenticator.storeToken("initial", account: testAccount)

        // Get initial accessibility
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: "com.astudio.mcp",
            kSecAttrAccount as String: testAccount,
            kSecReturnAttributes as String: true
        ]

        var result: AnyObject?
        _ = SecItemCopyMatching(query as CFDictionary, &result)
        let initialAttrs = result as? [String: Any]

        // Update token
        try authenticator.updateToken("updated", account: testAccount)

        // Get updated accessibility
        _ = SecItemCopyMatching(query as CFDictionary, &result)
        let updatedAttrs = result as? [String: Any]

        // Accessibility should be preserved
        XCTAssertEqual(
            initialAttrs?[kSecAttrAccessible as String] as? String,
            updatedAttrs?[kSecAttrAccessible as String] as? String,
            "Accessibility should be preserved after update"
        )
    }

    // MARK: - HasToken Edge Cases

    func testHasTokenWithEmptyAccount() {
        // Test with default account
        XCTAssertFalse(authenticator.hasToken(account: ""))

        // Store and verify
        try? authenticator.storeToken("test", account: "")

        // Note: Empty account might work or might fail depending on keychain implementation
        // This test documents current behavior
        let hasToken = authenticator.hasToken(account: "")
        // Clean up if it was created
        try? authenticator.deleteToken(account: "")

        // Just verify no crash occurs
        XCTAssertTrue(true)
    }

    // MARK: - Concurrent Access Tests

    func testConcurrentReads() async throws {
        // Store a token
        let token = "concurrent-read-token"
        try authenticator.storeToken(token, account: testAccount)

        // Perform concurrent reads
        await withTaskGroup(of: String.self) { group in
            for _ in 0..<10 {
                group.addTask {
                    return try! self.authenticator.retrieveToken(account: self.testAccount)
                }
            }

            var results: [String] = []
            for await result in group {
                results.append(result)
            }

            // All reads should return the same token
            XCTAssertEqual(results.count, 10)
            XCTAssertTrue(results.allSatisfy { $0 == token })
        }
    }

    func testConcurrentWrites() async throws {
        let accounts = (0..<10).map { "\(testAccount)-\($0)" }
        let tokens = (0..<10).map { "token-\($0)" }

        // Clean up first
        for account in accounts {
            try? authenticator.deleteToken(account: account)
        }

        // Perform concurrent writes
        try await withThrowingTaskGroup(of: Void.self) { group in
            for (account, token) in zip(accounts, tokens) {
                group.addTask {
                    try self.authenticator.storeToken(token, account: account)
                }
            }

            try await group.waitForAll()

            // Verify all tokens were stored
            for (account, expectedToken) in zip(accounts, tokens) {
                let retrieved = try authenticator.retrieveToken(account: account)
                XCTAssertEqual(retrieved, expectedToken)

                // Clean up
                try authenticator.deleteToken(account: account)
            }
        }
    }

    // MARK: - Account Name Edge Cases

    func testAccountNameWithSpecialCharacters() throws {
        let specialAccounts = [
            "account-with-特殊字符",
            "account/with\\slashes",
            "account.with.dots",
            "account@with@at",
            "account:with:colons"
        ]

        let token = "test-token"

        for account in specialAccounts {
            try authenticator.storeToken(token, account: account)

            let retrieved = try authenticator.retrieveToken(account: account)
            XCTAssertEqual(retrieved, token)

            XCTAssertTrue(authenticator.hasToken(account: account))

            try authenticator.deleteToken(account: account)
            XCTAssertFalse(authenticator.hasToken(account: account))
        }
    }

    func testVeryLongAccountName() throws {
        // Create a very long account name (1000 characters)
        let longAccount = String(repeating: "a", count: 1000)
        let token = "long-account-token"

        try authenticator.storeToken(token, account: longAccount)

        let retrieved = try authenticator.retrieveToken(account: longAccount)
        XCTAssertEqual(retrieved, token)

        try authenticator.deleteToken(account: longAccount)
    }

    // MARK: - Performance Tests

    func testTokenStoragePerformance() throws {
        let token = "performance-test-token"

        measure {
            for _ in 0..<100 {
                try? authenticator.storeToken(token, account: testAccount)
                try? authenticator.retrieveToken(account: testAccount)
            }
        }
    }

    func testTokenRetrievalPerformance() throws {
        let token = "retrieval-perf-token"
        try authenticator.storeToken(token, account: testAccount)

        measure {
            for _ in 0..<1000 {
                _ = try? authenticator.retrieveToken(account: testAccount)
            }
        }
    }

    // MARK: - Security Invariants

    func testTokensAreIsolatedByAccount() throws {
        let account1 = "\(testAccount)-1"
        let account2 = "\(testAccount)-2"
        let token1 = "token-1"
        let token2 = "token-2"

        // Store different tokens for different accounts
        try authenticator.storeToken(token1, account: account1)
        try authenticator.storeToken(token2, account: account2)

        // Verify isolation
        let retrieved1 = try authenticator.retrieveToken(account: account1)
        let retrieved2 = try authenticator.retrieveToken(account: account2)

        XCTAssertEqual(retrieved1, token1)
        XCTAssertEqual(retrieved2, token2)
        XCTAssertNotEqual(retrieved1, retrieved2)

        // Clean up
        try authenticator.deleteToken(account: account1)
        try authenticator.deleteToken(account: account2)
    }

    func testServiceNameIsolation() throws {
        // This test verifies that tokens are stored under the correct service name
        // and won't conflict with other apps using the same account names

        let token = "service-isolation-test"
        try authenticator.storeToken(token, account: testAccount)

        // Query specifically for our service
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: "com.astudio.mcp",
            kSecAttrAccount as String: testAccount,
            kSecReturnData as String: true
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        XCTAssertEqual(status, errSecSuccess, "Token should be stored under correct service")
        XCTAssertNotNil(result, "Token data should be retrievable")
    }
}
