# Template Demos

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Interactive demo surfaces used by Storybook and documentation pages. Each demo should be a self-contained example that exercises a template or block in realistic UI states.

## Conventions
- Folder + file names use `PascalCase` (e.g. `TemplateFieldGroupDemo/TemplateFieldGroupDemo.tsx`).
- Prefer labeled form controls (`aria-label`, `htmlFor`) for accessibility.
- Keep demo data in the component unless it is shared; then place it in `packages/ui/src/fixtures/`.
