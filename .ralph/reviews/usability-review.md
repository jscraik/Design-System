# Usability Review: Design System Flaws

**Date**: 2026-02-11
**Reviewer**: usability-review
**Scope**: Developer experience, onboarding, and API ergonomics

---

## Executive Summary

The design system has **moderate usability issues**. Onboarding is possible but documentation references non-existent files. The package export structure is complex, and discoverability is challenging for someone with Jamie's cognitive profile (low verbal memory, high visual memory).

---

## Critical Issues

### 1. QUICK_START References Non-Existent Documentation

**Problem**: `docs/QUICK_START.md` "Next Steps" section references:
- `docs/architecture/README.md` - Does not exist
- `docs/components/README.md` - Does not exist
- `docs/templates/README.md` - Does not exist

**Why it matters for Jamie**:
- Following "Next Steps" leads to 404s
- Creates frustration during onboarding
- Wastes time hunting for correct paths

**Recommended action**: Update QUICK_START.md "Next Steps" to reference actual files or create missing README hubs.

---

### 2. Component Exports Are Not Discoverable

**Problem**: `@design-studio/ui` exports 15+ subpaths with no clear way to discover what's in each without reading package.json.

**Why it matters for Jamie** (divided attention, low working memory):
- Requires holding mental map of what's where
- Forces constant reference to package.json
- Slow trial-and-error to find components

**Recommended action**: Create a Component Catalog with "What's Where" guide showing visual grouping of components by export path.

---

## High Priority

### 3. No Central Component Documentation

**Problem**: No single place to see all available components, props, variants, and usage examples.

**Why it matters for Jamie**:
- Must run dev server to see components
- Can't browse offline
- No searchable reference

**Recommended action**: Add component overview table in docs showing component name, export path, status, and notes.

---

### 4. API Inconsistency Potential

**Problem**: With both `@openai/apps-sdk-ui` (via integrations/) and direct Radix UI imports, API patterns may be inconsistent.

**Why it matters for Jamie**:
- Unpredictable component behavior
- Constant context-switching between patterns
- Hard to develop muscle memory

**Recommended action**: Document wrapper components clearly and establish consistent pattern.

---

### 5. Error Messages Not Documented

**Problem**: No documentation of common errors and their solutions.

**Why it matters for Jamie** (inhibitory control challenges):
- Error messages are abstract and vague
- No clear remediation steps
- Causes anxiety and wasted time

**Recommended action**: Add "Troubleshooting" section to QUICK_START.md with common errors, fixes, and prevention tips.

---

## Medium Priority

### 6. Token Usage Not Self-Evident

**Problem**: Tokens are well-structured but no visual examples or "How to use" guide.

**Why it matters for Jamie** (high visual memory, low verbal memory):
- Verbal descriptions of tokens are ineffective
- Needs visual reference to remember which token does what

**Recommended action**: Create visual token reference in Storybook with "Using Tokens" guide.

---

### 7. CLI Not Self-Documenting

**Problem**: `pnpm astudio` runs CLI but no `--help` flag documentation exists.

**Why it matters for Jamie**:
- Must read source to understand CLI (but CLI source doesn't exist)
- Fear of breaking something with unknown commands

**Recommended action**: Add CLI command reference to docs.

---

### 8. No "Hello World" Example

**Problem**: QUICK_START gets to `pnpm dev` but doesn't show how to import/use components.

**Why it matters for Jamie**:
- Gap between "running server" and "using in project"
- Unclear how to actually consume the design system

**Recommended action**: Add "Your First Component" section with import patterns and minimal working example.

---

## Summary

**Most critical action**: Fix QUICK_START.md "Next Steps" to reference actual documentation files.

**Best quick win**: Add a visual component catalog table showing what components exist and where to import them from.
