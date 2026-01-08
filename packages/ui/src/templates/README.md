# Templates

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Templates are higher-level UI compositions built from the base components and blocks. They are used by the web app, Storybook, and widget previews to demonstrate full-screen layouts and complex flows.

## Structure
- `<TemplateName>/` — full templates (PascalCase folder + file)
- `blocks/` — reusable template blocks (header, field group, panels, etc.)
- `demos/` — interactive demos for Storybook docs
- `registry.ts` — template registry for the templates gallery
- `index.ts` — public template exports

## Adding a new template
1. Create `packages/ui/src/templates/<TemplateName>/<TemplateName>.tsx`
2. Add a Storybook story alongside the template if needed.
3. Export from `index.ts` and register in `registry.ts` for gallery visibility.
