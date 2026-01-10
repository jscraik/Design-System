import SwiftUI
import AStudioFoundation

/// Custom toggle style matching ChatGPT switch design.
///
/// - Example:
/// ```swift
/// Toggle("Auto plan", isOn: $enabled)
///     .toggleStyle(FoundationSwitchStyle())
/// ```
public struct FoundationSwitchStyle: ToggleStyle {
    /// Creates the switch style.
    public init() {}
    
    /// Builds the switch style body.
    public func makeBody(configuration: Configuration) -> some View {
        HStack {
            configuration.label
            Spacer(minLength: 0)
            
            ZStack {
                // Track
                Capsule()
                    .fill(configuration.isOn ? FColor.accentGreen : FColor.bgCardAlt)
                    .frame(width: 42, height: 22)
                
                // Thumb
                Circle()
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.18), radius: 1, x: 0, y: 1)
                    .frame(width: 18, height: 18)
                    .offset(x: configuration.isOn ? 10 : -10)
                    .animation(FAccessibility.prefersReducedMotion ? nil : .easeInOut(duration: 0.15), value: configuration.isOn)
            }
            .contentShape(Rectangle())
            .onTapGesture {
                configuration.isOn.toggle()
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityValue(Text(configuration.isOn ? "On" : "Off"))
    }
}
