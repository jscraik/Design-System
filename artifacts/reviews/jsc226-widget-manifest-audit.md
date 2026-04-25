# JSC-226 Widget Manifest Generated-Source Audit

## Scope

Audited generated-source ownership and freshness for the widgets and Cloudflare manifest path only:

- `packages/widgets/src/sdk/generated/widget-manifest.ts`
- `packages/widgets/src/sdk/generated/widget-manifest.js`
- `packages/widgets/src/sdk/plugins/widget-manifest.ts`
- `packages/widgets/package.json`
- `packages/widgets/vite.config.ts`
- `packages/cloudflare-template/src/worker/widget-manifest.generated.ts`
- `packages/cloudflare-template/scripts/build-widgets.mjs`
- `packages/cloudflare-template/package.json`
- README/docs references discovered by `rg`

## Findings

### P1 - Tracked JS manifest is stale and has no regeneration owner

Evidence:

- `packages/widgets/src/shared/widget-registry.js:16` dynamically loads `../sdk/generated/widget-manifest.js`, so JS consumers can observe this generated file at runtime.
- `packages/widgets/src/sdk/generated/widget-manifest.js:1` labels the file as auto-generated, but `git ls-files` shows it is tracked.
- `packages/widgets/src/sdk/generated/widget-manifest.js:5-114` contains only 18 widget entries.
- Current widget source discovery shows 22 `packages/widgets/src/widgets/**/index.html` entries.
- `packages/widgets/src/sdk/generated/widget-manifest.js` is missing source widgets that exist in the generated TypeScript manifest path, including `past-orders`, `search-spotlight`, `json-render-demo`, and `pizzaz-map`; the TypeScript manifest includes these at `packages/widgets/src/sdk/generated/widget-manifest.ts:12`, `packages/widgets/src/sdk/generated/widget-manifest.ts:18`, `packages/widgets/src/sdk/generated/widget-manifest.ts:78`, and `packages/widgets/src/sdk/generated/widget-manifest.ts:102`.
- The Vite plugin writes only `src/sdk/generated/widget-manifest.ts` at `packages/widgets/src/sdk/plugins/widget-manifest.ts:81` and `packages/widgets/src/sdk/plugins/widget-manifest.ts:214`; no inspected script writes the JS wrapper.

Impact:

The TypeScript and JavaScript manifest surfaces can disagree. JS consumers that call `createWidgetTool()` through `packages/widgets/src/shared/widget-registry.js` can fail for widgets that exist in source and in the freshly generated TypeScript manifest.

Recommendation:

Pick one owner. Prefer deleting the tracked JS generated file and routing JS consumers through built package output, or add a deterministic generator that writes both `.ts` and `.js` from the same manifest object. Add the JS generated file to `.gitignore` if it remains derived and should not be hand-maintained.

### P1 - Cloudflare generated manifest is tracked but not refreshed by the widget build

Evidence:

- `packages/cloudflare-template/src/worker/index.ts:3` imports `./widget-manifest.generated`, so this generated file is part of worker runtime behavior.
- `packages/cloudflare-template/src/worker/widget-manifest.generated.ts:1-2` labels the file as generated and records `Generated at: 2026-01-09T18:04:11.233Z`.
- `packages/cloudflare-template/src/worker/widget-manifest.generated.ts:8-135` contains content-hashed widget URIs from that old generated snapshot.
- `packages/cloudflare-template/scripts/build-widgets.mjs:80-89` copies the widgets TypeScript manifest into `src/worker/widget-manifest.generated.ts` and prepends a fresh timestamp.
- `packages/widgets/package.json:7` defines the widgets build command, and `packages/widgets/src/sdk/plugins/widget-manifest.ts:214` writes only the widgets TypeScript manifest.
- Running `pnpm -C packages/widgets build` passed and regenerated `packages/widgets/src/sdk/generated/widget-manifest.ts` with 22 widgets, but it did not refresh the tracked Cloudflare worker manifest.

Impact:

The worker can serve stale `ui://widget/...` URIs unless someone remembers to run `pnpm -C packages/cloudflare-template run prebuild` after the widgets build. Because the worker generated manifest is tracked, stale data can be committed as source.

Recommendation:

Either stop tracking `packages/cloudflare-template/src/worker/widget-manifest.generated.ts` and make Cloudflare builds generate it as a local artifact, or keep it tracked and add an explicit freshness check that runs the Cloudflare prebuild and fails if `git diff -- packages/cloudflare-template/src/worker/widget-manifest.generated.ts` is non-empty.

### P2 - `.gitignore` partially encodes generated-source ownership

Evidence:

- `.gitignore:126-129` labels mutable build outputs as regenerated/non-deterministic and ignores `packages/widgets/src/sdk/generated/widget-manifest.ts`.
- `git check-ignore -v` confirms `packages/widgets/src/sdk/generated/widget-manifest.ts` is ignored by `.gitignore:129`.
- `git ls-files` shows `packages/cloudflare-template/src/worker/widget-manifest.generated.ts` and `packages/widgets/src/sdk/generated/widget-manifest.js` remain tracked.
- `.gitignore` has no matching entry for `packages/widgets/src/sdk/generated/widget-manifest.js` or `packages/cloudflare-template/src/worker/widget-manifest.generated.ts`.

Impact:

The repo currently treats one generated manifest as ignored local output, while two generated manifest surfaces remain tracked. That can be valid only if the tracked files have a deterministic freshness contract, which this lane does not currently provide.

Recommendation:

Align `.gitignore` with the chosen ownership model. If generated manifests are build artifacts, ignore all generated manifest outputs. If any generated manifest remains source-controlled, document why and add a freshness check for it.

### P2 - Freshness checks are documentation-only

Evidence:

- `packages/cloudflare-template/README.md:57-59` explains that Cloudflare dev runs `prebuild`, and says to run the widgets build before Cloudflare prebuild if skipping dev.
- `packages/cloudflare-template/README.md:212-213` asks humans to verify the generated worker manifest exists.
- `docs/architecture/WIDGET_SYSTEM_ENHANCEMENTS.md:165-169` says to build widgets and confirm `packages/widgets/src/sdk/generated/widget-manifest.ts` is updated.
- `packages/cloudflare-template/package.json:8-15` wires `prebuild`, `build`, and `check`, but there is no dedicated check mode that asserts generated manifests are fresh without leaving tracked timestamp churn.

Impact:

Humans can follow the docs and still miss stale tracked generated files, especially because the canonical root command `pnpm build:widgets` only updates the ignored TypeScript manifest.

Recommendation:

Add a small check script, for example `scripts/check-widget-manifest-freshness.mjs`, that verifies source widget count and manifest keys match across the runtime surfaces. For tracked generated outputs, generate to a temp path or normalize timestamps before diffing.

## Tracking Decision

Recommended final ownership:

- Keep tracking `packages/widgets/src/sdk/plugins/widget-manifest.ts`; it is source.
- Ignore `packages/widgets/src/sdk/generated/widget-manifest.ts`; current `.gitignore` already matches the build behavior.
- Do not keep `packages/widgets/src/sdk/generated/widget-manifest.js` as manually tracked generated source unless a deterministic generator is added for it.
- Prefer not tracking `packages/cloudflare-template/src/worker/widget-manifest.generated.ts`; if the worker requires it at typecheck/build time, generate it in `prebuild` and add a freshness check rather than relying on committed hashes.

## Deterministic Regeneration Commands

- Widgets manifest and widget assets: `pnpm -C packages/widgets build`
- Cloudflare worker manifest and copied widget assets: `pnpm -C packages/cloudflare-template run prebuild` after `pnpm -C packages/widgets build`
- Cloudflare full build path: `pnpm -C packages/cloudflare-template build` after widgets are built; `prebuild` runs first via `packages/cloudflare-template/package.json:8-10`.

Current caveat: `packages/cloudflare-template/scripts/build-widgets.mjs:83-85` embeds `new Date().toISOString()`, so the worker manifest output is not byte-for-byte deterministic even when widget contents do not change.

## Validation Performed

- `git ls-files packages/widgets/src/sdk/generated/widget-manifest.ts packages/widgets/src/sdk/generated/widget-manifest.js packages/cloudflare-template/src/worker/widget-manifest.generated.ts packages/cloudflare-template/dist packages/widgets/dist` -> pass; confirmed tracked generated surfaces are JS wrapper and Cloudflare worker manifest only.
- `git check-ignore -v packages/widgets/src/sdk/generated/widget-manifest.ts packages/widgets/src/sdk/generated/widget-manifest.js packages/cloudflare-template/src/worker/widget-manifest.generated.ts packages/widgets/dist/foo packages/cloudflare-template/dist/foo` -> pass; confirmed TypeScript manifest and dist outputs are ignored, JS wrapper and worker manifest are not ignored.
- `fd '^index\.html$' packages/widgets/src/widgets` -> pass; confirmed 22 widget entry HTML files.
- `pnpm -C packages/widgets build` -> pass; generated build output for 22 widgets and regenerated the ignored TypeScript manifest.

WROTE: artifacts/reviews/jsc226-widget-manifest-audit.md
