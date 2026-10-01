# Selective

> Your apps. Your rules. Block specific features inside websites — without blocking the entire app.

**Selective** is a browser extension that gives you granular control over which features of a website you want to use. Instead of blocking YouTube entirely, block just Shorts. Instead of avoiding Instagram altogether, block just Reels and Explore.

## The Problem

Modern social media platforms bundle addictive features alongside genuinely useful ones. You might need YouTube for learning but want to avoid Shorts. You might use Instagram for messaging friends but want to skip Reels. Current solutions are all-or-nothing: block the whole site or allow everything.

**Selective** solves this by letting you choose exactly which features to keep and which to block.

## Supported Sites (V1)

| Site | Blockable Features |
|------|-------------------|
| YouTube | Shorts, Home Recommendations |
| Instagram | Reels, Explore |

All other functionality (search, DMs, normal videos, posts, stories, subscriptions) remains fully usable.

## Features

- 🛡️ **Selective Blocking** — Block specific features, not entire sites
- ⚡ **Instant Toggle** — Enable/disable blocking per feature with one click
- 🔒 **Privacy-First** — All data stored locally, no accounts, no tracking
- 🎯 **Smart Detection** — Handles SPA navigation, dynamic content, and route changes
- 📊 **Local Analytics** — See how many distractions were blocked (stored locally only)
- 🧩 **Modular Architecture** — Easy to add new sites and features

## Installation

### From Source (Development)

```bash
git clone https://github.com/your-username/selective-control.git
cd selective-control
npm install
npm run build
```

Then load the extension in Chrome:

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist/` folder

### From Chrome Web Store

Coming soon.

## Privacy

Selective is built with privacy as a core principle.

**We do NOT collect:**
- Browsing history
- Message contents
- Watched content
- Passwords
- Any private user data

**Permissions used:**
- `storage` — Save your blocking preferences locally

**That's it.** No network requests, no analytics servers, no tracking pixels. All data stays on your device.

## Architecture

```
Extension Popup (React)
    ↓
Settings Manager (chrome.storage.local)
    ↓
Rule Engine
    ↓
Site-specific Blockers
    ↓
Content Scripts (DOM Detection + Blocking)
```

Each supported site has its own isolated module:
- `src/content/youtube/` — YouTube-specific blockers
- `src/content/instagram/` — Instagram-specific blockers

Adding a new site requires:
1. Adding a site config entry
2. Creating site-specific blocker classes
3. No changes to the core engine

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

## Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build
```

See [docs/development.md](docs/development.md) for detailed development instructions.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for planned features.

**Planned sites:** TikTok, Reddit, LinkedIn, Facebook, Twitter/X

**Planned features:** Custom rules, schedules, temporary unlock, usage limits, cross-device sync

## License

MIT
