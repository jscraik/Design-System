import Foundation

/// ChatUIMCP - Swift package for MCP (Model Context Protocol) integration
///
/// This package provides a Swift networking layer to communicate with existing
/// web-based MCP infrastructure, widget rendering using native SwiftUI components,
/// and macOS-specific authentication flows using Keychain.
///
/// ## Topics
///
/// ### Client
/// - ``MCPClient``
/// - ``MCPAuthenticator``
///
/// ### Models
/// - ``MCPToolResponse``
/// - ``MCPToolCallResult``
/// - ``MCPTool``
/// - ``WidgetData``
/// - ``WidgetItem``
///
/// ### Rendering
/// - ``WidgetRenderer``
///
/// ### Errors
/// - ``MCPError``
public enum ChatUIMCP {
    /// Current version of the ChatUIMCP package
    public static let version = "1.0.0"
}
