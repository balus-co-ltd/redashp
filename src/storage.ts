export async function getOrigin(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["url"], ({ url }: { url?: string }) => {
      if (!url) {
        reject(new Error("url is not configured"));
        return;
      }
      resolve(url);
    });
  });
}

export async function getApiKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["apiKey"], ({ apiKey }: { apiKey?: string }) => {
      if (!apiKey) {
        reject(new Error("apiKey is not configured"));
        return;
      }
      resolve(apiKey);
    });
  });
}
