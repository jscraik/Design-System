import XCTest
@testable import ChatUIMCP
import CryptoKit

final class CertificatePinningValidatorTests: XCTestCase {

    // MARK: - Test Certificates

    /// Sample self-signed certificate for testing (RSA 2048)
    /// This is a test certificate - DO NOT use in production
    private let samplePEMCertificate = """
    -----BEGIN CERTIFICATE-----
    MIIDXTCCAkWgAwIBAgIJAKL0UG+mRKqzMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
    BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
    aWRnaXRzIFB0eSBMdGQwHhcNMjQwMTAxMDAwMDAwWhcNMjUwMTAxMDAwMDAwWjBF
    MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
    ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
    CgKCAQEAuN6fRKcxFPq0YqLznN7t3YQtJ4s9Q8WxCdY3Jk9PqaH5PqV8QmCP3wDQF
    0NfLqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP
    4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5L
    qM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9
    HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP
    4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5L
    qM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9
    HtM5LqM8nP4dK9HtM5LqM8nP4wIDAQABo1AwTjAdBgNVHQ4EFgQUK8fZ6LqM8nP4d
    K9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGA
    QUFBwMCMAsGA1UdDwQEAwIBBjANBgkqhkiG9w0BAQsFAAOCAQEAuN6fRKcxFPq0Yq
    LznN7t3YQtJ4s9Q8WxCdY3Jk9PqaH5PqV8QmCP3wDQF0NfLqM8nP4dK9HtM5LqM8n
    P4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5
    -----END CERTIFICATE-----
    """

    /// Another sample certificate for testing rotation
    private let samplePEMCertificate2 = """
    -----BEGIN CERTIFICATE-----
    MIIDWTCCAkGgAwIBAgIJAKL0UG+mRKq1MA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
    BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
    aWRnaXRzIFB0eSBMdGQwHhcNMjQwMTAyMDAwMDAwWhcNMjUwMTAyMDAwMDAwWjBF
    MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
    ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
    CgKCAQEAuN6fRKcxFPq0YqLznN7t3YQtJ4s9Q8WxCdY3Jk9PqaH5PqV8QmCP3wDQF
    0NfLqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP
    4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5L
    qM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9
    HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP
    4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5L
    qM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9
    HtM5LqM8nP4dK9HtM5LqM8nP4wIDAQABo1AwTjAdBgNVHQ4EFgQUK8fZ6LqM8nP4d
    K9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGA
    QUFBwMCMAsGA1UdDwQEAwIBBjANBgkqhkiG9w0BAQsFAAOCAQEAuN6fRKcxFPq0Yq
    LznN7t3YQtJ4s9Q8WxCdY3Jk9PqaH5PqV8QmCP3wDQF0NfLqM8nP4dK9HtM5LqM8n
    P4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5LqM8nP4dK9HtM5
    -----END CERTIFICATE-----
    """

    // MARK: - Hash Extraction Tests

    func testSPKIHashExtractionFromPEM() throws {
        let certData = samplePEMCertificate.data(using: .utf8)!

        let hash = try CertificatePinningValidator.extractSPKIHash(from: certData)

        // Verify it's a valid base64 string
        XCTAssertNotNil(Data(base64Encoded: hash))

        // Verify it's the right length (SHA-256 = 32 bytes = 44 chars in base64)
        XCTAssertEqual(hash.count, 44)
    }

    func testCertificateHashExtractionFromPEM() throws {
        let certData = samplePEMCertificate.data(using: .utf8)!

        let hash = try CertificatePinningValidator.extractCertificateHash(from: certData)

        // Verify it's a valid base64 string
        XCTAssertNotNil(Data(base64Encoded: hash))

        // Verify it's the right length
        XCTAssertEqual(hash.count, 44)
    }

    func testHashesAreDifferent() throws {
        let certData1 = samplePEMCertificate.data(using: .utf8)!
        let certData2 = samplePEMCertificate2.data(using: .utf8)!

        let hash1 = try CertificatePinningValidator.extractSPKIHash(from: certData1)
        let hash2 = try CertificatePinningValidator.extractSPKIHash(from: certData2)

        // Different certificates should have different hashes
        XCTAssertNotEqual(hash1, hash2)
    }

    // MARK: - Validator Creation Tests

    func testValidatorInitialization() {
        let validator = CertificatePinningValidator(
            pinnedHashes: ["hash1", "hash2"],
            hashType: .spkiSHA256,
            mode: .strict
        )

        XCTAssertNotNil(validator)
    }

    func testProductionValidator() {
        let validator = CertificatePinningValidator.production(hashes: ["hash1"])

        XCTAssertNotNil(validator)
    }

    func testDevelopmentValidator() {
        let validator = CertificatePinningValidator.development()

        XCTAssertNotNil(validator)
    }

    // MARK: - Session Creation Tests

    func testCreatePinnedSession() {
        let validator = CertificatePinningValidator(
            pinnedHashes: ["testHash"],
            hashType: .spkiSHA256,
            mode: .strict
        )

        let session = validator.createPinnedSession()

        XCTAssertNotNil(session)
        XCTAssertTrue(session.delegate === validator)
    }

    // MARK: - Localhost Detection Tests

    func testLocalhostDetection() {
        let validator = CertificatePinningValidator.development()

        // Test various localhost patterns
        let localhostURLs = [
            "http://localhost:8787",
            "http://127.0.0.1:8787",
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ]

        for urlString in localhostURLs {
            if let url = URL(string: urlString) {
                let client = MCPClient(baseURL: url)
                XCTAssertNotNil(client)
            }
        }
    }

    // MARK: - Hash Type Tests

    func testSPKIVersusCertificateHash() throws {
        let certData = samplePEMCertificate.data(using: .utf8)!

        let spkiHash = try CertificatePinningValidator.extractSPKIHash(from: certData)
        let certHash = try CertificatePinningValidator.extractCertificateHash(from: certData)

        // SPKI and certificate hashes should be different
        XCTAssertNotEqual(spkiHash, certHash)

        // Both should be valid base64
        XCTAssertNotNil(Data(base64Encoded: spkiHash))
        XCTAssertNotNil(Data(base64Encoded: certHash))
    }

    // MARK: - Integration Tests

    func testMCPClientWithPinning() {
        let testHashes = [
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
            "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="
        ]

        let url = URL(string: "https://example.com")!
        let client = MCPClient(
            baseURL: url,
            pinnedHashes: testHashes,
            hashType: .spkiSHA256,
            pinningMode: .strict
        )

        XCTAssertNotNil(client)
    }

    func testMCPClientWithDevelopmentMode() {
        let url = URL(string: "http://localhost:8787")!
        let client = MCPClient(baseURL: url)

        XCTAssertNotNil(client)
    }

    // MARK: - Error Handling Tests

    func testInvalidPEMCertificate() {
        let invalidCert = "NOT A CERTIFICATE".data(using: .utf8)!

        XCTAssertThrowsError(try CertificatePinningValidator.extractSPKIHash(from: invalidCert)) { error in
            if case MCPError.certificatePinningFailed = error {
                // Expected error
            } else {
                XCTFail("Expected certificatePinningFailed error")
            }
        }
    }

    func testEmptyCertificate() {
        let emptyCert = Data()

        XCTAssertThrowsError(try CertificatePinningValidator.extractSPKIHash(from: emptyCert)) { error in
            if case MCPError.certificatePinningFailed = error {
                // Expected error
            } else {
                XCTFail("Expected certificatePinningFailed error")
            }
        }
    }

    // MARK: - Certificate Rotation Tests

    func testMultiplePinnedCertificates() {
        let testHashes = [
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
            "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=",
            "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC="
        ]

        let validator = CertificatePinningValidator(
            pinnedHashes: testHashes,
            hashType: .spkiSHA256,
            mode: .strict
        )

        let session = validator.createPinnedSession()
        XCTAssertNotNil(session)
    }

    // MARK: - Performance Tests

    func testHashComputationPerformance() throws {
        let certData = samplePEMCertificate.data(using: .utf8)!

        measure {
            _ = try? CertificatePinningValidator.extractSPKIHash(from: certData)
        }
    }

    func testValidatorCreationPerformance() {
        let hashes = (0..<10).map { _ in
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
        }

        measure {
            _ = CertificatePinningValidator(
                pinnedHashes: hashes,
                hashType: .spkiSHA256,
                mode: .strict
            )
        }
    }

    // MARK: - Debug Tests

    #if DEBUG
    func testDebugPrintCertificate() {
        let certData = samplePEMCertificate.data(using: .utf8)!

        // This should not crash
        CertificatePinningValidator.debugPrintCertificate(certificateData: certData)
    }
    #endif
}

// MARK: - Test Helpers

extension CertificatePinningValidatorTests {

    /// Create a mock server trust object for testing
    /// Note: This is a simplified mock for unit testing purposes
    func createMockTrust() -> SecTrust? {
        // In a real implementation, you would create a proper mock trust
        // For now, we return nil to indicate this needs proper implementation
        return nil
    }
}
