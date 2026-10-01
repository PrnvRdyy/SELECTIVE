import type { AnalyticsData } from "@/types";
import { SITE_CONFIGS } from "@/config/sites";

interface ActivityCardProps {
  analytics: AnalyticsData;
}

export function ActivityCard({ analytics }: ActivityCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const todayStats = analytics.dailyStats.find((d) => d.date === today);
  const todayTotal = todayStats
    ? Object.values(todayStats.counts).reduce((a, b) => a + b, 0)
    : 0;

  // Build breakdown from today's stats using site config labels
  const breakdown: { name: string; count: number }[] = [];
  if (todayStats) {
    for (const site of SITE_CONFIGS) {
      for (const feature of site.features) {
        const key = `${site.id}:${feature.id}`;
        const count = todayStats.counts[key] ?? 0;
        if (count > 0) {
          breakdown.push({ name: `${site.name} ${feature.label}`, count });
        }
      }
    }
    breakdown.sort((a, b) => b.count - a.count);
  }

  if (todayTotal === 0 && analytics.totalBlocked === 0) {
    return null;
  }

  return (
    <div className="activity-card">
      <div className="activity-header">
        <img src="/icons/activity.png" width="14" height="14" alt="" aria-hidden="true" style={{ verticalAlign: "middle", marginRight: "4px" }} />
        Today
      </div>
      <div className="activity-total">
        <span className="activity-number">{todayTotal}</span>
        <span className="activity-label">blocked attempts</span>
      </div>

      {breakdown.length > 0 && (
        <div className="activity-breakdown">
          {breakdown.map((item) => (
            <div key={item.name} className="activity-item">
              <span className="activity-item-name">{item.name}</span>
              <span className="activity-item-count">{item.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
