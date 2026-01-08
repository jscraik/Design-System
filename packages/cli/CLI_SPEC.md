# ChatUI CLI Spec (Gold Standard, Jan 2026)

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This document defines the stable CLI surface for `chatui` and the contracts required for agentic use.

## 1. Name

`chatui`

## 2. One-liner

Unified developer CLI for ChatUI (dev/build/test/mcp/tokens/versions).

## 3. USAGE

- `chatui [global flags] <command> [args]`

## 4. Commands

- `dev [web|storybook|widgets|mcp|all]` (runs dev servers)
- `build [web|widgets|lib|macos|all]` (build targets)
- `test [ui|e2e-web|a11y-widgets|visual-web|visual-storybook|swift|mcp-contract|all]`
- `mcp dev|start|test|inspector`
- `mcp rpc <method>` (JSON-RPC request)
- `mcp tools list|call`
- `mcp resources list|read`
- `mcp prompts list|get`
- `tokens generate|validate`
- `versions sync|sync-swift`
- `components new <Name>`
- `lint`
- `format --check|--write`
- `doctor`
- `help [command]`

## 5. Global Flags

- `-h, --help`
- `--version`
- `-q, --quiet` (errors only)
- `-v, --verbose` (extra details)
- `-d, --debug` (internal diagnostics)
- `--json` (single JSON object, no logs)
- `--plain` (stable line-based output)
- `--no-color`
- `--no-input`
- `--exec` (allow external command execution)
- `--network` (allow network access)
- `--cwd <dir>`
- `--config <path>`
- `--dry-run` (plan only; no side effects)

## 6. I/O Contract

- stdout: primary output (human or machine, based on mode)
- stderr: diagnostics and errors (suppressed for `--json`/`--plain`)

## 7. Output Modes

- default: human-readable output, may include child process output
- `--plain`: stable `key=value` lines; no child stdout/stderr unless `--verbose`/`--debug` or on error
- `--json`: single JSON object with stable schema `chatui.command.v1`

## 8. Exit Codes

- `0` success
- `1` generic failure
- `2` invalid usage / validation failure
- `3` policy refusal / missing required metadata
- `4` partial success / partial failure
- `130` user abort

## 9. Error Codes

- `E_USAGE` invalid args or command misuse
- `E_VALIDATION` input validation failed
- `E_POLICY` policy refusal / missing required metadata
- `E_PARTIAL` partial success / partial failure
- `E_AUTH` auth or permission failure
- `E_NETWORK` network failure or timeout
- `E_EXEC` external command execution failure
- `E_INTERNAL` unexpected internal error

## 10. Safety Rules (Agentic Defaults)

- Commands that spawn external processes require `--exec`, unless `--dry-run`.
- MCP network calls require `--network`, unless `--dry-run`.
- File-generating commands require `--write`.
- `--dry-run` must never change state; it prints the planned command/request.

## 11. Config & Env

Precedence: flags > env > project config > user config > system.

Config files:
- Project: `chatui.config.json`
- User: `~/.config/chatui/config.json`

Env vars:
- `CHATUI_CONFIG` (config path override)
- `CHATUI_CWD` (working directory override)
- `CHATUI_COLOR=0|1` (force color on/off)
- `CHATUI_PNPM` (pnpm binary path override)
- `MCP_TEST_URL` (default: `http://127.0.0.1:8787`)
- `MCP_ENDPOINT` (default: `/mcp`)
- `MCP_PROTOCOL_VERSION` (default: `2024-11-05`)

## 12. Examples

- `chatui dev --exec`
- `chatui build web --exec --json`
- `chatui test visual-storybook --update --exec`
- `chatui mcp tools list --network --json`
- `chatui mcp rpc tools/list --dry-run --plain`
- `chatui tokens generate --write --exec`
- `chatui doctor --json`
