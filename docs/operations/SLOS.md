# Service Level Objectives (SLOs)

**Owner:** Jamie Scott Craik (@jscraik)
**Last updated:** 2026-01-19
**Review cadence:** Quarterly

## Doc requirements

- Audience: Operators and maintainers
- Scope: Operational steps and verification
- Non-scope: Long-form design history
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Quarterly

## Overview

This document defines SLOs for the aStudio widget delivery pipeline and MCP server integration.

## SLO Targets

| Service | Metric | Target | Measurement Window |
|---------|--------|--------|-------------------|
| MCP Server | Availability | 99.5% | Monthly |
| MCP Server | P95 Latency (local) | ≤500ms | 30 days |
| MCP Server | P95 Latency (remote) | ≤1.5s | 30 days |
| Widget Build | P95 Build Time | ≤5 min | 30 days |
| Widget Bundle | P95 Bundle Size | ≤250 KB gzipped | Per build |
| CI Pipeline | Pass Rate | ≥95% | Weekly |
| Visual Tests | Pass Rate | ≥95% | 30 days |

## Error Budget Policy

### Availability Error Budget

- **Target:** 99.5% availability = 0.5% error budget
- **Window:** 30 days rolling
- **Burn rate alerting:** Alert when 50% burned in 7 days
- **Gates:**
  - Pause releases at 75% burn
  - Rollback at 100% burn

### Latency Error Budget

- **P95 Target:** 500ms local, 1.5s remote
- **Alert when:** P95 exceeds target for >10% of requests over 1 hour

## Measurement Sources

- **Availability:** MCP server uptime logs, CI build success rate
- **Latency:** Tool execution logs with timestamps
- **Build time:** CI build logs
- **Bundle size:** `pnpm build:widgets` artifact analysis
- **Test pass rate:** CI test reports

## SLO Owner Responsibilities

1. Monitor dashboards daily
2. Respond to alerts within 1 hour during business hours
3. Post-incident review within 48 hours of SLO-violating incident
4. Quarterly SLO review and adjustment

## Service Definitions

### MCP Server

**Purpose:** Provides widget tools to ChatGPT integration

**Availability Calculation:**
```
Availability = (Successful Requests / Total Requests) × 100%
```

**Success Criteria:**
- Server responds to tool invocations
- Response time within P95 target
- No data corruption

### Widget Build Pipeline

**Purpose:** Generates distributable widget bundles

**Build Time Calculation:**
```
P95 Build Time = 95th percentile of build durations over 30 days
```

**Success Criteria:**
- Build completes without errors
- Output files are valid
- Build time ≤5 minutes

### Widget Bundle Size

**Purpose:** Ensures widgets remain lightweight

**Bundle Size Calculation:**
```
P95 Bundle Size = 95th percentile of bundle sizes (gzipped)
```

**Success Criteria:**
- Individual widget ≤250 KB gzipped
- Total bundle size ≤1 MB gzipped

### CI Pipeline

**Purpose:** Validates all changes before merge

**Pass Rate Calculation:**
```
Pass Rate = (Successful CI Runs / Total CI Runs) × 100%
```

**Success Criteria:**
- All tests pass
- Linting passes
- Build completes successfully

### Visual Tests

**Purpose:** Prevents visual regressions

**Pass Rate Calculation:**
```
Pass Rate = (Passing Visual Tests / Total Visual Tests) × 100%
```

**Success Criteria:**
- No unintended visual changes
- Playwright screenshots match baselines

## Alerting

### Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Availability | <99.8% | <99.5% |
| P95 Latency | >400ms | >500ms |
| Build Time | >4 min | >5 min |
| Bundle Size | >240 KB | >250 KB |
| CI Pass Rate | <97% | <95% |
| Visual Test Pass Rate | <97% | <95% |

### Response Times

- **Critical:** Within 15 minutes (business hours)
- **Warning:** Within 1 hour (business hours)

## Reporting

### Monthly SLO Report

At the end of each month, generate a report including:

1. **SLO Performance:**
   - Availability percentage
   - P95 latency
   - Build time statistics
   - Bundle size trends
   - Test pass rates

2. **Error Budget Status:**
   - Current burn rate
   - Remaining budget
   - Time until exhaustion

3. **Incidents:**
   - Number of SLO-violating incidents
   - Root causes
   - Remediation actions

4. **Trends:**
   - Month-over-month changes
   - Seasonal patterns
   - Emerging issues

## Related Documentation

- [RUNBOOK.md](./RUNBOOK.md) - Operational procedures
- [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) - Incident procedures
- [.spec/tech-spec-2026-01-15-component-creation-governance.md](../../.spec/tech-spec-2026-01-15-component-creation-governance.md) - Technical specification with SLO details
- [RUNBOOK.md](./RUNBOOK.md#telemetry-data-governance) - Telemetry data governance
- [a11y-audit-template.md](./a11y-audit-template.md) - Accessibility audit evidence template

## License

See repository root for license information.

## Risks and assumptions

- **Assumptions:** CI infrastructure is stable, measurement tools are accurate
- **Failure modes:** CI outages affect all metrics, network issues affect latency measurements
- **Rollback or recovery:** Revert last deployment, restore from backups

## Verify

- **SLOs are measurable:** Each SLO has defined measurement source
- **SLOs are achievable:** Targets based on historical performance
- **SLOs are actionable:** Each SLO has clear remediation steps

## Troubleshooting

### SLO not being met

1. Check measurement source for errors
2. Verify calculation methodology
3. Review recent changes for impact
4. Consult incident history for patterns

### Error budget exhausted

1. Pause all releases immediately
2. Identify root cause of incidents
3. Implement fixes
4. Gradually resume releases with monitoring
