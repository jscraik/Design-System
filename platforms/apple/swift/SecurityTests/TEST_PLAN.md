# Security Test Suite Documentation

Last updated: 2026-01-04

## Doc requirements
- Audience: Maintainers and security reviewers
- Scope: Security posture, guidance, and required practices
- Non-scope: Feature usage or product marketing
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [Test Files](#test-files)
  - [ChatUIMCP Security Tests](#chatuimcp-security-tests)
  - [ChatUISystemIntegration Security Tests](#chatuisystemintegration-security-tests)
- [Test Execution](#test-execution)
  - [Running All Security Tests](#running-all-security-tests)
  - [Running Specific Test Suites](#running-specific-test-suites)
  - [Running with Coverage](#running-with-coverage)
- [CI Quality Gates](#ci-quality-gates)
  - [Coverage Requirements](#coverage-requirements)
  - [Security Requirements](#security-requirements)
  - [Performance Requirements](#performance-requirements)
  - [Flakiness Budget](#flakiness-budget)
- [Test Maintenance](#test-maintenance)
  - [Adding New Tests](#adding-new-tests)
  - [Updating Tests](#updating-tests)
  - [Test Anti-Patterns to Avoid](#test-anti-patterns-to-avoid)
- [Mock Data Generators](#mock-data-generators)
  - [Token Generator](#token-generator)
  - [URL Generator](#url-generator)
  - [ChatMessage Generator](#chatmessage-generator)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)
- [Summary](#summary)


## Overview

This document describes the comprehensive security test suites created for the ChatUI Swift codebase. The tests cover authentication, client validation, rate limiting, search security, and cryptographic operations.

## Test Files

### ChatUIMCP Security Tests

#### 1. MCPAuthenticatorSecurityTests.swift

**Location:** `platforms/apple/swift/ChatUIMCP/Tests/ChatUIMCPTests/Security/`

**Coverage:**
- Keychain accessibility controls
- Token storage and retrieval
- Token deletion
- Error handling
- Concurrent access
- Edge cases

**Test Categories:**
- **Keychain Accessibility Tests**
  - Verify `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` is set
  - Confirm items are not synchronizable via iCloud
  - Test accessibility attribute persistence

- **Token Storage Edge Cases**
  - Empty tokens
  - Very large tokens (10KB+)
  - Special characters and unicode
  - Emoji in tokens
  - Overwrite behavior

- **Token Retrieval Edge Cases**
  - Non-existent tokens
  - After deletion
  - Multiple accounts isolation

- **Token Deletion Edge Cases**
  - Delete non-existent tokens
  - Double deletion
  - Verification of removal

- **Token Update Edge Cases**
  - Update non-existent token (creates it)
  - Update with empty string
  - Preserving accessibility

- **Concurrent Access Tests**
  - Concurrent reads
  - Concurrent writes
  - Thread safety

- **Account Name Edge Cases**
  - Special characters
  - Very long names (1000 chars)
  - Unicode characters

- **Performance Tests**
  - Storage performance
  - Retrieval performance

- **Security Invariants**
  - Account isolation
  - Service name isolation

**Total Test Count:** 35+

---

#### 2. MCPClientValidationTests.swift

**Location:** `platforms/apple/swift/ChatUIMCP/Tests/ChatUIMCPTests/Security/`

**Coverage:**
- URL validation (HTTPS vs HTTP, localhost, blocked hosts)
- Tool name validation (format, length)
- Endpoint validation
- SSRF prevention

**Test Categories:**
- **URL Validation Tests**
  - HTTPS URLs accepted
  - Localhost HTTP URLs accepted
  - Non-localhost HTTP URLs rejected
  - Blocked metadata endpoints (AWS, GCP, Azure)
  - URLs without scheme rejected
  - URLs with empty host rejected
  - Private IP ranges
  - Query parameters and fragments
  - International domain names

- **Tool Name Validation Tests**
  - Valid tool names (alphanumeric, underscore, dash)
  - Invalid tool names (special characters, spaces)
  - Length boundary (64 char max)
  - Separator combinations

- **Endpoint Validation Tests**
  - Path handling
  - Empty endpoint path

- **SSRF Prevention Tests**
  - Internal network blocking
  - Cloud metadata endpoint blocking
  - Legitimate localhost allowed

- **Table-Driven Tests**
  - Comprehensive URL validation matrix
  - Comprehensive tool name validation matrix

**Total Test Count:** 40+

---

#### 3. MCPRateLimiterTests.swift

**Location:** `platforms/apple/swift/ChatUIMCP/Tests/ChatUIMCPTests/Security/`

**Coverage:**
- Rate limiting behavior
- Window expiration
- Concurrent requests
- Usage statistics

**Test Categories:**
- **Basic Rate Limiting Tests**
  - Requests under limit
  - Reset after window
  - Custom configurations

- **Window Expiration Tests**
  - Old requests expire
  - Sliding window behavior
  - Edge cases near boundary

- **Concurrent Request Tests**
  - Under limit
  - Exceeding limit
  - Across windows

- **Usage Statistics Tests**
  - Empty state
  - After requests
  - At limit
  - After expiration
  - Reset time accuracy

- **Reset Tests**
  - Manual reset
  - Reset while at limit

- **Edge Cases**
  - Zero request rate limiter
  - Very large rate limit
  - Very short time window
  - Very long time window

- **Traffic Pattern Tests**
  - Burst traffic
  - Gradual traffic

- **Table-Driven Tests**
  - Multiple rate limiting scenarios

- **Performance Tests**
  - Sequential performance
  - Concurrent performance

- **Thread Safety Tests**
  - High concurrency
  - Actor serialization

**Total Test Count:** 45+

---

### ChatUISystemIntegration Security Tests

#### 4. SpotlightManagerSecurityTests.swift

**Location:** `platforms/apple/swift/ChatUISystemIntegration/Tests/ChatUISystemIntegrationTests/Security/`

**Coverage:**
- Query sanitization
- SQL injection prevention
- Length validation
- Input validation

**Test Categories:**
- **Query Sanitization Tests**
  - Special characters removed
  - Wildcards handled safely
  - Control characters filtered

- **SQL Injection Prevention Tests**
  - Direct SQL injection attempts
  - Blind SQL injection attempts
  - No unauthorized data access

- **Input Validation Tests**
  - Length validation (100 char max)
  - Empty query handling
  - Unicode support

- **Path Traversal Prevention Tests**
  - File system paths blocked
  - No directory traversal

- **Command Injection Prevention Tests**
  - Shell command execution blocked
  - No code injection

- **XSS Prevention Tests**
  - Script tags sanitized
  - Event handlers blocked
  - JavaScript protocols blocked

- **Limit Validation Tests**
  - Valid limits
  - Zero/negative limits
  - Very large limits

- **Table-Driven Tests**
  - Comprehensive sanitization matrix

- **Integration Tests**
  - Search after indexing
  - Real-world scenarios

- **Performance Tests**
  - Malicious input handling

- **Edge Cases**
  - Special characters only
  - Mixed valid/invalid content

**Total Test Count:** 40+

---

#### 5. CryptoManagerTests.swift

**Location:** `platforms/apple/swift/ChatUISystemIntegration/Tests/ChatUISystemIntegrationTests/Security/`

**Coverage:**
- Encryption/decryption
- Key management
- Invalid data handling
- Security properties

**Test Categories:**
- **Basic Encryption/Decryption Tests**
  - Data round-trip
  - String round-trip
  - Ciphertext different from plaintext
  - Multiple encryptions produce different ciphertexts

- **Data Size Tests**
  - Empty data
  - Large data (1MB+)
  - Small data
  - Variable sizes

- **Invalid Data Handling Tests**
  - Invalid data rejected
  - Empty data rejected
  - Too short data rejected
  - Modified ciphertext detected
  - Wrong key detected

- **Key Management Tests**
  - Export and import key
  - Key size validation
  - Different managers have different keys

- **String Encoding Tests**
  - Special characters
  - Multiline strings
  - Invalid UTF-8 handling

- **Error Message Tests**
  - Descriptive errors
  - Error types

- **Table-Driven Tests**
  - Comprehensive encryption/decryption matrix

- **Performance Tests**
  - Large data encryption
  - Large data decryption
  - Small data operations

- **Concurrent Access Tests**
  - Concurrent encryption
  - Concurrent decryption
  - Actor serialization

- **Security Properties Tests**
  - Confidentiality verification
  - Integrity verification (authentication tag)
  - Key independence

- **Edge Cases**
  - Zero data
  - Patterned data

**Total Test Count:** 50+

---

## Test Execution

### Running All Security Tests

```bash
# Run ChatUIMCP security tests
cd platforms/apple/swift/ChatUIMCP
swift test --filter SecurityTests

# Run ChatUISystemIntegration security tests
cd platforms/apple/swift/ChatUISystemIntegration
swift test --filter SecurityTests
```

### Running Specific Test Suites

```bash
# MCPAuthenticator security tests
swift test --filter MCPAuthenticatorSecurityTests

# MCPClient validation tests
swift test --filter MCPClientValidationTests

# MCPRateLimiter tests
swift test --filter MCPRateLimiterTests

# SpotlightManager security tests
swift test --filter SpotlightManagerSecurityTests

# CryptoManager tests
swift test --filter CryptoManagerTests
```

### Running with Coverage

```bash
swift test --enable-code-coverage --filter SecurityTests
```

---

## CI Quality Gates

The following quality gates should be enforced in CI:

### Coverage Requirements
- **Line Coverage:** ≥85% for security modules
- **Branch Coverage:** ≥80% for security modules
- All security-critical paths must be covered

### Security Requirements
- All SSRF prevention tests must pass
- All injection prevention tests must pass
- All encryption/decryption tests must pass
- All authentication tests must pass

### Performance Requirements
- Encryption/decryption: <100ms for 1MB data
- Rate limiter overhead: <1ms per request
- Query sanitization: <10ms per query

### Flakiness Budget
- <0.5% flake rate for security tests
- No flaky tests allowed for security-critical functionality

---

## Test Maintenance

### Adding New Tests

1. Follow the existing naming convention: `*SecurityTests.swift`
2. Use table-driven tests for multiple similar cases
3. Include edge cases, error cases, and performance tests
4. Document the security property being tested
5. Use descriptive test names

### Updating Tests

1. When adding new security features, add corresponding tests
2. When fixing security issues, add regression tests
3. When refactoring, ensure all tests still pass
4. Update this documentation when adding new test suites

### Test Anti-Patterns to Avoid

1. **Brittle assertions** - Don't assert on exact encrypted values (they change with nonces)
2. **Timing-dependent tests** - Avoid relying on exact timing
3. **Hardcoded values** - Use generators where appropriate
4. **Testing implementation** - Test behavior, not internals
5. **Missing edge cases** - Always test boundaries and invalid inputs

---

## Mock Data Generators

### Token Generator

```swift
static func generateToken(length: Int = 32) -> String {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~"
    return String((0..<length).map { _ in chars.randomElement()! })
}
```

### URL Generator

```swift
static func generateURL(scheme: String, host: String, port: Int? = nil) -> URL {
    var components = URLComponents()
    components.scheme = scheme
    components.host = host
    components.port = port
    return components.url!
}
```

### ChatMessage Generator

```swift
static func generateMessage(id: String, content: String) -> ChatMessage {
    ChatMessage(
        id: id,
        sender: "Test User",
        content: content,
        timestamp: Date()
    )
}
```

---

## Known Limitations

1. **Spotlight Indexing Delay:** Some Spotlight tests may have timing dependencies due to indexing delays. Tests use wait times and may not always find indexed content immediately.

2. **Keychain Access:** Tests create real keychain items. They use unique account names to avoid conflicts but require proper cleanup.

3. **Network Mocking:** URL validation tests don't make actual network requests. Integration tests would be needed to test real MCP server communication.

4. **Thread Safety Verification:** While tests verify concurrent access works, they cannot prove the absence of all race conditions. Static analysis and code review are also important.

---

## Future Enhancements

1. **Fuzzing Tests:** Add property-based fuzzing for encryption/decryption
2. **Performance Regression Tests:** Establish performance baselines
3. **Integration Tests:** Test with real MCP servers and Spotlight
4. **Mutation Testing:** Verify test quality with mutation testing
5. **Continuous Monitoring:** Track test execution times and flakiness

---

## Summary

| Test Suite | Test Count | Coverage | Key Areas |
|------------|-----------|----------|-----------|
| MCPAuthenticatorSecurityTests | 35+ | Keychain operations | Token lifecycle, access control |
| MCPClientValidationTests | 40+ | Input validation | URL validation, SSRF prevention |
| MCPRateLimiterTests | 45+ | Rate limiting | DoS prevention, concurrency |
| SpotlightManagerSecurityTests | 40+ | Search security | Injection prevention, sanitization |
| CryptoManagerTests | 50+ | Cryptography | Encryption, key management |
| **Total** | **210+** | **Comprehensive** | **All security-critical code** |

All tests follow XCTest best practices with async/await support, table-driven test patterns, comprehensive edge case coverage, and performance benchmarks.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

