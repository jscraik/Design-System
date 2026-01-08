# Swift Security Testing Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Maintainers and security reviewers
- Scope: Security posture, guidance, and required practices
- Non-scope: Feature usage or product marketing
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This guide provides comprehensive documentation for security testing in the Swift codebase, including testing patterns, CI/CD integration, and best practices.

## Table of Contents

1. [Overview](#overview)
2. [Security Test Categories](#security-test-categories)
3. [Running Security Tests](#running-security-tests)
4. [Writing Security Tests](#writing-security-tests)
5. [CI/CD Integration](#cicd-integration)
6. [Security Testing Patterns](#security-testing-patterns)
7. [Common Vulnerabilities](#common-vulnerabilities)

## Overview

The Swift security testing framework provides:

- **Input Validation Tests**: Ensure all user inputs are properly validated and sanitized
- **Authentication Tests**: Verify secure handling of credentials and session management
- **Authorization Tests**: Validate access control and permission checks
- **Automated Scanning**: SwiftLint, CodeQL, and dependency security scanning
- **CI/CD Gates**: Security checks must pass before merge

## Security Test Categories

### 1. Input Validation Tests

Located in `InputValidationTests.swift`

**What they test:**
- XSS (Cross-Site Scripting) prevention
- SQL injection prevention
- Path traversal prevention
- File upload security
- URL validation
- Email validation
- Length validation

**Example:**
```swift
func testTextInputValidation() {
    let maliciousInputs = ["<script>alert('XSS')</script>", "' OR '1'='1"]
    for input in maliciousInputs {
        let result = validateTextInput(input)
        if result.isValid {
            assertStringSanitized(result.sanitized)
        }
    }
}
```

### 2. Authentication Tests

Located in `AuthenticationTests.swift`

**What they test:**
- Password hashing (salted, not reversible)
- Password complexity requirements
- Secure token generation
- Session management and expiry
- Rate limiting on failed attempts
- Account lockout policies
- Keychain usage for sensitive data

**Example:**
```swift
func testPasswordNotStoredInPlaintext() {
    let password = "SecurePassword123!"
    let credential = storeCredential(password: password)

    XCTAssertNotEqual(credential.storedValue, password)
    XCTAssertNil(credential.retrievePassword())
}
```

### 3. Authorization Tests

Located in `AuthorizationTests.swift`

**What they test:**
- Role-based access control (RBAC)
- Resource ownership checks
- Privilege escalation prevention
- API endpoint protection
- Data isolation between users
- CSRF token validation

**Example:**
```swift
func testRoleBasedPermissions() {
    let user = createUser(role: .user)
    XCTAssertFalse(hasPermission(user, to: .deleteUsers))
}
```

## Running Security Tests

### Run All Security Tests

```bash
# From platforms/apple/swift directory
swift test --filter SecurityTest

# With coverage
swift test --enable-code-coverage --filter SecurityTest
```

### Run Specific Test Category

```bash
# Input validation only
swift test --filter InputValidationTests

# Authentication only
swift test --filter AuthenticationTests

# Authorization only
swift test --filter AuthorizationTests
```

### Generate Coverage Report

```bash
# Run tests with coverage
swift test --enable-code-coverage

# Generate report
xcrun llvm-cov report \
  $(find . -name "*.profdata") \
  $(find . -name "*.swiftmodule" -path "*/.build/*")

# Export as LCOV
xcrun llvm-cov export \
  $(find . -name "*.profdata") \
  $(find . -name "*.swiftmodule" -path "*/.build/*") \
  --format=lcov \
  > security-coverage.lcov
```

## Writing Security Tests

### Test Structure

All security tests should:

1. **Inherit from `SecurityTestCase`**
   ```swift
   final class MySecurityTests: SecurityTestCase {
       // tests here
   }
   ```

2. **Use provided helper methods**
   ```swift
   assertStringSanitized(input)
   assertURLSecure(urlString)
   assertNoSensitiveDataLogged(logMessage)
   ```

3. **Test with malicious inputs**
   ```swift
   let maliciousInputs = generateMaliciousStrings()
   for input in maliciousInputs {
       // test behavior
   }
   ```

### Common Test Patterns

#### 1. Input Sanitization Pattern

```swift
func testMaliciousInputSanitization() {
    let inputs = [
        "<script>alert('XSS')</script>",
        "' OR '1'='1",
        "../../../etc/passwd"
    ]

    for input in inputs {
        let result = sanitizeInput(input)
        assertStringSanitized(result)
    }
}
```

#### 2. Access Control Pattern

```swift
func testUnauthorizedAccessPrevented() {
    let user = createUser(role: .user)
    let adminResource = createResource(requiresAdmin: true)

    XCTAssertFalse(
        canAccess(user, resource: adminResource),
        "User should not access admin resource"
    )
}
```

#### 3. Secure Storage Pattern

```swift
func testSensitiveDataNotInUserDefaults() {
    let sensitiveData = "api_key_123"
    storeSensitiveData(sensitiveData)

    XCTAssertNil(
        UserDefaults.standard.string(forKey: "api_key"),
        "Sensitive data should not be in UserDefaults"
    )

    // Should be in Keychain instead
    XCTAssertEqual(
        retrieveFromKeychain(key: "api_key"),
        sensitiveData
    )
}
```

#### 4. Error Handling Pattern

```swift
func testErrorsDontLeakSensitiveInfo() {
    let result = performSensitiveOperation()

    if case .error(let message) = result {
        assertNoSensitiveDataLogged(message)
        XCTAssertFalse(message.contains("password"))
        XCTAssertFalse(message.contains("token"))
    }
}
```

## CI/CD Integration

### GitHub Actions Workflow

Security tests run automatically on:
- All pull requests
- Pushes to main/master
- Daily scheduled runs (2 AM UTC)
- Manual workflow dispatch

### Workflow: `swift-security.yml`

The workflow includes:

1. **SwiftLint Security Analysis**
   - Runs security-focused custom rules
   - Blocks on force unwrap, force cast, etc.
   - Detects hardcoded credentials, insecure URLs, etc.

2. **CodeQL Security Analysis**
   - Automated security vulnerability scanning
   - Swift-specific security queries
   - Results uploaded to GitHub Security tab

3. **Dependency Security Scan**
   - Scans Package.resolved files
   - Checks for known vulnerabilities
   - Generates security reports

4. **Security Test Suite**
   - Runs all security tests
   - Enforces 80% coverage threshold
   - Generates coverage reports

### Security Gates

All security checks must pass before merge:

```yaml
security-gate:
  needs: [swiftlint, codeql, dependency-security, security-tests]
  # Fails if any dependency fails
```

### Local Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Run SwiftLint
swiftlint lint --strict

# Run security tests
cd platforms/apple/swift
swift test --filter SecurityTest

# Block commit if tests fail
if [ $? -ne 0 ]; then
    echo "Security tests failed. Commit blocked."
    exit 1
fi
```

## Security Testing Patterns

### 1. Boundary Testing

Test minimum and maximum values:

```swift
func testLengthBoundaries() {
    let empty = ""
    let maxLength = String(repeating: "a", count: 1000000)
    let valid = "normal input"

    XCTAssertFalse(validateLength(empty))
    XCTAssertFalse(validateLength(maxLength))
    XCTAssertTrue(validateLength(valid))
}
```

### 2. Encoding Testing

Test various character encodings:

```swift
func testUnicodeHandling() {
    let inputs = [
        "Hello, World!",
        "مرحبا",
        "你好",
        "Привет",
        "🎉🔥💀",
        "\uFE64script\uFE65" // Unicode bypass attempt
    ]

    for input in inputs {
        let result = processInput(input)
        XCTAssertNotNil(result)
    }
}
```

### 3. Timing Attack Prevention

Test that operations don't leak information through timing:

```swift
func testConstantTimeComparison() {
    let correct = "correct_password"
    let wrong = "wrong_password"

    let time1 = measure { comparePasswords(correct, correct) }
    let time2 = measure { comparePasswords(correct, wrong) }

    // Times should be similar (within 10%)
    XCTAssertLessThan(abs(time1 - time2) / time1, 0.1)
}
```

### 4. Race Condition Testing

Test concurrent access to shared resources:

```swift
func testConcurrentAccess() {
    let resource = ProtectedResource()
    let expectations = (0..<10).map { _ in XCTestExpectation() }

    DispatchQueue.concurrentPerform(iterations: 10) { i in
        resource.access()
        expectations[i].fulfill()
    }

    wait(for: expectations, timeout: 1.0)
    // Verify no data corruption occurred
    XCTAssert(resource.verifyIntegrity())
}
```

## Common Vulnerabilities

### 1. Injection Attacks

**SQL Injection:**
```swift
// BAD
let query = "SELECT * FROM users WHERE name = '\(name)'"

// GOOD
let query = "SELECT * FROM users WHERE name = ?"
db.execute(query, parameters: [name])
```

**Command Injection:**
```swift
// BAD
let output = Process.execute("ls \(path)")

// GOOD
let output = Process.execute("/bin/ls", arguments: [path])
```

### 2. XSS (Cross-Site Scripting)

```swift
// BAD
let html = "<div>\(userInput)</div>"

// GOOD
let html = "<div>\(escapeHTML(userInput))</div>"
```

### 3. Path Traversal

```swift
// BAD
let content = try readFile("/var/www/" + userPath)

// GOOD
let resolved = resolvePath("/var/www/", userPath)
guard !resolved.contains("..") else { throw Error.invalidPath }
let content = try readFile(resolved)
```

### 4. Insecure Random

```swift
// BAD
let random = Int(arc4random_uniform(100))

// GOOD
let random = SystemRandomNumberGenerator().next()
```

### 5. Weak Crypto

```swift
// BAD
let hash = input.md5

// GOOD
let hash = SHA256.hash(data: input.data(using: .utf8)!)
```

## Best Practices

1. **Never trust user input** - Always validate and sanitize
2. **Use Keychain for sensitive data** - Never UserDefaults
3. **Enforce HTTPS** - Never allow HTTP URLs
4. **Hash passwords** - Never store plaintext
5. **Use secure random** - Never arc4random for security
6. **Implement rate limiting** - Prevent brute force attacks
7. **Log security events** - But never log sensitive data
8. **Keep dependencies updated** - Run security scans regularly
9. **Follow principle of least privilege** - Minimal required access
10. **Test security boundaries** - Don't trust implementation details

## Additional Resources

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Apple Security Documentation](https://developer.apple.com/documentation/security)
- [SwiftLint Rules](https://github.com/realm/SwiftLint/blob/master/Rules.md)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Common Crypto Documentation](https://developer.apple.com/documentation/commoncrypto)

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

