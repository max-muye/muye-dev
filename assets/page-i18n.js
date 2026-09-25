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
      thinkingH1: "Muye.dev is now v2.9.7.", versionList: "Version List", deployNotes: "Deploy Notes", nowThinkingHead: "Now Thinking About",
      lockAnswerUpdate: "Gave Locks 5 and 6 distinct word answers and updated their encoded clues.",
      lockAnswerDeploy: "September 25, 2026: Updated the advanced lock answers and bumped the site to v2.9.7.",
      secretPuzzleUpdate: "Expanded the hidden puzzle path with distinct binary, XOR, and remainder challenges.",
      secretPuzzleDeploy: "September 25, 2026: Expanded the hidden puzzle path and bumped the site to v2.9.6.",
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
      thinkingH1: "Muye.dev 现在是 v2.9.7。", versionList: "版本列表", deployNotes: "部署记录", nowThinkingHead: "现在在想",
      lockAnswerUpdate: "为锁 5 和锁 6 设置了不同的单词答案，并更新了编码线索。",
      lockAnswerDeploy: "2026 年 9 月 25 日：更新了高级锁答案，并将网站升级到 v2.9.7。",
      secretPuzzleUpdate: "扩展了隐藏谜题路径，加入答案各不相同的二进制、异或和余数挑战。",
      secretPuzzleDeploy: "2026 年 9 月 25 日：扩展了隐藏谜题路径，并将网站升级到 v2.9.6。",
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
      thinkingH1: "Muye.dev は v2.9.7 です。", versionList: "バージョン一覧", deployNotes: "デプロイ記録", nowThinkingHead: "今考えていること",
      lockAnswerUpdate: "ロック5と6に異なる単語の答えを設定し、暗号化された手掛かりを更新しました。",
      lockAnswerDeploy: "2026年9月25日：高度なロックの答えを更新し、サイトを v2.9.7 にしました。",
      secretPuzzleUpdate: "隠しパズルに、答えが異なるバイナリ、XOR、剰余の課題を追加しました。",
      secretPuzzleDeploy: "2026年9月25日：隠しパズルを拡張し、サイトを v2.9.6 に更新しました。",
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
      thinkingH1: "Muye.dev는 v2.9.7입니다.", versionList: "버전 목록", deployNotes: "배포 기록", nowThinkingHead: "지금 생각하는 것",
      lockAnswerUpdate: "잠금 5와 6에 서로 다른 단어 답을 설정하고 인코딩된 단서를 갱신했습니다.",
      lockAnswerDeploy: "2026년 9월 25일: 고급 잠금 답을 갱신하고 사이트를 v2.9.7로 올렸습니다.",
      secretPuzzleUpdate: "서로 다른 답을 가진 이진수, XOR, 나머지 도전으로 숨겨진 퍼즐 경로를 확장했습니다.",
      secretPuzzleDeploy: "2026년 9월 25일: 숨겨진 퍼즐 경로를 확장하고 사이트를 v2.9.6으로 올렸습니다.",
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
      thinkingH1: "Muye.dev ahora es v2.9.7.", versionList: "Lista de versiones", deployNotes: "Notas de despliegue", nowThinkingHead: "Pensando ahora",
      lockAnswerUpdate: "Dimos respuestas de palabras distintas a los bloqueos 5 y 6 y actualizamos sus pistas codificadas.",
      lockAnswerDeploy: "25 de septiembre de 2026: actualizamos las respuestas avanzadas y el sitio a v2.9.7.",
      secretPuzzleUpdate: "Ampliamos la ruta de acertijos oculta con desafíos distintos de binario, XOR y restos.",
      secretPuzzleDeploy: "25 de septiembre de 2026: ampliamos la ruta de acertijos oculta y actualizamos el sitio a v2.9.6.",
    },
  };
  ["fr", "de", "pt", "ru", "ar"].forEach((code) => { text[code] = { ...text.es, ...(code === "fr" ? { home: "Accueil", notes: "Notes", captchaTitle: "Test CAPTCHA", captchaButton: "Tester CAPTCHA", thinkingH1: "Muye.dev est maintenant en v2.9.6.", secretPuzzleUpdate: "Le parcours secret comprend maintenant des défis binaires, XOR et de restes avec des réponses distinctes.", secretPuzzleDeploy: "25 septembre 2026 : parcours secret enrichi et site mis à jour en v2.9.6." } : {}), ...(code === "de" ? { home: "Start", notes: "Notizen", captchaTitle: "CAPTCHA-Test", captchaButton: "CAPTCHA testen", thinkingH1: "Muye.dev ist jetzt v2.9.6.", secretPuzzleUpdate: "Der versteckte Rätselpfad enthält jetzt unterschiedliche Binär-, XOR- und Restaufgaben.", secretPuzzleDeploy: "25. September 2026: Versteckten Rätselpfad erweitert und die Website auf v2.9.6 aktualisiert." } : {}), ...(code === "pt" ? { home: "Início", notes: "Notas", captchaTitle: "Teste CAPTCHA", captchaButton: "Testar CAPTCHA", thinkingH1: "Muye.dev agora está na v2.9.6.", secretPuzzleUpdate: "O caminho secreto ganhou desafios distintos de binário, XOR e restos.", secretPuzzleDeploy: "25 de setembro de 2026: ampliamos o caminho secreto e atualizamos o site para v2.9.6." } : {}), ...(code === "ru" ? { home: "Главная", notes: "Заметки", captchaTitle: "Проверка CAPTCHA", captchaButton: "Проверить CAPTCHA", thinkingH1: "Muye.dev теперь версии v2.9.6.", secretPuzzleUpdate: "Скрытая цепочка дополнена разными задачами на двоичный код, XOR и остатки.", secretPuzzleDeploy: "25 сентября 2026 г.: расширена скрытая цепочка задач, сайт обновлён до v2.9.6." } : {}), ...(code === "ar" ? { home: "الرئيسية", notes: "ملاحظات", captchaTitle: "اختبار CAPTCHA", captchaButton: "اختبار CAPTCHA", thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.9.6.", secretPuzzleUpdate: "تم توسيع مسار الألغاز المخفي بتحديات مختلفة للثنائي وXOR والبواقي.", secretPuzzleDeploy: "25 سبتمبر 2026: تم توسيع مسار الألغاز المخفي وتحديث الموقع إلى v2.9.6." } : {}) }; });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.9.7.", lockAnswerUpdate: "Les verrous 5 et 6 ont maintenant des réponses distinctes et des indices codés mis à jour.", lockAnswerDeploy: "25 septembre 2026 : réponses des verrous avancés mises à jour et site passé en v2.9.7." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.9.7.", lockAnswerUpdate: "Sperre 5 und 6 haben jetzt unterschiedliche Wortantworten und aktualisierte codierte Hinweise.", lockAnswerDeploy: "25. September 2026: Antworten der erweiterten Sperren aktualisiert und Website auf v2.9.7 angehoben." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.9.7.", lockAnswerUpdate: "Os bloqueios 5 e 6 agora têm respostas diferentes e pistas codificadas atualizadas.", lockAnswerDeploy: "25 de setembro de 2026: atualizamos as respostas avançadas e o site para v2.9.7." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.9.7.", lockAnswerUpdate: "Блокировки 5 и 6 получили разные словесные ответы и обновлённые кодированные подсказки.", lockAnswerDeploy: "25 сентября 2026 г.: обновлены ответы сложных блокировок, сайт обновлён до v2.9.7." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.9.7.", lockAnswerUpdate: "أصبح للقفلين 5 و6 إجابتان مختلفتان مع تحديث التلميحات المشفرة.", lockAnswerDeploy: "25 سبتمبر 2026: تم تحديث إجابات الأقفال المتقدمة وترقية الموقع إلى v2.9.7." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.9.8.", asciiToolUpdate: "Added an ASCII converter and a puzzle help popup that preserves secret progress.", asciiToolDeploy: "September 25, 2026: Added the ASCII converter and secret help popup, then bumped the site to v2.9.8." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.9.8。", asciiToolUpdate: "新增 ASCII 转换器和不会丢失秘密谜题进度的帮助弹窗。", asciiToolDeploy: "2026 年 9 月 25 日：新增 ASCII 转换器和秘密谜题帮助弹窗，并将网站升级到 v2.9.8。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.9.8 です。", asciiToolUpdate: "ASCII変換ツールと、秘密の進行を保つヘルプポップアップを追加しました。", asciiToolDeploy: "2026年9月25日：ASCII変換ツールと秘密のヘルプを追加し、サイトを v2.9.8 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.9.8입니다.", asciiToolUpdate: "ASCII 변환기와 비밀 퍼즐 진행을 유지하는 도움말 팝업을 추가했습니다.", asciiToolDeploy: "2026년 9월 25일: ASCII 변환기와 비밀 도움말 팝업을 추가하고 사이트를 v2.9.8로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.9.8.", asciiToolUpdate: "Añadimos un conversor ASCII y una ayuda emergente que conserva el progreso secreto.", asciiToolDeploy: "25 de septiembre de 2026: añadimos el conversor ASCII y la ayuda secreta, y actualizamos el sitio a v2.9.8." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.9.8.", asciiToolUpdate: "Ajout d’un convertisseur ASCII et d’une aide qui conserve la progression secrète.", asciiToolDeploy: "25 septembre 2026 : ajout du convertisseur ASCII et de l’aide secrète, puis passage à v2.9.8." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.9.8.", asciiToolUpdate: "Ein ASCII-Konverter und ein Hilfefenster, das den geheimen Fortschritt bewahrt, wurden hinzugefügt.", asciiToolDeploy: "25. September 2026: ASCII-Konverter und geheime Hilfe hinzugefügt und die Website auf v2.9.8 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.9.8.", asciiToolUpdate: "Adicionamos um conversor ASCII e uma ajuda que preserva o progresso secreto.", asciiToolDeploy: "25 de setembro de 2026: adicionamos o conversor ASCII e a ajuda secreta e atualizamos o site para v2.9.8." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.9.8.", asciiToolUpdate: "Добавлены конвертер ASCII и окно помощи, сохраняющее прогресс секретных задач.", asciiToolDeploy: "25 сентября 2026 г.: добавлены конвертер ASCII и секретная помощь, сайт обновлён до v2.9.8." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.9.8.", asciiToolUpdate: "تمت إضافة محول ASCII ونافذة مساعدة تحافظ على تقدم الألغاز السرية.", asciiToolDeploy: "25 سبتمبر 2026: تمت إضافة محول ASCII والمساعدة السرية وتحديث الموقع إلى v2.9.8." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.9.9.", memorablePuzzlesUpdate: "Added three more secret locks with varied clues and memorable word answers.", memorablePuzzlesDeploy: "September 25, 2026: Added three memorable secret puzzles and bumped the site to v2.9.9." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.9.9。", memorablePuzzlesUpdate: "新增三个秘密锁，使用不同线索和容易记住的单词答案。", memorablePuzzlesDeploy: "2026 年 9 月 25 日：新增三个容易记住的秘密谜题，并将网站升级到 v2.9.9。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.9.9 です。", memorablePuzzlesUpdate: "異なる手掛かりと覚えやすい単語の答えを持つ秘密のロックを3つ追加しました。", memorablePuzzlesDeploy: "2026年9月25日：覚えやすい秘密のパズルを3つ追加し、サイトを v2.9.9 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.9.9입니다.", memorablePuzzlesUpdate: "서로 다른 단서와 기억하기 쉬운 단어 답을 가진 비밀 잠금 3개를 추가했습니다.", memorablePuzzlesDeploy: "2026년 9월 25일: 기억하기 쉬운 비밀 퍼즐 3개를 추가하고 사이트를 v2.9.9로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.9.9.", memorablePuzzlesUpdate: "Añadimos tres bloqueos secretos con pistas variadas y respuestas fáciles de recordar.", memorablePuzzlesDeploy: "25 de septiembre de 2026: añadimos tres acertijos secretos memorables y actualizamos el sitio a v2.9.9." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.9.9.", memorablePuzzlesUpdate: "Ajout de trois verrous secrets aux indices variés et aux réponses faciles à retenir.", memorablePuzzlesDeploy: "25 septembre 2026 : ajout de trois énigmes secrètes mémorables et passage à v2.9.9." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.9.9.", memorablePuzzlesUpdate: "Drei weitere geheime Sperren mit abwechslungsreichen Hinweisen und einprägsamen Wortantworten wurden hinzugefügt.", memorablePuzzlesDeploy: "25. September 2026: Drei einprägsame Geheimrätsel hinzugefügt und die Website auf v2.9.9 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.9.9.", memorablePuzzlesUpdate: "Adicionamos três bloqueios secretos com pistas variadas e respostas fáceis de lembrar.", memorablePuzzlesDeploy: "25 de setembro de 2026: adicionamos três enigmas secretos memoráveis e atualizamos o site para v2.9.9." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.9.9.", memorablePuzzlesUpdate: "Добавлены три секретные блокировки с разными подсказками и запоминающимися словами-ответами.", memorablePuzzlesDeploy: "25 сентября 2026 г.: добавлены три запоминающихся секретных задания, сайт обновлён до v2.9.9." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.9.9.", memorablePuzzlesUpdate: "تمت إضافة ثلاثة أقفال سرية بتلميحات متنوعة وإجابات سهلة التذكر.", memorablePuzzlesDeploy: "25 سبتمبر 2026: تمت إضافة ثلاثة ألغاز سرية سهلة التذكر وتحديث الموقع إلى v2.9.9." });

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
