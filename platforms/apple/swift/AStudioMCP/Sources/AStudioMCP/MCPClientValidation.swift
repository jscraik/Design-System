import Foundation

// MARK: - URL Validation Extension

extension MCPClient {
    /// Validates that a URL meets security requirements.
    /// - Parameter url: The URL to validate
    /// - Throws: MCPError if the URL is invalid
    func validateURL(_ url: URL) throws {
        // Only allow HTTPS or HTTP for localhost
        guard let scheme = url.scheme else {
            throw MCPError.invalidToolArguments("URL must have a scheme")
        }

        let isHTTPS = scheme == "https"
        let isLocalhostHTTP = scheme == "http" && (url.host == "localhost" || url.host == "127.0.0.1")

        guard isHTTPS || isLocalhostHTTP else {
            throw MCPError.invalidToolArguments("Only HTTPS or localhost HTTP allowed")
        }

        // Validate host is present and not empty
        guard let host = url.host, !host.isEmpty else {
            throw MCPError.invalidToolArguments("Invalid host")
        }

        // Prevent SSRF to internal networks (block metadata endpoints)
        let blockedHosts = [
            "169.254.169.254",           // AWS metadata
            "metadata.google.internal",  // GCP metadata
            "100.100.100.200"            // Azure metadata
        ]

        if blockedHosts.contains(host) {
            throw MCPError.invalidToolArguments("Access to internal networks is blocked")
        }
    }

    /// Validates that a tool name meets security requirements.
    /// - Parameter name: The tool name to validate
    /// - Throws: MCPError if the tool name is invalid
    func validateToolName(_ name: String) throws {
        // Allow alphanumeric, underscore, dash, max 64 chars
        let allowedPattern = "^[a-zA-Z0-9_-]{1,64}$"
        let regex = try? NSRegularExpression(pattern: allowedPattern)
        let range = NSRange(location: 0, length: name.utf16.count)

        guard regex?.firstMatch(in: name, options: [], range: range) != nil else {
            throw MCPError.invalidToolArguments("Invalid tool name format. Use alphanumeric, underscore, dash (max 64 chars)")
        }
    }

    /// Validates endpoint URL during initialization.
    /// - Parameter url: The endpoint URL to validate
    func validateEndpointURL(_ url: URL) throws {
        try validateURL(url)
    }
}
