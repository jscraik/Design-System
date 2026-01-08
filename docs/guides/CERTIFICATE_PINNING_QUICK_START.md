# Certificate Pinning Quick Start

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [30-Second Setup](#30-second-setup)
- [Extract Hash in One Command](#extract-hash-in-one-command)
- [Local Development](#local-development)
- [Common Configurations](#common-configurations)
  - [Production (Recommended)](#production-recommended)
  - [Staging](#staging)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Need More?](#need-more)


## 30-Second Setup

```swift
import ChatUIMCP

// 1. Extract your server's SPKI hash (see below)
let pinnedHash = "base64encodedhash=="

// 2. Create client with pinning
let client = MCPClient(
    baseURL: URL(string: "https://your-api.com")!,
    pinnedHashes: [pinnedHash],
    pinningMode: .strict
)

// 3. Use normally
let tools = try await client.listTools()
```

## Extract Hash in One Command

```bash
openssl s_client -connect your-api.com:443 -showcerts 2>/dev/null \
  | openssl x509 -pubkey -noout \
  | openssl pkey -pubin -outform der \
  | openssl dgst -sha256 -binary \
  | base64
```

## Local Development

```swift
// Works automatically, no pinning needed
let client = MCPClient(
    baseURL: URL(string: "http://localhost:8787")!
)
```

## Common Configurations

### Production (Recommended)
```swift
MCPClient(
    baseURL: productionURL,
    pinnedHashes: [currentHash, backupHash],  // Always include backup
    hashType: .spkiSHA256,
    pinningMode: .strict
)
```

### Staging
```swift
MCPClient(
    baseURL: stagingURL,
    pinnedHashes: [stagingHash],
    hashType: .spkiSHA256,
    pinningMode: .relaxed  // Allow fallback
)
```

## Testing

```bash
# Generate test certificate
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

# Extract hash
openssl x509 -in cert.pem -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | base64
```

## Troubleshooting

**Issue**: "Certificate pinning failed"
```bash
# Verify you have the right hash
openssl s_client -connect your-api.com:443 -showcerts 2>/dev/null | openssl x509 -fingerprint -sha256 -noout
```

**Issue**: Need to rotate certificates
```swift
// Add both old and new during transition
pinnedHashes: [oldHash, newHash]
```

## Need More?

See [TLS_CERTIFICATE_PINNING.md](./TLS_CERTIFICATE_PINNING.md) for complete documentation.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

