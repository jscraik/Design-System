import Foundation

/// JSON-RPC request wrapper for MCP
public struct MCPJSONRPCRequest<Params: Encodable>: Encodable {
    public let jsonrpc: String = "2.0"
    public let id: String
    public let method: String
    public let params: Params?

    public init(id: String = UUID().uuidString, method: String, params: Params? = nil) {
        self.id = id
        self.method = method
        self.params = params
    }
}

/// JSON-RPC error payload
public struct MCPJSONRPCError: Codable {
    public let code: Int
    public let message: String
    public let data: AnyCodable?
}

/// JSON-RPC response wrapper
public struct MCPJSONRPCResponse<Result: Decodable>: Decodable {
    public let jsonrpc: String
    public let id: String?
    public let result: Result?
    public let error: MCPJSONRPCError?
}

/// Parameters for a tools/call request
public struct MCPToolCallParams: Encodable {
    public let name: String
    public let arguments: [String: AnyCodable]?

    public init(name: String, arguments: [String: Any]? = nil) {
        self.name = name
        self.arguments = arguments?.mapValues { AnyCodable($0) }
    }
}

/// Parameters for a tools/list request
public struct MCPToolListParams: Encodable {
    public let cursor: String?

    public init(cursor: String? = nil) {
        self.cursor = cursor
    }
}

/// Tool list response payload
public struct MCPToolListResult: Decodable {
    public let tools: [MCPTool]
}

/// Tool metadata as returned by MCP tools/list
public struct MCPTool: Decodable {
    public let name: String
    public let description: String?
    public let inputSchema: [String: AnyCodable]?
    public let outputSchema: [String: AnyCodable]?
    public let annotations: MCPToolAnnotations?
    public let _meta: [String: AnyCodable]?
}

/// Tool annotations (read-only, idempotency hints, etc.)
public struct MCPToolAnnotations: Codable {
    public let title: String?
    public let readOnlyHint: Bool?
    public let destructiveHint: Bool?
    public let idempotentHint: Bool?
    public let openWorldHint: Bool?
}

/// Tool call response payload
public struct MCPToolCallResult: Codable {
    public let content: [MCPContentBlock]
    public let structuredContent: [String: AnyCodable]?
    public let isError: Bool?
    public let _meta: [String: AnyCodable]?

    private enum CodingKeys: String, CodingKey {
        case content
        case structuredContent
        case isError
        case _meta
    }

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
    public let id: String?
    public let result: MCPToolCallResult?
    public let error: MCPJSONRPCError?

    public var isSuccess: Bool {
        return error == nil && result != nil && result?.isError != true
    }
}

/// Content block returned by MCP tools/call
public struct MCPContentBlock: Codable {
    public let type: String
    public let text: String?
    public let raw: [String: AnyCodable]

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

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let raw = try container.decode([String: AnyCodable].self)
        let type = raw["type"]?.value as? String ?? "unknown"
        let text = raw["text"]?.value as? String

        self.type = type
        self.text = text
        self.raw = raw
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(raw)
    }
}

/// Widget data for rendering
public struct WidgetData: Codable {
    public let type: WidgetType
    public let title: String?
    public let content: String?
    public let items: [WidgetItem]?
    public let metadata: [String: AnyCodable]?

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
    public let id: String
    public let title: String
    public let subtitle: String?
    public let icon: String?
    public let action: String?
}

/// Type-erased codable wrapper for Any values
public struct AnyCodable: Codable {
    public let value: Any

    public init(_ value: Any) {
        self.value = value
    }

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
