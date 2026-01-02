# Template Demos

Interactive demo surfaces used by Storybook and documentation pages. Each demo should be a self-contained example that exercises a template or block in realistic UI states.

## Conventions
- Folder + file names use `PascalCase` (e.g. `TemplateFieldGroupDemo/TemplateFieldGroupDemo.tsx`).
- Prefer labeled form controls (`aria-label`, `htmlFor`) for accessibility.
- Keep demo data in the component unless it is shared; then place it in `packages/ui/src/fixtures/`.
