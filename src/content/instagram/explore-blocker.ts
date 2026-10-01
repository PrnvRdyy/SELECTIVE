import type { SiteBlocker } from "@/content/engine";
import { hideElements, observeUrlChanges } from "@/content/shared/dom-utils";
import { showBlockedScreen, removeBlockedScreen } from "@/content/shared/blocked-screen";

/**
 * Instagram Explore blocker.
 *
 * Blocks the Explore page:
 * 1. Hides Explore navigation link
 * 2. Shows a blocked screen when navigating to /explore/
 */
export class InstagramExploreBlocker implements SiteBlocker {
  site = "instagram" as const;
  feature = "explore" as const;
  strategy = "replaceContent" as const;

  private active = false;
  private cleanups: (() => void)[] = [];

  init(): void {}

  enable(): void {
    if (this.active) return;
    this.active = true;

    // Hide Explore navigation link
    const selectors = [
      'a[href="/explore/"]',
      'a[href*="/explore/"]',
    ].join(", ");

    const unhide = hideElements(selectors);
    this.cleanups.push(unhide);

    // Route-based blocking
    const checkRoute = (url: string) => {
      const pathname = new URL(url).pathname;
      if (pathname.startsWith("/explore")) {
        showBlockedScreen("Instagram Explore");
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
