import * as THREE from "/games/mc-3d/three.module.min.js";

const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
const strings = {
  en: { menu: "Menu", worlds: "Worlds", intro: "Build, explore, mine, and keep your worlds on this device.", worldName: "World name", mode: "Mode", survival: "Survival", creative: "Creative", speed: "World speed", slow: "Slow", fast: "Fast", create: "Create world", saved: "Saved worlds", deviceSave: "Saved on this device", accountSave: "Saved for your account", how: "How to play", helpMove: "WASD or the touch pad moves. Drag or move the mouse to look.", helpMine: "Click or tap Mine to break the block in the crosshair.", helpPlace: "Right-click or tap Place to place your selected block.", helpSave: "Worlds save automatically in your browser.", load: "Load", delete: "Delete", noWorlds: "No saved worlds yet.", day: "Day", mine: "Mine", place: "Place", jump: "Jump", savedToast: "World saved", mined: "Mined {block}", placed: "Placed {block}", tooFar: "Move closer", empty: "No {block} left", newWorld: "New World", grass: "Grass", dirt: "Dirt", stone: "Stone", wood: "Wood", leaves: "Leaves", sand: "Sand" },
  zh: { menu: "菜单", worlds: "世界", intro: "建造、探索、挖掘，并把世界保存在这个设备上。", worldName: "世界名称", mode: "模式", survival: "生存", creative: "创造", speed: "世界速度", slow: "慢速", fast: "快速", create: "创建世界", saved: "已保存的世界", deviceSave: "保存在此设备", accountSave: "保存到你的账号", how: "玩法", helpMove: "WASD 或触控方向键移动，拖动或移动鼠标转向。", helpMine: "点击或点按挖掘来破坏准星中的方块。", helpPlace: "右键或点按放置来放置选中的方块。", helpSave: "世界会自动保存在浏览器中。", load: "加载", delete: "删除", noWorlds: "还没有保存的世界。", day: "第", mine: "挖掘", place: "放置", jump: "跳跃", savedToast: "世界已保存", mined: "挖到了{block}", placed: "放置了{block}", tooFar: "靠近一点", empty: "没有{block}了", newWorld: "新世界", grass: "草方块", dirt: "泥土", stone: "石头", wood: "木头", leaves: "树叶", sand: "沙子" },
  ja: { menu: "メニュー", worlds: "ワールド", intro: "建築、探索、採掘。ワールドはこの端末に保存されます。", worldName: "ワールド名", mode: "モード", survival: "サバイバル", creative: "クリエイティブ", speed: "速度", slow: "ゆっくり", fast: "高速", create: "ワールド作成", saved: "保存済み", deviceSave: "この端末に保存", accountSave: "アカウントに保存", how: "遊び方", helpMove: "WASD またはタッチパッドで移動。ドラッグかマウスで視点移動。", helpMine: "クリックまたは採掘ボタンで照準のブロックを壊します。", helpPlace: "右クリックまたは設置ボタンでブロックを置きます。", helpSave: "ワールドは自動保存されます。", load: "ロード", delete: "削除", noWorlds: "保存済みワールドはありません。", day: "日", mine: "採掘", place: "設置", jump: "ジャンプ", savedToast: "保存しました", mined: "{block}を採掘", placed: "{block}を設置", tooFar: "近づいてください", empty: "{block}がありません", newWorld: "新しいワールド", grass: "草", dirt: "土", stone: "石", wood: "木", leaves: "葉", sand: "砂" },
  ko: { menu: "메뉴", worlds: "월드", intro: "건설하고 탐험하고 채굴하세요. 월드는 이 기기에 저장됩니다.", worldName: "월드 이름", mode: "모드", survival: "서바이벌", creative: "크리에이티브", speed: "속도", slow: "느림", fast: "빠름", create: "월드 만들기", saved: "저장된 월드", deviceSave: "이 기기에 저장", accountSave: "계정에 저장", how: "플레이 방법", helpMove: "WASD 또는 터치 패드로 이동하고 드래그나 마우스로 둘러봅니다.", helpMine: "클릭 또는 채굴 버튼으로 조준한 블록을 부숩니다.", helpPlace: "오른쪽 클릭 또는 놓기 버튼으로 블록을 놓습니다.", helpSave: "월드는 브라우저에 자동 저장됩니다.", load: "불러오기", delete: "삭제", noWorlds: "저장된 월드가 없습니다.", day: "일", mine: "채굴", place: "놓기", jump: "점프", savedToast: "월드 저장됨", mined: "{block} 채굴", placed: "{block} 놓음", tooFar: "더 가까이 이동하세요", empty: "{block} 없음", newWorld: "새 월드", grass: "잔디", dirt: "흙", stone: "돌", wood: "나무", leaves: "나뭇잎", sand: "모래" },
  es: { menu: "Menú", worlds: "Mundos", intro: "Construye, explora, mina y guarda mundos en este dispositivo.", worldName: "Nombre", mode: "Modo", survival: "Supervivencia", creative: "Creativo", speed: "Velocidad", slow: "Lenta", fast: "Rápida", create: "Crear mundo", saved: "Mundos guardados", deviceSave: "Guardado en este dispositivo", accountSave: "Guardado en tu cuenta", how: "Cómo jugar", helpMove: "WASD o el control táctil mueve. Arrastra o mueve el ratón para mirar.", helpMine: "Haz clic o toca Minar para romper el bloque en la mira.", helpPlace: "Clic derecho o toca Colocar para poner el bloque elegido.", helpSave: "Los mundos se guardan automáticamente.", load: "Cargar", delete: "Borrar", noWorlds: "No hay mundos guardados.", day: "Día", mine: "Minar", place: "Colocar", jump: "Saltar", savedToast: "Mundo guardado", mined: "Minaste {block}", placed: "Colocaste {block}", tooFar: "Acércate", empty: "No queda {block}", newWorld: "Mundo nuevo", grass: "Césped", dirt: "Tierra", stone: "Piedra", wood: "Madera", leaves: "Hojas", sand: "Arena" },
};
strings.fr = { ...strings.es, menu: "Menu", worlds: "Mondes", create: "Créer un monde", saved: "Mondes sauvegardés", load: "Charger", delete: "Supprimer", noWorlds: "Aucun monde sauvegardé", day: "Jour", mine: "Miner", place: "Placer", jump: "Sauter" };
strings.de = { ...strings.en, menu: "Menü", worlds: "Welten", create: "Welt erstellen", saved: "Gespeicherte Welten", load: "Laden", delete: "Löschen", noWorlds: "Noch keine Welten", day: "Tag", mine: "Abbauen", place: "Platzieren", jump: "Springen" };
strings.pt = { ...strings.es, menu: "Menu", worlds: "Mundos", create: "Criar mundo", saved: "Mundos salvos", load: "Carregar", delete: "Excluir", noWorlds: "Nenhum mundo salvo", day: "Dia", mine: "Minerar", place: "Colocar", jump: "Pular" };
strings.ru = { ...strings.en, menu: "Меню", worlds: "Миры", create: "Создать мир", saved: "Сохранённые миры", load: "Загрузить", delete: "Удалить", noWorlds: "Нет сохранённых миров", day: "День", mine: "Копать", place: "Поставить", jump: "Прыжок" };
strings.ar = { ...strings.en, menu: "القائمة", worlds: "العوالم", create: "إنشاء عالم", saved: "العوالم المحفوظة", load: "تحميل", delete: "حذف", noWorlds: "لا توجد عوالم محفوظة", day: "اليوم", mine: "تعدين", place: "وضع", jump: "قفز" };

const blockDefs = {
  grass: { color: 0x65a84f, swatch: "#65a84f" },
  dirt: { color: 0x7a4f2f, swatch: "#7a4f2f" },
  stone: { color: 0x777b7d, swatch: "#777b7d" },
  wood: { color: 0x8a5a31, swatch: "#8a5a31" },
  leaves: { color: 0x3f7f45, swatch: "#3f7f45", transparent: true },
  sand: { color: 0xd3bd78, swatch: "#d3bd78" },
};
const blockTypes = Object.keys(blockDefs);
const canvas = document.querySelector("#world");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8ec8e8);
scene.fog = new THREE.Fog(0x8ec8e8, 18, 52);
const camera = new THREE.PerspectiveCamera(72, 1, 0.08, 100);
camera.rotation.order = "YXZ";

const hemi = new THREE.HemisphereLight(0xcbe7ff, 0x4a3d2a, 1.6);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1c5, 2.4);
sun.position.set(18, 28, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -28;
sun.shadow.camera.right = 28;
sun.shadow.camera.top = 28;
sun.shadow.camera.bottom = -28;
scene.add(sun);

const worldGroup = new THREE.Group();
scene.add(worldGroup);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const materials = Object.fromEntries(Object.entries(blockDefs).map(([name, def]) => [name, new THREE.MeshLambertMaterial({ color: def.color, transparent: !!def.transparent, opacity: def.transparent ? 0.9 : 1 })]));
const blocks = new Map();
const heightMap = new Map();
const raycaster = new THREE.Raycaster();
raycaster.far = 6;
const center = new THREE.Vector2(0, 0);

let language = languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
let playerKey = "device";
let activeWorldId = "";
let settings = { mode: "survival", speed: "slow" };
let inventory = { grass: 12, dirt: 20, stone: 12, wood: 8, leaves: 8, sand: 10 };
let selectedBlock = "grass";
let running = false;
let yaw = 0;
let pitch = -0.16;
let velocityY = 0;
let grounded = false;
let timeOfDay = 0.32;
let day = 1;
let lastSave = 0;
let toastTimer = 0;
const keys = new Set();

function t(key, values = {}) {
  const source = strings[language]?.[key] || strings.en[key] || key;
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), source);
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.title = t(node.dataset.i18nTitle);
    node.setAttribute("aria-label", t(node.dataset.i18nTitle));
  });
  document.querySelector("#new-world-name").value ||= t("newWorld");
  renderHotbar();
  renderWorldList();
}

function keyFor(x, y, z) { return `${x},${y},${z}`; }

function addBlock(x, y, z, type, save = true) {
  const id = keyFor(x, y, z);
  if (blocks.has(id)) return;
  const mesh = new THREE.Mesh(boxGeometry, materials[type] || materials.dirt);
  mesh.position.set(x, y, z);
  mesh.castShadow = type !== "leaves";
  mesh.receiveShadow = true;
  mesh.userData = { x, y, z, type };
  blocks.set(id, mesh);
  worldGroup.add(mesh);
  if (save) scheduleSave();
}

function removeBlock(mesh) {
  const { x, y, z } = mesh.userData;
  blocks.delete(keyFor(x, y, z));
  worldGroup.remove(mesh);
  scheduleSave();
}

function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function generateWorld(seed = Date.now()) {
  clearWorld();
  const random = seeded(seed);
  const size = 24;
  for (let x = -size / 2; x < size / 2; x += 1) {
    for (let z = -size / 2; z < size / 2; z += 1) {
      const wave = Math.sin(x * 0.38) * 0.7 + Math.cos(z * 0.31) * 0.65;
      const height = Math.max(1, Math.min(5, Math.round(2.5 + wave + (random() - 0.5) * 1.2)));
      heightMap.set(`${x},${z}`, height);
      const beach = z > 8 && height <= 3;
      for (let y = 0; y <= height; y += 1) {
        const type = y === height ? (beach ? "sand" : "grass") : (y >= height - 2 ? "dirt" : "stone");
        addBlock(x, y, z, type, false);
      }
      if (!beach && random() > 0.965 && Math.abs(x) > 2 && Math.abs(z) > 2) addTree(x, height + 1, z);
    }
  }
}

function addTree(x, y, z) {
  for (let i = 0; i < 3; i += 1) addBlock(x, y + i, z, "wood", false);
  for (let dx = -1; dx <= 1; dx += 1) for (let dz = -1; dz <= 1; dz += 1) addBlock(x + dx, y + 3, z + dz, "leaves", false);
  addBlock(x, y + 4, z, "leaves", false);
}

function clearWorld() {
  while (worldGroup.children.length) worldGroup.remove(worldGroup.children[0]);
  blocks.clear();
  heightMap.clear();
}

function serializeWorld() {
  return {
    id: activeWorldId,
    name: document.querySelector("#world-name").textContent,
    settings,
    inventory,
    selectedBlock,
    timeOfDay,
    day,
    position: camera.position.toArray(),
    yaw,
    pitch,
    blocks: [...blocks.values()].map((mesh) => mesh.userData),
    savedAt: Date.now(),
  };
}

function saveIndexKey() { return `muye-game:${playerKey}:mc-3d-worlds`; }
function saveKey(id) { return `muye-game:${playerKey}:mc-3d:${id}`; }
function readIndex() {
  try { return JSON.parse(localStorage.getItem(saveIndexKey()) || "[]"); } catch { return []; }
}

function saveWorld(showMessage = false) {
  if (!activeWorldId || !running) return;
  const data = serializeWorld();
  localStorage.setItem(saveKey(activeWorldId), JSON.stringify(data));
  const worlds = readIndex().filter((item) => item.id !== activeWorldId);
  worlds.unshift({ id: activeWorldId, name: data.name, savedAt: data.savedAt, mode: settings.mode });
  localStorage.setItem(saveIndexKey(), JSON.stringify(worlds.slice(0, 12)));
  lastSave = performance.now();
  if (showMessage) showToast(t("savedToast"));
  renderWorldList();
}

function scheduleSave() { lastSave = 0; }

function loadWorld(id) {
  const saved = JSON.parse(localStorage.getItem(saveKey(id)) || "null");
  if (!saved) return;
  clearWorld();
  saved.blocks.forEach((block) => addBlock(block.x, block.y, block.z, block.type, false));
  activeWorldId = id;
  settings = saved.settings || settings;
  inventory = saved.inventory || inventory;
  selectedBlock = saved.selectedBlock || "grass";
  timeOfDay = saved.timeOfDay || 0.32;
  day = saved.day || 1;
  yaw = saved.yaw || 0;
  pitch = saved.pitch || -0.16;
  camera.position.fromArray(saved.position || [0, 7, 4]);
  document.querySelector("#world-name").textContent = saved.name || "MC3D";
  running = true;
  document.querySelector("#world-dialog").close();
  renderHotbar();
}

function createWorld() {
  const name = document.querySelector("#new-world-name").value.trim() || t("newWorld");
  settings = {
    mode: document.querySelector('input[name="mode"]:checked').value,
    speed: document.querySelector('input[name="speed"]:checked').value,
  };
  inventory = settings.mode === "creative"
    ? Object.fromEntries(blockTypes.map((type) => [type, 99]))
    : { grass: 12, dirt: 20, stone: 12, wood: 8, leaves: 8, sand: 10 };
  activeWorldId = crypto.randomUUID();
  selectedBlock = "grass";
  timeOfDay = 0.32;
  day = 1;
  generateWorld(Date.now());
  camera.position.set(0, 7, 4);
  yaw = 0;
  pitch = -0.16;
  document.querySelector("#world-name").textContent = name;
  running = true;
  document.querySelector("#world-dialog").close();
  renderHotbar();
  saveWorld();
}

function renderWorldList() {
  const list = document.querySelector("#world-list");
  if (!list) return;
  const worlds = readIndex();
  list.innerHTML = "";
  if (!worlds.length) {
    const empty = document.createElement("p");
    empty.className = "empty-save";
    empty.textContent = t("noWorlds");
    list.append(empty);
    return;
  }
  worlds.forEach((world) => {
    const row = document.createElement("div");
    row.className = "save-row";
    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = world.name;
    const meta = document.createElement("small");
    meta.textContent = `${world.mode || "survival"} · ${new Date(world.savedAt).toLocaleString()}`;
    info.append(title, meta);
    const load = document.createElement("button");
    load.type = "button";
    load.textContent = t("load");
    load.addEventListener("click", () => loadWorld(world.id));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete";
    remove.textContent = t("delete");
    remove.addEventListener("click", () => {
      localStorage.removeItem(saveKey(world.id));
      localStorage.setItem(saveIndexKey(), JSON.stringify(readIndex().filter((item) => item.id !== world.id)));
      renderWorldList();
    });
    row.append(info, load, remove);
    list.append(row);
  });
}

function renderHotbar() {
  const hotbar = document.querySelector("#hotbar");
  hotbar.innerHTML = "";
  blockTypes.forEach((type, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `hotbar-slot${type === selectedBlock ? " selected" : ""}`;
    button.title = t(type);
    button.innerHTML = `<span class="block-swatch" style="background:${blockDefs[type].swatch}"></span><span class="slot-count">${settings.mode === "creative" ? "∞" : inventory[type] || 0}</span>`;
    button.addEventListener("click", () => { selectedBlock = type; renderHotbar(); });
    hotbar.append(button);
    if (index === 0 && !selectedBlock) selectedBlock = type;
  });
}

function targetBlock() {
  raycaster.setFromCamera(center, camera);
  return raycaster.intersectObjects(worldGroup.children, false)[0] || null;
}

function mineBlock() {
  if (!running) return;
  const hit = targetBlock();
  if (!hit || hit.distance > 6) return showToast(t("tooFar"));
  const type = hit.object.userData.type;
  removeBlock(hit.object);
  if (settings.mode !== "creative") inventory[type] = (inventory[type] || 0) + 1;
  renderHotbar();
  showToast(t("mined", { block: t(type) }));
}

function placeBlock() {
  if (!running) return;
  const hit = targetBlock();
  if (!hit || hit.distance > 6) return showToast(t("tooFar"));
  if (settings.mode !== "creative" && !inventory[selectedBlock]) return showToast(t("empty", { block: t(selectedBlock) }));
  const normal = hit.face.normal;
  const pos = hit.object.position.clone().add(normal);
  pos.set(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
  if (pos.distanceTo(camera.position) < 1.25) return;
  addBlock(pos.x, pos.y, pos.z, selectedBlock);
  if (settings.mode !== "creative") inventory[selectedBlock] -= 1;
  renderHotbar();
  showToast(t("placed", { block: t(selectedBlock) }));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
}

function groundHeight(x, z) {
  let highest = -2;
  const bx = Math.round(x);
  const bz = Math.round(z);
  blocks.forEach((mesh) => {
    const data = mesh.userData;
    if (data.x === bx && data.z === bz && data.y > highest && data.type !== "leaves") highest = data.y;
  });
  return highest + 1.92;
}

function updatePlayer(delta) {
  if (!running) return;
  const speed = (settings.speed === "fast" ? 7 : 4.4) * delta;
  const forward = Number(keys.has("KeyW") || keys.has("forward")) - Number(keys.has("KeyS") || keys.has("back"));
  const side = Number(keys.has("KeyD") || keys.has("right")) - Number(keys.has("KeyA") || keys.has("left"));
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);
  camera.position.x += (side * cos - forward * sin) * speed;
  camera.position.z += (side * sin + forward * cos) * speed;
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, -11.5, 11.5);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, -11.5, 11.5);
  velocityY -= 18 * delta;
  camera.position.y += velocityY * delta;
  const ground = groundHeight(camera.position.x, camera.position.z);
  if (camera.position.y <= ground) {
    camera.position.y = ground;
    velocityY = 0;
    grounded = true;
  } else grounded = false;
  camera.rotation.set(pitch, yaw, 0);
}

function jump() {
  if (running && grounded) {
    velocityY = 7;
    grounded = false;
  }
}

function updateWorld(delta) {
  const multiplier = settings.speed === "fast" ? 2.2 : 1;
  timeOfDay += delta * 0.008 * multiplier;
  if (timeOfDay >= 1) { timeOfDay -= 1; day += 1; }
  const angle = timeOfDay * Math.PI * 2;
  const daylight = THREE.MathUtils.clamp(Math.sin(angle) * 0.65 + 0.48, 0.08, 1);
  sun.position.set(Math.cos(angle) * 28, Math.sin(angle) * 30, 12);
  sun.intensity = 0.3 + daylight * 2.2;
  hemi.intensity = 0.22 + daylight * 1.35;
  const sky = new THREE.Color().setHSL(0.56, 0.48, 0.08 + daylight * 0.62);
  scene.background.copy(sky);
  scene.fog.color.copy(sky);
  const hours = Math.floor(timeOfDay * 24);
  const minutes = Math.floor((timeOfDay * 24 - hours) * 60);
  document.querySelector("#clock").textContent = `${t("day")} ${day} · ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function updateTargetLabel() {
  const hit = targetBlock();
  document.querySelector("#target-label").textContent = hit && hit.distance <= 6 ? t(hit.object.userData.type) : "";
}

function resize() {
  const width = innerWidth;
  const height = innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

let previous = performance.now();
function frame(now) {
  const delta = Math.min(0.05, (now - previous) / 1000);
  previous = now;
  updatePlayer(delta);
  updateWorld(delta);
  updateTargetLabel();
  if (running && now - lastSave > 5000) saveWorld();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

function openMenu() {
  if (running) saveWorld();
  document.exitPointerLock?.();
  renderWorldList();
  document.querySelector("#world-dialog").showModal();
}

async function findPlayerKey() {
  let id = localStorage.getItem("muye-games-device-id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("muye-games-device-id", id); }
  playerKey = `device:${id}`;
  try {
    for (let i = 0; i < 12 && !window.Clerk; i += 1) await new Promise((resolve) => setTimeout(resolve, 100));
    if (window.Clerk) {
      await Promise.race([window.Clerk.load(), new Promise((resolve) => setTimeout(resolve, 1200))]);
      if (window.Clerk.user?.id) playerKey = `user:${window.Clerk.user.id}`;
    }
  } catch {}
  document.querySelector("#save-kind").textContent = playerKey.startsWith("user:") ? t("accountSave") : t("deviceSave");
  document.querySelector("#create-world").disabled = false;
  renderWorldList();
}

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  keys.add(event.code);
  if (event.code === "Space") { event.preventDefault(); jump(); }
  const slot = Number(event.key) - 1;
  if (slot >= 0 && slot < blockTypes.length) { selectedBlock = blockTypes[slot]; renderHotbar(); }
  if (event.code === "Escape") openMenu();
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
canvas.addEventListener("click", () => {
  if (!running) return;
  if (matchMedia("(pointer: fine)").matches && document.pointerLockElement !== canvas) canvas.requestPointerLock();
  else if (document.pointerLockElement === canvas) mineBlock();
});
canvas.addEventListener("contextmenu", (event) => { event.preventDefault(); placeBlock(); });
document.addEventListener("mousemove", (event) => {
  if (document.pointerLockElement !== canvas) return;
  yaw -= event.movementX * 0.0024;
  pitch = THREE.MathUtils.clamp(pitch - event.movementY * 0.0024, -1.48, 1.48);
});

let touchLook = null;
canvas.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse") return;
  touchLook = { id: event.pointerId, x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointermove", (event) => {
  if (!touchLook || event.pointerId !== touchLook.id) return;
  yaw -= (event.clientX - touchLook.x) * 0.006;
  pitch = THREE.MathUtils.clamp(pitch - (event.clientY - touchLook.y) * 0.006, -1.48, 1.48);
  touchLook.x = event.clientX;
  touchLook.y = event.clientY;
});
canvas.addEventListener("pointerup", () => { touchLook = null; });

document.querySelectorAll("[data-move]").forEach((button) => {
  const name = button.dataset.move;
  button.addEventListener("pointerdown", (event) => { event.preventDefault(); keys.add(name); });
  ["pointerup", "pointercancel", "pointerleave"].forEach((type) => button.addEventListener(type, () => keys.delete(name)));
});
document.querySelector("#jump-button").addEventListener("click", jump);
document.querySelector("#mine-button").addEventListener("click", mineBlock);
document.querySelector("#place-button").addEventListener("click", placeBlock);
document.querySelector("#menu-button").addEventListener("click", openMenu);
document.querySelector("#create-world").addEventListener("click", createWorld);
document.querySelector("#language-button").addEventListener("click", () => {
  language = languages[(languages.indexOf(language) + 1) % languages.length];
  localStorage.setItem("muye-lang", language);
  applyLanguage();
});
document.querySelector("#world-dialog").addEventListener("cancel", (event) => {
  if (!running) event.preventDefault();
});
window.addEventListener("beforeunload", () => saveWorld());

resize();
applyLanguage();
renderHotbar();
findPlayerKey();
document.querySelector("#world-dialog").showModal();
requestAnimationFrame(frame);
