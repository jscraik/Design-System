import AppKit
import SwiftUI

/// Hosts `ComposeView` inside an AppKit view controller.
public final class ComposeViewController: NSViewController {
    public override func loadView() {
        view = NSHostingView(rootView: ComposeView())
    }
}
