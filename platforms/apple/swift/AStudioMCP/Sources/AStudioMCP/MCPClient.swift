import Foundation

/// Client for communicating with MCP (Model Context Protocol) servers
public class MCPClient {
    private let endpointURL: URL
    private let session: URLSession
    private let authenticator: MCPAuthenticator
    private var sessionId: String?
    private let rateLimiter: MCPRateLimiter

    /// Initialize MCP client with base URL and MCP endpoint path.
    /// - Parameters:
    ///   - baseURL: Base URL of the MCP server (e.g., http://localhost:8787)
    ///   - endpointPath: Path to the MCP endpoint (default: /mcp)
    ///   - session: URLSession to use for requests (defaults to .shared)
    ///   - authenticator: Authenticator for handling credentials
    ///   - rateLimiter: Rate limiter used to gate outbound requests
    public init(
        baseURL: URL,
        endpointPath: String = "/mcp",
        session: URLSession = .shared,
        authenticator: MCPAuthenticator = MCPAuthenticator(),
        rateLimiter: MCPRateLimiter = MCPRateLimiter()
    ) {
        // Initialize endpoint URL first
        if endpointPath.isEmpty {
            self.endpointURL = baseURL
        } else if let resolved = URL(string: endpointPath, relativeTo: baseURL) {
            self.endpointURL = resolved
        } else {
            self.endpointURL = baseURL.appendingPathComponent(endpointPath)
        }

        // Initialize properties
        self.session = session
        self.authenticator = authenticator
        self.rateLimiter = rateLimiter

        // Validate the endpoint URL meets security requirements (after initialization)
        try? validateURL(self.endpointURL)
    }

    /// Initialize MCP client with certificate pinning.
    /// - Parameters:
    ///   - baseURL: Base URL of the MCP server
    ///   - endpointPath: Path to the MCP endpoint (default: /mcp)
    ///   - pinnedHashes: Array of base64-encoded certificate hashes for pinning
    ///   - hashType: Type of hash to use for pinning (default: SPKI SHA-256)
    ///   - pinningMode: Validation mode (default: strict)
    ///   - authenticator: Authenticator for handling credentials
    ///   - rateLimiter: Rate limiter used to gate outbound requests
    public convenience init(
        baseURL: URL,
        endpointPath: String = "/mcp",
        pinnedHashes: [String],
        hashType: PinningHashType = .spkiSHA256,
        pinningMode: PinningMode = .strict,
        authenticator: MCPAuthenticator = MCPAuthenticator(),
        rateLimiter: MCPRateLimiter = MCPRateLimiter()
    ) {
        let validator = CertificatePinningValidator(
            pinnedHashes: pinnedHashes,
            hashType: hashType,
            mode: pinningMode
        )
        let session = validator.createPinnedSession()

        self.init(
            baseURL: baseURL,
            endpointPath: endpointPath,
            session: session,
            authenticator: authenticator,
            rateLimiter: rateLimiter
        )
    }

    /// Call an MCP tool
    /// - Parameters:
    ///   - name: Name of the tool to call
    ///   - arguments: Arguments to pass to the tool
    /// - Returns: Tool response
    /// - Throws: MCPError if the call fails
    public func callTool(
        name: String,
        arguments: [String: Any] = [:]
    ) async throws -> MCPToolResponse {
        // Rate limiting check
        try await rateLimiter.acquire()

        // Validate tool name
        try validateToolName(name)

        let params = MCPToolCallParams(name: name, arguments: arguments)
        let response: MCPJSONRPCResponse<MCPToolCallResult> = try await sendRequest(
            method: "tools/call",
            params: params
        )

        if let error = response.error {
            throw MCPError.protocolError(code: error.code, message: error.message)
        }

        guard let result = response.result else {
            throw MCPError.invalidResponse
        }

        return MCPToolResponse(id: response.id, result: result, error: response.error)
    }
    
    /// List available tools from the MCP server.
    /// - Returns: Array of tool names
    /// - Throws: MCPError if the request fails
    public func listTools() async throws -> [String] {
        let response: MCPJSONRPCResponse<MCPToolListResult> = try await sendRequest(
            method: "tools/list",
            params: MCPToolListParams()
        )

        if let error = response.error {
            throw MCPError.protocolError(code: error.code, message: error.message)
        }

        guard let result = response.result else {
            throw MCPError.invalidResponse
        }

        return result.tools.map { $0.name }
    }

    /// List available tools with full metadata from the MCP server.
    /// - Returns: Array of tool metadata objects
    /// - Throws: MCPError if the request fails
    public func listToolInfo() async throws -> [MCPTool] {
        let response: MCPJSONRPCResponse<MCPToolListResult> = try await sendRequest(
            method: "tools/list",
            params: MCPToolListParams()
        )

        if let error = response.error {
            throw MCPError.protocolError(code: error.code, message: error.message)
        }

        guard let result = response.result else {
            throw MCPError.invalidResponse
        }

        return result.tools
    }
    
    /// Get tool metadata.
    /// - Parameter name: Name of the tool
    /// - Returns: Tool metadata
    /// - Throws: MCPError if the request fails
    public func getToolMetadata(name: String) async throws -> ToolMetadata {
        let response: MCPJSONRPCResponse<MCPToolListResult> = try await sendRequest(
            method: "tools/list",
            params: MCPToolListParams()
        )

        if let error = response.error {
            throw MCPError.protocolError(code: error.code, message: error.message)
        }

        guard let result = response.result else {
            throw MCPError.invalidResponse
        }

        guard let tool = result.tools.first(where: { $0.name == name }) else {
            throw MCPError.toolNotFound(name)
        }

        let meta = tool._meta ?? [:]
        let outputTemplate = meta["openai/outputTemplate"]?.value as? String
        let visibility = meta["openai/visibility"]?.value as? String ?? "unknown"
        let widgetAccessible = meta["openai/widgetAccessible"]?.value as? Bool ?? false
        let readOnlyHint = tool.annotations?.readOnlyHint ?? false

        return ToolMetadata(
            name: tool.name,
            description: tool.description,
            visibility: visibility,
            widgetAccessible: widgetAccessible,
            readOnlyHint: readOnlyHint,
            outputTemplateIncludes: outputTemplate
        )
    }

    private func sendRequest<Params: Encodable, Result: Decodable>(
        method: String,
        params: Params?
    ) async throws -> MCPJSONRPCResponse<Result> {
        var urlRequest = URLRequest(url: endpointURL)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")

        if let token = try? authenticator.retrieveToken() {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let sessionId {
            urlRequest.setValue(sessionId, forHTTPHeaderField: "Mcp-Session-Id")
        }

        let request = MCPJSONRPCRequest(method: method, params: params)
        do {
            urlRequest.httpBody = try JSONEncoder().encode(request)
        } catch {
            throw MCPError.invalidToolArguments(error.localizedDescription)
        }

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: urlRequest)
        } catch {
            throw MCPError.networkError(error)
        }

        guard let httpResponse = response as? HTTPURLResponse else {
            throw MCPError.invalidResponse
        }

        if httpResponse.statusCode == 401 {
            throw MCPError.authenticationRequired
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw MCPError.serverError("HTTP \(httpResponse.statusCode)")
        }

        if let newSessionId = httpResponse.value(forHTTPHeaderField: "Mcp-Session-Id") {
            sessionId = newSessionId
        }

        guard !data.isEmpty else {
            throw MCPError.invalidResponse
        }

        do {
            return try JSONDecoder().decode(MCPJSONRPCResponse<Result>.self, from: data)
        } catch {
            throw MCPError.invalidResponse
        }
    }
}

/// Metadata about an MCP tool derived from tool listing responses.
public struct ToolMetadata: Codable {
    /// Tool name.
    public let name: String
    /// Optional tool description.
    public let description: String?
    /// Visibility hint supplied by the server.
    public let visibility: String
    /// Whether the tool is accessible to widget rendering.
    public let widgetAccessible: Bool
    /// Whether the tool is expected to be read-only.
    public let readOnlyHint: Bool
    /// Optional output template hint from server metadata.
    public let outputTemplateIncludes: String?
}
