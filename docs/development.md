# Development Guide

## Prerequisites

- Node.js 20+
- Chrome or Chromium-based browser
- npm

## Setup

```bash
git clone <repo-url>
cd selective-control
npm install
```

## Development Workflow

### 1. Start the dev server

```bash
npm run dev
```

CRXJS Vite plugin will output a `dist/` directory with hot-reloading support.

### 2. Load in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder
5. The extension icon should appear in the toolbar

### 3. Make changes

- Edit source files — HMR will update the popup automatically
- Content script changes require a page refresh on the target site
- Manifest changes require clicking "Reload" on `chrome://extensions/`

### 4. Run checks

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build
```

## Project Structure

See [architecture.md](architecture.md) for detailed architecture documentation.

## Testing Checklist

### Fresh Installation
- [ ] Extension loads without errors
- [ ] Default settings are created
- [ ] Popup displays correctly

### YouTube
- [ ] Shorts shelf hidden on home page
- [ ] Shorts tab hidden in sidebar
- [ ] Direct navigation to /shorts/ shows blocked screen
- [ ] "Go Back" button works
- [ ] Normal videos play correctly
- [ ] Search works
- [ ] Subscriptions work
- [ ] Toggling Shorts blocking off restores everything
- [ ] Home Recommendations blocking shows overlay on /
- [ ] Other pages (search, watch, subscriptions) unaffected

### Instagram
- [ ] Reels nav link hidden
- [ ] Direct navigation to /reels/ shows blocked screen
- [ ] "Go Back" button works
- [ ] Normal posts visible
- [ ] Stories work
- [ ] DMs work
- [ ] Explore nav link hidden
- [ ] Direct navigation to /explore/ shows blocked screen
- [ ] Toggling off restores everything

### General
- [ ] Settings persist across browser restart
- [ ] Works across multiple tabs
- [ ] SPA navigation detected correctly
- [ ] Extension doesn't break normal browsing
- [ ] Console has no errors from the extension

## Generating Icons

```bash
npx tsx scripts/generate-icons.ts
```

For production-quality icons, replace the generated PNGs with properly designed assets.
