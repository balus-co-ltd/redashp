const id = "redashp-embed";

function dashboard() {
  document.body.addEventListener("DOMNodeInserted", (e) => {
    const div = e.target as HTMLDivElement;
    if (!div || div.nodeName !== "DIV") {
      return;
    }
    const title = div.querySelector(".ant-modal-title");
    if (
      !title ||
      !title.childNodes[0] ||
      title.childNodes[0].textContent !== "Share Dashboard"
    ) {
      return;
    }
    const parent = div.querySelector(".ant-modal-body");
    if (!parent) {
      return;
    }

    if (parent.querySelector(`#${id}`)) {
      return;
    }

    const container = document.createElement("div");
    container.id = id;
    container.style.display = "flex";
    container.style.alignItems = "center";

    const button = document.createElement("button");
    button.className = "btn btn-sm hidden-xs btn-default";
    button.style.marginRight = "8px";
    button.textContent = "Embed variables";
    button.addEventListener("click", onEmbedRequested);
    container.appendChild(button);

    const a = document.createElement("a");
    a.style.display = "none";
    a.style.fontSize = "12px";
    container.appendChild(a);

    const p = document.createElement("p");
    p.style.display = "none";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    p.style.color = "rgb(244,67,54)";
    container.appendChild(p);

    parent.appendChild(container);
  });
}

function showLink({ url, name }: { url: string; name: string }) {
  const container = document.querySelector(`#${id}`);
  if (!container) {
    return;
  }

  const p = container.querySelector("p");
  if (!p) {
    return;
  }
  p.style.display = "none";

  const a = container.querySelector("a");
  if (!a) {
    return;
  }
  a.href = url;
  a.textContent = name;
  a.style.display = "block";
}

function showError(error: string) {
  const container = document.querySelector(`#${id}`);
  if (!container) {
    return;
  }

  const a = container.querySelector("a");
  if (!a) {
    return;
  }
  a.style.display = "none";

  const p = container.querySelector("p");
  if (!p) {
    return;
  }
  p.textContent = error;
  p.style.display = "block";
}

function onEmbedRequested() {
  chrome.runtime.sendMessage(
    { type: "embed-vars-into-dashboard" },
    ({
      returns,
      error,
    }: {
      returns?: { url: string; name: string };
      error?: string;
    }) => {
      if (error) {
        showError(error);
      }
      if (returns) {
        showLink(returns);
      }
    }
  );
}

dashboard();
