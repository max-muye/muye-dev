let muyeCaptchaToken = window.muyeCaptchaToken || "";
window.muyeCaptchaCallback = (token) => { muyeCaptchaToken = token; window.muyeCaptchaToken = token; };
window.muyeCaptchaExpired = () => { muyeCaptchaToken = ""; window.muyeCaptchaToken = ""; };
const login = document.querySelector("#mailbox-login");
const app = document.querySelector("#mailbox-app");
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const resetPanel = document.querySelector("#reset-panel");
const resetForm = document.querySelector("#reset-form");
const resetMessage = document.querySelector("#reset-message");
const composeForm = document.querySelector("#compose-form");
const composeMessage = document.querySelector("#compose-message");
const composeImagePreview = document.querySelector("#compose-image-preview");
const inboxMessage = document.querySelector("#inbox-message");
const messageList = document.querySelector("#message-list");
const messageDetail = document.querySelector("#message-detail");
const address = document.querySelector("#mailbox-address");
const mailboxTitle = document.querySelector("#mailbox-title");
const viewButtons = document.querySelectorAll("[data-view]");
const admin = document.querySelector("#mailbox-admin");
const adminSummary = document.querySelector("#admin-summary");
const adminMailboxList = document.querySelector("#admin-mailbox-list");
const adminRequestList = document.querySelector("#admin-request-list");
const adminMessageList = document.querySelector("#admin-message-list");
const adminMessageDetail = document.querySelector("#admin-message-detail");
const adminMessage = document.querySelector("#admin-message");
const todayKey = new Date().toISOString().slice(0, 10);
let selectedAttachment = null;
let currentView = "inbox";
let adminToken = "";
let selectedAdminMailbox = "";
let newestInboxId = 0;
let hasLoadedInboxOnce = false;
let notificationTimer = null;
let messagesLoading = false;
let composeSending = false;

const viewLabels = {
  inbox: "Inbox",
  outbox: "Outbox",
  trash: "Trash",
};

const emptyText = {
  inbox: "Your inbox is empty.",
  outbox: "Your outbox is empty.",
  trash: "Trash is empty.",
};

function setMessage(element, text, error = false) {
  element.textContent = text;
  element.classList.toggle("error", error);
}

function formatDate(value) {
  return new Date(`${value}Z`).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function decodeStoredBody(value) {
  const text = String(value || "");
  if (!/=[0-9a-f]{2}|=\r?\n/i.test(text)) return text;
  const compact = text.replace(/=\r?\n/g, "");
  const bytes = [];
  for (let index = 0; index < compact.length; index += 1) {
    if (compact[index] === "=" && /^[0-9a-f]{2}$/i.test(compact.slice(index + 1, index + 3))) {
      bytes.push(parseInt(compact.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      bytes.push(compact.charCodeAt(index));
    }
  }
  try { return new TextDecoder("utf-8").decode(new Uint8Array(bytes)); } catch { return text; }
}

function renderMessages(messages) {
  if (!messages.length) {
    messageList.innerHTML = `<div class="empty-state">${emptyText[currentView] || emptyText.inbox}</div>`;
    messageDetail.innerHTML = '<p class="empty-state">Click a message to preview it.</p>';
    return;
  }
  messageList.innerHTML = messages.map((message) => `
    <button class="message-item ${message.is_read ? "" : "unread"}" data-message-id="${message.id}" type="button">
      <span class="message-meta"><span>${message.direction === "sent" ? "To: " : "From: "}${message.direction === "sent" ? message.recipient : message.sender}</span><time>${formatDate(message.created_at)}</time></span>
      <span class="message-subject">${escapeHtml(message.subject)}</span>
      <span class="message-preview">${escapeHtml(decodeStoredBody(message.body))}</span>
    </button>`).join("");
  messageList.querySelectorAll("[data-message-id]").forEach((item) => {
    item.addEventListener("click", async () => {
      const message = messages.find((entry) => String(entry.id) === item.dataset.messageId);
      if (message) renderMessageDetail(message);
      if (message && !message.is_read) await updateMessage(message.id, "read", false);
      loadMessages();
    });
  });
}

function renderMessageDetail(message) {
  const counterpart = message.direction === "sent" ? `To: ${message.recipient}` : `From: ${message.sender}`;
  const attachment = renderAttachment(message);
  const htmlBody = message.body_html ? `<div class="message-html">${sanitizeHtml(message.body_html)}</div>` : "";
  const textBody = `<pre ${htmlBody ? 'class="message-text-fallback"' : ""}>${escapeHtml(decodeStoredBody(message.body))}</pre>`;
  const readAction = message.is_read ? "unread" : "read";
  const readLabel = message.is_read ? "Mark unread" : "Mark read";
  const folderAction = currentView === "trash" ? "restore" : "trash";
  const folderLabel = currentView === "trash" ? "Restore" : "Move to trash";
  const readButton = currentView === "outbox" ? "" : `<button class="mailbox-button quiet" type="button" data-message-action="${readAction}" data-message-id="${message.id}">${readLabel}</button>`;
  const folderButton = currentView === "outbox" ? "" : `<button class="mailbox-button quiet" type="button" data-message-action="${folderAction}" data-message-id="${message.id}">${folderLabel}</button>`;
  const actions = readButton || folderButton ? `<div class="message-actions">${readButton}${folderButton}</div>` : "";
  messageDetail.innerHTML = `
    <div class="message-detail-meta">
      <span>${escapeHtml(counterpart)}</span>
      <time>${formatDate(message.created_at)}</time>
    </div>
    <h3>${escapeHtml(message.subject)}</h3>
    ${htmlBody || textBody}
    ${attachment}
    ${actions}`;
  messageDetail.querySelectorAll("[data-message-action]").forEach((button) => {
    button.addEventListener("click", async () => updateMessage(button.dataset.messageId, button.dataset.messageAction));
  });
}

function renderAdminMessageDetail(message) {
  const attachment = renderAttachment(message);
  const htmlBody = message.body_html ? `<div class="message-html">${sanitizeHtml(message.body_html)}</div>` : "";
  const textBody = `<pre ${htmlBody ? 'class="message-text-fallback"' : ""}>${escapeHtml(decodeStoredBody(message.body))}</pre>`;
  adminMessageDetail.innerHTML = `
    <div class="message-detail-meta">
      <span>${escapeHtml(message.sender)} -> ${escapeHtml(message.recipient)}</span>
      <time>${formatDate(message.created_at)}</time>
    </div>
    <h3>${escapeHtml(message.subject)}</h3>
    ${htmlBody || textBody}
    ${attachment}
    <div class="message-actions">
      <button class="mailbox-button admin-danger" type="button" data-admin-delete-message="${message.id}">Delete message</button>
    </div>`;
  adminMessageDetail.querySelector("[data-admin-delete-message]")?.addEventListener("click", () => deleteAdminMessage(message.id));
}

function renderAttachment(message) {
  if (!message.image_data || !message.image_type) return "";
  const name = message.image_name || "attachment";
  const src = `data:${escapeAttribute(message.image_type)};base64,${escapeAttribute(message.image_data)}`;
  const preview = message.image_type.startsWith("image/")
    ? `<img class="message-image" src="${src}" alt="${escapeAttribute(name)}">`
    : "";
  return `
    <div class="message-attachment">
      ${preview}
      <a class="mailbox-button quiet attachment-link" href="${src}" download="${escapeAttribute(name)}">Download ${escapeHtml(name)}</a>
    </div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function sanitizeHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  const allowed = new Set(["A", "B", "BLOCKQUOTE", "BR", "CODE", "DIV", "EM", "H1", "H2", "H3", "H4", "HR", "I", "IMG", "LI", "OL", "P", "PRE", "SPAN", "STRONG", "TABLE", "TBODY", "TD", "TH", "THEAD", "TR", "UL"]);
  template.content.querySelectorAll("*").forEach((element) => {
    if (!allowed.has(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith("on") || name === "style") element.removeAttribute(attribute.name);
      else if (element.tagName === "A" && name === "href" && /^https?:\/\//i.test(value)) {
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noopener noreferrer");
      } else if (element.tagName === "IMG" && name === "src" && /^https?:\/\//i.test(value)) {
        element.setAttribute("loading", "lazy");
      } else if (!["href", "src", "alt", "title", "colspan", "rowspan"].includes(name)) {
        element.removeAttribute(attribute.name);
      }
    });
  });
  return template.innerHTML;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "").split(",")[1] || ""));
    reader.addEventListener("error", () => reject(new Error("Could not read file.")));
    reader.readAsDataURL(file);
  });
}

function composeIdempotencyKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function loadMessages() {
  if (messagesLoading) return;
  messagesLoading = true;
  try {
    const response = await fetch(`/api/mailbox-messages?view=${encodeURIComponent(currentView)}`, { cache: "no-store" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("muye_open_mail_today");
        if (notificationTimer) clearInterval(notificationTimer);
        notificationTimer = null;
        setMessage(loginMessage, result.error || "Sign in to your mailbox.", true);
        showLogin();
        return;
      }
      setMessage(inboxMessage, result.error || "Could not refresh mailbox.", true);
      return;
    }
    setMessage(inboxMessage, "");
    address.textContent = result.mailbox;
    currentView = result.view || currentView;
    updateViewTabs();
    const messages = result.messages || [];
    if (currentView === "inbox") watchMailboxNotifications(messages);
    renderMessages(messages);
  } catch (error) {
    setMessage(inboxMessage, "Could not refresh mailbox. Check the connection and try again.", true);
    console.error(error);
  } finally {
    messagesLoading = false;
  }
}

async function waitForClerk() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (window.Clerk) return window.Clerk;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Clerk did not load.");
}

async function adminHeaders() {
  if (!adminToken) adminToken = await window.Clerk?.session?.getToken?.();
  return adminToken ? { authorization: `Bearer ${adminToken}` } : {};
}

async function adminFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), ...(await adminHeaders()) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Admin request failed.");
  return result;
}

function renderAdminMailboxes(mailboxes) {
  adminSummary.textContent = `${mailboxes.length} mailboxes`;
  if (!mailboxes.length) {
    adminMailboxList.innerHTML = '<div class="empty-state">No mailboxes yet.</div>';
    return;
  }
  adminMailboxList.innerHTML = mailboxes.map((mailbox) => `
    <button class="message-item ${mailbox.banned_at ? "unread" : ""}" data-admin-mailbox="${escapeAttribute(mailbox.mailbox)}" type="button">
      <span class="message-meta"><span>${escapeHtml(mailbox.mailbox)}</span><time>${formatDate(mailbox.created_at)}</time></span>
      <span class="message-subject">${mailbox.banned_at ? '<span class="admin-banned">Banned</span>' : "Active"}</span>
      <span class="admin-mailbox-counts">
        <span>${Number(mailbox.message_count || 0)} messages</span>
        <span>${Number(mailbox.inbox_count || 0)} inbox</span>
        <span>${Number(mailbox.sent_count || 0)} sent</span>
      </span>
    </button>`).join("");
  adminMailboxList.querySelectorAll("[data-admin-mailbox]").forEach((button) => {
    button.addEventListener("click", () => loadAdminMailbox(button.dataset.adminMailbox));
  });
}

function renderAdminRequests(requests) {
  if (!adminRequestList) return;
  if (!requests.length) {
    adminRequestList.innerHTML = '<div class="empty-state">No requests yet.</div>';
    return;
  }
  adminRequestList.innerHTML = requests.map((request) => `
    <button class="message-item ${request.status === "open" ? "unread" : ""}" data-admin-request-id="${request.id}" type="button">
      <span class="message-meta"><span>${escapeHtml(request.email_name)}@muye.dev</span><time>${formatDate(request.created_at)}</time></span>
      <span class="message-subject">${escapeHtml(request.requester_email || request.requester_name || "Visitor request")}</span>
      <span class="message-preview">${escapeHtml(request.request_text)}</span>
    </button>`).join("");
  adminRequestList.querySelectorAll("[data-admin-request-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = requests.find((entry) => String(entry.id) === button.dataset.adminRequestId);
      if (!request) return;
      selectedAdminMailbox = "";
      adminMessageList.innerHTML = '<div class="empty-state">Choose a mailbox to inspect messages.</div>';
      adminMessageDetail.innerHTML = `
        <div class="message-detail-meta">
          <span>${escapeHtml(request.email_name)}@muye.dev</span>
          <time>${formatDate(request.created_at)}</time>
        </div>
        <h3>Email request</h3>
        <pre>${escapeHtml(request.request_text)}</pre>
        <p class="empty-state">${escapeHtml(request.requester_email || request.requester_name || "No signed-in requester")}</p>`;
    });
  });
}

function renderAdminMessages(mailbox, messages) {
  selectedAdminMailbox = mailbox.mailbox;
  const banLabel = mailbox.banned_at ? "Unban mailbox" : "Ban mailbox";
  const banAction = mailbox.banned_at ? "unban" : "ban";
  adminMessageDetail.innerHTML = `
    <div class="message-detail-meta">
      <span>${escapeHtml(mailbox.mailbox)}</span>
      <time>${formatDate(mailbox.created_at)}</time>
    </div>
    <h3>${mailbox.banned_at ? '<span class="admin-banned">Banned mailbox</span>' : "Mailbox controls"}</h3>
    <div class="message-actions">
      <button class="mailbox-button quiet" type="button" data-admin-mailbox-action="${banAction}">${banLabel}</button>
      <button class="mailbox-button admin-danger" type="button" data-admin-delete-mailbox>Delete mailbox</button>
    </div>`;
  adminMessageDetail.querySelector("[data-admin-mailbox-action]")?.addEventListener("click", () => updateAdminMailbox(banAction));
  adminMessageDetail.querySelector("[data-admin-delete-mailbox]")?.addEventListener("click", deleteAdminMailbox);

  if (!messages.length) {
    adminMessageList.innerHTML = '<div class="empty-state">No messages in this mailbox.</div>';
    return;
  }
  adminMessageList.innerHTML = messages.map((message) => `
    <button class="message-item ${message.is_read ? "" : "unread"}" data-admin-message-id="${message.id}" type="button">
      <span class="message-meta"><span>${message.direction === "sent" ? "Sent" : "Inbox"}</span><time>${formatDate(message.created_at)}</time></span>
      <span class="message-subject">${escapeHtml(message.subject)}</span>
      <span class="message-preview">${escapeHtml(message.sender)} -> ${escapeHtml(message.recipient)}</span>
    </button>`).join("");
  adminMessageList.querySelectorAll("[data-admin-message-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const message = messages.find((entry) => String(entry.id) === button.dataset.adminMessageId);
      if (message) renderAdminMessageDetail(message);
    });
  });
}

async function loadAdminMailboxes() {
  try {
    setMessage(adminMessage, "");
    const result = await adminFetch("/api/admin-mailboxes");
    renderAdminMailboxes(result.mailboxes || []);
    renderAdminRequests(result.requests || []);
  } catch (error) {
    admin.hidden = true;
    if (error.message !== "Admin access required.") console.error(error);
  }
}

async function loadAdminMailbox(mailbox) {
  try {
    setMessage(adminMessage, "Loading...");
    const result = await adminFetch(`/api/admin-mailboxes?mailbox=${encodeURIComponent(mailbox)}`);
    renderAdminMessages(result.mailbox, result.messages || []);
    setMessage(adminMessage, "");
  } catch (error) {
    setMessage(adminMessage, error.message || "Could not load mailbox.", true);
  }
}

async function updateAdminMailbox(action) {
  if (!selectedAdminMailbox) return;
  try {
    await adminFetch("/api/admin-mailboxes", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mailbox: selectedAdminMailbox, action }),
    });
    await loadAdminMailboxes();
    await loadAdminMailbox(selectedAdminMailbox);
  } catch (error) {
    setMessage(adminMessage, error.message || "Could not update mailbox.", true);
  }
}

async function deleteAdminMessage(id) {
  if (!confirm("Delete this message permanently?")) return;
  try {
    await adminFetch(`/api/admin-mailboxes?messageId=${encodeURIComponent(id)}`, { method: "DELETE" });
    adminMessageDetail.innerHTML = '<p class="empty-state">Message deleted.</p>';
    await loadAdminMailbox(selectedAdminMailbox);
    await loadAdminMailboxes();
  } catch (error) {
    setMessage(adminMessage, error.message || "Could not delete message.", true);
  }
}

async function deleteAdminMailbox() {
  if (!selectedAdminMailbox || !confirm(`Delete ${selectedAdminMailbox} and all of its messages permanently?`)) return;
  try {
    await adminFetch(`/api/admin-mailboxes?mailbox=${encodeURIComponent(selectedAdminMailbox)}`, { method: "DELETE" });
    selectedAdminMailbox = "";
    adminMessageList.innerHTML = '<div class="empty-state">Mailbox deleted.</div>';
    adminMessageDetail.innerHTML = '<p class="empty-state">Choose a mailbox or message.</p>';
    await loadAdminMailboxes();
  } catch (error) {
    setMessage(adminMessage, error.message || "Could not delete mailbox.", true);
  }
}

async function showAdminIfAllowed() {
  try {
    await adminFetch("/api/admin-mailboxes");
    admin.hidden = false;
    await loadAdminMailboxes();
    return;
  } catch {}

  try {
    const clerk = await waitForClerk();
    await clerk.load();
    if (!clerk.isSignedIn) throw new Error("not signed in");
    adminToken = await clerk.session?.getToken?.();
    await adminFetch("/api/admin-mailboxes");
    admin.hidden = false;
    await loadAdminMailboxes();
  } catch {
    admin.hidden = true;
  }
}

function notifyIncoming(message) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(`New mail from ${message.sender}`, {
    body: `${message.subject}\n${decodeStoredBody(message.body).slice(0, 120)}`,
    tag: `muye-mail-${message.id}`,
  });
}

async function enableNotifications() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") await Notification.requestPermission();
}

function watchMailboxNotifications(messages) {
  const incoming = messages.filter((message) => message.direction === "inbox");
  const maxId = Math.max(0, ...incoming.map((message) => Number(message.id) || 0));
  if (hasLoadedInboxOnce && maxId > newestInboxId) {
    incoming
      .filter((message) => Number(message.id) > newestInboxId)
      .sort((a, b) => Number(a.id) - Number(b.id))
      .forEach(notifyIncoming);
  }
  newestInboxId = Math.max(newestInboxId, maxId);
  hasLoadedInboxOnce = true;
}

function startNotificationPolling() {
  enableNotifications();
  if (notificationTimer) return;
  notificationTimer = setInterval(() => {
    if (!app.hidden && currentView === "inbox") loadMessages();
  }, 45000);
}

async function updateMessage(id, action, refreshDetail = true) {
  const response = await fetch("/api/mailbox-messages", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: Number(id), action }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    setMessage(inboxMessage, result.error || "Could not update message.", true);
    return false;
  }
  setMessage(inboxMessage, "");
  if (refreshDetail) messageDetail.innerHTML = '<p class="empty-state">Click a message to preview it.</p>';
  await loadMessages();
  return true;
}

function updateViewTabs() {
  mailboxTitle.textContent = viewLabels[currentView] || viewLabels.inbox;
  viewButtons.forEach((button) => {
    const selected = button.dataset.view === currentView;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
}

function showApp(mailbox) {
  login.hidden = true;
  app.hidden = false;
  address.textContent = mailbox || "";
  startNotificationPolling();
  loadMessages();
}

function autoOpenApp() {
  login.hidden = true;
  app.hidden = false;
  startNotificationPolling();
  loadMessages();
}

function showLogin() {
  login.hidden = false;
  app.hidden = true;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(loginMessage, "Opening mailbox...");
  const formData = new FormData(loginForm);
  const openForToday = formData.get("openForToday") === "on";
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);
  const captcha = window.muyeCaptchaToken || muyeCaptchaToken || String(formData.get("cf-turnstile-response") || document.querySelector('input[name="cf-turnstile-response"]')?.value || window.turnstile?.getResponse?.() || "");
  if (!captcha) {
    setMessage(loginMessage, "Please wait for the CAPTCHA, then try again.", true);
    return;
  }
  const response = await fetch("/api/mailbox-login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mailbox: formData.get("mailbox"), password: formData.get("password"), captcha, openForToday, expiresAt: tomorrow.getTime() }) });
  const result = await response.json();
  if (!response.ok) {
    window.turnstile?.reset?.();
    window.muyeCaptchaExpired();
    setMessage(loginMessage, result.error || "Could not open mailbox.", true);
    return;
  }
  loginForm.reset();
  window.muyeCaptchaExpired();
  if (openForToday) localStorage.setItem("muye_open_mail_today", todayKey);
  else localStorage.removeItem("muye_open_mail_today");
  showApp(result.mailbox);
});

function togglePassword(input, button) {
  const visible = input.type === "text";
  input.type = visible ? "password" : "text";
  button.textContent = visible ? "Show" : "Hide";
}

document.querySelector("#login-password-toggle").addEventListener("click", (event) => togglePassword(document.querySelector("#login-password"), event.currentTarget));
document.querySelectorAll("[data-reset-toggle]").forEach((button) => button.addEventListener("click", () => togglePassword(button.previousElementSibling, button)));

document.querySelector("#show-reset-button").addEventListener("click", () => { login.hidden = true; resetPanel.hidden = false; });
document.querySelector("#back-to-login").addEventListener("click", () => { resetPanel.hidden = true; login.hidden = false; });

let resetChallenge = "";
async function sendResetCode() {
  const data = new FormData(resetForm);
  const email = String(data.get("contactEmail") || "").trim();
  if (!email) { setMessage(resetMessage, "Enter your verification email.", true); return false; }
  const response = await fetch("/api/send-email-code", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
  const result = await response.json();
  if (!response.ok) { setMessage(resetMessage, result.error || "Could not send code.", true); return false; }
  resetChallenge = result.challenge;
  setMessage(resetMessage, "Verification code sent by email.");
  return true;
}

document.querySelector("#send-reset-code").addEventListener("click", sendResetCode);

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(resetForm);
  const email = String(data.get("contactEmail") || "").trim();
  const code = String(data.get("code") || "").trim();
  const password = String(data.get("password") || "");
  const confirmation = String(data.get("passwordConfirm") || "");
  if (!resetChallenge) {
    const sent = await sendResetCode();
    if (!sent) return;
    setMessage(resetMessage, "Code sent. Enter it above, then press Replace password.");
    return;
  }
  if (!code) { setMessage(resetMessage, "Enter the verification code you received.", true); return; }
  if (password.length < 8 || password !== confirmation) { setMessage(resetMessage, password !== confirmation ? "Passwords do not match." : "Password must be at least 8 characters.", true); return; }
  const verifyResponse = await fetch("/api/verify-email-code", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, code, challenge: resetChallenge }) });
  const verifyResult = await verifyResponse.json();
  if (!verifyResponse.ok) { setMessage(resetMessage, verifyResult.error || "That code is not valid.", true); return; }
  const response = await fetch("/api/reset-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password, proof: verifyResult.proof }) });
  const result = await response.json();
  if (!response.ok) { setMessage(resetMessage, result.error || "Could not replace password.", true); return; }
  resetForm.reset();
  resetChallenge = "";
  setMessage(resetMessage, "Password replaced. You can sign in now.");
});

composeForm.attachment.addEventListener("change", async () => {
  const file = composeForm.attachment.files?.[0];
  selectedAttachment = null;
  composeImagePreview.hidden = true;
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    setMessage(composeMessage, "Choose a file under 4 MB.", true);
    composeForm.attachment.value = "";
    return;
  }
  try {
    selectedAttachment = { name: file.name, type: file.type || "application/octet-stream", data: await fileToBase64(file) };
    const image = composeImagePreview.querySelector("img");
    image.hidden = !selectedAttachment.type.startsWith("image/");
    image.src = image.hidden ? "" : `data:${selectedAttachment.type};base64,${selectedAttachment.data}`;
    composeImagePreview.querySelector("figcaption").textContent = `${file.name} (${Math.ceil(file.size / 1024)} KB)`;
    composeImagePreview.hidden = false;
    setMessage(composeMessage, "");
  } catch (error) {
    setMessage(composeMessage, error.message || "Could not load file.", true);
  }
});

document.querySelector("#remove-image-button").addEventListener("click", () => {
  selectedAttachment = null;
  composeForm.attachment.value = "";
  composeImagePreview.hidden = true;
});

composeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (composeSending) return;
  composeSending = true;
  const submitButton = composeForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  setMessage(composeMessage, "Sending...");
  const formData = new FormData(composeForm);
  const idempotencyKey = composeIdempotencyKey();
  try {
    const response = await fetch("/api/mailbox-messages", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": idempotencyKey }, body: JSON.stringify({ recipient: formData.get("recipient"), subject: formData.get("subject"), body: formData.get("body"), attachment: selectedAttachment, idempotencyKey }) });
    const result = await response.json();
    if (!response.ok) { setMessage(composeMessage, result.error || "Could not send message.", true); return; }
    composeForm.reset();
    selectedAttachment = null;
    composeImagePreview.hidden = true;
    setMessage(composeMessage, "Message sent.");
    loadMessages();
  } finally {
    composeSending = false;
    if (submitButton) submitButton.disabled = false;
  }
});

document.querySelector("#refresh-button").addEventListener("click", loadMessages);
document.querySelector("#admin-refresh-button").addEventListener("click", loadAdminMailboxes);
viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view === "outbox" || button.dataset.view === "trash" ? button.dataset.view : "inbox";
    messageDetail.innerHTML = '<p class="empty-state">Click a message to preview it.</p>';
    updateViewTabs();
    loadMessages();
  });
});
document.querySelector("#close-preview-button").addEventListener("click", () => {
  messageDetail.innerHTML = '<p class="empty-state">Click a message to preview it.</p>';
});
document.querySelector("#logout-button").addEventListener("click", async () => {
  await fetch("/api/mailbox-login", { method: "DELETE" });
  localStorage.removeItem("muye_open_mail_today");
  if (notificationTimer) clearInterval(notificationTimer);
  notificationTimer = null;
  showLogin();
});

if (localStorage.getItem("muye_open_mail_today") === todayKey) {
  autoOpenApp();
} else {
  showLogin();
}

showAdminIfAllowed();
