import type { SiteConfig } from "@/types";

/**
 * Registry of all supported sites and their blockable features.
 * To add a new site, add a new entry here and create a corresponding
 * content script module in src/content/<siteId>/.
 */
export const SITE_CONFIGS: SiteConfig[] = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "🎬",
    hostname: "www.youtube.com",
    features: [
      {
        id: "shorts",
        site: "youtube",
        label: "Shorts",
        description: "Block YouTube Shorts from appearing",
        defaultEnabled: true,
        defaultStrategy: "hideUI",
      },
      {
        id: "homeRecommendations",
        site: "youtube",
        label: "Home Recommendations",
        description: "Block recommended videos on the home page",
        defaultEnabled: false,
        defaultStrategy: "replaceContent",
      },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    hostname: "www.instagram.com",
    features: [
      {
        id: "reels",
        site: "instagram",
        label: "Reels",
        description: "Block Instagram Reels",
        defaultEnabled: true,
        defaultStrategy: "hideUI",
      },
      {
        id: "explore",
        site: "instagram",
        label: "Explore",
        description: "Block the Explore page",
        defaultEnabled: true,
        defaultStrategy: "replaceContent",
      },
    ],
  },
];

export function getSiteConfig(siteId: string): SiteConfig | undefined {
  return SITE_CONFIGS.find((s) => s.id === siteId);
}
