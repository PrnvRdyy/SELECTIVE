/**
 * Core types for the Selective Control extension.
 *
 * These types define the blocking rule system, settings shape,
 * and messaging protocol between extension components.
 */

// ── Supported Sites ──────────────────────────────────────────────

export type SiteId = "youtube" | "instagram";

// ── Feature IDs per site ─────────────────────────────────────────

export type YouTubeFeature = "shorts" | "homeRecommendations";
export type InstagramFeature = "reels" | "explore";
export type FeatureId = YouTubeFeature | InstagramFeature;

// ── Blocking Strategy ────────────────────────────────────────────

export type BlockingStrategy = "hideUI" | "redirect" | "replaceContent" | "overlay";

// ── Blocking Rule ────────────────────────────────────────────────

export interface BlockingRule {
  id: string;
  site: SiteId;
  feature: FeatureId;
  label: string;
  description: string;
  strategy: BlockingStrategy;
  enabled: boolean;
}

// ── Site Feature Definitions ─────────────────────────────────────

export interface SiteFeature {
  id: FeatureId;
  site: SiteId;
  label: string;
  description: string;
  defaultEnabled: boolean;
  defaultStrategy: BlockingStrategy;
}

export interface SiteConfig {
  id: SiteId;
  name: string;
  icon: string;
  hostname: string;
  features: SiteFeature[];
}

// ── Settings (stored in chrome.storage.local) ────────────────────

export interface FeatureSettings {
  enabled: boolean;
  strategy: BlockingStrategy;
}

export interface SiteSettings {
  [featureId: string]: FeatureSettings;
}

export interface ExtensionSettings {
  sites: {
    [siteId in SiteId]?: SiteSettings;
  };
  analytics: {
    enabled: boolean;
  };
}

// ── Analytics ────────────────────────────────────────────────────

export interface BlockEvent {
  site: SiteId;
  feature: FeatureId;
  timestamp: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  counts: {
    [key: string]: number; // "youtube:shorts" → count
  };
}

export interface AnalyticsData {
  totalBlocked: number;
  dailyStats: DailyStats[];
}

// ── Messaging between popup / background / content scripts ───────

export type MessageType =
  | "GET_SETTINGS"
  | "UPDATE_SETTING"
  | "SETTINGS_CHANGED"
  | "RECORD_BLOCK"
  | "GET_ANALYTICS";

export interface ExtensionMessage {
  type: MessageType;
  payload?: unknown;
}

export interface UpdateSettingPayload {
  site: SiteId;
  feature: FeatureId;
  enabled: boolean;
}

export interface RecordBlockPayload {
  site: SiteId;
  feature: FeatureId;
}
