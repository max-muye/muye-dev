const startInput = document.querySelector("#startInput");
const batchInput = document.querySelector("#batchInput");
const startButton = document.querySelector("#startButton");
const allSearchButton = document.querySelector("#allSearchButton");
const stopButton = document.querySelector("#stopButton");
const resetButton = document.querySelector("#resetButton");
const downloadTextButton = document.querySelector("#downloadTextButton");
const downloadZipButton = document.querySelector("#downloadZipButton");
const adminFileInput = document.querySelector("#adminFileInput");
const adminPasswordInput = document.querySelector("#adminPasswordInput");
const adminUploadButton = document.querySelector("#adminUploadButton");
const adminMessage = document.querySelector("#adminMessage");
const statusEl = document.querySelector("#status");
const checkedValue = document.querySelector("#checkedValue");
const bestValue = document.querySelector("#bestValue");
const bestNumber = document.querySelector("#bestNumber");
const recordCount = document.querySelector("#recordCount");
const activeSearchers = document.querySelector("#activeSearchers");
const sharedProgress = document.querySelector("#sharedProgress");
const output = document.querySelector("#output");

const storageKey = "muye.collatz.records.v2";
const clientKey = "muye.collatz.clientId";
let running = false;
let sharedMode = false;
let next = 1n;
let rangeEnd = 0n;
let serverCheckedThrough = 0n;
let bestSteps = 0;
let bestNum = 1n;
let records = [];
let pendingRecords = [];
let activeCount = 0;
let heartbeatTimer = 0;
const scheduledTasks = [];
const scheduler = new MessageChannel();

scheduler.port1.onmessage = () => {
  const task = scheduledTasks.shift();
  if (task) task();
};

function scheduleNow(task) {
  scheduledTasks.push(task);
  scheduler.port2.postMessage(0);
}

function clientId() {
  let id = localStorage.getItem(clientKey);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(clientKey, id);
  }
  return id;
}

function loadLocalState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    next = BigInt(saved.next || "1");
    bestSteps = Number(saved.bestSteps || 0);
    bestNum = BigInt(saved.bestNum || "1");
    records = Array.isArray(saved.records) ? saved.records : [];
  } catch {
    next = 1n;
    bestSteps = 0;
    bestNum = 1n;
    records = [];
  }
}

function saveLocalState() {
  localStorage.setItem(storageKey, JSON.stringify({
    next: next.toString(),
    bestSteps,
    bestNum: bestNum.toString(),
    records
  }));
}

async function api(body) {
  const response = await fetch("/api/collatz", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Request failed.");
  return result;
}

async function loadSharedState() {
  const response = await fetch("/api/collatz");
  if (!response.ok) return;
  const state = await response.json();
  serverCheckedThrough = BigInt(state.checkedThrough || "0");
  bestSteps = Number(state.bestSteps || 0);
  bestNum = BigInt(state.bestNum || "1");
  activeCount = Number(state.activeSearchers || 0);
  records = Array.isArray(state.records) ? state.records : [];
  render();
}

function lifespan(n) {
  let steps = 0;
  while (n !== 1n) {
    n = n % 2n === 0n ? n / 2n : n * 3n + 1n;
    steps++;
  }
  return steps;
}

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function render() {
  checkedValue.textContent = formatNumber(sharedMode ? serverCheckedThrough : next - 1n);
  bestValue.textContent = String(bestSteps);
  bestNumber.textContent = formatNumber(bestNum);
  recordCount.textContent = String(records.length);
  activeSearchers.textContent = String(activeCount);
  sharedProgress.textContent = formatNumber(serverCheckedThrough);
  output.textContent = records.slice(-500).map((r) => r.line).join("\n");
  statusEl.textContent = running ? (sharedMode ? "All Search" : "Running") : "Idle";
  startButton.disabled = running;
  allSearchButton.disabled = running;
  stopButton.disabled = !running;
}

async function claimRange() {
  const size = Math.max(1000, Math.min(1000000, Number(batchInput.value) || 100000));
  const claim = await api({ action: "claim", size, clientId: clientId() });
  next = BigInt(claim.start);
  rangeEnd = BigInt(claim.end);
  serverCheckedThrough = BigInt(claim.nextStart) - 1n;
}

async function submitPending() {
  if (!pendingRecords.length) return;
  const sent = pendingRecords;
  pendingRecords = [];
  const state = await api({ action: "submit", records: sent, clientId: clientId() });
  serverCheckedThrough = BigInt(state.checkedThrough || serverCheckedThrough.toString());
  bestSteps = Number(state.bestSteps || bestSteps);
  bestNum = BigInt(state.bestNum || bestNum.toString());
  activeCount = Number(state.activeSearchers || activeCount);
  records = Array.isArray(state.records) ? state.records : records.concat(sent);
}

async function heartbeat() {
  if (!running || !sharedMode) return;
  try {
    const state = await api({ action: "heartbeat", clientId: clientId() });
    serverCheckedThrough = BigInt(state.checkedThrough || serverCheckedThrough.toString());
    bestSteps = Number(state.bestSteps || bestSteps);
    bestNum = BigInt(state.bestNum || bestNum.toString());
    activeCount = Number(state.activeSearchers || activeCount);
    records = Array.isArray(state.records) ? state.records : records;
    render();
  } catch {}
}

function startHeartbeat() {
  clearInterval(heartbeatTimer);
  heartbeatTimer = setInterval(heartbeat, 5000);
  heartbeat();
}

function stopHeartbeat() {
  clearInterval(heartbeatTimer);
  heartbeatTimer = 0;
}

async function sharedTick() {
  if (!running || !sharedMode) return;
  if (next > rangeEnd) {
    await submitPending();
    await claimRange();
  }

  const limit = next + BigInt(Math.max(1, Math.min(250000, Number(batchInput.value) || 20000)));
  while (next <= rangeEnd && next < limit) {
    const steps = lifespan(next);
    if (steps > bestSteps || next === 1n) {
      bestSteps = steps;
      bestNum = next;
      const line = `cur largest lifespan ${bestSteps}, num ${next}`;
      const record = { n: next.toString(), num: next.toString(), steps: bestSteps, line, at: new Date().toISOString() };
      records.push(record);
      pendingRecords.push(record);
    }
    next++;
  }

  render();
  scheduleNow(sharedTick);
}

function localTick() {
  if (!running || sharedMode) return;

  const batch = Math.max(1, Math.min(250000, Number(batchInput.value) || 20000));
  for (let i = 0; i < batch; i++) {
    const steps = lifespan(next);
    if (steps > bestSteps || next === 1n) {
      bestSteps = steps;
      bestNum = next;
      const line = `cur largest lifespan ${bestSteps}, num ${next}`;
      records.push({ n: next.toString(), steps: bestSteps, line, at: new Date().toISOString() });
    }
    next++;
  }

  saveLocalState();
  render();
  scheduleNow(localTick);
}

function download(name, type, blobParts) {
  const blob = new Blob(blobParts, { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function recordsText() {
  return records.map((r) => r.line).join("\n") + "\n";
}

function crc32(text) {
  const bytes = new TextEncoder().encode(text);
  let crc = -1;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function u16(n) {
  return [n & 255, (n >>> 8) & 255];
}

function u32(n) {
  return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
}

function makeZip(filename, text) {
  const enc = new TextEncoder();
  const nameBytes = enc.encode(filename);
  const data = enc.encode(text);
  const crc = crc32(text);
  const local = [
    ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0),
    ...u16(0), ...u16(0), ...u32(crc), ...u32(data.length),
    ...u32(data.length), ...u16(nameBytes.length), ...u16(0),
    ...nameBytes, ...data
  ];
  const centralStart = local.length;
  const central = [
    ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0),
    ...u16(0), ...u16(0), ...u32(crc), ...u32(data.length),
    ...u32(data.length), ...u16(nameBytes.length), ...u16(0), ...u16(0),
    ...u16(0), ...u16(0), ...u32(0), ...u32(0), ...nameBytes
  ];
  const end = [
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(1), ...u16(1),
    ...u32(central.length), ...u32(centralStart), ...u16(0)
  ];
  return new Uint8Array([...local, ...central, ...end]);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

startButton.addEventListener("click", () => {
  const requestedStart = startInput.value.trim();
  if (/^[1-9][0-9]*$/.test(requestedStart)) next = BigInt(requestedStart);
  sharedMode = false;
  running = true;
  render();
  localTick();
});

allSearchButton.addEventListener("click", async () => {
  sharedMode = true;
  running = true;
  pendingRecords = [];
  render();
  try {
    await loadSharedState();
    await claimRange();
    startHeartbeat();
    sharedTick();
  } catch (error) {
    running = false;
    stopHeartbeat();
    statusEl.textContent = "Error";
    output.textContent = error.message;
    render();
  }
});

stopButton.addEventListener("click", async () => {
  running = false;
  stopHeartbeat();
  if (sharedMode) {
    try { await submitPending(); } catch {}
  } else {
    saveLocalState();
  }
  render();
});

resetButton.addEventListener("click", () => {
  running = false;
  stopHeartbeat();
  sharedMode = false;
  next = 1n;
  rangeEnd = 0n;
  bestSteps = 0;
  bestNum = 1n;
  records = [];
  pendingRecords = [];
  localStorage.removeItem(storageKey);
  render();
});

downloadTextButton.addEventListener("click", () => {
  download("collatz_lifespan.txt", "text/plain", [recordsText()]);
});

downloadZipButton.addEventListener("click", () => {
  const zip = makeZip("collatz_lifespan.txt", recordsText());
  download("collatz_lifespan.zip", "application/zip", [zip]);
});

adminUploadButton.addEventListener("click", async () => {
  const file = adminFileInput.files?.[0];
  if (!file) {
    adminMessage.textContent = "Choose a ZIP or TXT file first.";
    return;
  }
  adminMessage.textContent = "Uploading...";
  try {
    const base64 = await fileToBase64(file);
    const result = await api({
      action: "admin-import",
      file: base64,
      mime: file.type || file.name,
      adminPassword: adminPasswordInput.value
    });
    adminMessage.textContent = `Imported ${result.imported} records.`;
    adminPasswordInput.value = "";
    await loadSharedState();
  } catch (error) {
    adminMessage.textContent = error.message;
  }
});

loadLocalState();
loadSharedState();
render();
