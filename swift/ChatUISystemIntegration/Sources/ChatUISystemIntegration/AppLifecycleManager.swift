import Foundation
#if canImport(AppKit)
import AppKit
#elseif canImport(UIKit)
import UIKit
#endif

/// Manages app lifecycle and state restoration
public class AppLifecycleManager {
    
    public enum LifecycleError: Error, LocalizedError {
        case stateRestorationFailed(Error)
        case stateSavingFailed(Error)
        case invalidState
        
        public var errorDescription: String? {
            switch self {
            case .stateRestorationFailed(let error):
                return "Failed to restore state: \(error.localizedDescription)"
            case .stateSavingFailed(let error):
                return "Failed to save state: \(error.localizedDescription)"
            case .invalidState:
                return "Invalid application state"
            }
        }
    }
    
    private let stateDirectory: URL
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    
    public init() {
        // Create state directory in Application Support
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        self.stateDirectory = appSupport.appendingPathComponent("ChatUI/State", isDirectory: true)
        
        // Create directory if it doesn't exist
        try? FileManager.default.createDirectory(at: stateDirectory, withIntermediateDirectories: true)
        
        setupLifecycleObservers()
    }
    
    // MARK: - Lifecycle Observers
    
    private func setupLifecycleObservers() {
        #if os(macOS)
        // macOS lifecycle notifications
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillTerminate),
            name: NSApplication.willTerminateNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationDidBecomeActive),
            name: NSApplication.didBecomeActiveNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillResignActive),
            name: NSApplication.willResignActiveNotification,
            object: nil
        )
        
        #elseif os(iOS)
        // iOS lifecycle notifications
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillTerminate),
            name: UIApplication.willTerminateNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationDidBecomeActive),
            name: UIApplication.didBecomeActiveNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillResignActive),
            name: UIApplication.willResignActiveNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationDidEnterBackground),
            name: UIApplication.didEnterBackgroundNotification,
            object: nil
        )
        #endif
    }
    
    @objc private func applicationWillTerminate() {
        NotificationCenter.default.post(name: .appWillTerminate, object: nil)
    }
    
    @objc private func applicationDidBecomeActive() {
        NotificationCenter.default.post(name: .appDidBecomeActive, object: nil)
    }
    
    @objc private func applicationWillResignActive() {
        NotificationCenter.default.post(name: .appWillResignActive, object: nil)
    }
    
    #if os(iOS)
    @objc private func applicationDidEnterBackground() {
        NotificationCenter.default.post(name: .appDidEnterBackground, object: nil)
    }
    #endif
    
    // MARK: - State Persistence
    
    /// Save application state
    public func saveState<T: Codable>(_ state: T, forKey key: String) async throws {
        let stateURL = stateDirectory.appendingPathComponent("\(key).json")
        
        do {
            let data = try encoder.encode(state)
            try data.write(to: stateURL, options: .atomic)
        } catch {
            throw LifecycleError.stateSavingFailed(error)
        }
    }
    
    /// Restore application state
    public func restoreState<T: Codable>(forKey key: String, as type: T.Type) async throws -> T? {
        let stateURL = stateDirectory.appendingPathComponent("\(key).json")
        
        guard FileManager.default.fileExists(atPath: stateURL.path) else {
            return nil
        }
        
        do {
            let data = try Data(contentsOf: stateURL)
            return try decoder.decode(T.self, from: data)
        } catch {
            throw LifecycleError.stateRestorationFailed(error)
        }
    }
    
    /// Delete saved state
    public func deleteState(forKey key: String) async throws {
        let stateURL = stateDirectory.appendingPathComponent("\(key).json")
        
        guard FileManager.default.fileExists(atPath: stateURL.path) else {
            return
        }
        
        do {
            try FileManager.default.removeItem(at: stateURL)
        } catch {
            throw LifecycleError.stateSavingFailed(error)
        }
    }
    
    /// Check if state exists
    public func stateExists(forKey key: String) -> Bool {
        let stateURL = stateDirectory.appendingPathComponent("\(key).json")
        return FileManager.default.fileExists(atPath: stateURL.path)
    }
    
    /// Get all saved state keys
    public func getAllStateKeys() throws -> [String] {
        do {
            let contents = try FileManager.default.contentsOfDirectory(
                at: stateDirectory,
                includingPropertiesForKeys: nil
            )
            return contents
                .filter { $0.pathExtension == "json" }
                .map { $0.deletingPathExtension().lastPathComponent }
        } catch {
            throw LifecycleError.stateRestorationFailed(error)
        }
    }
    
    // MARK: - Window State Restoration
    
    #if os(macOS)
    /// Save window state
    public func saveWindowState(window: NSWindow, identifier: String) async throws {
        let state = WindowState(
            frame: await window.frame,
            isVisible: await window.isVisible,
            isMiniaturized: await window.isMiniaturized,
            isZoomed: await window.isZoomed
        )
        
        try await saveState(state, forKey: "window_\(identifier)")
    }
    
    /// Restore window state
    public func restoreWindowState(for window: NSWindow, identifier: String) async throws {
        guard let state = try await restoreState(forKey: "window_\(identifier)", as: WindowState.self) else {
            return
        }
        
        DispatchQueue.main.async {
            window.setFrame(state.frame, display: true)
            
            if state.isMiniaturized {
                window.miniaturize(nil)
            }
            
            if state.isZoomed {
                window.zoom(nil)
            }
            
            if state.isVisible {
                window.makeKeyAndOrderFront(nil)
            }
        }
    }
    #endif
    
    // MARK: - Chat State Management
    
    /// Save chat session state
    public func saveChatSession(_ session: ChatSession) async throws {
        try await saveState(session, forKey: "chat_session_\(session.id)")
    }
    
    /// Restore chat session
    public func restoreChatSession(id: String) async throws -> ChatSession? {
        return try await restoreState(forKey: "chat_session_\(id)", as: ChatSession.self)
    }
    
    /// Get all chat sessions
    public func getAllChatSessions() async throws -> [ChatSession] {
        let keys = try getAllStateKeys()
        let sessionKeys = keys.filter { $0.hasPrefix("chat_session_") }
        
        var sessions: [ChatSession] = []
        for key in sessionKeys {
            if let session = try await restoreState(forKey: key, as: ChatSession.self) {
                sessions.append(session)
            }
        }
        
        return sessions.sorted { $0.lastModified > $1.lastModified }
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

// MARK: - Supporting Types

#if os(macOS)
public struct WindowState: Codable, Sendable {
    let frame: NSRect
    let isVisible: Bool
    let isMiniaturized: Bool
    let isZoomed: Bool
}
#endif

public struct ChatSession: Codable {
    public let id: String
    public let title: String
    public let messages: [ChatMessage]
    public let created: Date
    public let lastModified: Date
    
    public init(id: String, title: String, messages: [ChatMessage], created: Date, lastModified: Date) {
        self.id = id
        self.title = title
        self.messages = messages
        self.created = created
        self.lastModified = lastModified
    }
}

// MARK: - Notification Names

extension Notification.Name {
    public static let appWillTerminate = Notification.Name("appWillTerminate")
    public static let appDidBecomeActive = Notification.Name("appDidBecomeActive")
    public static let appWillResignActive = Notification.Name("appWillResignActive")
    public static let appDidEnterBackground = Notification.Name("appDidEnterBackground")
}
