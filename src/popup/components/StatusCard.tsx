interface StatusCardProps {
  activeCount: number;
}

export function StatusCard({ activeCount }: StatusCardProps) {
  const isActive = activeCount > 0;

  return (
    <div className="status-card">
      <div className="status-row">
        <div className={`status-dot ${isActive ? "" : "inactive"}`} />
        <span className="status-label">
          {isActive ? "Selective is active" : "No controls active"}
        </span>
      </div>
      <div className="status-meta">
        {isActive
          ? `${activeCount} blocking rule${activeCount !== 1 ? "s" : ""} active`
          : "Choose what you want Selective to block."}
      </div>
    </div>
  );
}
