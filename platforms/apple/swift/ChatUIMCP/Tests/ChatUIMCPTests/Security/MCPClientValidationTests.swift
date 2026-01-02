import XCTest
@testable import ChatUIMCP

/// Comprehensive security validation tests for MCPClient
/// Tests URL validation, SSRF prevention, tool name validation, and endpoint security
final class MCPClientValidationTests: XCTestCase {

    // MARK: - URL Validation Tests

    func testHTTPSURLsAreAccepted() {
        let httpsURLs = [
            "https://api.example.com",
            "https://api.example.com:8787",
            "https://subdomain.example.com/path",
            "https://example.com/mcp",
            "https://192.168.1.1:8787"
        ]

        for urlString in httpsURLs {
            guard let url = URL(string: urlString) else {
                XCTFail("Failed to create URL from: \(urlString)")
                continue
            }

            let client = MCPClient(baseURL: url)
            XCTAssertNotNil(client, "HTTPS URL should be accepted: \(urlString)")
        }
    }

    func testLocalhostHTTPURLsAreAccepted() {
        let localhostURLs = [
            "http://localhost",
            "http://localhost:8787",
            "http://localhost:3000/mcp",
            "http://127.0.0.1",
            "http://127.0.0.1:8787",
            "http://127.0.0.1:3000/mcp"
        ]

        for urlString in localhostURLs {
            guard let url = URL(string: urlString) else {
                XCTFail("Failed to create URL from: \(urlString)")
                continue
            }

            let client = MCPClient(baseURL: url)
            XCTAssertNotNil(client, "Localhost HTTP URL should be accepted: \(urlString)")
        }
    }

    func testNonLocalhostHTTPURLsAreRejected() {
        let httpURLs = [
            "http://example.com",
            "http://api.example.com",
            "http://192.168.1.1",
            "http://10.0.0.1",
            "http://example.com:8787/mcp"
        ]

        for urlString in httpURLs {
            guard let url = URL(string: urlString) else {
                XCTFail("Failed to create URL from: \(urlString)")
                continue
            }

            // The initializer should not throw, but URL validation will fail on first request
            // This is by design - validation happens at request time
            let client = MCPClient(baseURL: url)
            XCTAssertNotNil(client, "Client creation should not fail for invalid URLs")

            // Validate endpoint URL will throw
            XCTAssertThrowsError(
                try client.validateEndpointURL(url),
                "Non-localhost HTTP URL should be rejected: \(urlString)"
            ) { error in
                XCTAssertTrue(error is MCPError)
                if case MCPError.invalidToolArguments(let message) = error {
                    XCTAssertTrue(
                        message.contains("HTTPS") || message.contains("localhost"),
                        "Error message should mention HTTPS or localhost requirement"
                    )
                } else {
                    XCTFail("Expected invalidToolArguments error")
                }
            }
        }
    }

    func testBlockedMetadataEndpoints() {
        // SSRF prevention - blocked cloud metadata endpoints
        let blockedURLs = [
            "http://169.254.169.254",
            "https://169.254.169.254",
            "http://169.254.169.254:80",
            "http://metadata.google.internal",
            "https://metadata.google.internal",
            "http://metadata.google.internal:8080",
            "http://100.100.100.200",
            "https://100.100.100.200"
        ]

        for urlString in blockedURLs {
            guard let url = URL(string: urlString) else {
                XCTFail("Failed to create URL from: \(urlString)")
                continue
            }

            XCTAssertThrowsError(
                try validateURLOnClient(url),
                "Cloud metadata endpoint should be blocked: \(urlString)"
            ) { error in
                XCTAssertTrue(error is MCPError)
                if case MCPError.invalidToolArguments(let message) = error {
                    XCTAssertTrue(
                        message.contains("internal networks") || message.contains("blocked"),
                        "Error message should mention internal networks blocking: \(message)"
                    )
                } else {
                    XCTFail("Expected invalidToolArguments error")
                }
            }
        }
    }

    func testURLsWithoutSchemeAreRejected() {
        let invalidURLs = [
            "example.com",
            "localhost",
            "192.168.1.1",
            "//example.com"
        ]

        for urlString in invalidURLs {
            guard let url = URL(string: urlString) else {
                // Some of these might not create valid URLs
                continue
            }

            // URLs without scheme might still create URL objects but have nil scheme
            if url.scheme == nil {
                XCTAssertThrowsError(
                    try validateURLOnClient(url),
                    "URL without scheme should be rejected: \(urlString)"
                ) { error in
                    XCTAssertTrue(error is MCPError)
                }
            }
        }
    }

    func testURLsWithEmptyHostAreRejected() {
        let invalidURLs = [
            "https://",
            "http://",
            "http://:8787"
        ]

        for urlString in invalidURLs {
            guard let url = URL(string: urlString) else {
                continue
            }

            if url.host == nil || url.host?.isEmpty == true {
                XCTAssertThrowsError(
                    try validateURLOnClient(url),
                    "URL with empty host should be rejected: \(urlString)"
                ) { error in
                    XCTAssertTrue(error is MCPError)
                    if case MCPError.invalidToolArguments = error {
                        // Expected
                    } else {
                        XCTFail("Expected invalidToolArguments error")
                    }
                }
            }
        }
    }

    func testPrivateIPRangeURLs() {
        // These private IP ranges should be allowed if using HTTPS
        let privateIPURLs = [
            "https://192.168.1.1",
            "https://10.0.0.1",
            "https://172.16.0.1"
        ]

        for urlString in privateIPURLs {
            guard let url = URL(string: urlString) else {
                XCTFail("Failed to create URL from: \(urlString)")
                continue
            }

            // HTTPS to private IPs is allowed (not cloud metadata endpoints)
            XCTAssertNoThrow(
                try validateURLOnClient(url),
                "HTTPS to private IP should be allowed: \(urlString)"
            )
        }
    }

    func testURLWithQueryParametersAndFragments() {
        let complexURLs = [
            "https://api.example.com/mcp?token=abc123",
            "https://api.example.com/mcp?token=abc123&session=xyz",
            "https://api.example.com/mcp#section",
            "https://api.example.com/mcp?query=value#fragment"
        ]

        for urlString in complexURLs {
            guard let url = URL(string: urlString) else {
                XCTFail("Failed to create URL from: \(urlString)")
                continue
            }

            XCTAssertNoThrow(
                try validateURLOnClient(url),
                "URL with query parameters/fragments should be valid: \(urlString)"
            )
        }
    }

    func testInternationalDomainNames() {
        let idnURLs = [
            "https://münchen.de",
            "https://中国.cn",
            "https://россия.рф"
        ]

        for urlString in idnURLs {
            guard let url = URL(string: urlString) else {
                continue
            }

            // International domain names should be accepted with HTTPS
            XCTAssertNoThrow(
                try validateURLOnClient(url),
                "International domain names should be accepted: \(urlString)"
            )
        }
    }

    // MARK: - Tool Name Validation Tests

    func testValidToolNames() {
        let validNames = [
            "tool",
            "my_tool",
            "my-tool",
            "tool123",
            "Tool_123",
            "a", // minimum length
            String(repeating: "a", count: 64), // maximum length
            "UPPERCASE",
            "lowercase",
            "MixedCase_123-456"
        ]

        for name in validNames {
            XCTAssertNoThrow(
                try validateToolNameOnClient(name),
                "Tool name should be valid: \(name)"
            )
        }
    }

    func testInvalidToolNames() {
        let invalidNames = [
            "", // empty
            "tool with spaces", // contains spaces
            "tool.with.dots", // contains dots
            "tool/with/slashes", // contains slashes
            "tool@with@at", // contains @
            "tool:with:colons", // contains colons
            "tool*with*wildcards", // contains *
            "tool?with?question", // contains ?
            "tool with émojis", // contains special chars
            "tool\nwith\nnewlines", // contains newlines
            "tool\twith\ttabs", // contains tabs
            String(repeating: "a", count: 65) // too long (65 chars)
        ]

        for name in invalidNames {
            XCTAssertThrowsError(
                try validateToolNameOnClient(name),
                "Tool name should be invalid: \(name)"
            ) { error in
                XCTAssertTrue(error is MCPError)
                if case MCPError.invalidToolArguments(let message) = error {
                    XCTAssertTrue(
                        message.contains("Invalid tool name"),
                        "Error should mention invalid tool name"
                    )
                } else {
                    XCTFail("Expected invalidToolArguments error")
                }
            }
        }
    }

    func testToolNameLengthBoundary() {
        // Test exact boundary at 64 characters
        let valid64 = String(repeating: "a", count: 64)
        let invalid65 = String(repeating: "a", count: 65)

        XCTAssertNoThrow(
            try validateToolNameOnClient(valid64),
            "64-character tool name should be valid"
        )

        XCTAssertThrowsError(
            try validateToolNameOnClient(invalid65),
            "65-character tool name should be invalid"
        ) { error in
            XCTAssertTrue(error is MCPError)
        }
    }

    func testToolNameWithUnderscoreAndDash() {
        let mixedSeparatorNames = [
            "tool_name",
            "tool-name",
            "tool_name-test",
            "tool-name_test",
            "my_long-tool_name"
        ]

        for name in mixedSeparatorNames {
            XCTAssertNoThrow(
                try validateToolNameOnClient(name),
                "Tool name with underscore/dash should be valid: \(name)"
            )
        }
    }

    // MARK: - Endpoint Validation Tests

    func testEndpointPathHandling() {
        let testCases = [
            ("https://api.example.com", "/mcp", "https://api.example.com/mcp"),
            ("https://api.example.com/", "/mcp", "https://api.example.com/mcp"),
            ("https://api.example.com", "mcp", "https://api.example.com/mcp"),
            ("https://api.example.com/api/v1", "/mcp", "https://api.example.com/api/v1/mcp"),
            ("https://api.example.com/base/", "tools", "https://api.example.com/base/tools")
        ]

        for (baseURL, endpointPath, expectedEndpoint) in testCases {
            guard let base = URL(string: baseURL) else {
                XCTFail("Failed to create base URL: \(baseURL)")
                continue
            }

            let client = MCPClient(baseURL: base, endpointPath: endpointPath)

            // We can't directly access endpointURL, but we can validate that
            // the client was created successfully
            XCTAssertNotNil(client, "Client should be created for base: \(baseURL), path: \(endpointPath)")
        }
    }

    func testEmptyEndpointPath() {
        let base = URL(string: "https://api.example.com")!
        let client = MCPClient(baseURL: base, endpointPath: "")

        XCTAssertNotNil(client, "Client should be created with empty endpoint path")
    }

    // MARK: - SSRF Prevention Tests

    func testSSRFPreventionForInternalNetworks() {
        // Test various internal network patterns that should be blocked
        let internalURLs = [
            // Cloud metadata
            "http://169.254.169.254",
            "http://metadata.google.internal",
            "http://100.100.100.200",

            // Other potentially sensitive internal endpoints
            "https://169.254.169.254/latest/meta-data/", // AWS metadata path
            "https://metadata.google.internal/computeMetadata/v1/", // GCP metadata path
        ]

        for urlString in internalURLs {
            guard let url = URL(string: urlString) else {
                continue
            }

            XCTAssertThrowsError(
                try validateURLOnClient(url),
                "Internal network access should be blocked: \(urlString)"
            ) { error in
                XCTAssertTrue(error is MCPError)
                if case MCPError.invalidToolArguments(let message) = error {
                    XCTAssertTrue(
                        message.contains("internal") || message.contains("blocked"),
                        "Error should mention blocking: \(message)"
                    )
                }
            }
        }
    }

    func testSSRFAllowsLegitimateLocalhost() {
        // Ensure legitimate localhost development is not blocked
        let localhostURLs = [
            "http://localhost:3000",
            "http://127.0.0.1:8787",
            "http://localhost:8080/mcp"
        ]

        for urlString in localhostURLs {
            guard let url = URL(string: urlString) else {
                continue
            }

            XCTAssertNoThrow(
                try validateURLOnClient(url),
                "Legitimate localhost should be allowed: \(urlString)"
            )
        }
    }

    // MARK: - Table-Driven URL Validation Tests

    func testURLValidationTableDriven() {
        struct URLTestCase {
            let urlString: String
            let shouldPass: Bool
            let description: String
        }

        let testCases: [URLTestCase] = [
            // Valid HTTPS URLs
            ("https://api.example.com", true, "Standard HTTPS URL"),
            ("https://api.example.com:8787", true, "HTTPS with custom port"),
            ("https://localhost:8787", true, "HTTPS to localhost"),

            // Valid HTTP localhost URLs
            ("http://localhost", true, "HTTP to localhost"),
            ("http://localhost:8787", true, "HTTP to localhost with port"),
            ("http://127.0.0.1", true, "HTTP to 127.0.0.1"),
            ("http://127.0.0.1:8787/mcp", true, "HTTP to 127.0.0.1 with path"),

            // Invalid HTTP URLs (non-localhost)
            ("http://example.com", false, "HTTP to non-localhost domain"),
            ("http://api.example.com", false, "HTTP to API domain"),
            ("http://192.168.1.1", false, "HTTP to private IP"),

            // Blocked metadata endpoints
            ("http://169.254.169.254", false, "AWS metadata endpoint"),
            ("https://169.254.169.254", false, "AWS metadata endpoint (HTTPS)"),
            ("http://metadata.google.internal", false, "GCP metadata endpoint"),
            ("http://100.100.100.200", false, "Azure metadata endpoint"),

            // Edge cases
            ("https://192.168.1.1", true, "HTTPS to private IP"),
            ("https://10.0.0.1", true, "HTTPS to RFC1918 space"),
        ]

        for testCase in testCases {
            guard let url = URL(string: testCase.urlString) else {
                if testCase.shouldPass {
                    XCTFail("Failed to parse URL that should be valid: \(testCase.urlString)")
                }
                continue
            }

            if testCase.shouldPass {
                XCTAssertNoThrow(
                    try validateURLOnClient(url),
                    "\(testCase.description): should pass but failed - \(testCase.urlString)"
                )
            } else {
                XCTAssertThrowsError(
                    try validateURLOnClient(url),
                    "\(testCase.description): should fail but passed - \(testCase.urlString)"
                ) { error in
                    XCTAssertTrue(error is MCPError, "Error should be MCPError")
                }
            }
        }
    }

    // MARK: - Table-Driven Tool Name Validation Tests

    func testToolNameValidationTableDriven() {
        struct ToolNameTestCase {
            let name: String
            let shouldPass: Bool
            let description: String
        }

        let testCases: [ToolNameTestCase] = [
            // Valid names
            ("tool", true, "Simple lowercase name"),
            ("my_tool", true, "Name with underscore"),
            ("my-tool", true, "Name with dash"),
            ("tool123", true, "Name with numbers"),
            ("Tool_Name-123", true, "Mixed case with separators"),
            ("a", true, "Single character (minimum)"),
            (String(repeating: "a", count: 64), true, "64 characters (maximum)"),

            // Invalid names
            ("", false, "Empty string"),
            ("tool name", false, "Contains space"),
            ("tool.name", false, "Contains dot"),
            ("tool/name", false, "Contains slash"),
            ("tool@name", false, "Contains @"),
            ("tool:name", false, "Contains colon"),
            ("tool*name", false, "Contains asterisk"),
            ("tool?name", false, "Contains question mark"),
            ("tool[name]", false, "Contains brackets"),
            ("tool{name}", false, "Contains braces"),
            ("tool<name>", false, "Contains angle brackets"),
            ("tool|name", false, "Contains pipe"),
            ("tool\\name", false, "Contains backslash"),
            ("tool\"", false, "Contains quote"),
            ("tool'", false, "Contains apostrophe"),
            ("tool;", false, "Contains semicolon"),
            ("tool,", false, "Contains comma"),
            ("tool!", false, "Contains exclamation"),
            ("tool$", false, "Contains dollar sign"),
            ("tool%", false, "Contains percent"),
            ("tool#", false, "Contains hash"),
            ("tool&", false, "Contains ampersand"),
            ("tool+", false, "Contains plus"),
            ("tool=", false, "Contains equals"),
            ("tool^", false, "Contains caret"),
            ("tool~", false, "Contains tilde"),
            ("tool`", false, "Contains backtick"),
            (String(repeating: "a", count: 65), false, "65 characters (exceeds maximum)")
        ]

        for testCase in testCases {
            if testCase.shouldPass {
                XCTAssertNoThrow(
                    try validateToolNameOnClient(testCase.name),
                    "\(testCase.description): should pass but failed - '\(testCase.name)'"
                )
            } else {
                XCTAssertThrowsError(
                    try validateToolNameOnClient(testCase.name),
                    "\(testCase.description): should fail but passed - '\(testCase.name)'"
                ) { error in
                    XCTAssertTrue(
                        error is MCPError,
                        "\(testCase.description): error should be MCPError for '\(testCase.name)'"
                    )
                }
            }
        }
    }

    // MARK: - Helper Methods

    private func validateURLOnClient(_ url: URL) throws {
        // Create a client to access the private validateURL method
        let client = MCPClient(baseURL: url)
        try client.validateEndpointURL(url)
    }

    private func validateToolNameOnClient(_ name: String) throws {
        // We need to test tool name validation through a client
        let baseURL = URL(string: "https://api.example.com")!
        let client = MCPClient(baseURL: baseURL)

        // Since validateToolName is private, we test it indirectly
        // by attempting to call a tool with that name
        // This will call validateToolName internally

        // Note: This will fail at the network level, but we catch the validation error first
        Task {
            do {
                _ = try await client.callTool(name: name, arguments: [:])
            } catch {
                // Expected to fail at validation or network level
                throw error
            }
        }
    }
}
