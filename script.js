const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const homeClerkProfile = document.querySelector("#home-clerk-profile");
const heroTitle = document.querySelector("#hero-title");
const languageButton = document.querySelector("#language-button");
const languageMenu = document.querySelector("#language-menu");
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
    prompt: "Please sign up or sign in", lede: "I build thoughtful software, shape ideas into working systems, and keep a small record of what I learn along the way.",
    mailboxAction: "Mailbox", createEmailAction: "Create email", gamesAction: "Games", miscAction: "Misc", talkAction: "Talk", workAction: "View work",
    intro: "A personal space for projects, notes, experiments, and the occasional polished thing worth sharing.",
    build: "Build", buildText: "Reliable products, prototypes, and automation.", write: "Write", writeText: "Short notes on engineering, taste, and tools.", explore: "Explore", exploreText: "Interfaces, agents, creative systems, and web craft.",
    selectedWork: "Selected Work", motion: "Things in motion", notesTitle: "Recently thinking about", noteName: "Now thinking about", noteText: "Version notes, recent deploys, and what this site is becoming.",
  },
  zh: {
    work: "作品", games: "游戏", misc: "杂项", notes: "笔记", contact: "联系", createEmail: "创建邮箱", mailbox: "邮箱", talk: "聊天", signIn: "登录", signUp: "注册",
    prompt: "请注册或登录", lede: "我做有想法的软件，把点子变成可用的系统，也记录一路学到的东西。",
    mailboxAction: "邮箱", createEmailAction: "创建邮箱", gamesAction: "游戏", miscAction: "杂项", talkAction: "聊天", workAction: "查看作品",
    intro: "一个放项目、笔记、实验和一些值得分享的小东西的个人空间。",
    build: "构建", buildText: "可靠的产品、原型和自动化。", write: "写作", writeText: "关于工程、品味和工具的短笔记。", explore: "探索", exploreText: "界面、智能体、创意系统和网页手艺。",
    selectedWork: "精选作品", motion: "正在进行", notesTitle: "最近在想", noteName: "现在在想", noteText: "版本记录、最近部署和这个网站正在变成什么。",
  },
  ja: { prompt: "登録またはログインしてください", work: "作品", games: "ゲーム", misc: "その他", notes: "ノート", contact: "連絡", createEmail: "メール作成", mailbox: "メール", talk: "トーク", signIn: "ログイン", signUp: "登録", notesTitle: "最近考えていること", noteName: "今考えていること" },
  ko: { prompt: "가입하거나 로그인해 주세요", work: "작업", games: "게임", misc: "기타", notes: "노트", contact: "연락", createEmail: "메일 만들기", mailbox: "메일함", talk: "대화", signIn: "로그인", signUp: "가입", notesTitle: "요즘 생각하는 것", noteName: "지금 생각하는 것" },
  es: { prompt: "Regístrate o inicia sesión", work: "Trabajo", games: "Juegos", misc: "Más", notes: "Notas", contact: "Contacto", createEmail: "Crear email", mailbox: "Correo", talk: "Chat", signIn: "Entrar", signUp: "Registrarse", notesTitle: "Pensando ahora", noteName: "Ahora pensando" },
  fr: { prompt: "Inscrivez-vous ou connectez-vous", work: "Travail", games: "Jeux", misc: "Divers", notes: "Notes", contact: "Contact", createEmail: "Créer un email", mailbox: "Boîte mail", talk: "Discussion", signIn: "Connexion", signUp: "Inscription", notesTitle: "Pensées récentes", noteName: "En ce moment" },
  de: { prompt: "Bitte registrieren oder anmelden", work: "Arbeit", games: "Spiele", misc: "Mehr", notes: "Notizen", contact: "Kontakt", createEmail: "E-Mail erstellen", mailbox: "Postfach", talk: "Chat", signIn: "Anmelden", signUp: "Registrieren", notesTitle: "Gerade im Kopf", noteName: "Gerade gedacht" },
  pt: { prompt: "Cadastre-se ou entre", work: "Trabalho", games: "Jogos", misc: "Extras", notes: "Notas", contact: "Contato", createEmail: "Criar email", mailbox: "Email", talk: "Conversa", signIn: "Entrar", signUp: "Cadastrar", notesTitle: "Pensando agora", noteName: "Pensando agora" },
  ru: { prompt: "Зарегистрируйтесь или войдите", work: "Работы", games: "Игры", misc: "Разное", notes: "Заметки", contact: "Контакт", createEmail: "Создать почту", mailbox: "Почта", talk: "Чат", signIn: "Войти", signUp: "Регистрация", notesTitle: "Сейчас думаю", noteName: "Сейчас думаю" },
  ar: { prompt: "يرجى التسجيل أو تسجيل الدخول", work: "الأعمال", games: "الألعاب", misc: "أخرى", notes: "ملاحظات", contact: "تواصل", createEmail: "إنشاء بريد", mailbox: "البريد", talk: "الدردشة", signIn: "دخول", signUp: "تسجيل", notesTitle: "أفكر الآن", noteName: "أفكر الآن" },
};

const languageButtonSvg = `
  <svg class="language-mark" viewBox="0 0 42 36" role="img" aria-hidden="true" focusable="false">
    <text class="language-mark-a" x="16" y="28">A</text>
    <text class="language-mark-zh" x="25" y="14">中</text>
  </svg>`;

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

function renderSignedInHero(name) {
  currentHeroName = name;
  heroTitle.innerHTML = `Hi, <a class="hero-name-link" href="/profile/">${escapeHtml(name)}</a>`;
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

function applyHomeLanguage() {
  const language = languages.find((item) => item.code === currentLanguage()) || languages[0];
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;
  if (languageButton) {
    languageButton.innerHTML = languageButtonSvg;
    languageButton.setAttribute("aria-label", `Change language. Current: ${language.label}`);
  }
  const navLinks = document.querySelectorAll(".site-header nav > a");
  const navKeys = ["work", "games", "misc", "notes", "contact", "createEmail", "mailbox", "talk", "signIn", "signUp"];
  navKeys.forEach((key, index) => { if (navLinks[index]) navLinks[index].textContent = textFor(key); });
  if (heroTitle?.classList.contains("hero-prompt")) heroTitle.textContent = textFor("prompt");
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
  const note = document.querySelector(".note-list a");
  if (note) { note.querySelector("span").textContent = textFor("noteName"); note.querySelector("strong").textContent = textFor("noteText"); }
  languageMenu?.querySelectorAll(".language-option").forEach((option) => {
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
  if (!languageButton || !languageMenu) return;
  languageMenu.innerHTML = languages.map((language) => `<button class="language-option" type="button" role="option" data-lang="${language.code}">${language.label}</button>`).join("");
  languageButton.addEventListener("click", () => {
    const isOpen = !languageMenu.hidden;
    languageMenu.hidden = isOpen;
    languageButton.setAttribute("aria-expanded", isOpen ? "false" : "true");
  });
  languageMenu.addEventListener("click", (event) => {
    const option = event.target.closest("[data-lang]");
    if (!option) return;
    setLanguage(option.dataset.lang);
    languageMenu.hidden = true;
    languageButton.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#language-switcher")) {
      languageMenu.hidden = true;
      languageButton.setAttribute("aria-expanded", "false");
    }
  });
  applyHomeLanguage();
}

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
