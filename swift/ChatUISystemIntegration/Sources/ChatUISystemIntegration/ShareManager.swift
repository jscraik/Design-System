import Foundation
#if canImport(AppKit)
import AppKit
#elseif canImport(UIKit)
import UIKit
#endif

/// Manages native share sheet integration for sharing content
public class ShareManager {
    
    public enum ShareError: Error, LocalizedError {
        case sharingNotAvailable
        case invalidContent
        case shareFailed(Error)
        
        public var errorDescription: String? {
            switch self {
            case .sharingNotAvailable:
                return "Sharing is not available on this platform"
            case .invalidContent:
                return "Invalid content for sharing"
            case .shareFailed(let error):
                return "Failed to share: \(error.localizedDescription)"
            }
        }
    }
    
    public init() {}
    
    // MARK: - Share Content
    
    #if os(macOS)
    /// Share content using macOS NSSharingService
    public func share(
        items: [Any],
        from view: NSView? = nil,
        at rect: NSRect? = nil
    ) async throws {
        guard !items.isEmpty else {
            throw ShareError.invalidContent
        }
        
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.main.async {
                let picker = NSSharingServicePicker(items: items)
                
                if let view = view, let rect = rect {
                    picker.show(relativeTo: rect, of: view, preferredEdge: .minY)
                } else if let view = view {
                    picker.show(relativeTo: view.bounds, of: view, preferredEdge: .minY)
                } else {
                    // Fallback: show at mouse location
                    if let window = NSApplication.shared.keyWindow {
                        let mouseLocation = NSEvent.mouseLocation
                        let windowLocation = window.convertPoint(fromScreen: mouseLocation)
                        let rect = NSRect(origin: windowLocation, size: .zero)
                        picker.show(relativeTo: rect, of: window.contentView!, preferredEdge: .minY)
                    }
                }
                
                continuation.resume()
            }
        }
    }
    
    /// Share text content
    public func shareText(_ text: String, from view: NSView? = nil) async throws {
        try await share(items: [text], from: view)
    }
    
    /// Share URL
    public func shareURL(_ url: URL, from view: NSView? = nil) async throws {
        try await share(items: [url], from: view)
    }
    
    /// Share image
    public func shareImage(_ image: NSImage, from view: NSView? = nil) async throws {
        try await share(items: [image], from: view)
    }
    
    /// Share file
    public func shareFile(at url: URL, from view: NSView? = nil) async throws {
        guard FileManager.default.fileExists(atPath: url.path) else {
            throw ShareError.invalidContent
        }
        try await share(items: [url], from: view)
    }
    
    /// Get available sharing services for items
    public func availableServices(for items: [Any]) -> [NSSharingService] {
        return NSSharingService.sharingServices(forItems: items)
    }
    
    /// Share using a specific service
    public func share(
        items: [Any],
        using service: NSSharingService,
        from view: NSView? = nil,
        at rect: NSRect? = nil
    ) async throws {
        guard service.canPerform(withItems: items) else {
            throw ShareError.invalidContent
        }
        
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.main.async {
                if let view = view, let rect = rect {
                    service.perform(withItems: items)
                } else {
                    service.perform(withItems: items)
                }
                continuation.resume()
            }
        }
    }
    
    #elseif os(iOS)
    /// Share content using iOS UIActivityViewController
    public func share(
        items: [Any],
        from viewController: UIViewController,
        sourceView: UIView? = nil,
        sourceRect: CGRect? = nil
    ) async throws {
        guard !items.isEmpty else {
            throw ShareError.invalidContent
        }
        
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.main.async {
                let activityVC = UIActivityViewController(
                    activityItems: items,
                    applicationActivities: nil
                )
                
                // Configure for iPad
                if let popover = activityVC.popoverPresentationController {
                    if let sourceView = sourceView {
                        popover.sourceView = sourceView
                        popover.sourceRect = sourceRect ?? sourceView.bounds
                    } else {
                        popover.sourceView = viewController.view
                        popover.sourceRect = CGRect(x: viewController.view.bounds.midX,
                                                   y: viewController.view.bounds.midY,
                                                   width: 0, height: 0)
                        popover.permittedArrowDirections = []
                    }
                }
                
                viewController.present(activityVC, animated: true) {
                    continuation.resume()
                }
            }
        }
    }
    
    /// Share text content
    public func shareText(_ text: String, from viewController: UIViewController) async throws {
        try await share(items: [text], from: viewController)
    }
    
    /// Share URL
    public func shareURL(_ url: URL, from viewController: UIViewController) async throws {
        try await share(items: [url], from: viewController)
    }
    
    /// Share image
    public func shareImage(_ image: UIImage, from viewController: UIViewController) async throws {
        try await share(items: [image], from: viewController)
    }
    
    /// Share file
    public func shareFile(at url: URL, from viewController: UIViewController) async throws {
        guard FileManager.default.fileExists(atPath: url.path) else {
            throw ShareError.invalidContent
        }
        try await share(items: [url], from: viewController)
    }
    #endif
    
    // MARK: - Share Extensions
    
    /// Create shareable chat transcript
    public func createChatTranscript(messages: [ChatMessage]) -> String {
        var transcript = "Chat Transcript\n"
        transcript += "Generated: \(Date().formatted())\n"
        transcript += String(repeating: "=", count: 50) + "\n\n"
        
        for message in messages {
            transcript += "[\(message.timestamp.formatted(date: .abbreviated, time: .shortened))] "
            transcript += "\(message.sender): \(message.content)\n\n"
        }
        
        return transcript
    }
    
    /// Export chat history to file
    public func exportChatHistory(messages: [ChatMessage], to url: URL) async throws {
        let transcript = createChatTranscript(messages: messages)
        
        do {
            try transcript.write(to: url, atomically: true, encoding: .utf8)
        } catch {
            throw ShareError.shareFailed(error)
        }
    }
}

// MARK: - Supporting Types

public struct ChatMessage: Codable {
    public let id: String
    public let sender: String
    public let content: String
    public let timestamp: Date
    
    public init(id: String, sender: String, content: String, timestamp: Date) {
        self.id = id
        self.sender = sender
        self.content = content
        self.timestamp = timestamp
    }
}
