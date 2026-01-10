import Foundation
#if canImport(AppKit)
import AppKit
#endif

/// Manages file system access with proper permission handling for macOS applications
public class FileSystemManager {
    
    /// Errors thrown by file system operations.
    public enum FileSystemError: Error, LocalizedError, Equatable {
        case permissionDenied
        case fileNotFound
        case invalidPath
        case readFailed(Error)
        case writeFailed(Error)
        case bookmarkCreationFailed
        case bookmarkResolutionFailed
        
        /// A localized description of the error.
        public var errorDescription: String? {
            switch self {
            case .permissionDenied:
                return "Permission denied to access file system"
            case .fileNotFound:
                return "File not found"
            case .invalidPath:
                return "Invalid file path"
            case .readFailed(let error):
                return "Failed to read file: \(error.localizedDescription)"
            case .writeFailed(let error):
                return "Failed to write file: \(error.localizedDescription)"
            case .bookmarkCreationFailed:
                return "Failed to create security-scoped bookmark"
            case .bookmarkResolutionFailed:
                return "Failed to resolve security-scoped bookmark"
            }
        }

        public static func == (lhs: FileSystemError, rhs: FileSystemError) -> Bool {
            switch (lhs, rhs) {
            case (.permissionDenied, .permissionDenied),
                 (.fileNotFound, .fileNotFound),
                 (.invalidPath, .invalidPath),
                 (.bookmarkCreationFailed, .bookmarkCreationFailed),
                 (.bookmarkResolutionFailed, .bookmarkResolutionFailed),
                 (.readFailed, .readFailed),
                 (.writeFailed, .writeFailed):
                return true
            default:
                return false
            }
        }
    }
    
    /// Creates a file system manager.
    public init() {}
    
    // MARK: - File Access with Permissions
    
    #if os(macOS)
    /// Request access to a file or directory using native file picker.
    /// - Parameters:
    ///   - allowedFileTypes: Optional filename extensions to allow.
    ///   - allowsMultipleSelection: Whether multiple files can be selected.
    /// - Returns: The selected file URLs.
    public func requestFileAccess(
        allowedFileTypes: [String]? = nil,
        allowsMultipleSelection: Bool = false
    ) async throws -> [URL] {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.main.async {
                let panel = NSOpenPanel()
                panel.allowsMultipleSelection = allowsMultipleSelection
                panel.canChooseDirectories = false
                panel.canChooseFiles = true
                
                if let fileTypes = allowedFileTypes {
                    panel.allowedContentTypes = fileTypes.compactMap { UTType(filenameExtension: $0) }
                }
                
                panel.begin { response in
                    if response == .OK {
                        continuation.resume(returning: panel.urls)
                    } else {
                        continuation.resume(throwing: FileSystemError.permissionDenied)
                    }
                }
            }
        }
    }
    
    /// Request access to a directory.
    /// - Returns: The selected directory URL.
    public func requestDirectoryAccess() async throws -> URL {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.main.async {
                let panel = NSOpenPanel()
                panel.allowsMultipleSelection = false
                panel.canChooseDirectories = true
                panel.canChooseFiles = false
                panel.canCreateDirectories = true
                
                panel.begin { response in
                    if response == .OK, let url = panel.url {
                        continuation.resume(returning: url)
                    } else {
                        continuation.resume(throwing: FileSystemError.permissionDenied)
                    }
                }
            }
        }
    }
    #endif
    
    // MARK: - Security-Scoped Bookmarks
    
    /// Create a security-scoped bookmark for persistent file access.
    /// - Parameter url: The file URL to bookmark.
    /// - Returns: Bookmark data.
    public func createBookmark(for url: URL) throws -> Data {
        #if os(macOS)
        do {
            let bookmarkData = try url.bookmarkData(
                options: .withSecurityScope,
                includingResourceValuesForKeys: nil,
                relativeTo: nil
            )
            return bookmarkData
        } catch {
            throw FileSystemError.bookmarkCreationFailed
        }
        #else
        // iOS uses different security model
        throw FileSystemError.bookmarkCreationFailed
        #endif
    }
    
    /// Resolve a security-scoped bookmark to access the file.
    /// - Parameter bookmarkData: The stored bookmark data.
    /// - Returns: The resolved file URL.
    public func resolveBookmark(_ bookmarkData: Data) throws -> URL {
        #if os(macOS)
        var isStale = false
        do {
            let url = try URL(
                resolvingBookmarkData: bookmarkData,
                options: .withSecurityScope,
                relativeTo: nil,
                bookmarkDataIsStale: &isStale
            )
            
            if isStale {
                // Bookmark is stale, need to recreate it
                throw FileSystemError.bookmarkResolutionFailed
            }
            
            return url
        } catch {
            throw FileSystemError.bookmarkResolutionFailed
        }
        #else
        throw FileSystemError.bookmarkResolutionFailed
        #endif
    }
    
    /// Start accessing a security-scoped resource.
    /// - Parameter url: The URL to access.
    /// - Returns: `true` if access was granted.
    public func startAccessingSecurityScopedResource(_ url: URL) -> Bool {
        #if os(macOS)
        return url.startAccessingSecurityScopedResource()
        #else
        return true
        #endif
    }
    
    /// Stop accessing a security-scoped resource.
    /// - Parameter url: The URL to stop accessing.
    public func stopAccessingSecurityScopedResource(_ url: URL) {
        #if os(macOS)
        url.stopAccessingSecurityScopedResource()
        #endif
    }
    
    // MARK: - File Operations
    
    /// Read file contents with proper error handling.
    /// - Parameter url: The file URL to read.
    /// - Returns: The file data.
    public func readFile(at url: URL) async throws -> Data {
        guard FileManager.default.fileExists(atPath: url.path) else {
            throw FileSystemError.fileNotFound
        }
        
        do {
            return try await withCheckedThrowingContinuation { continuation in
                DispatchQueue.global(qos: .utility).async {
                    do {
                        let data = try Data(contentsOf: url)
                        continuation.resume(returning: data)
                    } catch {
                        continuation.resume(throwing: error)
                    }
                }
            }
        } catch {
            throw FileSystemError.readFailed(error)
        }
    }
    
    /// Write data to file with proper error handling.
    /// - Parameters:
    ///   - data: The data to write.
    ///   - url: The destination file URL.
    public func writeFile(data: Data, to url: URL) async throws {
        do {
            try await withCheckedThrowingContinuation { continuation in
                DispatchQueue.global(qos: .utility).async {
                    do {
                        try data.write(to: url, options: .atomic)
                        continuation.resume()
                    } catch {
                        continuation.resume(throwing: error)
                    }
                }
            }
        } catch {
            throw FileSystemError.writeFailed(error)
        }
    }
    
    /// Check if file exists.
    /// - Parameter url: The file URL to check.
    /// - Returns: `true` if the file exists.
    public func fileExists(at url: URL) -> Bool {
        return FileManager.default.fileExists(atPath: url.path)
    }
    
    /// Get file attributes.
    /// - Parameter url: The file URL to inspect.
    /// - Returns: The file attributes dictionary.
    public func fileAttributes(at url: URL) throws -> [FileAttributeKey: Any] {
        do {
            return try FileManager.default.attributesOfItem(atPath: url.path)
        } catch {
            throw FileSystemError.readFailed(error)
        }
    }
}

// MARK: - UTType Extension

#if os(macOS)
import UniformTypeIdentifiers

extension UTType {
    /// UTType for exported chat history files.
    static let chatHistory = UTType(exportedAs: "com.astudio.chat-history")
}
#endif
