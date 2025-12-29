import Foundation
import Combine

/// Client for communicating with MCP (Model Context Protocol) servers
public class MCPClient {
    private let endpointURL: URL
    private let session: URLSession
    private let authenticator: MCPAuthenticator
    private var sessionId: String?
    
    /// Initialize MCP client with base URL and MCP endpoint path
    /// - Parameters:
    ///   - baseURL: Base URL of the MCP server (e.g., http://localhost:8787)
    ///   - endpointPath: Path to the MCP endpoint (default: /mcp)
    ///   - session: URLSession to use for requests (defaults to .shared)
    ///   - authenticator: Authenticator for handling credentials
    public init(
        baseURL: URL,
        endpointPath: String = "/mcp",
        session: URLSession = .shared,
        authenticator: MCPAuthenticator = MCPAuthenticator()
    ) {
        if endpointPath.isEmpty {
            self.endpointURL = baseURL
        } else if let resolved = URL(string: endpointPath, relativeTo: baseURL) {
            self.endpointURL = resolved
        } else {
            self.endpointURL = baseURL.appendingPathComponent(endpointPath)
        }
        self.session = session
        self.authenticator = authenticator
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
    
    /// List available tools from the MCP server
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
    
    /// Get tool metadata
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

        if let token = try? authenticator.retrieveToken() {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let sessionId {
            urlRequest.setValue(sessionId, forHTTPHeaderField: "Mcp-Session-Id")
        }

        let request = MCPJSONRPCRequest(method: method, params: params)
        urlRequest.httpBody = try JSONEncoder().encode(request)

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

        return try JSONDecoder().decode(MCPJSONRPCResponse<Result>.self, from: data)
    }
}

/// Metadata about an MCP tool
public struct ToolMetadata: Codable {
    public let name: String
    public let description: String?
    public let visibility: String
    public let widgetAccessible: Bool
    public let readOnlyHint: Bool
    public let outputTemplateIncludes: String?
}
