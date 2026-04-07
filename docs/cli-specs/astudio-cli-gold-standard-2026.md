# aStudio CLI Gold Standard 2026 Spec

**Date:** 2026-04-07  
**Version:** 1.0.0  
**Status:** Analysis Complete — Implementation Roadmap  
**Based on:** Current implementation at `packages/cli/`

---

## Executive Summary

The aStudio CLI currently implements **~70% of the Gold Standard 2026 specification**. The foundation is solid with structured output, semantic exit codes, safety gates, and dual-mode I/O. This document identifies the remaining gaps and provides actionable recommendations for achieving full compliance.

### Current Compliance Score: 70%

| Category | Status | Coverage |
|----------|--------|----------|
| Core I/O Architecture | ✅ Implemented | 100% |
| Safety & Security | ✅ Implemented | 100% |
| Error Handling | ✅ Implemented | 90% |
| Observability | ⚠️ Partial | 40% |
| Agent Self-Correction | ❌ Missing | 0% |
| Progressive Help | ❌ Missing | 0% |
| Field Masking | ❌ Missing | 0% |

---

## 1. What's Already Implemented (The 70%)

### 1.1 Structured JSON Envelopes ✅

**Location:** `src/utils/output.ts:87-101`

```typescript
export function createEnvelope(
  summary: string,
  status: JsonEnvelope["status"],
  data: Record<string, JsonValue>,
  errors: JsonError[] = [],
): JsonEnvelope {
  return {
    schema: COMMAND_SCHEMA,      // "astudio.command.v1"
    meta: { tool: TOOL_NAME, version: getToolVersion(), timestamp: nowIso() },
    summary,
    status,                      // "success" | "warn" | "error"
    data,
    errors,
  };
}
```

**Strengths:**
- Stable schema versioning (`astudio.command.v1`)
- Consistent metadata (tool, version, timestamp)
- Proper error array structure
- Type-safe implementation

### 1.2 Semantic Exit Codes ✅

**Location:** `src/constants.ts:46-54`

```typescript
export const EXIT_CODES = {
  success: 0,      // 0 - Success
  failure: 1,      // 1 - Generic failure
  usage: 2,        // 2 - Invalid usage / validation failure
  policy: 3,       // 3 - Policy refusal / missing required metadata
  partial: 4,      // 4 - Partial success / partial failure
  abort: 130,      // 130 - User abort (SIGINT)
} as const;
```

**Error Codes:**
```typescript
export const ERROR_CODES = {
  usage: "E_USAGE",           // Invalid args or command misuse
  validation: "E_VALIDATION", // Input validation failed
  policy: "E_POLICY",         // Policy refusal
  partial: "E_PARTIAL",       // Partial success / partial failure
  auth: "E_AUTH",             // Auth or permission failure
  network: "E_NETWORK",       // Network failure or timeout
  internal: "E_INTERNAL",     // Unexpected internal error
  exec: "E_EXEC",             // External command execution failure
} as const;
```

### 1.3 Safety Gates (Agentic Defaults) ✅

**Location:** `src/error.ts:64-84`

| Flag | Purpose | Implementation |
|------|---------|----------------|
| `--exec` | Allow external command execution | `requireExec()` helper |
| `--network` | Allow network access | `requireNetwork()` helper |
| `--write` | Allow file writes | Command-specific checks |
| `--dry-run` | Preview without side effects | Early return pattern |

**Example Usage:**
```typescript
export function requireExec(opts: Record<string, unknown>, action: string): void {
  if (opts.dryRun) return;
  if (!opts.exec) {
    throw new CliError(`${action} requires --exec`, {
      code: ERROR_CODES.policy,
      exitCode: EXIT_CODES.policy,
      hint: "Re-run with --exec to allow external command execution.",
    });
  }
}
```

### 1.4 Dual-Mode Output ✅

**Location:** `src/utils/output.ts`

| Mode | Flag | Purpose |
|------|------|---------|
| JSON | `--json` | Machine-parseable single JSON object |
| Plain | `--plain` | Stable `key=value` line-based output |
| Human | (default) | Human-readable with formatting |

**JSON Output:**
```bash
$ astudio doctor --json
{
  "schema": "astudio.command.v1",
  "meta": { "tool": "astudio", "version": "0.0.1", "timestamp": "2026-04-07T12:00:00Z" },
  "summary": "doctor",
  "status": "success",
  "data": { /* ... */ },
  "errors": []
}
```

**Plain Output:**
```bash
$ astudio doctor --plain
schema="astudio.command.v1"
meta.tool="astudio"
meta.version="0.0.1"
meta.timestamp="2026-04-07T12:00:00Z"
summary="doctor"
status="success"
```

### 1.5 NO_COLOR Compliance ✅

**Location:** `src/utils/env.ts:26-36`

```typescript
export function shouldColor(opts: GlobalOptions): boolean {
  const colorPref = parseBooleanEnv(process.env.ASTUDIO_COLOR);
  if (opts.noColor) return false;
  if (opts.json || opts.plain) return false;
  if (process.env.NO_COLOR) return false;
  if (process.env.TERM === "dumb") return false;
  if (colorPref === false) return false;
  if (colorPref === true) return true;
  if (!process.stdout.isTTY) return false;
  return true;
}
```

**Compliant with:** [no-color.org](https://no-color.org/) standard

### 1.6 Proper stderr/stdout Separation ✅

- **stdout:** Primary output (data, results)
- **stderr:** Diagnostics, errors, hints
- Suppressed for `--json`/`--plain` modes

**Location:** `src/index.ts:232-259` (fail handler)

---

## 2. Implementation Gaps (The 30%)

### 2.1 Observability — Trace IDs ⚠️

**Current State:** No request tracing  
**Gap Impact:** Cannot correlate logs across distributed operations  
**Priority:** HIGH

**Required Implementation:**

```typescript
// Add to src/types.ts
export type JsonEnvelope = {
  schema: string;
  meta: {
    tool: string;
    version: string;
    timestamp: string;
    request_id?: string;        // ← ADD THIS
    trace_id?: string;          // ← ADD THIS (for distributed tracing)
    parent_id?: string;         // ← ADD THIS (for span hierarchy)
  };
  // ...
};
```

**Implementation Plan:**

1. **Trace ID Generation** (`src/utils/trace.ts` - NEW FILE)
```typescript
import { randomUUID } from "node:crypto";

export interface TraceContext {
  traceId: string;
  requestId: string;
  parentId?: string;
  sampled: boolean;
}

export function createTraceContext(parentContext?: TraceContext): TraceContext {
  return {
    traceId: parentContext?.traceId ?? generateTraceId(),
    requestId: generateRequestId(),
    parentId: parentContext?.requestId,
    sampled: parentContext?.sampled ?? shouldSample(),
  };
}

function generateTraceId(): string {
  // W3C trace context format: 32 hex chars
  return randomUUID().replace(/-/g, "").toLowerCase();
}

function generateRequestId(): string {
  // Shorter ID for request correlation
  return randomUUID().slice(0, 16);
}

function shouldSample(): boolean {
  // Respect sampling from env or default to 100% for CLI
  const rate = parseFloat(process.env.ASTUDIO_TRACE_SAMPLE_RATE ?? "1.0");
  return Math.random() < rate;
}
```

2. **Env Propagation** (`src/utils/env.ts`)
```typescript
export function getTraceContext(): TraceContext | undefined {
  // Support W3C traceparent header format
  const traceparent = process.env.TRACEPARENT;
  if (traceparent) {
    return parseTraceparent(traceparent);
  }
  // Support AWS X-Ray format
  const xray = process.env._X_AMZN_TRACE_ID;
  if (xray) {
    return parseXrayTrace(xray);
  }
  return undefined;
}
```

3. **Env Vars to Support:**
   - `ASTUDIO_TRACE_ID` — Inject external trace ID
   - `TRACEPARENT` — W3C trace context
   - `_X_AMZN_TRACE_ID` — AWS X-Ray
   - `ASTUDIO_TRACE_SAMPLE_RATE` — Sampling rate (0.0-1.0)

---

### 2.2 Agent Self-Correction — `did_you_mean` ❌

**Current State:** yargs strict mode shows generic "Unknown argument" error  
**Gap Impact:** Agents cannot auto-correct typos or suggest alternatives  
**Priority:** MEDIUM

**Required Implementation:**

1. **Command Suggestions** (`src/utils/suggest.ts` - NEW FILE)
```typescript
import { distance } from "fastest-levenshtein";

export interface Suggestion {
  type: "command" | "flag" | "value";
  input: string;
  suggestion: string;
  confidence: number;  // 0.0 - 1.0
}

export function suggestCommand(
  input: string,
  availableCommands: string[],
  threshold = 0.6
): Suggestion | undefined {
  const suggestions = availableCommands
    .map(cmd => ({
      cmd,
      dist: distance(input.toLowerCase(), cmd.toLowerCase()),
    }))
    .filter(({ dist }) => dist <= Math.max(3, input.length * 0.4))
    .sort((a, b) => a.dist - b.dist);

  if (suggestions.length === 0) return undefined;

  const best = suggestions[0];
  const confidence = 1 - (best.dist / Math.max(input.length, best.cmd.length));

  if (confidence < threshold) return undefined;

  return {
    type: "command",
    input,
    suggestion: best.cmd,
    confidence,
  };
}

export function suggestFlag(
  input: string,
  availableFlags: string[]
): Suggestion | undefined {
  // Normalize --flag to flag
  const normalized = input.replace(/^-+/, "");
  return suggestCommand(normalized, availableFlags.map(f => f.replace(/^-+/, "")));
}
```

2. **Enhanced Error Output** (modify `src/error.ts`)
```typescript
export interface JsonError {
  code: string;
  message: string;
  details?: Record<string, JsonValue>;
  hint?: string;
  did_you_mean?: Suggestion[];  // ← ADD THIS
  fix_suggestion?: string;       // ← ADD THIS (auto-fix command)
}
```

3. **Integration in Fail Handler** (`src/index.ts`)
```typescript
.fail((msg, err, yargsInstance) => {
  const failure = normalizeFailure(msg, err ?? undefined);
  const suggestions = generateSuggestions(msg, yargsInstance);
  
  if (wantsJson) {
    outputJson(createEnvelope("error", "error", {}, [{
      ...toJsonError(failure),
      did_you_mean: suggestions,
      fix_suggestion: suggestions[0] 
        ? `astudio ${suggestions[0].suggestion}` 
        : undefined,
    }]));
  }
  // ...
});
```

**Example User Experience:**
```bash
$ astudio devv web
Error: Unknown command: devv

Did you mean?
  dev          (confidence: 0.89)

Fix suggestion:
  astudio dev web --exec

$ astudio dev --update
Error: Unknown argument: update

Did you mean?
  --exec       (confidence: 0.67)

$ astudio bulid web
Error: Unknown command: bulid

Did you mean?
  build        (confidence: 0.91)
  
Fix suggestion:
  astudio build web --exec
```

---

### 2.3 Agent Self-Correction — `fix_suggestion` ❌

**Current State:** Generic hints like "Re-run with --exec"  
**Gap Impact:** Agents must manually construct corrected commands  
**Priority:** MEDIUM

**Required Implementation:**

1. **Command Reconstruction** (`src/utils/fix.ts` - NEW FILE)
```typescript
export interface FixSuggestion {
  description: string;
  command: string[];
  automated: boolean;  // Can be applied without user confirmation
}

export function generateFix(
  originalArgv: Record<string, unknown>,
  error: CliError
): FixSuggestion | undefined {
  switch (error.code) {
    case ERROR_CODES.policy:
      if (error.message.includes("--exec")) {
        return {
          description: "Add --exec flag to allow command execution",
          command: [...reconstructCommand(originalArgv), "--exec"],
          automated: false, // Security: requires explicit opt-in
        };
      }
      if (error.message.includes("--network")) {
        return {
          description: "Add --network flag to allow network access",
          command: [...reconstructCommand(originalArgv), "--network"],
          automated: false,
        };
      }
      if (error.message.includes("--write")) {
        return {
          description: "Add --write flag to allow file modifications",
          command: [...reconstructCommand(originalArgv), "--write"],
          automated: false,
        };
      }
      break;
      
    case ERROR_CODES.usage:
      // Suggest --help for usage errors
      return {
        description: `View help for ${originalArgv._?.[0] ?? "command"}`,
        command: ["astudio", "help", String(originalArgv._?.[0] ?? "")],
        automated: true,
      };
  }
  return undefined;
}

function reconstructCommand(argv: Record<string, unknown>): string[] {
  const cmd = ["astudio", ...(argv._ as string[] ?? [])];
  
  for (const [key, value] of Object.entries(argv)) {
    if (key === "_" || key === "$0") continue;
    if (value === undefined) continue;
    if (value === false) continue;
    
    const flag = key.length === 1 ? `-${key}` : `--${key}`;
    
    if (value === true) {
      cmd.push(flag);
    } else {
      cmd.push(flag, String(value));
    }
  }
  
  return cmd;
}
```

---

### 2.4 Progressive Help ❌

**Current State:** Static `--help` output with all options  
**Gap Impact:** Overwhelming for new users; agents can't discover incrementally  
**Priority:** LOW-MEDIUM

**Required Implementation:**

1. **Help Levels** (`src/utils/help.ts` - NEW FILE)
```typescript
export type HelpLevel = "minimal" | "common" | "full" | "expert";

export interface HelpOptions {
  level: HelpLevel;
  command?: string;
  topic?: string;
}

export function getHelp(options: HelpOptions): string {
  switch (options.level) {
    case "minimal":
      return getMinimalHelp(options.command);
    case "common":
      return getCommonHelp(options.command);
    case "full":
      return getFullHelp(options.command);
    case "expert":
      return getExpertHelp(options.command);
  }
}
```

2. **New Help Flags:**
   - `--help` → `common` level (default)
   - `--help=minimal` → One-line usage only
   - `--help=full` → All options including advanced
   - `--help=expert` → Include internal/debug options
   - `--help-topics` → List available help topics

3. **Topic-Based Help:**
```bash
# Show only safety-related help
$ astudio --help-topic=safety
Safety Flags:
  --exec      Allow external command execution
  --network   Allow network access
  --write     Allow file modifications
  --dry-run   Preview without making changes

# Show only output format help
$ astudio --help-topic=output
Output Formats:
  --json      Machine-readable JSON output
  --plain     Stable key=value line output
  --no-color  Disable colored output
  -q, --quiet  Errors only
  -v, --verbose  Extra details + timings
```

4. **Examples Integration:**
```typescript
// Add to command definitions
.command(
  "dev [target]",
  "Start development servers",
  {
    examples: [
      ["astudio dev web --exec", "Start web dev server"],
      ["astudio dev all --exec", "Start all dev servers"],
      ["astudio dev mcp --exec --network", "Start MCP server with network"],
    ],
    helpTopics: ["workflow", "safety"],
  }
)
```

---

### 2.5 Field Masking ❌

**Current State:** All data fields visible in all contexts  
**Gap Impact:** Sensitive data (tokens, paths) exposed in logs/output  
**Priority:** HIGH (Security)

**Required Implementation:**

1. **Masking Configuration** (`src/utils/mask.ts` - NEW FILE)
```typescript
export type SensitivityLevel = "public" | "internal" | "confidential" | "secret";

export interface FieldMask {
  field: string;
  level: SensitivityLevel;
  mask?: "full" | "partial" | "hash" | "redact";
}

// Default masks for common sensitive fields
export const DEFAULT_MASKS: FieldMask[] = [
  { field: "token", level: "secret", mask: "redact" },
  { field: "api_key", level: "secret", mask: "redact" },
  { field: "password", level: "secret", mask: "redact" },
  { field: "secret", level: "secret", mask: "redact" },
  { field: "auth", level: "confidential", mask: "partial" },
  { field: "cookie", level: "confidential", mask: "partial" },
  { field: "home", level: "internal", mask: "partial" },
  { field: "user", level: "internal", mask: "partial" },
];

export function maskValue(
  value: string,
  mask: FieldMask["mask"]
): string {
  switch (mask) {
    case "full":
      return "*".repeat(value.length);
    case "partial":
      if (value.length <= 8) return "****";
      return value.slice(0, 4) + "..." + value.slice(-4);
    case "hash":
      return `[sha256:${hashValue(value).slice(0, 16)}...]`;
    case "redact":
    default:
      return "[REDACTED]";
  }
}

export function maskObject<T extends Record<string, unknown>>(
  obj: T,
  masks: FieldMask[] = DEFAULT_MASKS,
  outputMode: "json" | "plain" | "debug" = "json"
): T {
  if (outputMode === "debug") return obj; // No masking in debug
  
  const result = { ...obj };
  
  for (const mask of masks) {
    const keys = Object.keys(result).filter(k => 
      k.toLowerCase().includes(mask.field.toLowerCase())
    );
    
    for (const key of keys) {
      const value = result[key];
      if (typeof value === "string") {
        result[key] = maskValue(value, mask.mask) as unknown as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}
```

2. **Integration with Output** (`src/utils/output.ts`)
```typescript
export function createEnvelope(
  summary: string,
  status: JsonEnvelope["status"],
  data: Record<string, JsonValue>,
  errors: JsonError[] = [],
  options: { 
    traceContext?: TraceContext;
    maskFields?: boolean;
  } = {}
): JsonEnvelope {
  const maskedData = options.maskFields !== false 
    ? maskObject(data) 
    : data;
    
  return {
    schema: COMMAND_SCHEMA,
    meta: {
      tool: TOOL_NAME,
      version: getToolVersion(),
      timestamp: nowIso(),
      request_id: options.traceContext?.requestId,
      trace_id: options.traceContext?.traceId,
    },
    summary,
    status,
    data: maskedData,
    errors,
  };
}
```

3. **New Flag:** `--show-sensitive` (expert only)
   - Bypasses field masking
   - Requires explicit opt-in
   - Logs warning about sensitive data exposure

---

## 3. Implementation Roadmap

### Phase 1: Security & Observability (Immediate)

| Task | File | Effort | Status |
|------|------|--------|--------|
| Add trace ID support | `src/utils/trace.ts` | 4h | 📝 Planned |
| Add field masking | `src/utils/mask.ts` | 4h | 📝 Planned |
| Update envelope type | `src/types.ts` | 1h | 📝 Planned |
| Integrate masking in output | `src/utils/output.ts` | 2h | 📝 Planned |
| Add `--show-sensitive` flag | `src/index.ts` | 1h | 📝 Planned |
| Tests for masking | `tests/mask.test.ts` | 2h | 📝 Planned |

**Deliverable:** Secure by default with full observability

### Phase 2: Agent Experience (Short-term)

| Task | File | Effort | Status |
|------|------|--------|--------|
| Add Levenshtein distance util | `src/utils/suggest.ts` | 3h | 📝 Planned |
| Implement command suggestions | `src/utils/suggest.ts` | 2h | 📝 Planned |
| Add `did_you_mean` to errors | `src/error.ts` | 2h | 📝 Planned |
| Implement fix suggestions | `src/utils/fix.ts` | 3h | 📝 Planned |
| Integrate in fail handler | `src/index.ts` | 2h | 📝 Planned |
| Tests for suggestions | `tests/suggest.test.ts` | 2h | 📝 Planned |

**Deliverable:** Self-correcting CLI for agentic use

### Phase 3: Progressive Help (Medium-term)

| Task | File | Effort | Status |
|------|------|--------|--------|
| Define help levels | `src/utils/help.ts` | 2h | 📝 Planned |
| Implement level-based help | `src/utils/help.ts` | 3h | 📝 Planned |
| Add topic system | `src/utils/help.ts` | 2h | 📝 Planned |
| Update command definitions | `src/commands/*.ts` | 4h | 📝 Planned |
| Add `--help-topic` flag | `src/index.ts` | 1h | 📝 Planned |
| Tests for help system | `tests/help.test.ts` | 2h | 📝 Planned |

**Deliverable:** Discoverable, user-friendly documentation

### Phase 4: Polish & Documentation (Ongoing)

| Task | Effort | Status |
|------|--------|--------|
| Update CLI_SPEC.md | 2h | 📝 Planned |
| Add examples to all commands | 4h | 📝 Planned |
| Agent integration guide | 4h | 📝 Planned |
| Compliance test suite | 4h | 📝 Planned |

---

## 4. Specification Additions

### 4.1 Updated JSON Envelope Schema

```typescript
interface JsonEnvelope {
  schema: "astudio.command.v1";
  meta: {
    tool: string;
    version: string;
    timestamp: string;
    request_id: string;      // NEW: Unique request ID
    trace_id?: string;       // NEW: Distributed trace ID
    parent_id?: string;      // NEW: Parent span ID
  };
  summary: string;
  status: "success" | "warn" | "error";
  data: Record<string, JsonValue>;
  errors: JsonError[];
}

interface JsonError {
  code: string;
  message: string;
  details?: Record<string, JsonValue>;
  hint?: string;
  did_you_mean?: Suggestion[];   // NEW: Auto-correction suggestions
  fix_suggestion?: string;       // NEW: Corrected command string
}

interface Suggestion {
  type: "command" | "flag" | "value";
  input: string;
  suggestion: string;
  confidence: number;
}
```

### 4.2 New Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `ASTUDIO_TRACE_ID` | Inject external trace ID | (none) |
| `TRACEPARENT` | W3C trace context | (none) |
| `_X_AMZN_TRACE_ID` | AWS X-Ray trace | (none) |
| `ASTUDIO_TRACE_SAMPLE_RATE` | Trace sampling rate | `1.0` |
| `ASTUDIO_SENSITIVITY` | Default field sensitivity | `confidential` |

### 4.3 New CLI Flags

| Flag | Purpose | Level |
|------|---------|-------|
| `--show-sensitive` | Disable field masking | expert |
| `--help=minimal` | Show minimal help | common |
| `--help=full` | Show full help | common |
| `--help=expert` | Show expert options | expert |
| `--help-topic=<topic>` | Show topic-specific help | common |

---

## 5. Compliance Checklist

### Gold Standard 2026 Requirements

- [x] Structured JSON envelopes with schema versioning
- [x] Semantic exit codes (0, 1, 2, 3, 4, 130)
- [x] Machine-readable error codes
- [x] `--dry-run` support
- [x] `--json` / `--plain` dual-mode output
- [x] Safety gates (`--exec`, `--network`, `--write`)
- [x] NO_COLOR compliance
- [x] Proper stderr/stdout separation
- [ ] **Trace IDs in envelopes** ← Gap
- [ ] **Field masking for sensitive data** ← Gap
- [ ] **`did_you_mean` suggestions** ← Gap
- [ ] **`fix_suggestion` for errors** ← Gap
- [ ] **Progressive help levels** ← Gap
- [ ] **Topic-based help** ← Gap

---

## 6. Appendix: Reference Implementation

### Current File Structure

```
packages/cli/
├── src/
│   ├── index.ts           # Entry point, yargs setup
│   ├── constants.ts       # EXIT_CODES, ERROR_CODES, etc.
│   ├── error.ts           # CliError class, normalizeFailure
│   ├── types.ts           # TypeScript types
│   ├── commands/          # Command implementations
│   │   ├── build.ts
│   │   ├── components.ts
│   │   ├── dev.ts
│   │   ├── doctor.ts
│   │   ├── format.ts
│   │   ├── index.ts
│   │   ├── lint.ts
│   │   ├── mcp.ts
│   │   ├── skills.ts
│   │   ├── test.ts
│   │   ├── tokens.ts
│   │   └── versions.ts
│   └── utils/
│       ├── output.ts      # createEnvelope, outputJson
│       ├── env.ts         # Environment helpers
│       ├── json.ts        # JSON utilities
│       ├── logger.ts      # Logging
│       ├── config.ts      # Config loading
│       ├── exec.ts        # Process execution
│       ├── health.ts      # Health checks
│       ├── mcp.ts         # MCP utilities
│       └── index.ts
├── tests/
└── CLI_SPEC.md            # Original spec
```

### Proposed New Files

```
packages/cli/src/utils/
├── trace.ts      # NEW: Trace ID generation and propagation
├── mask.ts       # NEW: Field masking for sensitive data
├── suggest.ts    # NEW: Command/flag suggestions (did_you_mean)
├── fix.ts        # NEW: Fix suggestion generation
└── help.ts       # NEW: Progressive help system
```

---

**Document End**

*Generated from analysis of packages/cli/ on 2026-04-07*
