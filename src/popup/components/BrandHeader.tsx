import { SelectiveMark, SettingsIcon } from "./Icons";

export function BrandHeader() {
  return (
    <header className="header">
      <div className="header-brand-container">
        <div className="header-brand">
          <div className="header-mark">
            <SelectiveMark />
          </div>
          <span className="header-wordmark">SELECTIVE</span>
        </div>
        <div className="header-tagline">Your apps. Your rules.</div>
      </div>
      <button
        className="header-settings-btn"
        aria-label="Settings"
        title="Settings"
        type="button"
      >
        <SettingsIcon />
      </button>
    </header>
  );
}
