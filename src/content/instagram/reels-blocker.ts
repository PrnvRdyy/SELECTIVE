import type { SiteBlocker } from "@/content/engine";
import { hideElements, observeUrlChanges } from "@/content/shared/dom-utils";
import { showBlockedScreen, removeBlockedScreen } from "@/content/shared/blocked-screen";

/**
 * Instagram Reels blocker.
 *
 * Blocks Reels in two ways:
 * 1. Hides Reels-related elements in the feed and navigation
 * 2. Shows a blocked screen when navigating to /reels/
 */
export class InstagramReelsBlocker implements SiteBlocker {
  site = "instagram" as const;
  feature = "reels" as const;
  strategy = "hideUI" as const;

  private active = false;
  private cleanups: (() => void)[] = [];

  init(): void {}

  enable(): void {
    if (this.active) return;
    this.active = true;

    // Hide Reels-related navigation and feed elements
    const selectors = [
      // Reels nav link in sidebar
      'a[href="/reels/"]',
      'a[href*="/reels/"]',
      // Reels suggestions in feed
      'div[role="presentation"]:has(a[href*="/reel/"])',
    ].join(", ");

    const unhide = hideElements(selectors);
    this.cleanups.push(unhide);

    // Route-based blocking
    const checkRoute = (url: string) => {
      const pathname = new URL(url).pathname;
      if (pathname.startsWith("/reels") || pathname.startsWith("/reel/")) {
        showBlockedScreen("Instagram Reels");
      } else {
        removeBlockedScreen();
      }
    };

    checkRoute(location.href);
    const stopWatching = observeUrlChanges(checkRoute);
    this.cleanups.push(stopWatching);
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
