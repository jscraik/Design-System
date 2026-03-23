# Vendor Risk: @openai/apps-sdk-ui Dependency

**Severity:** High
**Status:** Documented — mitigation plan in progress
**Owner:** Design System team
**Last reviewed:** 2026-03-22

---

## Table of Contents

- [Summary](#summary)
- [Dependency surface](#dependency-surface)
- [Risk scenarios](#risk-scenarios)
- [Component ownership map](#component-ownership-map)
- [Mitigation strategy](#mitigation-strategy)
- [Contingency plan](#contingency-plan)
- [Monitoring](#monitoring)

---

## Summary

`@openai/apps-sdk-ui` is the visual and component foundation for this design system.
It provides base primitives (Button, Input, Card, Dialog, etc.) that our `packages/ui`
components build on. This creates a single-vendor dependency with no currently documented
escape hatch — any breaking change, deprecation, or access restriction in the upstream
package would require a full re-skin with no migration path defined.

This document records the risk, maps the dependency surface, and defines a contingency plan.

---

## Dependency surface

```
packages/ui
└── src/components/ui/
    ├── base/          ← wraps @openai/apps-sdk-ui primitives directly
    │   ├── button.tsx
    │   ├── input.tsx
    │   ├── table.tsx
    │   ├── card.tsx
    │   ├── badge.tsx
    │   └── …
    ├── feedback/      ← our components, use base/ only
    ├── layout/        ← our components, no SDK dep
    ├── forms/         ← our components, use base/ only
    └── data-display/  ← our components, use base/ only
```

**Direct SDK consumers in `base/`:** ~12 primitive wrappers
**Indirect consumers (our components):** ~18 components that import from `base/`
**External consumers (apps):** anything importing from `@design-studio/ui`

---

## Risk scenarios

| Scenario | Probability | Impact | Current exposure |
|---|---|---|---|
| Breaking API change in a minor/patch release | Medium | High | All 12 base wrappers need updates |
| Package renamed or deprecated | Low | Critical | Full re-skin required |
| License change restricting internal use | Low | Critical | Must fork or replace |
| OpenAI discontinues Apps SDK | Very low | Critical | No fallback |
| Upstream introduces a dependency we cannot use (size/security) | Low | Medium | Build pipeline impacted |

---

## Component ownership map

This table maps each base wrapper to its upstream SDK component and our abstraction depth.

| Our component | SDK source | Abstraction depth | Escapable? |
|---|---|---|---|
| `<Button>` | `AppsSDK.Button` | Thin prop-pass-through | Yes — swap to Radix + CVA |
| `<Input>` | `AppsSDK.Input` | Thin wrapper | Yes — swap to `<input>` + CVA |
| `<Card>` | `AppsSDK.Card` | Structural + class | Yes |
| `<Badge>` | `AppsSDK.Badge` | Class names only | Yes |
| `<Dialog>` | `AppsSDK.Dialog` | Uses portal + focus trap | Medium — need Radix Dialog |
| `<AlertDialog>` | `AppsSDK.AlertDialog` | Uses portal + focus trap | Medium |
| `<Table>` | `AppsSDK.Table` | Structural | Yes |
| `<Sonner / Toast>` | `sonner` (third-party) | Re-export only | Yes |

**Escapability assessment:** All base components are escapable with Radix UI primitives
as the replacement target. No component requires SDK-specific internal APIs or context.

---

## Mitigation strategy

### Phase 1 — Isolation (immediate, no breaking change)

Ensure all SDK imports are **confined to `packages/ui/src/components/ui/base/`**.
No component outside `base/` should import `@openai/apps-sdk-ui` directly.

- [ ] Add a Biome lint rule or TypeScript path alias to enforce this boundary
- [ ] Audit current imports: `rg "@openai/apps-sdk-ui" packages/ui/src --include="*.tsx" -l`
- [ ] Document any violations and migrate to `base/` wrappers

### Phase 2 — Abstraction layer (next sprint)

The `base/` wrappers are the abstraction layer. Make them complete:

- [ ] Ensure every prop consumers care about is forwarded (not SDK-leaked)
- [ ] Remove any SDK-specific type re-exports from `packages/ui/src/index.ts`
- [ ] Verify `base/` components work with our token CSS variables, not SDK inline styles

### Phase 3 — Vendoring contingency (if risk materialises)

If the upstream package breaks or becomes unavailable:

1. **Fork `@openai/apps-sdk-ui`** into `packages/ui/src/primitives/` at the last working commit
2. All `base/` wrappers re-point imports to `../../primitives/`
3. No consumer-facing API changes required — the `base/` abstraction holds
4. Begin gradual migration from forked SDK to Radix UI primitives

**Time estimate for Phase 3:** 2–4 days for isolation; 2–3 weeks for full Radix migration

---

## Contingency plan

**Trigger condition:** Any of the following:
- `@openai/apps-sdk-ui` publishes a breaking change that affects > 3 base wrappers
- Package is deprecated or removed from the npm registry
- License changes to restrict internal commercial use

**Response playbook:**

```
1. Pin to last working version immediately (package.json exact version)
2. Open a tracking issue: "SDK contingency — vendor risk triggered"
3. Execute Phase 3 vendoring (fork → re-point → test)
4. Begin Radix migration sprint
5. Remove forked SDK once Radix migration is complete
```

**Radix UI target mapping:**

| Current (SDK) | Radix target |
|---|---|
| `AppsSDK.Dialog` | `@radix-ui/react-dialog` |
| `AppsSDK.AlertDialog` | `@radix-ui/react-alert-dialog` |
| `AppsSDK.Button` | Custom CVA component + `@radix-ui/react-slot` |
| `AppsSDK.Input` | Native `<input>` + CVA |
| `AppsSDK.Card` | Native `<div>` + class |
| `AppsSDK.Badge` | Native `<span>` + CVA |
| `AppsSDK.Table` | Native `<table>` elements |

Note: `@radix-ui/*` is already a dependency of this repo for other primitives.
The migration target is available without adding new dependencies.

---

## Monitoring

- **Version audit:** Run `pnpm why @openai/apps-sdk-ui` monthly and track changelog
- **Pinned version:** Consider pinning minor version in `package.json` (`"~x.y.0"`)
  to prevent silent breaking changes from patch releases
- **CI check:** Add a step that fails if `@openai/apps-sdk-ui` appears outside `base/`
- **Review trigger:** Re-assess this document if the SDK releases a major version or
  OpenAI announces changes to the Apps SDK programme
