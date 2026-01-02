import Foundation
import CryptoKit

/// Errors that can occur during MCP operations.
public enum MCPError: Error, LocalizedError {
    case invalidResponse
    case networkError(Error)
    case authenticationRequired
    case toolNotFound(String)
    case invalidToolArguments(String)
    case serverError(String)
    case protocolError(code: Int, message: String)
    case rateLimitExceeded(String)
    case certificatePinningFailed(String)
    case certificateValidationFailed(String)

    /// A user-facing description of the error.
    public var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Invalid response from MCP server"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .authenticationRequired:
            return "Authentication required"
        case .toolNotFound(let name):
            return "Tool not found: \(name)"
        case .invalidToolArguments(let details):
            return "Invalid tool arguments: \(details)"
        case .serverError(let message):
            return "Server error: \(message)"
        case .protocolError(let code, let message):
            return "Protocol error (\(code)): \(message)"
        case .rateLimitExceeded(let details):
            return "Rate limit exceeded: \(details)"
        case .certificatePinningFailed(let details):
            return "Certificate pinning failed: \(details)"
        case .certificateValidationFailed(let details):
            return "Certificate validation failed: \(details)"
        }
    }
}
