import Foundation
#if canImport(AppKit)
import AppKit
#elseif canImport(UIKit)
import UIKit
#endif

/// Manages app lifecycle and state restoration
public class AppLifecycleManager {
    private let cryptoManager = CryptoManager()
    
    /// Errors thrown by lifecycle state operations.
    public enum LifecycleError: Error, LocalizedError {
        case stateRestorationFailed(Error)
        case stateSavingFailed(Error)
        case invalidState
        
        /// A localized description of the error.
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
    
    /// Creates a lifecycle manager and configures observers.
    public init() {
        // Create state directory in Application Support
        let fileManager = FileManager.default
        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first
        let baseDirectory = appSupport ?? fileManager.temporaryDirectory
        var targetDirectory = baseDirectory.appendingPathComponent("ChatUI/State", isDirectory: true)
        
        do {
            try fileManager.createDirectory(at: targetDirectory, withIntermediateDirectories: true)
        } catch {
            // Fall back to a temporary directory if Application Support is unavailable.
            targetDirectory = fileManager.temporaryDirectory.appendingPathComponent("ChatUI/State", isDirectory: true)
            try? fileManager.createDirectory(at: targetDirectory, withIntermediateDirectories: true)
        }
        
        self.stateDirectory = targetDirectory
        
        setupLifecycleObservers()
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
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
    
    /// Save application state (encrypted).
    /// - Parameters:
    ///   - state: The state payload to persist.
    ///   - key: The storage key used to identify the payload.
    /// - Throws: `LifecycleError` when saving or encryption fails.
    public func saveState<T: Codable>(_ state: T, forKey key: String) async throws {
        let stateURL = stateDirectory.appendingPathComponent("\(key).encrypted")

        let data: Data
        do {
            let encoder = JSONEncoder()
            let jsonData = try encoder.encode(state)

            // Encrypt the data
            data = try await cryptoManager.encrypt(jsonData)
        } catch {
            throw LifecycleError.stateSavingFailed(error)
        }

        try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .utility).async {
                do {
                    try data.write(to: stateURL, options: .atomic)
                    continuation.resume()
                } catch {
                    continuation.resume(throwing: LifecycleError.stateSavingFailed(error))
                }
            }
        }
    }
    
    /// Restore application state (decrypted).
    /// - Parameters:
    ///   - key: The storage key used to identify the payload.
    ///   - type: The expected payload type.
    /// - Returns: The decoded payload if present.
    /// - Throws: `LifecycleError` when reading, decrypting, or decoding fails.
    public func restoreState<T: Codable>(forKey key: String, as type: T.Type) async throws -> T? {
        let stateURL = stateDirectory.appendingPathComponent("\(key).encrypted")
        
        guard FileManager.default.fileExists(atPath: stateURL.path) else {
            return nil
        }
        
        let data: Data
        do {
            data = try await withCheckedThrowingContinuation { continuation in
                DispatchQueue.global(qos: .utility).async {
                    do {
                        let data = try Data(contentsOf: stateURL)
                        continuation.resume(returning: data)
                    } catch {
                        continuation.resume(throwing: error)
                    }
                }
            }
        } catch {
            throw LifecycleError.stateRestorationFailed(error)
        }

        do {
            // Decrypt the data
            let decryptedData = try await cryptoManager.decrypt(data)

            let decoder = JSONDecoder()
            return try decoder.decode(T.self, from: decryptedData)
        } catch {
            throw LifecycleError.stateRestorationFailed(error)
        }
    }
    
    /// Delete saved state.
    /// - Parameter key: The storage key used to identify the payload.
    /// - Throws: `LifecycleError` when deletion fails.
    public func deleteState(forKey key: String) async throws {
        let stateURL = stateDirectory.appendingPathComponent("\(key).encrypted")
        
        guard FileManager.default.fileExists(atPath: stateURL.path) else {
            return
        }
        
        try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .utility).async {
                do {
                    try FileManager.default.removeItem(at: stateURL)
                    continuation.resume()
                } catch {
                    continuation.resume(throwing: LifecycleError.stateSavingFailed(error))
                }
            }
        }
    }
    
    /// Check if state exists.
    /// - Parameter key: The storage key used to identify the payload.
    /// - Returns: `true` when state exists for the key.
    public func stateExists(forKey key: String) -> Bool {
        let stateURL = stateDirectory.appendingPathComponent("\(key).encrypted")
        return FileManager.default.fileExists(atPath: stateURL.path)
    }
    
    /// Get all saved state keys.
    /// - Returns: An array of state keys without file extensions.
    /// - Throws: `LifecycleError` when reading from disk fails.
    public func getAllStateKeys() throws -> [String] {
        do {
            let contents = try FileManager.default.contentsOfDirectory(
                at: stateDirectory,
                includingPropertiesForKeys: nil
            )
            return contents
                .filter { $0.pathExtension == "encrypted" }
                .map { $0.deletingPathExtension().lastPathComponent }
        } catch {
            throw LifecycleError.stateRestorationFailed(error)
        }
    }
    
    // MARK: - Window State Restoration
    
#if os(macOS)
    /// Save window state.
    /// - Parameters:
    ///   - window: The window to persist.
    ///   - identifier: The identifier used to store the window state.
    /// - Throws: `LifecycleError` when saving fails.
    @MainActor
    public func saveWindowState(window: NSWindow, identifier: String) async throws {
        let state = WindowState(
            frame: window.frame,
            isVisible: window.isVisible,
            isMiniaturized: window.isMiniaturized,
            isZoomed: window.isZoomed
        )
        
        try await saveState(state, forKey: "window_\(identifier)")
    }
    
    /// Restore window state.
    /// - Parameters:
    ///   - window: The window to restore into.
    ///   - identifier: The identifier used to load the window state.
    /// - Throws: `LifecycleError` when restoration fails.
    @MainActor
    public func restoreWindowState(for window: NSWindow, identifier: String) async throws {
        guard let state = try await restoreState(forKey: "window_\(identifier)", as: WindowState.self) else {
            return
        }
        
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
    #endif
    
    // MARK: - Chat State Management
    
    /// Save chat session state.
    /// - Parameter session: The chat session to persist.
    /// - Throws: `LifecycleError` when saving fails.
    public func saveChatSession(_ session: ChatSession) async throws {
        try await saveState(session, forKey: "chat_session_\(session.id)")
    }
    
    /// Restore chat session.
    /// - Parameter id: The chat session identifier.
    /// - Returns: The restored session if present.
    /// - Throws: `LifecycleError` when restoration fails.
    public func restoreChatSession(id: String) async throws -> ChatSession? {
        return try await restoreState(forKey: "chat_session_\(id)", as: ChatSession.self)
    }
    
    /// Get all chat sessions.
    /// - Returns: Chat sessions sorted by most recently modified.
    /// - Throws: `LifecycleError` when restoration fails.
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
    
}

// MARK: - Supporting Types

#if os(macOS)
/// Persisted window state for macOS restoration.
public struct WindowState: Codable, Sendable {
    let frame: NSRect
    let isVisible: Bool
    let isMiniaturized: Bool
    let isZoomed: Bool
}
#endif

/// Represents a persisted chat session with metadata.
public struct ChatSession: Codable, Sendable {
    /// Stable identifier for the session.
    public let id: String
    /// Display title for the session.
    public let title: String
    /// Messages included in the session.
    public let messages: [ChatMessage]
    /// Creation timestamp.
    public let created: Date
    /// Most recent modification timestamp.
    public let lastModified: Date
    
    /// Creates a chat session record.
    /// - Parameters:
    ///   - id: Stable identifier for the session.
    ///   - title: Display title for the session.
    ///   - messages: The messages included in the session.
    ///   - created: Creation timestamp.
    ///   - lastModified: Most recent modification timestamp.
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
    /// Posted when the application is about to terminate.
    public static let appWillTerminate = Notification.Name("appWillTerminate")
    /// Posted when the application becomes active.
    public static let appDidBecomeActive = Notification.Name("appDidBecomeActive")
    /// Posted when the application will resign active state.
    public static let appWillResignActive = Notification.Name("appWillResignActive")
    /// Posted when the iOS application enters background.
    public static let appDidEnterBackground = Notification.Name("appDidEnterBackground")
}
