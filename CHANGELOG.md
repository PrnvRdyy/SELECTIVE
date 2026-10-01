# Changelog

All notable changes to Selective Control will be documented in this file.

## [0.1.0] - 2026-10-01

### Added
- Initial extension scaffolding with Vite + React + TypeScript + Manifest V3
- Modular rule engine architecture
- Settings manager with chrome.storage.local
- YouTube Shorts blocking (CSS hiding + route blocking)
- YouTube Home Recommendations blocking (route-based)
- Instagram Reels blocking (CSS hiding + route blocking)
- Instagram Explore blocking (CSS hiding + route blocking)
- Extension popup with per-feature toggle controls
- Blocked screen overlay with go-back navigation
- Local analytics tracking (block counts per feature per day)
- SPA navigation detection (history API interception + yt-navigate-finish)
- Privacy-first design: storage permission only, no remote data collection
