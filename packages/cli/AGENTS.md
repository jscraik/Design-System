# AI Agent Guide for aStudio CLI

**Purpose:** This document helps AI coding agents (like Claude, Codex, etc.) use the aStudio CLI effectively with minimal friction.

## 🤖 Agent Mode (--agent)

Enable agent mode for enhanced support:

```bash
astudio --agent <command>
```

**What agent mode does:**
- **Intent-over-syntax**: More forgiving of typos (lower confidence threshold for suggestions)
- **Educational errors**: Detailed error messages with examples and guidance
- **Auto-accept**: Very high confidence matches are marked for auto-accept
- **Learning notes**: Explains how to correctly issue commands in the future

## 🎯 Quick Reference

### Most Common Commands

| Task | Command | Required Flags |
|------|---------|----------------|
| Start dev server | `astudio dev web` | `--exec` |
| Build project | `astudio build web` | `--exec` |
| Run tests | `astudio test ui` | `--exec` |
| Generate tokens | `astudio tokens generate` | `--write --exec` |
| Health check | `astudio doctor` | (none) |

### Safety Flags Explained

The CLI requires explicit flags for operations that could modify your system:

- `--exec`   : Run external processes (pnpm, npm, build tools)
- `--network`: Make HTTP/network requests
- `--write`  : Create or modify files
- `--dry-run`: Preview what would happen (safe, no flags needed)

**Pattern:** If a command fails with "requires --exec", simply add the flag and retry.

## 🛠️ Best Practices for Agents

### 1. Always Use `--json` for Machine Parsing

```bash
# Good: Parseable output
astudio doctor --json

# Also good: Agent mode with JSON
astudio --agent doctor --json
```

### 2. Start with `--dry-run` When Unsure

```bash
# Preview before executing
astudio tokens generate --dry-run

# Then execute if preview looks correct
astudio tokens generate --write --exec
```

### 3. Use `--agent` for Better Error Recovery

```bash
# Agent mode provides more helpful error messages
astudio --agent dev web  # Missing --exec
# Output will explain exactly what's needed
```

### 4. Handle Errors Systematically

When you get an error, check for these fields in `--json` output:

```json
{
  "errors": [{
    "code": "E_POLICY",
    "message": "dev requires --exec",
    "fix_suggestion": "astudio dev web --exec",
    "did_you_mean": [...]
  }]
}
```

**Auto-fix pattern:**
1. Check `fix_suggestion` field
2. If present, retry with that exact command
3. If `did_you_mean` has high confidence (>0.8), use that suggestion

## 📋 Response Format

### Success Response (--json)

```json
{
  "schema": "astudio.command.v1",
  "meta": {
    "tool": "astudio",
    "version": "0.0.1",
    "timestamp": "2026-04-07T12:00:00Z",
    "request_id": "abc123...",
    "trace_id": "xyz789..."
  },
  "summary": "doctor",
  "status": "success",
  "data": { ... },
  "errors": []
}
```

### Error Response (--json)

```json
{
  "schema": "astudio.command.v1",
  "meta": { ... },
  "summary": "error",
  "status": "error",
  "data": {},
  "errors": [{
    "code": "E_POLICY",
    "message": "tokens generate requires --write",
    "hint": "Re-run with --write to confirm file writes.",
    "fix_suggestion": "astudio tokens generate --write",
    "did_you_mean": []
  }]
}
```

## 🔍 Error Codes Reference

| Code | Meaning | Typical Fix |
|------|---------|-------------|
| `E_USAGE` | Invalid arguments | Check command syntax |
| `E_POLICY` | Missing safety flag | Add `--exec`, `--network`, or `--write` |
| `E_VALIDATION` | Input validation failed | Check input format |
| `E_EXEC` | External command failed | Check tool availability |
| `E_NETWORK` | Network request failed | Check connectivity |

## 💡 Pro Tips

### Getting Help

```bash
# General help
astudio --help

# Command-specific help
astudio dev --help

# Agent mode help (more detailed)
astudio --agent --help
```

### Environment Variables

Set these for consistent behavior:

```bash
export NO_COLOR=1           # Disable colors for easier parsing
export ASTUDIO_COLOR=0      # Alternative: disable colors
```

### Trace Context (for debugging)

```bash
# Inject trace ID for correlating with logs
TRACEPARENT=00-abc123...-def456...-01 astudio doctor --json
```

## 🧪 Testing Commands

Safe commands (no side effects):
```bash
astudio doctor              # Health check
astudio --help              # Show help
astudio tokens validate     # Read-only validation
```

Require `--dry-run` first:
```bash
astudio tokens generate --dry-run
astudio build web --dry-run
```

## 📝 Example Workflows

### Adding a New Component

```bash
# 1. Dry run first
astudio components new Button --dry-run

# 2. Execute if correct
astudio components new Button --write
```

### Running Development Server

```bash
# Start web dev server
astudio dev web --exec

# Or start all dev servers
astudio dev all --exec
```

### Token Generation Workflow

```bash
# 1. Validate current tokens
astudio tokens validate

# 2. Generate (preview)
astudio tokens generate --dry-run

# 3. Generate (execute)
astudio tokens generate --write --exec
```

## 🚨 Common Mistakes and Fixes

### "requires --exec"

```bash
# ❌ Wrong
astudio dev web

# ✅ Correct
astudio dev web --exec
```

### Typos in Commands

```bash
# ❌ Wrong
astudio bulid web --exec

# ✅ Suggested fix (use --agent for better suggestions)
astudio build web --exec
```

### Missing --write for File Operations

```bash
# ❌ Wrong
astudio tokens generate --exec

# ✅ Correct
astudio tokens generate --write --exec
```

## 🔗 Related Documentation

- [CLI_SPEC.md](./CLI_SPEC.md) - Full technical specification
- [README.md](./README.md) - General usage guide
- Project root AGENTS.md - Project-wide agent guidelines

---

**Version:** 1.0.0  
**Last Updated:** 2026-04-07
