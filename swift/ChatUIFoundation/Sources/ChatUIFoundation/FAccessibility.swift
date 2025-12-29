import SwiftUI
#if canImport(AppKit)
import AppKit
#endif
#if canImport(UIKit)
import UIKit
#endif

/// Accessibility helpers and utilities
public enum FAccessibility {
    
    // MARK: - Focus Ring
    
    /// Focus ring color for keyboard navigation
    public static let focusRingColor = FColor.accentBlue
    
    /// Focus ring width for keyboard navigation
    public static let focusRingWidth: CGFloat = 2
    
    // MARK: - System Preferences
    
    /// Whether the user prefers high contrast
    public static var prefersHighContrast: Bool {
        #if os(macOS)
        NSWorkspace.shared.accessibilityDisplayShouldIncreaseContrast
        #else
        UIAccessibility.isDarkerSystemColorsEnabled
        #endif
    }
    
    /// Whether the user prefers reduced motion
    public static var prefersReducedMotion: Bool {
        #if os(macOS)
        NSWorkspace.shared.accessibilityDisplayShouldReduceMotion
        #else
        UIAccessibility.isReduceMotionEnabled
        #endif
    }
    
    /// Whether the user prefers reduced transparency
    public static var prefersReducedTransparency: Bool {
        #if os(macOS)
        NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency
        #else
        UIAccessibility.isReduceTransparencyEnabled
        #endif
    }
}

// MARK: - View Extensions

extension View {
    
    /// Applies focus ring styling for keyboard navigation
    public func accessibilityFocusRing() -> some View {
        self.overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(FAccessibility.focusRingColor, lineWidth: FAccessibility.focusRingWidth)
                .opacity(0) // Shown by system focus management
        )
    }
    
    /// Applies high contrast styling when needed
    public func accessibilityHighContrast() -> some View {
        self.modifier(HighContrastModifier())
    }
}

// MARK: - Private Modifiers

private struct HighContrastModifier: ViewModifier {
    func body(content: Content) -> some View {
        if FAccessibility.prefersHighContrast {
            content
                .foregroundStyle(FColor.textPrimary)
                .background(FColor.bgApp)
        } else {
            content
        }
    }
}
