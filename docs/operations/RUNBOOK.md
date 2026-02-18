# MCP Server & Widget Pipeline Runbook

**Owner:** Jamie Scott Craik (@jscraik)
**Last updated:** 2026-01-19

## Doc requirements

- Audience: Operators and maintainers
- Scope: Operational steps and verification
- Non-scope: Long-form design history
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Monthly

## Quick Reference

| Service | Start Command | Health Check | Logs |
|---------|--------------|--------------|------|
| MCP Server | `pnpm mcp:start` | `pnpm test:mcp-contract` | `platforms/mcp/logs/` |
| Widget Build | `pnpm build:widgets` | Check dist/ size | CI build logs |
| Dev Server | `pnpm dev` | http://localhost:5173 | Terminal output |
| Storybook | `pnpm dev:storybook` | http://localhost:6006 | Terminal output |

## Telemetry Data Governance

**Scope:** Widget render telemetry and MCP tool call telemetry only.

**Event schema location:** This runbook (Telemetry Data Governance section).

**Allowed fields:**
- Component name
- Surface (web/widget/desktop)
- State (success/failure/empty/loading)
- Duration bucket (e.g., <100ms, 100-500ms, 500ms-1.5s, >1.5s)
- Error class (non-PII, high level)

**Prohibited fields:**
- User identifiers
- Raw content or prompts
- PII (names, emails, IPs)
- Full stack traces (use error class only)

**Retention:** 30 days default; adjust only with documented rationale in SLOS review.

**Access control:** Repo owners only; document access changes in incident notes.

## Common Operations

### Start MCP Server in Development

```bash
pnpm mcp:dev
```

**Expected output:** Server starts with hot-reload enabled

**Health check:**
```bash
pnpm test:mcp-contract
```

### Start MCP Server in Production

```bash
pnpm mcp:start
```

**Expected output:** Server listens on configured port

**To stop:** Press `Ctrl+C` or kill process by PID

### Build All Widgets

```bash
pnpm build:widgets
```

**Expected time:** ≤5 minutes

**Output location:** `dist/widgets/`

**Health check:**
```bash
ls -lh dist/widgets/*.html
# Verify each widget ≤250 KB
```

### Run MCP Contract Tests

```bash
pnpm test:mcp-contract
```

**Expected:** All 6 tests pass

**If fails:** See "MCP Contract Test Failures" below

## Health Checks

### MCP Server Health

**Step 1: Check contract tests pass**
```bash
pnpm test:mcp-contract
```
Expected: All 6 tests pass

**Step 2: Verify MCP server starts**
```bash
pnpm mcp:start
# Should see: "MCP server listening on port [PORT]"
```

**Step 3: Test widget embed**
1. Open Widget Gallery (`http://localhost:5173/harness`)
2. Load any widget
3. Expected: Widget renders without errors

### Widget Pipeline Health

**Step 1: Check build time**
```bash
time pnpm build:widgets
```
Expected: ≤5 minutes on CI

**Step 2: Check bundle sizes**
```bash
pnpm build:widgets
ls -lh dist/widgets/*.html
```
Expected: Widget bundles ≤250 KB gzipped

**Step 3: Check lint and tests**
```bash
pnpm lint
pnpm test
```
Expected: No errors, all tests pass

## Common Issues and Solutions

### MCP Server Fails to Start

**Symptoms:**
- `pnpm mcp:start` fails
- Error: "EADDRINUSE" or module not found
- Contract tests fail

**Diagnosis:**
```bash
# Check if port is in use
lsof -i :[PORT]

# Check recent commits
git log --oneline -5

# Check for dependency changes
git diff HEAD~1 package.json pnpm-lock.yaml
```

**Solutions:**

1. **Port in use:**
   ```bash
   # Find and kill process
   lsof -ti:[PORT] | xargs kill -9
   # Or use different port
   PORT=3001 pnpm mcp:start
   ```

2. **Dependency issue:**
   ```bash
   pnpm install
   pnpm build
   ```

3. **Recent breaking change:**
   ```bash
   # Revert to last known-good commit
   git revert HEAD
   pnpm install
   ```

### Widget Build Failing in CI

**Symptoms:**
- CI build fails
- TypeScript errors
- Bundle size exceeded

**Diagnosis:**
```bash
# Reproduce locally
pnpm build:widgets

# Check TypeScript errors
pnpm exec tsc --noEmit

# Check for upstream changes
pnpm list @openai/apps-sdk-ui
```

**Solutions:**

1. **TypeScript error:**
   ```bash
   # Fix imports or types
   # Check component exports
   grep -r "export" packages/ui/src/index.ts
   ```

2. **Bundle size exceeded:**
   ```bash
   # Analyze bundle
   pnpm build:widgets --analyze
   # Remove unused imports
   # Code split if needed
   ```

3. **Upstream dependency change:**
   ```bash
   # Pin to working version
   pnpm add @openai/apps-sdk-ui@[WORKING_VERSION]
   ```

### Widget Not Loading

**Symptoms:**
- Widget shows blank screen
- Browser console errors
- 404 on widget files

**Diagnosis:**
```bash
# Verify bundle exists
ls dist/widgets/*.html

# Check file permissions
ls -l dist/widgets/

# Check browser console
# Look for: Failed to load module, CORS errors
```

**Solutions:**

1. **Missing bundle:**
   ```bash
   pnpm build:widgets
   # Verify files created
   ```

2. **CORS error:**
   ```bash
   # Check server headers
   # Ensure proper CORS configuration
   ```

3. **Module load error:**
   ```bash
   # Check imports in widget
   # Verify all dependencies bundled
   ```

### Visual Regression Tests Fail

**Symptoms:**
- Playwright visual tests fail
- Screenshot diffs detected

**Diagnosis:**
```bash
# Run tests locally
pnpm test:visual:web

# Review diffs
# Check: playwright-report/
```

**Solutions:**

1. **If regression:**
   ```bash
   # Identify cause
   git diff HEAD~1 packages/ui/src
   # Fix and re-test
   ```

2. **If intentional:**
   ```bash
   # Update baselines
   pnpm test:visual:update
   git commit -am "Update visual baselines"
   ```

## MCP Contract Test Failures

### Test 1: Server Starts

**Failure:** Server doesn't start

**Check:**
```bash
# Check port availability
lsof -i :[PORT]

# Check configuration
cat platforms/mcp/config.json
```

**Fix:** Free port or update configuration

### Test 2: Tools Exposed

**Failure:** Tools not available

**Check:**
```bash
# Check tool definitions
grep -r "tools" platforms/mcp/src/
```

**Fix:** Verify tools are exported correctly

### Test 3: Tool Invocation

**Failure:** Tool returns error

**Check:**
```bash
# Check tool implementation
cat platforms/mcp/src/tools/[TOOL_NAME].ts
```

**Fix:** Debug tool logic, check dependencies

### Test 4: Error Handling

**Failure:** Errors not handled properly

**Check:**
```bash
# Check error handlers
grep -r "catch\|error" platforms/mcp/src/
```

**Fix:** Add proper error handling

### Test 5: Response Format

**Failure:** Invalid response format

**Check:**
```bash
# Check response schema
cat platforms/mcp/src/types.ts
```

**Fix:** Ensure response matches MCP schema

### Test 6: Performance

**Failure:** Response too slow

**Check:**
```bash
# Profile tool execution
time pnpm test:mcp-contract
```

**Fix:** Optimize slow operations, add caching

## Maintenance Tasks

### Daily

- [ ] Monitor CI build status
- [ ] Check error budget burn
- [ ] Review failed builds (if any)

### Weekly

- [ ] Review failed builds
- [ ] Update runbook with any learnings
- [ ] Check bundle size trends
- [ ] Verify SLO compliance

### Monthly

- [ ] Review SLO compliance
- [ ] Update error budget status
- [ ] Review and update runbook
- [ ] Generate monthly SLO report
- [ ] Check for dependency updates

### Quarterly

- [ ] SLO review and adjustment
- [ ] Runbook comprehensive review
- [ ] Incident response drill
- [ ] Capacity planning review

## Escalation

**Primary:** Jamie Scott Craik (@jscraik)
**Response Time:** Within 1 hour (business hours)

### Escalation Criteria

Escalate immediately if:
- Complete service outage (all widgets failing)
- Data loss or corruption
- Security incident
- SLO error budget exhausted

## Related Documentation

- [SLOS.md](./SLOS.md) - Service level objectives
- [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) - Incident procedures
- [platforms/mcp/README.md](../../platforms/mcp/README.md) - MCP-specific documentation
- [docs/guides/COMPONENT_CREATION.md](../guides/COMPONENT_CREATION.md) - Component creation workflow
- [a11y-audit-template.md](./a11y-audit-template.md) - Accessibility audit artifact template

## Quick Reference Commands

### Diagnostics

```bash
# Check system health
pnpm test                    # Run all tests
pnpm lint                    # Biome check
pnpm build:widgets           # Build widgets
pnpm test:mcp-contract       # MCP contract tests

# Check specific services
pnpm test:visual:web         # Visual regression tests
pnpm test:a11y:widgets       # Accessibility tests
pnpm test:e2e:web            # E2E tests
```

### Development

```bash
# Start development servers
pnpm dev                     # Web + Storybook
pnpm dev:web                 # Web only
pnpm dev:storybook           # Storybook only
pnpm mcp:dev                 # MCP server in dev mode
```

### Production

```bash
# Build for production
pnpm build                   # Build all packages
pnpm build:widgets           # Build widget bundles
pnpm build:lib               # Build library packages

# Start services
pnpm mcp:start               # MCP server in production
```

## License

See repository root for license information.

## Risks and assumptions

- **Assumptions:** Operator has terminal access, basic CLI knowledge
- **Failure modes:** CI outages block all operations, network issues affect MCP server
- **Rollback or recovery:** Git revert, restore from backups, restart services

## Verify

- **Commands work:** All commands tested on Linux
- **Health checks accurate:** All checks validated against actual service behavior
- **Solutions correct:** All solutions tested against real incidents

## Troubleshooting

### Runbook command doesn't work

1. Verify you're in project root: `pwd`
2. Check dependencies installed: `pnpm ls`
3. Try with explicit path: `./node_modules/.bin/[COMMAND]`

### Health check gives false positive

1. Verify check logic matches SLO definition
2. Check measurement source
3. Update health check accordingly
