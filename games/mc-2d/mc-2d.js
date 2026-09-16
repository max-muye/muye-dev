const canvas = document.querySelector("#world");
const ctx = canvas.getContext("2d", { alpha: false });
const hotbar = document.querySelector("#hotbar");
const saveState = document.querySelector("#save-state");
const positionEl = document.querySelector("#position");
const worldNameEl = document.querySelector("#world-name");
const clockIcon = document.querySelector("#clock-icon");
const clockLabel = document.querySelector("#clock-label");
const heartsEl = document.querySelector("#hearts");
const toastEl = document.querySelector("#toast");
const overlay = document.querySelector("#start-overlay");
const helpDialog = document.querySelector("#help-dialog");
const newWorldDialog = document.querySelector("#new-world-dialog");
const craftDialog = document.querySelector("#craft-dialog");
const backpackDialog = document.querySelector("#backpack-dialog");
const worldNameInput = document.querySelector("#world-name-input");
const resourceList = document.querySelector("#resource-list");
const toolList = document.querySelector("#tool-list");
const recipeList = document.querySelector("#recipe-list");
const equippedToolEl = document.querySelector("#equipped-tool");
const backpackBlocks = document.querySelector("#backpack-blocks");
const backpackMaterials = document.querySelector("#backpack-materials");
const backpackTools = document.querySelector("#backpack-tools");

const WORLD_WIDTH = 160;
const WORLD_HEIGHT = 56;
const TILE = 32;
const REACH = 5.25;
const SAVE_VERSION = 2;
const HOTBAR_BLOCKS = [2, 3, 4, 8, 5, 7, 10];

const blockData = {
  1: { name: "grass", solid: true, hardness: 0.65 },
  2: { name: "dirt", solid: true, hardness: 0.7 },
  3: { name: "stone", solid: true, hardness: 2.5, tool: "pickaxe", tier: 1 },
  4: { name: "log", solid: true, hardness: 1.6, tool: "axe" },
  5: { name: "leaves", solid: true, hardness: 0.35 },
  6: { name: "coal", solid: true, hardness: 3, tool: "pickaxe", tier: 1 },
  7: { name: "crystal", solid: true, hardness: 4.5, tool: "pickaxe", tier: 3 },
  8: { name: "planks", solid: true, hardness: 1, tool: "axe" },
  9: { name: "ironOre", solid: true, hardness: 3.5, tool: "pickaxe", tier: 2 },
  10: { name: "furnace", solid: true, hardness: 3, tool: "pickaxe", tier: 1 },
};

const toolData = {
  hand: { name: "hand", icon: "✋", kind: "hand", tier: 0, speed: 1 },
  woodPickaxe: { name: "woodPickaxe", icon: "⛏", kind: "pickaxe", tier: 1, speed: 2.4 },
  stonePickaxe: { name: "stonePickaxe", icon: "⛏", kind: "pickaxe", tier: 2, speed: 4.2 },
  ironPickaxe: { name: "ironPickaxe", icon: "⛏", kind: "pickaxe", tier: 3, speed: 6.4 },
  woodAxe: { name: "woodAxe", icon: "🪓", kind: "axe", tier: 1, speed: 2.8 },
  stoneAxe: { name: "stoneAxe", icon: "🪓", kind: "axe", tier: 2, speed: 4.5 },
  ironAxe: { name: "ironAxe", icon: "🪓", kind: "axe", tier: 3, speed: 6.6 },
};

const recipes = [
  { id: "planks", name: "recipePlanks", icon: "▤", cost: { 4: 1 }, output: { 8: 4 } },
  { id: "sticks", name: "recipeSticks", icon: "╫", cost: { 8: 2 }, output: { sticks: 4 } },
  { id: "woodPickaxe", name: "woodPickaxe", icon: "⛏", cost: { 8: 3, sticks: 2 }, tool: "woodPickaxe" },
  { id: "woodAxe", name: "woodAxe", icon: "🪓", cost: { 8: 3, sticks: 2 }, tool: "woodAxe" },
  { id: "stonePickaxe", name: "stonePickaxe", icon: "⛏", cost: { 3: 3, sticks: 2 }, tool: "stonePickaxe" },
  { id: "stoneAxe", name: "stoneAxe", icon: "🪓", cost: { 3: 3, sticks: 2 }, tool: "stoneAxe" },
  { id: "furnace", name: "furnace", icon: "▣", cost: { 3: 8 }, output: { 10: 1 } },
  { id: "smeltIron", name: "smeltIron", icon: "♨", cost: { 9: 1, 6: 1 }, output: { ironIngot: 1 }, furnace: true },
  { id: "ironPickaxe", name: "ironPickaxe", icon: "⛏", cost: { ironIngot: 3, sticks: 2 }, tool: "ironPickaxe" },
  { id: "ironAxe", name: "ironAxe", icon: "🪓", cost: { ironIngot: 3, sticks: 2 }, tool: "ironAxe" },
];

const text = {
  en: {
    games: "Games", loading: "Loading world...", sandbox: "BLOCK SANDBOX", tagline: "Mine. Build. Explore. Your world waits here.", save: "Save", newWorld: "New world", pause: "Pause", resume: "Resume", craft: "Craft planks", mine: "Mine", place: "Place", fieldGuide: "FIELD GUIDE", howToPlay: "How to play", moveTip: "Move with A/D and jump with W or Space.", breakTitle: "Break", breakTip: "Left-click or tap a nearby block to mine it.", buildTitle: "Build", buildTip: "Right-click, or choose Place on touch screens.", hotbarTip: "Choose a block from your hotbar.", helpTitle: "Your first day", help1: "Mine a tree to collect logs.", help2: "Craft each log into four wooden planks.", help3: "Mine dirt and stone, then build a shelter.", help4: "Explore underground to find coal and bright crystal.", autosaveHelp: "The world autosaves after changes and when you leave the page.", newAdventure: "NEW ADVENTURE", makeWorld: "Make a new world?", replaceWarning: "This replaces the saved MC 2D world for this user on this browser.", worldName: "World name", cancel: "Cancel", create: "Create world", welcome: "A fresh world is ready.", enterWorld: "Enter world", saved: "World saved", saving: "Saving...", deviceSave: "Saved on this device", accountSave: "Saved for your account", day: "Day {day}", night: "Night {day}", paused: "World paused", tooFar: "That block is too far away", noBlock: "Mine blocks to collect them first", needsSupport: "Place blocks beside another block", blocked: "There is something in the way", crafted: "Crafted 4 planks", needLog: "Mine a log before crafting", mined: "+1 {block}", placed: "Placed {block}", grass: "Grass", dirt: "Dirt", stone: "Stone", log: "Log", leaves: "Leaves", coal: "Coal", crystal: "Crystal", planks: "Planks", worldDefault: "World 1", health: "Health"
  },
  zh: {
    games: "游戏", loading: "正在加载世界...", sandbox: "方块沙盒", tagline: "挖掘、建造、探索。你的世界在这里等你。", save: "保存", newWorld: "新世界", pause: "暂停", resume: "继续", craft: "合成木板", mine: "挖掘", place: "放置", fieldGuide: "野外指南", howToPlay: "怎么玩", moveTip: "用 A/D 移动，W 或空格跳跃。", breakTitle: "挖掘", breakTip: "左键或点击附近的方块来挖掘。", buildTitle: "建造", buildTip: "右键，或在触屏上选择“放置”。", hotbarTip: "从快捷栏选择方块。", helpTitle: "你的第一天", help1: "挖一棵树来收集原木。", help2: "每块原木可以合成四块木板。", help3: "挖泥土和石头，然后建一座小屋。", help4: "探索地下，寻找煤炭和发光水晶。", autosaveHelp: "更改后和离开页面时，世界都会自动保存。", newAdventure: "新的冒险", makeWorld: "创建新世界？", replaceWarning: "这会替换此浏览器中为当前用户保存的 MC 2D 世界。", worldName: "世界名称", cancel: "取消", create: "创建世界", welcome: "一个新世界已经准备好了。", enterWorld: "进入世界", saved: "世界已保存", saving: "正在保存...", deviceSave: "已保存在此设备", accountSave: "已为你的账户保存", day: "第 {day} 天", night: "第 {day} 夜", paused: "世界已暂停", tooFar: "那个方块太远了", noBlock: "先挖掘方块来收集它", needsSupport: "方块必须放在另一个方块旁边", blocked: "那里有东西挡着", crafted: "合成了 4 块木板", needLog: "先挖一块原木", mined: "+1 {block}", placed: "已放置 {block}", grass: "草方块", dirt: "泥土", stone: "石头", log: "原木", leaves: "树叶", coal: "煤炭", crystal: "水晶", planks: "木板", worldDefault: "世界 1", health: "生命"
  },
  ja: {
    games: "ゲーム", loading: "ワールドを読み込み中...", sandbox: "ブロックサンドボックス", tagline: "掘る。作る。探検する。あなたの世界がここに。", save: "保存", newWorld: "新しい世界", pause: "一時停止", resume: "再開", craft: "板材を作る", mine: "採掘", place: "置く", fieldGuide: "フィールドガイド", howToPlay: "遊び方", moveTip: "A/Dで移動、WまたはSpaceでジャンプ。", breakTitle: "壊す", breakTip: "左クリックまたは近くのブロックをタップ。", buildTitle: "建築", buildTip: "右クリック、タッチでは「置く」を選択。", hotbarTip: "ホットバーからブロックを選ぶ。", helpTitle: "最初の日", help1: "木を掘って丸太を集めよう。", help2: "丸太1個から板材4個を作れます。", help3: "土と石を掘って小屋を作ろう。", help4: "地下で石炭と光る結晶を探そう。", autosaveHelp: "変更時とページを離れる時に自動保存されます。", newAdventure: "新しい冒険", makeWorld: "新しい世界を作りますか？", replaceWarning: "このブラウザの現在のユーザーの保存世界を置き換えます。", worldName: "世界名", cancel: "キャンセル", create: "作成", welcome: "新しい世界の準備ができました。", enterWorld: "世界に入る", saved: "保存しました", saving: "保存中...", deviceSave: "この端末に保存", accountSave: "アカウント用に保存", day: "{day}日目", night: "{day}日目の夜", paused: "一時停止中", tooFar: "遠すぎます", noBlock: "まずブロックを採掘してください", needsSupport: "他のブロックの隣に置いてください", blocked: "そこには置けません", crafted: "板材を4個作りました", needLog: "先に丸太を採掘しよう", mined: "+1 {block}", placed: "{block}を置きました", grass: "草", dirt: "土", stone: "石", log: "丸太", leaves: "葉", coal: "石炭", crystal: "結晶", planks: "板材", worldDefault: "ワールド 1", health: "体力"
  },
  ko: {
    games: "게임", loading: "월드 불러오는 중...", sandbox: "블록 샌드박스", tagline: "캐고, 짓고, 탐험하세요. 나만의 월드가 기다립니다.", save: "저장", newWorld: "새 월드", pause: "일시정지", resume: "계속", craft: "판자 제작", mine: "캐기", place: "놓기", fieldGuide: "필드 가이드", howToPlay: "플레이 방법", moveTip: "A/D로 이동하고 W 또는 Space로 점프하세요.", breakTitle: "부수기", breakTip: "왼쪽 클릭하거나 가까운 블록을 탭하세요.", buildTitle: "건축", buildTip: "오른쪽 클릭하거나 터치에서 놓기를 선택하세요.", hotbarTip: "단축바에서 블록을 고르세요.", helpTitle: "첫날", help1: "나무를 캐서 통나무를 모으세요.", help2: "통나무 하나로 판자 네 개를 만드세요.", help3: "흙과 돌을 캐서 집을 지으세요.", help4: "땅속에서 석탄과 빛나는 수정을 찾으세요.", autosaveHelp: "변경할 때와 페이지를 나갈 때 자동 저장됩니다.", newAdventure: "새 모험", makeWorld: "새 월드를 만들까요?", replaceWarning: "이 브라우저의 현재 사용자 저장 월드를 교체합니다.", worldName: "월드 이름", cancel: "취소", create: "만들기", welcome: "새 월드가 준비되었습니다.", enterWorld: "월드 입장", saved: "월드 저장됨", saving: "저장 중...", deviceSave: "이 기기에 저장됨", accountSave: "계정에 저장됨", day: "{day}일", night: "{day}일 밤", paused: "월드 일시정지", tooFar: "너무 멀리 있습니다", noBlock: "먼저 블록을 캐세요", needsSupport: "다른 블록 옆에 놓으세요", blocked: "그곳은 막혀 있습니다", crafted: "판자 4개 제작", needLog: "먼저 통나무를 캐세요", mined: "+1 {block}", placed: "{block} 놓음", grass: "잔디", dirt: "흙", stone: "돌", log: "통나무", leaves: "나뭇잎", coal: "석탄", crystal: "수정", planks: "판자", worldDefault: "월드 1", health: "체력"
  },
  es: {
    games: "Juegos", loading: "Cargando mundo...", sandbox: "MUNDO DE BLOQUES", tagline: "Mina. Construye. Explora. Tu mundo te espera.", save: "Guardar", newWorld: "Nuevo mundo", pause: "Pausa", resume: "Continuar", craft: "Crear tablones", mine: "Minar", place: "Colocar", fieldGuide: "GUÍA DE CAMPO", howToPlay: "Cómo jugar", moveTip: "Muévete con A/D y salta con W o Espacio.", breakTitle: "Romper", breakTip: "Haz clic izquierdo o toca un bloque cercano.", buildTitle: "Construir", buildTip: "Clic derecho o elige Colocar en pantalla táctil.", hotbarTip: "Elige un bloque de la barra rápida.", helpTitle: "Tu primer día", help1: "Mina un árbol para conseguir troncos.", help2: "Convierte cada tronco en cuatro tablones.", help3: "Mina tierra y piedra y construye un refugio.", help4: "Busca carbón y cristales brillantes bajo tierra.", autosaveHelp: "El mundo se guarda tras los cambios y al salir.", newAdventure: "NUEVA AVENTURA", makeWorld: "¿Crear un mundo nuevo?", replaceWarning: "Reemplaza el mundo guardado para este usuario en este navegador.", worldName: "Nombre del mundo", cancel: "Cancelar", create: "Crear", welcome: "Un mundo nuevo está listo.", enterWorld: "Entrar al mundo", saved: "Mundo guardado", saving: "Guardando...", deviceSave: "Guardado en este dispositivo", accountSave: "Guardado para tu cuenta", day: "Día {day}", night: "Noche {day}", paused: "Mundo en pausa", tooFar: "Ese bloque está demasiado lejos", noBlock: "Primero consigue bloques minando", needsSupport: "Coloca bloques junto a otro bloque", blocked: "Hay algo en medio", crafted: "Creaste 4 tablones", needLog: "Primero mina un tronco", mined: "+1 {block}", placed: "Colocaste {block}", grass: "Césped", dirt: "Tierra", stone: "Piedra", log: "Tronco", leaves: "Hojas", coal: "Carbón", crystal: "Cristal", planks: "Tablones", worldDefault: "Mundo 1", health: "Salud"
  },
  fr: {
    games: "Jeux", loading: "Chargement du monde...", sandbox: "BAC À BLOCS", tagline: "Mine. Construis. Explore. Ton monde t'attend.", save: "Sauver", newWorld: "Nouveau monde", pause: "Pause", resume: "Reprendre", craft: "Fabriquer des planches", mine: "Miner", place: "Placer", fieldGuide: "GUIDE", howToPlay: "Comment jouer", moveTip: "A/D pour bouger, W ou Espace pour sauter.", breakTitle: "Casser", breakTip: "Clic gauche ou touche un bloc proche.", buildTitle: "Construire", buildTip: "Clic droit ou choisis Placer sur écran tactile.", hotbarTip: "Choisis un bloc dans la barre.", helpTitle: "Ton premier jour", help1: "Mine un arbre pour obtenir des bûches.", help2: "Transforme chaque bûche en quatre planches.", help3: "Mine terre et pierre puis construis un abri.", help4: "Trouve charbon et cristal lumineux sous terre.", autosaveHelp: "Le monde se sauvegarde après chaque changement et en quittant.", newAdventure: "NOUVELLE AVENTURE", makeWorld: "Créer un nouveau monde ?", replaceWarning: "Cela remplace le monde sauvegardé pour cet utilisateur.", worldName: "Nom du monde", cancel: "Annuler", create: "Créer", welcome: "Un nouveau monde est prêt.", enterWorld: "Entrer", saved: "Monde sauvegardé", saving: "Sauvegarde...", deviceSave: "Sauvegardé sur cet appareil", accountSave: "Sauvegardé pour ton compte", day: "Jour {day}", night: "Nuit {day}", paused: "Monde en pause", tooFar: "Ce bloc est trop loin", noBlock: "Mine d'abord des blocs", needsSupport: "Place le bloc près d'un autre", blocked: "Quelque chose bloque", crafted: "4 planches fabriquées", needLog: "Mine d'abord une bûche", mined: "+1 {block}", placed: "{block} placé", grass: "Herbe", dirt: "Terre", stone: "Pierre", log: "Bûche", leaves: "Feuilles", coal: "Charbon", crystal: "Cristal", planks: "Planches", worldDefault: "Monde 1", health: "Vie"
  },
  de: {
    games: "Spiele", loading: "Welt wird geladen...", sandbox: "BLOCK-SANDBOX", tagline: "Graben. Bauen. Erkunden. Deine Welt wartet.", save: "Speichern", newWorld: "Neue Welt", pause: "Pause", resume: "Weiter", craft: "Bretter herstellen", mine: "Abbauen", place: "Platzieren", fieldGuide: "FELDFÜHRER", howToPlay: "So geht's", moveTip: "Mit A/D bewegen, mit W oder Leertaste springen.", breakTitle: "Abbauen", breakTip: "Linksklick oder tippe einen nahen Block.", buildTitle: "Bauen", buildTip: "Rechtsklick oder auf Touch Platzieren wählen.", hotbarTip: "Wähle einen Block aus der Leiste.", helpTitle: "Dein erster Tag", help1: "Baue einen Baum ab und sammle Stämme.", help2: "Aus einem Stamm werden vier Bretter.", help3: "Baue Erde und Stein ab und errichte einen Schutz.", help4: "Finde Kohle und leuchtende Kristalle unter der Erde.", autosaveHelp: "Die Welt speichert nach Änderungen und beim Verlassen.", newAdventure: "NEUES ABENTEUER", makeWorld: "Neue Welt erstellen?", replaceWarning: "Dies ersetzt die gespeicherte Welt dieses Benutzers.", worldName: "Weltname", cancel: "Abbrechen", create: "Erstellen", welcome: "Eine neue Welt ist bereit.", enterWorld: "Welt betreten", saved: "Welt gespeichert", saving: "Speichern...", deviceSave: "Auf diesem Gerät gespeichert", accountSave: "Für dein Konto gespeichert", day: "Tag {day}", night: "Nacht {day}", paused: "Welt pausiert", tooFar: "Dieser Block ist zu weit weg", noBlock: "Baue zuerst Blöcke ab", needsSupport: "Platziere Blöcke neben einem anderen", blocked: "Dort ist etwas im Weg", crafted: "4 Bretter hergestellt", needLog: "Baue zuerst einen Stamm ab", mined: "+1 {block}", placed: "{block} platziert", grass: "Gras", dirt: "Erde", stone: "Stein", log: "Stamm", leaves: "Laub", coal: "Kohle", crystal: "Kristall", planks: "Bretter", worldDefault: "Welt 1", health: "Leben"
  },
  pt: {
    games: "Jogos", loading: "Carregando mundo...", sandbox: "MUNDO DE BLOCOS", tagline: "Minere. Construa. Explore. Seu mundo espera aqui.", save: "Salvar", newWorld: "Novo mundo", pause: "Pausar", resume: "Continuar", craft: "Criar tábuas", mine: "Minerar", place: "Colocar", fieldGuide: "GUIA DE CAMPO", howToPlay: "Como jogar", moveTip: "Use A/D para mover e W ou Espaço para pular.", breakTitle: "Quebrar", breakTip: "Clique esquerdo ou toque num bloco próximo.", buildTitle: "Construir", buildTip: "Clique direito ou escolha Colocar no toque.", hotbarTip: "Escolha um bloco na barra rápida.", helpTitle: "Seu primeiro dia", help1: "Minere uma árvore para conseguir troncos.", help2: "Transforme cada tronco em quatro tábuas.", help3: "Minere terra e pedra e construa um abrigo.", help4: "Ache carvão e cristais brilhantes no subsolo.", autosaveHelp: "O mundo salva após mudanças e ao sair.", newAdventure: "NOVA AVENTURA", makeWorld: "Criar um novo mundo?", replaceWarning: "Isso substitui o mundo salvo deste usuário neste navegador.", worldName: "Nome do mundo", cancel: "Cancelar", create: "Criar", welcome: "Um novo mundo está pronto.", enterWorld: "Entrar no mundo", saved: "Mundo salvo", saving: "Salvando...", deviceSave: "Salvo neste dispositivo", accountSave: "Salvo para sua conta", day: "Dia {day}", night: "Noite {day}", paused: "Mundo pausado", tooFar: "Esse bloco está longe demais", noBlock: "Primeiro minere blocos", needsSupport: "Coloque blocos ao lado de outro", blocked: "Há algo no caminho", crafted: "Criou 4 tábuas", needLog: "Primeiro minere um tronco", mined: "+1 {block}", placed: "Colocou {block}", grass: "Grama", dirt: "Terra", stone: "Pedra", log: "Tronco", leaves: "Folhas", coal: "Carvão", crystal: "Cristal", planks: "Tábuas", worldDefault: "Mundo 1", health: "Vida"
  },
  ru: {
    games: "Игры", loading: "Загрузка мира...", sandbox: "БЛОЧНАЯ ПЕСОЧНИЦА", tagline: "Добывай. Строй. Исследуй. Твой мир ждёт.", save: "Сохранить", newWorld: "Новый мир", pause: "Пауза", resume: "Продолжить", craft: "Создать доски", mine: "Добывать", place: "Ставить", fieldGuide: "ПУТЕВОДИТЕЛЬ", howToPlay: "Как играть", moveTip: "A/D — движение, W или Пробел — прыжок.", breakTitle: "Ломать", breakTip: "Левый клик или касание по близкому блоку.", buildTitle: "Строить", buildTip: "Правый клик или режим Ставить на экране.", hotbarTip: "Выбери блок на панели.", helpTitle: "Первый день", help1: "Добудь дерево и собери брёвна.", help2: "Из одного бревна получаются четыре доски.", help3: "Добудь землю и камень, построй укрытие.", help4: "Найди под землёй уголь и светящийся кристалл.", autosaveHelp: "Мир сохраняется после изменений и при выходе.", newAdventure: "НОВОЕ ПРИКЛЮЧЕНИЕ", makeWorld: "Создать новый мир?", replaceWarning: "Сохранённый мир этого пользователя будет заменён.", worldName: "Название мира", cancel: "Отмена", create: "Создать", welcome: "Новый мир готов.", enterWorld: "Войти в мир", saved: "Мир сохранён", saving: "Сохранение...", deviceSave: "Сохранено на устройстве", accountSave: "Сохранено для аккаунта", day: "День {day}", night: "Ночь {day}", paused: "Мир на паузе", tooFar: "Этот блок слишком далеко", noBlock: "Сначала добудь блоки", needsSupport: "Ставь блок рядом с другим", blocked: "Место занято", crafted: "Создано 4 доски", needLog: "Сначала добудь бревно", mined: "+1 {block}", placed: "Поставлен {block}", grass: "Трава", dirt: "Земля", stone: "Камень", log: "Бревно", leaves: "Листва", coal: "Уголь", crystal: "Кристалл", planks: "Доски", worldDefault: "Мир 1", health: "Здоровье"
  },
  ar: {
    games: "الألعاب", loading: "جار تحميل العالم...", sandbox: "عالم المكعبات", tagline: "احفر. ابنِ. استكشف. عالمك ينتظرك.", save: "حفظ", newWorld: "عالم جديد", pause: "إيقاف", resume: "متابعة", craft: "صنع ألواح", mine: "حفر", place: "وضع", fieldGuide: "دليل اللعب", howToPlay: "طريقة اللعب", moveTip: "تحرك بـ A/D واقفز بـ W أو المسافة.", breakTitle: "كسر", breakTip: "انقر أو المس كتلة قريبة لحفرها.", buildTitle: "بناء", buildTip: "انقر بالزر الأيمن أو اختر وضع على اللمس.", hotbarTip: "اختر كتلة من الشريط.", helpTitle: "يومك الأول", help1: "احفر شجرة لجمع الخشب.", help2: "حوّل كل جذع إلى أربعة ألواح.", help3: "احفر التراب والحجر وابنِ مأوى.", help4: "ابحث تحت الأرض عن الفحم والبلور المضيء.", autosaveHelp: "يحفظ العالم تلقائيا بعد التغييرات وعند المغادرة.", newAdventure: "مغامرة جديدة", makeWorld: "إنشاء عالم جديد؟", replaceWarning: "سيستبدل هذا عالم MC 2D المحفوظ لهذا المستخدم.", worldName: "اسم العالم", cancel: "إلغاء", create: "إنشاء", welcome: "عالم جديد جاهز.", enterWorld: "دخول العالم", saved: "تم حفظ العالم", saving: "جار الحفظ...", deviceSave: "محفوظ على هذا الجهاز", accountSave: "محفوظ لحسابك", day: "اليوم {day}", night: "الليلة {day}", paused: "العالم متوقف", tooFar: "هذه الكتلة بعيدة جدا", noBlock: "احفر كتلا أولا", needsSupport: "ضع الكتلة بجوار كتلة أخرى", blocked: "هناك شيء في الطريق", crafted: "تم صنع 4 ألواح", needLog: "احفر جذعا أولا", mined: "+1 {block}", placed: "تم وضع {block}", grass: "عشب", dirt: "تراب", stone: "حجر", log: "جذع", leaves: "أوراق", coal: "فحم", crystal: "بلور", planks: "ألواح", worldDefault: "العالم 1", health: "الصحة"
  }
};

const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
const craftingText = {
  en: { craft: "Craft & smelt", breakTip: "Hold left-click, or tap a nearby block, until it breaks.", help4: "Craft tools, mine coal and iron, then smelt iron in a furnace.", workshop: "WORKSHOP", craftSmelt: "Craft & smelt", resources: "Resources", tools: "Tools", recipes: "Recipes", equipped: "Equipped", hand: "Hand", sticks: "Sticks", ironOre: "Iron ore", ironIngot: "Iron ingot", furnace: "Furnace", woodPickaxe: "Wooden pickaxe", stonePickaxe: "Stone pickaxe", ironPickaxe: "Iron pickaxe", woodAxe: "Wooden axe", stoneAxe: "Stone axe", ironAxe: "Iron axe", recipePlanks: "4 wooden planks", recipeSticks: "4 sticks", smeltIron: "Smelt iron ingot", notEnough: "You need more resources", craftedItem: "Made {item}", owned: "Owned", needsFurnace: "Craft and carry a furnace first", needBetterPickaxe: "A stronger pickaxe is needed", mining: "Mining {block}...", backpack: "Backpack", inventory: "INVENTORY", backpackTitle: "Backpack", backpackHint: "Choose a placeable block or an owned tool to equip it. Press B to open.", blocks: "Blocks", materials: "Materials", chooseBlock: "Equip {item}" },
  zh: { craft: "合成与熔炼", breakTip: "按住左键，或点一下附近方块，直到它被挖开。", help4: "合成工具，挖煤和铁矿，再用熔炉炼出铁锭。", workshop: "工作台", craftSmelt: "合成与熔炼", resources: "资源", tools: "工具", recipes: "配方", equipped: "已装备", hand: "空手", sticks: "木棍", ironOre: "铁矿石", ironIngot: "铁锭", furnace: "熔炉", woodPickaxe: "木镐", stonePickaxe: "石镐", ironPickaxe: "铁镐", woodAxe: "木斧", stoneAxe: "石斧", ironAxe: "铁斧", recipePlanks: "4 块木板", recipeSticks: "4 根木棍", smeltIron: "熔炼铁锭", notEnough: "资源不够", craftedItem: "制作了 {item}", owned: "已有", needsFurnace: "先合成并携带一个熔炉", needBetterPickaxe: "需要更强的镐", mining: "正在挖 {block}...", backpack: "背包", inventory: "物品栏", backpackTitle: "背包", backpackHint: "选择可放置的方块或已有工具来装备。按 B 打开。", blocks: "方块", materials: "材料", chooseBlock: "装备 {item}" },
  ja: { craft: "クラフトと製錬", breakTip: "左クリックを長押し、または近くのブロックをタップして壊します。", help4: "道具を作り、石炭と鉄を掘り、かまどで鉄を製錬します。", workshop: "作業場", craftSmelt: "クラフトと製錬", resources: "素材", tools: "道具", recipes: "レシピ", equipped: "装備中", hand: "素手", sticks: "棒", ironOre: "鉄鉱石", ironIngot: "鉄インゴット", furnace: "かまど", woodPickaxe: "木のツルハシ", stonePickaxe: "石のツルハシ", ironPickaxe: "鉄のツルハシ", woodAxe: "木の斧", stoneAxe: "石の斧", ironAxe: "鉄の斧", recipePlanks: "木材4個", recipeSticks: "棒4本", smeltIron: "鉄を製錬", notEnough: "素材が足りません", craftedItem: "{item}を作りました", owned: "所持", needsFurnace: "先にかまどを作って持ってください", needBetterPickaxe: "もっと強いツルハシが必要です", mining: "{block}を採掘中...", backpack: "バックパック", inventory: "インベントリ", backpackTitle: "バックパック", backpackHint: "置けるブロックまたは所持中の道具を選んで装備します。Bで開きます。", blocks: "ブロック", materials: "素材", chooseBlock: "{item}を装備" },
  ko: { craft: "제작과 제련", breakTip: "왼쪽 클릭을 누르거나 가까운 블록을 탭해 부수세요.", help4: "도구를 만들고 석탄과 철을 캐서 화로에서 제련하세요.", workshop: "작업장", craftSmelt: "제작과 제련", resources: "자원", tools: "도구", recipes: "조합법", equipped: "장착", hand: "맨손", sticks: "막대기", ironOre: "철광석", ironIngot: "철괴", furnace: "화로", woodPickaxe: "나무 곡괭이", stonePickaxe: "돌 곡괭이", ironPickaxe: "철 곡괭이", woodAxe: "나무 도끼", stoneAxe: "돌 도끼", ironAxe: "철 도끼", recipePlanks: "나무 판자 4개", recipeSticks: "막대기 4개", smeltIron: "철괴 제련", notEnough: "자원이 부족합니다", craftedItem: "{item} 제작 완료", owned: "보유", needsFurnace: "먼저 화로를 만들어 가지고 있어야 합니다", needBetterPickaxe: "더 강한 곡괭이가 필요합니다", mining: "{block} 캐는 중...", backpack: "배낭", inventory: "보관함", backpackTitle: "배낭", backpackHint: "놓을 수 있는 블록이나 보유 도구를 선택해 장착하세요. B로 엽니다.", blocks: "블록", materials: "재료", chooseBlock: "{item} 장착" },
  es: { craft: "Crear y fundir", breakTip: "Mantén el clic izquierdo o toca un bloque hasta romperlo.", help4: "Crea herramientas, extrae carbón y hierro y funde hierro en un horno.", workshop: "TALLER", craftSmelt: "Crear y fundir", resources: "Recursos", tools: "Herramientas", recipes: "Recetas", equipped: "Equipado", hand: "Mano", sticks: "Palos", ironOre: "Mineral de hierro", ironIngot: "Lingote de hierro", furnace: "Horno", woodPickaxe: "Pico de madera", stonePickaxe: "Pico de piedra", ironPickaxe: "Pico de hierro", woodAxe: "Hacha de madera", stoneAxe: "Hacha de piedra", ironAxe: "Hacha de hierro", recipePlanks: "4 tablones", recipeSticks: "4 palos", smeltIron: "Fundir lingote", notEnough: "Faltan recursos", craftedItem: "Creaste {item}", owned: "Tienes", needsFurnace: "Primero crea y lleva un horno", needBetterPickaxe: "Necesitas un pico más fuerte", mining: "Minando {block}...", backpack: "Mochila", inventory: "INVENTARIO", backpackTitle: "Mochila", backpackHint: "Elige un bloque colocable o una herramienta propia. Pulsa B para abrir.", blocks: "Bloques", materials: "Materiales", chooseBlock: "Equipar {item}" },
  fr: { craft: "Fabriquer et fondre", breakTip: "Maintiens le clic gauche ou touche un bloc jusqu'à le casser.", help4: "Fabrique des outils, mine charbon et fer, puis fonds le fer au four.", workshop: "ATELIER", craftSmelt: "Fabriquer et fondre", resources: "Ressources", tools: "Outils", recipes: "Recettes", equipped: "Équipé", hand: "Main", sticks: "Bâtons", ironOre: "Minerai de fer", ironIngot: "Lingot de fer", furnace: "Four", woodPickaxe: "Pioche en bois", stonePickaxe: "Pioche en pierre", ironPickaxe: "Pioche en fer", woodAxe: "Hache en bois", stoneAxe: "Hache en pierre", ironAxe: "Hache en fer", recipePlanks: "4 planches", recipeSticks: "4 bâtons", smeltIron: "Fondre un lingot", notEnough: "Il manque des ressources", craftedItem: "{item} fabriqué", owned: "Possédé", needsFurnace: "Fabrique et garde d'abord un four", needBetterPickaxe: "Il faut une pioche plus solide", mining: "Minage de {block}...", backpack: "Sac", inventory: "INVENTAIRE", backpackTitle: "Sac à dos", backpackHint: "Choisis un bloc plaçable ou un outil possédé. Appuie sur B pour ouvrir.", blocks: "Blocs", materials: "Matériaux", chooseBlock: "Équiper {item}" },
  de: { craft: "Bauen und schmelzen", breakTip: "Halte die linke Maustaste oder tippe einen Block, bis er bricht.", help4: "Baue Werkzeuge, fördere Kohle und Eisen und schmelze Eisen im Ofen.", workshop: "WERKSTATT", craftSmelt: "Bauen und schmelzen", resources: "Rohstoffe", tools: "Werkzeuge", recipes: "Rezepte", equipped: "Ausgerüstet", hand: "Hand", sticks: "Stöcke", ironOre: "Eisenerz", ironIngot: "Eisenbarren", furnace: "Ofen", woodPickaxe: "Holzspitzhacke", stonePickaxe: "Steinspitzhacke", ironPickaxe: "Eisenspitzhacke", woodAxe: "Holzaxt", stoneAxe: "Steinaxt", ironAxe: "Eisenaxt", recipePlanks: "4 Bretter", recipeSticks: "4 Stöcke", smeltIron: "Eisenbarren schmelzen", notEnough: "Nicht genug Rohstoffe", craftedItem: "{item} hergestellt", owned: "Besitz", needsFurnace: "Baue und trage zuerst einen Ofen", needBetterPickaxe: "Eine stärkere Spitzhacke ist nötig", mining: "{block} wird abgebaut...", backpack: "Rucksack", inventory: "INVENTAR", backpackTitle: "Rucksack", backpackHint: "Wähle einen platzierbaren Block oder ein eigenes Werkzeug. Öffne mit B.", blocks: "Blöcke", materials: "Materialien", chooseBlock: "{item} ausrüsten" },
  pt: { craft: "Criar e fundir", breakTip: "Segure o clique esquerdo ou toque num bloco até quebrar.", help4: "Crie ferramentas, minere carvão e ferro e funda ferro numa fornalha.", workshop: "OFICINA", craftSmelt: "Criar e fundir", resources: "Recursos", tools: "Ferramentas", recipes: "Receitas", equipped: "Equipado", hand: "Mão", sticks: "Gravetos", ironOre: "Minério de ferro", ironIngot: "Barra de ferro", furnace: "Fornalha", woodPickaxe: "Picareta de madeira", stonePickaxe: "Picareta de pedra", ironPickaxe: "Picareta de ferro", woodAxe: "Machado de madeira", stoneAxe: "Machado de pedra", ironAxe: "Machado de ferro", recipePlanks: "4 tábuas", recipeSticks: "4 gravetos", smeltIron: "Fundir barra de ferro", notEnough: "Faltam recursos", craftedItem: "Criou {item}", owned: "Possui", needsFurnace: "Primeiro crie e carregue uma fornalha", needBetterPickaxe: "É preciso uma picareta mais forte", mining: "Minerando {block}...", backpack: "Mochila", inventory: "INVENTÁRIO", backpackTitle: "Mochila", backpackHint: "Escolha um bloco colocável ou ferramenta que possui. Pressione B para abrir.", blocks: "Blocos", materials: "Materiais", chooseBlock: "Equipar {item}" },
  ru: { craft: "Создать и плавить", breakTip: "Удерживай левую кнопку или коснись блока, пока он не сломается.", help4: "Создай инструменты, добудь уголь и железо и переплавь железо в печи.", workshop: "МАСТЕРСКАЯ", craftSmelt: "Создать и плавить", resources: "Ресурсы", tools: "Инструменты", recipes: "Рецепты", equipped: "Выбрано", hand: "Рука", sticks: "Палки", ironOre: "Железная руда", ironIngot: "Железный слиток", furnace: "Печь", woodPickaxe: "Деревянная кирка", stonePickaxe: "Каменная кирка", ironPickaxe: "Железная кирка", woodAxe: "Деревянный топор", stoneAxe: "Каменный топор", ironAxe: "Железный топор", recipePlanks: "4 доски", recipeSticks: "4 палки", smeltIron: "Выплавить слиток", notEnough: "Не хватает ресурсов", craftedItem: "Создано: {item}", owned: "Есть", needsFurnace: "Сначала создай и носи печь", needBetterPickaxe: "Нужна более крепкая кирка", mining: "Добывается {block}...", backpack: "Рюкзак", inventory: "ИНВЕНТАРЬ", backpackTitle: "Рюкзак", backpackHint: "Выбери доступный блок или свой инструмент. Открыть: B.", blocks: "Блоки", materials: "Материалы", chooseBlock: "Выбрать {item}" },
  ar: { craft: "صناعة وصهر", breakTip: "اضغط مطولا أو المس كتلة قريبة حتى تنكسر.", help4: "اصنع الأدوات واحفر الفحم والحديد ثم اصهر الحديد في الفرن.", workshop: "ورشة", craftSmelt: "صناعة وصهر", resources: "الموارد", tools: "الأدوات", recipes: "الوصفات", equipped: "المجهز", hand: "اليد", sticks: "عيدان", ironOre: "خام الحديد", ironIngot: "سبيكة حديد", furnace: "فرن", woodPickaxe: "معول خشبي", stonePickaxe: "معول حجري", ironPickaxe: "معول حديدي", woodAxe: "فأس خشبي", stoneAxe: "فأس حجري", ironAxe: "فأس حديدي", recipePlanks: "4 ألواح", recipeSticks: "4 عيدان", smeltIron: "صهر سبيكة حديد", notEnough: "تحتاج إلى موارد أكثر", craftedItem: "تم صنع {item}", owned: "مملوك", needsFurnace: "اصنع واحمل فرنا أولا", needBetterPickaxe: "تحتاج إلى معول أقوى", mining: "جار حفر {block}...", backpack: "حقيبة", inventory: "المخزون", backpackTitle: "حقيبة الظهر", backpackHint: "اختر كتلة قابلة للوضع أو أداة تملكها. اضغط B للفتح.", blocks: "الكتل", materials: "المواد", chooseBlock: "تجهيز {item}" }
};
languages.forEach((code) => Object.assign(text[code], craftingText[code]));
let lang = languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
let playerKey = "";
let world = [];
let inventory = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, sticks: 0, ironIngot: 0 };
let tools = { woodPickaxe: false, stonePickaxe: false, ironPickaxe: false, woodAxe: false, stoneAxe: false, ironAxe: false };
let equippedTool = "hand";
let selectedSlot = 0;
let worldName = "";
let elapsed = 0;
let day = 1;
let dirty = false;
let running = false;
let paused = true;
let touchMode = "mine";
let toastTimer = 0;
let saveTimer = 0;
let lastFrame = performance.now();
let camera = { x: 0, y: 0 };
let pointerTile = null;
let mining = null;
let keys = new Set();
let craftResume = false;
let backpackResume = false;
let player = { x: 12, y: 10, vx: 0, vy: 0, width: 0.72, height: 1.78, grounded: false, health: 5, facing: 1, spawnX: 12, spawnY: 10 };

function t(key, data = {}) {
  const source = text[lang]?.[key] || text.en[key] || key;
  return Object.entries(data).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), source);
}

function applyLanguage() {
  lang = languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelector("#help-button").title = t("howToPlay");
  document.querySelector("#help-button").setAttribute("aria-label", t("howToPlay"));
  document.querySelector("#pause-button").textContent = paused ? t("resume") : t("pause");
  if (world.length && playerKey) saveState.textContent = playerKey.startsWith("user:") ? t("accountSave") : t("deviceSave");
  renderHotbar();
  renderCrafting();
  renderBackpack();
  updateHud();
}

function deviceKey() {
  let id = localStorage.getItem("muye-games-device-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("muye-games-device-id", id);
  }
  return `device:${id}`;
}

async function findPlayerKey() {
  playerKey = deviceKey();
  try {
    for (let i = 0; i < 8 && !window.Clerk; i += 1) await new Promise((resolve) => setTimeout(resolve, 100));
    if (!window.Clerk) return;
    await Promise.race([
      window.Clerk.load(),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);
    if (window.Clerk.user?.id) playerKey = `user:${window.Clerk.user.id}`;
  } catch {}
}

function saveKey() { return `muye-game:${playerKey}:mc-2d`; }

function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let out = value;
    out = Math.imul(out ^ (out >>> 15), out | 1);
    out ^= out + Math.imul(out ^ (out >>> 7), out | 61);
    return ((out ^ (out >>> 14)) >>> 0) / 4294967296;
  };
}

function tileIndex(x, y) { return y * WORLD_WIDTH + x; }
function inWorld(x, y) { return x >= 0 && x < WORLD_WIDTH && y >= 0 && y < WORLD_HEIGHT; }
function getTile(x, y) { return inWorld(x, y) ? world[tileIndex(x, y)] || 0 : 3; }
function setTile(x, y, value) { if (inWorld(x, y)) world[tileIndex(x, y)] = value; }
function isSolid(x, y) { return Boolean(blockData[getTile(x, y)]?.solid); }

function generateWorld(seed = Math.floor(Math.random() * 2147483647), name = t("worldDefault")) {
  const random = randomGenerator(seed);
  world = Array(WORLD_WIDTH * WORLD_HEIGHT).fill(0);
  const heights = [];
  let height = 24;
  for (let x = 0; x < WORLD_WIDTH; x += 1) {
    height += random() < 0.25 ? (random() < 0.5 ? -1 : 1) : 0;
    height = Math.max(17, Math.min(29, height));
    const surface = Math.round(height + Math.sin(x / 9) * 2);
    heights.push(surface);
    for (let y = surface; y < WORLD_HEIGHT; y += 1) {
      let type = y === surface ? 1 : y < surface + 4 ? 2 : 3;
      if (type === 3 && y > surface + 4 && random() < 0.075) type = 6;
      if (type === 3 && y > surface + 7 && random() < 0.04) type = 9;
      if (type === 3 && y > surface + 12 && random() < 0.018) type = 7;
      setTile(x, y, type);
    }
  }
  for (let x = 5; x < WORLD_WIDTH - 5; x += 1) {
    if (random() > 0.085 || (x > 9 && x < 17)) continue;
    const ground = heights[x];
    const trunk = 3 + Math.floor(random() * 3);
    for (let y = ground - 1; y >= ground - trunk; y -= 1) setTile(x, y, 4);
    const top = ground - trunk;
    for (let dx = -2; dx <= 2; dx += 1) {
      for (let dy = -2; dy <= 1; dy += 1) {
        if (Math.abs(dx) + Math.abs(dy) < 4 && getTile(x + dx, top + dy) === 0) setTile(x + dx, top + dy, 5);
      }
    }
  }
  const spawnX = 12;
  const spawnY = heights[spawnX] - 2;
  player = { x: spawnX + 0.15, y: spawnY, vx: 0, vy: 0, width: 0.72, height: 1.78, grounded: false, health: 5, facing: 1, spawnX: spawnX + 0.15, spawnY };
  inventory = { 2: 8, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, sticks: 0, ironIngot: 0 };
  tools = { woodPickaxe: false, stonePickaxe: false, ironPickaxe: false, woodAxe: false, stoneAxe: false, ironAxe: false };
  equippedTool = "hand";
  selectedSlot = 0;
  worldName = name || t("worldDefault");
  elapsed = 22;
  day = 1;
  dirty = true;
  updateHud();
  renderHotbar();
  renderCrafting();
}

function encodeWorld(values) {
  const encoded = [];
  let previous = values[0];
  let count = 1;
  for (let i = 1; i <= values.length; i += 1) {
    if (values[i] === previous && count < 65535) count += 1;
    else { encoded.push(`${previous.toString(16)}.${count.toString(36)}`); previous = values[i]; count = 1; }
  }
  return encoded.join(",");
}

function decodeWorld(encoded) {
  const values = [];
  for (const run of String(encoded || "").split(",")) {
    const [value, count] = run.split(".");
    const block = parseInt(value, 16);
    const amount = parseInt(count, 36);
    if (!Number.isFinite(block) || !Number.isFinite(amount) || amount > WORLD_WIDTH * WORLD_HEIGHT) return null;
    for (let i = 0; i < amount; i += 1) values.push(block);
  }
  return values.length === WORLD_WIDTH * WORLD_HEIGHT ? values : null;
}

function loadWorld() {
  try {
    const saved = JSON.parse(localStorage.getItem(saveKey()) || "null");
    const decoded = decodeWorld(saved?.world);
    if (!saved || !decoded) return false;
    world = decoded;
    inventory = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, sticks: 0, ironIngot: 0, ...saved.inventory };
    tools = { woodPickaxe: false, stonePickaxe: false, ironPickaxe: false, woodAxe: false, stoneAxe: false, ironAxe: false, ...saved.tools };
    equippedTool = tools[saved.equippedTool] ? saved.equippedTool : "hand";
    if ((saved.version || 1) < 2) {
      let added = 0;
      for (let i = WORLD_WIDTH * 30; i < world.length && added < 110; i += 1) {
        if (world[i] === 3 && ((i * 31 + 17) % 97) < 3) { world[i] = 9; added += 1; }
      }
      dirty = true;
    }
    selectedSlot = Math.max(0, Math.min(HOTBAR_BLOCKS.length - 1, saved.selectedSlot || 0));
    worldName = saved.worldName || t("worldDefault");
    elapsed = Number(saved.elapsed) || 0;
    day = Number(saved.day) || 1;
    player = { ...player, ...saved.player, vx: 0, vy: 0 };
    return true;
  } catch { return false; }
}

function saveWorld(manual = false) {
  if (!world.length || !playerKey) return;
  if (manual) saveState.textContent = t("saving");
  const payload = {
    version: SAVE_VERSION,
    world: encodeWorld(world),
    inventory,
    tools,
    equippedTool,
    selectedSlot,
    worldName,
    elapsed,
    day,
    player: { x: player.x, y: player.y, health: player.health, facing: player.facing, spawnX: player.spawnX, spawnY: player.spawnY },
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(saveKey(), JSON.stringify(payload));
    dirty = false;
    saveState.textContent = playerKey.startsWith("user:") ? t("accountSave") : t("deviceSave");
    if (manual) showToast(t("saved"));
  } catch {
    saveState.textContent = t("saved");
  }
}

function blockName(id) { return t(blockData[id]?.name || "stone"); }

function itemName(id) {
  const numericId = Number(id);
  return Number.isFinite(numericId) && blockData[numericId] ? blockName(numericId) : t(id);
}

function drawBlock(target, id, x, y, size) {
  const unit = size / 8;
  target.save();
  target.translate(Math.round(x), Math.round(y));
  if (id === 1) {
    target.fillStyle = "#765136"; target.fillRect(0, 0, size, size);
    target.fillStyle = "#5da542"; target.fillRect(0, 0, size, unit * 2.3);
    target.fillStyle = "#80c35c"; target.fillRect(0, 0, size, unit * 0.7);
    target.fillStyle = "#5f432f"; for (let i = 0; i < 5; i += 1) target.fillRect(((i * 13 + 5) % 27) / 32 * size, (12 + (i * 9) % 17) / 32 * size, unit, unit);
  } else if (id === 2) {
    target.fillStyle = "#795239"; target.fillRect(0, 0, size, size);
    target.fillStyle = "#573b2c"; for (let i = 0; i < 7; i += 1) target.fillRect(((i * 17 + 3) % 29) / 32 * size, ((i * 11 + 8) % 29) / 32 * size, unit, unit);
  } else if (id === 3 || id === 6 || id === 7 || id === 9) {
    target.fillStyle = "#686d6d"; target.fillRect(0, 0, size, size);
    target.fillStyle = "#515555"; for (let i = 0; i < 6; i += 1) target.fillRect(((i * 13 + 4) % 27) / 32 * size, ((i * 19 + 6) % 27) / 32 * size, unit * 1.2, unit);
    if (id === 6) { target.fillStyle = "#202526"; [[2,2],[5,4],[3,6],[6,1]].forEach(([px,py]) => target.fillRect(px*unit, py*unit, unit*1.5, unit*1.5)); }
    if (id === 7) { target.fillStyle = "#43daca"; [[2,1],[5,3],[3,6],[6,6]].forEach(([px,py]) => { target.fillRect(px*unit, py*unit, unit, unit*2); target.fillStyle = "#a2fff3"; target.fillRect(px*unit, py*unit, unit/2, unit); target.fillStyle = "#43daca"; }); }
    if (id === 9) { target.fillStyle = "#c68b68"; [[1,2],[5,1],[3,5],[6,6]].forEach(([px,py]) => { target.fillRect(px*unit, py*unit, unit*1.5, unit*1.5); target.fillStyle = "#e0ae89"; target.fillRect(px*unit, py*unit, unit/2, unit/2); target.fillStyle = "#c68b68"; }); }
  } else if (id === 4) {
    target.fillStyle = "#6e4624"; target.fillRect(0, 0, size, size);
    target.fillStyle = "#a16a34"; target.fillRect(unit, 0, unit * 2, size); target.fillRect(unit * 5, 0, unit, size);
    target.fillStyle = "#4e311c"; target.fillRect(0, 0, size, unit); target.fillRect(0, size - unit, size, unit);
  } else if (id === 5) {
    target.fillStyle = "#34763b"; target.fillRect(0, 0, size, size);
    target.fillStyle = "#4f9950"; target.fillRect(unit, unit, unit*2, unit*2); target.fillRect(unit*5, unit*4, unit*2, unit*2);
    target.fillStyle = "#205b31"; target.fillRect(unit*4, unit, unit, unit); target.fillRect(unit*2, unit*5, unit*2, unit*2);
  } else if (id === 8) {
    target.fillStyle = "#aa7137"; target.fillRect(0, 0, size, size);
    target.fillStyle = "#d19a55"; for (let row = 0; row < 4; row += 1) target.fillRect(0, row*unit*2, size, unit/2);
    target.fillStyle = "#754822"; target.fillRect(size/2, 0, unit/2, unit*2); target.fillRect(size/4, unit*4, unit/2, unit*2);
  } else if (id === 10) {
    target.fillStyle = "#555b5b"; target.fillRect(0, 0, size, size);
    target.fillStyle = "#777d7d"; target.fillRect(unit, unit, unit*6, unit*2);
    target.fillStyle = "#191b1b"; target.fillRect(unit*1.5, unit*4, unit*5, unit*3);
    target.fillStyle = "#d57934"; target.fillRect(unit*2.5, unit*5.5, unit*3, unit*1.5);
  }
  target.strokeStyle = "rgba(0,0,0,.17)";
  target.strokeRect(0.5, 0.5, size - 1, size - 1);
  target.restore();
}

function renderHotbar() {
  if (!hotbar) return;
  hotbar.innerHTML = "";
  HOTBAR_BLOCKS.forEach((id, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `hotbar-slot${index === selectedSlot ? " selected" : ""}`;
    button.title = blockName(id);
    button.setAttribute("aria-label", `${blockName(id)}: ${inventory[id] || 0}`);
    if (!(inventory[id] > 0)) button.disabled = true;
    const icon = document.createElement("canvas");
    icon.width = 32; icon.height = 32;
    drawBlock(icon.getContext("2d"), id, 0, 0, 32);
    button.innerHTML = `<kbd>${index + 1}</kbd>`;
    button.appendChild(icon);
    const count = document.createElement("small");
    count.textContent = String(inventory[id] || 0);
    button.appendChild(count);
    button.addEventListener("click", () => { selectedSlot = index; dirty = true; renderHotbar(); });
    hotbar.appendChild(button);
  });
}

function selectBackpackBlock(id) {
  const slot = HOTBAR_BLOCKS.indexOf(id);
  if (slot < 0 || !(inventory[id] > 0)) return;
  selectedSlot = slot;
  dirty = true;
  renderHotbar();
  renderBackpack();
}

function renderBackpack() {
  if (!backpackBlocks || !backpackMaterials || !backpackTools) return;
  const blockIds = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const selectedBlock = HOTBAR_BLOCKS[selectedSlot];
  backpackBlocks.innerHTML = "";
  blockIds.forEach((id) => {
    const amount = inventory[id] || 0;
    const placeable = HOTBAR_BLOCKS.includes(id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `backpack-slot${id === selectedBlock ? " selected" : ""}`;
    button.disabled = !placeable || amount < 1;
    button.title = placeable ? t("chooseBlock", { item: blockName(id) }) : blockName(id);
    button.setAttribute("aria-label", `${blockName(id)}: ${amount}`);
    const icon = document.createElement("canvas");
    icon.width = 40;
    icon.height = 40;
    drawBlock(icon.getContext("2d"), id, 0, 0, 40);
    const name = document.createElement("strong");
    name.textContent = blockName(id);
    const count = document.createElement("small");
    count.textContent = `×${amount}`;
    button.append(icon, name, count);
    if (placeable) button.addEventListener("click", () => selectBackpackBlock(id));
    backpackBlocks.appendChild(button);
  });

  backpackMaterials.innerHTML = ["sticks", "ironIngot"].map((id) => `<span class="resource-chip">${itemName(id)} <strong>${inventory[id] || 0}</strong></span>`).join("");
  backpackTools.innerHTML = Object.entries(toolData).map(([id, tool]) => {
    const owned = id === "hand" || tools[id];
    return `<button class="tool-button${equippedTool === id ? " selected" : ""}" type="button" data-backpack-tool="${id}" ${owned ? "" : "disabled"}>${tool.icon} ${t(tool.name)}${id !== "hand" && owned ? `<small> · ${t("owned")}</small>` : ""}</button>`;
  }).join("");
  backpackTools.querySelectorAll("[data-backpack-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      equippedTool = button.dataset.backpackTool;
      mining = null;
      dirty = true;
      renderCrafting();
      renderBackpack();
    });
  });
}

function hasFurnace() {
  if (inventory[10] > 0) return true;
  const centerX = Math.floor(player.x + player.width / 2);
  const centerY = Math.floor(player.y + player.height / 2);
  for (let y = centerY - 5; y <= centerY + 5; y += 1) {
    for (let x = centerX - 5; x <= centerX + 5; x += 1) if (getTile(x, y) === 10) return true;
  }
  return false;
}

function canCraft(recipe) {
  if (recipe.tool && tools[recipe.tool]) return false;
  if (recipe.furnace && !hasFurnace()) return false;
  return Object.entries(recipe.cost).every(([id, amount]) => (inventory[id] || 0) >= amount);
}

function renderCrafting() {
  if (!resourceList || !toolList || !recipeList) return;
  const resources = [4, 8, "sticks", 3, 6, 9, "ironIngot", 7, 10];
  resourceList.innerHTML = resources.map((id) => `<span class="resource-chip">${itemName(id)} <strong>${inventory[id] || 0}</strong></span>`).join("");
  toolList.innerHTML = Object.entries(toolData).map(([id, tool]) => {
    const owned = id === "hand" || tools[id];
    return `<button class="tool-button${equippedTool === id ? " selected" : ""}" type="button" data-tool="${id}" ${owned ? "" : "disabled"}>${tool.icon} ${t(tool.name)}${id !== "hand" && owned ? `<small> · ${t("owned")}</small>` : ""}</button>`;
  }).join("");
  toolList.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      equippedTool = button.dataset.tool;
      mining = null;
      dirty = true;
      renderCrafting();
    });
  });
  recipeList.innerHTML = recipes.map((recipe) => {
    const cost = Object.entries(recipe.cost).map(([id, amount]) => `${amount} ${itemName(id)}`).join(" + ");
    const unavailable = !canCraft(recipe);
    const reason = recipe.tool && tools[recipe.tool] ? t("owned") : recipe.furnace && !hasFurnace() ? t("needsFurnace") : cost;
    return `<button class="recipe-button" type="button" data-recipe="${recipe.id}" ${unavailable ? "disabled" : ""}><span class="recipe-icon">${recipe.icon}</span><span class="recipe-copy"><strong>${t(recipe.name)}</strong><small>${reason}</small></span></button>`;
  }).join("");
  recipeList.querySelectorAll("[data-recipe]").forEach((button) => button.addEventListener("click", () => craftRecipe(button.dataset.recipe)));
  const equipped = toolData[equippedTool] || toolData.hand;
  equippedToolEl.textContent = `${equipped.icon} ${t("equipped")}: ${t(equipped.name)}`;
}

function craftRecipe(recipeId) {
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe || !canCraft(recipe)) return showToast(recipe?.furnace && !hasFurnace() ? t("needsFurnace") : t("notEnough"));
  Object.entries(recipe.cost).forEach(([id, amount]) => { inventory[id] -= amount; });
  if (recipe.output) Object.entries(recipe.output).forEach(([id, amount]) => { inventory[id] = (inventory[id] || 0) + amount; });
  if (recipe.tool) {
    tools[recipe.tool] = true;
    equippedTool = recipe.tool;
  }
  dirty = true;
  renderHotbar();
  renderCrafting();
  showToast(t("craftedItem", { item: t(recipe.name) }));
}

function updateHud() {
  worldNameEl.textContent = worldName || t("worldDefault");
  positionEl.textContent = `${Math.floor(player.x)}, ${Math.floor(player.y)}`;
  heartsEl.textContent = `${"♥ ".repeat(player.health).trim()}${player.health < 5 ? ` ${"♡ ".repeat(5 - player.health).trim()}` : ""}`;
  heartsEl.setAttribute("aria-label", `${t("health")}: ${player.health}/5`);
  const phase = (elapsed % 180) / 180;
  const night = phase > 0.56 || phase < 0.08;
  clockIcon.textContent = night ? "☾" : "☀";
  clockLabel.textContent = t(night ? "night" : "day", { day });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 1600);
}

function playerOverlapsTile(x, y) {
  return player.x < x + 1 && player.x + player.width > x && player.y < y + 1 && player.y + player.height > y;
}

function tileInReach(x, y) {
  const dx = x + 0.5 - (player.x + player.width / 2);
  const dy = y + 0.5 - (player.y + player.height / 2);
  return Math.hypot(dx, dy) <= REACH;
}

function miningTime(id) {
  const block = blockData[id];
  const tool = toolData[equippedTool] || toolData.hand;
  const speed = block.tool === tool.kind ? tool.speed : 0.68;
  return block.hardness / speed;
}

function startMining(x, y, pointerType = "mouse") {
  const id = getTile(x, y);
  if (!id) { mining = null; return; }
  if (!tileInReach(x, y)) return showToast(t("tooFar"));
  const block = blockData[id];
  const tool = toolData[equippedTool] || toolData.hand;
  if (block.tier && (tool.kind !== "pickaxe" || tool.tier < block.tier)) {
    mining = null;
    return showToast(t("needBetterPickaxe"));
  }
  mining = { x, y, id, progress: 0, duration: miningTime(id), pointerType };
  showToast(t("mining", { block: blockName(id) }));
}

function finishMining() {
  if (!mining || getTile(mining.x, mining.y) !== mining.id) { mining = null; return; }
  const { x, y, id } = mining;
  setTile(x, y, 0);
  const drop = id === 1 ? 2 : id;
  inventory[drop] = (inventory[drop] || 0) + 1;
  mining = null;
  dirty = true;
  renderHotbar();
  renderCrafting();
  showToast(t("mined", { block: blockName(drop) }));
}

function placeTile(x, y) {
  const id = HOTBAR_BLOCKS[selectedSlot];
  if (!inventory[id]) return showToast(t("noBlock"));
  if (!tileInReach(x, y)) return showToast(t("tooFar"));
  if (getTile(x, y) || playerOverlapsTile(x, y)) return showToast(t("blocked"));
  const supported = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => getTile(x + dx, y + dy));
  if (!supported) return showToast(t("needsSupport"));
  setTile(x, y, id);
  inventory[id] -= 1;
  dirty = true;
  renderHotbar();
  showToast(t("placed", { block: blockName(id) }));
}

function pointerToTile(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: Math.floor((event.clientX - rect.left) * scaleX / TILE + camera.x),
    y: Math.floor((event.clientY - rect.top) * scaleY / TILE + camera.y),
  };
}

function collides(x, y, width = player.width, height = player.height) {
  const left = Math.floor(x + 0.001);
  const right = Math.floor(x + width - 0.001);
  const top = Math.floor(y + 0.001);
  const bottom = Math.floor(y + height - 0.001);
  for (let ty = top; ty <= bottom; ty += 1) for (let tx = left; tx <= right; tx += 1) if (isSolid(tx, ty)) return true;
  return false;
}

function movePlayer(dx, dy) {
  if (dx) {
    const steps = Math.max(1, Math.ceil(Math.abs(dx) / 0.08));
    const step = dx / steps;
    for (let i = 0; i < steps; i += 1) {
      if (!collides(player.x + step, player.y)) player.x += step;
      else { player.vx = 0; break; }
    }
  }
  player.grounded = false;
  if (dy) {
    const steps = Math.max(1, Math.ceil(Math.abs(dy) / 0.08));
    const step = dy / steps;
    for (let i = 0; i < steps; i += 1) {
      if (!collides(player.x, player.y + step)) player.y += step;
      else {
        if (step > 0) player.grounded = true;
        player.vy = 0;
        break;
      }
    }
  }
}

function respawn() {
  player.x = player.spawnX;
  player.y = player.spawnY;
  player.vx = 0;
  player.vy = 0;
  player.health = Math.max(1, player.health - 1);
  dirty = true;
}

function update(dt) {
  if (!running || paused) return;
  elapsed += dt;
  if (elapsed >= 180) { elapsed -= 180; day += 1; dirty = true; }
  const left = keys.has("ArrowLeft") || keys.has("KeyA") || keys.has("touch-left");
  const right = keys.has("ArrowRight") || keys.has("KeyD") || keys.has("touch-right");
  const jump = keys.has("ArrowUp") || keys.has("KeyW") || keys.has("Space") || keys.has("touch-jump");
  const targetVelocity = (right ? 1 : 0) - (left ? 1 : 0);
  player.vx += (targetVelocity * 6.4 - player.vx) * Math.min(1, dt * (player.grounded ? 13 : 5));
  if (targetVelocity) player.facing = Math.sign(targetVelocity);
  if (jump && player.grounded) { player.vy = -9.3; player.grounded = false; keys.delete("touch-jump"); }
  player.vy = Math.min(14, player.vy + 24 * dt);
  movePlayer(player.vx * dt, player.vy * dt);
  if (player.y > WORLD_HEIGHT + 4) respawn();
  if (mining) {
    if (!tileInReach(mining.x, mining.y) || getTile(mining.x, mining.y) !== mining.id) mining = null;
    else {
      mining.progress += dt;
      if (mining.progress >= mining.duration) finishMining();
    }
  }
  dirty = dirty || Math.abs(player.vx) > 0.01 || Math.abs(player.vy) > 0.01;
  updateHud();
}

function mixColor(a, b, amount) {
  const parse = (hex) => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  const one = parse(a); const two = parse(b);
  return `rgb(${one.map((value, i) => Math.round(value + (two[i] - value) * amount)).join(",")})`;
}

function drawPlayer(screenX, screenY) {
  const width = player.width * TILE;
  const height = player.height * TILE;
  ctx.save();
  ctx.translate(Math.round(screenX + (player.facing < 0 ? width : 0)), Math.round(screenY));
  ctx.scale(player.facing, 1);
  ctx.fillStyle = "#c98b62"; ctx.fillRect(width * 0.16, 0, width * 0.68, height * 0.31);
  ctx.fillStyle = "#3f2a1c"; ctx.fillRect(width * 0.12, 0, width * 0.76, height * 0.1);
  ctx.fillStyle = "#ece6d2"; ctx.fillRect(width * 0.62, height * 0.12, width * 0.09, height * 0.06);
  ctx.fillStyle = "#248b91"; ctx.fillRect(width * 0.08, height * 0.31, width * 0.84, height * 0.38);
  ctx.fillStyle = "#2e405e"; ctx.fillRect(width * 0.08, height * 0.69, width * 0.36, height * 0.31); ctx.fillRect(width * 0.56, height * 0.69, width * 0.36, height * 0.31);
  ctx.fillStyle = "#1b2022"; ctx.fillRect(width * 0.05, height * 0.92, width * 0.4, height * 0.08); ctx.fillRect(width * 0.55, height * 0.92, width * 0.42, height * 0.08);
  const held = toolData[equippedTool] || toolData.hand;
  if (held.kind !== "hand") {
    ctx.save();
    ctx.translate(width * 0.82, height * 0.48);
    ctx.rotate(-0.5);
    ctx.fillStyle = "#8d5a2e"; ctx.fillRect(0, 0, 3, height * 0.38);
    ctx.fillStyle = held.tier === 1 ? "#b27a3d" : held.tier === 2 ? "#969c9d" : "#d4d9dc";
    if (held.kind === "pickaxe") ctx.fillRect(-8, -2, 19, 5);
    else { ctx.fillRect(-5, -4, 11, 10); ctx.fillStyle = "#5d6466"; ctx.fillRect(4, -2, 5, 6); }
    ctx.restore();
  }
  ctx.restore();
}

function drawWorld() {
  const viewWidth = canvas.width / TILE;
  const viewHeight = canvas.height / TILE;
  const targetX = player.x + player.width / 2 - viewWidth / 2;
  const targetY = player.y + player.height / 2 - viewHeight * 0.52;
  camera.x += (Math.max(0, Math.min(WORLD_WIDTH - viewWidth, targetX)) - camera.x) * 0.09;
  camera.y += (Math.max(0, Math.min(WORLD_HEIGHT - viewHeight, targetY)) - camera.y) * 0.09;
  const phase = (elapsed % 180) / 180;
  const light = Math.max(0, Math.sin(phase * Math.PI));
  ctx.fillStyle = mixColor("#08101d", "#79bbdf", Math.max(0.06, light));
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const celestialX = phase * canvas.width;
  const celestialY = canvas.height * 0.62 - Math.sin(phase * Math.PI) * canvas.height * 0.48;
  ctx.fillStyle = phase > 0.55 ? "#dce4ec" : "#ffe28b";
  ctx.fillRect(Math.round(celestialX), Math.round(celestialY), 30, 30);
  if (light < 0.25) {
    ctx.fillStyle = "rgba(255,255,255,.72)";
    for (let i = 0; i < 34; i += 1) ctx.fillRect((i * 83) % canvas.width, (i * 47) % Math.floor(canvas.height * 0.58), 2, 2);
  }

  ctx.fillStyle = `rgba(29, 59, 62, ${0.45 + light * 0.25})`;
  ctx.beginPath(); ctx.moveTo(0, canvas.height);
  for (let x = 0; x <= canvas.width; x += 60) ctx.lineTo(x, canvas.height * 0.55 + Math.sin((x + camera.x * 8) / 140) * 45);
  ctx.lineTo(canvas.width, canvas.height); ctx.fill();

  const startX = Math.max(0, Math.floor(camera.x) - 1);
  const endX = Math.min(WORLD_WIDTH, Math.ceil(camera.x + viewWidth) + 1);
  const startY = Math.max(0, Math.floor(camera.y) - 1);
  const endY = Math.min(WORLD_HEIGHT, Math.ceil(camera.y + viewHeight) + 1);
  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const id = getTile(x, y);
      if (!id) continue;
      drawBlock(ctx, id, (x - camera.x) * TILE, (y - camera.y) * TILE, TILE + 0.5);
    }
  }
  drawPlayer((player.x - camera.x) * TILE, (player.y - camera.y) * TILE);
  if (pointerTile && tileInReach(pointerTile.x, pointerTile.y)) {
    ctx.strokeStyle = touchMode === "place" ? "#78d75d" : "rgba(255,255,255,.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round((pointerTile.x - camera.x) * TILE) + 1, Math.round((pointerTile.y - camera.y) * TILE) + 1, TILE - 2, TILE - 2);
  }
  if (light < 0.34) {
    ctx.fillStyle = `rgba(0, 4, 8, ${0.62 - light})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (mining) {
    const x = Math.round((mining.x - camera.x) * TILE);
    const y = Math.round((mining.y - camera.y) * TILE);
    const progress = Math.min(1, mining.progress / mining.duration);
    ctx.strokeStyle = "rgba(255,255,255,.92)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
    ctx.fillStyle = "rgba(0,0,0,.72)";
    ctx.fillRect(x + 3, y + TILE - 6, TILE - 6, 3);
    ctx.fillStyle = progress > 0.72 ? "#e8b74d" : "#f4f1e8";
    ctx.fillRect(x + 3, y + TILE - 6, (TILE - 6) * progress, 3);
    ctx.strokeStyle = `rgba(0,0,0,${0.2 + progress * 0.55})`;
    ctx.lineWidth = 1 + progress * 2;
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 5); ctx.lineTo(x + 15, y + 15); ctx.lineTo(x + 10, y + 26);
    ctx.moveTo(x + 27, y + 7); ctx.lineTo(x + 19, y + 15); ctx.lineTo(x + 26, y + 25);
    ctx.stroke();
  }
}

function frame(now) {
  const dt = Math.min(0.035, (now - lastFrame) / 1000);
  lastFrame = now;
  update(dt);
  if (world.length) drawWorld();
  requestAnimationFrame(frame);
}

function setPaused(value) {
  paused = value;
  if (paused) mining = null;
  document.querySelector("#pause-button").textContent = paused ? t("resume") : t("pause");
  if (paused && running) showToast(t("paused"));
}

function startPlaying() {
  running = true;
  paused = false;
  overlay.hidden = true;
  canvas.focus({ preventScroll: true });
  document.querySelector("#pause-button").textContent = t("pause");
}

canvas.addEventListener("pointermove", (event) => { pointerTile = pointerToTile(event); });
canvas.addEventListener("pointerleave", () => { pointerTile = null; });
canvas.addEventListener("pointerdown", (event) => {
  if (!running || paused) return;
  event.preventDefault();
  const tile = pointerToTile(event);
  pointerTile = tile;
  if (event.button === 2 || touchMode === "place") { mining = null; placeTile(tile.x, tile.y); }
  else {
    startMining(tile.x, tile.y, event.pointerType || "mouse");
    if (event.pointerType === "mouse") canvas.setPointerCapture?.(event.pointerId);
  }
});
canvas.addEventListener("pointerup", (event) => { if (mining?.pointerType === "mouse") mining = null; });
canvas.addEventListener("pointercancel", () => { mining = null; });
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape" && document.querySelector("dialog[open]")) return;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space", "KeyA", "KeyD", "KeyW"].includes(event.code)) {
    event.preventDefault();
    keys.add(event.code);
  }
  if (/^Digit[1-7]$/.test(event.code)) { selectedSlot = Number(event.code.at(-1)) - 1; dirty = true; renderHotbar(); }
  if (event.code === "KeyB" && !event.repeat && !document.querySelector("dialog[open]")) openBackpack();
  if (event.code === "KeyP" || event.code === "Escape") setPaused(!paused);
});
window.addEventListener("keyup", (event) => keys.delete(event.code));

document.querySelectorAll("[data-control]").forEach((button) => {
  const control = `touch-${button.dataset.control}`;
  const press = (event) => { event.preventDefault(); keys.add(control); };
  const release = (event) => { event.preventDefault(); keys.delete(control); };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    touchMode = button.dataset.mode;
    mining = null;
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item === button));
  });
});

document.querySelector("#craft-button").addEventListener("click", () => {
  mining = null;
  craftResume = running && !paused;
  if (craftResume) setPaused(true);
  renderCrafting();
  craftDialog.showModal();
});
craftDialog.addEventListener("close", () => { if (craftResume) setPaused(false); craftResume = false; });

function openBackpack() {
  mining = null;
  backpackResume = running && !paused;
  if (backpackResume) setPaused(true);
  renderBackpack();
  backpackDialog.showModal();
}

document.querySelector("#backpack-button").addEventListener("click", openBackpack);
backpackDialog.addEventListener("close", () => { if (backpackResume) setPaused(false); backpackResume = false; });
document.querySelector("#save-button").addEventListener("click", () => saveWorld(true));
document.querySelector("#play-button").addEventListener("click", startPlaying);
document.querySelector("#pause-button").addEventListener("click", () => setPaused(!paused));
document.querySelector("#help-button").addEventListener("click", () => helpDialog.showModal());
document.querySelector("#new-world-button").addEventListener("click", () => { worldNameInput.value = worldName || t("worldDefault"); newWorldDialog.showModal(); });
document.querySelector("#confirm-new-world").addEventListener("click", (event) => {
  event.preventDefault();
  generateWorld(Math.floor(Math.random() * 2147483647), worldNameInput.value.trim() || t("worldDefault"));
  saveWorld(true);
  newWorldDialog.close();
  overlay.hidden = false;
  overlay.querySelector("p").textContent = t("welcome");
  running = false;
  paused = true;
});

window.addEventListener("blur", () => { keys.clear(); if (running) setPaused(true); });
window.addEventListener("beforeunload", () => saveWorld());
window.addEventListener("pagehide", () => saveWorld());
window.addEventListener("muye-language-change", applyLanguage);
document.addEventListener("visibilitychange", () => { if (document.hidden && running) { setPaused(true); saveWorld(); } });

async function boot() {
  applyLanguage();
  await findPlayerKey();
  if (!loadWorld()) generateWorld();
  worldNameInput.value = worldName;
  renderHotbar();
  updateHud();
  saveState.textContent = playerKey.startsWith("user:") ? t("accountSave") : t("deviceSave");
  saveTimer = setInterval(() => { if (dirty) saveWorld(); }, 3500);
  requestAnimationFrame(frame);
}

boot();
