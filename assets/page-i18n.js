(() => {
  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "zh", label: "中文", dir: "ltr" },
    { code: "ja", label: "日本語", dir: "ltr" },
    { code: "ko", label: "한국어", dir: "ltr" },
    { code: "es", label: "Español", dir: "ltr" },
    { code: "fr", label: "Français", dir: "ltr" },
    { code: "de", label: "Deutsch", dir: "ltr" },
    { code: "pt", label: "Português", dir: "ltr" },
    { code: "ru", label: "Русский", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
  ];

  const text = {
    en: {
      home: "Home", backHome: "Back home", backNotes: "Back to notes", built: "Built for Cloudflare Pages.", notes: "Notes",
      notesTitle: "Recently thinking about.", notesMeta: "Version notes, project notes, and things currently being built.",
      nowThinking: "Now thinking about", nowThinkingText: "Version notes, recent deploys, and what this site is becoming.",
      localtalkTitle: "How LocalTalk works", localtalkText: "A small guide to rooms, signed chat, files, and moderation.",
      mailboxTitle: "Mailbox version history", mailboxText: "How Muye mail changed from email creation to safer sending.",
      buildingTitle: "Now building", buildingText: "Games: small, touch-friendly play without scores or pressure.",
      captchaEyebrow: "Muye Security", captchaTitle: "CAPTCHA test", captchaHint: "Complete the challenge, then test the server verification.", captchaButton: "Test CAPTCHA", checking: "checking...",
      localtalkH1: "How LocalTalk works.", rooms: "Rooms", signedChat: "Signed Chat", filesMessages: "Files And Messages", moderation: "Moderation", language: "Language",
      mailboxH1: "Mailbox version history.", creationRules: "Creation Rules", olderPaths: "Older Paths Removed",
      gamesH1: "Games.", currentSet: "Current Set", designRules: "Design Rules", nextIdeas: "Next Ideas",
      thinkingH1: "Muye.dev is now v2.7.0.", versionList: "Version List", deployNotes: "Deploy Notes", nowThinkingHead: "Now Thinking About",
    },
    zh: {
      home: "主页", backHome: "返回主页", backNotes: "返回笔记", built: "为 Cloudflare Pages 构建。", notes: "笔记",
      notesTitle: "最近在想。", notesMeta: "版本记录、项目笔记和正在构建的东西。",
      nowThinking: "现在在想", nowThinkingText: "版本记录、最近部署和这个网站正在变成什么。",
      localtalkTitle: "LocalTalk 如何工作", localtalkText: "关于房间、登录聊天、文件和管理的小指南。",
      mailboxTitle: "邮箱版本记录", mailboxText: "Muye 邮箱如何从创建邮箱变到更安全地发送。",
      buildingTitle: "正在构建", buildingText: "游戏：小巧、适合触屏、没有分数压力。",
      captchaEyebrow: "Muye 安全", captchaTitle: "验证码测试", captchaHint: "完成挑战，然后测试服务器验证。", captchaButton: "测试验证码", checking: "检查中...",
      localtalkH1: "LocalTalk 如何工作。", rooms: "房间", signedChat: "登录聊天", filesMessages: "文件和消息", moderation: "管理", language: "语言",
      mailboxH1: "邮箱版本记录。", creationRules: "创建规则", olderPaths: "已移除的旧路径",
      gamesH1: "游戏。", currentSet: "当前集合", designRules: "设计规则", nextIdeas: "下一步想法",
      thinkingH1: "Muye.dev 现在是 v2.7.0。", versionList: "版本列表", deployNotes: "部署记录", nowThinkingHead: "现在在想",
    },
    ja: {
      home: "ホーム", backHome: "ホームへ戻る", backNotes: "ノートへ戻る", built: "Cloudflare Pages 用に構築。", notes: "ノート",
      notesTitle: "最近考えていること。", notesMeta: "バージョンノート、プロジェクトノート、現在作っているもの。",
      nowThinking: "今考えていること", nowThinkingText: "バージョンノート、最近のデプロイ、このサイトの変化。",
      localtalkTitle: "LocalTalkの仕組み", localtalkText: "部屋、ログインチャット、ファイル、管理の小さなガイド。",
      mailboxTitle: "メール履歴", mailboxText: "Muyeメールが作成から安全な送信までどう変わったか。",
      buildingTitle: "制作中", buildingText: "ゲーム：小さく、タッチしやすく、スコアの圧がない遊び。",
      captchaEyebrow: "Muye セキュリティ", captchaTitle: "CAPTCHAテスト", captchaHint: "チャレンジを完了して、サーバー検証をテストします。", captchaButton: "CAPTCHAをテスト", checking: "確認中...",
      localtalkH1: "LocalTalkの仕組み。", rooms: "部屋", signedChat: "ログインチャット", filesMessages: "ファイルとメッセージ", moderation: "管理", language: "言語",
      mailboxH1: "メール履歴。", creationRules: "作成ルール", olderPaths: "削除された古い経路",
      gamesH1: "ゲーム。", currentSet: "現在のセット", designRules: "デザインルール", nextIdeas: "次のアイデア",
      thinkingH1: "Muye.dev は v2.7.0 です。", versionList: "バージョン一覧", deployNotes: "デプロイ記録", nowThinkingHead: "今考えていること",
    },
    ko: {
      home: "홈", backHome: "홈으로", backNotes: "노트로 돌아가기", built: "Cloudflare Pages용으로 제작.", notes: "노트",
      notesTitle: "요즘 생각하는 것.", notesMeta: "버전 노트, 프로젝트 노트, 지금 만드는 것들.",
      nowThinking: "지금 생각하는 것", nowThinkingText: "버전 노트, 최근 배포, 이 사이트가 되어가는 모습.",
      localtalkTitle: "LocalTalk 작동 방식", localtalkText: "방, 로그인 채팅, 파일, 관리에 대한 작은 안내.",
      mailboxTitle: "메일함 버전 기록", mailboxText: "Muye 메일이 생성에서 더 안전한 발송까지 바뀐 과정.",
      buildingTitle: "지금 만드는 것", buildingText: "게임: 작고 터치 친화적이며 점수 압박 없는 플레이.",
      captchaEyebrow: "Muye 보안", captchaTitle: "CAPTCHA 테스트", captchaHint: "챌린지를 완료한 뒤 서버 검증을 테스트하세요.", captchaButton: "CAPTCHA 테스트", checking: "확인 중...",
      localtalkH1: "LocalTalk 작동 방식.", rooms: "방", signedChat: "로그인 채팅", filesMessages: "파일과 메시지", moderation: "관리", language: "언어",
      mailboxH1: "메일함 버전 기록.", creationRules: "생성 규칙", olderPaths: "삭제된 이전 경로",
      gamesH1: "게임.", currentSet: "현재 목록", designRules: "디자인 규칙", nextIdeas: "다음 아이디어",
      thinkingH1: "Muye.dev는 v2.7.0입니다.", versionList: "버전 목록", deployNotes: "배포 기록", nowThinkingHead: "지금 생각하는 것",
    },
    es: {
      home: "Inicio", backHome: "Volver al inicio", backNotes: "Volver a notas", built: "Hecho para Cloudflare Pages.", notes: "Notas",
      notesTitle: "Pensando ahora.", notesMeta: "Notas de versión, notas de proyecto y cosas en construcción.",
      nowThinking: "Ahora pensando", nowThinkingText: "Notas de versión, despliegues recientes y en qué se está convirtiendo este sitio.",
      localtalkTitle: "Cómo funciona LocalTalk", localtalkText: "Guía breve de salas, chat con sesión, archivos y moderación.",
      mailboxTitle: "Historial del correo", mailboxText: "Cómo Muye mail pasó de crear emails a enviar con más seguridad.",
      buildingTitle: "Construyendo", buildingText: "Juegos: pequeños, táctiles y sin presión de puntuación.",
      captchaEyebrow: "Seguridad Muye", captchaTitle: "Prueba CAPTCHA", captchaHint: "Completa el reto y prueba la verificación del servidor.", captchaButton: "Probar CAPTCHA", checking: "comprobando...",
      localtalkH1: "Cómo funciona LocalTalk.", rooms: "Salas", signedChat: "Chat con sesión", filesMessages: "Archivos y mensajes", moderation: "Moderación", language: "Idioma",
      mailboxH1: "Historial del correo.", creationRules: "Reglas de creación", olderPaths: "Rutas antiguas eliminadas",
      gamesH1: "Juegos.", currentSet: "Conjunto actual", designRules: "Reglas de diseño", nextIdeas: "Próximas ideas",
      thinkingH1: "Muye.dev ahora es v2.7.0.", versionList: "Lista de versiones", deployNotes: "Notas de despliegue", nowThinkingHead: "Pensando ahora",
    },
  };
  ["fr", "de", "pt", "ru", "ar"].forEach((code) => { text[code] = { ...text.es, ...(code === "fr" ? { home: "Accueil", notes: "Notes", captchaTitle: "Test CAPTCHA", captchaButton: "Tester CAPTCHA" } : {}), ...(code === "de" ? { home: "Start", notes: "Notizen", captchaTitle: "CAPTCHA-Test", captchaButton: "CAPTCHA testen" } : {}), ...(code === "pt" ? { home: "Início", notes: "Notas", captchaTitle: "Teste CAPTCHA", captchaButton: "Testar CAPTCHA" } : {}), ...(code === "ru" ? { home: "Главная", notes: "Заметки", captchaTitle: "Проверка CAPTCHA", captchaButton: "Проверить CAPTCHA" } : {}), ...(code === "ar" ? { home: "الرئيسية", notes: "ملاحظات", captchaTitle: "اختبار CAPTCHA", captchaButton: "اختبار CAPTCHA" } : {}) }; });

  function lang() {
    const saved = localStorage.getItem("muye-lang") || localStorage.getItem("localtalk-lang") || "en";
    return languages.some((item) => item.code === saved) ? saved : "en";
  }

  function t(key) {
    return text[lang()]?.[key] || text.en[key] || key;
  }

  function apply() {
    const language = languages.find((item) => item.code === lang()) || languages[0];
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-footer-built]").forEach((node) => { node.textContent = t("built"); });
    document.querySelectorAll("[data-page-language-button]").forEach((button) => {
      button.textContent = language.code === "zh" ? "中A" : "A中";
      button.setAttribute("aria-label", `Change language. Current: ${language.label}`);
    });
  }

  function installLanguageButton() {
    if (document.querySelector("[data-page-language-button]")) return;
    const target = document.querySelector("footer") || document.body;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-button";
    button.dataset.pageLanguageButton = "";
    button.addEventListener("click", () => {
      const current = lang();
      const index = languages.findIndex((item) => item.code === current);
      const next = languages[(index + 1) % languages.length] || languages[0];
      localStorage.setItem("muye-lang", next.code);
      localStorage.setItem("localtalk-lang", next.code === "zh" ? "zh" : "en");
      window.dispatchEvent(new CustomEvent("muye-language-change", { detail: { lang: next.code } }));
      apply();
    });
    target.appendChild(button);
  }

  window.MuyePageI18n = { apply, t };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { installLanguageButton(); apply(); });
  else { installLanguageButton(); apply(); }
  window.addEventListener("storage", apply);
  window.addEventListener("muye-language-change", apply);
})();
