import * as THREE from "/games/mc-3d/three.module.min.js";

const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
const strings = {
  en: { menu: "Menu", worlds: "Worlds", intro: "Build, explore, mine, and keep your worlds on this device.", worldName: "World name", mode: "Mode", survival: "Survival", creative: "Creative", speed: "World speed", slow: "Slow", fast: "Fast", create: "Create world", saved: "Saved worlds", deviceSave: "Saved on this device", accountSave: "Saved for your account", how: "How to play", helpMove: "WASD or the touch pad moves. Move the mouse to look; Esc releases it.", helpMine: "Click or tap Mine to break the block in the crosshair.", helpPlace: "Right-click or tap Place to place your selected block.", helpSave: "Worlds save automatically in your browser.", load: "Load", delete: "Delete", noWorlds: "No saved worlds yet.", day: "Day", mine: "Mine", place: "Place", jump: "Jump", capture: "Click to capture mouse", savedToast: "World saved", mined: "Mined {block}", placed: "Placed {block}", tooFar: "Move closer", empty: "No {block} left", newWorld: "New World", grass: "Grass", dirt: "Dirt", stone: "Stone", wood: "Wood", leaves: "Leaves", sand: "Sand" },
  zh: { menu: "菜单", worlds: "世界", intro: "建造、探索、挖掘，并把世界保存在这个设备上。", worldName: "世界名称", mode: "模式", survival: "生存", creative: "创造", speed: "世界速度", slow: "慢速", fast: "快速", create: "创建世界", saved: "已保存的世界", deviceSave: "保存在此设备", accountSave: "保存到你的账号", how: "玩法", helpMove: "WASD 或触控方向键移动，移动鼠标转向，Esc 释放鼠标。", helpMine: "点击或点按挖掘来破坏准星中的方块。", helpPlace: "右键或点按放置来放置选中的方块。", helpSave: "世界会自动保存在浏览器中。", load: "加载", delete: "删除", noWorlds: "还没有保存的世界。", day: "第", mine: "挖掘", place: "放置", jump: "跳跃", capture: "点击锁定鼠标", savedToast: "世界已保存", mined: "挖到了{block}", placed: "放置了{block}", tooFar: "靠近一点", empty: "没有{block}了", newWorld: "新世界", grass: "草方块", dirt: "泥土", stone: "石头", wood: "木头", leaves: "树叶", sand: "沙子" },
  ja: { menu: "メニュー", worlds: "ワールド", intro: "建築、探索、採掘。ワールドはこの端末に保存されます。", worldName: "ワールド名", mode: "モード", survival: "サバイバル", creative: "クリエイティブ", speed: "速度", slow: "ゆっくり", fast: "高速", create: "ワールド作成", saved: "保存済み", deviceSave: "この端末に保存", accountSave: "アカウントに保存", how: "遊び方", helpMove: "WASD またはタッチパッドで移動。ドラッグかマウスで視点移動。", helpMine: "クリックまたは採掘ボタンで照準のブロックを壊します。", helpPlace: "右クリックまたは設置ボタンでブロックを置きます。", helpSave: "ワールドは自動保存されます。", load: "ロード", delete: "削除", noWorlds: "保存済みワールドはありません。", day: "日", mine: "採掘", place: "設置", jump: "ジャンプ", savedToast: "保存しました", mined: "{block}を採掘", placed: "{block}を設置", tooFar: "近づいてください", empty: "{block}がありません", newWorld: "新しいワールド", grass: "草", dirt: "土", stone: "石", wood: "木", leaves: "葉", sand: "砂" },
  ko: { menu: "메뉴", worlds: "월드", intro: "건설하고 탐험하고 채굴하세요. 월드는 이 기기에 저장됩니다.", worldName: "월드 이름", mode: "모드", survival: "서바이벌", creative: "크리에이티브", speed: "속도", slow: "느림", fast: "빠름", create: "월드 만들기", saved: "저장된 월드", deviceSave: "이 기기에 저장", accountSave: "계정에 저장", how: "플레이 방법", helpMove: "WASD 또는 터치 패드로 이동하고 드래그나 마우스로 둘러봅니다.", helpMine: "클릭 또는 채굴 버튼으로 조준한 블록을 부숩니다.", helpPlace: "오른쪽 클릭 또는 놓기 버튼으로 블록을 놓습니다.", helpSave: "월드는 브라우저에 자동 저장됩니다.", load: "불러오기", delete: "삭제", noWorlds: "저장된 월드가 없습니다.", day: "일", mine: "채굴", place: "놓기", jump: "점프", savedToast: "월드 저장됨", mined: "{block} 채굴", placed: "{block} 놓음", tooFar: "더 가까이 이동하세요", empty: "{block} 없음", newWorld: "새 월드", grass: "잔디", dirt: "흙", stone: "돌", wood: "나무", leaves: "나뭇잎", sand: "모래" },
  es: { menu: "Menú", worlds: "Mundos", intro: "Construye, explora, mina y guarda mundos en este dispositivo.", worldName: "Nombre", mode: "Modo", survival: "Supervivencia", creative: "Creativo", speed: "Velocidad", slow: "Lenta", fast: "Rápida", create: "Crear mundo", saved: "Mundos guardados", deviceSave: "Guardado en este dispositivo", accountSave: "Guardado en tu cuenta", how: "Cómo jugar", helpMove: "WASD o el control táctil mueve. Arrastra o mueve el ratón para mirar.", helpMine: "Haz clic o toca Minar para romper el bloque en la mira.", helpPlace: "Clic derecho o toca Colocar para poner el bloque elegido.", helpSave: "Los mundos se guardan automáticamente.", load: "Cargar", delete: "Borrar", noWorlds: "No hay mundos guardados.", day: "Día", mine: "Minar", place: "Colocar", jump: "Saltar", savedToast: "Mundo guardado", mined: "Minaste {block}", placed: "Colocaste {block}", tooFar: "Acércate", empty: "No queda {block}", newWorld: "Mundo nuevo", grass: "Césped", dirt: "Tierra", stone: "Piedra", wood: "Madera", leaves: "Hojas", sand: "Arena" },
};
Object.assign(strings.en, { helpRedstone: "Use Place on a lever to switch it. Dust carries power, gates point forward, and powered TNT explodes.", redstone: "Redstone Dust", lever: "Lever", not_gate: "NOT Gate", one_way: "One-way Gate", tnt: "TNT", leverOn: "Lever on", leverOff: "Lever off", boom: "Boom!" });
Object.assign(strings.zh, { helpRedstone: "对拉杆使用放置来开关。红石粉传递能量，门朝前工作，通电的 TNT 会爆炸。", redstone: "红石粉", lever: "拉杆", not_gate: "非门", one_way: "单向门", tnt: "TNT", leverOn: "拉杆已开", leverOff: "拉杆已关", boom: "爆炸！" });
Object.assign(strings.ja, { helpRedstone: "レバーに設置を使って切り替えます。ダストは電力を運び、ゲートは前方に働き、給電された TNT は爆発します。", redstone: "レッドストーンダスト", lever: "レバー", not_gate: "NOTゲート", one_way: "単方向ゲート", tnt: "TNT", leverOn: "レバー ON", leverOff: "レバー OFF", boom: "ドカン！" });
Object.assign(strings.ko, { helpRedstone: "레버에 놓기를 사용해 켜고 끄세요. 레드스톤 가루는 전력을 전달하고 게이트는 앞으로만 작동하며 전력을 받은 TNT는 폭발합니다.", redstone: "레드스톤 가루", lever: "레버", not_gate: "NOT 게이트", one_way: "일방향 게이트", tnt: "TNT", leverOn: "레버 켜짐", leverOff: "레버 꺼짐", boom: "쾅!" });
Object.assign(strings.es, { helpRedstone: "Usa Colocar sobre una palanca para cambiarla. El polvo lleva energía, las compuertas apuntan hacia delante y el TNT con energía explota.", redstone: "Polvo de redstone", lever: "Palanca", not_gate: "Compuerta NOT", one_way: "Compuerta de una vía", tnt: "TNT", leverOn: "Palanca encendida", leverOff: "Palanca apagada", boom: "¡Bum!" });
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
  redstone: { color: 0x6f1717, poweredColor: 0xff3028, swatch: "#d72d27", shape: "dust" },
  lever: { color: 0x8b806f, poweredColor: 0xffc34e, swatch: "#b5a58d", shape: "lever" },
  not_gate: { color: 0x633866, poweredColor: 0xdb6ce3, swatch: "#9f56a5", shape: "gate" },
  one_way: { color: 0x8a5c22, poweredColor: 0xffb43b, swatch: "#c47a29", shape: "gate" },
  tnt: { color: 0xc7352f, poweredColor: 0xffe8ae, swatch: "#df3e36" },
};
const blockIcons = {
  grass: `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#765035" d="M4 11 16 5l12 6v13l-12 6-12-6Z"/><path fill="#6fbd56" d="m4 11 12-6 12 6-12 6Z"/><path fill="#4c873f" d="m16 17 12-6v5l-12 6Z"/></svg>`,
  dirt: `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#815538" d="M4 9 16 4l12 5v15l-12 5-12-5Z"/><path fill="#a0704d" d="m4 9 12 5 12-5-12-5Z"/><g fill="#4f3527"><circle cx="10" cy="18" r="1.5"/><circle cx="21" cy="21" r="1.3"/><circle cx="17" cy="11" r="1"/></g></svg>`,
  stone: `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#777d80" d="M4 9 16 4l12 5v15l-12 5-12-5Z"/><path fill="#a6abad" d="m4 9 12 5 12-5-12-5Z"/><path fill="none" stroke="#555b5e" stroke-width="1.5" d="m8 17 4-2 4 2 4-2m-8 9 4-2 5 2"/></svg>`,
  wood: `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#76502f" d="M7 7h18v20H7z"/><path fill="#aa7544" d="M7 7h18v7H7z"/><ellipse cx="16" cy="10.5" rx="6" ry="2.6" fill="none" stroke="#664321" stroke-width="1.4"/><path stroke="#4f331f" stroke-width="1.4" d="M11 16v9m6-9v9m5-9v9"/></svg>`,
  leaves: `<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="#4c9653" stroke="#2f6536" stroke-width="1.2"><circle cx="11" cy="12" r="6"/><circle cx="21" cy="12" r="6"/><circle cx="10" cy="21" r="6"/><circle cx="21" cy="21" r="7"/></g><path stroke="#b0db8f" stroke-width="1.5" d="m8 22 15-13M14 17l-5-1m10-3 1 6"/></svg>`,
  sand: `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#d4bd78" d="M4 10 16 5l12 5v14l-12 5-12-5Z"/><path fill="#f0da91" d="m4 10 12 5 12-5-12-5Z"/><g fill="#9e874d"><circle cx="9" cy="12" r="1"/><circle cx="20" cy="10" r="1"/><circle cx="14" cy="23" r="1"/><circle cx="23" cy="20" r="1"/></g></svg>`,
  redstone: `<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="#ef3d35" stroke-width="3" stroke-linecap="round"><path d="M5 16h8l3-7 3 14 3-7h5"/><path d="M16 9V5m0 22v-4"/></g><g fill="#ff8179"><circle cx="5" cy="16" r="2.5"/><circle cx="27" cy="16" r="2.5"/></g></svg>`,
  lever: `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#77716a" stroke="#d2c4ad" stroke-width="1.4" d="M6 23h20l-3 5H9Z"/><path stroke="#e7b85c" stroke-width="5" stroke-linecap="round" d="m15 22 7-15"/><circle cx="22" cy="7" r="3" fill="#ffd877"/></svg>`,
  not_gate: `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#75447a" stroke="#edb9f2" stroke-width="1.8" d="M6 6v20l17-10Z"/><circle cx="26" cy="16" r="3" fill="#171218" stroke="#edb9f2" stroke-width="1.8"/><path stroke="#edb9f2" stroke-width="2" d="M2 16h4m23 0h2"/></svg>`,
  one_way: `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#9b641e" stroke="#ffd17a" stroke-width="1.5" d="M4 10h13V5l11 11-11 11v-5H4Z"/><path stroke="#fff0bd" stroke-width="2" d="M7 16h15"/></svg>`,
  tnt: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="2" fill="#cf3831" stroke="#ff8a79" stroke-width="1.5"/><path fill="#f5e4c7" d="M4 11h24v11H4z"/><text x="16" y="19" fill="#21110e" font-size="8" font-weight="900" text-anchor="middle" font-family="sans-serif">TNT</text></svg>`,
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
scene.add(sun.target);

const worldGroup = new THREE.Group();
scene.add(worldGroup);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const dustGeometry = new THREE.BoxGeometry(0.82, 0.08, 0.82).translate(0, -0.46, 0);
const leverGeometry = new THREE.BoxGeometry(0.26, 0.5, 0.26).translate(0, -0.25, 0);
const gateGeometry = new THREE.BoxGeometry(0.82, 0.16, 0.64).translate(0, -0.42, 0);
const geometries = { dust: dustGeometry, lever: leverGeometry, gate: gateGeometry };
const gateMarkerGeometry = new THREE.BufferGeometry();
gateMarkerGeometry.setAttribute("position", new THREE.Float32BufferAttribute([
  -0.22, -0.325, 0.18,
  0.22, -0.325, 0.18,
  0, -0.325, -0.25,
], 3));
gateMarkerGeometry.computeVertexNormals();
const gateMarkerMaterials = {
  not_gate: new THREE.MeshBasicMaterial({ color: 0xffd8ff, side: THREE.DoubleSide }),
  one_way: new THREE.MeshBasicMaterial({ color: 0xfff0b2, side: THREE.DoubleSide }),
};
const materials = Object.fromEntries(Object.entries(blockDefs).map(([name, def]) => [name, new THREE.MeshLambertMaterial({ color: def.color, transparent: !!def.transparent, opacity: def.transparent ? 0.9 : 1 })]));
const poweredMaterials = Object.fromEntries(Object.entries(blockDefs)
  .filter(([, def]) => def.poweredColor)
  .map(([name, def]) => [name, new THREE.MeshLambertMaterial({ color: def.poweredColor, emissive: def.poweredColor, emissiveIntensity: 0.34 })]));

function makeTntMaterial(powered = false) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 128;
  textureCanvas.height = 128;
  const context = textureCanvas.getContext("2d");
  context.fillStyle = powered ? "#ff9b74" : "#c9342f";
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = "#f7e5c8";
  context.fillRect(0, 42, 128, 44);
  context.fillStyle = "#18110d";
  context.font = "900 38px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("TNT", 64, 65);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshLambertMaterial({ map: texture, emissive: powered ? 0xff4b2f : 0x000000, emissiveIntensity: powered ? 0.45 : 0 });
}

materials.tnt = makeTntMaterial(false);
poweredMaterials.tnt = makeTntMaterial(true);
const blocks = new Map();
const heightMap = new Map();
const generatedChunks = new Set();
const tntTimers = new Map();
const CHUNK_SIZE = 12;
const CHUNK_EDGE_PRELOAD = 4;
const NON_SOLID_BLOCKS = new Set(["leaves", "redstone", "lever", "not_gate", "one_way"]);
const SIGNAL_NEIGHBORS = [
  { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 },
];
const DIRECTION_VECTORS = {
  north: { x: 0, y: 0, z: -1 },
  south: { x: 0, y: 0, z: 1 },
  east: { x: 1, y: 0, z: 0 },
  west: { x: -1, y: 0, z: 0 },
};
const raycaster = new THREE.Raycaster();
raycaster.far = 6;
const center = new THREE.Vector2(0, 0);

let language = languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
let playerKey = "device";
let activeWorldId = "";
let worldSeed = Date.now();
let settings = { mode: "survival", speed: "slow" };
let inventory = { grass: 12, dirt: 20, stone: 12, wood: 8, leaves: 8, sand: 10, redstone: 24, lever: 4, not_gate: 4, one_way: 6, tnt: 6 };
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
let fallbackMouse = false;
let lastChunkZone = "";
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
function columnKey(x, z) { return `${x},${z}`; }
function chunkKey(x, z) { return `${x},${z}`; }
function isSolidBlock(type) { return !NON_SOLID_BLOCKS.has(type); }
function offsetKey(data, offset) { return keyFor(data.x + offset.x, data.y + offset.y, data.z + offset.z); }

function placementDirection() {
  const x = -Math.sin(yaw);
  const z = -Math.cos(yaw);
  if (Math.abs(x) > Math.abs(z)) return x > 0 ? "east" : "west";
  return z > 0 ? "south" : "north";
}

function setBlockVisual(mesh) {
  const { type, powered, on, armed, direction = "north" } = mesh.userData;
  const active = type === "lever" ? on : (type === "tnt" ? armed : powered);
  mesh.material = active && poweredMaterials[type] ? poweredMaterials[type] : materials[type];
  if (type === "lever") mesh.rotation.z = on ? -0.65 : 0.65;
  if (type === "not_gate" || type === "one_way") {
    const rotations = { north: 0, east: -Math.PI / 2, south: Math.PI, west: Math.PI / 2 };
    mesh.rotation.y = rotations[direction] || 0;
  }
}

function updateColumnTop(x, z, y, type) {
  if (!isSolidBlock(type)) return;
  const key = columnKey(x, z);
  heightMap.set(key, Math.max(heightMap.get(key) ?? -2, y));
}

function refreshColumnTop(x, z) {
  let highest = -2;
  blocks.forEach((mesh) => {
    const data = mesh.userData;
    if (data.x === x && data.z === z && isSolidBlock(data.type)) highest = Math.max(highest, data.y);
  });
  heightMap.set(columnKey(x, z), highest);
}

function addBlock(x, y, z, type, save = true, extra = {}) {
  const id = keyFor(x, y, z);
  if (blocks.has(id)) return;
  const definition = blockDefs[type] || blockDefs.dirt;
  const mesh = new THREE.Mesh(geometries[definition.shape] || boxGeometry, materials[type] || materials.dirt);
  mesh.position.set(x, y, z);
  mesh.castShadow = type !== "leaves" && type !== "redstone";
  mesh.receiveShadow = true;
  mesh.userData = { ...extra, x, y, z, type };
  if (type === "tnt") mesh.userData.armed = false;
  if ((type === "not_gate" || type === "one_way") && !mesh.userData.direction) mesh.userData.direction = "north";
  if (type === "not_gate" || type === "one_way") mesh.add(new THREE.Mesh(gateMarkerGeometry, gateMarkerMaterials[type]));
  setBlockVisual(mesh);
  blocks.set(id, mesh);
  worldGroup.add(mesh);
  updateColumnTop(x, z, y, type);
  if (save) scheduleSave();
}

function removeBlock(mesh, save = true) {
  const { x, y, z } = mesh.userData;
  const id = keyFor(x, y, z);
  if (tntTimers.has(id)) {
    clearTimeout(tntTimers.get(id));
    tntTimers.delete(id);
  }
  blocks.delete(keyFor(x, y, z));
  worldGroup.remove(mesh);
  if (isSolidBlock(mesh.userData.type) && heightMap.get(columnKey(x, z)) === y) refreshColumnTop(x, z);
  if (save) scheduleSave();
}

function coordinateRandom(seed, x, z, salt = 0) {
  let value = (seed ^ Math.imul(x, 374761393) ^ Math.imul(z, 668265263) ^ Math.imul(salt, 1442695041)) >>> 0;
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

function generateChunk(chunkX, chunkZ, save = true) {
  const id = chunkKey(chunkX, chunkZ);
  if (generatedChunks.has(id)) return false;
  generatedChunks.add(id);
  const startX = chunkX * CHUNK_SIZE;
  const startZ = chunkZ * CHUNK_SIZE;
  const phaseX = (worldSeed % 997) * 0.013;
  const phaseZ = (worldSeed % 991) * 0.017;
  for (let x = startX; x < startX + CHUNK_SIZE; x += 1) {
    for (let z = startZ; z < startZ + CHUNK_SIZE; z += 1) {
      const wave = Math.sin(x * 0.18 + phaseX) * 0.8
        + Math.cos(z * 0.15 + phaseZ) * 0.7
        + Math.sin((x + z) * 0.07 + phaseX) * 0.55;
      const jitter = (coordinateRandom(worldSeed, x, z) - 0.5) * 1.1;
      const height = Math.max(1, Math.min(6, Math.round(2.5 + wave + jitter)));
      const beach = height <= 2 && coordinateRandom(worldSeed, x, z, 1) > 0.36;
      for (let y = 0; y <= height; y += 1) {
        const type = y === height ? (beach ? "sand" : "grass") : (y >= height - 2 ? "dirt" : "stone");
        addBlock(x, y, z, type, false);
      }
      if (!beach && coordinateRandom(worldSeed, x, z, 2) > 0.965 && Math.hypot(x, z) > 4) addTree(x, height + 1, z);
    }
  }
  if (save) scheduleSave();
  return true;
}

function generateWorld(seed = Date.now()) {
  clearWorld();
  worldSeed = Number(seed) || Date.now();
  for (let chunkX = -1; chunkX <= 0; chunkX += 1) {
    for (let chunkZ = -1; chunkZ <= 0; chunkZ += 1) generateChunk(chunkX, chunkZ, false);
  }
}

function ensureTerrainAroundPlayer() {
  const chunkX = Math.floor(camera.position.x / CHUNK_SIZE);
  const chunkZ = Math.floor(camera.position.z / CHUNK_SIZE);
  const localX = camera.position.x - chunkX * CHUNK_SIZE;
  const localZ = camera.position.z - chunkZ * CHUNK_SIZE;
  const chunkXs = [chunkX];
  const chunkZs = [chunkZ];
  if (localX <= CHUNK_EDGE_PRELOAD) chunkXs.push(chunkX - 1);
  if (localX >= CHUNK_SIZE - CHUNK_EDGE_PRELOAD) chunkXs.push(chunkX + 1);
  if (localZ <= CHUNK_EDGE_PRELOAD) chunkZs.push(chunkZ - 1);
  if (localZ >= CHUNK_SIZE - CHUNK_EDGE_PRELOAD) chunkZs.push(chunkZ + 1);
  const zone = `${chunkXs.join(":")}|${chunkZs.join(":")}`;
  if (zone === lastChunkZone) return;
  lastChunkZone = zone;
  let added = false;
  chunkXs.forEach((x) => chunkZs.forEach((z) => { added = generateChunk(x, z, false) || added; }));
  if (added) scheduleSave();
}

function addTree(x, y, z) {
  for (let i = 0; i < 3; i += 1) addBlock(x, y + i, z, "wood", false);
  for (let dx = -1; dx <= 1; dx += 1) for (let dz = -1; dz <= 1; dz += 1) addBlock(x + dx, y + 3, z + dz, "leaves", false);
  addBlock(x, y + 4, z, "leaves", false);
}

function clearWorld() {
  tntTimers.forEach((timer) => clearTimeout(timer));
  tntTimers.clear();
  while (worldGroup.children.length) worldGroup.remove(worldGroup.children[0]);
  blocks.clear();
  heightMap.clear();
  generatedChunks.clear();
  lastChunkZone = "";
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
    seed: worldSeed,
    generatedChunks: [...generatedChunks],
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
  saved.blocks.forEach((block) => addBlock(block.x, block.y, block.z, block.type, false, block));
  worldSeed = Number(saved.seed) || [...id].reduce((seed, character) => Math.imul(seed ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
  const savedChunks = Array.isArray(saved.generatedChunks) && saved.generatedChunks.length
    ? saved.generatedChunks
    : ["-1,-1", "-1,0", "0,-1", "0,0"];
  savedChunks.forEach((chunk) => generatedChunks.add(chunk));
  activeWorldId = id;
  settings = saved.settings || settings;
  inventory = saved.inventory || inventory;
  selectedBlock = saved.selectedBlock || "grass";
  timeOfDay = saved.timeOfDay || 0.32;
  day = saved.day || 1;
  yaw = saved.yaw || 0;
  pitch = saved.pitch || -0.16;
  camera.position.fromArray(saved.position || [0, 7, 4]);
  ensureTerrainAroundPlayer();
  document.querySelector("#world-name").textContent = saved.name || "MC3D";
  running = true;
  document.querySelector("#world-dialog").close();
  captureMouse();
  renderHotbar();
  refreshRedstone();
}

function createWorld() {
  const name = document.querySelector("#new-world-name").value.trim() || t("newWorld");
  settings = {
    mode: document.querySelector('input[name="mode"]:checked').value,
    speed: document.querySelector('input[name="speed"]:checked').value,
  };
  inventory = settings.mode === "creative"
    ? Object.fromEntries(blockTypes.map((type) => [type, 99]))
    : { grass: 12, dirt: 20, stone: 12, wood: 8, leaves: 8, sand: 10, redstone: 24, lever: 4, not_gate: 4, one_way: 6, tnt: 6 };
  activeWorldId = crypto.randomUUID();
  selectedBlock = "grass";
  timeOfDay = 0.32;
  day = 1;
  generateWorld(Date.now());
  camera.position.set(0, 7, 4);
  ensureTerrainAroundPlayer();
  yaw = 0;
  pitch = -0.16;
  document.querySelector("#world-name").textContent = name;
  running = true;
  document.querySelector("#world-dialog").close();
  captureMouse();
  renderHotbar();
  refreshRedstone();
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
    button.title = `${index + 1}. ${t(type)}`;
    button.setAttribute("aria-label", `${index + 1}. ${t(type)}`);
    button.innerHTML = `<span class="slot-number">${index + 1}</span><span class="block-icon">${blockIcons[type]}</span><span class="slot-count">${settings.mode === "creative" ? "∞" : inventory[type] || 0}</span>`;
    button.addEventListener("click", () => { selectedBlock = type; renderHotbar(); });
    hotbar.append(button);
    if (index === 0 && !selectedBlock) selectedBlock = type;
  });
}

function frontKey(mesh) {
  const direction = DIRECTION_VECTORS[mesh.userData.direction] || DIRECTION_VECTORS.north;
  return offsetKey(mesh.userData, direction);
}

function circuitOutputs(gateStates) {
  const outputs = new Set();
  blocks.forEach((mesh, key) => {
    if (mesh.userData.type === "lever" && mesh.userData.on) {
      SIGNAL_NEIGHBORS.forEach((neighbor) => outputs.add(offsetKey(mesh.userData, neighbor)));
    }
    if ((mesh.userData.type === "not_gate" || mesh.userData.type === "one_way") && gateStates.get(key)) {
      outputs.add(frontKey(mesh));
    }
  });
  return outputs;
}

function poweredDustFrom(outputs) {
  const powered = new Set();
  const queue = [];
  blocks.forEach((mesh, key) => {
    if (mesh.userData.type === "redstone" && outputs.has(key)) {
      powered.add(key);
      queue.push(mesh);
    }
  });
  while (queue.length) {
    const mesh = queue.shift();
    SIGNAL_NEIGHBORS.forEach((neighbor) => {
      const nextKey = offsetKey(mesh.userData, neighbor);
      const next = blocks.get(nextKey);
      if (next?.userData.type === "redstone" && !powered.has(nextKey)) {
        powered.add(nextKey);
        queue.push(next);
      }
    });
  }
  return powered;
}

function gateInputPowered(mesh, poweredDust, gateStates) {
  const front = DIRECTION_VECTORS[mesh.userData.direction] || DIRECTION_VECTORS.north;
  const back = { x: -front.x, y: 0, z: -front.z };
  const inputKey = offsetKey(mesh.userData, back);
  const input = blocks.get(inputKey);
  if (!input) return false;
  if (input.userData.type === "lever") return !!input.userData.on;
  if (input.userData.type === "redstone") return poweredDust.has(inputKey);
  if (input.userData.type === "not_gate" || input.userData.type === "one_way") {
    return !!gateStates.get(inputKey) && frontKey(input) === keyFor(mesh.userData.x, mesh.userData.y, mesh.userData.z);
  }
  return false;
}

function armTnt(mesh, delay = 2200) {
  const key = keyFor(mesh.userData.x, mesh.userData.y, mesh.userData.z);
  if (!blocks.has(key)) return;
  if (tntTimers.has(key)) {
    if (delay >= 1000) return;
    clearTimeout(tntTimers.get(key));
    tntTimers.delete(key);
  }
  mesh.userData.armed = true;
  setBlockVisual(mesh);
  const timer = setTimeout(() => {
    tntTimers.delete(key);
    explodeTnt(mesh);
  }, delay);
  tntTimers.set(key, timer);
  scheduleSave();
}

function explodeTnt(mesh) {
  const origin = mesh.position.clone();
  const chained = [];
  [...blocks.values()].forEach((candidate) => {
    if (candidate.position.distanceTo(origin) > 3.2) return;
    if (candidate !== mesh && candidate.userData.type === "tnt") chained.push(candidate);
    else removeBlock(candidate, false);
  });
  chained.forEach((candidate) => armTnt(candidate, 360));
  const flash = new THREE.PointLight(0xff6b2f, 18, 18);
  flash.position.copy(origin);
  scene.add(flash);
  setTimeout(() => scene.remove(flash), 180);
  const playerDistance = camera.position.distanceTo(origin);
  if (playerDistance < 6) {
    const push = camera.position.clone().sub(origin).normalize().multiplyScalar((6 - playerDistance) * 0.32);
    camera.position.add(push);
    velocityY = Math.max(velocityY, 4.5);
  }
  refreshRedstone();
  scheduleSave();
  showToast(t("boom"));
}

function refreshRedstone() {
  let gateStates = new Map();
  blocks.forEach((mesh, key) => {
    if (mesh.userData.type === "not_gate" || mesh.userData.type === "one_way") gateStates.set(key, !!mesh.userData.powered);
  });
  let outputs = new Set();
  let poweredDust = new Set();
  for (let pass = 0; pass < 12; pass += 1) {
    outputs = circuitOutputs(gateStates);
    poweredDust = poweredDustFrom(outputs);
    const nextStates = new Map();
    blocks.forEach((mesh, key) => {
      if (mesh.userData.type !== "not_gate" && mesh.userData.type !== "one_way") return;
      const input = gateInputPowered(mesh, poweredDust, gateStates);
      nextStates.set(key, mesh.userData.type === "not_gate" ? !input : input);
    });
    const stable = [...nextStates].every(([key, value]) => gateStates.get(key) === value);
    gateStates = nextStates;
    if (stable) break;
  }
  outputs = circuitOutputs(gateStates);
  poweredDust = poweredDustFrom(outputs);
  blocks.forEach((mesh, key) => {
    const { type } = mesh.userData;
    if (type === "redstone") mesh.userData.powered = poweredDust.has(key);
    if (type === "not_gate" || type === "one_way") mesh.userData.powered = !!gateStates.get(key);
    if (type === "lever" || type === "redstone" || type === "not_gate" || type === "one_way") setBlockVisual(mesh);
    if (type === "tnt") {
      const dustNearby = SIGNAL_NEIGHBORS.some((neighbor) => poweredDust.has(offsetKey(mesh.userData, neighbor)));
      if (outputs.has(key) || dustNearby) armTnt(mesh);
    }
  });
}

function toggleLever(mesh) {
  mesh.userData.on = !mesh.userData.on;
  setBlockVisual(mesh);
  refreshRedstone();
  scheduleSave();
  showToast(t(mesh.userData.on ? "leverOn" : "leverOff"));
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
  refreshRedstone();
  renderHotbar();
  showToast(t("mined", { block: t(type) }));
}

function placeBlock() {
  if (!running) return;
  const hit = targetBlock();
  if (!hit || hit.distance > 6) return showToast(t("tooFar"));
  if (hit.object.userData.type === "lever") return toggleLever(hit.object);
  if (settings.mode !== "creative" && !inventory[selectedBlock]) return showToast(t("empty", { block: t(selectedBlock) }));
  const normal = hit.face.normal;
  const pos = hit.object.position.clone().add(normal);
  pos.set(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
  if (pos.distanceTo(camera.position) < 1.25) return;
  const extra = selectedBlock === "lever"
    ? { on: false }
    : ((selectedBlock === "not_gate" || selectedBlock === "one_way") ? { direction: placementDirection(), powered: false } : {});
  addBlock(pos.x, pos.y, pos.z, selectedBlock, true, extra);
  if (settings.mode !== "creative") inventory[selectedBlock] -= 1;
  refreshRedstone();
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
  const bx = Math.round(x);
  const bz = Math.round(z);
  return (heightMap.get(columnKey(bx, bz)) ?? -2) + 1.92;
}

function updatePlayer(delta) {
  if (!running) return;
  const speed = (settings.speed === "fast" ? 7 : 4.4) * delta;
  const forward = Number(keys.has("KeyW") || keys.has("forward")) - Number(keys.has("KeyS") || keys.has("back"));
  const side = Number(keys.has("KeyD") || keys.has("right")) - Number(keys.has("KeyA") || keys.has("left"));
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);
  camera.position.x += (side * cos - forward * sin) * speed;
  camera.position.z += (side * sin - forward * cos) * speed;
  ensureTerrainAroundPlayer();
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
  sun.position.set(camera.position.x + Math.cos(angle) * 28, Math.sin(angle) * 30, camera.position.z + 12);
  sun.target.position.set(camera.position.x, 0, camera.position.z);
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
  if (!hit || hit.distance > 6) {
    document.querySelector("#target-label").textContent = "";
    return;
  }
  const data = hit.object.userData;
  document.querySelector("#target-label").textContent = data.type === "lever"
    ? `${t("lever")} · ${t(data.on ? "leverOn" : "leverOff")}`
    : t(data.type);
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
  fallbackMouse = false;
  document.body.classList.remove("is-playing");
  document.exitPointerLock?.();
  renderWorldList();
  document.querySelector("#world-dialog").showModal();
}

function enableMouseFallback() {
  if (!running || document.querySelector("#world-dialog").open || matchMedia("(pointer: coarse)").matches) return;
  fallbackMouse = true;
  document.body.classList.add("is-playing");
  document.querySelector("#mouse-capture").hidden = true;
}

function captureMouse() {
  if (!running || matchMedia("(pointer: coarse)").matches) return;
  document.querySelector("#mouse-capture").hidden = true;
  try {
    const attempt = canvas.requestPointerLock?.();
    if (attempt?.catch) attempt.catch(enableMouseFallback);
    setTimeout(() => {
      if (document.pointerLockElement !== canvas) enableMouseFallback();
    }, 180);
  } catch {
    enableMouseFallback();
  }
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
  if (event.code === "Escape" && fallbackMouse) {
    fallbackMouse = false;
    keys.clear();
    document.body.classList.remove("is-playing");
    document.querySelector("#mouse-capture").hidden = false;
    return;
  }
  keys.add(event.code);
  if (event.code === "Space") { event.preventDefault(); jump(); }
  let slot = /^Digit[1-9]$/.test(event.code) ? Number(event.code.at(-1)) - 1 : -1;
  if (event.code === "Digit0" || event.code === "Numpad0") slot = 9;
  if (event.code === "Minus" || event.code === "NumpadSubtract") slot = 10;
  if (slot >= 0 && slot < blockTypes.length) { selectedBlock = blockTypes[slot]; renderHotbar(); }
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
canvas.addEventListener("click", () => {
  if (!running) return;
  if (document.pointerLockElement !== canvas && !fallbackMouse) captureMouse();
  else mineBlock();
});
canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  if (document.pointerLockElement !== canvas && !fallbackMouse) captureMouse();
  else placeBlock();
});
document.addEventListener("mousemove", (event) => {
  if (document.pointerLockElement !== canvas && !fallbackMouse) return;
  yaw -= event.movementX * 0.0024;
  pitch = THREE.MathUtils.clamp(pitch - event.movementY * 0.0024, -1.48, 1.48);
});

document.addEventListener("pointerlockchange", () => {
  const captured = document.pointerLockElement === canvas;
  if (captured) fallbackMouse = false;
  document.body.classList.toggle("is-playing", captured || fallbackMouse);
  document.querySelector("#mouse-capture").hidden = captured || fallbackMouse || !running || document.querySelector("#world-dialog").open;
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
document.querySelector("#mouse-capture").addEventListener("click", captureMouse);
document.querySelector("#create-world").addEventListener("click", createWorld);
document.querySelector("#language-button").addEventListener("click", () => {
  language = languages[(languages.indexOf(language) + 1) % languages.length];
  localStorage.setItem("muye-lang", language);
  applyLanguage();
});
document.querySelector("#world-dialog").addEventListener("cancel", (event) => {
  if (!running) event.preventDefault();
});
document.querySelector("#world-dialog").addEventListener("close", () => {
  document.querySelector("#mouse-capture").hidden = !running || matchMedia("(pointer: coarse)").matches;
});
window.addEventListener("beforeunload", () => saveWorld());

resize();
applyLanguage();
renderHotbar();
findPlayerKey();
document.querySelector("#world-dialog").showModal();
requestAnimationFrame(frame);
