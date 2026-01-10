# @astudio/cli

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

Unified developer CLI for the aStudio monorepo (dev/build/test/mcp/tokens/versions).

See `CLI_SPEC.md` for the full interface contract.

## Install (workspace)

```bash
pnpm install
```

## Usage

```bash
pnpm astudio --help
pnpm astudio dev --exec
pnpm astudio build web --exec
pnpm astudio test e2e-web --exec
pnpm astudio mcp tools list --network
pnpm astudio doctor
```

## Command overview

- `dev [web|storybook|widgets|mcp|all]`
- `build [web|widgets|lib|macos|all]`
- `test [ui|e2e-web|a11y-widgets|visual-web|visual-storybook|swift|mcp-contract|all]`
- `mcp <dev|start|test|inspector|rpc|tools|resources|prompts>`
- `tokens <generate|validate>`
- `versions <sync|sync-swift>`
- `components new <Name>`
- `lint [--compliance]`
- `format [--check|--write]`
- `doctor`

## Safety / risk flags

- `--exec` is required to run external commands (dev/build/test/lint/format, etc).
- `--network` is required for MCP network requests.
- `--write` is required for commands that write files (tokens/versions/components).
- `--dry-run` prints the plan/request without executing (no `--exec`/`--network` required).

## Output modes

- Default: human-readable
- `--plain`: stable `key=value` lines (no child output unless `--verbose`/`--debug` or on error)
- `--json`: single JSON object (no logs; stable schema `astudio.command.v1`)

## Config & env

Precedence: flags > env > project config > user config > system.

- Project config: `astudio.config.json`
- User config: `~/.config/astudio/config.json`

Environment variables:

- `ASTUDIO_CONFIG` (config path override)
- `ASTUDIO_CWD` (working directory override)
- `ASTUDIO_COLOR=0|1` (force color off/on)
- `ASTUDIO_PNPM` (pnpm binary path override)
- `MCP_TEST_URL` (default: `http://127.0.0.1:8787`)
- `MCP_ENDPOINT` (default: `/mcp`)
- `MCP_PROTOCOL_VERSION` (default: `2024-11-05`)

## Examples

```bash
pnpm astudio dev --exec
pnpm astudio build web --exec --json
pnpm astudio test visual-storybook --update --exec
pnpm astudio mcp rpc tools/list --network
pnpm astudio mcp tools call --name display_chat --args @payload.json --network
pnpm astudio tokens validate --exec
pnpm astudio mcp tools list --dry-run --plain
```

## JSON output schema

```json
{
  "schema": "astudio.command.v1",
  "meta": {
    "tool": "astudio",
    "version": "x.y.z",
    "timestamp": "ISO-8601",
    "request_id": "optional"
  },
  "summary": "short summary",
  "status": "success|warn|error",
  "data": {},
  "errors": [
    {
      "code": "E_USAGE",
      "message": "human-readable message",
      "details": {},
      "hint": "optional fix or next step"
    }
  ]
}
```
