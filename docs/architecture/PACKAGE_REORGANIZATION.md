# Package Reorganization Proposal

Clarify package organization by type and purpose.

---

## Current Issues

The monorepo mixes different package types in `packages/`:
- Libraries (`ui`, `tokens`, `runtime`)
- Tools (`cli`)
- Applications (implicit, no clear app packages)
- Templates (`cloudflare-template`)
- Prototypes (`validation-prototype`)

This makes it hard to understand:
- What to import for library usage
- What to run for development
- What packages are maintained vs deprecated

---

## Proposed Structure

```
design-system/
├── packages/                    # Reusable libraries only
│   ├── ui/                  # Component library
│   ├── tokens/               # Design tokens
│   ├── runtime/              # Host abstraction
│   └── json-render/          # JSON utilities
│
├── apps/                        # Applications (moved from platforms/)
│   ├── web/                  # Web application
│   └── storybook/            # Component documentation app
│
├── tools/                       # Developer tools (moved from packages/)
│   └── cli/                  # Design system CLI
│
└── templates/                   # Starter templates (moved from packages/)
    └── cloudflare/          # Cloudflare Workers template
```

---

## Migration Steps

### Phase 1: Create New Directories (No-op)

```bash
# Just create structure, don't move yet
mkdir -p apps tools templates
```

### Phase 2: Move Applications

```bash
# Move web apps to new location
git mv platforms/web/apps apps
```

### Phase 3: Move CLI

```bash
git mv packages/cli tools/cli
```

### Phase 4: Move Templates

```bash
git mv packages/cloudflare-template templates/cloudflare
```

### Phase 5: Update Paths

Update all import paths and scripts to reference new locations:
- `pnpm -C apps/web` → `pnpm -C apps/web dev`
- `pnpm -C platforms/web/apps/storybook` → `pnpm -C apps/storybook dev`
- Update README and documentation
- Update CI workflow paths

### Phase 6: Clean Empty Directories

```bash
# Remove old empty directories
rm -rf platforms/web/apps
# (After verification) rm -rf platforms/web
```

---

## Benefits

| Issue | Before | After |
|--------|----------|--------|
| Can't find apps | Hidden in `platforms/web/apps/` | Top-level `apps/` |
| Unclear what's library vs app | All in `packages/` | Separated by type |
| Script confusion | `dev:web` vs `dev:storybook` | Clearer paths needed |
| Templates mixed with libs | All in `packages/` | Separate `templates/` |

---

## Alternative: Minimal Change

If full reorganization is too disruptive, a minimal alternative:

**Just rename `platforms/web/apps/` → `apps/`:

```bash
git mv platforms/web/apps apps
```

And update scripts to reference `apps/` instead of `platforms/web/apps/`.

This preserves most of the structure while making apps more discoverable.

---

## Recommendation

**Start with minimal change** (just `apps/` rename), evaluate benefits, then proceed with full reorganization if desired.

Full reorganization is a breaking change that requires:
- Updating all CI/CD workflows
- Updating all documentation
- Updating README
- Coordinating with team

Do this as a dedicated project with clear communication.
