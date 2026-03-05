---
date: 2026-03-05
topic: onboarding-command-center
---

# Onboarding Command Center (Humans + AI Agents)

## What We’re Building
A single, canonical onboarding experience that gets a new human contributor or AI coding agent to first meaningful success in 15 minutes.

This initiative unifies today’s fragmented guidance into one entrypoint with task-based routes instead of repo-map-first navigation. The MVP focuses on three high-frequency jobs: (1) add a token safely, (2) ship/update a widget, and (3) verify MCP integration. It also defines one deterministic “agent entry checklist” so agents can execute consistently without guessing which docs are current.

## Why This Approach
We considered three paths: (A) Onboarding Command Center, (B) policy-first expansion of guidance tooling, and (C) quality-gate recovery first.

Approach A is selected because the goal is adoption speed in a 30-day horizon. It delivers immediate user value while still creating a foundation for later policy hardening and phased rule re-enablement. It applies YAGNI by avoiding broad governance redesign up front and instead concentrating on the shortest path to successful outcomes.

## Key Decisions
- **Decision 1: Optimize for first success, not full governance coverage.** Rationale: 30-day MVP and adoption-speed goal.
- **Decision 2: One canonical onboarding entrypoint.** Rationale: reduce doc drift/confusion from multiple “start here” paths.
- **Decision 3: Task-based routes over repo-based routes.** Rationale: users think in jobs-to-be-done (token/widget/MCP).
- **Decision 4: Deterministic agent checklist included in the same flow.** Rationale: human and agent parity improves reliability.
- **Decision 5: Keep policy/rule expansion as a follow-on track.** Rationale: avoid over-scoping the MVP.

## Resolved Questions
- **Scope:** Umbrella initiative.
- **Primary objective:** Adoption speed.
- **Delivery horizon:** 30 days.
- **Primary KPI:** First meaningful success in 15 minutes.
- **Preferred approach:** Onboarding Command Center.

## Open Questions
- None for brainstorming stage.

## Next Steps
→ `/prompts:workflow-plan` for implementation planning and sequencing.
