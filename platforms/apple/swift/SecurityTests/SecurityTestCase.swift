//
//  SecurityTestCase.swift
//  SecurityTests
//
//  Base test case for security-focused tests.
//  Provides common utilities and helpers for security testing.
//

import XCTest
@testable import AStudioFoundation
@testable import AStudioComponents

/// Base class for security tests providing common utilities
public class SecurityTestCase: XCTestCase {

    // MARK: - Test Helpers

    /// Asserts that a string is properly sanitized
    func assertStringSanitized(
        _ input: String,
        file: StaticString = #file,
        line: UInt = #line
    ) {
        // Check for common XSS patterns
        let xssPatterns = [
            "<script>",
            "javascript:",
            "onerror=",
            "onload=",
            "onclick=",
            "<iframe",
            "<embed",
            "<object"
        ]

        for pattern in xssPatterns {
            XCTAssertFalse(
                input.lowercased().contains(pattern),
                "String contains potential XSS pattern: \(pattern)",
                file: file,
                line: line
            )
        }

        // Check for SQL injection patterns
        let sqlPatterns = [
            "' OR '1'='1",
            "'; DROP TABLE",
            "UNION SELECT",
            "--",
            "/*",
            "*/"
        ]

        for pattern in sqlPatterns {
            XCTAssertFalse(
                input.uppercased().contains(pattern.uppercased()),
                "String contains potential SQL injection pattern: \(pattern)",
                file: file,
                line: line
            )
        }
    }

    /// Asserts that a URL uses HTTPS
    func assertURLSecure(
        _ urlString: String,
        file: StaticString = #file,
        line: UInt = #line
    ) {
        XCTAssertTrue(
            urlString.hasPrefix("https://"),
            "URL must use HTTPS, got: \(urlString)",
            file: file,
            line: line
        )
    }

    /// Asserts that sensitive data is not logged
    func assertNoSensitiveDataLogged(
        _ logMessage: String,
        file: StaticString = #file,
        line: UInt = #line
    ) {
        let sensitivePatterns = [
            "password",
            "token",
            "api_key",
            "secret",
            "credential",
            "ssn",
            "credit_card"
        ]

        for pattern in sensitivePatterns {
            XCTAssertFalse(
                logMessage.lowercased().contains(pattern),
                "Log message contains sensitive data pattern: \(pattern)",
                file: file,
                line: line
            )
        }
    }

    /// Asserts that input validation is performed
    func assertInputValidated<T>(
        _ input: T,
        validator: (T) -> Bool,
        file: StaticString = #file,
        line: UInt = #line
    ) {
        XCTAssertTrue(
            validator(input),
            "Input validation failed for: \(input)",
            file: file,
            line: line
        )
    }

    /// Asserts that error handling is proper
    func assertErrorHandled<T>(
        _ block: () throws -> T,
        file: StaticString = #file,
        line: UInt = #line
    ) {
        do {
            _ = try block()
        } catch {
            // Error was caught, which is expected
            return
        }

        XCTFail("Expected error to be handled", file: file, line: line)
    }

    // MARK: - Test Data Generators

    /// Generates malicious input strings for testing
    func generateMaliciousStrings() -> [String] {
        return [
            // XSS payloads
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')",
            "<iframe src='javascript:alert(XSS)'>",

            // SQL injection payloads
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT * FROM users--",
            "1' AND '1'='1",

            // Path traversal payloads
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "....//....//....//etc/passwd",

            // Command injection payloads
            "; rm -rf /",
            "| cat /etc/passwd",
            "$(whoami)",
            "`id`",

            // Null bytes
            "test\x00.png",
            "file\x00.txt",

            // Unicode bypass attempts
            "\uFE64script\uFE65alert('XSS')\uFE64/script\uFE65",
            "\u003Cscript\u003Ealert('XSS')\u003C/script\u003E"
        ]
    }

    /// Generates valid input strings for testing
    func generateValidStrings() -> [String] {
        return [
            "normal text",
            "user@example.com",
            "https://example.com/path",
            "12345",
            "valid-input_123",
            "Hello, World!"
        ]
    }

    /// Generates edge case inputs
    func generateEdgeCases() -> [String] {
        return [
            "",
            " ",
            "\n\t\r",
            String(repeating: "a", count: 10000), // Very long string
            String(repeating: " ", count: 1000), // Many spaces
            "a" * 0, // Empty through multiplication
            "!@#$%^&*()",
            "🎉🔥💀", // Emojis
            "aéîôüà", // Accented characters
            "مرحبا", // Arabic
            "你好", // Chinese
            "Привет", // Cyrillic
        ]
    }
}
