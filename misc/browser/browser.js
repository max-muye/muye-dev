const tabsEl = document.querySelector("#tabs");
const addressForm = document.querySelector("#address-form");
const addressInput = document.querySelector("#address");
const viewer = document.querySelector("#viewer");
const fallback = document.querySelector("#fallback");
const fallbackOpen = document.querySelector("#fallback-open");
const backButton = document.querySelector("#back");
const forwardButton = document.querySelector("#forward");
const reloadButton = document.querySelector("#reload");
const openTabButton = document.querySelector("#open-tab");
const newTabButton = document.querySelector("#new-tab");
const proxyButton = document.querySelector("#proxy-button");
const adminOpen = document.querySelector("#admin-open");
const adminDialog = document.querySelector("#admin-dialog");
const adminPassword = document.querySelector("#admin-password");
const adminLoad = document.querySelector("#admin-load");
const adminList = document.querySelector("#admin-list");

const searchUrl = "https://www.google.com/search?q=";
const homeHtml = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f4ec;color:#151719;font-family:Inter,system-ui,sans-serif}.box{width:min(680px,calc(100% - 40px));display:grid;gap:18px}h1{margin:0;font-size:clamp(36px,8vw,76px);line-height:.95}p{margin:0;color:#596168;font-size:18px;line-height:1.45}.links{display:flex;flex-wrap:wrap;gap:10px}a{border:1px solid #d4d0c7;border-radius:8px;padding:12px 14px;color:#151719;text-decoration:none;font-weight:800;background:white}</style></head><body><main class="box"><h1>Mini Browser</h1><p>Search or type an address above. Muye pages can open inside this tool; many outside websites may ask to open in a normal tab.</p><div class="links"><a href="https://www.muye.dev/">Muye</a><a href="https://www.muye.dev/misc/">Misc</a><a href="https://www.muye.dev/games/">Games</a></div></main></body></html>`;
let tabId = 0;
let activeId = 0;
const tabs = [];
let proxyMode = false;

function urlFromProxy(value) {
  try {
    const parsed = new URL(value, location.origin);
    if (parsed.pathname !== "/misc/browser/proxy") return "";
    return parsed.searchParams.get("url") || "";
  } catch {
    return "";
  }
}

function normalizeAddress(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed || trimmed === "about:home") return "about:home";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:[/:?#].*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return `${searchUrl}${encodeURIComponent(trimmed)}`;
}

function titleFromUrl(url) {
  if (url === "about:home") return "New Tab";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("google.") && parsed.pathname === "/search") return parsed.searchParams.get("q") || "Search";
    return parsed.hostname.replace(/^www\./, "") || "New Tab";
  } catch {
    return "New Tab";
  }
}

function activeTab() {
  return tabs.find((tab) => tab.id === activeId) || tabs[0];
}

function proxiedUrl(url) {
  return `/misc/browser/proxy?url=${encodeURIComponent(url)}`;
}

function syncButtons() {
  const tab = activeTab();
  backButton.disabled = !tab || tab.index <= 0;
  forwardButton.disabled = !tab || tab.index >= tab.history.length - 1;
  addressInput.value = tab?.url || "";
  proxyButton.dataset.state = proxyMode ? "on" : "off";
  proxyButton.textContent = proxyMode ? "Proxy On" : "Proxy";
}

function renderTabs() {
  tabsEl.textContent = "";
  tabs.forEach((tab) => {
    const button = document.createElement("button");
    button.className = "tab";
    button.type = "button";
    button.role = "tab";
    button.setAttribute("aria-selected", String(tab.id === activeId));
    button.onclick = () => selectTab(tab.id);

    const title = document.createElement("span");
    title.className = "tab-title";
    title.textContent = tab.title;

    const close = document.createElement("button");
    close.className = "tab-close";
    close.type = "button";
    close.textContent = "×";
    close.title = "Close tab";
    close.setAttribute("aria-label", `Close ${tab.title}`);
    close.onclick = (event) => {
      event.stopPropagation();
      closeTab(tab.id);
    };

    button.append(title, close);
    tabsEl.appendChild(button);
  });
  syncButtons();
}

function showFallback(show) {
  fallback.hidden = !show;
}

function loadActive() {
  const tab = activeTab();
  if (!tab) return;
  showFallback(false);
  addressInput.value = tab.url;
  tab.title = titleFromUrl(tab.url);
  renderTabs();
  if (tab.url === "about:home") {
    viewer.src = "about:blank";
    viewer.srcdoc = homeHtml;
    showFallback(false);
    return;
  }
  viewer.removeAttribute("srcdoc");
  viewer.src = proxyMode ? proxiedUrl(tab.url) : tab.url;
}

function navigate(value, replace = false) {
  const tab = activeTab();
  if (!tab) return;
  const url = normalizeAddress(value);
  if (replace) {
    tab.history[tab.index] = url;
  } else {
    tab.history = tab.history.slice(0, tab.index + 1);
    tab.history.push(url);
    tab.index = tab.history.length - 1;
  }
  tab.url = url;
  loadActive();
}

function selectTab(id) {
  activeId = id;
  renderTabs();
  loadActive();
}

function addTab(url = "about:home") {
  const normalized = normalizeAddress(url);
  const tab = {
    id: ++tabId,
    title: titleFromUrl(normalized),
    url: normalized,
    history: [normalized],
    index: 0,
  };
  tabs.push(tab);
  activeId = tab.id;
  renderTabs();
  loadActive();
}

function closeTab(id) {
  if (tabs.length === 1) {
    navigate("https://www.muye.dev/", true);
    return;
  }
  const index = tabs.findIndex((tab) => tab.id === id);
  if (index < 0) return;
  tabs.splice(index, 1);
  if (activeId === id) activeId = tabs[Math.max(0, index - 1)].id;
  renderTabs();
  loadActive();
}

addressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  navigate(addressInput.value);
});

viewer.addEventListener("load", () => {
  showFallback(false);
  const tab = activeTab();
  if (!tab || !proxyMode) return;
  const realUrl = urlFromProxy(viewer.contentWindow?.location?.href || "");
  if (realUrl && realUrl !== tab.url) {
    tab.url = realUrl;
    tab.history[tab.index] = realUrl;
    tab.title = titleFromUrl(realUrl);
    renderTabs();
  }
});

viewer.addEventListener("error", () => showFallback(true));

backButton.addEventListener("click", () => {
  const tab = activeTab();
  if (!tab || tab.index <= 0) return;
  tab.index -= 1;
  tab.url = tab.history[tab.index];
  loadActive();
});

forwardButton.addEventListener("click", () => {
  const tab = activeTab();
  if (!tab || tab.index >= tab.history.length - 1) return;
  tab.index += 1;
  tab.url = tab.history[tab.index];
  loadActive();
});

reloadButton.addEventListener("click", () => {
  const tab = activeTab();
  if (!tab) return;
  viewer.src = "about:blank";
  window.setTimeout(loadActive, 50);
});

openTabButton.addEventListener("click", () => {
  const tab = activeTab();
  if (tab) window.open(tab.url, "_blank", "noopener,noreferrer");
});

fallbackOpen.addEventListener("click", () => {
  const tab = activeTab();
  if (tab) window.open(tab.url, "_blank", "noopener,noreferrer");
});

newTabButton.addEventListener("click", () => addTab());
proxyButton.addEventListener("click", () => {
  proxyMode = !proxyMode;
  loadActive();
});

async function adminRequest(body) {
  const response = await fetch("/misc/browser/proxy/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: adminPassword.value, ...body }),
  });
  if (!response.ok) throw new Error("Admin failed");
  return response.json();
}

function renderAdminHosts(hosts) {
  adminList.textContent = "";
  if (!hosts.length) {
    adminList.textContent = "No proxy requests yet.";
    return;
  }
  hosts.forEach((host) => {
    const row = document.createElement("div");
    row.className = "admin-row";
    const label = document.createElement("span");
    label.textContent = `${host.host} · ${host.approved ? "approved" : "waiting"} · ${host.requestedCount || 0}`;
    const action = document.createElement("button");
    action.type = "button";
    action.textContent = host.approved ? "Remove" : "Approve";
    action.onclick = async () => {
      const data = await adminRequest({ action: host.approved ? "remove" : "approve", host: host.host });
      renderAdminHosts(data.hosts || []);
    };
    row.append(label, action);
    adminList.appendChild(row);
  });
}

adminOpen.addEventListener("click", () => adminDialog.showModal());
adminLoad.addEventListener("click", async () => {
  const data = await adminRequest({});
  renderAdminHosts(data.hosts || []);
});
addTab();
