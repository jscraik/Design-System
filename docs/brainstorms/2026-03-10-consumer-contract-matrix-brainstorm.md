---
title: Consumer Contract Matrix
date: 2026-03-10
status: draft
spec_required: lite
risk_level: medium
complexity: medium
---

# Consumer Contract Matrix

## Table of Contents

- [What We're Building](#what-were-building)
- [Why It Matters](#why-it-matters)
- [Problem Statement](#problem-statement)
- [Options Considered](#options-considered)
- [Chosen Approach](#chosen-approach)
- [Key Decisions](#key-decisions)
- [Resolved Questions](#resolved-questions)
- [Constraints / Non-Goals](#constraints--non-goals)
- [Success Criteria](#success-criteria)
- [Open Questions](#open-questions)
- [Recommended Next Step](#recommended-next-step)

## What We're Building

A consumer-facing contract artifact for the design system that proves the supported downstream adoption path works across a small set of representative consumer surfaces inside this repo.

The first version should:

- define the supported consumer contract in one place
- map that contract to a small matrix of consumer surfaces
- attach required checks and evidence to each matrix row
- make unsupported adoption paths explicit

This is not a generic quality dashboard. It is a repo-first proof layer for downstream consumption of `@design-studio/ui`, `@design-studio/tokens`, and `@design-studio/runtime`.

## Why It Matters

The repo now documents the correct public adoption path, but it still relies too heavily on documentation and maintainer knowledge. There is no single artifact that proves the supported contract actually works for downstream consumers across web, widget, and desktop-style usage.

That gap matters because:

- the repo already distinguishes supported and unsupported install modes
- the design system is meant to work across multiple surfaces
- downstream confidence is weakest at package boundaries, CSS entrypoints, and host wiring
- the repo already has matrix, policy, drift, and onboarding patterns that can support this feature

## Problem Statement

Today, the design-system repo can describe how consumers should adopt the system, but it cannot yet prove that supported adoption paths remain valid across representative project types.

This creates four practical risks:

1. docs can drift away from real package behavior
2. consumer breakage is discovered late, often outside this repo
3. supported versus unsupported adoption paths are not enforced consistently
4. onboarding confidence depends on manual interpretation instead of evidence

## Options Considered

### Option 1: Static contract document only

Describe the supported consumer paths, required imports, install modes, and validation commands in a new canonical document.

Pros:

- fastest to ship
- low implementation risk
- improves clarity immediately

Cons:

- still relies on trust rather than proof
- does not catch regressions
- duplicates information already present across README, adoption docs, and package metadata

Best fit:

- if the goal is purely documentation cleanup

### Option 2: Repo-first Consumer Contract Matrix with evidence-backed example consumers

Add a matrix artifact that lists supported consumer surfaces, install modes, required public entrypoints, and validation expectations, backed by a small number of repo-owned consumer examples and checks.

Pros:

- directly proves the adoption contract
- fits existing matrix and QA-evidence patterns
- gives maintainers and consumers one shared source of truth
- creates a stable foundation for later cross-repo expansion

Cons:

- requires some new examples and validation wiring
- increases maintenance surface slightly
- needs careful scope control to avoid turning into a giant platform test harness

Best fit:

- when the goal is pragmatic, high-confidence downstream adoption

### Option 3: Cross-repo adoption program from day one

Build the matrix and immediately apply it to external repos, likely through `@brainwav/design-system-guidance` plus shared CI/reporting.

Pros:

- strongest eventual signal
- validates real-world consumption quickly
- pushes conformance across the ecosystem

Cons:

- higher coordination cost
- harder to define failure ownership
- adds rollout risk before the contract is stable

Best fit:

- once the repo-first contract has already been proven internally

## Chosen Approach

Choose Option 2: a repo-first Consumer Contract Matrix backed by a small set of example consumer surfaces and evidence-linked validation.

This is the smallest approach that turns adoption guidance into something provable without prematurely turning the repo into a multi-repo platform program.

The matrix should be treated as a consumer contract ledger, not just a test list. Each row should answer:

- what surface is being validated
- which install mode is supported
- which public entrypoints are allowed
- which checks prove that row is healthy
- whether that row is fresh, stale, or unavailable

## Key Decisions

- The first release is repo-first, not ecosystem-wide.
- The matrix should extend the repo's existing matrix pattern instead of inventing a new reporting model.
- The contract must use public package boundaries only:
  - `@design-studio/ui`
  - `@design-studio/tokens`
  - `@design-studio/runtime`
  - public stylesheet entry `@design-studio/ui/styles.css`
- Unsupported paths must be explicit, including raw `file:` installs and internal stylesheet subpaths.
- The matrix should include evidence requirements, not just status labels.
- The guidance package is an enforcement hook, but not the whole feature.
- Freshness matters: stale evidence should not be allowed to look healthy.

## Resolved Questions

- **Which idea are we brainstorming?**
  - Consumer Contract Matrix.
- **What is the rollout scope for v1?**
  - This repo first.
- **Should this be framed as a new subsystem?**
  - No. It should extend existing matrix, onboarding, and QA-evidence patterns.
- **Where should the matrix live?**
  - Under `docs/design-system/` alongside the existing contract and coverage-matrix artifacts.
- **How should freshness be modeled in v1?**
  - Use dated evidence references from the start, not labels alone.
- **Which surfaces should v1 include?**
  - Web, widget, and a lightweight desktop-shell row, with confidence allowed to vary by row.

## Constraints / Non-Goals

### Constraints

- Focus on supported consumer paths only.
- Reuse existing repo conventions where possible:
  - coverage matrix patterns
  - onboarding parity and outcome checks
  - QA evidence expectations
  - guidance-package enforcement hooks
- Keep the first version small enough to maintain comfortably.

### Non-Goals

- Not a general-purpose cross-repo governance platform in v1.
- Not a replacement for the existing coverage matrix.
- Not a full implementation plan for example apps or CI details.
- Not a redesign of package exports, bundling, or Apps SDK migration policy.
- Not a guarantee that every downstream repo is immediately covered.

## Success Criteria

- A canonical brainstorm-backed contract exists for how the design system proves downstream adoption.
- The first version defines a small matrix of representative consumer surfaces inside this repo.
- Each matrix row includes:
  - supported install mode
  - required public entrypoints
  - required validation checks
  - evidence status or freshness state
  - a dated evidence reference
- The feature makes unsupported paths explicit instead of leaving them implicit.
- Maintainers can answer "is the supported consumer path still valid?" from one artifact.
- The feature creates a clean handoff point for future external-repo expansion.

## Open Questions

- None at the brainstorm level. Remaining questions belong in spec work, not feature definition.

## Recommended Next Step

Create a lite spec before planning.

Why:

- this feature crosses docs, validation, onboarding, package-boundary policy, and example-consumer surfaces
- the artifact shape and ownership boundaries matter
- success depends on choosing the right matrix schema, evidence model, and row confidence semantics before implementation

Recommended classification:

- `spec_required: lite`
- `risk_level: medium`
- `complexity: medium`

Suggested next artifact:

- `/prompts:workflow-spec` using this brainstorm as the input
