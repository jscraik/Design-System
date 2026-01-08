# Version Synchronization

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This guide explains how versions are synchronized across npm packages and Swift packages.

## Table of contents

- [Why this exists](#why-this-exists)
- [Commands](#commands)
- [How it works](#how-it-works)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)

## Why this exists

- NPM packages need matching versions for releases.
- Swift packages track the same version in `Package.swift` comments.
- The build pipeline depends on a single source of truth: the root `package.json` version.

## Commands

### Sync everything (recommended)

```bash
pnpm sync:versions
```

This script updates:

- `packages/*/package.json` versions
- Swift `Package.swift` version comments

### Sync Swift only

```bash
pnpm sync:swift-versions
```

Use this when you only need to refresh the Swift package comments.

## How it works

The scripts read the version from the root `package.json` and update:

- NPM packages: `packages/ui`, `packages/runtime`, `packages/tokens`, `packages/widgets`, `packages/cloudflare-template`
- Swift packages: `platforms/apple/swift/ChatUIFoundation`, `platforms/apple/swift/ChatUIComponents`, `platforms/apple/swift/ChatUIThemes`, `platforms/apple/swift/ChatUIShellChatGPT`, `platforms/apple/swift/ChatUIMCP`

If `agvtool` is available, it is used for Swift packages. Otherwise the scripts update the `// Version:` comment in `Package.swift`.

## Verify

```bash
pnpm sync:versions
rg -n \"\\\"version\\\"\" packages/*/package.json
rg -n \"// Version:\" platforms/apple/swift/*/Package.swift
```

## Troubleshooting

**agvtool errors**

- Ensure Xcode is installed and on PATH.
- If unavailable, the script falls back to updating the `Package.swift` comment.

**Missing Package.swift**

- The script skips packages that do not have a `Package.swift`.
