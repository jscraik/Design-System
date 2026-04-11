# Tooling Inventory (Repo Canonical)

## Table of Contents

- [Scope](#scope)
- [Required `.mise.toml` tools](#required-misetoml-tools)
- [Required binaries](#required-binaries)
- [Required Codex actions](#required-codex-actions)
- [Regeneration](#regeneration)

## Scope

This file is generated from `scripts/check-environment.sh` and only documents the exact tooling contract enforced by that script.

## Required `.mise.toml` tools
- `node`
- `pnpm`
- `python`
- `uv`
- `cargo:prek`
- `npm:@brainwav/diagram`
- `npm:@argos-ci/cli`
- `cosign`
- `cloudflared`
- `npm:vitest`
- `ruff`
- `npm:eslint`
- `npm:agent-browser`
- `npm:agentation`
- `npm:agentation-mcp`
- `npm:@mermaid-js/mermaid-cli`
- `npm:@brainwav/rsearch`
- `npm:@brainwav/wsearch-cli`
- `npm:beautiful-mermaid`
- `npm:markdownlint-cli2`
- `npm:semver`
- `npm:wrangler`
- `semgrep`
- `trivy`
- `vale`

## Required binaries
- `pnpm`
- `node`
- `jq`
- `make`
- `rg`
- `fd`
- `prek`
- `diagram`
- `mise`
- `vale`
- `argos`
- `cosign`
- `cloudflared`
- `vitest`
- `ruff`
- `eslint`
- `agent-browser`
- `agentation-mcp`
- `mmdc`
- `markdownlint-cli2`
- `wrangler`
- `beautiful-mermaid`
- `semgrep`
- `semver`
- `trivy`
- `rsearch`
- `wsearch`

## Required Codex actions
- `Tools` (`icon = "tool"`)
- `Run` (`icon = "run"`)
- `Debug` (`icon = "debug"`)
- `Test` (`icon = "test"`)
- `Prek` (`icon = "test"`)
- `Diagram` (`icon = "tool"`)
- `Ralph` (`icon = "debug"`)
- `Mise` (`icon = "tool"`)
- `Vale` (`icon = "debug"`)
- `Argos` (`icon = "test"`)
- `Cosign` (`icon = "debug"`)
- `Cloudflared` (`icon = "run"`)
- `Vitest` (`icon = "test"`)
- `Ruff` (`icon = "debug"`)
- `ESLint` (`icon = "debug"`)
- `Agent Browser` (`icon = "tool"`)
- `Agentation` (`icon = "tool"`)
- `Mermaid CLI` (`icon = "tool"`)
- `MarkdownLint` (`icon = "debug"`)
- `Wrangler` (`icon = "run"`)
- `1Password` (`icon = "tool"`)
- `Beautiful Mermaid` (`icon = "tool"`)
- `Auth0` (`icon = "tool"`)
- `Semgrep` (`icon = "debug"`)
- `Semver` (`icon = "tool"`)
- `Trivy` (`icon = "debug"`)
- `Gitleaks` (`icon = "debug"`)
- `Research` (`icon = "tool"`)
- `WSearch` (`icon = "tool"`)

## Regeneration

```bash
bash scripts/check-environment.sh --write-tooling-doc
```
