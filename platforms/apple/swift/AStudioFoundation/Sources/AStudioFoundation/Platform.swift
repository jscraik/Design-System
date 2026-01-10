import SwiftUI

/// Detects the current Apple platform and applies platform-specific behavior.
///
/// ### Discussion
/// Use these helpers to keep platform checks centralized and avoid scattering
/// `#if os(...)` directives across UI code.
public enum Platform {
    
    // MARK: - Platform Detection
    
    /// Returns whether the current platform is macOS.
    public static var isMac: Bool {
        #if os(macOS)
        true
        #else
        false
        #endif
    }
    
    /// Returns whether the current platform is visionOS.
    public static var isVisionOS: Bool {
        #if os(visionOS)
        true
        #else
        false
        #endif
    }
    
    /// Returns whether the current platform is iOS.
    public static var isIOS: Bool {
        #if os(iOS)
        true
        #else
        false
        #endif
    }
    
    // MARK: - Platform-Specific Interaction Helpers
    
    /// Applies hover effects on macOS and is a no-op on other platforms.
    ///
    /// - Parameters:
    ///   - view: The view to apply a hover effect to.
    ///   - onHover: Callback invoked with the hover state.
    /// - Returns: The view with hover support applied on macOS.
    /// - Important: This only triggers on macOS; other platforms return the view unchanged.
    public static func hoverEffect<V: View>(_ view: V, onHover: @escaping (Bool) -> Void) -> some View {
        #if os(macOS)
        view.onHover(perform: onHover)
        #else
        view
        #endif
    }
}
