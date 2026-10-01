/**
 * Inline SVG icons used across the popup.
 * Using inline SVGs instead of an icon library to keep bundle size minimal
 * and avoid external dependencies for a browser extension.
 *
 * All icons use consistent 18×18 viewBox, 1.5px stroke, round caps/joins.
 */

interface IconProps {
  size?: number;
  className?: string;
}

export function SelectiveMark({ size = 28 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Geometric S-shape representing selective access / controlled gateway */}
      <rect width="28" height="28" rx="7" fill="#7C5CFF" />
      <path
        d="M9 10.5C9 9.12 10.12 8 11.5 8H16.5C17.88 8 19 9.12 19 10.5C19 11.88 17.88 13 16.5 13H11.5C10.12 13 9 14.12 9 15.5V15.5C9 16.88 10.12 18 11.5 18H16.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="18" r="2" fill="white" />
      <circle cx="10" cy="10" r="2" fill="white" />
    </svg>
  );
}

export function SettingsIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.42 1.42M13.18 13.18l1.42 1.42M14.6 3.4l-1.42 1.42M4.82 13.18l-1.42 1.42" />
    </svg>
  );
}

export function YouTubeIcon({ size = 18 }: IconProps) {
  return (
    <img src="/icons/youtube.png" width={size} height={size} alt="YouTube" aria-hidden="true" />
  );
}

export function InstagramIcon({ size = 18 }: IconProps) {
  return (
    <img src="/icons/instagram.png" width={size} height={size} alt="Instagram" aria-hidden="true" />
  );
}

/**
 * Returns the appropriate site icon component for a given site ID.
 */
export function SiteIcon({ siteId, size = 18 }: { siteId: string; size?: number }) {
  switch (siteId) {
    case "youtube":
      return <YouTubeIcon size={size} />;
    case "instagram":
      return <InstagramIcon size={size} />;
    default:
      return null;
  }
}
