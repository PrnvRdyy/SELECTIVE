import type { SiteBlocker } from "@/content/engine";
import { hideElements, observeUrlChanges } from "@/content/shared/dom-utils";
import { showBlockedScreen, removeBlockedScreen } from "@/content/shared/blocked-screen";

/**
 * YouTube Shorts blocker.
 *
 * Blocks Shorts in three ways:
 * 1. Hides Shorts shelf/sections on the home page and search results
 * 2. Hides the Shorts tab in the navigation
 * 3. Shows a blocked screen when navigating directly to /shorts/
 */
export class YouTubeShortsBlocker implements SiteBlocker {
  site = "youtube" as const;
  feature = "shorts" as const;
  strategy = "hideUI" as const;

  private active = false;
  private cleanups: (() => void)[] = [];

  init(): void {
    // No-op: enable/disable handles everything
  }

  enable(): void {
    if (this.active) return;
    this.active = true;

    // CSS-based hiding for Shorts elements across the page
    const selectors = [
      // Shorts shelf on home/search
      "ytd-rich-shelf-renderer[is-shorts]",
      "ytd-reel-shelf-renderer",
      // Shorts tab in navigation sidebar
      'ytd-guide-entry-renderer a[title="Shorts"]',
      'ytd-mini-guide-entry-renderer a[title="Shorts"]',
      // Shorts in search results
      'ytd-video-renderer [overlay-style="SHORTS"]',
      // Shorts badges and chips
      'yt-chip-cloud-chip-renderer:has([title="Shorts"])',
      // Shorts in subscription feed
      "ytd-rich-item-renderer:has(ytd-rich-grid-slim-media)",
    ].join(", ");

    const unhide = hideElements(selectors);
    this.cleanups.push(unhide);

    // Route-based blocking: if user navigates to /shorts/*
    const checkRoute = (url: string) => {
      if (new URL(url).pathname.startsWith("/shorts")) {
        showBlockedScreen("YouTube Shorts");
      } else {
        removeBlockedScreen();
      }
    };

    checkRoute(location.href);
    const stopWatching = observeUrlChanges(checkRoute);
    this.cleanups.push(stopWatching);

    // YouTube fires a custom event on navigation
    const onNavigate = () => checkRoute(location.href);
    document.addEventListener("yt-navigate-finish", onNavigate);
    this.cleanups.push(() =>
      document.removeEventListener("yt-navigate-finish", onNavigate)
    );
  }

  disable(): void {
    if (!this.active) return;
    this.active = false;
    removeBlockedScreen();
    this.runCleanups();
  }

  destroy(): void {
    this.disable();
  }

  private runCleanups(): void {
    for (const fn of this.cleanups) fn();
    this.cleanups = [];
  }
}
