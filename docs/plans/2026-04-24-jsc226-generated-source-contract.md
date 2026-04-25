# JSC-226 Generated Source Contract

Last updated: 2026-04-24

## Table of Contents

- [Purpose](#purpose)
- [Decision](#decision)
- [Tracked Generated Source](#tracked-generated-source)
- [Ignored Generated Source](#ignored-generated-source)
- [Freshness Gate](#freshness-gate)
- [Agent Impact](#agent-impact)
- [Validation](#validation)

## Purpose

JSC-226 resolves the generated-source portion of the JSC-223 repo cleanup.
The goal is to make generated runtime inputs explicit instead of leaving agents
to guess whether a generated file is source-control authority, local build
scratch, or a stale artifact.

## Decision

Keep deterministic generated runtime inputs tracked when source code imports
them directly, and ignore mutable local build mirrors that only exist to support
development builds.

Every tracked generated-source file must have:

- a deterministic regeneration command;
- a freshness check that fails when the checked-in output is stale;
- an explicit `.gitignore` exception or comment when nearby generated files are
  intentionally ignored.

## Tracked Generated Source

These files remain committed because runtime code imports them directly:

- `platforms/web/apps/web/TEMPLATE_REGISTRY.json`
- `platforms/web/apps/web/TEMPLATE_REGISTRY.md`
- `platforms/web/apps/web/src/generated/template-registry.ts`
- `packages/widgets/src/sdk/generated/widget-manifest.js`
- `packages/cloudflare-template/src/worker/widget-manifest.generated.ts`

Regeneration ownership:

- Web template registry: `pnpm -C platforms/web/apps/web registry:generate`
- Widget runtime manifest: `pnpm -C packages/widgets build`
- Cloudflare worker manifest: `pnpm -C packages/cloudflare-template run prebuild`

`packages/cloudflare-template/src/worker/widget-manifest.generated.ts` no longer
embeds a generation timestamp, so a no-op regeneration is byte-for-byte stable.

## Ignored Generated Source

`packages/widgets/src/sdk/generated/widget-manifest.ts` remains ignored. It is a
mutable TypeScript mirror used by local widget dev/build flows and is regenerated
by `packages/widgets` rather than treated as committed source authority.

The tracked JavaScript sibling,
`packages/widgets/src/sdk/generated/widget-manifest.js`, is the committed ESM
runtime manifest for JavaScript consumers.

## Freshness Gate

The root command is:

```bash
pnpm generated-source:check
```

It regenerates the web template registry, widget JavaScript manifest, and
Cloudflare worker manifest, formats tracked generated source with Biome 2.3.11,
and fails if any tracked generated-source file changes from the committed
snapshot.

`pnpm test:policy` now includes the generated-source freshness subcontract so
repo policy catches stale generated runtime inputs before agents or reviewers
trust them.

## Agent Impact

This makes the design system better for agents in three concrete ways:

- Agent imports and code search now resolve to fresh widget/template manifests
  instead of stale committed generated files.
- Cleanup decisions are machine-checkable: generated runtime inputs are either
  tracked and freshness-checked or ignored as local build mirrors.
- The root policy gate teaches agents one command to prove generated-source
  freshness instead of relying on manual diff inspection.

## Validation

Focused validation for this slice:

```bash
pnpm generated-source:check
pnpm -C platforms/web/apps/web registry:check
pnpm test:policy
pnpm docs:lint
pnpm format:check
git diff --check
```
