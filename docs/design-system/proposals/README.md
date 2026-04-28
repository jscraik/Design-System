# Design-System Abstraction Proposals

## Table of Contents

- [Purpose](#purpose)
- [When a Proposal Is Required](#when-a-proposal-is-required)
- [Waivers](#waivers)
- [Validation](#validation)

## Purpose

Abstraction proposals make new recommended primitives expensive by default. Agents
and humans must prove that an existing Apps SDK primitive, product composition
primitive, or documented fallback cannot satisfy the surface before promoting a
new route or lifecycle entry.

## When a Proposal Is Required

Use [TEMPLATE.md](TEMPLATE.md) before adding either of these:

- An `enforced` route in `docs/design-system/AGENT_UI_ROUTING.json`.
- A canonical tier-2 lifecycle entry in
  `docs/design-system/COMPONENT_LIFECYCLE.json` that does not yet have
  `docs/design-system/COVERAGE_MATRIX.json` coverage.

Accepted proposal files must live under `docs/design-system/proposals/`, set
`status: accepted`, and be referenced with `proposalRef` from the promoted route
or lifecycle entry.

## Waivers

`waivers.json` is the typed grandfathering registry for existing routes or
lifecycle rows that predate this proposal gate. A waiver is valid only when it
has:

- `scope`
- `target`
- `owner`
- `reason`
- `expiresAt`
- `cleanup`
- `status`

Free-form comments are not accepted as grandfathering evidence. Expired waivers
fail validation, and near-expiry waivers emit audit diagnostics so owners can
replace them with accepted proposals or coverage.

## Validation

Run the proposal gate through the agent-design engine:

```bash
pnpm agent-design:proposals
```

`pnpm test:policy` also runs the same gate through the policy subcontract list.
