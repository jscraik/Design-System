import SwiftUI

/// Main module file for ChatUISwift
/// This file serves as the primary entry point for the ChatUISwift package

// MARK: - Public Exports

// Export design tokens
@_exported import struct SwiftUI.Color
@_exported import struct SwiftUI.Font

// The DesignTokens, components, and other public APIs are automatically available
// when importing ChatUISwift due to the public access level in their respective files

// MARK: - Package Information

public enum ChatUISwift {
    public static let version = "1.0.0"
    public static let name = "ChatUISwift"
    
    /// Initializes the ChatUISwift package
    /// Call this method early in your app's lifecycle to ensure proper setup
    public static func initialize() {
        // Future initialization code can go here
        // For now, this is a placeholder for any setup that might be needed
    }
}