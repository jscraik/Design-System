# Version Synchronization

This guide explains how versions are synchronized across npm packages and Swift packages.

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
- Swift packages: `swift/ChatUIFoundation`, `swift/ChatUIComponents`, `swift/ChatUIThemes`, `swift/ChatUIShellChatGPT`, `swift/ChatUIMCP`

If `agvtool` is available, it is used for Swift packages. Otherwise the scripts update the `// Version:` comment in `Package.swift`.

## Verify

```bash
pnpm sync:versions
rg -n \"\\\"version\\\"\" packages/*/package.json
rg -n \"// Version:\" swift/*/Package.swift
```

## Troubleshooting

**agvtool errors**

- Ensure Xcode is installed and on PATH.
- If unavailable, the script falls back to updating the `Package.swift` comment.

**Missing Package.swift**

- The script skips packages that do not have a `Package.swift`.
