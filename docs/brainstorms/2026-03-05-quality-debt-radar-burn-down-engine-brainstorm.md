---
date: 2026-03-05
topic: quality-debt-radar-burn-down-engine
---

# Quality Debt Radar + Burn-down Engine

## What We’re Building
A single, trusted quality-debt visibility layer that turns currently hidden debt into explicit, trendable risk for maintainers and release owners.

The initiative focuses on debt that currently passes CI but still creates product and release risk (for example suppressed lint/a11y rules, disabled CSS lint coverage, and drift-prone integration seams). The output is a weekly burn-down view that shows whether risk is decreasing, flat, or worsening across the highest-impact debt categories. The goal is not to “boil the ocean,” but to make risk legible and reduce it steadily with small, repeatable improvements.

## Why This Approach
We considered three directions: (A) Quality Debt Radar + Burn-down Engine, (B) risk-tiered gate simplification, and (C) governance compiler.

Approach A is selected because it best matches the primary success criterion: **risk visibility + measurable reduction** by mid-2026. It is the most YAGNI-aligned path: start with visibility and trend accountability first, then tighten enforcement over time. Existing repo patterns already support this direction (evidence schema, policy checks, coverage/a11y contract docs, and risk-tier governance), so this is a low-friction, high-leverage next move.

## Key Decisions
- **Decision 1: Optimize for risk visibility + reduction, not gate expansion first.**
- **Decision 2: Primary audience is maintainers + release owners.**
- **Decision 3: Use weekly burn-down slices as the default cadence.**
- **Decision 4: Roll out as warn-first, then progressively tighten.**
- **Decision 5: Track debt as explicit categories (lint/a11y/CSS lint gaps/integration drift), not one aggregate number.**
- **Decision 6: Reuse existing governance artifacts as anchors (QA evidence schema, policy checks, coverage matrix, a11y contracts, harness risk tiers).**

## Resolved Questions
- **Portfolio scope:** Full portfolio (5+) was requested, but this document locks the flagship initiative first.
- **Anchor pain area:** Quality debt burn-down.
- **Success orientation:** Risk visibility + reduction.
- **Change appetite:** Balanced portfolio (small wins plus one medium bet).
- **Preferred lever:** Automation + guardrails.
- **Selected approach:** Approach A (Debt Radar + Burn-down Engine).
- **Primary audience:** Maintainers + release owners.
- **Cadence:** Weekly slices.
- **Initial enforcement:** Warn-first, then tighten.

## Open Questions
- None for brainstorming stage.

## Validation Notes
- Repo-research-analyst task failed due model quota: "You've hit your usage limit for GPT-5.3-Codex-Spark."
- Smallest safe fix applied: completed lightweight repository scan directly from local sources (`FORJAMIE.md`, `biome.json`, `harness.contract.json`, `docs/operations/QA_EVIDENCE_SCHEMA.md`, `.github/workflows/release-guidance.yml`, and relevant scripts/docs).

## Next Steps
→ `/prompts:workflow-plan` to define rollout phases, ownership, and implementation sequencing.
