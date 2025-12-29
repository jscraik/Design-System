import Foundation
#if canImport(AppKit)
import AppKit
#endif

/// Manages file system access with proper permission handling for macOS applications
public class FileSystemManager {
    
    public enum FileSystemError: Error, LocalizedError {
        case permissionDenied
        case fileNotFound
        case invalidPath
        case readFailed(Error)
        case writeFailed(Error)
        case bookmarkCreationFailed
        case bookmarkResolutionFailed
        
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
    }
    
    public init() {}
    
    // MARK: - File Access with Permissions
    
    /// Request access to a file or directory using native file picker
    /// Returns a security-scoped bookmark for persistent access
    #if os(macOS)
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
    
    /// Request access to a directory
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
    
    /// Create a security-scoped bookmark for persistent file access
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
        return Data()
        #endif
    }
    
    /// Resolve a security-scoped bookmark to access the file
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
    
    /// Start accessing a security-scoped resource
    public func startAccessingSecurityScopedResource(_ url: URL) -> Bool {
        #if os(macOS)
        return url.startAccessingSecurityScopedResource()
        #else
        return true
        #endif
    }
    
    /// Stop accessing a security-scoped resource
    public func stopAccessingSecurityScopedResource(_ url: URL) {
        #if os(macOS)
        url.stopAccessingSecurityScopedResource()
        #endif
    }
    
    // MARK: - File Operations
    
    /// Read file contents with proper error handling
    public func readFile(at url: URL) async throws -> Data {
        guard FileManager.default.fileExists(atPath: url.path) else {
            throw FileSystemError.fileNotFound
        }
        
        do {
            return try Data(contentsOf: url)
        } catch {
            throw FileSystemError.readFailed(error)
        }
    }
    
    /// Write data to file with proper error handling
    public func writeFile(data: Data, to url: URL) async throws {
        do {
            try data.write(to: url, options: .atomic)
        } catch {
            throw FileSystemError.writeFailed(error)
        }
    }
    
    /// Check if file exists
    public func fileExists(at url: URL) -> Bool {
        return FileManager.default.fileExists(atPath: url.path)
    }
    
    /// Get file attributes
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
    static let chatHistory = UTType(exportedAs: "com.chatui.chat-history")
}
#endif
