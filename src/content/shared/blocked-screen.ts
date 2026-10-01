const BLOCKED_SCREEN_ID = "sc-blocked-screen";

/**
 * Blocked screen styled to match the SELECTIVE brand.
 * Uses the same design tokens (colors, typography) as the popup.
 * Functionality preserved: overlay with go-back button.
 */
export function showBlockedScreen(featureLabel: string): void {
  if (document.getElementById(BLOCKED_SCREEN_ID)) return;

  const hostname = window.location.hostname;
  const siteName = hostname.includes("youtube.com") ? "YouTube" : hostname.includes("instagram.com") ? "Instagram" : "The site";

  const overlay = document.createElement("div");
  overlay.id = BLOCKED_SCREEN_ID;
  overlay.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(11, 11, 15, 0.92);
      backdrop-filter: blur(12px);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    ">
      <div style="
        text-align: center;
        color: #F5F5F7;
        max-width: 360px;
        padding: 40px 32px;
      ">
        <div style="
          width: 48px;
          height: 48px;
          margin: 0 auto 28px;
          border-radius: 12px;
          background: #7C5CFF;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 8.5C5 6.57 6.57 5 8.5 5H15.5C17.43 5 19 6.57 19 8.5C19 10.43 17.43 12 15.5 12H8.5C6.57 12 5 13.57 5 15.5V15.5C5 17.43 6.57 19 8.5 19H15.5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="18" cy="19" r="2.5" fill="white"/>
            <circle cx="7" cy="8" r="2.5" fill="white"/>
          </svg>
        </div>

        <h2 style="
          margin: 0 0 8px;
          font-size: 20px;
          font-weight: 600;
          color: #F5F5F7;
          letter-spacing: -0.01em;
        ">You're in control.</h2>

        <p style="
          margin: 0 0 8px;
          font-size: 14px;
          font-weight: 500;
          color: #9898A6;
        ">${featureLabel} is blocked.</p>

        <p style="
          margin: 0 0 32px;
          font-size: 13px;
          color: #666674;
          line-height: 1.6;
        ">
          ${siteName} is still available<br>
          for everything else you chose<br>
          to keep.
        </p>

        <button id="sc-go-back-btn" style="
          background: #7C5CFF;
          color: #fff;
          border: none;
          padding: 10px 28px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          cursor: pointer;
          transition: background 0.15s ease;
        " onmouseover="this.style.background='#8E72FF'"
           onmouseout="this.style.background='#7C5CFF'"
        >Go back</button>

        <div style="
          margin-top: 24px;
          font-size: 10px;
          letter-spacing: 0.06em;
          color: #666674;
          text-transform: uppercase;
        ">SELECTIVE</div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("sc-go-back-btn")?.addEventListener("click", () => {
    history.back();
    removeBlockedScreen();
  });
}

export function removeBlockedScreen(): void {
  document.getElementById(BLOCKED_SCREEN_ID)?.remove();
}
