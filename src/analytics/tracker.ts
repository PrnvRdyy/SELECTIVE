import type {
  AnalyticsData,
  SiteId,
  FeatureId,
} from "@/types";

const ANALYTICS_KEY = "selective_control_analytics";

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function featureKey(site: SiteId, feature: FeatureId): string {
  return `${site}:${feature}`;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const result = await chrome.storage.local.get(ANALYTICS_KEY);
  return result[ANALYTICS_KEY] ?? { totalBlocked: 0, dailyStats: [] };
}

export async function recordBlock(
  site: SiteId,
  feature: FeatureId
): Promise<void> {
  const data = await getAnalytics();
  data.totalBlocked += 1;

  const today = todayKey();
  const key = featureKey(site, feature);

  let todayStats = data.dailyStats.find((d) => d.date === today);
  if (!todayStats) {
    todayStats = { date: today, counts: {} };
    data.dailyStats.push(todayStats);
  }

  todayStats.counts[key] = (todayStats.counts[key] ?? 0) + 1;

  // Keep only last 30 days of data
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  data.dailyStats = data.dailyStats.filter((d) => d.date >= cutoffStr);

  await chrome.storage.local.set({ [ANALYTICS_KEY]: data });
}
