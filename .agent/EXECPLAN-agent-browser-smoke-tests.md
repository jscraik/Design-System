# Execution Plan: agent-browser CI Built-Preview Smoke Tests

## Goal
Add a CLI-based agent-browser smoke test tier for built previews, with CI wiring and documented usage.

## Files to Create
- `scripts/agent-browser/run.mjs` (CLI flows for critical routes)
- `scripts/agent-browser/run-ci.mjs` (start preview server, run tests, shutdown)

## Files to Update
- `package.json` (add scripts, pin agent-browser to 0.5.0)
- `.github/workflows/ci.yml` (add smoke-agent-browser job under jobs)
- `docs/TEST_PLAN.md` (add smoke tier and commands)
- `docs/work/work_outstanding.md` (note added tier, pending verification)
- `README.md` and `CONTRIBUTING.md` (list new commands)

## CLI Behavior Summary
- Session: `astudio-smoke`
- Base URL: `AGENT_BROWSER_BASE_URL` (default http://127.0.0.1:5173)
- Results: `test-results/agent-browser/{snapshots,screenshots}`
- Commands used: open, snapshot -i --json, fill, click, find, press, wait, screenshot --full

## CI Behavior Summary
- Build web app with `VITE_WIDGETS_BASE=http://127.0.0.1:4173`
- Preview server: `pnpm -C platforms/web/apps/web preview -- --host 127.0.0.1 --port 4173`
- Run `pnpm test:agent-browser:ci`
- Upload `test-results/agent-browser/**` on failure

## Verification
- Local: `pnpm test:agent-browser` (dev server must be running)
- CI: `pnpm test:agent-browser:ci`