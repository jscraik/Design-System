import SwiftUI

#if os(macOS)
import AppKit

/// macOS visual effect view wrapper for native vibrancy effects
public struct VisualEffectView: NSViewRepresentable {
    let material: NSVisualEffectView.Material
    let blendingMode: NSVisualEffectView.BlendingMode
    let state: NSVisualEffectView.State
    let isEmphasized: Bool
    
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

import ChatUIFoundation

/// iOS/visionOS fallback using SwiftUI Material
public struct VisualEffectView: View {
    let material: Material
    
    public init(material: Material = .regular) {
        self.material = material
    }
    
    public var body: some View {
        Rectangle()
            .fill(.background)
            .background(material)
    }
}

#endif
