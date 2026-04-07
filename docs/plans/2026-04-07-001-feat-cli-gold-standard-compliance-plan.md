---
title: "CLI Gold Standard 2026 Compliance: Observability, Self-Correction, and Security"
type: feat
status: active
date: 2026-04-07
origin: docs/cli-specs/astudio-cli-gold-standard-2026.md
---

# CLI Gold Standard 2026 Compliance: Observability, Self-Correction, and Security

## Overview

The aStudio CLI currently implements ~70% of the Gold Standard 2026 specification. The foundation is solid with structured JSON envelopes, semantic exit codes, safety gates, and dual-mode I/O. This plan addresses the remaining 30% — adding observability (trace IDs), agent self-correction (`did_you_mean`, `fix_suggestion`), progressive help, and field masking for sensitive data.

The work is organized into three phases aligned with the specification gaps identified in the analysis document.

## Problem Frame

**Current state:** The CLI is functional and well-architected but lacks modern observability and agent-experience features expected in 2026-era developer tools.

**Pain points:**
1. **No request tracing** — Cannot correlate logs across distributed operations or integrate with external observability systems (OpenTelemetry, AWS X-Ray)
2. **No auto-correction** — Typos require manual correction; agents cannot self-heal from common mistakes
3. **Static help** — Single-level help output overwhelms new users and lacks discoverability features
4. **No field masking** — Sensitive data (paths, tokens) may be exposed in logs and output

**Success criteria:**
- Trace IDs propagate through all CLI operations with W3C trace context support
- Typos in commands and flags suggest corrections with confidence scores
- Error messages include `fix_suggestion` for common policy failures
- Help system supports progressive disclosure (minimal/common/full/expert levels)
- Sensitive fields are automatically masked in non-debug output modes

## Requirements Trace

- **R1.** Trace ID support: Generate and propagate trace IDs in JSON envelope metadata (W3C trace context compatible)
- **R2.** Field masking: Automatically mask sensitive fields (tokens, paths, auth data) in output
- **R3.** Command suggestions: Provide `did_you_mean` array in error responses for typos
- **R4.** Fix suggestions: Generate `fix_suggestion` field showing corrected command for policy errors
- **R5.** Progressive help: Support `--help=minimal|common|full|expert` and `--help-topic=<topic>`
- **R6.** Safety: All masking can be bypassed with `--show-sensitive` (expert only)
- **R7.** Backward compatibility: Existing `--json` and `--plain` outputs remain unchanged (only add new optional fields)

## Scope Boundaries

**In scope:**
- Core CLI framework changes (envelope generation, error handling)
- New utility modules (trace, mask, suggest, fix, help)
- Integration with existing command structure
- Environment variable support for trace context injection

**Out of scope:**
- External telemetry backend integration (just propagate IDs)
- Interactive UI or TUI improvements
- Natural language help queries
- Auto-execution of fix suggestions (show only)
- Changes to existing command behavior beyond error/help output

## Context & Research

### Relevant Code and Patterns

**Current envelope structure:** `packages/cli/src/utils/output.ts:87-101`
```typescript
export function createEnvelope(
  summary: string,
  status: JsonEnvelope["status"],
  data: Record<string, JsonValue>,
  errors: JsonError[] = [],
): JsonEnvelope {
  return {
    schema: COMMAND_SCHEMA,
    meta: { tool: TOOL_NAME, version: getToolVersion(), timestamp: nowIso() },
    summary,
    status,
    data,
    errors,
  };
}
```

**Error handling pattern:** `packages/cli/src/error.ts`
- `CliError` class with code, exitCode, hint, details
- `normalizeFailure()` for consistent error normalization
- `toJsonError()` for JSON envelope serialization

**Existing safety gates:** `packages/cli/src/error.ts:64-84`
- `requireExec()` — throws E_POLICY if `--exec` missing
- `requireNetwork()` — throws E_POLICY if `--network` missing
- Similar pattern for `--write` in individual commands

**NO_COLOR compliance:** `packages/cli/src/utils/env.ts:26-36`
- Respects `NO_COLOR` env var
- Supports `ASTUDIO_COLOR` override
- Automatically disables color for `--json`/`--plain`

### Technology Stack

- TypeScript 5.9+
- Node.js 20+ (crypto.randomUUID available)
- yargs for CLI parsing
- No external dependencies for core functionality

### External References

- [W3C Trace Context](https://www.w3.org/TR/trace-context/) — traceparent header format
- [OpenTelemetry Trace Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
- [no-color.org](https://no-color.org/) — already compliant
- [Claude CLI Best Practices](https://docs.anthropic.com/claude/docs/cli-best-practices)

## Key Technical Decisions

1. **Trace ID format**: Use W3C trace context (32 hex chars) for compatibility with OpenTelemetry, AWS X-Ray, and other observability systems. Support both `TRACEPARENT` and `_X_AMZN_TRACE_ID` environment variables for injection.

2. **Suggestion algorithm**: Use Levenshtein distance with normalized threshold (confidence = 1 - distance/maxLength). Only suggest when confidence ≥ 0.6 to avoid noisy suggestions.

3. **Masking strategy**: Default to "redact" (replace with `[REDACTED]`) for maximum safety. Support partial masking for non-secret sensitive data (show first/last 4 chars).

4. **Help level default**: `--help` without level shows "common" (current behavior). Expert flags like `--show-sensitive` only appear in `--help=expert`.

5. **Backward compatibility**: All new envelope fields (`request_id`, `trace_id`, `did_you_mean`, `fix_suggestion`) are optional additions. Existing parsers will ignore unknown fields.

## Open Questions

### Resolved During Planning

- **Q: Should we add a dependency for Levenshtein distance?**
  - A: Yes, add `fastest-levenshtein` (1.5KB, zero dependencies, 100M+ weekly downloads) rather than implementing our own.

- **Q: How to handle trace sampling?**
  - A: Support `ASTUDIO_TRACE_SAMPLE_RATE` env var (0.0-1.0), default to 1.0 (100%) for CLI use case where overhead is negligible.

### Deferred to Implementation

- **Q: Exact list of sensitive field patterns?**
  - A: Start with `token`, `api_key`, `password`, `secret`, `auth`, `cookie`, `home`, `user`. May expand based on security review during implementation.

- **Q: Which commands get topic-based help first?**
  - A: Start with `safety` and `output` topics. Additional topics can be added incrementally.

## Implementation Units

### Phase 1: Security & Observability (Foundation)

- [ ] **Unit 1.1: Add trace ID generation and propagation**

**Goal:** Generate and propagate trace IDs through all CLI operations with W3C trace context support.

**Requirements:** R1, R7

**Dependencies:** None

**Files:**
- Create: `packages/cli/src/utils/trace.ts`
- Modify: `packages/cli/src/types.ts`
- Modify: `packages/cli/src/utils/output.ts`
- Modify: `packages/cli/src/utils/env.ts`
- Test: `packages/cli/tests/trace.test.mjs`

**Approach:**
- Create `TraceContext` interface with traceId, requestId, parentId, sampled
- Implement `createTraceContext()` for new traces
- Implement `parseTraceparent()` for W3C context parsing
- Implement `parseXrayTrace()` for AWS X-Ray support
- Update `JsonEnvelope.meta` to include `request_id`, `trace_id`, `parent_id`
- Add env var support: `TRACEPARENT`, `_X_AMZN_TRACE_ID`, `ASTUDIO_TRACE_ID`, `ASTUDIO_TRACE_SAMPLE_RATE`

**Patterns to follow:**
- Follow existing pattern in `env.ts` for env var parsing
- Use `randomUUID()` from `node:crypto` (Node 20+)

**Test scenarios:**
- Happy path: Generate new trace context with unique IDs
- Happy path: Parse valid W3C traceparent header
- Edge case: Parse invalid traceparent (return undefined, generate new)
- Edge case: Sampling rate 0.0 (always false)
- Edge case: Sampling rate 1.0 (always true)
- Integration: Trace IDs appear in JSON envelope output

**Verification:**
- `astudio doctor --json` includes `meta.request_id` and `meta.trace_id`
- Setting `TRACEPARENT=00-abc123...` results in same trace_id in output

---

- [ ] **Unit 1.2: Implement field masking for sensitive data**

**Goal:** Automatically mask sensitive fields in CLI output to prevent data leakage.

**Requirements:** R2, R6, R7

**Dependencies:** Unit 1.1 (for trace integration)

**Files:**
- Create: `packages/cli/src/utils/mask.ts`
- Modify: `packages/cli/src/utils/output.ts`
- Modify: `packages/cli/src/types.ts`
- Modify: `packages/cli/src/index.ts` (add `--show-sensitive` flag)
- Test: `packages/cli/tests/mask.test.mjs`

**Approach:**
- Define `SensitivityLevel` type: `public | internal | confidential | secret`
- Define `FieldMask` interface with field pattern, level, mask type
- Implement `maskValue()` with strategies: `full`, `partial`, `hash`, `redact`
- Implement `maskObject()` for recursive masking
- Define default masks for: `token`, `api_key`, `password`, `secret`, `auth`, `cookie`, `home`, `user`
- Update `createEnvelope()` to apply masking (skip in debug mode)
- Add `--show-sensitive` expert flag to bypass masking

**Execution note:** Add characterization tests for existing output before modifying, to ensure no regression.

**Patterns to follow:**
- Pattern matching similar to existing env var parsing
- Integration with `shouldColor()` pattern for mode detection

**Test scenarios:**
- Happy path: Token field masked as `[REDACTED]`
- Happy path: Path field partially masked (`/Users/.../file`)
- Happy path: No masking in debug mode
- Edge case: Nested object with sensitive fields at multiple levels
- Edge case: Empty string value (mask as `[REDACTED]`)
- Error path: Circular reference handling (if applicable)
- Integration: `--show-sensitive` flag bypasses masking

**Verification:**
- `astudio doctor --json` with sensitive config shows `[REDACTED]` values
- `astudio doctor --json --show-sensitive` shows actual values
- Existing tests for `--json` output still pass

---

### Phase 2: Agent Experience (Self-Correction)

- [ ] **Unit 2.1: Add command and flag suggestion (did_you_mean)**

**Goal:** Provide intelligent suggestions when users mistype commands or flags.

**Requirements:** R3, R7

**Dependencies:** None (can run in parallel with Phase 1)

**Files:**
- Create: `packages/cli/src/utils/suggest.ts`
- Modify: `packages/cli/src/types.ts` (add Suggestion type)
- Modify: `packages/cli/src/error.ts` (add did_you_mean to JsonError)
- Modify: `packages/cli/src/index.ts` (integrate into fail handler)
- Test: `packages/cli/tests/suggest.test.mjs`

**Approach:**
- Add dependency: `fastest-levenshtein@^1.0.16`
- Implement `suggestCommand()` using Levenshtein distance
- Implement `suggestFlag()` for flag normalization (--flag → flag)
- Define confidence threshold (0.6) for suggestion quality
- Update fail handler to generate suggestions for unknown commands/flags
- Add suggestions to JSON error output

**Patterns to follow:**
- Error handling pattern from existing fail handler in `index.ts:232-259`
- Command list from yargs configuration

**Test scenarios:**
- Happy path: "devv" suggests "dev" with high confidence
- Happy path: "bulid" suggests "build" with high confidence
- Happy path: "--update" suggests "--exec" or similar flags
- Edge case: No suggestions when input is completely different
- Edge case: Multiple suggestions sorted by confidence
- Edge case: Case-insensitive matching ("DEV" matches "dev")

**Verification:**
- `astudio devv 2>&1` shows "Did you mean: dev?"
- `astudio devv --json` includes `did_you_mean: [{type: "command", input: "devv", suggestion: "dev", confidence: 0.89}]`

---

- [x] **Unit 2.2: Implement fix suggestion generation**

**Goal:** Generate corrected command suggestions for common policy errors.

**Requirements:** R4, R7

**Dependencies:** Unit 2.1

**Files:**
- Modify: `packages/cli/src/error.ts` (add fix_suggestion to JsonError)
- Modify: `packages/cli/src/index.ts` (implement `generateFixSuggestion()` in fail handler)
- Test: `packages/cli/tests/suggest.test.mjs` (covers fix suggestion in JSON output)

**Approach:**
- Implement `generateFixSuggestion()` inline in fail handler that analyzes error and original argv
- Handle E_POLICY errors: suggest adding `--exec`, `--network`, or `--write`
- Reconstruct corrected command string by appending missing flags
- Note: Implementation is inline in index.ts rather than separate module for tighter integration with yargs fail handler context

**Patterns to follow:**
- Similar to existing hint generation in error handlers
- Command reconstruction from parsed argv

**Test scenarios:**
- Happy path: Missing `--exec` suggests adding the flag
- Happy path: Missing `--network` suggests adding the flag
- Happy path: Missing `--write` suggests adding the flag
- Happy path: Usage error suggests help command
- Edge case: Multiple missing flags (suggest one at a time)
- Edge case: Dry-run mode doesn't require flags

**Verification:**
- `astudio dev web 2>&1` shows "Fix suggestion: astudio dev web --exec"
- `astudio dev web --json` includes `fix_suggestion: "astudio dev web --exec"`

---

### Phase 3: Progressive Help (User Experience)

- [ ] **Unit 3.1: Implement progressive help system**

**Goal:** Support multiple help levels and topic-based help for better discoverability.

**Requirements:** R5, R7

**Dependencies:** None (can run in parallel)

**Files:**
- Create: `packages/cli/src/utils/help.ts`
- Modify: `packages/cli/src/index.ts` (add help level parsing)
- Modify: `packages/cli/src/commands/*.ts` (add examples, topics)
- Test: `packages/cli/tests/help.test.mjs`

**Approach:**
- Define `HelpLevel` type: `minimal | common | full | expert`
- Implement `getHelp()` dispatcher for level-based output
- Parse `--help=<level>` syntax from argv before yargs processing
- Add `--help-topic=<topic>` support
- Define initial topics: `safety`, `output`, `mcp`, `tokens`
- Add examples to command definitions

**Patterns to follow:**
- yargs middleware pattern for pre-processing
- Existing help integration in fail handler

**Test scenarios:**
- Happy path: `--help` shows common level (current behavior)
- Happy path: `--help=minimal` shows one-line usage
- Happy path: `--help=expert` includes `--show-sensitive`
- Happy path: `--help-topic=safety` shows safety-related flags only
- Edge case: Unknown help level falls back to common
- Edge case: Unknown topic shows available topics

**Verification:**
- `astudio --help=minimal` shows compact usage
- `astudio --help-topic=safety` lists `--exec`, `--network`, `--write`, `--dry-run`
- Expert flag `--show-sensitive` only appears in `--help=expert`

---

## System-Wide Impact

**Interaction graph:**
- All commands benefit from trace IDs in output
- All error paths benefit from suggestions and fix hints
- All help output benefits from progressive levels

**Error propagation:**
- New error fields (`did_you_mean`, `fix_suggestion`) are additive only
- Existing error handling continues to work unchanged
- Suggestion generation failures are silent (don't mask original error)

**State lifecycle risks:**
- Trace context has no persistent state (generated per invocation)
- No risk of partial writes or state corruption

**API surface parity:**
- JSON envelope schema version remains `astudio.command.v1` (additive changes)
- All new fields are optional
- Plain output format unchanged

**Integration coverage:**
- Test with `--json` and `--plain` modes
- Test with `NO_COLOR=1` environment
- Test with piped output (non-TTY)

**Unchanged invariants:**
- Exit codes remain unchanged (0, 1, 2, 3, 4, 130)
- Error codes remain unchanged (E_USAGE, E_POLICY, etc.)
- Safety gate behavior (`--exec`, `--network`, `--write`) unchanged
- `--dry-run` semantics unchanged

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Breaking change to JSON envelope parsers | All additions are optional fields; existing parsers ignore unknown fields. Verify with test suite. |
| Performance impact of Levenshtein distance | Use `fastest-levenshtein` (optimized wasm implementation). Only run on error paths, not success paths. |
| Over-masking hides useful debug info | Provide `--show-sensitive` escape hatch. Masking only applies to non-debug modes. |
| Help level parsing conflicts with yargs | Parse `--help=<level>` manually before yargs takes over, or use middleware. |
| Trace ID generation overhead | UUID generation is fast (~1μs). Only generate when needed (JSON mode or env var set). |

## Documentation / Operational Notes

**Required documentation updates:**
- Update `packages/cli/CLI_SPEC.md` with new schema fields and flags
- Update `packages/cli/README.md` with help level examples
- Add agent integration guide showing how to use `did_you_mean` and `fix_suggestion`

**No operational changes required:**
- No database migrations
- No configuration changes
- No deployment changes
- Backward compatible with existing usage

## Sources & References

- **Origin document:** [docs/cli-specs/astudio-cli-gold-standard-2026.md](../../../docs/cli-specs/astudio-cli-gold-standard-2026.md)
- **Related code:** `packages/cli/src/`
- **External spec:** W3C Trace Context, OpenTelemetry Semantic Conventions
- **Dependencies:** `fastest-levenshtein@^1.0.16`

---

## Implementation Order

**Phase 1 (Foundation - Security & Observability):**
1. Unit 1.1: Trace IDs
2. Unit 1.2: Field masking

**Phase 2 (Agent Experience):**
3. Unit 2.1: Command suggestions
4. Unit 2.2: Fix suggestions

**Phase 3 (User Experience):**
5. Unit 3.1: Progressive help

**Each phase can be released independently.** Phase 1 provides the most value and should be prioritized.
