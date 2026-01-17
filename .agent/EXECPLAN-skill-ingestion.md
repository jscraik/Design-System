# Integrate Clawdhub-style skill discovery, ingestion, and publishing into aStudio

This ExecPlan is a living document. Maintain it per .agent/PLANS.md (root-relative: .agent/PLANS.md). Update Progress, Surprises & Discoveries, Decision Log, and Outcomes & Retrospective as work proceeds.

## Purpose / Big Picture

Enable aStudio to discover skills from the Clawdhub marketplace, safely ingest and render local or remote SKILL.md packages (including references/assets), and publish or update local skills back to Clawdhub with semantic version bumps. Users will be able to search, install, view, update, and publish skills end-to-end from within aStudio (CLI and/or UI) without leaving the toolchain. Optional: provide a Sparkle-style packaging template for SwiftPM macOS utilities.

## Progress

- [x] (2026-01-11 00:00Z) Draft plan created and saved here.
- [ ] (YYYY-MM-DD HH:MMZ) Baseline repo checks (lint/tests) to ensure green starting point.
- [x] (2026-01-11 16:27Z) Skill metadata parsing + hashing module implemented with unit tests (packages/skill-ingestion/src/metadata.ts, hash.ts).
- [x] (2026-01-11 16:27Z) Remote client with integrity guard and checksum tests (packages/skill-ingestion/src/remoteClient.ts + test).
- [x] (2026-01-11 16:27Z) Safe install/import helpers with origin writing and unique destination logic plus utility + zip integration tests (packages/skill-ingestion/src/installer\*.ts + tests).
- [x] (2026-01-11 16:27Z) Publish/update flow with semantic bump + hash gating, process stubs, and skip-on-same-hash integration tests (packages/skill-ingestion/src/publisher\*.ts + tests).
- [x] (2026-01-11 16:27Z) CLI wiring for skills search/install/publish with strict checksum default (packages/cli/src/index.ts).
- [x] (2026-01-11 16:40Z) SwiftUI UI integration for list/detail display of installed skills (AStudioApp SkillsView) with refresh and error states; no install/update actions yet.
- [ ] (YYYY-MM-DD HH:MMZ) Optional Sparkle packaging template adapted and documented.
- [ ] (YYYY-MM-DD HH:MMZ) Final validation (repo-wide lint/tests/e2e) and retrospective updated.

## Surprises & Discoveries

- Observation: …
  Evidence: …

## Decision Log

- Decision: …
  Rationale: …
  Date/Author: …

## Outcomes & Retrospective

Summarize outcomes, remaining gaps, and lessons when major milestones close or at completion.

## Context and Orientation

aStudio is a pnpm monorepo with React/web and Apple targets; coding standards include Biome/PNPM for JS/TS and SwiftPM for Swift. There is no existing end-to-end skill ingestion/publish flow. The reference implementation is the OSS CodexSkillManager (SwiftPM macOS app) cloned for research; it scans skill folders, renders SKILL.md via MarkdownUI, downloads from Clawdhub via simple REST endpoints, installs zip payloads into platform-specific skill directories, and publishes through bunx clawdhub. Gaps to fix while porting: downloaded zips are not integrity-checked or signed, tests are minimal, and platform floor is macOS 26/Swift 6.2 (we may target broader environments inside aStudio).

Key concepts:

- Skill: folder containing SKILL.md, optional references/assets/scripts/templates.
- Clawdhub: public skill registry with REST endpoints for listing/searching/downloading skills and bunx CLI for publishing.
- Platforms: codex, claude, opencode, copilot with canonical skill paths (e.g., ~/.codex/skills/public).
- Origin metadata: .clawdhub/origin.json storing slug/version/source/installedAt for installed skills.

## Plan of Work

Stage 1 – Baseline and scaffolding: Run repo lint/tests to confirm a green baseline. Add a new package/module (name: skill-ingestion) in the appropriate workspace (TS/Node or Swift, matching where we wire UI/CLI). Define shared types: SkillMetadata (name/description), SkillReference, SkillStats (reference/asset/script/template counts), SkillPlatform enum with storageKey, relativePath, rootPath helpers, and InstallDestination struct for rootURL/storageKey. Include path constants for default platform skill roots and allow custom base paths.

Stage 2 – Safe parsing and hashing: Implement frontmatter + fallback parsing for SKILL.md (name/description) and Markdown stripping of frontmatter. Implement deterministic SHA-256 hash across a skill folder, ignoring .git, .clawdhub, .DS_Store, and preserving relative path ordering. Add tests covering missing metadata, mixed underscores/dashes, and hash stability.

Stage 3 – Integrity-first remote client: Implement remote-skill-client hitting Clawdhub endpoints (/api/v1/skills, /api/v1/search, /api/v1/download, /api/skill). Add HTTP status validation, rate-limit/backoff, and caching (10MB mem / 50MB disk equivalents). Require integrity: accept expected checksum (and optionally signature) inputs; after download, compute hash and fail closed on mismatch. If registry does not provide checksums, allow a strict mode flag that blocks installation unless a checksum is supplied. Add unit tests with mocked responses and error cases.

Stage 4 – Safe install/import pipeline: Implement unzip to a temp directory, locate SKILL.md either at root or in a single child folder, validate size/type allowlist, and copy/move into platform destinations or user-specified custom paths using atomic replaces. Write .clawdhub/origin.json with slug/version/source/installedAt. Prevent path traversal and clean temp dirs on success/failure. Provide delete/uninstall helper. Add tests covering zip and folder imports, duplicate names (unique destination resolution), and traversal attempts.

Stage 5 – Publish/update flow: Implement bunx clawdhub wrapper that resolves bunx from PATH and surfaces clear errors when missing. Support semantic bump (major/minor/patch), changelog/tags, and dry-run mode. Track last published hash per skill in app-support/config dir; recompute to decide whether publish is needed. Provide commands/handlers: status (bun installed? logged in? username), publish, update, login-help. Add unit tests stubbing process execution.

Stage 6 – UI/CLI integration: Extend existing aStudio surfaces (CLI commands and/or web/mac UI). Add skill list/detail views that render SKILL.md, show references, origin, installed platforms, update availability, and tags for counts. Add actions: search, install, update, publish with loading/error states and link out to Clawdhub page when available. Ensure accessibility labels and keyboard paths.

Stage 7 – Optional Sparkle packaging template: Port Scripts/package_app.sh + sign-and-notarize/make_appcast patterns from CodexSkillManager into docs/scripts for SwiftPM macOS utilities within aStudio. Document required env vars (SPARKLE_PUBLIC_KEY, SPARKLE_FEED_URL, Developer ID identity, App Store Connect creds) and when to enable Sparkle (only for signed bundles).

Stage 8 – Testing and validation: Add unit tests for parsing, hashing, install path resolution, integrity enforcement, version bump logic, and remote client error handling. For UI, add snapshot/unit tests plus an e2e happy path using mocked API and temp fs. Run repo lint/format and relevant test suites at the end.

## Concrete Steps

Run from repo root unless noted.

1. Baseline:
   pnpm lint
   pnpm test
   (Add swift test if a Swift target is created.)

2. Create package/module:
   - Add packages/skill-ingestion/ with source and test directories (or Swift equivalent under platforms/apple/swift if integrating natively). Export types and helpers.

3. Implement parsing + hashing:
   - Add metadata parser, stripFrontmatter, formatTitle helpers, and folder hasher.
   - Tests: metadata.test.\* and hash stability tests with fixture folders.

4. Implement remote client:
   - Add fetchLatest, search, fetchDetail, fetchLatestVersion, download with checksum/signature verification.
   - Tests: mock HTTP, success/error/status non-2xx, checksum mismatch.

5. Implement installer/importer:
   - Add unzip via ditto/unzip or library; guard traversal; write origin.json; atomic move.
   - Tests: zip/folder imports, duplicate name resolution, traversal rejection, temp cleanup.

6. Implement publisher:
   - Add bunx resolution, publish/update/status commands, hash-based “needs publish”, semantic bump helper.
   - Tests: process stubs for bun missing, login required, publish success/fail, bump edges.

7. Wire UI/CLI:
   - CLI: register commands (skills:search/install/update/publish/status) with flags for platform, checksum, dry-run, custom path.
   - UI: add list/detail components, actions, and loading/error states; ensure a11y labels; wire to stores.

8. Optional Sparkle template:
   - Add docs/scripts/sparkle/ with adapted package_app.sh, sign-and-notarize, make_appcast instructions; document env expectations and when to enable.

9. Validation:
   pnpm lint
   pnpm test
   (plus swift test if applicable)
   - Manual e2e with mocked API: search → install with checksum → view detail → publish dry-run.

## Validation and Acceptance

Feature is acceptable when: (1) CLI search/install/update/publish commands work with clear success/failure messaging and integrity guard; (2) UI shows SKILL.md and references, indicates update availability, and can install/update/publish with appropriate states; (3) publish refuses when bunx missing or not logged in, and uses hash to skip redundant publishes; (4) integrity mode blocks install when checksum/signature is missing or mismatched; (5) lint/tests pass. Optional Sparkle: template documented and runnable to produce a signed app zip and appcast when provided with signing keys.

## Idempotence and Recovery

Install and update operations are idempotent: reruns overwrite targets atomically. Temp dirs are cleaned on success/failure. Publish dry-run prevents side effects; hash check prevents duplicate publishes. If an install fails after download, user can delete the partial temp directory (cleaned automatically) and rerun with the same command.

## Artifacts and Notes

Keep concise evidence as you work (test outputs, sample origin.json, command transcripts) appended here as indented snippets. Example origin.json:
{
"slug": "my-skill",
"version": "1.2.3",
"source": "clawdhub",
"installedAt": 1762800000
}

## Interfaces and Dependencies

- SkillMetadata: { name: string | null; description: string | null }
- SkillReference: { id: string; name: string; url: string }
- SkillStats: { references: number; assets: number; scripts: number; templates: number }
- SkillPlatform enum: codex | claude | opencode | copilot with helpers storageKey, relativePath, rootPath(base?: string), description/badge if UI needs them.
- RemoteSkillClient:
  fetchLatest(limit: number) → RemoteSkill[]
  search(query: string, limit: number) → RemoteSkill[]
  download(slug: string, version?: string, checksum?: string, signature?: string) → DownloadedSkill { tempDir, skillRoot, checksumVerified }
  fetchDetail(slug: string) → RemoteSkillOwner | null
  fetchLatestVersion(slug: string) → string | null
- Installer:
  scanSkills(base: URL, storageKey: string) → SkillSummary[]
  install(download: DownloadedSkill, destinations: InstallDestination[], writeOrigin: boolean) → { selectedId?: string }
  computeHash(skillRoot: URL) → sha256 string
  delete(ids or paths) → void
- Publisher:
  status() → { bunInstalled: boolean; loggedIn: boolean; username?: string; error?: string }
  publish(skillPath, bump, changelog?, tags[], dryRun?) → version string
  nextVersion(current, bump) → string
- External deps: prefer stdlib (crypto, fs, URL fetch). Use system ditto/unzip or a small unzip lib that supports streaming and prevents traversal. bunx required for publish; document PATH resolution and user-facing error when absent. Integrity enforcement should use built-in crypto (Node crypto or Swift CryptoKit) and fail closed on mismatch.

## State Machines (paths, failure modes, invariants)

State machine: RemoteSkillClient.download (strict by default; invariant: checksum must match in strict mode)
stateDiagram-v2
[*] --> BuildURL
BuildURL --> FetchZip : HTTP GET /api/v1/download
FetchZip --> ValidateHTTP : response.ok?
ValidateHTTP --> ErrorHTTP : no
ValidateHTTP --> SaveTemp : yes
SaveTemp --> ComputeChecksum
ComputeChecksum --> CheckStrict
CheckStrict --> ErrorMissingChecksum : strict && !expectedChecksum
CheckStrict --> VerifyChecksum
VerifyChecksum --> ErrorChecksumMismatch : checksum != expected
VerifyChecksum --> Success : checksum ok
ErrorHTTP --> [*]
ErrorMissingChecksum --> [*]
ErrorChecksumMismatch --> [*]
Success --> [*]

State machine: installSkillFromZip (invariant: SKILL.md present; temp dir always cleaned)
stateDiagram-v2
[*] --> Unzip
Unzip --> ErrorUnzip : ditto exit != 0
Unzip --> LocateRoot
LocateRoot --> ErrorNoSkill : strictSingleSkill && not exactly one SKILL.md
LocateRoot --> CopyToDest
CopyToDest --> WriteOrigin
WriteOrigin --> NextDest? : more destinations
NextDest? --> CopyToDest : yes
NextDest? --> Success : no
ErrorUnzip --> Cleanup --> [*]
ErrorNoSkill --> Cleanup --> [*]
Success --> Cleanup --> [*]

State machine: publishSkill (invariant: skip if hash unchanged; requires bunx)
stateDiagram-v2
[*] --> LoadHash
LoadHash --> SkipPublish : storedHash == currentHash && !dryRun
LoadHash --> ResolveBunx
ResolveBunx --> ErrorBunxMissing : not found
ResolveBunx --> BuildArgs
BuildArgs --> DryRun? : dryRun
DryRun? --> EmitCommand : yes
DryRun? --> SpawnPublish : no
SpawnPublish --> ErrorProcess : exit != 0
SpawnPublish --> SaveHash : exit == 0
SaveHash --> Success
SkipPublish --> Success
ErrorBunxMissing --> [*]
ErrorProcess --> [*]
EmitCommand --> [*]
Success --> [*]

State machine: CLI skills install (invariant: checksum required unless --allow-unsafe)
stateDiagram-v2
[*] --> ParseArgs
ParseArgs --> ErrorNoChecksum : strict && !checksum
ParseArgs --> DownloadZip
DownloadZip --> ErrorDownload : HTTP error/ checksum mismatch
DownloadZip --> InstallZip
InstallZip --> ErrorInstall : unzip/skill root not found
InstallZip --> EmitPaths
EmitPaths --> [*]
ErrorNoChecksum --> [*]
ErrorDownload --> [*]
ErrorInstall --> [*]

State machine: SkillsView (SwiftUI)
stateDiagram-v2
[*] --> Idle
Idle --> Loading : onAppear/refresh
Loading --> Loaded : load success
Loading --> Failed : load error
Failed --> Loading : Retry
Loaded --> Loading : Pull-to-refresh/Reload
Failed --> [*] : close view
Loaded --> [*] : close view
