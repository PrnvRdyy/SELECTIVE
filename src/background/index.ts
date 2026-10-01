import type {
  ExtensionMessage,
  UpdateSettingPayload,
  RecordBlockPayload,
} from "@/types";
import { getSettings, updateFeatureSetting } from "@/settings/manager";
import { getAnalytics, recordBlock } from "@/analytics/tracker";

/**
 * Background service worker.
 * Handles messages from popup and content scripts.
 */
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    handleMessage(message).then(sendResponse);
    return true; // Keep the message channel open for async response
  }
);

async function handleMessage(message: ExtensionMessage): Promise<unknown> {
  switch (message.type) {
    case "GET_SETTINGS":
      return getSettings();

    case "UPDATE_SETTING": {
      const payload = message.payload as UpdateSettingPayload;
      return updateFeatureSetting(payload.site, payload.feature, payload.enabled);
    }

    case "RECORD_BLOCK": {
      const payload = message.payload as RecordBlockPayload;
      await recordBlock(payload.site, payload.feature);
      return { success: true };
    }

    case "GET_ANALYTICS":
      return getAnalytics();

    default:
      return { error: "Unknown message type" };
  }
}

// Log extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("[Selective Control] Extension installed. Initializing defaults...");
    getSettings(); // Triggers default settings creation
  }
});
