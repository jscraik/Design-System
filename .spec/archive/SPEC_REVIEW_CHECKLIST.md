# Specification Review Checklist

**Last updated:** 2026-01-19
**Purpose:** Ensure all specifications meet quality standards before approval

## Doc requirements

- Audience: Specification authors and reviewers
- Scope: Review criteria and acceptance standards
- Non-scope: Spec content itself (see individual specs)
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: As needed

## PRD Review Checklist

### Content Quality

**Problem Statement**
- [ ] Problem is clear and specific
- [ ] Evidence-backed (data, user feedback, analytics)
- [ ] Impact quantified (affected users, frequency)
- [ ] Solution directly addresses problem

**Personas**
- [ ] Specific with real names and pain points
- [ ] Based on research or interviews
- [ ] Include quotes or anecdotes
- [ ] Differentiated from each other

**User Stories**
- [ ] Follow "As a... I want... so that..." format
- [ ] Each story has clear acceptance criteria
- [ ] Acceptance criteria are observable and testable
- [ ] Stories cover edge cases and error states

**Success Metrics**
- [ ] Numeric targets defined
- [ ] Measurement method specified
- [ ] Baseline and target values
- [ ] Timeframe for measurement

**Scope**
- [ ] Explicit IN scope items
- [ ] Explicit OUT of scope items
- [ ] Rationale for exclusions
- [ ] Future work acknowledged

**Dependencies**
- [ ] Internal dependencies listed
- [ ] External dependencies listed
- [ ] Assumptions documented
- [ ] Blockers identified

**Risks**
- [ ] Technical risks identified
- [ ] User adoption risks identified
- [ ] Business risks identified
- [ ] Each risk has mitigation strategy

### Completeness

- [ ] Executive summary answers "what", "why", "who"
- [ ] No technical implementation details (belongs in Tech Spec)
- [ ] All sections filled or marked N/A with explanation
- [ ] Diagrams included (user journey, state model)
- [ ] Open questions documented with owners and due dates

### Alignment

- [ ] Aligns with project vision and goals
- [ ] Consistent with other specifications
- [ ] Conflicts identified and resolved
- [ ] Trade-offs acknowledged

## Tech Spec Review Checklist

### Architecture & Design

- [ ] Architecture is clear and diagrammed (Mermaid)
- [ ] Every stateful component has a state machine
- [ ] Data flow documented
- [ ] Edge cases handled

**API Design**
- [ ] Complete schemas defined
- [ ] Error definitions included
- [ ] Versioning strategy documented
- [ ] Deprecation policy defined

**Data Models**
- [ ] Constraints specified
- [ ] Indexes identified
- [ ] Relationships defined
- [ ] Validation rules documented

### Implementation Details

**Error Handling**
- [ ] Timeouts handled
- [ ] Retry logic defined
- [ ] Idempotency ensured
- [ ] Error messages actionable

**Performance**
- [ ] Performance targets numeric and measurable
- [ ] Bottlenecks identified
- [ ] Optimization strategies documented
- [ ] Load testing plan included

**Observability**
- [ ] Logging strategy defined
- [ ] Metrics identified
- [ ] Dashboards specified
- [ ] Alerts configured

**Deployment**
- [ ] Deployment process repeatable
- [ ] Rollback procedure documented
- [ ] Feature flags considered
- [ ] Migration plan included

### Operational Readiness

- [ ] SLOs defined with targets
- [ ] Measurement method specified
- [ ] Runbook covers common operations
- [ ] Incident response procedures defined
- [ ] Capacity planning considered

### Non-Functional Requirements

- [ ] Performance requirements specified
- [ ] Security requirements addressed
- [ ] Compliance requirements met (WCAG, etc.)
- [ ] Reliability/availability targets set
- [ ] Scalability considerations documented

## General Checklist

### Documentation Quality

- [ ] Writing is clear and concise
- [ ] No undefined acronyms or jargon
- [ ] Code examples are accurate
- [ ] Links to related docs work
- [ ] Diagrams are readable and accurate
- [ ] Grammar and spelling checked

### Process

- [ ] Spec reviewed by required stakeholders
- [ ] Feedback incorporated or addressed
- [ ] Open questions resolved or documented
- [ ] Approval received before implementation

### Sign-Off

- [ ] Spec owner: _________________ Date: _______
- [ ] Technical reviewer: _________________ Date: _______
- [ ] Product reviewer: _________________ Date: _______
- [ ] Operations reviewer: _________________ Date: _______

---

## Review Severity

Findings categorized by severity:

| Severity | Description | Example |
|----------|-------------|---------|
| **Blocker** | Must fix before approval | Missing critical section, infeasible requirements |
| **Major** | Should fix before implementation | Ambiguous requirements, missing error handling |
| **Minor** | Nice to have improvements | Typos, unclear wording, missing examples |
| **Suggestion** | Optional enhancements | Better diagrams, additional context |

## Review Process

### 1. Self-Review

Author completes checklist first.

**Goal:** Catch obvious issues before peer review.

**Time:** 30-60 minutes

### 2. Peer Review

Technical reviewer evaluates against checklist.

**Goal:** Ensure technical soundness and completeness.

**Time:** 60-90 minutes

**Output:** List of findings with severity

### 3. Product Review

Product reviewer evaluates PRD sections.

**Goal:** Ensure product requirements are well-defined.

**Time:** 30-60 minutes

**Output:** List of findings with severity

### 4. Approval

All checklists pass, document marked "Active".

**Goal:** Formal approval to begin implementation.

**Time:** 15 minutes

### 5. Reference

Move to reference status when superseded.

**Goal:** Archive historical specs.

**Time:** 5 minutes

## Common Findings

### PRD Common Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| Vague problem statement | Blocker | Add data, quantify impact |
| Missing acceptance criteria | Major | Add observable criteria for each user story |
| Success metrics not numeric | Major | Add specific targets and measurements |
| Technical details in PRD | Minor | Move to Tech Spec |
| Missing edge cases | Major | Add error states and edge cases to user stories |

### Tech Spec Common Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| Missing error handling | Blocker | Add error handling for all operations |
| No SLOs defined | Major | Add SLOs with targets |
| Unclear architecture | Blocker | Add Mermaid diagram |
| Missing rollback procedure | Major | Document rollback steps |
| No migration plan | Major | Add migration strategy |

## Templates

See [SPEC_TEMPLATES.md](./SPEC_TEMPLATES.md) for:
- PRD template
- Tech Spec template

## Related Documentation

- [SPEC_INDEX.md](./SPEC_INDEX.md) - Index of all specifications
- [ExecPlan.md](./ExecPlan.md) - Execution plan examples
- [CODESTYLE.md](../CODESTYLE.md) - Coding standards

## License

See repository root for license information.
