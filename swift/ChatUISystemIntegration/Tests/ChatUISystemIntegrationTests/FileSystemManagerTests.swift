import XCTest
@testable import ChatUISystemIntegration

final class FileSystemManagerTests: XCTestCase {
    
    var fileSystemManager: FileSystemManager!
    var tempDirectory: URL!
    
    override func setUp() async throws {
        fileSystemManager = FileSystemManager()
        tempDirectory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        try FileManager.default.createDirectory(at: tempDirectory, withIntermediateDirectories: true)
    }
    
    override func tearDown() async throws {
        try? FileManager.default.removeItem(at: tempDirectory)
    }
    
    // MARK: - File Operations Tests
    
    func testFileExists() {
        // Create a test file
        let testFile = tempDirectory.appendingPathComponent("test.txt")
        FileManager.default.createFile(atPath: testFile.path, contents: Data())
        
        XCTAssertTrue(fileSystemManager.fileExists(at: testFile))
        
        let nonExistentFile = tempDirectory.appendingPathComponent("nonexistent.txt")
        XCTAssertFalse(fileSystemManager.fileExists(at: nonExistentFile))
    }
    
    func testReadFile() async throws {
        // Create a test file with content
        let testFile = tempDirectory.appendingPathComponent("test.txt")
        let testContent = "Hello, World!"
        try testContent.write(to: testFile, atomically: true, encoding: .utf8)
        
        let data = try await fileSystemManager.readFile(at: testFile)
        let readContent = String(data: data, encoding: .utf8)
        
        XCTAssertEqual(readContent, testContent)
    }
    
    func testReadFileNotFound() async {
        let nonExistentFile = tempDirectory.appendingPathComponent("nonexistent.txt")
        
        do {
            _ = try await fileSystemManager.readFile(at: nonExistentFile)
            XCTFail("Should throw fileNotFound error")
        } catch let error as FileSystemManager.FileSystemError {
            XCTAssertEqual(error, .fileNotFound)
        } catch {
            XCTFail("Unexpected error: \(error)")
        }
    }
    
    func testWriteFile() async throws {
        let testFile = tempDirectory.appendingPathComponent("write_test.txt")
        let testContent = "Test content"
        let data = testContent.data(using: .utf8)!
        
        try await fileSystemManager.writeFile(data: data, to: testFile)
        
        XCTAssertTrue(fileSystemManager.fileExists(at: testFile))
        
        let readData = try await fileSystemManager.readFile(at: testFile)
        let readContent = String(data: readData, encoding: .utf8)
        
        XCTAssertEqual(readContent, testContent)
    }
    
    func testFileAttributes() throws {
        // Create a test file
        let testFile = tempDirectory.appendingPathComponent("attributes_test.txt")
        try "Test".write(to: testFile, atomically: true, encoding: .utf8)
        
        let attributes = try fileSystemManager.fileAttributes(at: testFile)
        
        XCTAssertNotNil(attributes[.size])
        XCTAssertNotNil(attributes[.creationDate])
        XCTAssertNotNil(attributes[.modificationDate])
    }
    
    // MARK: - Security-Scoped Bookmark Tests
    
    #if os(macOS)
    func testCreateBookmark() throws {
        let testFile = tempDirectory.appendingPathComponent("bookmark_test.txt")
        try "Test".write(to: testFile, atomically: true, encoding: .utf8)
        
        let bookmarkData = try fileSystemManager.createBookmark(for: testFile)
        
        XCTAssertFalse(bookmarkData.isEmpty)
    }
    
    func testResolveBookmark() throws {
        let testFile = tempDirectory.appendingPathComponent("bookmark_resolve_test.txt")
        try "Test".write(to: testFile, atomically: true, encoding: .utf8)
        
        let bookmarkData = try fileSystemManager.createBookmark(for: testFile)
        let resolvedURL = try fileSystemManager.resolveBookmark(bookmarkData)
        
        XCTAssertEqual(resolvedURL.path, testFile.path)
    }
    
    func testSecurityScopedResourceAccess() throws {
        let testFile = tempDirectory.appendingPathComponent("security_test.txt")
        try "Test".write(to: testFile, atomically: true, encoding: .utf8)
        
        let bookmarkData = try fileSystemManager.createBookmark(for: testFile)
        let resolvedURL = try fileSystemManager.resolveBookmark(bookmarkData)
        
        let didStart = fileSystemManager.startAccessingSecurityScopedResource(resolvedURL)
        XCTAssertTrue(didStart)
        
        // Perform file operations
        XCTAssertTrue(fileSystemManager.fileExists(at: resolvedURL))
        
        fileSystemManager.stopAccessingSecurityScopedResource(resolvedURL)
    }
    #endif
    
    // MARK: - Error Handling Tests
    
    func testReadFileError() async {
        let invalidFile = URL(fileURLWithPath: "/invalid/path/file.txt")
        
        do {
            _ = try await fileSystemManager.readFile(at: invalidFile)
            XCTFail("Should throw error")
        } catch {
            XCTAssertTrue(error is FileSystemManager.FileSystemError)
        }
    }
    
    func testWriteFileError() async {
        let invalidFile = URL(fileURLWithPath: "/invalid/path/file.txt")
        let data = Data()
        
        do {
            try await fileSystemManager.writeFile(data: data, to: invalidFile)
            XCTFail("Should throw error")
        } catch {
            XCTAssertTrue(error is FileSystemManager.FileSystemError)
        }
    }
}
