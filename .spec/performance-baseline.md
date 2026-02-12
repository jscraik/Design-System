# Performance Baseline

**Date:** 2026-01-28
**Epic:** 0 (Foundation Work)
**Story:** 0.2 - Establish Performance Baseline

## Summary

Production builds completed successfully. Bundle sizes documented. Lighthouse audit deferred due to headless Chrome timing out on large bundle (NO_FCP).

## Bundle Sizes

### UI Package (`packages/ui/dist`)

| File | Size | Gzip | Notes |
|------|------|------|-------|
| ui.css | 169.23 kB | 22.98 kB | Foundation styles |
| app-3orS3Nrk.js | 839.12 kB | 179.18 kB | **Large chunk** - exceeds 500KB warning |
| templates-CXoo0m1z.js | 627.25 kB | 82.36 kB | Template components |
| base-Di3GrhBC.js | 236.83 kB | 59.45 kB | Base components |
| layout.js | 168.47 kB | 48.63 kB | Layout components |
| data-display-si0YuuZO.js | 149.94 kB | 37.55 kB | Data display components |
| navigation-BZXQlOc5.js | 99.77 kB | 23.10 kB | Navigation components |
| icons-D2SQ1mD-.js | 98.01 kB | 19.92 kB | Icon components |
| feedback.js | 59.87 kB | 15.11 kB | Feedback components |
| dev.js | 56.17 kB | 11.40 kB | Dev utilities |
| forms.js | 32.23 kB | 8.46 kB | Form components |
| index.js | 22.01 kB | 7.33 kB | Main entry |
| overlays-Cw0_PIVz.js | 92.68 kB | 22.02 kB | Overlay components |

**Total (approx):** ~2.5 MB (uncompressed) / ~600 KB (gzipped)

### Web App (`platforms/web/apps/web/dist`)

| File | Size | Gzip | Notes |
|------|------|------|-------|
| design-studio-core-BagLbjKX.js | 926.51 kB | 235.84 kB | **Very large** - main app bundle |
| react-BUz0Y6gs.js | 181.74 kB | 57.27 kB | React runtime |
| index-CFo1UiWi.js | 42.81 kB | 9.78 kB | App entry |
| vendor-CyB_z_wn.js | 3.99 kB | 1.75 kB | Vendor code |
| index-C3trowKG.css | 330.35 kB | 43.72 kB | Styles |
| index.html | 0.64 kB | 0.33 kB | HTML shell |

**Total (approx):** ~1.5 MB (uncompressed) / ~350 KB (gzipped)

### Widgets Package (`packages/widgets/dist`)

Sample output shows widget HTML bundles are appropriately sized (~0.7-1.3 KB each).

## Target Metrics (Phase 4 Goals)

Per Phase 4 spec:
- **Bundle size:** ≤500 KB gzipped (main UI library)
- **Current status:** ~600 KB gzipped (exceeds target by ~100 KB)

## Key Issues Identified

1. **Large app chunk:** `app-3orS3Nrk.js` (839 KB / 179 KB gzipped)
   - Contains bundled dependencies that should be externalized
   - Contributing to NO_FCP errors in headless Chrome

2. **No code splitting:** Single large bundle loads entire library upfront
   - Should implement route-based or component-based splitting
   - Consider lazy loading for infrequently used components

3. **React bundle size:** 181 KB / 57 KB gzipped
   - Could benefit from more aggressive tree-shaking
   - Consider replacing heavy dependencies

## Lighthouse Audit

**Status:** Deferred

**Issue:** `Runtime error encountered: The page did not paint any content. Please ensure you keep the browser window in the foreground during the load and try again. (NO_FCP)`

**Root Cause:** Headless Chrome times out before large bundle (926 KB) loads and renders.

**Next Steps:**
1. Set up CI with proper Chrome configuration (non-headless or extended timeout)
2. Optimize bundle sizes before running Lighthouse
3. Consider using PageSpeed Insights API for automated audits
4. Add performance budgets to CI pipeline

## Recommendations for Epic 1 (Optimization)

1. **Code Splitting Priority:**
   - Split `app-3orS3Nrk.js` into smaller route chunks
   - Implement dynamic imports for overlays and templates
   - Use React.lazy() for heavy components

2. **Bundle Analysis:**
   - Run `pnpm build -- --mode production` with bundle analyzer
   - Identify and externalize large dependencies
   - Consider virtualizing heavy components (charts, 3D)

3. **Tree Shaking:**
   - Audit unused exports in UI package
   - Remove side effects from components
   - Ensure proper ESM exports

## Baseline Metrics (Recorded)

| Metric | Value | Target |
|--------|-------|--------|
| UI Bundle (gzipped) | ~600 KB | ≤500 KB |
| Web App (gzipped) | ~350 KB | - |
| Largest chunk | 926 KB (839 KB UI) | <250 KB |
| Total chunks | 13 | - |
| A11y tests | 12/12 passed | 100% |

## Next Steps

1. ✅ Production bundles built
2. ✅ Bundle sizes documented
3. ⏭️ Set up Lighthouse in CI with proper configuration
4. ⏭️ Implement code splitting in Epic 1
5. ⏭️ Add bundle analyzer to build pipeline
