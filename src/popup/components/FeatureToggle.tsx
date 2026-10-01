interface FeatureToggleProps {
  label: string;
  enabled: boolean;
  siteId: string;
  featureId: string;
  onToggle: (enabled: boolean) => void;
}

export function FeatureToggle({
  label,
  enabled,
  siteId,
  featureId,
  onToggle,
}: FeatureToggleProps) {
  const toggleId = `toggle-${siteId}-${featureId}`;

  return (
    <div className="feature-row">
      <div className="feature-info">
        <div className="feature-name">{label}</div>
      </div>

      <div className="feature-controls">
        <div className={`feature-state ${enabled ? "blocked" : "allowed"}`}>
          {enabled ? "Blocked" : "Allowed"}
        </div>
        <label className="toggle" htmlFor={toggleId}>
          <input
            id={toggleId}
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            aria-label={`Block ${label}`}
            role="switch"
            aria-checked={enabled}
          />
          <div className="toggle-track" />
          <div className="toggle-thumb" />
        </label>
      </div>
    </div>
  );
}
