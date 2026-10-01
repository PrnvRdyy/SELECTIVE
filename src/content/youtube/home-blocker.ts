import type { SiteBlocker } from "@/content/engine";
import { hideElements, observeUrlChanges } from "@/content/shared/dom-utils";
import { showBlockedScreen, removeBlockedScreen } from "@/content/shared/blocked-screen";

/**
 * YouTube Home Recommendations blocker.
 *
 * Replaces the home feed content with a blocked message.
 * Only activates on the YouTube home page (/).
 * Search, subscriptions, library, and watch pages remain unaffected.
 */
export class YouTubeHomeBlocker implements SiteBlocker {
  site = "youtube" as const;
  feature = "homeRecommendations" as const;
  strategy = "replaceContent" as const;

  private active = false;
  private cleanups: (() => void)[] = [];

  init(): void {}

  enable(): void {
    if (this.active) return;
    this.active = true;

    const checkRoute = (url: string) => {
      const pathname = new URL(url).pathname;
      // Home page is either "/" or "/feed/trending" but we only block "/"
      if (pathname === "/" || pathname === "") {
        this.blockHomeFeed();
      } else {
        this.unblockHomeFeed();
      }
    };

    checkRoute(location.href);
    const stopWatching = observeUrlChanges(checkRoute);
    this.cleanups.push(stopWatching);

    const onNavigate = () => checkRoute(location.href);
    document.addEventListener("yt-navigate-finish", onNavigate);
    this.cleanups.push(() =>
      document.removeEventListener("yt-navigate-finish", onNavigate)
    );
  }

  disable(): void {
    if (!this.active) return;
    this.active = false;
    this.unblockHomeFeed();
    this.runCleanups();
  }

  destroy(): void {
    this.disable();
  }

  private blockHomeFeed(): void {
    // Hide the main content area on home page
    const selectors = [
      "ytd-browse[page-subtype='home'] ytd-rich-grid-renderer",
      "ytd-browse[page-subtype='home'] ytd-two-column-browse-results-renderer",
    ].join(", ");

    const unhide = hideElements(selectors);
    this.cleanups.push(unhide);
    showBlockedScreen("Home Recommendations");
  }

  private unblockHomeFeed(): void {
    removeBlockedScreen();
  }

  private runCleanups(): void {
    for (const fn of this.cleanups) fn();
    this.cleanups = [];
  }
}
