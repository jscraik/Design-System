# aStudio Specification Index

**Last updated:** 2026-01-19
**Maintainer:** Jamie Scott Craik (@jscraik)

## Overview

This directory contains all product requirements, technical specifications, and review documents for the aStudio project.

## Specifications by Status

| Status | Documents |
|--------|------------|
| **Active** | Component Creation & Coverage Governance (PRD + Tech Spec) |
| **Review** | Modal Accessibility & Mapbox Token Guard |
| **Reference** | Project Review Report, Adversarial Reviews, Alignment Reports |

## Specifications by Type

### Product Requirements (PRDs)

| Document | Date | Status | Description |
|----------|------|--------|-------------|
| [spec-2026-01-15-component-creation-governance.md](./spec-2026-01-15-component-creation-governance.md) | 2026-01-15 | ✅ Active | Component creation workflow and coverage governance |
| [spec-2026-01-19-modal-a11y-mapbox-token.md](./spec-2026-01-19-modal-a11y-mapbox-token.md) | 2026-01-19 | 🔄 Review | Modal accessibility fixes and Mapbox token guard |

### Technical Specifications

| Document | Date | Status | Description |
|----------|------|--------|-------------|
| [tech-spec-2026-01-15-component-creation-governance.md](./tech-spec-2026-01-15-component-creation-governance.md) | 2026-01-15 | ✅ Active | Implementation details for component governance |

### Review & Audit Documents

| Document | Date | Type | Description |
|----------|------|------|-------------|
| [PROJECT_REVIEW_REPORT.md](./PROJECT_REVIEW_REPORT.md) | 2026-01-15 | Audit | Comprehensive project review and gap analysis |
| [ADVERSARIAL_REVIEW_3RD.md](./ADVERSARIAL_REVIEW_3RD.md) | 2026-01-19 | Review | Third adversarial review challenging findings |
| [ExecPlan.md](./ExecPlan.md) | 2026-01-19 | Plan | Execution plan for spec alignment |

### Alignment Reports

| Document | Date | Coverage | Description |
|----------|------|----------|-------------|
| [SPEC_ALIGNMENT_REPORT-2026-01-19.md](../SPEC_ALIGNMENT_REPORT-2026-01-19.md) | 2026-01-19 | 60% | Baseline spec compliance measurement |

## Specification Lifecycle

1. **Draft** - Initial document created
2. **Review** - Stakeholder review and feedback
3. **Active** - Approved and driving implementation
4. **Reference** - Historical or superseded

## Creating New Specifications

Before creating a new specification document:

1. **Check if an existing spec covers the topic**
   - Review all Active specs
   - Check Reference specs for related work

2. **Use templates from [SPEC_TEMPLATES.md](./SPEC_TEMPLATES.md)**
   - PRD template for product requirements
   - Tech Spec template for implementation details

3. **Follow naming convention:**
   - PRDs: `spec-YYYY-MM-DD-short-title.md`
   - Tech Specs: `tech-spec-YYYY-MM-DD-short-title.md`
   - Must link PRD and Tech Spec

4. **Create corresponding tech spec if implementation details needed**
   - Tech specs should reference the PRD
   - PRDs should not contain implementation details

5. **Link from this index**
   - Add entry to appropriate table
   - Update specification count

## Review Process

See [SPEC_REVIEW_CHECKLIST.md](./SPEC_REVIEW_CHECKLIST.md) for review criteria.

### Review Stages

1. **Self-Review**: Author completes checklist
2. **Peer Review**: Technical reviewer evaluates
3. **Product Review**: Product reviewer evaluates PRD sections
4. **Approval**: All checklists pass
5. **Active**: Document marked as driving implementation

### Review Categories

| Category | Reviewer | Focus |
|----------|----------|-------|
| PRD Content | Product | Problem, personas, user stories, success metrics |
| Technical Design | Engineering | Architecture, APIs, security, performance |
| Operations | SRE | SLOs, runbooks, incident response |
| Accessibility | A11y | WCAG compliance, testing |
| Documentation | Docs | Clarity, completeness, examples |

## Quick Reference

### Component Creation & Parity

- **PRD:** [spec-2026-01-15-component-creation-governance.md](./spec-2026-01-15-component-creation-governance.md)
- **Tech Spec:** [tech-spec-2026-01-15-component-creation-governance.md](./tech-spec-2026-01-15-component-creation-governance.md)
- **Status:** ✅ Active - Driving implementation
- **Implementation Guide:** [docs/guides/COMPONENT_CREATION.md](../docs/guides/COMPONENT_CREATION.md)

### Modal Accessibility & Mapbox Token

- **Spec:** [spec-2026-01-19-modal-a11y-mapbox-token.md](./spec-2026-01-19-modal-a11y-mapbox-token.md)
- **Status:** 🔄 Review
- **Related PR:** ModalDialog implementation

## Metrics

| Metric | Value |
|--------|-------|
| Total PRDs | 2 |
| Total Tech Specs | 1 |
| Active Specs | 2 |
| Review Specs | 1 |
| Reference Docs | 3 |

## Related Documentation

- [docs/guides/COMPONENT_CREATION.md](../docs/guides/COMPONENT_CREATION.md) - Component creation workflow
- [docs/operations/](../docs/operations/) - Operational artifacts (SLOs, runbooks, incident response)
- [docs/architecture/cross-platform-design.md](../docs/architecture/cross-platform-design.md) - Surface coverage tracking
- [CODESTYLE.md](../CODESTYLE.md) - Coding standards

## License

See repository root for license information.
