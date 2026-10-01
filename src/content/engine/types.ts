import type { SiteId, FeatureId, BlockingStrategy } from "@/types";

/**
 * A SiteBlocker implements the blocking logic for one feature on one site.
 * Each site module exports an array of these.
 */
export interface SiteBlocker {
  site: SiteId;
  feature: FeatureId;
  strategy: BlockingStrategy;

  /** Called once when the blocker should start observing the page */
  init(): void;

  /** Called when the blocking rule is enabled */
  enable(): void;

  /** Called when the blocking rule is disabled (restore normal UI) */
  disable(): void;

  /** Full cleanup — disconnect observers, remove injected elements */
  destroy(): void;
}
