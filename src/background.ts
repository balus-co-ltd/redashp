import { embedVars } from "./embed";
import { getApiKey, getOrigin } from "./storage";

function background() {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  chrome.tabs.onUpdated.addListener(onUpdated);
  chrome.runtime.onMessage.addListener(onMessage);
}

async function onUpdated(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  if (changeInfo.status !== "complete") {
    return;
  }
  if (!tab.url) {
    return;
  }
  const origin = await getOrigin();
  if (!tab.url.startsWith(origin)) {
    return;
  }
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["dist/dashboard.js"],
  });
}

function onMessage(
  req: { type: "embed-vars-into-dashboard" },
  sender: chrome.runtime.MessageSender,
  sendResponse: (res: {
    returns?: { url: string; name: string };
    error?: string;
  }) => void
) {
  if (req.type !== "embed-vars-into-dashboard") {
    return;
  }

  if (!sender.tab?.url) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  (async (url: string) => {
    try {
      const returns = await embedVars(url, await getApiKey());
      sendResponse({ returns });
    } catch (err) {
      sendResponse({ error: (err as Error).message });
    }
  })(sender.tab.url);

  return true;
}

background();
