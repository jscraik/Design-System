# Task Route: Ship/Update a Widget

Last updated: 2026-03-05

## Doc requirements

- Audience: Developers and AI coding agents
- Scope: Build and validate widget output for integration
- Non-scope: Full UI design review
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Weekly

## Table of Contents

- [Preconditions](#preconditions)
- [Happy Path (15 minutes)](#happy-path-15-minutes)
- [Validation](#validation)
- [Fallback Path](#fallback-path)
- [Expected Output](#expected-output)

## Preconditions

- Repo cloned and dependencies installed
- Preflight passes

## Happy Path (15 minutes)

```bash
pnpm build:widget
pnpm build:widgets
```

## Validation

```bash
pnpm test:visual:web
pnpm onboarding:outcome:check
```

## Fallback Path

If build fails:

1. Run `pnpm -C packages/ui build`.
2. Re-run widget build commands.
3. Check generated output path.

## Expected Output

- Single-file widget output generated at `platforms/web/apps/web/dist/widget.html`.
- Widget bundle build completes successfully.
