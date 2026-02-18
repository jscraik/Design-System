# Incident Response Guide

**Owner:** Jamie Scott Craik (@jscraik)
**Last updated:** 2026-01-19

## Doc requirements

- Audience: Operators and maintainers
- Scope: Operational steps and verification
- Non-scope: Long-form design history
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Quarterly

## Severity Levels

| Severity | Description | Example | Response Time |
|----------|-------------|---------|---------------|
| **SEV-1** | Complete service outage | MCP server down, all widgets failing | Immediate (within 15 min) |
| **SEV-2** | Significant degradation | >50% of widgets failing, high error rate | Within 1 hour |
| **SEV-3** | Minor issues | Single widget failing, some errors | Within 4 hours |
| **SEV-4** | Cosmetic issues | Visual regressions, minor bugs | Next business day |

## Incident Lifecycle

### 1. Detection

**Sources:**
- CI failures
- User reports
- Monitoring alerts
- SLO violations

**Action:**
1. Acknowledge incident
2. Assign severity level
3. Create incident channel/note

```bash
# Start incident note
echo "INCIDENT-$(date +%Y%m%d-%H%M%S)" > incident.txt
echo "Severity: [SEV-1/2/3/4]" >> incident.txt
echo "Detected: $(date)" >> incident.txt
```

### 2. Triage

**Questions to Ask:**

1. **Is this a regression?**
   - Did it work before?
   - What changed recently?

2. **What is the impact?**
   - How many users affected?
   - Which services affected?

3. **Is it getting worse?**
   - Is error rate increasing?
   - Is latency degrading?

**Action:**
- Create incident branch if needed
- Communicate status to stakeholders
- Begin investigation

### 3. Mitigation

**Goal:** Restore service, not necessarily fix root cause

**Actions (in order of preference):**

1. **Revert last change**
   ```bash
   # Identify recent changes
   git log --oneline -10

   # Revert last commit
   git revert HEAD

   # Or reset to known-good
   git reset --hard <commit-hash>

   # Redeploy
   pnpm build
   pnpm mcp:start
   ```

2. **Disable failing feature**
   - Add feature flag
   - Return early from failing code
   - Route around failure

3. **Deploy last known-good version**
   ```bash
   # Checkout stable tag
   git checkout v1.2.3

   # Redeploy
   pnpm install
   pnpm build
   ```

4. **Implement workaround**
   - Manual process
   - Temporary configuration change
   - Increased capacity

### 4. Resolution

**Goal:** Fix root cause and deploy permanent fix

**Actions:**

1. **Identify root cause** (5 Whys technique)
   ```
   Why did it fail?
     → Because module X threw error
       → Because dependency Y was missing
         → Because package.json wasn't updated
           → Because new dependency wasn't documented
   ```

2. **Implement fix with tests**
   ```bash
   # Create feature branch
   git checkout -b fix/incident-XXX

   # Implement fix
   # Add regression test

   # Verify
   pnpm test
   pnpm build
   ```

3. **Deploy to production**
   ```bash
   # Merge to main
   git checkout main
   git merge fix/incident-XXX

   # Tag release
   git tag v1.2.4

   # Deploy
   pnpm build
   pnpm mcp:start
   ```

4. **Verify SLO recovery**
   ```bash
   # Monitor for 30 minutes
   # Check error budget
   # Verify latency back to normal
   ```

### 5. Post-Incident Review

**Timeline:** Within 48 hours of resolution

**Template:**

```markdown
# Incident Report: [INCIDENT-ID]

**Date:** YYYY-MM-DD
**Severity:** SEV-X
**Duration:** X hours
**Owner:** @username

## Summary

[Brief description of what happened]

## Impact

- **Users affected:** X
- **Services affected:** MCP server, widgets
- **Duration:** X hours
- **Error budget consumed:** X%

## Root Cause

[What caused the incident]

## Timeline of Events

| Time (UTC) | Event |
|------------|-------|
| 14:30 | Alert triggered |
| 14:35 | Incident acknowledged |
| 14:40 | Mitigation deployed |
| 15:00 | Service restored |

## What Went Well

- [ ] Quick detection
- [ ] Effective mitigation
- [ ] Good communication

## What Could Be Improved

- [ ] Faster detection
- [ ] Better runbook coverage
- [ ] Improved monitoring

## Action Items

- [ ] Update runbook with learned procedures
- [ ] Add regression test
- [ ] Improve monitoring

## Related Incidents

- Links to similar incidents
```

## Common Incident Scenarios

### MCP Server Fails to Start

**Symptoms:**
- `pnpm mcp:start` fails
- Contract tests fail
- Widgets show "tool unavailable" errors

**Triage:**
```bash
# Check recent commits
git log --oneline -5 platforms/mcp/

# Run contract tests
pnpm test:mcp-contract

# Check dependencies
pnpm ls --depth=0
```

**Mitigation:**
```bash
# Option 1: Revert last change
git revert HEAD -- platforms/mcp/
pnpm install
pnpm mcp:start

# Option 2: Pin to last known-good
git checkout <known-good-commit>
pnpm install
pnpm mcp:start
```

**Root Cause Analysis:**
- Was contract changed without semver bump?
- Did dependency update break something?
- Was environment variable missing?

**Prevention:**
- Add contract tests to CI
- Pin critical dependencies
- Document required environment variables

### Widget Build Fails in CI

**Symptoms:**
- CI build fails
- TypeScript errors
- Bundle size exceeded

**Triage:**
```bash
# Check CI logs for specific error
# Reproduce locally
pnpm build:widgets

# Check for upstream changes
pnpm list @openai/apps-sdk-ui
```

**Mitigation:**
```bash
# Fix build error
pnpm build:widgets --verbose

# Or revert problematic change
git revert HEAD

# Or update bundle size budget if legitimate
# Edit .github/workflows/ci.yml
```

**Root Cause Analysis:**
- Was import path incorrect?
- Did dependency add unexpected code?
- Was asset not optimized?

**Prevention:**
- Add pre-commit hooks for TypeScript
- Monitor bundle size in PRs
- Test dependency updates in branch first

### Visual Regression Tests Fail

**Symptoms:**
- Playwright visual tests fail
- Screenshot diffs detected

**Triage:**
```bash
# Review visual diffs
open playwright-report/index.html

# Determine if intentional or regression
git diff HEAD~1 packages/ui/src/
```

**Mitigation:**

**If regression:**
```bash
# Identify cause
git log --oneline -5

# Revert problematic change
git revert <commit>

# Or fix directly
# Edit component files
pnpm test:visual:web
```

**If intentional:**
```bash
# Update baselines
pnpm test:visual:update

git commit -am "Update visual baselines for [feature]"
```

**Root Cause Analysis:**
- Was styling changed intentionally?
- Did dependency update affect rendering?
- Was browser version updated?

**Prevention:**
- Review visual diffs in PRs
- Document intentional changes
- Pin Playwright version

### CI Pipeline Hangs

**Symptoms:**
- CI jobs don't complete
- Tests timeout
- No error messages

**Triage:**
```bash
# Check CI job logs
# Look for: stuck processes, infinite loops

# Check test timeouts
grep -r "timeout" platforms/web/apps/web/tests/
```

**Mitigation:**
```bash
# Cancel stuck job
gh run cancel <run-id>

# Add timeout to tests
# Edit: playwright.config.ts
timeout: 30000, // 30 seconds

# Fix infinite loop
# Review test code for unbounded loops
```

**Root Cause Analysis:**
- Did test wait for element that never appears?
- Is there an infinite loop in test code?
- Did environment issue cause slowdown?

**Prevention:**
- Add timeouts to all tests
- Use explicit waits instead of arbitrary delays
- Monitor CI job durations

## Rollback Procedures

### Widget Rollback

```bash
# 1. Identify last known-good version
git log --oneline -10

# 2. Revert to specific commit
git revert <commit-hash>
# OR reset (if no commits after)
git reset --hard <commit-hash>

# 3. Rebuild widgets
pnpm install
pnpm build:widgets

# 4. Verify
pnpm test
ls -lh dist/widgets/*.html
```

### MCP Server Rollback

```bash
# 1. Stop server
pkill -f "mcp-server"
# Or Ctrl+C if running in terminal

# 2. Checkout last known-good version
git checkout <commit-hash>

# 3. Install dependencies if needed
pnpm install

# 4. Restart server
pnpm mcp:start

# 5. Verify
pnpm test:mcp-contract
```

### Full Rollback (All Services)

```bash
# 1. Stop all services
pkill -f "node"
# Or stop specific services

# 2. Checkout stable tag
git checkout v1.2.3

# 3. Clean install
rm -rf node_modules
pnpm install

# 4. Build everything
pnpm build

# 5. Start services
pnpm mcp:start
# Start other services as needed

# 6. Verify health
pnpm test
pnpm test:mcp-contract
```

## Communication

### During Incident

**Internal:**
- Update status in incident channel/note
- Post timeline updates every 15 minutes (SEV-1/2)
- Share mitigation progress

**External:** (If applicable)
- Update status page
- Post to user communication channel
- Provide ETA when available

### Post-Incident

**Stakeholders:**
- Share incident report within 48 hours
- Highlight action items
- Request feedback on response

**Team:**
- Present incident review at next meeting
- Update runbook with learnings
- Track action items to completion

## Incident Metrics

Track these metrics to improve incident response:

| Metric | Target | Current |
|--------|--------|---------|
| Mean Time to Detect (MTTD) | <5 min | TBD |
| Mean Time to Mitigate (MTTM) | <15 min (SEV-1) | TBD |
| Mean Time to Resolve (MTTR) | <2 hours | TBD |
| Post-incident review completion | 100% within 48h | TBD |

## Escalation

**Primary:** Jamie Scott Craik (@jscraik)
**Response Time:** Within 1 hour (business hours)

**Escalate immediately if:**
- SEV-1 incident
- Multiple SEV-2 incidents simultaneously
- Security incident
- Data loss

## Related Documentation

- [SLOS.md](./SLOS.md) - Service level objectives and error budgets
- [RUNBOOK.md](./RUNBOOK.md) - Operational procedures and common issues
- [platforms/mcp/README.md](../../platforms/mcp/README.md) - MCP-specific documentation

## License

See repository root for license information.

## Risks and assumptions

- **Assumptions:** Operator has git access, can restart services
- **Failure modes:** Git outages prevent rollback, multiple incidents overwhelm team
- **Rollback or recovery:** Always have known-good tag, backup recent changes

## Verify

- **Rollback procedures work:** Test rollback quarterly
- **Severity levels clear:** All incidents categorized correctly
- **Communication effective:** Stakeholders receive timely updates

## Troubleshooting

### Incident response not progressing

1. Escalate to senior engineer
2. Consider full rollback to stable tag
3. Communicate current status honestly
4. Don't rush without understanding

### Root cause unclear

1. Use 5 Whys technique systematically
2. Check recent changes across all services
3. Review logs for error patterns
4. Consult team for additional context

### Recurring incidents

1. Analyze incident history for patterns
2. Update runbook with preventive measures
3. Add automated monitoring
4. Consider architectural changes
