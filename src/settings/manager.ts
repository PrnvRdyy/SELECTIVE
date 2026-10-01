import type {
  ExtensionSettings,
  SiteId,
  FeatureId,
  FeatureSettings,
} from "@/types";
import { SITE_CONFIGS } from "@/config/sites";

const STORAGE_KEY = "selective_control_settings";

function buildDefaultSettings(): ExtensionSettings {
  const settings: ExtensionSettings = {
    sites: {},
    analytics: { enabled: true },
  };

  for (const site of SITE_CONFIGS) {
    settings.sites[site.id] = {};
    for (const feature of site.features) {
      settings.sites[site.id]![feature.id] = {
        enabled: feature.defaultEnabled,
        strategy: feature.defaultStrategy,
      };
    }
  }

  return settings;
}

export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  if (result[STORAGE_KEY]) {
    // Merge stored settings with defaults so new features get default values
    const defaults = buildDefaultSettings();
    const stored = result[STORAGE_KEY] as ExtensionSettings;
    return mergeSettings(defaults, stored);
  }
  const defaults = buildDefaultSettings();
  await chrome.storage.local.set({ [STORAGE_KEY]: defaults });
  return defaults;
}

export async function updateFeatureSetting(
  site: SiteId,
  feature: FeatureId,
  enabled: boolean
): Promise<ExtensionSettings> {
  const settings = await getSettings();
  if (!settings.sites[site]) {
    settings.sites[site] = {};
  }
  if (!settings.sites[site]![feature]) {
    settings.sites[site]![feature] = { enabled, strategy: "hideUI" };
  } else {
    settings.sites[site]![feature]!.enabled = enabled;
  }
  await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  return settings;
}

export function getFeatureSetting(
  settings: ExtensionSettings,
  site: SiteId,
  feature: FeatureId
): FeatureSettings {
  return (
    settings.sites[site]?.[feature] ?? { enabled: false, strategy: "hideUI" }
  );
}

/**
 * Merges stored settings onto defaults so that newly added features
 * get their default values while preserving user choices.
 */
function mergeSettings(
  defaults: ExtensionSettings,
  stored: ExtensionSettings
): ExtensionSettings {
  const merged: ExtensionSettings = { ...defaults };

  for (const siteId of Object.keys(defaults.sites) as SiteId[]) {
    if (stored.sites[siteId]) {
      merged.sites[siteId] = {
        ...defaults.sites[siteId],
        ...stored.sites[siteId],
      };
    }
  }

  merged.analytics = { ...defaults.analytics, ...stored.analytics };
  return merged;
}

export function onSettingsChanged(
  callback: (settings: ExtensionSettings) => void
): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[STORAGE_KEY]) {
      callback(changes[STORAGE_KEY].newValue as ExtensionSettings);
    }
  });
}
