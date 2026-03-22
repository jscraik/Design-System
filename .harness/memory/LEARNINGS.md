---
schema_version: 1
purpose: Per-project agent knowledge base — repo-specific gotchas and hard-won fixes.
scope: This repo only.
update_policy: |
  Append after any bug, tool failure, or extra-effort fix specific to this repo.
  Universal gotchas go in ~/.codex/instructions/Learnings.md instead.
  Do NOT delete entries. Append only.
  Format: **YYYY-MM-DD [Agent]:** <problem> → <fix>
---

# Learnings

Repo-specific agent knowledge base. Append-only.

> **Scope:** This repo only. Universal gotchas → `~/.codex/instructions/Learnings.md`.
> **Format:** `**YYYY-MM-DD [Agent]:** <problem> → <fix>`

- **2026-03-12 [Codex]:** In doc reviews, MCP `filesystem/read_multiple_files` can drop with `Transport closed` on small plan/spec batches; fall back to direct `sed`/`rg` reads for the target docs instead of retrying the batch call.
