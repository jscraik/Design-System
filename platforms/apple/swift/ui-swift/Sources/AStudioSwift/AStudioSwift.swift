import SwiftUI

/// Main module file for AStudioSwift
/// This file serves as the primary entry point for the AStudioSwift package

// MARK: - Public Exports

// Export design tokens
@_exported import struct SwiftUI.Color
@_exported import struct SwiftUI.Font

// The DesignTokens, components, and other public APIs are automatically available
// when importing AStudioSwift due to the public access level in their respective files

// MARK: - Package Information

/// Legacy entry point for the AStudioSwift package.
public enum AStudioSwift {
    /// Current package version string.
    public static let version = "1.0.0"
    /// Package display name.
    public static let name = "AStudioSwift"
    
    /// Initializes the AStudioSwift package.
    ///
    /// Call this method early in your app's lifecycle to enable debug tooling in development.
    public static func initialize() {
        #if DEBUG
        // Enable debug tools in development
        DebugConfig.isEnabled = true
        PreviewPerformanceConfig.isEnabled = true
        
        print("🛠️ AStudioSwift initialized with development tools enabled")
        print("   Debug tools: ✅")
        print("   Performance monitoring: ✅")
        print("   Use .debugComponent(name:) on views for full debugging")
        #endif
    }
}
