# DESIGN.md Contract

Last updated: 2026-04-24

## Table of Contents

- [Purpose](#purpose)
- [Source of Truth](#source-of-truth)
- [Required Frontmatter](#required-frontmatter)
- [Required Body Sections](#required-body-sections)
- [Agent Workflow](#agent-workflow)
- [Migration States](#migration-states)
- [Rollback](#rollback)
- [Troubleshooting](#troubleshooting)

## Purpose

`DESIGN.md` is the agent-readable UI contract for this repository and for
consumer projects adopting the aStudio design-system guidance package. It gives
agents a deterministic place to read design intent, supported profile metadata,
required UI states, focus and motion rules, and component-routing boundaries
before generating or changing UI.

## Source of Truth

Contract metadata lives in `DESIGN.md`.

Rollout state lives in `.design-system-guidance.json` under
`designContract.mode` and `designContract.migrationState`.

The semantic engine lives in `packages/agent-design-engine`. The wrapper package
`packages/design-system-guidance` owns rollout policy, supported profiles, and
the compatibility manifest. The CLI in `packages/cli` exposes both through
`astudio design ...` commands.

Boundary ownership is guarded by `pnpm agent-design:boundaries`, which blocks
packages from deep-importing `packages/agent-design-engine/src/**` and blocks
the guidance wrapper from reimplementing `DESIGN.md` markdown/YAML parsing,
semantic lint, diff, export, or profile-comparison logic. Public package
exports such as `@brainwav/agent-design-engine` remain the allowed integration
path.

## Required Frontmatter

Every v1 contract requires this frontmatter:

```yaml
---
schemaVersion: agent-design.v1
brandProfile: astudio-default@1
---
```

- `schemaVersion` must be `agent-design.v1`.
- `brandProfile` must match a profile supported by the active guidance
  compatibility manifest.
- Profile definitions remain owned by `packages/design-system-guidance`, not the
  engine package.

## Required Body Sections

The v1 semantic contract expects the body to include these sections:

- `Surface Roles`
- `State Model`
- `Focus Contract`
- `Motion Contract`
- `Viewport And Input`
- `Component Routing`
- `Token Notes`

The rule manifest `packages/agent-design-engine/rules/agent-design.rules.v1.json`
maps semantic findings back to these source documents:

- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`
- `docs/design-system/AGENT_UI_ROUTING.md`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/COVERAGE_MATRIX.json`

When any source is missing from the manifest or unavailable to the engine, design
commands must fail before semantic evaluation.

## Agent Workflow

Read or validate the active contract:

```bash
pnpm -C packages/cli build
node packages/cli/dist/index.js design lint --file DESIGN.md --json
```

Compare two contract versions:

```bash
node packages/cli/dist/index.js design diff --before before.DESIGN.md --after DESIGN.md --json
```

Export the normalized contract:

```bash
node packages/cli/dist/index.js design export --file DESIGN.md --format json@agent-design.v1 --json
```

Check profile resolution:

```bash
node packages/cli/dist/index.js design check-brand --file DESIGN.md --strict --json
```

Machine consumers should request JSON or run in `--agent`/CI mode. In agent or
CI mode, explicit `--plain` is rejected with `E_POLICY` and a structured
recovery payload explaining why no retry command is safe.

## Migration States

`.design-system-guidance.json` stores rollout state only:

```json
{
  "schemaVersion": 2,
  "docs": ["docs/design-system/CONTRACT.md"],
  "designContract": {
    "mode": "design-md",
    "migrationState": "active",
    "rollbackMetadata": "artifacts/design-migrations/<id>-guidance-rollback.json"
  }
}
```

Supported modes:

- `legacy`: existing guidance checks remain authoritative.
- `design-md`: `DESIGN.md` participates in the design-system contract workflow.

Supported migration states:

- `not-started`
- `initialized`
- `active`
- `partial`
- `failed`
- `rolled-back`

Fresh migration is allowed only from legacy `not-started`, `initialized`,
`rolled-back`, or design-md `active` state. Resume is allowed only from `partial`
or `failed` state.

## Rollback

Run a dry-run first:

```bash
node packages/cli/dist/index.js design migrate --rollback --dry-run --json
```

Write rollback state:

```bash
node packages/cli/dist/index.js design migrate --rollback --write --json
```

Rollback requires readable metadata inside the project root. The metadata
records wrapper version, target path, config checksum, before/after modes, and
the prior config snapshot. If rollback succeeds and a migrated `DESIGN.md`
exists, the file is quarantined under `artifacts/design-migrations/` with a
content-hash path before rollout state is marked `rolled-back`.

## Troubleshooting

- `E_DESIGN_CONTRACT_MISSING`: pass `--file`, use `--scope root`, or create
  `DESIGN.md` with `astudio design init --write`.
- `E_DESIGN_CONTRACT_AMBIGUOUS`: pass an explicit `--file` or `--scope`.
- `E_DESIGN_PROFILE_UNKNOWN`: update `brandProfile` or the guidance profile
  manifest.
- `E_DESIGN_ROLLBACK_METADATA_UNREADABLE`: restore the recorded rollback
  metadata before retrying rollback or resume.
- `E_POLICY`: rerun with the structured `recovery.nextCommand` when present; if
  `recoveryUnavailableReason` is present, fix the invocation manually.
