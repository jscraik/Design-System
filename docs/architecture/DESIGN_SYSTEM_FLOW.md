# Design System Flow

**Owner:** Jamie Scott Craik (@jscraik)  
**Last updated:** 2026-01-24

```mermaid
flowchart LR
  A[DTCG tokens\npackages/tokens/src/tokens/index.dtcg.json] --> B[Foundation vars (Brand)\npackages/tokens/src/foundations.css]
  B --> C[Semantic aliases (Alias)\npackages/tokens/src/aliases.css]
  C --> D[Theme mapping + Tailwind v4 @theme (Mapped)\npackages/ui/src/styles/theme.css]
  D --> E[UI components\npackages/ui/src/components/**]
  E --> F[Apps\nplatforms/web/apps/web + widgets + storybook]
```

Notes:
- Tokens remain the source of truth; UI uses utilities mapped via `@theme inline`.
- Apps import Tailwind and token CSS at the entry stylesheet.
