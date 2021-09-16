async function settings() {
  const $url = document.querySelector<HTMLInputElement>('input[name="url"]');
  const $apiKey = document.querySelector<HTMLInputElement>(
    'input[name="apiKey"]'
  );
  if (!$url || !$apiKey) {
    return;
  }
  await fill($url, $apiKey);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  $url.addEventListener("change", onURLChange);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  $apiKey.addEventListener("change", onAPIKeyChange);
}

async function fill($url: HTMLInputElement, $apiKey: HTMLInputElement) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      ["url", "apiKey"],
      ({ url, apiKey }: { url?: string; apiKey?: string }) => {
        if (url) {
          $url.value = url;
        }
        if (apiKey) {
          $apiKey.value = apiKey;
        }
        resolve(undefined);
      }
    );
  });
}

async function onURLChange(e: Event) {
  const $err = document.querySelector<HTMLInputElement>("#urlError");
  if (!$err) {
    throw new Error("fatal: can't find url error element");
  }
  const input = e.currentTarget as HTMLInputElement;
  try {
    const url = new URL(input.value);
    $err.textContent = "";
    $err.style.display = "none";
    input.value = url.origin;
    await update("url", url.origin);
  } catch (err) {
    $err.textContent = (err as Error).message;
    $err.style.display = "block";
    return;
  }
}

async function onAPIKeyChange(e: Event) {
  const input = e.currentTarget as HTMLInputElement;
  await update("apiKey", input.value);
}

async function update(name: string, value: string) {
  await chrome.storage.sync.set({ [name]: value });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
settings();
