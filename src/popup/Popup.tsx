import { useState, useEffect, useCallback } from "react";
import type { ExtensionSettings, SiteId, FeatureId, AnalyticsData } from "@/types";
import { SITE_CONFIGS } from "@/config/sites";
import {
  getSettings,
  updateFeatureSetting,
  getFeatureSetting,
  onSettingsChanged,
} from "@/settings/manager";
import { getAnalytics } from "@/analytics/tracker";

import { BrandHeader } from "./components/BrandHeader";
import { StatusCard } from "./components/StatusCard";
import { SiteCard } from "./components/SiteCard";
import { ActivityCard } from "./components/ActivityCard";
import { PopupFooter } from "./components/PopupFooter";

export function Popup() {
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBlocked: 0,
    dailyStats: [],
  });

  useEffect(() => {
    getSettings().then(setSettings);
    getAnalytics().then(setAnalytics);

    onSettingsChanged((newSettings) => {
      setSettings(newSettings);
    });
  }, []);

  const handleToggle = useCallback(
    async (site: SiteId, feature: FeatureId, enabled: boolean) => {
      const updated = await updateFeatureSetting(site, feature, enabled);
      setSettings(updated);
    },
    []
  );

  if (!settings) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span className="loading-text">Loading</span>
      </div>
    );
  }

  const activeCount = SITE_CONFIGS.reduce((acc, site) => {
    return (
      acc +
      site.features.filter(
        (f) => getFeatureSetting(settings, site.id, f.id).enabled
      ).length
    );
  }, 0);

  return (
    <>
      <BrandHeader />
      <StatusCard activeCount={activeCount} />

      <div className="site-cards">
        {SITE_CONFIGS.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            settings={settings}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <ActivityCard analytics={analytics} />
      <PopupFooter />
    </>
  );
}
