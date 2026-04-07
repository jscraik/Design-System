# Agent-First Status Matrix

## Overview

This document tracks the migration status of design-system workflows to agent-first (autonomous) execution modes.

## Status Matrix

| Workflow | Current Mode | Target Mode | Status | Blockers |
|----------|--------------|-------------|--------|----------|
| PR Pipeline | GitHub Actions | CircleCI | 🟡 In Progress | Signing key required |
| Drift Gate | Shadow | Enforced | 🟡 Baseline seeded | - |
| CodeRabbit | Active | Active | 🟢 Complete | - |
| Memory Gate | Local | CI-integrated | 🟡 Configured | - |
| Preflight Gate | Local | CI-integrated | 🟢 Complete | - |

## Legend

- 🟢 Complete: Fully operational in target mode
- 🟡 In Progress: Partially migrated, known blockers
- 🔴 Blocked: Cannot proceed without external dependencies
- ⚪ Not Started: Awaiting prioritization

## Migration Checklist

### Phase 1: Baseline
- [x] Seed drift-gate baseline
- [x] Configure CodeRabbit integration
- [x] Validate harness.contract.json

### Phase 2: CI Migration
- [ ] Complete CircleCI migration (requires HARNESS_CI_MIGRATE_SIGNING_KEY)
- [ ] Update branch protection rules
- [ ] Validate check alignment

### Phase 3: Enforcement
- [ ] Enable drift-gate enforcement mode
- [ ] Activate memory gate in CI
- [ ] Full agent-first workflow

## Related Documents

- [WORKFLOW.md](../../WORKFLOW.md) - Symphony workflow configuration
- [harness.contract.json](../../harness.contract.json) - Governance contract
- [.harness/ci-required-checks.json](../../.harness/ci-required-checks.json) - Required checks manifest

## Last Updated

2026-04-07
