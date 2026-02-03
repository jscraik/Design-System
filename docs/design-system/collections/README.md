# Design System Collections

Last updated: 2026-01-31

## Purpose

This directory documents how design tokens flow from Figma to code through a structured Brand → Alias → Mapped pipeline. These rules ensure consistency between design and implementation.

## Collection Rules

- [Brand Collection Rules](./brand-collection-rules.md) – Raw token values (colors, spacing, typography, radius, shadows) sourced from design
- [Alias Collection Rules](./alias-collection-rules.md) – Semantic path mappings that provide stable references to Brand tokens
- [Mapped Collection Rules](./mapped-collection-rules.md) – Usage slots (`--background`, `--foreground`, `--radius-md`, etc.) consumed by UI components
- [Responsive Collection Rules](./responsive-collection-rules.md) – Typography and spacing scales across breakpoints

## Start Here

**For designers:**
- Read [Figma Variables Contract](./figma-variables-contract.md) to learn how to author variables that export correctly to code
- Follow the [Figma Export Guide](../../../packages/tokens/docs/FIGMA_EXPORT_GUIDE.md) for step-by-step export instructions

**For developers:**
- Review the [Figma Variables Contract](./figma-variables-contract.md) to understand the mapping from Figma paths to DTCG keys
- Reference individual collection rules docs for implementation details

## Designer Checklist

When adding or updating design tokens:

1. **Follow naming conventions** – Use slash-separated paths (e.g., `color/background/light/primary`, `space/s16`, `type/web/hero/size`)
2. **Ensure modes parity** – All color tokens must exist across Light, Dark, and HighContrast modes with matching keys
3. **Export to DTCG** – Use Tokens Studio or Design Tokens plugin to export variables as DTCG JSON
4. **Run regen command** – Execute `pnpm --filter @design-studio/tokens generate` to update foundations.css and Tailwind preset
5. **Run validation tests** – Execute `packages/tokens/tests/token-validation.test.ts` to verify token integrity

## Developer Checklist

When integrating design token changes:

1. **Confirm DTCG changes** – Review `packages/tokens/src/tokens/index.dtcg.json` for new or modified tokens
2. **Update alias map** – Modify `packages/tokens/src/alias-map.ts` and validators/tests as needed for new token paths
3. **Regenerate outputs** – Run `pnpm --filter @design-studio/tokens generate` to update foundations.css and Tailwind preset
4. **Verify theme mappings** – Check `packages/ui/src/styles/theme.css` for any new usage slots required
5. **Run validation tests** – Execute `packages/tokens/tests/token-validation.test.ts` to verify token integrity

---

## Repository Setup

Repo-local Codex rules are applied via a `.rules` file at the repository root:

```bash
include: ./codex/rules/design-system.rules
```

## Note on Typography

Typography metrics (sizes, line-heights, tracking) live in `foundations.css` and the Tailwind preset. Text color slots (`--text-hero`, `--text-body`, etc.) live in `theme.css`. These are separate layers: metrics define structural typography, while color slots define thematic text colors.