# Architecture Review: Design System Flaws

**Date**: 2026-02-11
**Reviewer**: architecture-review
**Scope**: Structural and dependency issues that will prevent Jamie from using this design system effectively

---

## Executive Summary

The design system has **significant architectural issues** that will prevent Jamie from building products effectively. The most critical issue is a mismatch between what packages export vs. what source exists, creating confusion and potential build failures.

---

## Critical Issues

### 1. Source/Build Mismatch in `@design-studio/ui`

**Problem**: `packages/ui/package.json` exports 15+ subpaths (`./base`, `./forms`, `./chat`, `./modals`, etc.) but `packages/ui/src/` only contains:
- `icons/` - Consolidated icon system
- `integrations/` - Apps SDK wrapper layer

**Where are the actual component source files?**

Built files exist in `dist/src/components/ui/` with all expected categories, but the source structure doesn't match. This suggests:
1. Components are generated or transformed during build
2. Source files exist elsewhere
3. The package is in an incomplete migration state

**Why it matters for Jamie**: Jamie cannot:
- Understand how components are built
- Modify or extend components
- Debug component issues
- Learn patterns from source code

**Recommended action**:
1. Investigate build pipeline (`vite.config.ts` in packages/ui)
2. If components are generated from `@openai/apps-sdk-ui`, document this clearly
3. If source exists elsewhere, consolidate into expected location
4. Add a "Component Authoring" guide explaining the architecture

---

### 2. Multiple Packages with No Source Code

**Problem**: These packages have no `src/` directory:
- `packages/widgets/` - Core widget bundling (no source)
- `packages/runtime/` - Host abstraction layer (no source)
- `packages/cli/` - CLI tool (no source)
- `packages/json-render/` - JSON rendering utilities (no source)
- `packages/skill-ingestion/` - Skill ingestion (no source)
- `packages/astudio-icons/` - Deprecated but in workspace (no source)

**Why it matters for Jamie**:
- Cannot modify or understand critical parts of the system
- Unclear what these packages actually do
- Risk of "black box" dependencies

**Recommended action**:
1. Determine if these are:
   - Build-only packages (source is generated)
   - Placeholder packages (not yet implemented)
   - Packages with source in unexpected locations
2. Document each package's purpose and source location
3. Remove deprecated packages from workspace or document deprecation clearly

---

### 3. Deprecated Package Still in Workspace

**Problem**: `@design-studio/astudio-icons` is marked as deprecated (ICON_CONSOLIDATION.md says "COMPLETE") but remains in `pnpm-workspace.yaml`.

**Why it matters for Jamie**:
- Confusing package list (which icon package to use?)
- Potential for accidental use of deprecated package
- Maintenance burden (still being built? still in dependencies?)

**Recommended action**:
1. Remove `packages/astudio-icons` from workspace
2. Update any remaining references to use consolidated icons
3. Add migration note if any consumers still reference it

---

## High Priority

### 4. No CI/CD Pipeline

**Problem**: `.github/workflows/` directory does not exist at repository root.

**Why it matters for Jamie**:
- No automated testing on PRs
- No guarantee that main branch is passing tests
- No automated releases
- Manual process for everything

**Recommended action**:
1. Create GitHub Actions workflows for:
   - PR validation (lint, typecheck, test)
   - Release automation (changesets)
   - Dependency updates security scanning
2. Use `pnpm lint`, `pnpm test`, `pnpm typecheck` in CI

---

### 5. Unclear Platform Application Structure

**Problem**: `platforms/web/apps/web/` and `platforms/web/apps/storybook/` have no visible `src/` directories, only `dist/` and `node_modules/`.

**Why it matters for Jamie**:
- Cannot modify or understand web apps
- Unclear if these are template apps, examples, or production apps
- No way to customize or extend

**Recommended action**:
1. Document the purpose and structure of these apps
2. If source is elsewhere, link to it
3. If these are build-only apps, explain what they're for

---

### 6. Heavy External Dependency on `@openai/apps-sdk-ui`

**Problem**: The UI package wraps `@openai/apps-sdk-ui` extensively (integrations/ layer). This is a strategic choice but creates:
- Version brittleness (Apps SDK breaking changes break everything)
- Inability to fix upstream issues locally
- Unclear API boundaries (what's wrapper vs what's upstream?)

**Why it matters for Jamie**:
- Upstream bugs cannot be quickly patched
- Major version upgrades require significant work
- Learning the wrapper layer adds complexity

**Recommended action**:
1. Document the version safety strategy clearly
2. Pin Apps SDK version and document upgrade process
3. Consider forking or forking+patching for critical fixes

---

## Medium Priority

### 7. Inconsistent Package Organization

**Problem**: Monorepo mixes different types of packages:
- Libraries (`ui`, `tokens`, `runtime`)
- Tools (`cli`)
- Applications (`platforms/web/apps/*`)
- Templates (`cloudflare-template`)
- Prototypes (`validation-prototype`)

**Why it matters for Jamie**:
- Difficult to understand what's what
- Unclear which packages to import in which context
- Risk of importing application code from library packages

**Recommended action**:
1. Consider directory structure reorganization:
   - `packages/libraries/` - Reusable packages
   - `packages/tools/` - CLI and utilities
   - `apps/` - Applications (move from platforms/web/apps/)
   - `templates/` - Templates and examples
2. Or add clear categories in documentation

---

### 8. Missing Root Configuration Files

**Problem**: Expected root configuration files are missing:
- `biome.json` - Linting configuration (scoped to packages?)
- `tsconfig.json` - Root TypeScript config
- `vite.config.ts` - Root Vite config (if needed)
- `tailwind.config.*` - Tailwind config location

**Why it matters for Jamie**:
- Unclear how configurations are organized
- Difficult to modify global settings
- Potential for inconsistent config across packages

**Recommended action**:
1. Document where each configuration lives
2. Add root configs with package extends where appropriate
3. Or explicitly document why configs are package-scoped

---

## Low Priority

### 9. Token Generation Complexity

**Problem**: `packages/tokens/src/generator.ts` is 23KB and complex. Token generation is powerful but requires significant knowledge to modify.

**Why it matters for Jamie**:
- Hard to add new tokens
- Intimidating for contributors
- Risk of breaking token generation

**Recommended action**:
1. Add "Adding Tokens" quick guide
2. Simplify generator if possible
3. Add validation for token modifications

---

### 10. No Architecture Decision Records (ADRs)

**Problem**: No formal ADRs for major decisions (Apps SDK wrapper, icon consolidation, platform strategy).

**Why it matters for Jamie**:
- Difficult to understand "why" behind decisions
- Risk of repeating past mistakes
- Onboarding requires tribal knowledge

**Recommended action**:
1. Add ADRs for major architectural decisions
2. Use `.agent/` EXECPLAN files as seed material
3. Keep ADRs brief and dated

---

## Summary

| Priority | Count | Key Areas |
|----------|--------|------------|
| Critical | 3 | Source/build mismatch, missing sources, deprecated packages |
| High | 3 | CI/CD, platform structure, external deps |
| Medium | 2 | Package organization, missing configs |
| Low | 2 | Token complexity, ADRs |

**Most critical action**: Investigate and resolve the source/build mismatch in `@design-studio/ui`. Without understanding where component source lives, Jamie cannot effectively use or extend this design system.
