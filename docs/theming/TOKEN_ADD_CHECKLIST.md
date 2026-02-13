# Token Add Checklist

**Owner:** Jamie Scott Craik (@jscraik)  
**Last updated:** 2026-01-24

## Checklist

- [ ] Add new token to DTCG source: `packages/tokens/src/tokens/index.dtcg.json`
- [ ] Run `pnpm generate:tokens`
- [ ] Run `pnpm validate:tokens`
- [ ] Verify outputs in `packages/tokens/src/tokens.css` and `packages/tokens/src/foundations.css`
- [ ] Update any usage docs if new semantic roles are introduced

## Do not

- Do not hardcode token values in component CSS.
- Do not bypass token generation outputs.
