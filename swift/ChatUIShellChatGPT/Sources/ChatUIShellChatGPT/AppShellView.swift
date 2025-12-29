import SwiftUI
import ChatUIFoundation

/// NavigationSplitView-based app shell with sidebar and detail panes
public struct AppShellView<SidebarContent: View, DetailContent: View>: View {
    @ViewBuilder let sidebarContent: () -> SidebarContent
    @ViewBuilder let detailContent: () -> DetailContent
    @Environment(\.chatUITheme) private var theme
    
    public init(
        @ViewBuilder sidebar: @escaping () -> SidebarContent,
        @ViewBuilder detail: @escaping () -> DetailContent
    ) {
        self.sidebarContent = sidebar
        self.detailContent = detail
    }
    
    public var body: some View {
        NavigationSplitView {
            sidebarContent()
                .frame(minWidth: 280, idealWidth: 320, maxWidth: 400)
                .background(sidebarBackground)
        } detail: {
            detailContent()
                .background(detailBackground)
        }
        .navigationSplitViewStyle(.balanced)
    }
    
    @ViewBuilder
    private var sidebarBackground: some View {
        #if os(macOS)
        if theme.surfaceStyle == .glass {
            GlassBackgroundView(role: .sidebar)
        } else {
            FColor.bgApp
        }
        #else
        FColor.bgApp
        #endif
    }
    
    @ViewBuilder
    private var detailBackground: some View {
        #if os(macOS)
        if theme.surfaceStyle == .glass {
            GlassBackgroundView(role: .content)
        } else {
            FColor.bgApp
        }
        #else
        FColor.bgApp
        #endif
    }
}
