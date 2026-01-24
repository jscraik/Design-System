# Governance Security & Privacy Requirements

**Owner:** Jamie Scott Craik (@jscraik)  
**Last updated:** 2026-01-24  
**Review cadence:** Every release or monthly (whichever is sooner)

## Purpose

Define security and privacy requirements for design-system governance workflows (RFCs, audits, QA evidence, and release docs).

## Scope

Applies to:
- RFCs (`docs/workflows/RFC_TEMPLATE.md`)
- QA evidence bundles (`docs/operations/QA_EVIDENCE_SCHEMA.md`)
- Audit artifacts (`docs/operations/`)
- Design-system governance docs (`docs/design-system/`)

## Data Classification

- **Public:** High-level design decisions and non-sensitive guidelines.
- **Internal:** QA evidence, audit logs, drift/coverage reports.
- **Confidential:** Anything containing user identifiers, secrets, or operational credentials (must not be stored here).

## Prohibited Content

- API keys, tokens, secrets, or credentials
- User identifiers or PII
- Raw prompts, user content, or logs containing sensitive data

## Access Controls

- Governance artifacts should be editable only by repo maintainers.
- CI artifacts must be stored in access-controlled systems.

## Retention

- QA evidence: retain for at least 30 days.
- Audit artifacts: retain for at least one release cycle.

## Incident Handling

If sensitive data is detected:
- Remove the artifact immediately.
- Rotate any exposed credentials.
- Record the incident in `docs/operations/INCIDENT_RESPONSE.md`.

