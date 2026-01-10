import XCTest
import CryptoKit
@testable import AStudioSystemIntegration

/// Comprehensive tests for CryptoManager
/// Tests encryption/decryption, key management, error handling, and security properties
final class CryptoManagerTests: XCTestCase {

    var cryptoManager: CryptoManager!

    override func setUp() {
        super.setUp()
        cryptoManager = CryptoManager()
    }

    override func tearDown() {
        cryptoManager = nil
        super.tearDown()
    }

    // MARK: - Basic Encryption/Decryption Tests

    func testEncryptAndDecryptData() async throws {
        let originalData = "Hello, World!".data(using: .utf8)!

        let encryptedData = try await cryptoManager.encrypt(originalData)
        let decryptedData = try await cryptoManager.decrypt(encryptedData)

        XCTAssertEqual(decryptedData, originalData, "Decrypted data should match original")
    }

    func testEncryptAndDecryptString() async throws {
        let originalString = "Secret message content"

        let encryptedData = try await cryptoManager.encryptString(originalString)
        let decryptedString = try await cryptoManager.decryptString(encryptedData)

        XCTAssertEqual(decryptedString, originalString, "Decrypted string should match original")
    }

    func testEncryptedDataIsDifferentFromOriginal() async throws {
        let originalData = "Test data".data(using: .utf8)!

        let encryptedData = try await cryptoManager.encrypt(originalData)

        // Encrypted data should be different from original
        XCTAssertNotEqual(
            encryptedData,
            originalData,
            "Encrypted data should not match original"
        )

        // Encrypted data should be longer (includes nonce and tag)
        XCTAssertGreaterThan(
            encryptedData.count,
            originalData.count,
            "Encrypted data should be larger due to AES-GCM overhead"
        )
    }

    func testMultipleEncryptionsOfSameData() async throws {
        let originalData = "Consistent data".data(using: .utf8)!

        let encrypted1 = try await cryptoManager.encrypt(originalData)
        let encrypted2 = try await cryptoManager.encrypt(originalData)

        // AES-GCM uses random nonce, so each encryption should be different
        XCTAssertNotEqual(
            encrypted1,
            encrypted2,
            "Multiple encryptions should produce different ciphertexts (different nonces)"
        )

        // But both should decrypt to the same original
        let decrypted1 = try await cryptoManager.decrypt(encrypted1)
        let decrypted2 = try await cryptoManager.decrypt(encrypted2)

        XCTAssertEqual(decrypted1, originalData)
        XCTAssertEqual(decrypted2, originalData)
    }

    // MARK: - Data Size Tests

    func testEncryptEmptyData() async throws {
        let emptyData = Data()

        let encryptedData = try await cryptoManager.encrypt(emptyData)
        let decryptedData = try await cryptoManager.decrypt(encryptedData)

        XCTAssertEqual(decryptedData, emptyData, "Empty data should encrypt/decrypt correctly")

        // Encrypted empty data should still have overhead (nonce + tag)
        XCTAssertGreaterThan(encryptedData.count, 0, "Encrypted empty data should not be empty")
    }

    func testEncryptLargeData() async throws {
        // Create 1MB of data
        let largeData = Data(repeating: 0xFF, count: 1_048_576)

        let encryptedData = try await cryptoManager.encrypt(largeData)
        let decryptedData = try await cryptoManager.decrypt(encryptedData)

        XCTAssertEqual(decryptedData, largeData, "Large data should encrypt/decrypt correctly")

        // Encrypted data should be slightly larger (16 bytes for tag + nonce)
        let expectedOverhead = 16 + 12 // GCM tag + 96-bit nonce
        XCTAssertEqual(
            encryptedData.count,
            largeData.count + expectedOverhead,
            "Encrypted data should include GCM tag and nonce overhead"
        )
    }

    func testEncryptSmallData() async throws {
        let smallData = Data([0x01, 0x02, 0x03])

        let encryptedData = try await cryptoManager.encrypt(smallData)
        let decryptedData = try await cryptoManager.decrypt(encryptedData)

        XCTAssertEqual(decryptedData, smallData)
        XCTAssertGreaterThan(encryptedData.count, smallData.count)
    }

    func testEncryptVariableSizes() async throws {
        let sizes = [1, 16, 32, 64, 128, 256, 512, 1024, 4096]

        for size in sizes {
            let data = Data((0..<size).map { _ in UInt8.random(in: 0...255) })

            let encrypted = try await cryptoManager.encrypt(data)
            let decrypted = try await cryptoManager.decrypt(encrypted)

            XCTAssertEqual(decrypted, data, "Data of size \(size) should encrypt/decrypt correctly")
        }
    }

    // MARK: - Invalid Data Handling Tests

    func testDecryptInvalidData() async {
        let invalidData = Data([0x00, 0x01, 0x02, 0x03])

        do {
            _ = try await cryptoManager.decrypt(invalidData)
            XCTFail("Expected invalidData error")
        } catch {
            XCTAssertTrue(
                error is CryptoManager.CryptoError,
                "Should throw CryptoError for invalid data"
            )
            if case CryptoManager.CryptoError.invalidData = error {
                // Expected
            } else {
                XCTFail("Expected invalidData error")
            }
        }
    }

    func testDecryptEmptyData() async {
        let emptyData = Data()

        do {
            _ = try await cryptoManager.decrypt(emptyData)
            XCTFail("Expected invalidData error")
        } catch {
            XCTAssertTrue(error is CryptoManager.CryptoError)
            if case CryptoManager.CryptoError.invalidData = error {
                // Expected
            } else {
                XCTFail("Expected invalidData error")
            }
        }
    }

    func testDecryptTooShortData() async {
        // AES-GCM combined format requires at least nonce (12) + tag (16) = 28 bytes
        let tooShortData = Data(repeating: 0x00, count: 10)

        do {
            _ = try await cryptoManager.decrypt(tooShortData)
            XCTFail("Expected decryption failure for short data")
        } catch {
            XCTAssertTrue(error is CryptoManager.CryptoError)
        }
    }

    func testDecryptModifiedCiphertext() async throws {
        let originalData = "Test data".data(using: .utf8)!
        let encryptedData = try await cryptoManager.encrypt(originalData)

        // Modify a byte in the encrypted data (not the tag)
        var modifiedData = encryptedData
        modifiedData[0] = modifiedData[0] ^ 0xFF // Flip one bit

        do {
            _ = try await cryptoManager.decrypt(modifiedData)
            XCTFail("Expected decryptionFailed error for modified ciphertext")
        } catch {
            XCTAssertTrue(
                error is CryptoManager.CryptoError,
                "Modified ciphertext should fail authentication"
            )
            if case CryptoManager.CryptoError.decryptionFailed = error {
                // Expected - GCM authentication failure
            } else {
                XCTFail("Expected decryptionFailed error for modified ciphertext")
            }
        }
    }

    func testDecryptWithWrongKey() async throws {
        let originalData = "Sensitive data".data(using: .utf8)!

        // Encrypt with one key
        let encrypted = try await cryptoManager.encrypt(originalData)

        // Create a new manager with a different key
        let differentManager = CryptoManager()

        // Try to decrypt with wrong key
        do {
            _ = try await differentManager.decrypt(encrypted)
            XCTFail("Expected decryptionFailed error for wrong key")
        } catch {
            XCTAssertTrue(
                error is CryptoManager.CryptoError,
                "Decryption with wrong key should fail"
            )
            if case CryptoManager.CryptoError.decryptionFailed = error {
                // Expected - authentication failure
            } else {
                XCTFail("Expected decryptionFailed error for wrong key")
            }
        }
    }

    // MARK: - Key Management Tests

    func testExportAndImportKey() async throws {
        let originalData = "Test data for key export".data(using: .utf8)!

        // Encrypt and export key
        let encrypted = try await cryptoManager.encrypt(originalData)
        let exportedKey = await cryptoManager.exportKey()

        // Create new manager with exported key
        let newManager = CryptoManager(keyData: exportedKey)

        // Decrypt with new manager
        let decrypted = try await newManager.decrypt(encrypted)

        XCTAssertEqual(decrypted, originalData, "Exported key should work correctly")
    }

    func testExportKeySize() async {
        let exportedKey = await cryptoManager.exportKey()

        // AES-256 uses 32-byte keys
        XCTAssertEqual(
            exportedKey.count,
            32,
            "Exported key should be 32 bytes for AES-256"
        )
    }

    func testImportInvalidKeySize() async throws {
        let validKeyData = Data(repeating: 0x00, count: 32)
        _ = CryptoManager(keyData: validKeyData)

        throw XCTSkip("CryptoManager uses precondition for invalid key sizes; validation requires fatal-error harness.")
    }

    func testDifferentManagersHaveDifferentKeys() async throws {
        let manager1 = CryptoManager()
        let manager2 = CryptoManager()

        let key1 = await manager1.exportKey()
        let key2 = await manager2.exportKey()

        // Keys should be different (randomly generated)
        XCTAssertNotEqual(key1, key2, "Different managers should have different keys")

        // Test that keys are not equal
        let testData = "Test data".data(using: .utf8)!

        let encrypted1 = try await manager1.encrypt(testData)
        let encrypted2 = try await manager2.encrypt(testData)

        XCTAssertNotEqual(
            encrypted1,
            encrypted2,
            "Encryption with different keys should produce different ciphertext"
        )

        // Should not be able to decrypt across managers
        do {
            _ = try await manager2.decrypt(encrypted1)
            XCTFail("Expected decryption failure with mismatched key")
        } catch {
            XCTAssertTrue(error is CryptoManager.CryptoError)
        }
    }

    // MARK: - String Encoding Tests

    func testEncryptStringWithSpecialCharacters() async throws {
        let specialStrings = [
            "Hello, World!",
            "🔐🔑 Secure! 💪",
            "特殊字符测试",
            "العربية",
            "עברית",
            "Español: ¿Qué tal?",
            "Français: çàèéù",
            "Deutsch: äöüß",
            "Emoji: 😀🎉🚀✨",
            "Symbols: ©®™€£¥§¶",
            "Math: ∑∫√∞≈≠≤≥",
            "Arrows: ←↑→↓↔↕",
            "Quotes: \"'`",
            "Mixed: Hello 世界 🌍"
        ]

        for string in specialStrings {
            let encrypted = try await cryptoManager.encryptString(string)
            let decrypted = try await cryptoManager.decryptString(encrypted)

            XCTAssertEqual(
                decrypted,
                string,
                "String with special characters should round-trip: \(string)"
            )
        }
    }

    func testEncryptStringWithNewlinesAndTabs() async throws {
        let multilineString = """
        Line 1
        Line 2\tWith Tab
        Line 3
        """

        let encrypted = try await cryptoManager.encryptString(multilineString)
        let decrypted = try await cryptoManager.decryptString(encrypted)

        XCTAssertEqual(decrypted, multilineString, "Multiline string should round-trip")
    }

    func testDecryptInvalidUTF8Data() async throws {
        // Create valid data, encrypt it
        let validString = "Valid UTF-8"
        _ = try await cryptoManager.encryptString(validString)

        // Corrupt the encrypted data (after decryption, before UTF-8 decoding)
        // This is hard to test directly since we can't modify the internal state
        // But we can test with data that won't be valid UTF-8 after decryption

        let nonUTF8Data = Data([0xFF, 0xFE, 0xFD, 0xFC])
        let encryptedNonUTF8 = try await cryptoManager.encrypt(nonUTF8Data)

        do {
            _ = try await cryptoManager.decryptString(encryptedNonUTF8)
            XCTFail("Expected invalidData error for non-UTF8")
        } catch {
            XCTAssertTrue(
                error is CryptoManager.CryptoError,
                "Non-UTF8 data should throw error when decrypting as string"
            )
            if case CryptoManager.CryptoError.invalidData = error {
                // Expected
            } else {
                XCTFail("Expected invalidData error for non-UTF8")
            }
        }
    }

    // MARK: - Error Message Tests

    func testErrorDescriptions() async throws {
        struct ErrorTestCase {
            let operation: () async throws -> Void
            let expectedError: CryptoManager.CryptoError
            let descriptionContains: String
        }

        let invalidData = Data([0x00, 0x01])
        let invalidDataCase = ErrorTestCase(
            operation: { _ = try await self.cryptoManager.decrypt(invalidData) },
            expectedError: .invalidData,
            descriptionContains: "Invalid data"
        )

        let validData = "test".data(using: .utf8)!
        let encrypted = try await self.cryptoManager.encrypt(validData)
        var modified = encrypted
        modified[0] = modified[0] ^ 0xFF
        let modifiedCiphertextCase = ErrorTestCase(
            operation: { _ = try await self.cryptoManager.decrypt(modified) },
            expectedError: .decryptionFailed(NSError(domain: "CryptoManagerTests", code: -1)),
            descriptionContains: "Decryption failed"
        )

        let testCases: [ErrorTestCase] = [invalidDataCase, modifiedCiphertextCase]

        for testCase in testCases {
            do {
                _ = try await testCase.operation()
                XCTFail("Should throw error")
            } catch {
                XCTAssertTrue(
                    error is CryptoManager.CryptoError,
                    "Should be CryptoError"
                )

                if let cryptoError = error as? CryptoManager.CryptoError {
                    XCTAssertNotNil(
                        cryptoError.errorDescription,
                        "Error should have description"
                    )
                    XCTAssertTrue(
                        matchesCryptoError(testCase.expectedError, cryptoError),
                        "Expected error case to match"
                    )
                }
            }
        }
    }

    // MARK: - Table-Driven Tests

    func testEncryptionDecryptionTableDriven() async throws {
        struct EncryptionTestCase {
            let name: String
            let data: Data
            let description: String
        }

        let testCases: [EncryptionTestCase] = [
            EncryptionTestCase(
                name: "Empty data",
                data: Data(),
                description: "Empty data should encrypt/decrypt"
            ),
            EncryptionTestCase(
                name: "Single byte",
                data: Data([0x42]),
                description: "Single byte should encrypt/decrypt"
            ),
            EncryptionTestCase(
                name: "Short text",
                data: "Hello".data(using: .utf8)!,
                description: "Short text should encrypt/decrypt"
            ),
            EncryptionTestCase(
                name: "AES block size",
                data: Data(repeating: 0x00, count: 16),
                description: "Exactly one AES block"
            ),
            EncryptionTestCase(
                name: "Two AES blocks",
                data: Data(repeating: 0xFF, count: 32),
                description: "Two AES blocks"
            ),
            EncryptionTestCase(
                name: "Random data",
                data: Data((0..<100).map { _ in UInt8.random(in: 0...255) }),
                description: "Random bytes should encrypt/decrypt"
            ),
            EncryptionTestCase(
                name: "Unicode text",
                data: "Hello 世界 🌍".data(using: .utf8)!,
                description: "Unicode should encrypt/decrypt"
            ),
            EncryptionTestCase(
                name: "Large data",
                data: Data(repeating: 0xAB, count: 10_000),
                description: "Large data should encrypt/decrypt"
            ),
            EncryptionTestCase(
                name: "All zeros",
                data: Data(repeating: 0x00, count: 256),
                description: "All zeros should encrypt/decrypt"
            ),
            EncryptionTestCase(
                name: "All ones",
                data: Data(repeating: 0xFF, count: 256),
                description: "All ones should encrypt/decrypt"
            ),
            EncryptionTestCase(
                name: "Repeated pattern",
                data: Data(repeating: 0xAA, count: 512),
                description: "Repeated pattern should encrypt/decrypt"
            )
        ]

        for testCase in testCases {
            let encrypted = try await cryptoManager.encrypt(testCase.data)
            let decrypted = try await cryptoManager.decrypt(encrypted)

            XCTAssertEqual(
                decrypted,
                testCase.data,
                "\(testCase.description): \(testCase.name)"
            )

            // Encrypted should be different (except for empty data)
            if !testCase.data.isEmpty {
                XCTAssertNotEqual(
                    encrypted,
                    testCase.data,
                    "\(testCase.name): Encrypted data should differ from original"
                )
            }

            // Encrypted should be larger
            XCTAssertGreaterThanOrEqual(
                encrypted.count,
                testCase.data.count,
                "\(testCase.name): Encrypted data should be at least as large"
            )
        }
    }

    // MARK: - Performance Tests

    func testEncryptionPerformance() async throws {
        let dataSize = 1_048_576 // 1MB
        let data = Data(repeating: 0x00, count: dataSize)

        measure {
            let expectation = XCTestExpectation(description: "Encrypt performance")
            Task {
                for _ in 0..<10 {
                    _ = try? await self.cryptoManager.encrypt(data)
                }
                expectation.fulfill()
            }
            wait(for: [expectation], timeout: 10.0)
        }
    }

    func testDecryptionPerformance() async throws {
        let dataSize = 1_048_576 // 1MB
        let data = Data(repeating: 0x00, count: dataSize)
        let encrypted = try await cryptoManager.encrypt(data)

        measure {
            let expectation = XCTestExpectation(description: "Decrypt performance")
            Task {
                for _ in 0..<10 {
                    _ = try? await self.cryptoManager.decrypt(encrypted)
                }
                expectation.fulfill()
            }
            wait(for: [expectation], timeout: 10.0)
        }
    }

    func testSmallDataPerformance() async throws {
        let data = "Small test".data(using: .utf8)!

        measure {
            let expectation = XCTestExpectation(description: "Small data performance")
            Task {
                for _ in 0..<1000 {
                    let encrypted = try! await self.cryptoManager.encrypt(data)
                    _ = try! await self.cryptoManager.decrypt(encrypted)
                }
                expectation.fulfill()
            }
            wait(for: [expectation], timeout: 10.0)
        }
    }

    // MARK: - Concurrent Access Tests

    func testConcurrentEncryptionDecryption() async throws {
        let testData = "Concurrent test data".data(using: .utf8)!

        // Pre-encrypt some data
        let encryptedData = try await cryptoManager.encrypt(testData)

        await withTaskGroup(of: Data.self) { group in
            // Launch multiple concurrent encryption tasks
            for _ in 0..<10 {
                group.addTask {
                    return try! await self.cryptoManager.encrypt(testData)
                }
            }

            var results: [Data] = []
            for await result in group {
                results.append(result)
            }

            // All encryptions should succeed
            XCTAssertEqual(results.count, 10)

            // All should be different (different nonces)
            let uniqueResults = Set(results.map { $0.base64EncodedString() })
            XCTAssertEqual(uniqueResults.count, 10, "Each encryption should be unique")
        }

        // Test concurrent decryption
        await withTaskGroup(of: Data.self) { group in
            for _ in 0..<10 {
                group.addTask {
                    return try! await self.cryptoManager.decrypt(encryptedData)
                }
            }

            var results: [Data] = []
            for await result in group {
                results.append(result)
            }

            XCTAssertEqual(results.count, 10)

            // All decryptions should match original
            for result in results {
                XCTAssertEqual(result, testData)
            }
        }
    }

    // MARK: - Actor Isolation Tests

    func testActorSerialization() async throws {
        // CryptoManager is an actor - test serialization
        let data1 = "Data 1".data(using: .utf8)!
        let data2 = "Data 2".data(using: .utf8)!
        let data3 = "Data 3".data(using: .utf8)!

        async let enc1: Data = try await cryptoManager.encrypt(data1)
        async let enc2: Data = try await cryptoManager.encrypt(data2)
        async let enc3: Data = try await cryptoManager.encrypt(data3)

        // All should complete successfully
        let (e1, e2, e3) = try await (enc1, enc2, enc3)

        // Verify all are different
        XCTAssertNotEqual(e1, e2)
        XCTAssertNotEqual(e2, e3)
        XCTAssertNotEqual(e1, e3)

        // Verify all decrypt correctly
        async let dec1: Data = try await cryptoManager.decrypt(e1)
        async let dec2: Data = try await cryptoManager.decrypt(e2)
        async let dec3: Data = try await cryptoManager.decrypt(e3)

        let (d1, d2, d3) = try await (dec1, dec2, dec3)

        XCTAssertEqual(d1, data1)
        XCTAssertEqual(d2, data2)
        XCTAssertEqual(d3, data3)
    }

    // MARK: - Security Properties Tests

    func testEncryptionProvidesConfidentiality() async throws {
        let sensitiveData = "Password: SuperSecret123!".data(using: .utf8)!

        let encrypted = try await cryptoManager.encrypt(sensitiveData)

        // Encrypted data should not contain the original string
        let encryptedString = String(data: encrypted, encoding: .utf8)
        XCTAssertNil(
            encryptedString,
            "Encrypted data should not be valid UTF-8 containing plaintext"
        )

        // Even if interpreted as Latin-1, original should not be easily visible
        if let latin1String = String(data: encrypted, encoding: .isoLatin1) {
            XCTAssertFalse(
                latin1String.contains("Password"),
                "Plaintext password should not be visible in encrypted data"
            )
        }
    }

    func testEncryptionProvidesIntegrity() async throws {
        let data = "Integrity check".data(using: .utf8)!

        let encrypted = try await cryptoManager.encrypt(data)

        // Tamper with the encrypted data (change last byte - likely the tag)
        var tamperedData = encrypted
        tamperedData[tamperedData.count - 1] = tamperedData[tamperedData.count - 1] ^ 0xFF

        // Decryption should fail due to authentication tag mismatch
        do {
            _ = try await cryptoManager.decrypt(tamperedData)
            XCTFail("Expected decryptionFailed error for tampered data")
        } catch {
            XCTAssertTrue(
                error is CryptoManager.CryptoError,
                "Tampered data should fail authentication"
            )
            if case CryptoManager.CryptoError.decryptionFailed = error {
                // Expected
            } else {
                XCTFail("Expected decryptionFailed error for tampered data")
            }
        }
    }

    func testDifferentKeysProduceDifferentCiphertexts() async throws {
        let data = "Key independence test".data(using: .utf8)!

        let manager1 = CryptoManager()
        let manager2 = CryptoManager()
        let manager3 = CryptoManager()

        let enc1 = try await manager1.encrypt(data)
        let enc2 = try await manager2.encrypt(data)
        let enc3 = try await manager3.encrypt(data)

        // All ciphertexts should be different
        XCTAssertNotEqual(enc1, enc2, "Different keys should produce different ciphertexts")
        XCTAssertNotEqual(enc2, enc3, "Different keys should produce different ciphertexts")
        XCTAssertNotEqual(enc1, enc3, "Different keys should produce different ciphertexts")

        // Verify Hamming distance between ciphertexts is significant
        // (indicating good key diffusion)
        let distance12 = hammingDistance(enc1, enc2)
        let distance13 = hammingDistance(enc1, enc3)
        let distance23 = hammingDistance(enc2, enc3)

        // For 128-bit output, expect at least 32 bits different
        XCTAssertGreaterThan(distance12, 32, "Ciphertexts should differ significantly")
        XCTAssertGreaterThan(distance13, 32, "Ciphertexts should differ significantly")
        XCTAssertGreaterThan(distance23, 32, "Ciphertexts should differ significantly")
    }

    // MARK: - Edge Cases

    func testEncryptDecryptWithZeroData() async throws {
        let zeroData = Data(repeating: 0x00, count: 1024)

        let encrypted = try await cryptoManager.encrypt(zeroData)
        let decrypted = try await cryptoManager.decrypt(encrypted)

        XCTAssertEqual(decrypted, zeroData)
        XCTAssertNotEqual(encrypted, zeroData)
    }

    func testEncryptDecryptWithPatternedData() async throws {
        let patternedData = Data((0..<256).map { UInt8($0) })

        let encrypted = try await cryptoManager.encrypt(patternedData)
        let decrypted = try await cryptoManager.decrypt(encrypted)

        XCTAssertEqual(decrypted, patternedData)
        XCTAssertNotEqual(encrypted, patternedData)

        // Verify the pattern is destroyed in ciphertext
        var hasPattern = true
        for i in 1..<encrypted.count {
            if encrypted[i] != encrypted[0] {
                hasPattern = false
                break
            }
        }
        XCTAssertFalse(hasPattern, "Ciphertext should not preserve input patterns")
    }

    // MARK: - Helper Methods

    private func hammingDistance(_ data1: Data, _ data2: Data) -> Int {
        let minCount = min(data1.count, data2.count)
        var distance = 0

        for i in 0..<minCount {
            let byte1 = data1[i]
            let byte2 = data2[i]
            var xor = byte1 ^ byte2

            while xor != 0 {
                distance += 1
                xor &= xor - 1
            }
        }

        // Count extra bytes
        distance += abs(data1.count - data2.count) * 8

        return distance
    }

    private func matchesCryptoError(
        _ expected: CryptoManager.CryptoError,
        _ actual: CryptoManager.CryptoError
    ) -> Bool {
        switch (expected, actual) {
        case (.invalidData, .invalidData):
            return true
        case (.encryptionFailed, .encryptionFailed):
            return true
        case (.decryptionFailed, .decryptionFailed):
            return true
        default:
            return false
        }
    }
}
