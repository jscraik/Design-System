import XCTest
@testable import AStudioMCP
import CryptoKit

final class CertificatePinningValidatorTests: XCTestCase {

    // MARK: - Test Certificates

    /// Sample self-signed certificate for testing (RSA 2048)
    /// This is a test certificate - DO NOT use in production
    private let samplePEMCertificate = """
    -----BEGIN CERTIFICATE-----
    MIIDDTCCAfWgAwIBAgIUDIvA7gwhrR6FtYz8uONHVP8yDT4wDQYJKoZIhvcNAQEL
    BQAwFjEUMBIGA1UEAwwLZXhhbXBsZS5jb20wHhcNMjYwMTA5MTkzMDA1WhcNMjYw
    MTEwMTkzMDA1WjAWMRQwEgYDVQQDDAtleGFtcGxlLmNvbTCCASIwDQYJKoZIhvcN
    AQEBBQADggEPADCCAQoCggEBALUinGpraROxeD/dw8evksOPvv4BbTt9pg5WoVM7
    4GQ1fCDDKtXngZtic28Cit7479M2FV4sLjoqSvAoLSo6trqq4p/Sz+4PCp4oWOcf
    dkoUql4+3w++Wr7v2DhnzChjr3NcAhIRNUVe16I6gXFbIqo4a5yJUmvy1l14pmSz
    xqrToss69YOir40jJdW+anqa0LnXXardHtDlOjQ44m63+xgu+L1J8i5Q23H+TaX9
    b/dRIB5z7p/lSHFlc6kTYCyNYuqS5t7twQQLJZYisEAuwrf8Oe2XY3m3xOVxnIT5
    Mp4BX0STuVqetDWThuf6v9bfR7p72/NWLIhAA8rxvksXWF0CAwEAAaNTMFEwHQYD
    VR0OBBYEFM8MWI13jnUBCxghvossL0kIrRoMMB8GA1UdIwQYMBaAFM8MWI13jnUB
    CxghvossL0kIrRoMMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEB
    AAHWyzemYHCgBHfoPBYkUR+081iQr6XvEamMr0vwpe/QstGJtyqGiAxV/aQjxVEM
    HY/DfVXsGIkol3exBUvXgOm0rS9Uv4sle0WLHo4MmViabEPan8B3NxMhp087EfDp
    acEiE6+cnVhMS3ONNVk9/E3Mq3VI/NX0ylW9h0oaj3RSkALNLpEZxnvTcNc890kY
    NICAXISsXzI0toic6AcUzV+n0Bsucg2vL9YwgeqMC95YyEylrmvGqSDVCzDyTAaR
    fMVYsnYQF6xapCt+egc4SLMpfBYxsPcj8LNZ/jKMF5NPNMX6beFSlSDrg+wllKj9
    cWIrZf6rlMkLHoJUCWclQq4=
    -----END CERTIFICATE-----
    """

    /// Another sample certificate for testing rotation
    private let samplePEMCertificate2 = """
    -----BEGIN CERTIFICATE-----
    MIIDDTCCAfWgAwIBAgIUdsEEuFSgnJhY6QXKQyspMfoFgugwDQYJKoZIhvcNAQEL
    BQAwFjEUMBIGA1UEAwwLZXhhbXBsZS5vcmcwHhcNMjYwMTA5MTkzMDA1WhcNMjYw
    MTEwMTkzMDA1WjAWMRQwEgYDVQQDDAtleGFtcGxlLm9yZzCCASIwDQYJKoZIhvcN
    AQEBBQADggEPADCCAQoCggEBAK8v05lMHeqZwzv/vw/Jt9sKKxFYI4W3xeOW9ZdC
    FG7YxMQyrYjM/qEUsQOWX/SosGM8jYeNA9wvrs3Ls+jkVpfybImpfecxQPDPil1v
    65YbBPfcwQACNE3zMYH9hD6biMaSDnboQJn1dB9hNntRJCgf+Q6tzPmYuAg8JKDb
    Ny0MCVxy6rsxcsNU9dCXdjOwEasNS2V6R2/GJ1I1Oxu/oWIByozAKtYQBtxp27C1
    kAvk43r2Jx9hdpoYhgsrPYD4bdO3SLeUZC4Aj8R9WNedJR9gEHxBpj9yE8yUrdV6
    V1UllGxOp1r2YIKXkGJTQZKNkH9JDckhaXMdFl/Z0p/Cw90CAwEAAaNTMFEwHQYD
    VR0OBBYEFArQBD4xQXhBBn/y+XJUga5GXQQyMB8GA1UdIwQYMBaAFArQBD4xQXhB
    Bn/y+XJUga5GXQQyMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEB
    AJ9SU0Nqnm1SGFko2aayNQ9LQDs6qB+lqZxGzfkb71K5N/yG9Vbw4MSn592T22AG
    SlEjTpnvgNwZ7YLa6RV++0w7cvx09ka4+ZCBdRY2Q3HN0asj0+ou7OYr0GBuZ+Wf
    32pLHqYTTfYdBJQxP2UPQVabh7LCfwrft0qa7I85cAmABozy7YVYzngIRC6y9rnW
    xpTS0sBdVNEvZzcTyJJoQPwrQUF1PVQej2AobOvh+S8OdH996WwCERLb9sBHbkYi
    ExZFluIkEWRbEYo9BIYx8J97yhHcsuJDtS19o30W36o1TIUQPyrMkuhDf1tI/KN6
    AxTDH69CLSttTraEepuDiNw=
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
