# TLS Certificate Pinning Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [What is Certificate Pinning?](#what-is-certificate-pinning)
- [Why SPKI Pinning?](#why-spki-pinning)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Production Mode (Strict)](#production-mode-strict)
  - [Development Mode (Relaxed)](#development-mode-relaxed)
  - [Local Development (No Pinning)](#local-development-no-pinning)
- [Extracting Certificate Hashes](#extracting-certificate-hashes)
  - [From a PEM Certificate File](#from-a-pem-certificate-file)
  - [From Certificate Data](#from-certificate-data)
  - [Using Command Line Tools](#using-command-line-tools)
- [Certificate Rotation Strategy](#certificate-rotation-strategy)
  - [Best Practices](#best-practices)
  - [Example Rotation Setup](#example-rotation-setup)
- [Sample Certificates for Testing](#sample-certificates-for-testing)
  - [Generate Self-Signed Test Certificate](#generate-self-signed-test-certificate)
  - [Sample Certificate Hashes](#sample-certificate-hashes)
- [Configuration Modes](#configuration-modes)
  - [Strict Mode (Production)](#strict-mode-production)
  - [Relaxed Mode (Staging)](#relaxed-mode-staging)
- [Hash Types](#hash-types)
  - [SPKI SHA-256 (Recommended)](#spki-sha-256-recommended)
  - [Certificate SHA-256 (Not Recommended)](#certificate-sha-256-not-recommended)
- [Debugging](#debugging)
  - [Print Certificate Details](#print-certificate-details)
  - [Common Issues](#common-issues)
- [Security Considerations](#security-considerations)
  - [DO's ✅](#dos)
  - [DON'Ts ❌](#donts)
- [Advanced Usage](#advanced-usage)
  - [Custom URLSession Delegate](#custom-urlsession-delegate)
  - [Dynamic Hash Loading](#dynamic-hash-loading)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
- [Migration Guide](#migration-guide)
  - [From Default URLSession](#from-default-urlsession)
  - [Gradual Rollout](#gradual-rollout)
- [Troubleshooting](#troubleshooting)
  - [Enable Debug Logging](#enable-debug-logging)
  - [Network Capture Tools](#network-capture-tools)
- [References](#references)
- [Support](#support)


## Overview

TLS certificate pinning is a security technique that ensures your Swift application communicates only with servers presenting trusted certificates. The `ChatUIMCP` library provides comprehensive certificate pinning support for MCP client connections.

## What is Certificate Pinning?

Certificate pinning validates the server's TLS certificate against known, pre-configured certificate hashes. This prevents man-in-the-middle attacks even if the device's certificate store is compromised.

## Why SPKI Pinning?

This implementation uses **SPKI (Subject Public Key Info) pinning**, which is recommended over full certificate pinning because:

- **Supports certificate rotation**: You can renew certificates without updating the app
- **More resilient**: Pins to the public key, not the certificate metadata
- **Industry standard**: Follows RFC 7469 guidelines

## Installation

The certificate pinning functionality is included in `ChatUIMCP`:

```swift
import ChatUIMCP
```

## Basic Usage

### Production Mode (Strict)

```swift
import ChatUIMCP

// Pin your production certificates
let pinnedHashes = [
    "base64encodedspkihash1==",
    "base64encodedspkihash2==" // Include backup certificate for rotation
]

let client = MCPClient(
    baseURL: URL(string: "https://api.example.com")!,
    pinnedHashes: pinnedHashes,
    hashType: .spkiSHA256,
    pinningMode: .strict
)
```

### Development Mode (Relaxed)

```swift
// Development mode allows fallback to system validation
let client = MCPClient(
    baseURL: URL(string: "https://staging.example.com")!,
    pinnedHashes: ["stagingHash=="],
    hashType: .spkiSHA256,
    pinningMode: .relaxed
)
```

### Local Development (No Pinning)

```swift
// For localhost, pinning is automatically skipped
let client = MCPClient(
    baseURL: URL(string: "http://localhost:8787")!
)
```

## Extracting Certificate Hashes

### From a PEM Certificate File

```swift
let certificateURL = URL(fileURLWithPath: "/path/to/certificate.pem")
let spkiHash = try CertificatePinningValidator.extractSPKIHash(from: certificateURL)
print("SPKI Hash: \(spkiHash)")
```

### From Certificate Data

```swift
let certificateData = Data(/* your certificate bytes */)
let spkiHash = try CertificatePinningValidator.extractSPKIHash(from: certificateData)
```

### Using Command Line Tools

#### Extract SPKI Hash with OpenSSL

```bash
# Extract public key from certificate
openssl x509 -in certificate.pem -pubkey -noout > pubkey.pem

# Extract SPKI from public key
openssl asn1parse -in pubkey.pem -inform PEM -out pubkey.der

# Compute SHA-256 hash and encode as base64
openssl dgst -sha256 -binary pubkey.der | base64
```

#### One-liner for SPKI Hash

```bash
openssl x509 -in certificate.pem -pubkey -noout \
  | openssl pkey -pubin -outform der \
  | openssl dgst -sha256 -binary \
  | base64
```

#### Extract Certificate Hash (for comparison)

```bash
openssl x509 -in certificate.pem -outform der \
  | openssl dgst -sha256 -binary \
  | base64
```

## Certificate Rotation Strategy

### Best Practices

1. **Always pin multiple certificates**: Include current + backup certificate
2. **Use SPKI pinning**: Allows certificate renewal without app updates
3. **Monitor expiry**: Set up alerts for certificate expiration
4. **Test rotation**: Validate backup certificates before deploying

### Example Rotation Setup

```swift
// Pinning configuration with rotation support
let pinnedHashes = [
    "currentCertificateSPKIHash==",  // Active certificate
    "backupCertificateSPKIHash==",   // Backup certificate (rotated in)
    "legacyCertificateSPKIHash=="    // Keep during transition period
]

let client = MCPClient(
    baseURL: productionURL,
    pinnedHashes: pinnedHashes,
    hashType: .spkiSHA256,
    pinningMode: .strict
)
```

## Sample Certificates for Testing

### Generate Self-Signed Test Certificate

```bash
# Generate private key
openssl genrsa -out test-key.pem 2048

# Generate certificate signing request
openssl req -new -key test-key.pem -out test-csr.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate (valid for 365 days)
openssl x509 -req -in test-csr.pem -signkey test-key.pem \
  -out test-cert.pem -days 365

# Extract SPKI hash
openssl x509 -in test-cert.pem -pubkey -noout \
  | openssl pkey -pubin -outform der \
  | openssl dgst -sha256 -binary \
  | base64
```

### Sample Certificate Hashes

These are **sample hashes** for testing purposes only. **DO NOT use in production**:

```swift
// Test SPKI hashes (not real certificates)
let testHashes = [
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="
]
```

## Configuration Modes

### Strict Mode (Production)

```swift
.pinningMode(.strict)
```

- **Behavior**: Rejects connection if certificate pinning fails
- **Use case**: Production environments
- **Security**: Maximum security, no fallback

### Relaxed Mode (Staging)

```swift
.pinningMode(.relaxed)
```

- **Behavior**: Falls back to system validation if pinning fails
- **Use case**: Staging/testing environments
- **Security**: Balance between security and flexibility

## Hash Types

### SPKI SHA-256 (Recommended)

```swift
.hashType(.spkiSHA256)
```

- **What it pins**: Public key from Subject Public Key Info
- **Rotation support**: ✅ Yes
- **Security**: High
- **Performance**: Fast

### Certificate SHA-256 (Not Recommended)

```swift
.hashType(.certificateSHA256)
```

- **What it pins**: Entire certificate DER encoding
- **Rotation support**: ❌ No (requires app update)
- **Security**: High (but inflexible)
- **Performance**: Fast

## Debugging

### Print Certificate Details

```swift
#if DEBUG
let certificateData = try Data(contentsOf: certificateURL)
CertificatePinningValidator.debugPrintCertificate(certificateData: certificateData)
#endif
```

Output:
```
Certificate Subject: CN=localhost
SPKI SHA-256: YOurBase64EncodedHashHere==
Certificate SHA-256: AnotherBase64EncodedHashHere==
```

### Common Issues

#### 1. Certificate Mismatch Error

```
Certificate pinning failed: Certificate hash mismatch
```

**Solution**: Verify you're pinning the correct hash:
```bash
# Extract the actual hash from the server's certificate
openssl s_client -connect api.example.com:443 -showcerts \
  2>/dev/null </dev/null | openssl x509 -outform PEM \
  | openssl x509 -pubkey -noout \
  | openssl pkey -pubin -outform der \
  | openssl dgst -sha256 -binary \
  | base64
```

#### 2. Localhost Connections Failing

**Solution**: Localhost connections should automatically skip pinning. If they don't, verify the host is recognized:
```swift
// The validator automatically skips pinning for:
// - localhost
// - 127.0.0.1
// - ::1
// - Common development ports (3000, 8080, 8787, etc.)
```

#### 3. Certificate Rotation Issues

**Solution**: Always pin both old and new certificates during rotation:
```swift
let pinnedHashes = [
    "oldCertificateHash==",  // Still valid
    "newCertificateHash=="   // Newly deployed
]
```

## Security Considerations

### DO's ✅

1. **Use SPKI pinning** for production
2. **Pin multiple certificates** to support rotation
3. **Store hashes securely** (not hardcoded in production)
4. **Test rotation** before deploying
5. **Monitor certificate expiry**

### DON'Ts ❌

1. **Don't use sample hashes** in production
2. **Don't pin only one certificate** (prevents rotation)
3. **Don't ignore pinning errors**
4. **Don't use relaxed mode** in production
5. **Don't commit real certificates** to version control

## Advanced Usage

### Custom URLSession Delegate

```swift
let validator = CertificatePinningValidator(
    pinnedHashes: pinnedHashes,
    hashType: .spkiSHA256,
    mode: .strict
)

let configuration = URLSessionConfiguration.default
configuration.timeoutIntervalForRequest = 30

let session = URLSession(
    configuration: configuration,
    delegate: validator,
    delegateQueue: nil
)

let client = MCPClient(
    baseURL: url,
    session: session
)
```

### Dynamic Hash Loading

```swift
// Load hashes from secure storage or remote config
func loadPinnedHashes() async throws -> [String] {
    // Implement your secure loading mechanism
    // Could be from:
    // - Keychain
    // - Secure remote config
    // - Encrypted local storage
    return ["hash1", "hash2"]
}

let hashes = try await loadPinnedHashes()
let client = MCPClient(
    baseURL: productionURL,
    pinnedHashes: hashes,
    hashType: .spkiSHA256,
    pinningMode: .strict
)
```

## Testing

### Unit Tests

```swift
func testCertificatePinning() {
    let validator = CertificatePinningValidator(
        pinnedHashes: ["testHash"],
        hashType: .spkiSHA256,
        mode: .strict
    )

    let session = validator.createPinnedSession()
    XCTAssertNotNil(session)
}
```

### Integration Tests

```swift
func testMCPClientWithPinning() async throws {
    let client = MCPClient(
        baseURL: URL(string: "https://api.example.com")!,
        pinnedHashes: testHashes,
        hashType: .spkiSHA256,
        pinningMode: .strict
    )

    let tools = try await client.listTools()
    XCTAssertFalse(tools.isEmpty)
}
```

## Migration Guide

### From Default URLSession

**Before:**
```swift
let client = MCPClient(baseURL: url)
```

**After:**
```swift
let client = MCPClient(
    baseURL: url,
    pinnedHashes: pinnedHashes,
    hashType: .spkiSHA256,
    pinningMode: .strict
)
```

### Gradual Rollout

1. **Phase 1**: Deploy with relaxed mode and monitor logs
2. **Phase 2**: Update app with strict mode for new installs
3. **Phase 3**: Force update for remaining users

## Troubleshooting

### Enable Debug Logging

```swift
#if DEBUG
let client = MCPClient(baseURL: url, pinnedHashes: hashes)
// Monitor console for pinning validation messages
#endif
```

### Network Capture Tools

- **mitmproxy**: For testing with custom certificates
- **Charles Proxy**: For debugging network traffic
- **Wireshark**: For deep packet inspection

## References

- [RFC 7469: Public Key Pinning Extension for HTTP](https://datatracker.ietf.org/doc/html/rfc7469)
- [OWASP Certificate Pinning](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html)
- [Apple App Security: HTTPS](https://developer.apple.com/news/?id=gtq3x8qe)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the unit tests in `CertificatePinningValidatorTests.swift`
3. Enable debug logging to see detailed validation output

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

