# Widget Bundling Analysis

**Status**: ✅ Current approach is optimized for ChatGPT embedding use case

---

## Executive Summary

The Design System widget bundling is **already well-optimized** for its primary use case: self-contained widget bundles for ChatGPT embedding via MCP.

**Key Finding**: The 596KB shared chunk (`index-*.js`) contains the entire `@design-studio/ui` library and is reused across all 22 widgets via modulepreload.

---

## Current Architecture

### Bundle Structure

```
dist/assets/
├── vendor-react-C7s9o2DG.js        (185 KB │ 58 KB gzipped)
├── vendor-three-core-D4EdNJXX.js     (703 KB │ 180 KB gzipped)
├── vendor-three-react-CrI2rZio.js     (167 KB │ 54 KB gzipped)
├── vendor-motion-BjihEFgE.js         (115 KB │ 38 KB gzipped)
├── vendor-three-post-CYInTbYN.js       (93 KB │ 22 KB gzipped)
├── index-CYBJUsK9.js               (597 KB │ 164 KB gzipped) ← @design-studio/ui
└── [widget-specific].js                (2-110 KB each)
```

### Widget Entry Points

Each widget HTML (e.g., `auth-demo/index.html`) contains:

```html
<script type="module" src="/assets/auth-demo-DJPXVihh.js"></script>
<link rel="modulepreload" href="/assets/vendor-react-C7s9o2DG.js">
<link rel="modulepreload" href="/assets/index-CYBJUsK9.js">
<link rel="modulepreload" href="/assets/widget-base-B8V_n4re.js">
```

**Key insight**: Shared chunks are preloaded via `<link rel="modulepreload">`, avoiding redundant downloads when multiple widgets are loaded.

---

## Analysis

### Why the Current Approach is Correct

1. **ChatGPT embedding requires self-contained bundles**
   - Widgets are served via MCP tool responses
   - No shared runtime or CDN infrastructure
   - Each widget HTML must work independently

2. **Shared chunk optimization is already in place**
   - The 596KB `index-*.js` chunk contains `@design-studio/ui`
   - All widgets preload and share this single chunk
   - Vendor chunks (React, Three.js, Framer Motion) are also shared

3. **Dynamic imports would NOT help**
   - Widgets are not a SPA with routes
   - Each widget is a standalone HTML entry point
   - Dynamic imports within a widget would only split that widget's code

### Bundle Size Breakdown

| Chunk | Size | Gzipped | Contains |
|--------|--------|-----------|----------|
| `vendor-react` | 185 KB | 58 KB | React + React DOM |
| `vendor-three-core` | 703 KB | 180 KB | Three.js core (solar-system, pizzaz-map) |
| `vendor-three-react` | 167 KB | 54 KB | @react-three/* packages |
| `vendor-motion` | 115 KB | 38 KB | Framer Motion |
| `index` (shared) | 597 KB | 164 KB | **@design-studio/ui** + shared widget code |
| Individual widgets | 2-110 KB | 1-32 KB | Widget-specific logic |

**Outlier**: `pizzaz-map` (1.68 MB │ 463 KB gzipped) includes Mapbox GL JS library.

---

## Recommendations

### ✅ Keep Current Approach

The current bundling strategy is **optimal for ChatGPT embedding**:
- Self-contained widget HTML files
- Shared vendor/UI chunks via modulepreload
- No external dependencies at runtime

### 🔮 Future Considerations

1. **ESM externals for alternative deployment**
   - For non-ChatGPT deployments (e.g., web app)
   - Could externalize `@design-studio/ui` to load from CDN
   - Requires build mode flag in Vite config

2. **Mapbox lazy loading**
   - The `pizzaz-map` widget (1.68 MB) could dynamic import Mapbox
   - Only load Mapbox when map widget is actually used
   - Trade-off: Initial load vs. delayed loading

3. **Widget-level code splitting**
   - Split complex widgets (pizzaz-map, solar-system) into route-based chunks
   - Use `import()` for lazy-loaded features within a widget

---

## Build Configuration

The widget bundling uses a custom Vite plugin (`widget-manifest.ts`) that:
1. Auto-discovers all `src/widgets/**/index.html` files
2. Creates separate Vite entry points for each widget
3. Generates a manifest mapping widget names to build hashes
4. Emits modulepreload links for shared chunks

This is **well-designed** for the use case.

---

**Conclusion**: No changes needed. The current bundling approach balances:
- Widget independence (required for ChatGPT embedding)
- Code sharing (via shared chunks)
- Build simplicity (auto-discovery + manifest generation)
