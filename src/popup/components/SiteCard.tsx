import type { SiteConfig, ExtensionSettings, SiteId, FeatureId } from "@/types";
import { getFeatureSetting } from "@/settings/manager";
import { SiteIcon } from "./Icons";
import { FeatureToggle } from "./FeatureToggle";

interface SiteCardProps {
  site: SiteConfig;
  settings: ExtensionSettings;
  onToggle: (site: SiteId, feature: FeatureId, enabled: boolean) => void;
}

export function SiteCard({ site, settings, onToggle }: SiteCardProps) {
  const activeCount = site.features.filter(
    (f) => getFeatureSetting(settings, site.id, f.id).enabled
  ).length;

  return (
    <div className="site-card">
      <div className="site-card-header">
        <div className="site-card-icon">
          <SiteIcon siteId={site.id} />
        </div>
        <span className="site-card-name">{site.name}</span>
        <span className="site-card-meta">
          {activeCount > 0
            ? `${activeCount} blocked`
            : "No blocked features"}
        </span>
      </div>

      <div className="site-card-features">
        {site.features.map((feature) => {
          const featureSetting = getFeatureSetting(settings, site.id, feature.id);
          return (
            <FeatureToggle
              key={feature.id}
              label={feature.label}
              enabled={featureSetting.enabled}
              siteId={site.id}
              featureId={feature.id}
              onToggle={(enabled) => onToggle(site.id, feature.id, enabled)}
            />
          );
        })}
      </div>
    </div>
  );
}
