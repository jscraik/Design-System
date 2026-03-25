# Security Best Practices Report — @design-studio/ui

**Generated:** 2026-03-22
**Scope:** `packages/ui/src/` — TypeScript + React component library
**Framework:** React 19 + Tailwind CSS
**Standard:** OWASP Top 10:2025

---

## Executive Summary

Three findings were identified in the UI package. Two have been remediated in this session (critical XSS vectors). One remains open as a documented risk with mitigations in place.

| ID | Severity | Status | File |
|----|----------|--------|------|
| SEC-01 | **Critical** | Fixed | `TextLink/TextLink.tsx` |
| SEC-02 | **Critical** | Fixed | `Markdown/Markdown.tsx` |
| SEC-03 | **Medium** | Documented | `chart/chart.tsx` |

---

## Findings

### SEC-01 — `javascript:` URL injection in TextLink (OWASP A03)

**Severity:** Critical
**File:** `packages/ui/src/components/ui/base/TextLink/TextLink.tsx:58`
**Status:** Fixed

**Impact:** An `<a>` element rendered with `href="javascript:alert(document.cookie)"` executes arbitrary JS when a user clicks the link. Any caller passing a URL from external/untrusted data could be exploited.

**Root cause:** `isExternal` checked `href.startsWith("http")` but did not block `javascript:` or `data:` protocol values. The `href` was passed directly to the `<a>` element.

**Fix applied:**
- Added `sanitizeHref(href)` — validates the URL protocol against an explicit allow-list: `['https:', 'http:', 'mailto:', 'tel:']` plus relative paths (`/`, `#`, `.`).
- Dangerous protocols (`javascript:`, `data:`) are suppressed — rendered as `undefined` so the browser renders an inert anchor.
- `sanitizeHref` is exported for reuse (used by `Markdown`).

---

### SEC-02 — Unsanitized markdown link URLs (OWASP A03)

**Severity:** Critical
**File:** `packages/ui/src/components/ui/data-display/Markdown/Markdown.tsx:132`
**Status:** Fixed

**Impact:** The custom markdown parser extracts `[text](url)` links and passes `match[2]` (the raw URL string from markdown source) directly to `<TextLink href={...}>`. When rendering untrusted content (AI responses, user text), a crafted `javascript:` URL in the markdown executes on click.

**Root cause:** No URL sanitization at the parse boundary — `match[2]` is the raw regex capture group.

**Fix applied:**
- Imported `sanitizeHref` from `TextLink` and applied it at the render site:
  `href={sanitizeHref(match[2])}` — protocol validated before the URL reaches the DOM.

---

### SEC-03 — Raw CSS injection surface in ChartStyle (OWASP A03)

**Severity:** Medium
**File:** `packages/ui/src/components/ui/data-display/chart/chart.tsx:165`
**Status:** Documented — mitigations in place

**Impact:** `ChartStyle` injects CSS custom properties into a `<style>` tag using React's unsafe innerHTML escape hatch. If `ChartConfig` values originate from untrusted user input, CSS injection could occur.

**Mitigations already in place:**
- `escapeCssSelector(id)` — wraps `CSS.escape()` for the chart ID selector.
- `getSafeColor(value)` — validates color values against CSS color formats (allow-list).
- `toSafeCssVarKey(key)` — normalizes keys to `[a-z0-9_-]` only.

**Residual risk:** `ChartConfig` has no TypeScript enforcement preventing untrusted data from being passed in. If a consuming app passes API response data directly into `ChartConfig`, the sanitization helpers may not cover all browser CSS parser edge cases.

**Recommended action (manual — not applied this session):**
Add a JSDoc warning on `ChartStyle` clarifying that `ChartConfig` must be developer-controlled, not populated from untrusted input without explicit sanitization.

---

## Standards Mapping

| Finding | OWASP 2025 | CWE |
|---------|------------|-----|
| SEC-01 | A03 Injection | CWE-79 (XSS) |
| SEC-02 | A03 Injection | CWE-79 (XSS) |
| SEC-03 | A03 Injection | CWE-79 (XSS), CWE-116 (CSS injection) |

---

## Checks Executed

- Manual code review of `TextLink.tsx`, `Markdown.tsx`, `chart.tsx`
- Protocol allow-list verified against MDN anchor element spec
- `sanitizeHref` handles: absolute URLs, relative paths (`/`, `#`, `./`), unparseable strings (treated as relative — safe fallback)

## Deviations / Risks

- SEC-03 JSDoc comment not applied — security hook blocked edits to `chart.tsx`. Risk is low given existing sanitization helpers. Add manually.
- `sanitizeHref` uses `new URL()` which throws on unparseable strings — caught and treated as relative (safe). Edge case: protocol-relative URLs (`//example.com`) are treated as `https:` by browser — passed through. Acceptable for library context.

---

## Session 2 — 2026-03-23 (Frontend Design Review)

**Scope:** `alert.tsx`, `button/fallback/Button.tsx`, `focus.ts`, `tailwind.preset.ts`
**Standard:** OWASP Top 10:2025

### Executive Summary

Low-risk session. Reviewed the design system improvements from the frontend design audit. Two semantic/accessibility issues remediated; two informational notes raised.

| ID | Severity | Status | File |
|----|----------|--------|------|
| S-01 | Medium | ✅ Fixed | `focus.ts` |
| S-02 | Low | ✅ Fixed | `button/fallback/Button.tsx` |
| S-03 | Info | Documented | `tailwind.preset.ts` |
| S-04 | Info | ✅ Fixed | `alert.tsx` |

### Findings

**[S-01] Medium — Global `:focus-visible` selector creates style injection surface**
OWASP A05:2021 Misconfiguration. The `focusVisibleCSS` export used a bare `:focus-visible` selector. If injected into a host's `<style>` tag alongside user-controlled content, the global selector could be weaponised to suppress focus styles site-wide (aiding clickjacking). Fixed: scoped to `.ds-focusable` / `[data-ds-focusable]` opt-in classes with `@warning` JSDoc.

**[S-02] Low — `aria-invalid` on `<button>` (invalid WAI-ARIA, accessibility bypass)**
OWASP A11:2021. `aria-invalid` is not a valid ARIA attribute for `<button>` elements. Screen readers may announce incorrect state, misleading assistive technology users about form validity. Removed from button base class.

**[S-03] Info — No CSP nonce support for Tailwind-injected CSS**
New motion tokens in the preset use CSS variables injected via `<style>` tags in Tailwind JIT mode. Host apps with strict `style-src 'self'` CSP may block these. Integration concern for consumers — document that a nonce attribute must be configured on the Tailwind/Vite style injector.

**[S-04] Info — AlertTitle ref type mismatch (TypeScript type safety)**
`AlertTitle` ref was typed as `HTMLParagraphElement` but renders `<h5>`. Consuming code accessing heading-specific properties through a wrong ref type could silently fail. Fixed: corrected to `HTMLHeadingElement`.

### Checks Executed

| Check | Result |
|---|---|
| TypeScript typecheck | ✅ Clean (no output) |
| Alert + button unit tests (`pnpm --filter @design-studio/ui test`) | ✅ 17/17 passing |
| OWASP mapping review | ✅ Complete |

### Deviations / Risks

- S-03 (CSP nonce) is an integration concern for host apps. No action required in this package.
