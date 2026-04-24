# JSC-225 Publish Artifact Audit

## Scope
- Read-only audit of tracked ignored build outputs and package publish contracts.
- Evidence sources: tracked files, `.gitignore`, package manifests, publish workflows, and docs.

## Severity-Ranked Findings

### 1. HIGH: 306 tracked `dist` artifacts are explicitly ignored by repo policy, creating artifact drift risk
- Evidence:
  - `.gitignore` ignores all dist outputs via `**/dist/` at `.gitignore:78`.
  - `git check-ignore -v --no-index` matches tracked files under:
    - `packages/cli/dist/**` (example: `packages/cli/dist/index.js`)
    - `packages/effects/dist/**` (example: `packages/effects/dist/index.js`)
    - `packages/json-render/dist/**` (example: `packages/json-render/dist/index.js`)
    - `packages/runtime/dist/**` (example: `packages/runtime/dist/index.js`)
    - `packages/skill-ingestion/dist/**` (example: `packages/skill-ingestion/dist/index.js`)
    - `packages/tokens/dist/**` (example: `packages/tokens/dist/index.js`)
    - `packages/validation-prototype/dist/**` (example: `packages/validation-prototype/dist/minimal.js`)
    - `packages/widgets/dist/**` (example: `packages/widgets/dist/src/widgets/chat/chat-view/index.html`)
    - `platforms/web/apps/web/dist/**` (example: `platforms/web/apps/web/dist/index.html`)
- Why this matters:
  - Ignore policy and tracked reality diverge. New generated artifacts in these paths are silently suppressed by default Git behavior, while old tracked artifacts remain mutable, making stale artifact commits and partial refreshes likely.

### 2. MEDIUM: `platforms/web/apps/web/dist/**` tracked set appears inconsistent with documented/runtime artifact contract
- Evidence:
  - Runtime/docs point to `platforms/web/apps/web/dist/widget.html`:
    - `README.md:195`
    - `docs/QUICK_START.md:62`
    - `platforms/mcp/enhanced-server.js:21`
    - `platforms/mcp/scripts/smoke.mjs:4`
  - Tracked files in that directory are instead `index.html` and hashed JS assets (3 files total), not `widget.html`.
- Why this matters:
  - The tracked artifacts do not reflect the runtime-described contract, which suggests stale or non-canonical outputs are being retained.

### 3. MEDIUM: Publishable package contracts rely on `dist` outputs without package-local publish guards
- Evidence:
  - Publishable packages include `dist` in package contracts:
    - `packages/effects/package.json:17-18`, `:15-16`
    - `packages/json-render/package.json:18-19`, `:16-17`
    - `packages/runtime/package.json:13-14`, `:16-17`
    - `packages/skill-ingestion/package.json:12-13`, `:15-16`
    - `packages/tokens/package.json:20-22`, `:25-26`
    - `packages/ui/package.json:81-82`, `:79-80`
    - `packages/astudio-icons/package.json` includes `files` with `dist`
  - No package-level `prepublishOnly` hooks were found in these package manifests (`rg -n "prepublishOnly" packages/*/package.json` yielded none).
  - Current publish workflow does build before publishing for aStudio packages (`.github/workflows/publish-astudio.yml:48-52` and root `publish:astudio` script at `package.json:99`), but that is a workflow contract rather than a package-local guard.
- Why this matters:
  - Package publication correctness depends on external orchestration; local/alternative publish paths can drift if `dist` is absent or stale.

## Classification

### Keep Tracked (for now)
- `packages/tokens/dist/**`, `packages/ui/dist/**`, `packages/astudio-icons/dist/**` only when tied to current publish workflow contract that performs explicit build before publish (`.github/workflows/publish-astudio.yml:48-52`, `package.json:99`).
- Rationale: these are directly in active publish lane and currently have workflow coverage.

### Remove (strong candidate)
- `platforms/web/apps/web/dist/index.html`
- `platforms/web/apps/web/dist/assets/design-studio-chat-l0sNRNKZ.js`
- `platforms/web/apps/web/dist/assets/design-studio-icons-l0sNRNKZ.js`
- `packages/validation-prototype/dist/**`
- Rationale: private/prototype app output with no clear tracked-artifact contract, plus mismatch against documented `widget.html` runtime target.

### Needs Follow-Up Decision
- `packages/cli/dist/**` (private package but root scripts/docs invoke `dist` directly; examples: `package.json:115`, docs under `docs/guides/*` call `node packages/cli/dist/index.js ...`).
- `packages/widgets/dist/**` (private package; docs reference deployment copy flow from dist, e.g. `packages/widgets/README.md:70-74`).
- `packages/effects/dist/**`, `packages/json-render/dist/**`, `packages/runtime/dist/**`, `packages/skill-ingestion/dist/**` (publishable contracts include `dist`, but publish policy and release lanes are not uniformly codified with package-local prepublish guards).
- Rationale: these may be intentionally tracked for ergonomics or downstream tooling, but the contract should be made explicit and consistent.

## Suggested Contract Hardening (non-edit recommendation)
- Pick one canonical policy per path family:
  - Track built artifacts intentionally and un-ignore explicitly per package, with regeneration checks.
  - Or untrack artifacts and enforce build-before-publish/test via package-local hooks (`prepublishOnly`) and CI gates.
- Align docs/runtime references so tracked assets match the actual runtime target (`widget.html` vs current tracked `index.html` + hashed assets).

WROTE: artifacts/reviews/jsc225-publish-artifact-audit.md
