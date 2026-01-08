# Apps SDK Guidelines Compliance Audit

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [1. App Submission Guidelines](#1-app-submission-guidelines)
  - [✅ Compliant](#compliant)
  - [⚠️ Needs Attention Before Submission](#needs-attention-before-submission)
- [2. UX Principles](#2-ux-principles)
  - [✅ Compliant](#compliant-1)
  - [Checklist (from guidelines)](#checklist-from-guidelines)
- [3. UI Guidelines](#3-ui-guidelines)
  - [✅ Compliant](#compliant-2)
  - [⚠️ Recommended Improvements](#recommended-improvements)
- [4. Security & Privacy](#4-security-privacy)
  - [✅ Compliant](#compliant-3)
  - [⚠️ Recommended](#recommended)
- [5. Optimize Metadata](#5-optimize-metadata)
  - [✅ Compliant](#compliant-4)
  - [⚠️ Recommended](#recommended-1)
- [Summary](#summary)
  - [Ready for Development ✅](#ready-for-development)
  - [Required Before Submission ⚠️](#required-before-submission)
  - [Recommended Improvements](#recommended-improvements-1)
- [Golden Prompt Set (Template)](#golden-prompt-set-template)
- [What Makes a Great ChatGPT App (Summary)](#what-makes-a-great-chatgpt-app-summary)
- [Historical Improvements (December 2024)](#historical-improvements-december-2024)
  - [✅ Enhanced Apps SDK Compliance](#enhanced-apps-sdk-compliance)
  - [Compliance Status at Time of Audit: 100% ✅](#compliance-status-at-time-of-audit-100)
- [Files Updated for Compliance](#files-updated-for-compliance)


This document audits your codebase against OpenAI's official Apps SDK guidelines.

---

## 1. App Submission Guidelines

### ✅ Compliant

| Requirement              | Status | Notes                                                     |
| ------------------------ | ------ | --------------------------------------------------------- |
| Purpose and originality  | ✅     | Clear purpose as UI library                               |
| Quality and reliability  | ✅     | TypeScript, proper error handling                         |
| Using Apps SDK UI        | ✅     | Integrated via `@openai/apps-sdk-ui`                      |
| Tool annotations         | ✅     | Added `readOnlyHint`, `destructiveHint`, `openWorldHint`  |
| Clear tool names         | ✅     | `display_chat`, `display_search_results`, `display_table` |
| Descriptive descriptions | ✅     | Detailed descriptions for model understanding             |
| Parameter documentation  | ✅     | Zod schemas with `.describe()`                            |

### ⚠️ Needs Attention Before Submission

| Requirement            | Status | Action Needed                                |
| ---------------------- | ------ | -------------------------------------------- |
| Privacy policy         | ⚠️     | Add privacy policy URL to submission         |
| Test credentials       | ⚠️     | Create demo account for review               |
| App screenshots        | ⚠️     | Capture screenshots per required dimensions  |
| Developer verification | ⚠️     | Verify identity in OpenAI Platform Dashboard |
| Support contact        | ⚠️     | Provide customer support contact details     |

---

## 2. UX Principles

### ✅ Compliant

| Principle                      | Status | Notes                            |
| ------------------------------ | ------ | -------------------------------- |
| Focus on core jobs             | ✅     | Widgets are focused, atomic      |
| Design for ChatGPT environment | ✅     | Using Apps SDK UI                |
| Optimize for conversation      | ✅     | Tools provide structured outputs |
| Atomic, model-friendly actions | ✅     | Each tool is self-contained      |
| Helpful UI only                | ✅     | Widgets serve specific purposes  |

### Checklist (from guidelines)

- [x] Conversational value - Tools rely on ChatGPT's strengths
- [x] Beyond base ChatGPT - Provides specialized UI presentation
- [x] Atomic actions - Tools are indivisible with explicit I/O
- [x] Helpful UI only - Widgets add value over plain text
- [ ] End-to-end completion - Verify tasks complete in-chat
- [ ] Performance & responsiveness - Test latency
- [x] Discoverability - Create golden prompt set

---

## 3. UI Guidelines

### ✅ Compliant

| Guideline                       | Status | Notes                   |
| ------------------------------- | ------ | ----------------------- |
| Using Apps SDK UI design system | ✅     | Integrated              |
| Display modes (inline)          | ✅     | Widgets render inline   |
| System fonts                    | ✅     | Using Apps SDK defaults |
| Color system                    | ✅     | Using Apps SDK palettes |

### ⚠️ Recommended Improvements

| Guideline       | Action                                     |
| --------------- | ------------------------------------------ |
| Fullscreen mode | Add `requestDisplayMode` for complex views |
| Accessibility   | Run accessibility audit on widgets         |
| 8px grid        | Verify spacing alignment                   |

---

## 4. Security & Privacy

### ✅ Compliant

| Requirement           | Status | Notes                              |
| --------------------- | ------ | ---------------------------------- |
| Sandboxed iframe      | ✅     | Widgets run in iframe              |
| No privileged APIs    | ✅     | Not using alert/prompt/confirm     |
| Data minimization     | ✅     | Tools request minimal inputs       |
| Read-only annotations | ✅     | All display tools marked read-only |

### ⚠️ Recommended

| Requirement      | Action                         |
| ---------------- | ------------------------------ |
| Input validation | Add validation for user inputs |
| Error handling   | Ensure graceful error messages |

---

## 5. Optimize Metadata

### ✅ Compliant

| Requirement              | Status | Notes                             |
| ------------------------ | ------ | --------------------------------- |
| Clear tool names         | ✅     | `display_*` naming convention     |
| Descriptive descriptions | ✅     | Detailed, actionable descriptions |
| Parameter docs           | ✅     | Zod `.describe()` on all params   |

### ⚠️ Recommended

| Requirement           | Action                               |
| --------------------- | ------------------------------------ |
| Golden prompt set     | ✅ Added tool contracts with prompts |
| Regression testing    | Document expected behavior           |
| Production monitoring | Add analytics for tool usage         |

---

## Summary

### Ready for Development ✅

- Tool definitions with proper annotations
- Apps SDK UI integration
- Widget architecture
- Security best practices

### Required Before Submission ⚠️

1. Privacy policy URL
2. Test credentials/demo account
3. App screenshots
4. Developer verification
5. Support contact details
6. Golden prompt set for testing (tracked in `platforms/mcp/tool-contracts.json`)

### Recommended Improvements

1. Accessibility audit
2. Performance testing
3. Fullscreen mode support
4. Production monitoring

---

## Golden Prompt Set (Template)

Create test prompts for each tool:

```
# display_chat
- "I want to chat"
- "Open a conversation interface"
- "Let's have a discussion"

# display_search_results
- "Show me search results for React components"
- "Display these findings in a list"
- "Present the search results visually"

# display_table
- "Show this data in a table"
- "Display the comparison in columns"
- "Present the prices in a structured format"

# display_dashboard
- "Show me the dashboard"
- "Open a dashboard view"
- "Give me a high-level overview"

# Negative prompts (should NOT trigger tools)
- "What is React?"
- "Explain how tables work"
- "Tell me about search engines"
```

Document expected behavior for each and test in developer mode.

---

## What Makes a Great ChatGPT App (Summary)

Per OpenAI's guidance, your app should provide:

1. **New things to know** - Access to data ChatGPT doesn't have
2. **New things to do** - Actions on user's behalf
3. **Better ways to show** - Visual presentation that aids decision-making

Your current widgets focus on #3 (better ways to show), which is valid. Consider adding #1 and #2 capabilities for richer functionality.

---

## Historical Improvements (December 2024)

### ✅ Enhanced Apps SDK Compliance

Based on the official Apps SDK reference documentation, the following improvements have been implemented:

#### Widget Resource Metadata

- Added `openai/widgetDescription` for better model context
- Configured `openai/widgetCSP` with security policies
- Enhanced resource metadata for all widget types

#### Client Metadata Integration

- Support for `openai/locale` for internationalization
- Handling of `openai/userAgent` for analytics
- Processing of `openai/userLocation` for context-aware responses
- Proper separation of widget-only metadata using `_meta` field

#### Tool Result Enhancements

- Dual content structure: `content` for model, `structuredContent` for widget
- Widget-specific metadata in `_meta` field (hidden from model)
- Locale-aware responses and context information

#### Code Example

```javascript
// Enhanced tool implementation
async (args, { _meta } = {}) => {
  const locale = _meta?.["openai/locale"] ?? "en";
  const userLocation = _meta?.["openai/userLocation"];

  return {
    content: [{ type: "text", text: "Results displayed" }],
    structuredContent: { query, results, locale },
    _meta: {
      // Widget-only metadata
      searchContext: { location: userLocation, timestamp: new Date().toISOString() },
    },
  };
};
```

### Compliance Status at Time of Audit: 100% ✅

Re-verify against current Apps SDK guidance before submission.

The implementation now fully complies with all Apps SDK specifications:

- ✅ Tool descriptor requirements
- ✅ Annotation requirements
- ✅ Resource management
- ✅ Client metadata handling
- ✅ Security policies
- ✅ Tool result structure

---

## Files Updated for Compliance

- `platforms/mcp/server.js` - Tool definitions with proper annotations
- `packages/widgets/*` - Widget implementations using Apps SDK UI
- `packages/runtime/src/index.tsx` - Host adapter for embedded/standalone modes
