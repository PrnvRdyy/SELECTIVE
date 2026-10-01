import type { ExtensionSettings, SiteId, FeatureId } from "@/types";
import type { SiteBlocker } from "./types";
import { getSettings, getFeatureSetting, onSettingsChanged } from "@/settings/manager";

/**
 * The RuleEngine orchestrates all SiteBlocker instances for a given site.
 * Each content script creates one RuleEngine, registers its blockers,
 * and the engine handles initialization + settings reactivity.
 */
export class RuleEngine {
  private blockers: SiteBlocker[] = [];
  private site: SiteId;
  private initialized = false;

  constructor(site: SiteId) {
    this.site = site;
  }

  register(blocker: SiteBlocker): void {
    this.blockers.push(blocker);
  }

  async start(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    const settings = await getSettings();
    this.applySettings(settings);

    // React to live setting changes from the popup
    onSettingsChanged((newSettings) => {
      this.applySettings(newSettings);
    });
  }

  private applySettings(settings: ExtensionSettings): void {
    for (const blocker of this.blockers) {
      const featureSetting = getFeatureSetting(
        settings,
        this.site,
        blocker.feature as FeatureId
      );

      blocker.init();

      if (featureSetting.enabled) {
        blocker.enable();
      } else {
        blocker.disable();
      }
    }
  }

  destroy(): void {
    for (const blocker of this.blockers) {
      blocker.destroy();
    }
    this.blockers = [];
    this.initialized = false;
  }
}
