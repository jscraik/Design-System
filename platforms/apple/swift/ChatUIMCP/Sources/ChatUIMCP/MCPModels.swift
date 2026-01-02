import Foundation

/// JSON-RPC request wrapper for MCP
public struct MCPJSONRPCRequest<Params: Encodable>: Encodable {
    /// JSON-RPC protocol version string.
    public let jsonrpc: String = "2.0"
    /// Unique request identifier.
    public let id: String
    /// JSON-RPC method name to invoke.
    public let method: String
    /// Optional parameters payload.
    public let params: Params?

    /// Creates a JSON-RPC request payload.
    /// - Parameters:
    ///   - id: The request identifier (defaults to a UUID string).
    ///   - method: The JSON-RPC method name.
    ///   - params: Optional parameters payload.
    public init(id: String = UUID().uuidString, method: String, params: Params? = nil) {
        self.id = id
        self.method = method
        self.params = params
    }
}

/// JSON-RPC error payload
public struct MCPJSONRPCError: Codable {
    /// Error code returned by the server.
    public let code: Int
    /// Human-readable error message.
    public let message: String
    /// Optional structured error data.
    public let data: AnyCodable?
}

/// JSON-RPC response wrapper
public struct MCPJSONRPCResponse<Result: Decodable>: Decodable {
    /// JSON-RPC protocol version string.
    public let jsonrpc: String
    /// Response identifier, if the request expects a response.
    public let id: String?
    /// Result payload for successful calls.
    public let result: Result?
    /// Error payload for failed calls.
    public let error: MCPJSONRPCError?

    private enum CodingKeys: String, CodingKey {
        case jsonrpc
        case id
        case result
        case error
    }

    /// Decodes a JSON-RPC response payload.
    /// - Parameter decoder: The decoder to read from.
    /// - Throws: A decoding error when the payload is invalid.
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        jsonrpc = try container.decode(String.self, forKey: .jsonrpc)
        result = try container.decodeIfPresent(Result.self, forKey: .result)
        error = try container.decodeIfPresent(MCPJSONRPCError.self, forKey: .error)
        if let idValue = try container.decodeIfPresent(MCPJSONRPCID.self, forKey: .id) {
            id = idValue.stringValue
        } else {
            id = nil
        }
    }
}

/// Parameters for a tools/call request
public struct MCPToolCallParams: Encodable {
    /// Tool name to invoke.
    public let name: String
    /// Optional arguments dictionary for the tool call.
    public let arguments: [String: AnyCodable]?

    /// Creates parameters for a tool call.
    /// - Parameters:
    ///   - name: The tool name to invoke.
    ///   - arguments: Optional arguments dictionary for the tool call.
    public init(name: String, arguments: [String: Any]? = nil) {
        self.name = name
        self.arguments = arguments?.mapValues { AnyCodable($0) }
    }
}

/// Parameters for a tools/list request
public struct MCPToolListParams: Encodable {
    /// Pagination cursor for subsequent list calls.
    public let cursor: String?

    /// Creates parameters for a tools list request.
    /// - Parameter cursor: Optional pagination cursor.
    public init(cursor: String? = nil) {
        self.cursor = cursor
    }
}

/// Tool list response payload
public struct MCPToolListResult: Decodable {
    /// Tools returned by the list request.
    public let tools: [MCPTool]
}

/// Tool metadata as returned by MCP tools/list
public struct MCPTool: Decodable {
    /// Unique tool name.
    public let name: String
    /// Optional human-readable description.
    public let description: String?
    /// Optional JSON schema describing tool input.
    public let inputSchema: [String: AnyCodable]?
    /// Optional JSON schema describing tool output.
    public let outputSchema: [String: AnyCodable]?
    /// Optional behavioral annotations supplied by the server.
    public let annotations: MCPToolAnnotations?
    /// Optional metadata dictionary for tool-specific extensions.
    public let _meta: [String: AnyCodable]?
}

/// Tool annotations (read-only, idempotency hints, etc.)
public struct MCPToolAnnotations: Codable {
    /// Optional human-readable title.
    public let title: String?
    /// Whether the tool is expected to be read-only.
    public let readOnlyHint: Bool?
    /// Whether the tool is expected to be destructive.
    public let destructiveHint: Bool?
    /// Whether the tool is expected to be idempotent.
    public let idempotentHint: Bool?
    /// Whether the tool may affect the open world or external systems.
    public let openWorldHint: Bool?
}

/// Tool call response payload
public struct MCPToolCallResult: Codable {
    /// Content blocks returned by the tool.
    public let content: [MCPContentBlock]
    /// Optional structured content for widget rendering.
    public let structuredContent: [String: AnyCodable]?
    /// Indicates whether the tool reported an error.
    public let isError: Bool?
    /// Optional metadata from the server.
    public let _meta: [String: AnyCodable]?

    private enum CodingKeys: String, CodingKey {
        case content
        case structuredContent
        case isError
        case _meta
    }

    /// Creates a tool call result payload.
    /// - Parameters:
    ///   - content: The content blocks returned by the tool.
    ///   - structuredContent: Optional structured payload for widget rendering.
    ///   - isError: Whether the response is an error.
    ///   - _meta: Optional metadata from the server.
    public init(
        content: [MCPContentBlock] = [],
        structuredContent: [String: AnyCodable]? = nil,
        isError: Bool? = nil,
        _meta: [String: AnyCodable]? = nil
    ) {
        self.content = content
        self.structuredContent = structuredContent
        self.isError = isError
        self._meta = _meta
    }

    /// Decodes a tool call result payload.
    /// - Parameter decoder: The decoder to read from.
    /// - Throws: A decoding error when the payload is invalid.
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        content = try container.decodeIfPresent([MCPContentBlock].self, forKey: .content) ?? []
        structuredContent = try container.decodeIfPresent([String: AnyCodable].self, forKey: .structuredContent)
        isError = try container.decodeIfPresent(Bool.self, forKey: .isError)
        _meta = try container.decodeIfPresent([String: AnyCodable].self, forKey: ._meta)
    }
}

/// Convenience wrapper for tool call responses
public struct MCPToolResponse: Codable {
    /// Response identifier, if provided by the server.
    public let id: String?
    /// Parsed tool result payload.
    public let result: MCPToolCallResult?
    /// Error payload, if present.
    public let error: MCPJSONRPCError?

    /// Returns `true` when the response contains a non-error result.
    public var isSuccess: Bool {
        return error == nil && result != nil && result?.isError != true
    }
}

/// Content block returned by MCP tools/call
public struct MCPContentBlock: Codable {
    /// Content block type identifier.
    public let type: String
    /// Optional text payload for the block.
    public let text: String?
    /// Raw payload used for encoding and decoding.
    public let raw: [String: AnyCodable]

    /// Creates a content block payload.
    /// - Parameters:
    ///   - type: The block type identifier.
    ///   - text: Optional text content.
    ///   - raw: The raw dictionary used for encoding.
    public init(type: String, text: String? = nil, raw: [String: AnyCodable] = [:]) {
        self.type = type
        self.text = text
        var normalized = raw
        normalized["type"] = AnyCodable(type)
        if let text {
            normalized["text"] = AnyCodable(text)
        }
        self.raw = normalized
    }

    /// Decodes a content block payload.
    /// - Parameter decoder: The decoder to read from.
    /// - Throws: A decoding error when the payload is invalid.
    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let raw = try container.decode([String: AnyCodable].self)
        let type = raw["type"]?.value as? String ?? "unknown"
        let text = raw["text"]?.value as? String

        self.type = type
        self.text = text
        self.raw = raw
    }

    /// Encodes the content block using its raw representation.
    /// - Parameter encoder: The encoder to write into.
    /// - Throws: An encoding error if the payload cannot be encoded.
    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(raw)
    }
}

/// Widget data for rendering
public struct WidgetData: Codable {
    /// Widget type for rendering.
    public let type: WidgetType
    /// Optional widget title.
    public let title: String?
    /// Optional widget content text.
    public let content: String?
    /// Optional list of widget items.
    public let items: [WidgetItem]?
    /// Optional metadata for widget rendering.
    public let metadata: [String: AnyCodable]?

    /// Supported widget types for rendering.
    public enum WidgetType: String, Codable {
        case card
        case list
        case chart
        case table
        case custom
    }
}

/// Individual widget item
public struct WidgetItem: Codable, Identifiable {
    /// Stable identifier for the widget item.
    public let id: String
    /// Primary label for the item.
    public let title: String
    /// Optional secondary label for the item.
    public let subtitle: String?
    /// Optional system icon name.
    public let icon: String?
    /// Optional action identifier to emit on selection.
    public let action: String?
}

/// Type-erased codable wrapper for Any values
public struct AnyCodable: Codable {
    /// The underlying value stored in the wrapper.
    public let value: Any

    /// Wraps any value for encoding/decoding.
    /// - Parameter value: The underlying value to store.
    public init(_ value: Any) {
        self.value = value
    }

    /// Decodes a type-erased value.
    /// - Parameter decoder: The decoder to read from.
    /// - Throws: A decoding error if the value cannot be represented.
    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if let bool = try? container.decode(Bool.self) {
            value = bool
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let string = try? container.decode(String.self) {
            value = string
        } else if let array = try? container.decode([AnyCodable].self) {
            value = array.map { $0.value }
        } else if let dictionary = try? container.decode([String: AnyCodable].self) {
            value = dictionary.mapValues { $0.value }
        } else {
            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "AnyCodable value cannot be decoded"
            )
        }
    }

    /// Encodes the wrapped value.
    /// - Parameter encoder: The encoder to write into.
    /// - Throws: An encoding error if the value cannot be represented.
    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()

        switch value {
        case let bool as Bool:
            try container.encode(bool)
        case let int as Int:
            try container.encode(int)
        case let double as Double:
            try container.encode(double)
        case let string as String:
            try container.encode(string)
        case let array as [Any]:
            try container.encode(array.map { AnyCodable($0) })
        case let dictionary as [String: Any]:
            try container.encode(dictionary.mapValues { AnyCodable($0) })
        default:
            let context = EncodingError.Context(
                codingPath: container.codingPath,
                debugDescription: "AnyCodable value cannot be encoded"
            )
            throw EncodingError.invalidValue(value, context)
        }
    }
}

private struct MCPJSONRPCID: Codable {
    let stringValue: String

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let string = try? container.decode(String.self) {
            stringValue = string
        } else if let int = try? container.decode(Int.self) {
            stringValue = String(int)
        } else if let double = try? container.decode(Double.self) {
            stringValue = String(double)
        } else {
            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "Unsupported JSON-RPC id type"
            )
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(stringValue)
    }
}
