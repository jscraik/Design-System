import SwiftUI

#if os(macOS)
import AppKit

/// macOS visual effect view wrapper for native vibrancy effects
public struct VisualEffectView: NSViewRepresentable {
    let material: NSVisualEffectView.Material
    let blendingMode: NSVisualEffectView.BlendingMode
    let state: NSVisualEffectView.State
    let isEmphasized: Bool
    
    /// Creates a macOS visual effect view.
    /// - Parameters:
    ///   - material: The visual effect material (defaults to `.sidebar`).
    ///   - blendingMode: The blending mode for the effect.
    ///   - state: The state used for the effect view.
    ///   - isEmphasized: Whether the view is emphasized.
    public init(
        material: NSVisualEffectView.Material = .sidebar,
        blendingMode: NSVisualEffectView.BlendingMode = .behindWindow,
        state: NSVisualEffectView.State = .followsWindowActiveState,
        isEmphasized: Bool = false
    ) {
        self.material = material
        self.blendingMode = blendingMode
        self.state = state
        self.isEmphasized = isEmphasized
    }
    
    public func makeNSView(context: Context) -> NSVisualEffectView {
        let view = NSVisualEffectView()
        view.material = material
        view.blendingMode = blendingMode
        view.state = state
        view.isEmphasized = isEmphasized
        return view
    }
    
    public func updateNSView(_ nsView: NSVisualEffectView, context: Context) {
        nsView.material = material
        nsView.blendingMode = blendingMode
        nsView.state = state
        nsView.isEmphasized = isEmphasized
    }
}

#else

import AStudioFoundation

/// iOS/visionOS fallback using SwiftUI Material
public struct VisualEffectView: View {
    let material: Material
    
    /// Creates a fallback visual effect view.
    /// - Parameter material: The SwiftUI material to use for the background.
    public init(material: Material = .regular) {
        self.material = material
    }
    
    public var body: some View {
        if FAccessibility.prefersReducedTransparency || FAccessibility.prefersHighContrast {
            Rectangle()
                .fill(FColor.bgApp)
        } else {
            Rectangle()
                .fill(.background)
                .background(material)
        }
    }
}

#endif
