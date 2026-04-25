# JSC-75 Composition Primitives

## Summary

Added agent-native product composition primitives so new surfaces can start from semantic page, panel, section, data-view, and async-state roles before falling back to loose layout utilities.

## Changed

- Added `ProductPageShell`, `ProductPanel`, `ProductSection`, `ProductDataView`, and `ProductStateWrapper` under `packages/ui/src/components/ui/layout/ProductComposition`.
- Exported the primitives from the UI layout and public UI barrels.
- Updated `docs/design-system/AGENT_UI_ROUTING.md` with Apps SDK, local primitive, template, and fallback routing guidance.
- Registered the primitives in `docs/design-system/COMPONENT_LIFECYCLE.json`, the generated coverage matrix, and `docs/design-system/A11Y_CONTRACTS.md`.
- Regenerated tracked widget manifests after the generated-source policy gate found stale outputs.

## Layer Impact

- Brand tokens: unchanged.
- Alias tokens: unchanged.
- Mapped theme slots: consumed through existing semantic Tailwind classes such as `bg-background`, `text-foreground`, `border-border`, `bg-card`, and `text-muted-foreground`.
- Component routing: new canonical tier-2 local composition targets.

## Validation

- `jq . docs/design-system/COMPONENT_LIFECYCLE.json` -> pass.
- `pnpm -C packages/ui test -- ProductComposition.test.tsx` -> pass; 75 files passed, 1759 tests passed, 13 skipped, with existing TagInput `act(...)` warnings.
- `pnpm typecheck` -> pass.
- `pnpm ds:matrix:check` -> pass.
- `pnpm design-system-guidance:ratchet` -> pass.
- `pnpm design-system-guidance:check:ci` -> pass with existing repo-wide warnings and exit code 0.
- `pnpm generated-source:check` -> pass after regenerating tracked manifests.
- `pnpm -C packages/ui build` -> pass.
- `pnpm test:policy` -> pass.
- `pnpm lint` -> pass.
- `git diff --check` -> pass.
