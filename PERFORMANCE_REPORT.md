# Qattah App — Performance Report

**Date:** 2026-06-20  
**Target:** Every page/endpoint under 50ms  
**Result:** ✅ **All endpoints at 1ms avg** (well under 50ms)

---

## Baseline (Before Optimization)

The app was already fast server-side (Vite preview on localhost), but had several issues:

| Area | Before |
|------|--------|
| Dependencies | 8 npm deps (5 unused: papaparse, react-router-dom, react-to-print, sqlite3, uuid) |
| Compression | Gzip only, no brotli |
| Font Loading | Render-blocking Google Fonts stylesheet |
| DarkModeToggle | Broken `ltr:`/`rtl:` Tailwind variants (not configured) → toggle knob position wrong |
| Key Handlers | Deprecated `onKeyPress` in DishList + PeopleList |
| Tests | Archived tests in `.archive/` being executed by vitest |
| calculateTotals | O(dishes × people × assignments) complexity |

---

## After Optimization

### Server Response Times (10 rounds each, with warm-up)

| Endpoint | Avg | Min | Max | Size |
|----------|-----|-----|-----|------|
| HTML (index) | 1ms | 1ms | 1ms | 3.5KB |
| JS-App | 1ms | 1ms | 1ms | 22.5KB |
| JS-Runtime | 1ms | 1ms | 1ms | 559B |
| JS-Icons | 1ms | 1ms | 1ms | 14.4KB |
| JS-Other | 1ms | 1ms | 1ms | 3.7KB |
| JS-React (largest) | 1ms | 1ms | 2ms | 173.6KB |
| CSS | 1ms | 1ms | 2ms | 26.0KB |
| manifest.webmanifest | 1ms | 1ms | 1ms | 870B |
| manifest.json | 1ms | 1ms | 1ms | 1.3KB |
| robots.txt | 1ms | 1ms | 1ms | 63B |
| sw.js | 1ms | 1ms | 1ms | 2.6KB |
| registerSW.js | 1ms | 1ms | 1ms | 134B |

**✅ ALL ENDPOINTS UNDER 50ms**

---

## Changes Summary

### 1. Removed Unused Dependencies
- `papaparse` — not imported anywhere
- `react-router-dom` — not imported (SPA with no routing)
- `react-to-print` — not imported
- `sqlite3` — not imported (app uses localStorage only)
- `uuid` — not imported
- `@types/node` — not needed

### 2. Brotli Compression
- Added `scripts/brotli-gen.js` post-build script
- Generates `.br` files for all text-based assets
- **335KB total savings** across 16 files
- Largest win: vendor-react 177KB → 48KB (73% reduction)

### 3. Non-Blocking Font Loading
- Changed from render-blocking `<link rel="stylesheet">` to preload + async pattern
- Uses `media="print" onload="this.media='all'"` technique
- Includes `<noscript>` fallback

### 4. Frontend Fixes
- **DarkModeToggle RTL fix**: Replaced non-existent `ltr:`/`rtl:` Tailwind variants with `left-1`/`right-1` positioning that works correctly in RTL
- **System theme listener**: Toggle now responds to OS dark/light changes when user hasn't set explicit preference
- **Deprecated `onKeyPress`**: Replaced with `onKeyDown` in DishList and PeopleList
- **Removed dead props**: `onPrint` and `onShare` removed from ResultsTable interface
- **Accessibility**: Added `maximum-scale=5.0` to viewport meta

### 5. Performance Optimizations
- **calculateTotals**: Replaced O(n²) `Object.entries().filter().map()` with O(n) reverse index using `Map<number, string[]>`
- **Gzip threshold**: Lowered to 0 so all files get compressed

### 6. Tooling
- **vitest**: Excluded `.archive/`, `dist/`, `coverage/` from test discovery (was running dead tests)
- **eslint**: Ignores `.archive/`, `coverage/`, `server.js`, `scripts/`
- **Benchmark script**: `bench.sh` — repeatable, 10 rounds per endpoint with warm-up

---

## Bundle Sizes (gzipped)

| Asset | Raw | Gzip | Brotli |
|-------|-----|------|--------|
| vendor-react.js | 177KB | 55KB | 48KB |
| index.css | 27KB | 5KB | 4.2KB |
| index.js | 23KB | 6.5KB | 5.5KB |
| vendor-icons.js | 15KB | 4.6KB | 4.1KB |
| vendor-other.js | 4KB | 1.7KB | 1.5KB |
| rolldown-runtime.js | 0.6KB | 0.4KB | 0.3KB |
| **Total** | **~247KB** | **~73KB** | **~64KB** |

---

## Commits

1. `88824bb` — perf: optimize server with compression, caching, security headers + fix vite config
2. `c868325` — fix: RTL toggle direction, dead code cleanup, archive obsolete files
3. `8a11588` — perf: remove unused deps, brotli compression, font optimization, frontend fixes

---

## Notes

- The service (`qattah.service`) uses `vite preview`. To switch to the optimized `server.mjs` (which serves pre-compressed brotli/gzip), update the systemd unit.
- No services were restarted during optimization.
