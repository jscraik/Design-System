# ChatUIMCP

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Swift package for MCP (Model Context Protocol) integration with native macOS applications.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Supported widget types](#supported-widget-types)
- [Error handling](#error-handling)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Xcode 15+
- Swift 5.9
- macOS 13+ / iOS 15+

## Quickstart

```swift
import ChatUIMCP

let client = MCPClient(baseURL: URL(string: "http://localhost:8787")!)
let response = try await client.callTool(name: "display_chat")
```

## Overview

ChatUIMCP provides a Swift networking layer to communicate with existing web-based MCP infrastructure, widget rendering using native SwiftUI components styled with ChatUIFoundation tokens, and macOS-specific authentication flows using Keychain.

## Features

- **MCP Client**: Async/await networking layer for calling MCP tools
- **Widget Renderer**: Native SwiftUI rendering of MCP widget data
- **Keychain Authentication**: Secure token storage using macOS Keychain
- **Type-Safe Models**: Codable models for all MCP data structures
- **Backward Compatible**: Works with all existing MCP tool contracts

## Installation

### Swift Package Manager

Add ChatUIMCP as a dependency in your `Package.swift`:

```swift
dependencies: [
    .package(path: "../ChatUIMCP")
]
```

Then add it to your target dependencies:

```swift
.target(
    name: "YourTarget",
    dependencies: ["ChatUIMCP"]
)
```

## Usage

### Basic MCP Client

```swift
import ChatUIMCP

// Initialize client (Streamable HTTP MCP endpoint defaults to /mcp)
let client = MCPClient(baseURL: URL(string: "http://localhost:8787")!)

// Call a tool
let response = try await client.callTool(
    name: "display_chat",
    arguments: ["seedMessage": "Hello, world!"]
)

// Handle response
if let result = response.result {
    // Render structured MCP output
    WidgetRenderer(result: result)
}
```

### Authentication

```swift
import ChatUIMCP

let authenticator = MCPAuthenticator()

// Store token
try authenticator.storeToken("your-auth-token")

// Retrieve token
let token = try authenticator.retrieveToken()

// Check if token exists
if authenticator.hasToken() {
    // Token is available
}

// Delete token
try authenticator.deleteToken()
```

### Widget Rendering

```swift
import SwiftUI
import ChatUIMCP

struct ContentView: View {
    let widgetData: WidgetData

    var body: some View {
        WidgetRenderer(widgetData: widgetData)
            .padding()
    }
}
```

To render MCP tool output directly:

```swift
let response = try await client.callTool(name: "display_dashboard")
if let result = response.result {
    WidgetRenderer(result: result)
}
```

## Supported Widget Types

- **Structured Output**: Renders tool `structuredContent` into native cards/lists
- **Fallback Text**: Displays unstructured `content` blocks when structured data is absent
- **WidgetData**: Legacy convenience renderer for card/list/table/custom

## Architecture

### MCPClient

The `MCPClient` class provides async/await methods for:

- `callTool(name:arguments:)`: Call an MCP tool (Streamable HTTP MCP protocol)
- `listTools()`: List available tools
- `getToolMetadata(name:)`: Get tool metadata

### MCPAuthenticator

The `MCPAuthenticator` class manages authentication tokens using macOS Keychain:

- `storeToken(_:account:)`: Store authentication token
- `retrieveToken(account:)`: Retrieve authentication token
- `updateToken(_:account:)`: Update existing token
- `deleteToken(account:)`: Delete token
- `hasToken(account:)`: Check if token exists

### WidgetRenderer

The `WidgetRenderer` view renders MCP tool results using native SwiftUI components:

- Uses `ChatUIFoundation` tokens for consistent styling
- Uses `ChatUIComponents` primitives for UI elements
- Supports light/dark mode automatically
- Provides platform-appropriate interactions

## MCP Tool Contracts

ChatUIMCP is compatible with all existing MCP tool contracts defined in `platforms/mcp/tool-contracts.json`:

- `display_chat`: Chat interface widget
- `display_search_results`: Search results widget
- `display_table`: Table widget
- `display_dashboard`: Dashboard widget
- `add_to_cart`: Shopping cart operations
- `show_shop`: E-commerce shop widget
- `auth_status`: Authentication status
- And more...

## Error Handling

ChatUIMCP provides comprehensive error handling through the `MCPError` enum:

```swift
do {
    let response = try await client.callTool(name: "test_tool")
} catch MCPError.authenticationRequired {
    // Handle authentication error
} catch MCPError.toolNotFound(let name) {
    // Handle tool not found
} catch MCPError.serverError(let message) {
    // Handle server error
} catch {
    // Handle other errors
}
```

## Testing

ChatUIMCP includes comprehensive unit tests:

```bash
# Run all tests
swift test

# Run specific test suite
swift test --filter MCPClientTests
swift test --filter MCPAuthenticatorTests
swift test --filter WidgetRendererTests
```

## Requirements

- macOS 13.0+ / iOS 15.0+
- Swift 5.9+
- Xcode 15.0+

## Dependencies

- ChatUIFoundation: Semantic design tokens
- ChatUIComponents: Reusable SwiftUI primitives

## Troubleshooting

### Symptom: `Authentication required`

Cause: MCP server expects a token in Keychain.
Fix: Store a token with `MCPAuthenticator.storeToken(_:)`.

### Symptom: `Invalid response from MCP server`

Cause: MCP server returned a non-JSON or empty response.
Fix: Confirm the server is running and the endpoint is `/mcp`.

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure all tests pass before submitting a pull request.

## Documentation

For detailed API documentation, build the DocC documentation:

```bash
swift package generate-documentation
```

## Examples

See the `platforms/apple/apps/macos/ComponentGallery` app for live examples of widget rendering.

## Support

For issues and questions, please file an issue on the repository.
