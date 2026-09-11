const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const homeClerkProfile = document.querySelector("#home-clerk-profile");
const heroTitle = document.querySelector("#hero-title");
const dailyCheckin = document.querySelector("#daily-checkin");
const dailyCheckinLabel = document.querySelector("#daily-checkin-label");
const dailyCheckinStatus = document.querySelector("#daily-checkin-status");
const dailyCheckinButton = document.querySelector("#daily-checkin-button");
let currentHeroName = "";

const languages = [
  { code: "en", label: "English", short: "EN", dir: "ltr" },
  { code: "zh", label: "中文", short: "中", dir: "ltr" },
  { code: "ja", label: "日本語", short: "日", dir: "ltr" },
  { code: "ko", label: "한국어", short: "한", dir: "ltr" },
  { code: "es", label: "Español", short: "ES", dir: "ltr" },
  { code: "fr", label: "Français", short: "FR", dir: "ltr" },
  { code: "de", label: "Deutsch", short: "DE", dir: "ltr" },
  { code: "pt", label: "Português", short: "PT", dir: "ltr" },
  { code: "ru", label: "Русский", short: "RU", dir: "ltr" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl" },
];

const homeText = {
  en: {
    work: "Work", games: "Games", misc: "Misc", notes: "Notes", contact: "Contact", createEmail: "Create email", mailbox: "Mailbox", talk: "Talk", signIn: "Sign in", signUp: "Sign up",
    prompt: "Please sign up or sign in", greetings: ["Hi, {name}", "Good to see you, {name}", "Welcome back, {name}", "Ready when you are, {name}", "Let’s make something, {name}"], dailyLabel: "Daily check-in", dailyReady: "Ready for today?", dailyDone: "Checked in for today.", dailyButton: "Check in", dailyButtonDone: "Done",
    lede: "I build thoughtful software, shape ideas into working systems, and keep a small record of what I learn along the way.",
    mailboxAction: "Mailbox", createEmailAction: "Create email", gamesAction: "Games", miscAction: "Misc", talkAction: "Talk", workAction: "View work",
    intro: "A personal space for projects, notes, experiments, and the occasional polished thing worth sharing.",
    build: "Build", buildText: "Reliable products, prototypes, and automation.", write: "Write", writeText: "Short notes on engineering, taste, and tools.", explore: "Explore", exploreText: "Interfaces, agents, creative systems, and web craft.",
    selectedWork: "Selected Work", motion: "Things in motion", notesTitle: "Recently thinking about", noteName: "Now thinking about", noteText: "Version notes, recent deploys, and what this site is becoming.",
    productSystems: "Product Systems", productSystemsText: "Designing small, durable tools that make daily work feel lighter and clearer.",
    aiWorkflows: "AI Workflows", aiWorkflowsText: "Composing agents, automations, and human review loops into practical workflows.",
    webExperiments: "Web Experiments", webExperimentsText: "Exploring fast, expressive sites with careful interaction and quiet visual polish.",
    friend: "Friend", friendWebsite: "My friend's website.", friendGame: "My another friend's game.", game: "Game", gamesCardText: "Touch-friendly classics, puzzles, and board games.",
    localtalkNote: "How LocalTalk works", localtalkNoteText: "A small guide to rooms, signed chat, files, and moderation.",
    mailboxNote: "Mailbox version history", mailboxNoteText: "How Muye mail changed from email creation to safer sending.",
    buildingNote: "Now building", buildingNoteText: "Games: small, touch-friendly play without scores or pressure.",
    footerBuilt: "Built for Cloudflare Pages.",
  },
  zh: {
    work: "作品", games: "游戏", misc: "杂项", notes: "笔记", contact: "联系", createEmail: "创建邮箱", mailbox: "邮箱", talk: "聊天", signIn: "登录", signUp: "注册",
    prompt: "请注册或登录", greetings: ["你好，{name}", "欢迎回来，{name}", "今天也开始吧，{name}", "准备好了，{name}", "一起做点东西吧，{name}"], dailyLabel: "每日签到", dailyReady: "今天签到了吗？", dailyDone: "今天已签到。", dailyButton: "签到", dailyButtonDone: "完成",
    lede: "我做有想法的软件，把点子变成可用的系统，也记录一路学到的东西。",
    mailboxAction: "邮箱", createEmailAction: "创建邮箱", gamesAction: "游戏", miscAction: "杂项", talkAction: "聊天", workAction: "查看作品",
    intro: "一个放项目、笔记、实验和一些值得分享的小东西的个人空间。",
    build: "构建", buildText: "可靠的产品、原型和自动化。", write: "写作", writeText: "关于工程、品味和工具的短笔记。", explore: "探索", exploreText: "界面、智能体、创意系统和网页手艺。",
    selectedWork: "精选作品", motion: "正在进行", notesTitle: "最近在想", noteName: "现在在想", noteText: "版本记录、最近部署和这个网站正在变成什么。",
    productSystems: "产品系统", productSystemsText: "设计小而耐用的工具，让日常工作更轻、更清楚。",
    aiWorkflows: "AI 工作流", aiWorkflowsText: "把智能体、自动化和人工检查组合成真正可用的流程。",
    webExperiments: "网页实验", webExperimentsText: "探索快速、有表现力，并且交互细致的网站。",
    friend: "朋友", friendWebsite: "我朋友的网站。", friendGame: "我另一个朋友的游戏。", game: "游戏", gamesCardText: "适合触屏的经典、解谜和棋盘游戏。",
    localtalkNote: "LocalTalk 如何工作", localtalkNoteText: "关于房间、登录聊天、文件和管理的小指南。",
    mailboxNote: "邮箱版本记录", mailboxNoteText: "Muye 邮箱如何从创建邮箱变到更安全地发送。",
    buildingNote: "正在构建", buildingNoteText: "游戏：小巧、适合触屏、没有分数压力。",
    footerBuilt: "为 Cloudflare Pages 构建。",
  },
  ja: {
    prompt: "登録またはログインしてください", greetings: ["こんにちは、{name}", "おかえり、{name}", "今日も始めよう、{name}", "準備できています、{name}", "一緒に作ろう、{name}"], dailyLabel: "毎日のチェックイン", dailyReady: "今日はチェックインする？", dailyDone: "今日はチェックイン済み。", dailyButton: "チェックイン", dailyButtonDone: "完了", work: "作品", games: "ゲーム", misc: "その他", notes: "ノート", contact: "連絡", createEmail: "メール作成", mailbox: "メール", talk: "トーク", signIn: "ログイン", signUp: "登録",
    lede: "考え抜いたソフトウェアを作り、アイデアを動く仕組みにし、学びを少しずつ記録しています。", mailboxAction: "メール", createEmailAction: "メール作成", gamesAction: "ゲーム", miscAction: "その他", talkAction: "トーク", workAction: "作品を見る",
    intro: "プロジェクト、ノート、実験、共有したい小さな成果を置く個人スペース。", build: "作る", buildText: "信頼できるプロダクト、試作、自動化。", write: "書く", writeText: "エンジニアリング、感覚、ツールについての短いノート。", explore: "探る", exploreText: "インターフェイス、エージェント、創造的なシステム、Web表現。",
    selectedWork: "主な作品", motion: "進行中", notesTitle: "最近考えていること", noteName: "今考えていること", noteText: "バージョンノート、最近のデプロイ、このサイトの変化。",
    productSystems: "プロダクトシステム", productSystemsText: "毎日の作業を軽く明確にする小さく丈夫なツールを設計。", aiWorkflows: "AIワークフロー", aiWorkflowsText: "エージェント、自動化、人の確認を実用的な流れに組み合わせる。", webExperiments: "Web実験", webExperimentsText: "速く表現力があり、丁寧に動くサイトを探る。",
    friend: "友人", friendWebsite: "友人のサイト。", friendGame: "もう一人の友人のゲーム。", game: "ゲーム", gamesCardText: "タッチしやすい定番、パズル、ボードゲーム。", localtalkNote: "LocalTalkの仕組み", localtalkNoteText: "部屋、ログインチャット、ファイル、管理の小さなガイド。", mailboxNote: "メール履歴", mailboxNoteText: "Muyeメールが作成から安全な送信までどう変わったか。", buildingNote: "制作中", buildingNoteText: "ゲーム：小さく、タッチしやすく、スコアの圧がない遊び。", footerBuilt: "Cloudflare Pages 用に構築。",
  },
  ko: {
    prompt: "가입하거나 로그인해 주세요", greetings: ["안녕하세요, {name}", "다시 만나 반가워요, {name}", "오늘도 시작해요, {name}", "준비됐어요, {name}", "같이 만들어봐요, {name}"], dailyLabel: "매일 체크인", dailyReady: "오늘 체크인할까요?", dailyDone: "오늘 체크인 완료.", dailyButton: "체크인", dailyButtonDone: "완료", work: "작업", games: "게임", misc: "기타", notes: "노트", contact: "연락", createEmail: "메일 만들기", mailbox: "메일함", talk: "대화", signIn: "로그인", signUp: "가입",
    lede: "생각이 담긴 소프트웨어를 만들고, 아이디어를 작동하는 시스템으로 만들며, 배운 것을 조금씩 기록합니다.", mailboxAction: "메일함", createEmailAction: "메일 만들기", gamesAction: "게임", miscAction: "기타", talkAction: "대화", workAction: "작업 보기",
    intro: "프로젝트, 노트, 실험, 공유할 만한 작은 결과물을 두는 개인 공간입니다.", build: "만들기", buildText: "믿을 수 있는 제품, 프로토타입, 자동화.", write: "쓰기", writeText: "엔지니어링, 감각, 도구에 대한 짧은 노트.", explore: "탐색", exploreText: "인터페이스, 에이전트, 창의적 시스템, 웹 제작.",
    selectedWork: "선택한 작업", motion: "진행 중", notesTitle: "요즘 생각하는 것", noteName: "지금 생각하는 것", noteText: "버전 노트, 최근 배포, 이 사이트가 되어가는 모습.",
    productSystems: "제품 시스템", productSystemsText: "일상 작업을 더 가볍고 명확하게 만드는 작고 오래가는 도구 설계.", aiWorkflows: "AI 워크플로", aiWorkflowsText: "에이전트, 자동화, 사람의 검토를 실용적인 흐름으로 조합.", webExperiments: "웹 실험", webExperimentsText: "빠르고 표현력 있으며 세심하게 반응하는 사이트 탐색.",
    friend: "친구", friendWebsite: "친구의 웹사이트.", friendGame: "또 다른 친구의 게임.", game: "게임", gamesCardText: "터치 친화적인 클래식, 퍼즐, 보드게임.", localtalkNote: "LocalTalk 작동 방식", localtalkNoteText: "방, 로그인 채팅, 파일, 관리에 대한 작은 안내.", mailboxNote: "메일함 버전 기록", mailboxNoteText: "Muye 메일이 생성에서 더 안전한 발송까지 바뀐 과정.", buildingNote: "지금 만드는 것", buildingNoteText: "게임: 작고 터치 친화적이며 점수 압박 없는 플레이.", footerBuilt: "Cloudflare Pages용으로 제작.",
  },
  es: {
    prompt: "Regístrate o inicia sesión", greetings: ["Hola, {name}", "Qué bueno verte, {name}", "Volvamos a crear, {name}", "Listo cuando tú quieras, {name}", "Buen día, {name}"], dailyLabel: "Check-in diario", dailyReady: "¿Listo para hoy?", dailyDone: "Check-in de hoy hecho.", dailyButton: "Check-in", dailyButtonDone: "Listo", work: "Trabajo", games: "Juegos", misc: "Más", notes: "Notas", contact: "Contacto", createEmail: "Crear email", mailbox: "Correo", talk: "Chat", signIn: "Entrar", signUp: "Registrarse",
    lede: "Construyo software cuidadoso, convierto ideas en sistemas que funcionan y guardo un pequeño registro de lo que aprendo.", mailboxAction: "Correo", createEmailAction: "Crear email", gamesAction: "Juegos", miscAction: "Más", talkAction: "Chat", workAction: "Ver trabajo",
    intro: "Un espacio personal para proyectos, notas, experimentos y pequeñas cosas pulidas para compartir.", build: "Crear", buildText: "Productos fiables, prototipos y automatización.", write: "Escribir", writeText: "Notas cortas sobre ingeniería, gusto y herramientas.", explore: "Explorar", exploreText: "Interfaces, agentes, sistemas creativos y web.",
    selectedWork: "Trabajo seleccionado", motion: "En movimiento", notesTitle: "Pensando ahora", noteName: "Ahora pensando", noteText: "Notas de versión, despliegues recientes y en qué se está convirtiendo este sitio.",
    productSystems: "Sistemas de producto", productSystemsText: "Diseñar herramientas pequeñas y duraderas que hacen el trabajo diario más claro.", aiWorkflows: "Flujos de IA", aiWorkflowsText: "Combinar agentes, automatización y revisión humana en flujos prácticos.", webExperiments: "Experimentos web", webExperimentsText: "Explorar sitios rápidos, expresivos y con interacciones cuidadas.",
    friend: "Amigo", friendWebsite: "El sitio de mi amigo.", friendGame: "El juego de otro amigo.", game: "Juego", gamesCardText: "Clásicos, puzles y juegos de mesa para pantalla táctil.", localtalkNote: "Cómo funciona LocalTalk", localtalkNoteText: "Guía breve de salas, chat con sesión, archivos y moderación.", mailboxNote: "Historial del correo", mailboxNoteText: "Cómo Muye mail pasó de crear emails a enviar con más seguridad.", buildingNote: "Construyendo", buildingNoteText: "Juegos: pequeños, táctiles y sin presión de puntuación.", footerBuilt: "Hecho para Cloudflare Pages.",
  },
  fr: {
    prompt: "Inscrivez-vous ou connectez-vous", greetings: ["Bonjour, {name}", "Content de vous revoir, {name}", "On s’y remet, {name}", "Prêt quand vous l’êtes, {name}", "Bonne journée, {name}"], dailyLabel: "Point du jour", dailyReady: "Prêt pour aujourd’hui ?", dailyDone: "Point du jour fait.", dailyButton: "Valider", dailyButtonDone: "Fait", work: "Travail", games: "Jeux", misc: "Divers", notes: "Notes", contact: "Contact", createEmail: "Créer un email", mailbox: "Boîte mail", talk: "Discussion", signIn: "Connexion", signUp: "Inscription",
    lede: "Je crée des logiciels attentifs, transforme des idées en systèmes utilisables, et garde une trace de ce que j'apprends.", mailboxAction: "Boîte mail", createEmailAction: "Créer un email", gamesAction: "Jeux", miscAction: "Divers", talkAction: "Discussion", workAction: "Voir le travail",
    intro: "Un espace personnel pour projets, notes, expériences et petites choses à partager.", build: "Construire", buildText: "Produits fiables, prototypes et automatisations.", write: "Écrire", writeText: "Notes courtes sur l'ingénierie, le goût et les outils.", explore: "Explorer", exploreText: "Interfaces, agents, systèmes créatifs et web.",
    selectedWork: "Travaux choisis", motion: "En cours", notesTitle: "Pensées récentes", noteName: "En ce moment", noteText: "Notes de version, déploiements récents et évolution du site.",
    productSystems: "Systèmes produit", productSystemsText: "Concevoir de petits outils durables qui rendent le travail plus clair.", aiWorkflows: "Flux IA", aiWorkflowsText: "Composer agents, automatisations et revue humaine en flux pratiques.", webExperiments: "Expériences web", webExperimentsText: "Explorer des sites rapides, expressifs et finement interactifs.",
    friend: "Ami", friendWebsite: "Le site de mon ami.", friendGame: "Le jeu d'un autre ami.", game: "Jeu", gamesCardText: "Classiques, puzzles et jeux de plateau tactiles.", localtalkNote: "Fonctionnement de LocalTalk", localtalkNoteText: "Petit guide des salons, du chat connecté, des fichiers et de la modération.", mailboxNote: "Historique de la boîte mail", mailboxNoteText: "Comment Muye mail a évolué vers un envoi plus sûr.", buildingNote: "En construction", buildingNoteText: "Jeux : petits, tactiles, sans pression de score.", footerBuilt: "Construit pour Cloudflare Pages.",
  },
  de: {
    prompt: "Bitte registrieren oder anmelden", greetings: ["Hallo, {name}", "Schön dich zu sehen, {name}", "Bereit für heute, {name}", "Willkommen zurück, {name}", "Lass uns etwas bauen, {name}"], dailyLabel: "Täglicher Check-in", dailyReady: "Bereit für heute?", dailyDone: "Für heute eingecheckt.", dailyButton: "Einchecken", dailyButtonDone: "Fertig", work: "Arbeit", games: "Spiele", misc: "Mehr", notes: "Notizen", contact: "Kontakt", createEmail: "E-Mail erstellen", mailbox: "Postfach", talk: "Chat", signIn: "Anmelden", signUp: "Registrieren",
    lede: "Ich baue durchdachte Software, forme Ideen zu funktionierenden Systemen und halte fest, was ich lerne.", mailboxAction: "Postfach", createEmailAction: "E-Mail erstellen", gamesAction: "Spiele", miscAction: "Mehr", talkAction: "Chat", workAction: "Arbeit ansehen",
    intro: "Ein persönlicher Ort für Projekte, Notizen, Experimente und kleine Dinge zum Teilen.", build: "Bauen", buildText: "Zuverlässige Produkte, Prototypen und Automatisierung.", write: "Schreiben", writeText: "Kurze Notizen über Engineering, Geschmack und Tools.", explore: "Erkunden", exploreText: "Interfaces, Agenten, kreative Systeme und Webcraft.",
    selectedWork: "Ausgewählte Arbeit", motion: "In Bewegung", notesTitle: "Gerade im Kopf", noteName: "Gerade gedacht", noteText: "Versionsnotizen, letzte Deploys und wohin diese Site wächst.",
    productSystems: "Produktsysteme", productSystemsText: "Kleine, robuste Tools entwerfen, die tägliche Arbeit leichter machen.", aiWorkflows: "AI-Workflows", aiWorkflowsText: "Agenten, Automatisierung und menschliche Prüfung praktisch verbinden.", webExperiments: "Webexperimente", webExperimentsText: "Schnelle, ausdrucksstarke Sites mit sorgfältiger Interaktion erkunden.",
    friend: "Freund", friendWebsite: "Die Website meines Freundes.", friendGame: "Das Spiel eines anderen Freundes.", game: "Spiel", gamesCardText: "Touchfreundliche Klassiker, Rätsel und Brettspiele.", localtalkNote: "Wie LocalTalk funktioniert", localtalkNoteText: "Kurzer Guide zu Räumen, Login-Chat, Dateien und Moderation.", mailboxNote: "Postfach-Versionen", mailboxNoteText: "Wie Muye Mail von Erstellung zu sichererem Senden wurde.", buildingNote: "Jetzt gebaut", buildingNoteText: "Spiele: klein, touchfreundlich, ohne Punktedruck.", footerBuilt: "Gebaut für Cloudflare Pages.",
  },
  pt: {
    prompt: "Cadastre-se ou entre", greetings: ["Olá, {name}", "Bom te ver, {name}", "Vamos começar, {name}", "Pronto quando você estiver, {name}", "Vamos criar algo, {name}"], dailyLabel: "Check-in diário", dailyReady: "Pronto para hoje?", dailyDone: "Check-in de hoje feito.", dailyButton: "Check-in", dailyButtonDone: "Feito", work: "Trabalho", games: "Jogos", misc: "Extras", notes: "Notas", contact: "Contato", createEmail: "Criar email", mailbox: "Email", talk: "Conversa", signIn: "Entrar", signUp: "Cadastrar",
    lede: "Crio software cuidadoso, transformo ideias em sistemas funcionando e registro o que aprendo pelo caminho.", mailboxAction: "Email", createEmailAction: "Criar email", gamesAction: "Jogos", miscAction: "Extras", talkAction: "Conversa", workAction: "Ver trabalho",
    intro: "Um espaço pessoal para projetos, notas, experimentos e pequenas coisas boas para compartilhar.", build: "Criar", buildText: "Produtos confiáveis, protótipos e automação.", write: "Escrever", writeText: "Notas curtas sobre engenharia, gosto e ferramentas.", explore: "Explorar", exploreText: "Interfaces, agentes, sistemas criativos e web.",
    selectedWork: "Trabalho escolhido", motion: "Em movimento", notesTitle: "Pensando agora", noteName: "Pensando agora", noteText: "Notas de versão, deploys recentes e no que este site está virando.",
    productSystems: "Sistemas de produto", productSystemsText: "Criar ferramentas pequenas e duráveis que deixam o trabalho mais claro.", aiWorkflows: "Fluxos de IA", aiWorkflowsText: "Compor agentes, automações e revisão humana em fluxos práticos.", webExperiments: "Experimentos web", webExperimentsText: "Explorar sites rápidos, expressivos e com interação cuidadosa.",
    friend: "Amigo", friendWebsite: "O site do meu amigo.", friendGame: "O jogo de outro amigo.", game: "Jogo", gamesCardText: "Clássicos, puzzles e jogos de tabuleiro para toque.", localtalkNote: "Como LocalTalk funciona", localtalkNoteText: "Guia curto de salas, chat logado, arquivos e moderação.", mailboxNote: "Histórico do email", mailboxNoteText: "Como o Muye mail mudou da criação ao envio mais seguro.", buildingNote: "Construindo", buildingNoteText: "Jogos: pequenos, bons para toque e sem pressão de pontuação.", footerBuilt: "Feito para Cloudflare Pages.",
  },
  ru: {
    prompt: "Зарегистрируйтесь или войдите", greetings: ["Привет, {name}", "Рад видеть вас, {name}", "Начнём день, {name}", "Готово, когда вы готовы, {name}", "Давайте что-нибудь создадим, {name}"], dailyLabel: "Ежедневная отметка", dailyReady: "Готовы к сегодняшнему дню?", dailyDone: "Сегодняшняя отметка сделана.", dailyButton: "Отметиться", dailyButtonDone: "Готово", work: "Работы", games: "Игры", misc: "Разное", notes: "Заметки", contact: "Контакт", createEmail: "Создать почту", mailbox: "Почта", talk: "Чат", signIn: "Войти", signUp: "Регистрация",
    lede: "Я создаю продуманный софт, превращаю идеи в рабочие системы и веду небольшой журнал того, чему учусь.", mailboxAction: "Почта", createEmailAction: "Создать почту", gamesAction: "Игры", miscAction: "Разное", talkAction: "Чат", workAction: "Смотреть работы",
    intro: "Личное место для проектов, заметок, экспериментов и аккуратных вещей, которыми стоит поделиться.", build: "Строить", buildText: "Надёжные продукты, прототипы и автоматизация.", write: "Писать", writeText: "Короткие заметки об инженерии, вкусе и инструментах.", explore: "Исследовать", exploreText: "Интерфейсы, агенты, творческие системы и веб.",
    selectedWork: "Избранные работы", motion: "В движении", notesTitle: "Сейчас думаю", noteName: "Сейчас думаю", noteText: "Версии, последние деплои и то, чем становится сайт.",
    productSystems: "Продуктовые системы", productSystemsText: "Небольшие прочные инструменты, делающие работу легче и яснее.", aiWorkflows: "AI-процессы", aiWorkflowsText: "Соединение агентов, автоматизации и проверки человеком в практичные процессы.", webExperiments: "Веб-эксперименты", webExperimentsText: "Быстрые выразительные сайты с аккуратным взаимодействием.",
    friend: "Друг", friendWebsite: "Сайт моего друга.", friendGame: "Игра другого друга.", game: "Игра", gamesCardText: "Классика, головоломки и настольные игры для касаний.", localtalkNote: "Как работает LocalTalk", localtalkNoteText: "Короткий гид по комнатам, чату с входом, файлам и модерации.", mailboxNote: "История почты", mailboxNoteText: "Как Muye mail прошла путь к более безопасной отправке.", buildingNote: "Сейчас строю", buildingNoteText: "Игры: маленькие, удобные для касаний, без давления очков.", footerBuilt: "Сделано для Cloudflare Pages.",
  },
  ar: {
    prompt: "يرجى التسجيل أو تسجيل الدخول", greetings: ["مرحبا، {name}", "سعيد برؤيتك، {name}", "لنبدأ اليوم، {name}", "جاهز عندما تكون جاهزا، {name}", "لنصنع شيئا، {name}"], dailyLabel: "تسجيل يومي", dailyReady: "هل أنت جاهز لليوم؟", dailyDone: "تم تسجيل اليوم.", dailyButton: "تسجيل", dailyButtonDone: "تم", work: "الأعمال", games: "الألعاب", misc: "أخرى", notes: "ملاحظات", contact: "تواصل", createEmail: "إنشاء بريد", mailbox: "البريد", talk: "الدردشة", signIn: "دخول", signUp: "تسجيل",
    lede: "أبني برمجيات مدروسة، وأحوّل الأفكار إلى أنظمة تعمل، وأسجل ما أتعلمه بهدوء.", mailboxAction: "البريد", createEmailAction: "إنشاء بريد", gamesAction: "الألعاب", miscAction: "أخرى", talkAction: "الدردشة", workAction: "عرض الأعمال",
    intro: "مساحة شخصية للمشاريع والملاحظات والتجارب والأشياء الصغيرة التي تستحق المشاركة.", build: "بناء", buildText: "منتجات موثوقة ونماذج أولية وأتمتة.", write: "كتابة", writeText: "ملاحظات قصيرة عن الهندسة والذوق والأدوات.", explore: "استكشاف", exploreText: "واجهات ووكلاء وأنظمة إبداعية وصناعة الويب.",
    selectedWork: "أعمال مختارة", motion: "قيد الحركة", notesTitle: "أفكر الآن", noteName: "أفكر الآن", noteText: "ملاحظات الإصدارات وآخر النشرات وما يصبح عليه هذا الموقع.",
    productSystems: "أنظمة المنتج", productSystemsText: "تصميم أدوات صغيرة ومتينة تجعل العمل اليومي أوضح وأخف.", aiWorkflows: "سير عمل الذكاء الاصطناعي", aiWorkflowsText: "جمع الوكلاء والأتمتة والمراجعة البشرية في مسارات عملية.", webExperiments: "تجارب الويب", webExperimentsText: "استكشاف مواقع سريعة ومعبرة وذات تفاعل دقيق.",
    friend: "صديق", friendWebsite: "موقع صديقي.", friendGame: "لعبة صديق آخر.", game: "لعبة", gamesCardText: "كلاسيكيات وألغاز وألعاب لوحية مناسبة للمس.", localtalkNote: "كيف يعمل LocalTalk", localtalkNoteText: "دليل صغير للغرف والدردشة المسجلة والملفات والإدارة.", mailboxNote: "تاريخ البريد", mailboxNoteText: "كيف تغيّر بريد Muye من إنشاء البريد إلى إرسال أكثر أمانا.", buildingNote: "أبني الآن", buildingNoteText: "ألعاب صغيرة ومناسبة للمس وبدون ضغط النقاط.", footerBuilt: "مبني على Cloudflare Pages.",
  },
};

const languageButtonMark = '<span class="language-mark" aria-hidden="true"><span class="language-mark-a">A</span><span class="language-mark-zh">中</span></span>';

async function waitForClerk() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (window.Clerk) return window.Clerk;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Clerk did not load.");
}

function displayNameFor(user) {
  return user?.unsafeMetadata?.displayName || user?.username || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "there";
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function dayNumber() {
  const start = new Date(`${todayKey()}T00:00:00`);
  return Math.floor(start.getTime() / 86400000);
}

function renderSignedInHero(name) {
  currentHeroName = name;
  const nameLink = `<a class="hero-name-link" href="/profile/">${escapeHtml(name)}</a>`;
  const greetings = textFor("greetings");
  const options = Array.isArray(greetings) && greetings.length ? greetings : homeText.en.greetings;
  heroTitle.innerHTML = options[dayNumber() % options.length].replace("{name}", nameLink);
  heroTitle.classList.remove("hero-prompt");
  heroTitle.classList.add("hero-greeting");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function currentLanguage() {
  const saved = localStorage.getItem("muye-lang") || localStorage.getItem("localtalk-lang") || "en";
  return languages.some((language) => language.code === saved) ? saved : "en";
}

function textFor(key) {
  const code = currentLanguage();
  return homeText[code]?.[key] || homeText.en[key] || "";
}

function syncDailyCheckin() {
  if (!dailyCheckin || !dailyCheckinLabel || !dailyCheckinStatus || !dailyCheckinButton) return;
  const done = localStorage.getItem("muye-daily-checkin") === todayKey();
  dailyCheckinLabel.textContent = textFor("dailyLabel");
  dailyCheckinStatus.textContent = done ? textFor("dailyDone") : textFor("dailyReady");
  dailyCheckinButton.textContent = done ? textFor("dailyButtonDone") : textFor("dailyButton");
  dailyCheckinButton.disabled = done;
  dailyCheckin.classList.toggle("is-done", done);
}

function applyHomeLanguage() {
  const language = languages.find((item) => item.code === currentLanguage()) || languages[0];
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;
  document.querySelectorAll("[data-language-button]").forEach((button) => {
    button.innerHTML = languageButtonMark;
    button.setAttribute("aria-label", `Change language. Current: ${language.label}`);
  });
  const navLinks = document.querySelectorAll(".site-header nav > a");
  const navKeys = ["work", "games", "misc", "notes", "contact", "createEmail", "mailbox", "talk", "signIn", "signUp"];
  navKeys.forEach((key, index) => { if (navLinks[index]) navLinks[index].textContent = textFor(key); });
  if (heroTitle?.classList.contains("hero-prompt")) heroTitle.textContent = textFor("prompt");
  if (heroTitle?.classList.contains("hero-greeting") && currentHeroName) renderSignedInHero(currentHeroName);
  syncDailyCheckin();
  const lede = document.querySelector(".lede");
  if (lede) lede.textContent = textFor("lede");
  document.querySelectorAll(".hero-actions .button").forEach((button, index) => {
    const key = ["mailboxAction", "createEmailAction", "gamesAction", "miscAction", "talkAction", "workAction"][index];
    button.textContent = textFor(key);
  });
  const intro = document.querySelector(".intro > p");
  if (intro) intro.textContent = textFor("intro");
  const dts = document.querySelectorAll(".intro dt");
  const dds = document.querySelectorAll(".intro dd");
  ["build", "write", "explore"].forEach((key, index) => { if (dts[index]) dts[index].textContent = textFor(key); });
  ["buildText", "writeText", "exploreText"].forEach((key, index) => { if (dds[index]) dds[index].textContent = textFor(key); });
  const headings = document.querySelectorAll(".section-heading");
  if (headings[0]) { headings[0].querySelector(".eyebrow").textContent = textFor("selectedWork"); headings[0].querySelector("h2").textContent = textFor("motion"); }
  if (headings[1]) headings[1].querySelector("h2").textContent = textFor("notesTitle");
  document.querySelectorAll(".work-card").forEach((card, index) => {
    const keys = [
      ["01", "productSystems", "productSystemsText"],
      ["02", "aiWorkflows", "aiWorkflowsText"],
      ["03", "webExperiments", "webExperimentsText"],
      ["friend", null, "friendWebsite"],
      ["friend", null, "friendGame"],
      ["game", "games", "gamesCardText"],
    ][index];
    if (!keys) return;
    card.querySelector("span").textContent = keys[0].match(/^\d/) ? keys[0] : textFor(keys[0]);
    if (keys[1]) card.querySelector("h3").textContent = textFor(keys[1]);
    card.querySelector("p").textContent = textFor(keys[2]);
  });
  document.querySelectorAll(".note-list a").forEach((note, index) => {
    const keys = [
      ["noteName", "noteText"],
      ["localtalkNote", "localtalkNoteText"],
      ["mailboxNote", "mailboxNoteText"],
      ["buildingNote", "buildingNoteText"],
    ][index];
    if (!keys) return;
    note.querySelector("span").textContent = textFor(keys[0]);
    note.querySelector("strong").textContent = textFor(keys[1]);
  });
  const footerText = document.querySelector("footer p");
  if (footerText && year) footerText.innerHTML = `&copy; <span id="year">${new Date().getFullYear()}</span> Muye. ${textFor("footerBuilt")}`;
  document.querySelectorAll(".language-menu .language-option").forEach((option) => {
    option.setAttribute("aria-selected", option.dataset.lang === language.code ? "true" : "false");
  });
}

function setLanguage(code) {
  const language = languages.find((item) => item.code === code) || languages[0];
  localStorage.setItem("muye-lang", language.code);
  localStorage.setItem("localtalk-lang", language.code === "zh" ? "zh" : "en");
  applyHomeLanguage();
}

function setupLanguageSwitcher() {
  document.querySelectorAll("[data-language-switcher]").forEach((switcher) => {
    const button = switcher.querySelector("[data-language-button]");
    const menu = switcher.querySelector(".language-menu");
    if (!button || !menu) return;
    menu.innerHTML = languages.map((language) => `<button class="language-option" type="button" role="option" data-lang="${language.code}">${language.label}</button>`).join("");
    button.addEventListener("click", () => {
      const isOpen = !menu.hidden;
      document.querySelectorAll(".language-menu").forEach((item) => { item.hidden = true; });
      document.querySelectorAll("[data-language-button]").forEach((item) => { item.setAttribute("aria-expanded", "false"); });
      menu.hidden = isOpen;
      button.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
    menu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-lang]");
      if (!option) return;
      setLanguage(option.dataset.lang);
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-language-switcher]")) {
      document.querySelectorAll(".language-menu").forEach((menu) => { menu.hidden = true; });
      document.querySelectorAll("[data-language-button]").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
      });
    }
  });
  applyHomeLanguage();
}

dailyCheckinButton?.addEventListener("click", () => {
  localStorage.setItem("muye-daily-checkin", todayKey());
  syncDailyCheckin();
});

function showUserNameForm() {
  const existing = document.querySelector("#hero-name-form");
  if (existing) {
    existing.querySelector("input")?.focus();
    return;
  }
  heroTitle.insertAdjacentHTML("afterend", `
    <form class="hero-name-form" id="hero-name-form">
      <label>
        <span>Username</span>
        <input name="username" type="text" value="${escapeHtml(currentHeroName)}" autocomplete="username" required>
      </label>
      <button class="button primary" type="submit">Save</button>
      <button class="button secondary" id="cancel-name-button" type="button">Cancel</button>
      <p class="hero-name-message" id="hero-name-message" role="status" aria-live="polite"></p>
    </form>`);
  const form = document.querySelector("#hero-name-form");
  form.querySelector("input")?.focus();
  form.addEventListener("submit", updateUserName);
  document.querySelector("#cancel-name-button")?.addEventListener("click", () => form.remove());
}

async function updateUserName(event) {
  event.preventDefault();
  if (!window.Clerk?.user) return;
  const form = event.currentTarget;
  const message = form.querySelector("#hero-name-message");
  const trimmed = String(new FormData(form).get("username") || "").trim();
  if (!trimmed) return;
  message.textContent = "Saving...";
  try {
    await Clerk.user.update({ username: trimmed });
  } catch (error) {
    try {
      await Clerk.user.update({ firstName: trimmed });
    } catch {
      message.textContent = "Could not save that username.";
      return;
    }
  }
  await Clerk.user.reload?.();
  form.remove();
  renderSignedInHero(trimmed);
}

window.addEventListener("load", async () => {
  setupLanguageSwitcher();
  if (!heroTitle || !homeClerkProfile) return;

  try {
    const clerk = await waitForClerk();
    await clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } });
    if (!clerk.isSignedIn) return;

    const user = clerk.user;
    renderSignedInHero(displayNameFor(user));
    homeClerkProfile.hidden = false;
    if (!homeClerkProfile.dataset.mounted) {
      if (typeof clerk.mountUserButton === "function") {
        clerk.mountUserButton(homeClerkProfile, { afterSignOutUrl: "/" });
        setTimeout(() => {
          if (!homeClerkProfile.childElementCount) mountAccountFallback(clerk);
        }, 1200);
      } else {
        mountAccountFallback(clerk);
      }
      homeClerkProfile.dataset.mounted = "true";
    }
    document.querySelectorAll(".nav-auth.sign-in, .nav-auth.sign-up").forEach((link) => {
      link.hidden = true;
    });
  } catch (error) {
    console.error(error);
  }
});

function mountAccountFallback(clerk) {
  homeClerkProfile.innerHTML = '<button class="clerk-fallback-button" type="button" aria-label="Account">Account</button>';
  homeClerkProfile.querySelector("button")?.addEventListener("click", () => clerk.openUserProfile?.());
}
