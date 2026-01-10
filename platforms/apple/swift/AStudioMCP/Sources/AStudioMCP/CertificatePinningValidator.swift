import Foundation
import CryptoKit
import Security

/// Validation mode for certificate pinning.
public enum PinningMode {
    /// Strict mode - only pinned certificates are accepted
    case strict
    /// Relaxed mode - allow system validation if pinning fails
    case relaxed
}

/// Type of hash to use for pinning.
public enum PinningHashType {
    /// SHA-256 hash of the certificate's Subject Public Key Info (SPKI)
    /// Recommended for certificate rotation
    case spkiSHA256
    /// SHA-256 hash of the entire certificate DER encoding
    case certificateSHA256
}

/// Validator for TLS certificate pinning.
///
/// This class implements certificate pinning to ensure secure connections
/// to MCP servers by validating server certificates against known hashes.
///
/// ## Usage
///
/// ```swift
/// let validator = CertificatePinningValidator(
///     pinnedHashes: [
///         "base64encodedhash1==",
///         "base64encodedhash2=="
///     ],
///     hashType: .spkiSHA256,
///     mode: .strict
/// )
///
/// let session = URLSession(
///     configuration: .default,
///     delegate: validator,
///     delegateQueue: nil
/// )
/// ```
public final class CertificatePinningValidator: NSObject, URLSessionDelegate {

    // MARK: - Properties

    /// Set of pinned certificate hashes
    private let pinnedHashes: Set<String>

    /// Type of hash to use for validation
    private let hashType: PinningHashType

    /// Validation mode
    private let mode: PinningMode

    /// Hosts that should skip pinning (for development)
    private let localhostHosts: Set<String> = [
        "localhost",
        "127.0.0.1",
        "::1",
        "0.0.0.0"
    ]

    /// Known development ports
    private let developmentPorts: Set<Int> = [
        3000, 3001, 5000, 5001, 8000, 8080, 8787, 9000
    ]

    // MARK: - Initialization

    /// Initialize a certificate pinning validator.
    /// - Parameters:
    ///   - pinnedHashes: Array of base64-encoded certificate hashes
    ///   - hashType: Type of hash to use (default: SPKI SHA-256)
    ///   - mode: Validation mode (default: strict)
    public init(
        pinnedHashes: [String],
        hashType: PinningHashType = .spkiSHA256,
        mode: PinningMode = .strict
    ) {
        self.pinnedHashes = Set(pinnedHashes.map { $0.trimmingCharacters(in: .whitespacesAndNewlines) })
        self.hashType = hashType
        self.mode = mode
        super.init()
    }

    // MARK: - URLSessionDelegate

    /// Handles authentication challenges by applying certificate pinning rules.
    /// - Parameters:
    ///   - session: The session issuing the challenge.
    ///   - challenge: The authentication challenge to validate.
    ///   - completionHandler: Completion handler with the disposition and credential to use.
    public func urlSession(
        _ session: URLSession,
        didReceive challenge: URLAuthenticationChallenge,
        completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
    ) {
        guard let serverTrust = challenge.protectionSpace.serverTrust else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }

        // Check if this is a localhost connection (development)
        if isLocalhost(challenge: challenge) {
            // For development, accept the certificate
            let credential = URLCredential(trust: serverTrust)
            completionHandler(.useCredential, credential)
            return
        }

        // Validate certificate pinning
        let validationResult = validateCertificatePinning(trust: serverTrust)

        switch validationResult {
        case .success:
            let credential = URLCredential(trust: serverTrust)
            completionHandler(.useCredential, credential)

        case .failure:
            switch mode {
            case .strict:
                // In strict mode, reject the connection
                completionHandler(.cancelAuthenticationChallenge, nil)

            case .relaxed:
                // In relaxed mode, fall back to system validation
                if validateSystemCertificate(trust: serverTrust, for: challenge) {
                    let credential = URLCredential(trust: serverTrust)
                    completionHandler(.useCredential, credential)
                } else {
                    completionHandler(.cancelAuthenticationChallenge, nil)
                }
            }
        }
    }

    // MARK: - Validation Methods

    /// Validate certificate pinning.
    /// - Parameter trust: Server trust object
    /// - Returns: Validation result
    private func validateCertificatePinning(trust: SecTrust) -> Result<Void, MCPError> {
        // Get certificate from trust
        guard let certificates = SecTrustCopyCertificateChain(trust) as? [SecCertificate],
              let certificate = certificates.first else {
            return .failure(.certificatePinningFailed("No certificate found"))
        }

        // Extract certificate data
        guard let certificateData = SecCertificateCopyData(certificate) as Data? else {
            return .failure(.certificatePinningFailed("Failed to extract certificate data"))
        }

        // Calculate hash based on type
        let certificateHash: String
        switch hashType {
        case .spkiSHA256:
            guard let hash = computeSPKIHash(certificateData: certificateData) else {
                return .failure(.certificatePinningFailed("Failed to compute SPKI hash"))
            }
            certificateHash = hash

        case .certificateSHA256:
            certificateHash = computeCertificateHash(certificateData: certificateData)
        }

        // Validate against pinned hashes
        if pinnedHashes.contains(certificateHash) {
            return .success(())
        } else {
            return .failure(.certificatePinningFailed(
                "Certificate hash mismatch. Expected: \(pinnedHashes), Got: \(certificateHash)"
            ))
        }
    }

    /// Validate certificate using system validation (fallback).
    /// - Parameters:
    ///   - trust: Server trust object
    ///   - challenge: Authentication challenge
    /// - Returns: True if validation succeeds
    private func validateSystemCertificate(trust: SecTrust, for challenge: URLAuthenticationChallenge) -> Bool {
        var error: CFError?
        let isValid = SecTrustEvaluateWithError(trust, &error)
        return isValid
    }

    /// Check if the challenge is for a localhost connection.
    /// - Parameter challenge: Authentication challenge
    /// - Returns: True if localhost
    private func isLocalhost(challenge: URLAuthenticationChallenge) -> Bool {
        let host = challenge.protectionSpace.host

        // Check hostname
        if localhostHosts.contains(host.lowercased()) {
            return true
        }

        // Check if it's a loopback address
        if host == "127.0.0.1" || host == "::1" {
            return true
        }

        // Check if it's a development port
        let port = challenge.protectionSpace.port
        if developmentPorts.contains(port) {
            return true
        }

        return false
    }

    // MARK: - Hash Computation

    /// Compute SPKI (Subject Public Key Info) hash from certificate data.
    /// - Parameter certificateData: DER-encoded certificate data
    /// - Returns: Base64-encoded SHA-256 hash of SPKI
    private func computeSPKIHash(certificateData: Data) -> String? {
        // Parse the certificate to extract the public key
        guard let certificate = SecCertificateCreateWithData(nil, certificateData as CFData) else {
            return nil
        }

        // Extract public key
        guard let publicKey = SecCertificateCopyKey(certificate) else {
            return nil
        }

        // Get public key data in DER format
        var error: Unmanaged<CFError>?
        guard let publicKeyData = SecKeyCopyExternalRepresentation(publicKey, &error) as Data? else {
            return nil
        }

        // Compute SHA-256 hash
        let hash = SHA256.hash(data: publicKeyData)

        // Convert to base64
        return Data(hash).base64EncodedString()
    }

    /// Compute certificate hash from certificate data.
    /// - Parameter certificateData: DER-encoded certificate data
    /// - Returns: Base64-encoded SHA-256 hash of certificate
    private func computeCertificateHash(certificateData: Data) -> String {
        let hash = SHA256.hash(data: certificateData)
        return Data(hash).base64EncodedString()
    }

    // MARK: - Convenience Methods

    /// Create a URLSession with certificate pinning configured.
    /// - Returns: Configured URLSession
    public func createPinnedSession() -> URLSession {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        return URLSession(
            configuration: configuration,
            delegate: self,
            delegateQueue: nil
        )
    }

    /// Create a URLSession delegate proxy for use with existing sessions.
    /// - Returns: URLSession delegate
    public func createDelegate() -> URLSessionDelegate {
        return self
    }
}

// MARK: - Certificate Hash Extraction

extension CertificatePinningValidator {

    /// Extract SPKI hash from a certificate file.
    /// - Parameter certificateURL: URL to certificate file (PEM or DER)
    /// - Returns: Base64-encoded SPKI hash
    public static func extractSPKIHash(from certificateURL: URL) throws -> String {
        let certificateData = try Data(contentsOf: URL(fileURLWithPath: certificateURL.path))
        return try extractSPKIHash(from: certificateData)
    }

    /// Extract SPKI hash from certificate data.
    /// - Parameter certificateData: Certificate data (PEM or DER)
    /// - Returns: Base64-encoded SPKI hash
    public static func extractSPKIHash(from certificateData: Data) throws -> String {
        // Check if it's PEM format (starts with -----BEGIN CERTIFICATE-----)
        let pemString = String(data: certificateData, encoding: .utf8) ?? ""

        let data: Data
        if pemString.contains("-----BEGIN CERTIFICATE-----") {
            // Extract base64 from PEM
            let lines = pemString.components(separatedBy: "\n")
            let base64Lines = lines.filter { !$0.contains("-----") }
            let base64String = base64Lines.joined()

            guard let decodedData = Data(base64Encoded: base64String) else {
                throw MCPError.certificatePinningFailed("Failed to decode PEM certificate")
            }
            data = decodedData
        } else {
            // Assume DER format
            data = certificateData
        }

        // Create certificate
        guard let certificate = SecCertificateCreateWithData(nil, data as CFData) else {
            throw MCPError.certificatePinningFailed("Failed to create certificate from data")
        }

        // Extract public key
        guard let publicKey = SecCertificateCopyKey(certificate) else {
            throw MCPError.certificatePinningFailed("Failed to extract public key")
        }

        // Get public key data
        var error: Unmanaged<CFError>?
        guard let publicKeyData = SecKeyCopyExternalRepresentation(publicKey, &error) as Data? else {
            throw MCPError.certificatePinningFailed("Failed to get public key data")
        }

        // Compute hash
        let hash = SHA256.hash(data: publicKeyData)
        return Data(hash).base64EncodedString()
    }

    /// Extract certificate hash from certificate data.
    /// - Parameter certificateData: Certificate data (PEM or DER)
    /// - Returns: Base64-encoded certificate hash
    public static func extractCertificateHash(from certificateData: Data) throws -> String {
        let pemString = String(data: certificateData, encoding: .utf8) ?? ""

        let data: Data
        if pemString.contains("-----BEGIN CERTIFICATE-----") {
            let lines = pemString.components(separatedBy: "\n")
            let base64Lines = lines.filter { !$0.contains("-----") }
            let base64String = base64Lines.joined()

            guard let decodedData = Data(base64Encoded: base64String) else {
                throw MCPError.certificatePinningFailed("Failed to decode PEM certificate")
            }
            data = decodedData
        } else {
            data = certificateData
        }

        let hash = SHA256.hash(data: data)
        return Data(hash).base64EncodedString()
    }
}

// MARK: - Preconfigured Validators

extension CertificatePinningValidator {

    /// Create a validator for production MCP servers.
    /// - Parameter hashes: Array of pinned hashes
    /// - Returns: Configured validator
    public static func production(hashes: [String]) -> CertificatePinningValidator {
        return CertificatePinningValidator(
            pinnedHashes: hashes,
            hashType: .spkiSHA256,
            mode: .strict
        )
    }

    /// Create a validator for development/testing.
    /// - Parameter hashes: Array of pinned hashes (optional)
    /// - Returns: Configured validator with relaxed mode
    public static func development(hashes: [String] = []) -> CertificatePinningValidator {
        return CertificatePinningValidator(
            pinnedHashes: hashes,
            hashType: .spkiSHA256,
            mode: .relaxed
        )
    }
}

// MARK: - Debugging Support

#if DEBUG
extension CertificatePinningValidator {

    /// Print certificate details for debugging.
    /// - Parameter certificateData: Certificate data
    public static func debugPrintCertificate(certificateData: Data) {
        guard let certificate = SecCertificateCreateWithData(nil, certificateData as CFData) else {
            print("Failed to parse certificate")
            return
        }

        // Get summary
        let summary = SecCertificateCopySubjectSummary(certificate) as String? ?? "Unknown"
        print("Certificate Subject: \(summary)")

        // Extract and print hashes
        do {
            let spkiHash = try extractSPKIHash(from: certificateData)
            print("SPKI SHA-256: \(spkiHash)")
        } catch {
            print("Failed to compute SPKI hash: \(error)")
        }

        do {
            let certHash = try extractCertificateHash(from: certificateData)
            print("Certificate SHA-256: \(certHash)")
        } catch {
            print("Failed to compute certificate hash: \(error)")
        }
    }
}
#endif
