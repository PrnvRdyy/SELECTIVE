# Architecture

## Overview

Selective Control uses a layered, modular architecture designed to make adding new sites and features straightforward.

```
┌──────────────────────────────┐
│        Extension Popup       │  React UI for toggling features
│          (React)             │
└──────────┬───────────────────┘
           │ chrome.storage.local
┌──────────▼───────────────────┐
│      Settings Manager        │  Reads/writes user preferences
│  (src/settings/manager.ts)   │
└──────────┬───────────────────┘
           │ onSettingsChanged
┌──────────▼───────────────────┐
│        Rule Engine           │  Orchestrates blockers per site
│ (src/content/engine/)        │
└──────────┬───────────────────┘
           │ enable() / disable()
┌──────────▼───────────────────┐
│    Site-Specific Blockers    │  One blocker class per feature
│  (src/content/<site>/)       │
└──────────┬───────────────────┘
           │ DOM manipulation
┌──────────▼───────────────────┐
│     Shared Utilities         │  DOM observation, URL detection,
│  (src/content/shared/)       │  blocked screen overlay
└──────────────────────────────┘
```

## Key Design Decisions

### Why per-site modules?

Each site (YouTube, Instagram) has completely different DOM structures and navigation patterns. Isolating site-specific logic means:
- Updating YouTube selectors doesn't risk breaking Instagram
- Each site can use the detection mechanisms best suited to it (e.g., YouTube's `yt-navigate-finish` event)
- New sites can be added without modifying existing code

### Why CSS hiding over DOM removal?

We use `display: none !important` via injected `<style>` elements rather than removing DOM nodes because:
- It's reversible (disable = remove the style tag)
- It doesn't break React/framework state management on the target site
- It's more performant than continuous DOM manipulation
- It applies automatically to dynamically loaded content matching the selectors

### Why chrome.storage.local over chrome.storage.sync?

- No account required
- Works offline
- No sync conflicts
- Simpler implementation
- Sync can be added later if needed

### SPA Navigation Detection

Both YouTube and Instagram are SPAs. We detect navigation via:
1. History API interception (`pushState`, `replaceState`)
2. `popstate` event listener
3. Fallback polling (1s interval)
4. YouTube-specific: `yt-navigate-finish` custom event

## File Structure

```
src/
├── types/              # Shared TypeScript types
│   └── index.ts
├── config/             # Site configuration registry
│   └── sites.ts
├── settings/           # Settings management
│   └── manager.ts
├── analytics/          # Local analytics tracking
│   └── tracker.ts
├── background/         # Service worker
│   └── index.ts
├── popup/              # Extension popup UI
│   ├── main.tsx
│   ├── Popup.tsx
│   └── styles.css
└── content/            # Content scripts
    ├── engine/         # Rule engine (site-agnostic)
    │   ├── types.ts
    │   ├── rule-engine.ts
    │   └── index.ts
    ├── shared/         # Shared utilities
    │   ├── dom-utils.ts
    │   └── blocked-screen.ts
    ├── youtube/        # YouTube-specific blockers
    │   ├── index.ts
    │   ├── shorts-blocker.ts
    │   └── home-blocker.ts
    └── instagram/      # Instagram-specific blockers
        ├── index.ts
        ├── reels-blocker.ts
        └── explore-blocker.ts
```

## Adding a New Site

1. Add a `SiteConfig` to `src/config/sites.ts`
2. Create `src/content/<site-id>/` with blocker classes implementing `SiteBlocker`
3. Create an entry `index.ts` that registers blockers with `new RuleEngine("<site-id>")`
4. Add a content script entry in `manifest.json`

No changes to the popup, settings manager, or rule engine are needed.
