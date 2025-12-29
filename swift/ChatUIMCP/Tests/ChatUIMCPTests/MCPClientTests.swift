import XCTest
@testable import ChatUIMCP

final class MCPClientTests: XCTestCase {
    var client: MCPClient!
    var mockSession: URLSession!
    
    override func setUp() {
        super.setUp()
        
        // Create mock URL session configuration
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [MockURLProtocol.self]
        mockSession = URLSession(configuration: configuration)
        
        // Initialize client with mock session
        client = MCPClient(
            baseURL: URL(string: "http://localhost:3000")!,
            session: mockSession
        )
    }
    
    override func tearDown() {
        client = nil
        mockSession = nil
        MockURLProtocol.requestHandler = nil
        super.tearDown()
    }
    
    func testCallToolSuccess() async throws {
        // Setup mock response
        let responseData = """
        {
            "jsonrpc": "2.0",
            "id": "test-id",
            "result": {
                "content": [
                    { "type": "text", "text": "Success" }
                ]
            }
        }
        """.data(using: .utf8)!
        
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 200,
                httpVersion: nil,
                headerFields: nil
            )!
            return (response, responseData)
        }
        
        // Call tool
        let response = try await client.callTool(name: "test_tool", arguments: ["key": "value"])
        
        // Verify response
        XCTAssertTrue(response.isSuccess)
        XCTAssertNotNil(response.result)
        XCTAssertEqual(response.result?.content.first?.text, "Success")
    }
    
    func testCallToolAuthenticationRequired() async throws {
        // Setup mock response with 401
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 401,
                httpVersion: nil,
                headerFields: nil
            )!
            return (response, Data())
        }
        
        // Call tool and expect authentication error
        do {
            _ = try await client.callTool(name: "test_tool")
            XCTFail("Expected authentication error")
        } catch MCPError.authenticationRequired {
            // Expected error
        } catch {
            XCTFail("Unexpected error: \(error)")
        }
    }
    
    func testCallToolServerError() async throws {
        // Setup mock response with error
        let responseData = """
        {
            "jsonrpc": "2.0",
            "id": "test-id",
            "error": {
                "code": -32000,
                "message": "Internal server error"
            }
        }
        """.data(using: .utf8)!
        
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 200,
                httpVersion: nil,
                headerFields: nil
            )!
            return (response, responseData)
        }
        
        // Call tool and expect server error
        do {
            _ = try await client.callTool(name: "test_tool")
            XCTFail("Expected server error")
        } catch MCPError.protocolError(let code, let message) {
            XCTAssertEqual(code, -32000)
            XCTAssertEqual(message, "Internal server error")
        } catch {
            XCTFail("Unexpected error: \(error)")
        }
    }
    
    func testCallToolWithWidgetResult() async throws {
        // Setup mock response with widget data
        let responseData = """
        {
            "jsonrpc": "2.0",
            "id": "test-id",
            "result": {
                "content": [
                    { "type": "text", "text": "Widget content" }
                ],
                "structuredContent": {
                    "title": "Test Widget",
                    "content": "Widget content"
                }
            }
        }
        """.data(using: .utf8)!
        
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 200,
                httpVersion: nil,
                headerFields: nil
            )!
            return (response, responseData)
        }
        
        // Call tool
        let response = try await client.callTool(name: "display_card")
        
        // Verify widget result
        XCTAssertTrue(response.isSuccess)
        
        XCTAssertEqual(response.result?.structuredContent?["title"]?.value as? String, "Test Widget")
    }
    
    func testListTools() async throws {
        // Setup mock response
        let responseData = """
        {
            "jsonrpc": "2.0",
            "id": "test-id",
            "result": {
                "tools": [
                    { "name": "display_chat", "inputSchema": { "type": "object" } },
                    { "name": "display_table", "inputSchema": { "type": "object" } },
                    { "name": "add_to_cart", "inputSchema": { "type": "object" } }
                ]
            }
        }
        """.data(using: .utf8)!
        
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 200,
                httpVersion: nil,
                headerFields: nil
            )!
            return (response, responseData)
        }
        
        // List tools
        let tools = try await client.listTools()
        
        // Verify tools
        XCTAssertEqual(tools.count, 3)
        XCTAssertTrue(tools.contains("display_chat"))
        XCTAssertTrue(tools.contains("display_table"))
        XCTAssertTrue(tools.contains("add_to_cart"))
    }
    
    func testGetToolMetadata() async throws {
        // Setup mock response
        let responseData = """
        {
            "jsonrpc": "2.0",
            "id": "test-id",
            "result": {
                "tools": [
                    {
                        "name": "display_chat",
                        "description": "Display a chat interface",
                        "inputSchema": { "type": "object" },
                        "annotations": { "readOnlyHint": true },
                        "_meta": {
                            "openai/visibility": "public",
                            "openai/widgetAccessible": false,
                            "openai/outputTemplate": "ui://widget/chat-view.html"
                        }
                    }
                ]
            }
        }
        """.data(using: .utf8)!
        
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 200,
                httpVersion: nil,
                headerFields: nil
            )!
            return (response, responseData)
        }
        
        // Get metadata
        let metadata = try await client.getToolMetadata(name: "display_chat")
        
        // Verify metadata
        XCTAssertEqual(metadata.name, "display_chat")
        XCTAssertEqual(metadata.visibility, "public")
        XCTAssertFalse(metadata.widgetAccessible)
        XCTAssertTrue(metadata.readOnlyHint)
        XCTAssertTrue(metadata.outputTemplateIncludes?.contains("chat-view") ?? false)
    }
}

// MARK: - Mock URL Protocol

class MockURLProtocol: URLProtocol {
    static var requestHandler: ((URLRequest) throws -> (HTTPURLResponse, Data))?
    
    override class func canInit(with request: URLRequest) -> Bool {
        return true
    }
    
    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }
    
    override func startLoading() {
        guard let handler = MockURLProtocol.requestHandler else {
            fatalError("Request handler not set")
        }
        
        do {
            let (response, data) = try handler(request)
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch {
            client?.urlProtocol(self, didFailWithError: error)
        }
    }
    
    override func stopLoading() {
        // No-op
    }
}
