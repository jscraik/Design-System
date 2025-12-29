# Cross-platform design

## Tokens are the single source of truth

All UI styling (React + Swift) is driven from one canonical DTCG token bundle:

- Canonical: `packages/tokens/src/tokens/index.dtcg.json`
- Generated web: `packages/ui/src/styles/tokens.css`, `packages/ui/src/styles/theme.css`
- Generated swift: `swift/ChatUIFoundation/.../Generated/Tokens.swift`
- Token reference (authoritative mapping): `docs/theming/token-reference.md`

### Drift prevention
- No hard-coded styling literals in components (except documented escape hatches).
- Generated artifacts are committed and CI-regenerated and diff-checked.
- Any new component state requires token coverage (default/pressed/focus/disabled; hover where applicable).
