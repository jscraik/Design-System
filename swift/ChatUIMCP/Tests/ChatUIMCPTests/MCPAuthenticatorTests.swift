import XCTest
@testable import ChatUIMCP

final class MCPAuthenticatorTests: XCTestCase {
    var authenticator: MCPAuthenticator!
    let testAccount = "test-account"
    let testToken = "test-token-12345"
    
    override func setUp() {
        super.setUp()
        authenticator = MCPAuthenticator()
        
        // Clean up any existing test tokens
        try? authenticator.deleteToken(account: testAccount)
    }
    
    override func tearDown() {
        // Clean up test tokens
        try? authenticator.deleteToken(account: testAccount)
        authenticator = nil
        super.tearDown()
    }
    
    func testStoreAndRetrieveToken() throws {
        // Store token
        try authenticator.storeToken(testToken, account: testAccount)
        
        // Retrieve token
        let retrievedToken = try authenticator.retrieveToken(account: testAccount)
        
        // Verify token matches
        XCTAssertEqual(retrievedToken, testToken)
    }
    
    func testHasToken() throws {
        // Initially should not have token
        XCTAssertFalse(authenticator.hasToken(account: testAccount))
        
        // Store token
        try authenticator.storeToken(testToken, account: testAccount)
        
        // Should now have token
        XCTAssertTrue(authenticator.hasToken(account: testAccount))
    }
    
    func testUpdateToken() throws {
        // Store initial token
        try authenticator.storeToken(testToken, account: testAccount)
        
        // Update token
        let newToken = "new-token-67890"
        try authenticator.updateToken(newToken, account: testAccount)
        
        // Retrieve and verify new token
        let retrievedToken = try authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrievedToken, newToken)
    }
    
    func testUpdateNonExistentToken() throws {
        // Update token that doesn't exist (should create it)
        try authenticator.updateToken(testToken, account: testAccount)
        
        // Verify token was created
        let retrievedToken = try authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrievedToken, testToken)
    }
    
    func testDeleteToken() throws {
        // Store token
        try authenticator.storeToken(testToken, account: testAccount)
        XCTAssertTrue(authenticator.hasToken(account: testAccount))
        
        // Delete token
        try authenticator.deleteToken(account: testAccount)
        
        // Verify token is gone
        XCTAssertFalse(authenticator.hasToken(account: testAccount))
    }
    
    func testDeleteNonExistentToken() throws {
        // Deleting non-existent token should not throw
        XCTAssertNoThrow(try authenticator.deleteToken(account: testAccount))
    }
    
    func testRetrieveNonExistentToken() {
        // Retrieving non-existent token should throw
        XCTAssertThrowsError(try authenticator.retrieveToken(account: testAccount)) { error in
            XCTAssertTrue(error is MCPError)
            if case MCPError.authenticationRequired = error {
                // Expected error
            } else {
                XCTFail("Expected authenticationRequired error")
            }
        }
    }
    
    func testMultipleAccounts() throws {
        let account1 = "account1"
        let account2 = "account2"
        let token1 = "token1"
        let token2 = "token2"
        
        // Store tokens for different accounts
        try authenticator.storeToken(token1, account: account1)
        try authenticator.storeToken(token2, account: account2)
        
        // Verify both tokens are stored correctly
        let retrieved1 = try authenticator.retrieveToken(account: account1)
        let retrieved2 = try authenticator.retrieveToken(account: account2)
        
        XCTAssertEqual(retrieved1, token1)
        XCTAssertEqual(retrieved2, token2)
        
        // Clean up
        try authenticator.deleteToken(account: account1)
        try authenticator.deleteToken(account: account2)
    }
    
    func testStoreOverwritesExisting() throws {
        // Store initial token
        try authenticator.storeToken(testToken, account: testAccount)
        
        // Store new token (should overwrite)
        let newToken = "new-token"
        try authenticator.storeToken(newToken, account: testAccount)
        
        // Verify new token is stored
        let retrievedToken = try authenticator.retrieveToken(account: testAccount)
        XCTAssertEqual(retrievedToken, newToken)
    }
}
