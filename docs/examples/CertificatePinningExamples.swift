// Certificate Pinning Examples for AStudioMCP
// This file demonstrates practical usage of TLS certificate pinning

import Foundation
import AStudioMCP

// MARK: - Example 1: Basic Production Setup

func setupProductionMCPClient() async throws {
    // These would be your actual production server certificate SPKI hashes
    let productionHashes = [
        "YourProductionServerSPKIHashBase64Encoded==",
        "YourBackupServerSPKIHashBase64Encoded=="  // Always include backup!
    ]

    let client = MCPClient(
        baseURL: URL(string: "https://api.production.example.com")!,
        pinnedHashes: productionHashes,
        hashType: .spkiSHA256,  // Recommended: use SPKI pinning
        pinningMode: .strict     // Strict mode for production
    )

    // Use the client normally
    let tools = try await client.listTools()
    print("Available tools: \(tools)")
}

// MARK: - Example 2: Staging Environment with Relaxed Mode

func setupStagingMCPClient() async throws {
    let stagingHash = "YourStagingServerSPKIHash=="

    let client = MCPClient(
        baseURL: URL(string: "https://staging.example.com")!,
        pinnedHashes: [stagingHash],
        hashType: .spkiSHA256,
        pinningMode: .relaxed  // Allow fallback to system validation
    )

    let tools = try await client.listTools()
    print("Staging tools: \(tools)")
}

// MARK: - Example 3: Local Development (No Pinning)

func setupDevelopmentMCPClient() async throws {
    // Localhost automatically bypasses pinning
    let client = MCPClient(
        baseURL: URL(string: "http://localhost:8787")!
    )

    let tools = try await client.listTools()
    print("Local tools: \(tools)")
}

// MARK: - Example 4: Certificate Rotation Strategy

func setupClientWithRotationSupport() async throws {
    // Pin multiple certificates to support rotation without app updates
    let rotatedHashes = [
        "newCertificateSPKIHash==",     // Newly deployed certificate
        "currentCertificateSPKIHash==", // Currently active certificate
        "oldCertificateSPKIHash=="      // Keep during transition period
    ]

    let client = MCPClient(
        baseURL: URL(string: "https://api.example.com")!,
        pinnedHashes: rotatedHashes,
        hashType: .spkiSHA256,
        pinningMode: .strict
    )

    // Continue working through rotation seamlessly
    let tools = try await client.listTools()
    print("Tools during rotation: \(tools)")
}

// MARK: - Example 5: Extracting Certificate Hashes

func extractAndConfigureCertificate() async throws {
    // Step 1: Extract hash from certificate file
    let certificateURL = URL(fileURLWithPath: "/path/to/server-certificate.pem")
    let spkiHash = try CertificatePinningValidator.extractSPKIHash(from: certificateURL)

    print("Extracted SPKI Hash: \(spkiHash)")

    // Step 2: Use hash to configure client
    let client = MCPClient(
        baseURL: URL(string: "https://api.example.com")!,
        pinnedHashes: [spkiHash],
        hashType: .spkiSHA256,
        pinningMode: .strict
    )

    // Step 3: Verify connection works
    let tools = try await client.listTools()
    print("Verified connection with pinned certificate")
}

// MARK: - Example 6: Error Handling

func setupClientWithErrorHandling() async throws {
    let pinnedHashes = ["productionHash=="]

    let client = MCPClient(
        baseURL: URL(string: "https://api.example.com")!,
        pinnedHashes: pinnedHashes,
        hashType: .spkiSHA256,
        pinningMode: .strict
    )

    do {
        let tools = try await client.listTools()
        print("Success: \(tools.count) tools available")
    } catch MCPError.certificatePinningFailed(let details) {
        // Handle certificate pinning failure
        print("Certificate validation failed: \(details)")
        print("Possible causes:")
        print("  1. Server certificate has changed")
        print("  2. Pinned hash is incorrect")
        print("  3. Man-in-the-middle attack detected")
        // Take appropriate action (alert user, log error, etc.)
    } catch MCPError.networkError(let error) {
        print("Network error: \(error.localizedDescription)")
    } catch {
        print("Unexpected error: \(error)")
    }
}

// MARK: - Example 7: Custom URLSession with Pinning

func setupCustomPinnedSession() async throws {
    // Create validator
    let validator = CertificatePinningValidator(
        pinnedHashes: ["hash1==", "hash2=="],
        hashType: .spkiSHA256,
        mode: .strict
    )

    // Create custom URLSession configuration
    let configuration = URLSessionConfiguration.default
    configuration.timeoutIntervalForRequest = 30
    configuration.timeoutIntervalForResource = 60

    // Create pinned session
    let session = URLSession(
        configuration: configuration,
        delegate: validator,
        delegateQueue: nil
    )

    // Use custom session with MCPClient
    let client = MCPClient(
        baseURL: URL(string: "https://api.example.com")!,
        session: session
    )

    let tools = try await client.listTools()
    print("Custom session tools: \(tools)")
}

// MARK: - Example 8: Debug Certificate Information

#if DEBUG
func debugCertificateInfo() {
    let certificateURL = URL(fileURLWithPath: "/path/to/certificate.pem")

    do {
        let certificateData = try Data(contentsOf: certificateURL)

        // Print detailed certificate information
        CertificatePinningValidator.debugPrintCertificate(certificateData: certificateData)

        // Extract specific hashes
        let spkiHash = try CertificatePinningValidator.extractSPKIHash(from: certificateData)
        let certHash = try CertificatePinningValidator.extractCertificateHash(from: certificateData)

        print("\n--- Hash Comparison ---")
        print("SPKI Hash (recommended for pinning):")
        print("  \(spkiHash)")
        print("\nFull Certificate Hash:")
        print("  \(certHash)")
        print("\nUse SPKI hash in your configuration for best results.")
    } catch {
        print("Error reading certificate: \(error)")
    }
}
#endif

// MARK: - Example 9: Preconfigured Validators

func usePreconfiguredValidators() async throws {
    // Production validator (strict mode)
    let productionValidator = CertificatePinningValidator.production(
        hashes: ["prodHash1==", "prodHash2=="]
    )

    // Development validator (relaxed mode)
    let developmentValidator = CertificatePinningValidator.development(
        hashes: ["devHash=="]
    )

    // Use validator to create session
    let session = productionValidator.createPinnedSession()

    let client = MCPClient(
        baseURL: URL(string: "https://api.example.com")!,
        session: session
    )

    let tools = try await client.listTools()
    print("Tools with preconfigured validator: \(tools)")
}

// MARK: - Example 10: Loading Hashes from Configuration

func setupClientFromConfiguration() async throws {
    // Load hashes from secure configuration (not hardcoded)
    func loadPinnedHashes() -> [String] {
        // In production, load from:
        // - Secure remote config
        // - Keychain storage
        // - Encrypted local file
        // For this example, we'll use a placeholder
        return [
            "configHash1==",
            "configHash2=="
        ]
    }

    let hashes = loadPinnedHashes()

    let client = MCPClient(
        baseURL: URL(string: "https://api.example.com")!,
        pinnedHashes: hashes,
        hashType: .spkiSHA256,
        pinningMode: .strict
    )

    let tools = try await client.listTools()
    print("Configuration-based client: \(tools)")
}

// MARK: - Example 11: Multiple Environments

enum MCPEnvironment {
    case production
    case staging
    case development

    var baseURL: URL {
        switch self {
        case .production:
            return URL(string: "https://api.production.example.com")!
        case .staging:
            return URL(string: "https://staging.example.com")!
        case .development:
            return URL(string: "http://localhost:8787")!
        }
    }

    var pinnedHashes: [String] {
        switch self {
        case .production:
            return ["prodHash1==", "prodHash2=="]
        case .staging:
            return ["stagingHash=="]
        case .development:
            return []  // No pinning for localhost
        }
    }

    var pinningMode: PinningMode {
        switch self {
        case .production:
            return .strict
        case .staging:
            return .relaxed
        case .development:
            return .relaxed  // Ignored for localhost anyway
        }
    }
}

func setupClient(for environment: MCPEnvironment) async throws {
    let client: MCPClient

    switch environment {
    case .development:
        // Localhost - no pinning needed
        client = MCPClient(baseURL: environment.baseURL)

    case .staging, .production:
        // Use pinning
        client = MCPClient(
            baseURL: environment.baseURL,
            pinnedHashes: environment.pinnedHashes,
            hashType: .spkiSHA256,
            pinningMode: environment.pinningMode
        )
    }

    let tools = try await client.listTools()
    print("Environment \(environment): \(tools.count) tools")
}

// MARK: - Example 12: Monitoring Pinning Failures

func setupClientWithMonitoring() async throws {
    let pinnedHashes = ["productionHash=="]

    let client = MCPClient(
        baseURL: URL(string: "https://api.example.com")!,
        pinnedHashes: pinnedHashes,
        hashType: .spkiSHA256,
        pinningMode: .strict
    )

    do {
        let tools = try await client.listTools()
        print("Success: \(tools)")
    } catch MCPError.certificatePinningFailed(let details) {
        // Log pinning failure for monitoring
        logPinningFailure(details: details)

        // Alert user if needed
        alertUserOfSecurityIssue()

        // Optionally: fallback to alternative endpoint
        try await setupAlternativeEndpoint()
    }
}

func logPinningFailure(details: String) {
    // Send to logging/monitoring service
    print("[SECURITY] Certificate pinning failed: \(details)")
    // In production, send to Crashlytics, Sentry, etc.
}

func alertUserOfSecurityIssue() {
    // Show user-friendly alert
    print("Unable to establish secure connection. Please check your network settings.")
}

func setupAlternativeEndpoint() async throws {
    // Implement fallback logic
    print("Setting up alternative endpoint...")
}

// MARK: - Usage Notes

/*
 IMPORTANT SECURITY NOTES:

 1. NEVER commit real certificate hashes to version control
 2. Always use SPKI pinning (not full certificate) for production
 3. Pin at least 2 certificates to support rotation
 4. Use strict mode in production, relaxed mode in staging
 5. Monitor pinning failures for potential security issues
 6. Test certificate rotation procedure before deploying
 7. Keep track of certificate expiration dates

 CERTIFICATE EXTRACTION:

 To extract SPKI hash from your server:

 openssl s_client -connect your-server.com:443 -showcerts 2>/dev/null \
   | openssl x509 -pubkey -noout \
   | openssl pkey -pubin -outform der \
   | openssl dgst -sha256 -binary \
   | base64

 TESTING:

 Generate test certificates with:
 ./scripts/generate-test-certificate.sh

 Run tests with:
 swift test --filter CertificatePinningValidatorTests

 For more information, see:
 - docs/guides/TLS_CERTIFICATE_PINNING.md
 - docs/guides/CERTIFICATE_PINNING_QUICK_START.md
*/
