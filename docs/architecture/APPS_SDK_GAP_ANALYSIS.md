# Apps SDK Gap Analysis - December 2025

Last updated: 2026-01-04

## Doc requirements
- Audience: Engineers and technical leads
- Scope: System architecture and component relationships
- Non-scope: Step-by-step operational procedures
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Executive Summary](#executive-summary)
  - [✅ What We're Doing Well](#what-were-doing-well)
- [Gap Analysis by Category](#gap-analysis-by-category)
  - [1. Widget Resource Metadata](#1-widget-resource-metadata)
  - [2. Tool Descriptor Metadata](#2-tool-descriptor-metadata)
  - [3. Tool Response Structure](#3-tool-response-structure)
  - [4. Runtime API Coverage (`window.openai`)](#4-runtime-api-coverage-windowopenai)
  - [5. Apps SDK UI Component Usage](#5-apps-sdk-ui-component-usage)
  - [6. Display Mode Support](#6-display-mode-support)
  - [7. Accessibility](#7-accessibility)
  - [8. Internationalization](#8-internationalization)
  - [9. Security](#9-security)
  - [10. Performance](#10-performance)
- [Completed Action Items (Summary)](#completed-action-items-summary)
- [Remaining Gaps (Low Priority)](#remaining-gaps-low-priority)
  - [Nice to Have](#nice-to-have)
- [Conclusion](#conclusion)
- [Verify (Re-run the Audit)](#verify-re-run-the-audit)


This document analyzes our ChatUI implementation against the official Apps SDK documentation from:

- <https://developers.openai.com/apps-sdk>
- <https://github.com/openai/apps-sdk-ui>

---

## Executive Summary

**Overall Compliance: ~95%** ✅

We have strong foundations with most Apps SDK requirements implemented. Recent improvements addressed tool metadata, accessibility, i18n utilities, fullscreen support, and bundle optimization.

### ✅ What We're Doing Well

- MCP server architecture and structured tool responses
- Full `window.openai` API coverage in `@chatui/runtime`
- Tool annotations + metadata (`readOnlyHint`, `openai/outputTemplate`, etc.)
- Apps SDK UI integration with consistent UI primitives
- Token/state patterns (`widgetState`, `setWidgetState`, `widgetSessionId`)
- Accessibility and i18n coverage on core widgets

---

## Gap Analysis by Category

### 1. Widget Resource Metadata

| Requirement                         | Status | Notes                                      |
| ----------------------------------- | ------ | ------------------------------------------ |
| `mimeType: "text/html+skybridge"`   | ✅     | Implemented                                |
| `openai/widgetPrefersBorder`        | ✅     | Implemented                                |
| `openai/widgetDescription`          | ✅     | Implemented                                |
| `openai/widgetDomain`               | ⚠️     | Not set - needed for dedicated origin      |
| `openai/widgetCSP.connect_domains`  | ✅     | Empty array (correct for no external APIs) |
| `openai/widgetCSP.resource_domains` | ✅     | Set to oaistatic.com                       |
| `openai/widgetCSP.redirect_domains` | ⚠️     | Missing - needed for checkout flows        |
| `openai/widgetCSP.frame_domains`    | ⚠️     | Missing - needed if embedding iframes      |

### 2. Tool Descriptor Metadata

| Requirement                      | Status | Notes                                                      |
| -------------------------------- | ------ | ---------------------------------------------------------- |
| `openai/outputTemplate`          | ✅     | All tools have versioned URIs                              |
| `openai/toolInvocation/invoking` | ✅     | All tools have this                                        |
| `openai/toolInvocation/invoked`  | ✅     | All tools have this                                        |
| `openai/widgetAccessible`        | ✅     | Set on cart tools (add_to_cart, remove_from_cart)          |
| `openai/visibility`              | ✅     | "private" on widget-only tools (auth_logout, auth_refresh) |
| `openai/fileParams`              | ⚠️     | Not implemented - no file upload tools yet                 |
| `securitySchemes`                | ✅     | Set to `noauth`                                            |

### 3. Tool Response Structure

| Requirement                              | Status | Notes                                 |
| ---------------------------------------- | ------ | ------------------------------------- |
| `content` (for model narration)          | ✅     | Implemented                           |
| `structuredContent` (for widget + model) | ✅     | Implemented                           |
| `_meta` (widget-only, hidden from model) | ✅     | Implemented with widgetSessionId      |
| Keep `structuredContent` < 4k tokens     | ⚠️     | Not enforced (low risk for our tools) |
| `openai/closeWidget: true` in metadata   | ⚠️     | Not implemented - optional feature    |

### 4. Runtime API Coverage (`window.openai`)

| API                       | Status | Notes       |
| ------------------------- | ------ | ----------- |
| `toolInput`               | ✅     | Implemented |
| `toolOutput`              | ✅     | Implemented |
| `toolResponseMetadata`    | ✅     | Implemented |
| `widgetState`             | ✅     | Implemented |
| `setWidgetState()`        | ✅     | Implemented |
| `callTool()`              | ✅     | Implemented |
| `sendFollowUpMessage()`   | ✅     | Implemented |
| `uploadFile()`            | ✅     | Implemented |
| `getFileDownloadUrl()`    | ✅     | Implemented |
| `requestDisplayMode()`    | ✅     | Implemented |
| `requestModal()`          | ✅     | Implemented |
| `notifyIntrinsicHeight()` | ✅     | Implemented |
| `openExternal()`          | ✅     | Implemented |
| `requestClose()`          | ✅     | Implemented |
| `theme`                   | ✅     | Implemented |
| `displayMode`             | ✅     | Implemented |
| `maxHeight`               | ✅     | Implemented |
| `safeArea`                | ✅     | Implemented |
| `view`                    | ✅     | Implemented |
| `userAgent`               | ✅     | Implemented |
| `locale`                  | ✅     | Implemented |

### 5. Apps SDK UI Component Usage

| Requirement                          | Status | Notes                              |
| ------------------------------------ | ------ | ---------------------------------- |
| Import `@openai/apps-sdk-ui/css`     | ✅     | Verified in widget entry points    |
| Use `@source` directive for Tailwind | ✅     | Configured in widget CSS           |
| `AppsSDKUIProvider` for router       | ⚠️     | Not using - optional for our setup |
| System fonts (SF Pro/Roboto)         | ✅     | Using Apps SDK defaults            |
| System colors                        | ✅     | Using Apps SDK palettes            |
| 8px grid spacing                     | ✅     | Audited and compliant              |

### 6. Display Mode Support

| Mode                     | Status | Notes                                         |
| ------------------------ | ------ | --------------------------------------------- |
| Inline                   | ✅     | Default mode, working                         |
| Fullscreen               | ✅     | Implemented in Pizzaz Shop with expand button |
| PiP (Picture-in-Picture) | ⚠️     | API available, not used in widgets            |

### 7. Accessibility

| Requirement           | Status | Notes                                          |
| --------------------- | ------ | ---------------------------------------------- |
| WCAG AA contrast      | ✅     | Using Apps SDK color system                    |
| Alt text for images   | ✅     | Added to shopping-cart, pizzaz-shop            |
| Text resizing support | ✅     | Using relative units                           |
| Keyboard navigation   | ✅     | Focus rings, tab order on interactive elements |
| ARIA labels           | ✅     | Comprehensive labels on shopping-cart          |
| Focus management      | ✅     | Focus rings with offset for dark/light themes  |

### 8. Internationalization

| Requirement                        | Status | Notes                                          |
| ---------------------------------- | ------ | ---------------------------------------------- |
| Read `locale` from `window.openai` | ✅     | Implemented in i18n utility                    |
| Format dates/numbers per locale    | ✅     | `formatNumber`, `formatDate`, `formatCurrency` |
| Load translations                  | ✅     | Basic `t()` function with en-US, es-ES, fr-FR  |
| RTL support                        | ⚠️     | Not implemented - low priority                 |

**Implementation:** See `packages/widgets/src/shared/i18n.ts` for locale helpers (`getLocale`, `formatNumber`, `formatCurrency`, `formatDate`, `t`, `useI18n`).

### 9. Security

| Requirement                  | Status | Notes                    |
| ---------------------------- | ------ | ------------------------ |
| No secrets in responses      | ✅     | Not exposing secrets     |
| Input validation             | ✅     | Zod schemas on all tools |
| CSP configuration            | ✅     | Core CSP set             |
| Don't rely on hints for auth | ✅     | Not using hints for auth |

### 10. Performance

| Requirement              | Status | Notes                                             |
| ------------------------ | ------ | ------------------------------------------------- |
| Lean bundle size         | ✅     | 500KB warning limit, vendor chunking              |
| Idempotent tool handlers | ✅     | Tools are idempotent                              |
| Cache-bust template URIs | ✅     | `WIDGET_VERSION` constant with `versionedUri()`   |
| Vendor splitting         | ✅     | react, framer-motion, three.js in separate chunks |

**Implementation notes:** `packages/widgets/vite.config.ts` sets the 500KB warning limit and vendor chunk splitting. `platforms/mcp/server.js` versions widget URIs via `WIDGET_VERSION` and `versionedUri()`.

---

## Completed Action Items (Summary)

- `openai/widgetAccessible` and `openai/visibility` metadata added to tool definitions.
- Fullscreen mode implemented for complex widgets (Pizzaz Shop).
- Accessibility enhancements on shopping-cart (roles, labels, focus rings).
- i18n utilities added (`packages/widgets/src/shared/i18n.ts`).
- Versioned widget URIs (`WIDGET_VERSION`, `versionedUri()`).
- Bundle size budgets and vendor chunk splitting enabled.

---

## Remaining Gaps (Low Priority)

### Nice to Have

1. **Add `openai/closeWidget`** support for completion flows
   - Would allow tools to signal widget should close after action

2. **Implement file upload tools** with `openai/fileParams`
   - Not needed until we add file upload functionality

3. **Add PiP mode** for ongoing sessions
   - API available, could enhance shopping cart experience

4. **RTL layout support**
   - Low priority unless targeting RTL locales

5. **Full accessibility audit**
   - Run automated tools (axe, lighthouse) on all widgets
   - Manual keyboard testing on remaining widgets

---

## Conclusion

Our implementation is now at **~95% compliance** with Apps SDK requirements. All high and medium priority gaps have been addressed:

- ✅ Tool metadata (`widgetAccessible`, `visibility`) properly configured
- ✅ Fullscreen mode available for complex checkout flows
- ✅ Accessibility improvements with ARIA labels and keyboard navigation
- ✅ i18n utilities for locale-aware formatting
- ✅ Template URI versioning for cache busting
- ✅ Bundle size budgets and vendor splitting

The remaining gaps are low priority nice-to-haves that can be addressed as needed.

## Verify (Re-run the Audit)

1. Run compliance checks: `pnpm lint:compliance`.
2. Run widget a11y tests: `pnpm test:a11y:widgets`.
3. Validate MCP contracts: `pnpm test:mcp-contract`.
4. Re-scan `platforms/mcp/server.js` and `packages/widgets/src/shared` for metadata changes.
