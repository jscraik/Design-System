import SwiftUI

/// Platform detection helpers and conditional logic
public enum Platform {
    
    // MARK: - Platform Detection
    
    /// Whether the current platform is macOS
    public static var isMac: Bool {
        #if os(macOS)
        true
        #else
        false
        #endif
    }
    
    /// Whether the current platform is visionOS
    public static var isVisionOS: Bool {
        #if os(visionOS)
        true
        #else
        false
        #endif
    }
    
    /// Whether the current platform is iOS
    public static var isIOS: Bool {
        #if os(iOS)
        true
        #else
        false
        #endif
    }
    
    // MARK: - Platform-Specific Interaction Helpers
    
    /// Applies hover effects on macOS, no-op on other platforms
    public static func hoverEffect<V: View>(_ view: V, onHover: @escaping (Bool) -> Void) -> some View {
        #if os(macOS)
        view.onHover(perform: onHover)
        #else
        view
        #endif
    }
}