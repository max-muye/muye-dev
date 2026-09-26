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
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.10.0.", base64ToolUpdate: "Replaced Coder with a focused Base64 encoder and decoder that runs locally in the browser.", base64ToolDeploy: "September 25, 2026: Added the Base64 tool, removed Coder, and bumped the site to v2.10.0." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.10.0。", base64ToolUpdate: "用专用的 Base64 编码和解码工具替换了编码器，所有处理都在浏览器本地完成。", base64ToolDeploy: "2026 年 9 月 25 日：新增 Base64 工具、移除编码器，并将网站升级到 v2.10.0。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.10.0 です。", base64ToolUpdate: "Coderを、ブラウザ内で動く専用のBase64エンコーダー・デコーダーに置き換えました。", base64ToolDeploy: "2026年9月25日：Base64ツールを追加し、Coderを削除して、サイトを v2.10.0 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.10.0입니다.", base64ToolUpdate: "Coder를 브라우저에서 로컬로 실행되는 전용 Base64 인코더와 디코더로 교체했습니다.", base64ToolDeploy: "2026년 9월 25일: Base64 도구를 추가하고 Coder를 제거한 뒤 사이트를 v2.10.0으로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.10.0.", base64ToolUpdate: "Sustituimos Coder por un codificador y decodificador Base64 específico que funciona localmente en el navegador.", base64ToolDeploy: "25 de septiembre de 2026: añadimos la herramienta Base64, eliminamos Coder y actualizamos el sitio a v2.10.0." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.10.0.", base64ToolUpdate: "Coder a été remplacé par un outil Base64 dédié qui fonctionne localement dans le navigateur.", base64ToolDeploy: "25 septembre 2026 : ajout de l’outil Base64, suppression de Coder et passage à v2.10.0." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.10.0.", base64ToolUpdate: "Coder wurde durch einen gezielten Base64-Kodierer und -Dekodierer ersetzt, der lokal im Browser läuft.", base64ToolDeploy: "25. September 2026: Base64-Werkzeug hinzugefügt, Coder entfernt und die Website auf v2.10.0 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.10.0.", base64ToolUpdate: "Substituímos o Coder por um codificador e decodificador Base64 dedicado que roda localmente no navegador.", base64ToolDeploy: "25 de setembro de 2026: adicionamos a ferramenta Base64, removemos o Coder e atualizamos o site para v2.10.0." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.10.0.", base64ToolUpdate: "Coder заменён отдельным инструментом Base64, который кодирует и декодирует локально в браузере.", base64ToolDeploy: "25 сентября 2026 г.: добавлен инструмент Base64, удалён Coder, сайт обновлён до v2.10.0." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.10.0.", base64ToolUpdate: "تم استبدال Coder بأداة Base64 مخصصة للترميز وفك الترميز تعمل محليًا في المتصفح.", base64ToolDeploy: "25 سبتمبر 2026: تمت إضافة أداة Base64 وإزالة Coder وتحديث الموقع إلى v2.10.0." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.10.1.", unicodeArtUpdate: "Added a browser-only image-to-Unicode-art converter with custom grid dimensions.", unicodeArtDeploy: "September 25, 2026: Added the Unicode Art tool and bumped the site to v2.10.1." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.10.1。", unicodeArtUpdate: "新增仅在浏览器中运行的图片转 Unicode 字符画工具，并支持自定义网格尺寸。", unicodeArtDeploy: "2026 年 9 月 25 日：新增 Unicode 字符画工具，并将网站升级到 v2.10.1。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.10.1 です。", unicodeArtUpdate: "ブラウザ内だけで動作し、グリッドサイズを指定できる画像からUnicodeアートへの変換ツールを追加しました。", unicodeArtDeploy: "2026年9月25日：Unicodeアートツールを追加し、サイトを v2.10.1 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.10.1입니다.", unicodeArtUpdate: "브라우저에서만 실행되며 격자 크기를 지정할 수 있는 이미지-유니코드 아트 변환기를 추가했습니다.", unicodeArtDeploy: "2026년 9월 25일: 유니코드 아트 도구를 추가하고 사이트를 v2.10.1로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.10.1.", unicodeArtUpdate: "Añadimos un conversor de imagen a arte Unicode que funciona en el navegador y permite elegir el tamaño de la cuadrícula.", unicodeArtDeploy: "25 de septiembre de 2026: añadimos la herramienta Arte Unicode y actualizamos el sitio a v2.10.1." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.10.1.", unicodeArtUpdate: "Ajout d’un convertisseur d’image en art Unicode exécuté dans le navigateur, avec dimensions de grille personnalisées.", unicodeArtDeploy: "25 septembre 2026 : ajout de l’outil Art Unicode et passage du site à v2.10.1." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.10.1.", unicodeArtUpdate: "Ein lokaler Bild-zu-Unicode-Kunst-Konverter mit frei wählbarer Rastergröße wurde hinzugefügt.", unicodeArtDeploy: "25. September 2026: Unicode-Kunst-Werkzeug hinzugefügt und die Website auf v2.10.1 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.10.1.", unicodeArtUpdate: "Adicionamos um conversor de imagem em arte Unicode que roda no navegador e aceita dimensões personalizadas.", unicodeArtDeploy: "25 de setembro de 2026: adicionamos a ferramenta Arte Unicode e atualizamos o site para v2.10.1." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.10.1.", unicodeArtUpdate: "Добавлен работающий в браузере конвертер изображения в Unicode-арт с настраиваемым размером сетки.", unicodeArtDeploy: "25 сентября 2026 г.: добавлен инструмент Unicode-арт, сайт обновлён до v2.10.1." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.10.1.", unicodeArtUpdate: "تمت إضافة محول من الصور إلى فن Unicode يعمل داخل المتصفح مع أبعاد شبكة مخصصة.", unicodeArtDeploy: "25 سبتمبر 2026: تمت إضافة أداة فن Unicode وتحديث الموقع إلى v2.10.1." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.10.2.", unicodeViewerUpdate: "Added a Unicode art viewer with file and paste input, zoom controls, and W/A/S/D movement.", unicodeViewerDeploy: "September 25, 2026: Added the Unicode Viewer and bumped the site to v2.10.2." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.10.2。", unicodeViewerUpdate: "新增 Unicode 字符画查看器，支持文件和粘贴输入、缩放控制以及 W/A/S/D 移动。", unicodeViewerDeploy: "2026 年 9 月 25 日：新增 Unicode 查看器，并将网站升级到 v2.10.2。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.10.2 です。", unicodeViewerUpdate: "ファイル・貼り付け入力、ズーム操作、W/A/S/D移動に対応したUnicodeアートビューアーを追加しました。", unicodeViewerDeploy: "2026年9月25日：Unicodeビューアーを追加し、サイトを v2.10.2 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.10.2입니다.", unicodeViewerUpdate: "파일 및 붙여넣기 입력, 확대·축소, W/A/S/D 이동을 지원하는 유니코드 아트 뷰어를 추가했습니다.", unicodeViewerDeploy: "2026년 9월 25일: 유니코드 뷰어를 추가하고 사이트를 v2.10.2로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.10.2.", unicodeViewerUpdate: "Añadimos un visor de arte Unicode con carga de archivos, pegado, zoom y movimiento con W/A/S/D.", unicodeViewerDeploy: "25 de septiembre de 2026: añadimos el Visor Unicode y actualizamos el sitio a v2.10.2." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.10.2.", unicodeViewerUpdate: "Ajout d’une visionneuse d’art Unicode avec fichier, collage, zoom et déplacement W/A/S/D.", unicodeViewerDeploy: "25 septembre 2026 : ajout de la Visionneuse Unicode et passage du site à v2.10.2." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.10.2.", unicodeViewerUpdate: "Ein Unicode-Kunst-Betrachter mit Datei- und Texteingabe, Zoom und W/A/S/D-Bewegung wurde hinzugefügt.", unicodeViewerDeploy: "25. September 2026: Unicode-Betrachter hinzugefügt und die Website auf v2.10.2 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.10.2.", unicodeViewerUpdate: "Adicionamos um visualizador de arte Unicode com arquivo, colagem, zoom e movimento W/A/S/D.", unicodeViewerDeploy: "25 de setembro de 2026: adicionamos o Visualizador Unicode e atualizamos o site para v2.10.2." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.10.2.", unicodeViewerUpdate: "Добавлен просмотр Unicode-арта с загрузкой файла, вставкой текста, масштабом и движением W/A/S/D.", unicodeViewerDeploy: "25 сентября 2026 г.: добавлен просмотр Unicode, сайт обновлён до v2.10.2." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.10.2.", unicodeViewerUpdate: "تمت إضافة عارض لفن Unicode يدعم الملفات واللصق والتكبير والتحريك بمفاتيح W/A/S/D.", unicodeViewerDeploy: "25 سبتمبر 2026: تمت إضافة عارض Unicode وتحديث الموقع إلى v2.10.2." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.10.3.", unlimitedViewerZoomUpdate: "Removed the Unicode Viewer zoom limits.", unlimitedViewerZoomDeploy: "September 25, 2026: Removed the Unicode Viewer zoom limits and bumped the site to v2.10.3." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.10.3。", unlimitedViewerZoomUpdate: "移除了 Unicode 查看器的缩放限制。", unlimitedViewerZoomDeploy: "2026 年 9 月 25 日：移除 Unicode 查看器缩放限制，并将网站升级到 v2.10.3。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.10.3 です。", unlimitedViewerZoomUpdate: "Unicodeビューアーのズーム制限を削除しました。", unlimitedViewerZoomDeploy: "2026年9月25日：Unicodeビューアーのズーム制限を削除し、サイトを v2.10.3 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.10.3입니다.", unlimitedViewerZoomUpdate: "유니코드 뷰어의 확대·축소 제한을 제거했습니다.", unlimitedViewerZoomDeploy: "2026년 9월 25일: 유니코드 뷰어 확대·축소 제한을 제거하고 사이트를 v2.10.3으로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.10.3.", unlimitedViewerZoomUpdate: "Eliminamos los límites de zoom del Visor Unicode.", unlimitedViewerZoomDeploy: "25 de septiembre de 2026: eliminamos los límites de zoom del Visor Unicode y actualizamos el sitio a v2.10.3." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.10.3.", unlimitedViewerZoomUpdate: "Suppression des limites de zoom de la Visionneuse Unicode.", unlimitedViewerZoomDeploy: "25 septembre 2026 : suppression des limites de zoom et passage du site à v2.10.3." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.10.3.", unlimitedViewerZoomUpdate: "Die Zoomgrenzen des Unicode-Betrachters wurden entfernt.", unlimitedViewerZoomDeploy: "25. September 2026: Zoomgrenzen entfernt und die Website auf v2.10.3 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.10.3.", unlimitedViewerZoomUpdate: "Removemos os limites de zoom do Visualizador Unicode.", unlimitedViewerZoomDeploy: "25 de setembro de 2026: removemos os limites de zoom e atualizamos o site para v2.10.3." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.10.3.", unlimitedViewerZoomUpdate: "Ограничения масштаба в просмотре Unicode удалены.", unlimitedViewerZoomDeploy: "25 сентября 2026 г.: ограничения масштаба удалены, сайт обновлён до v2.10.3." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.10.3.", unlimitedViewerZoomUpdate: "تمت إزالة حدود التكبير والتصغير من عارض Unicode.", unlimitedViewerZoomDeploy: "25 سبتمبر 2026: تمت إزالة حدود التكبير والتصغير وتحديث الموقع إلى v2.10.3." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.11.0.", colorUnicodeUpdate: "Added a color mode to Unicode Art using portable colored Unicode symbols.", colorUnicodeDeploy: "September 25, 2026: Added color Unicode art and bumped the site to v2.11.0." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.11.0。", colorUnicodeUpdate: "Unicode 字符画新增彩色模式，使用可复制的彩色 Unicode 符号。", colorUnicodeDeploy: "2026 年 9 月 25 日：新增彩色 Unicode 字符画，并将网站升级到 v2.11.0。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.11.0 です。", colorUnicodeUpdate: "コピー可能なカラーUnicode記号を使うカラーモードをUnicodeアートに追加しました。", colorUnicodeDeploy: "2026年9月25日：カラーUnicodeアートを追加し、サイトを v2.11.0 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.11.0입니다.", colorUnicodeUpdate: "복사 가능한 컬러 유니코드 기호를 사용하는 컬러 모드를 유니코드 아트에 추가했습니다.", colorUnicodeDeploy: "2026년 9월 25일: 컬러 유니코드 아트를 추가하고 사이트를 v2.11.0으로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.11.0.", colorUnicodeUpdate: "Añadimos a Arte Unicode un modo de color con símbolos Unicode de colores que se pueden copiar.", colorUnicodeDeploy: "25 de septiembre de 2026: añadimos arte Unicode en color y actualizamos el sitio a v2.11.0." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.11.0.", colorUnicodeUpdate: "Ajout d’un mode couleur à Art Unicode avec des symboles Unicode colorés et copiables.", colorUnicodeDeploy: "25 septembre 2026 : ajout de l’art Unicode en couleur et passage du site à v2.11.0." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.11.0.", colorUnicodeUpdate: "Unicode-Kunst hat jetzt einen Farbmodus mit kopierbaren farbigen Unicode-Symbolen.", colorUnicodeDeploy: "25. September 2026: Farbige Unicode-Kunst hinzugefügt und die Website auf v2.11.0 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.11.0.", colorUnicodeUpdate: "Adicionamos à Arte Unicode um modo colorido com símbolos Unicode coloridos e copiáveis.", colorUnicodeDeploy: "25 de setembro de 2026: adicionamos arte Unicode colorida e atualizamos o site para v2.11.0." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.11.0.", colorUnicodeUpdate: "В Unicode-арт добавлен цветной режим с переносимыми цветными символами Unicode.", colorUnicodeDeploy: "25 сентября 2026 г.: добавлен цветной Unicode-арт, сайт обновлён до v2.11.0." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.11.0.", colorUnicodeUpdate: "تمت إضافة وضع ملون إلى فن Unicode باستخدام رموز Unicode ملونة قابلة للنسخ.", colorUnicodeDeploy: "25 سبتمبر 2026: تمت إضافة فن Unicode الملون وتحديث الموقع إلى v2.11.0." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.12.0.", moreSecretLevelsUpdate: "Extended the secret path through Lock 16 with six new cipher puzzles and memorable answers.", moreSecretLevelsDeploy: "September 26, 2026: Added Locks 11–16 to the secret puzzle and bumped the site to v2.12.0." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.12.0。", moreSecretLevelsUpdate: "将秘密路径扩展到锁 16，新增六个密码谜题和容易记住的答案。", moreSecretLevelsDeploy: "2026 年 9 月 26 日：为秘密谜题新增锁 11–16，并将网站升级到 v2.12.0。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.12.0 です。", moreSecretLevelsUpdate: "6つの新しい暗号パズルと覚えやすい答えを追加し、秘密の道をロック16まで拡張しました。", moreSecretLevelsDeploy: "2026年9月26日：秘密のパズルにロック11～16を追加し、サイトを v2.12.0 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.12.0입니다.", moreSecretLevelsUpdate: "새 암호 퍼즐 6개와 기억하기 쉬운 답으로 비밀 경로를 잠금 16까지 확장했습니다.", moreSecretLevelsDeploy: "2026년 9월 26일: 비밀 퍼즐에 잠금 11–16을 추가하고 사이트를 v2.12.0으로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.12.0.", moreSecretLevelsUpdate: "Ampliamos la ruta secreta hasta el Bloqueo 16 con seis nuevos enigmas de cifrado y respuestas fáciles de recordar.", moreSecretLevelsDeploy: "26 de septiembre de 2026: añadimos los Bloqueos 11–16 al enigma secreto y actualizamos el sitio a v2.12.0." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.12.0.", moreSecretLevelsUpdate: "Le parcours secret va maintenant jusqu’au verrou 16 avec six nouvelles énigmes de chiffrement et des réponses mémorables.", moreSecretLevelsDeploy: "26 septembre 2026 : ajout des verrous 11 à 16 au puzzle secret et passage du site à v2.12.0." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.12.0.", moreSecretLevelsUpdate: "Der geheime Pfad reicht nun mit sechs neuen Chiffren und einprägsamen Antworten bis Sperre 16.", moreSecretLevelsDeploy: "26. September 2026: Sperren 11–16 hinzugefügt und die Website auf v2.12.0 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.12.0.", moreSecretLevelsUpdate: "Estendemos o caminho secreto até o Bloqueio 16 com seis novos enigmas de cifra e respostas fáceis de lembrar.", moreSecretLevelsDeploy: "26 de setembro de 2026: adicionamos os Bloqueios 11–16 ao enigma secreto e atualizamos o site para v2.12.0." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.12.0.", moreSecretLevelsUpdate: "Секретный путь продлён до блокировки 16: добавлены шесть новых шифров с запоминающимися ответами.", moreSecretLevelsDeploy: "26 сентября 2026 г.: добавлены блокировки 11–16, сайт обновлён до v2.12.0." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.12.0.", moreSecretLevelsUpdate: "تم تمديد المسار السري حتى القفل 16 بستة ألغاز تشفير جديدة وإجابات سهلة التذكر.", moreSecretLevelsDeploy: "26 سبتمبر 2026: تمت إضافة الأقفال 11–16 إلى اللغز السري وتحديث الموقع إلى v2.12.0." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.12.1.", asciiHexFixUpdate: "Fixed ASCII decoding so one hexadecimal sequence uses the same format for every value.", asciiHexFixDeploy: "September 26, 2026: Fixed hexadecimal ASCII decoding and bumped the site to v2.12.1." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.12.1。", asciiHexFixUpdate: "修复了 ASCII 解码，使同一十六进制序列中的每个值使用相同格式。", asciiHexFixDeploy: "2026 年 9 月 26 日：修复十六进制 ASCII 解码，并将网站升级到 v2.12.1。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.12.1 です。", asciiHexFixUpdate: "1つの16進数列に含まれるすべての値を同じ形式で解釈するよう、ASCII復号を修正しました。", asciiHexFixDeploy: "2026年9月26日：16進ASCII復号を修正し、サイトを v2.12.1 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.12.1입니다.", asciiHexFixUpdate: "하나의 16진수 시퀀스에 있는 모든 값이 같은 형식을 사용하도록 ASCII 해독을 수정했습니다.", asciiHexFixDeploy: "2026년 9월 26일: 16진수 ASCII 해독을 수정하고 사이트를 v2.12.1로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.12.1.", asciiHexFixUpdate: "Corregimos la decodificación ASCII para que todos los valores de una secuencia hexadecimal usen el mismo formato.", asciiHexFixDeploy: "26 de septiembre de 2026: corregimos la decodificación ASCII hexadecimal y actualizamos el sitio a v2.12.1." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.12.1.", asciiHexFixUpdate: "Correction du décodage ASCII afin que toutes les valeurs d’une séquence hexadécimale utilisent le même format.", asciiHexFixDeploy: "26 septembre 2026 : correction du décodage ASCII hexadécimal et passage du site à v2.12.1." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.12.1.", asciiHexFixUpdate: "Die ASCII-Dekodierung verwendet nun für alle Werte einer Hexadezimalfolge dasselbe Format.", asciiHexFixDeploy: "26. September 2026: Hexadezimale ASCII-Dekodierung korrigiert und die Website auf v2.12.1 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.12.1.", asciiHexFixUpdate: "Corrigimos a decodificação ASCII para que todos os valores de uma sequência hexadecimal usem o mesmo formato.", asciiHexFixDeploy: "26 de setembro de 2026: corrigimos a decodificação ASCII hexadecimal e atualizamos o site para v2.12.1." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.12.1.", asciiHexFixUpdate: "Исправлено декодирование ASCII: все значения одной шестнадцатеричной последовательности теперь используют единый формат.", asciiHexFixDeploy: "26 сентября 2026 г.: исправлено шестнадцатеричное декодирование ASCII, сайт обновлён до v2.12.1." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.12.1.", asciiHexFixUpdate: "تم إصلاح فك ترميز ASCII لكي تستخدم جميع قيم التسلسل السداسي عشري التنسيق نفسه.", asciiHexFixDeploy: "26 سبتمبر 2026: تم إصلاح فك ترميز ASCII السداسي عشري وتحديث الموقع إلى v2.12.1." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.13.0.", clearSecretLevelsUpdate: "Added Locks 17–20 with their solving methods shown clearly on each puzzle.", clearSecretLevelsDeploy: "September 26, 2026: Added four clearly explained secret locks and bumped the site to v2.13.0." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.13.0。", clearSecretLevelsUpdate: "新增锁 17–20，并在每个谜题上清楚显示解题方法。", clearSecretLevelsDeploy: "2026 年 9 月 26 日：新增四个说明清晰的秘密锁，并将网站升级到 v2.13.0。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.13.0 です。", clearSecretLevelsUpdate: "解き方を各パズルに明示したロック17～20を追加しました。", clearSecretLevelsDeploy: "2026年9月26日：説明が明確な秘密のロックを4つ追加し、サイトを v2.13.0 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.13.0입니다.", clearSecretLevelsUpdate: "각 퍼즐에 풀이 방법이 명확히 표시된 잠금 17–20을 추가했습니다.", clearSecretLevelsDeploy: "2026년 9월 26일: 설명이 명확한 비밀 잠금 4개를 추가하고 사이트를 v2.13.0으로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.13.0.", clearSecretLevelsUpdate: "Añadimos los Bloqueos 17–20 con el método de resolución claramente indicado en cada enigma.", clearSecretLevelsDeploy: "26 de septiembre de 2026: añadimos cuatro bloqueos secretos explicados claramente y actualizamos el sitio a v2.13.0." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.13.0.", clearSecretLevelsUpdate: "Ajout des verrous 17 à 20, avec la méthode de résolution clairement indiquée sur chaque énigme.", clearSecretLevelsDeploy: "26 septembre 2026 : ajout de quatre verrous secrets clairement expliqués et passage du site à v2.13.0." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.13.0.", clearSecretLevelsUpdate: "Sperren 17–20 wurden hinzugefügt; die Lösungsmethode steht direkt bei jedem Rätsel.", clearSecretLevelsDeploy: "26. September 2026: Vier klar erklärte geheime Sperren hinzugefügt und die Website auf v2.13.0 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.13.0.", clearSecretLevelsUpdate: "Adicionamos os Bloqueios 17–20 com o método de resolução mostrado claramente em cada enigma.", clearSecretLevelsDeploy: "26 de setembro de 2026: adicionamos quatro bloqueios secretos claramente explicados e atualizamos o site para v2.13.0." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.13.0.", clearSecretLevelsUpdate: "Добавлены блокировки 17–20 с понятным описанием способа решения каждой загадки.", clearSecretLevelsDeploy: "26 сентября 2026 г.: добавлены четыре понятно объяснённые секретные блокировки, сайт обновлён до v2.13.0." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.13.0.", clearSecretLevelsUpdate: "تمت إضافة الأقفال 17–20 مع توضيح طريقة الحل بوضوح في كل لغز.", clearSecretLevelsDeploy: "26 سبتمبر 2026: تمت إضافة أربعة أقفال سرية مشروحة بوضوح وتحديث الموقع إلى v2.13.0." });
  Object.assign(text.en, { thinkingH1: "Muye.dev is now v2.14.0.", secretCommunityUpdate: "Required sign-in for the secret, added a persistent solver list, and opened a solver-only Talk room.", secretCommunityDeploy: "September 26, 2026: Added authenticated secret completion, the solver list, and the protected secret Talk room, then bumped the site to v2.14.0." });
  Object.assign(text.zh, { thinkingH1: "Muye.dev 现在是 v2.14.0。", secretCommunityUpdate: "秘密页面现在需要登录，并新增持久保存的解谜者名单和仅限解谜者的聊天室。", secretCommunityDeploy: "2026 年 9 月 26 日：新增登录验证的秘密完成记录、解谜者名单和受保护的秘密聊天室，并将网站升级到 v2.14.0。" });
  Object.assign(text.ja, { thinkingH1: "Muye.dev は v2.14.0 です。", secretCommunityUpdate: "秘密ページをログイン必須にし、永続的なクリア者リストとクリア者限定Talkルームを追加しました。", secretCommunityDeploy: "2026年9月26日：認証付きの秘密クリア記録、クリア者リスト、保護された秘密Talkルームを追加し、サイトを v2.14.0 に更新しました。" });
  Object.assign(text.ko, { thinkingH1: "Muye.dev는 v2.14.0입니다.", secretCommunityUpdate: "비밀 페이지에 로그인을 요구하고 영구 해결자 목록과 해결자 전용 Talk 방을 추가했습니다.", secretCommunityDeploy: "2026년 9월 26일: 인증된 비밀 완료 기록, 해결자 목록, 보호된 비밀 Talk 방을 추가하고 사이트를 v2.14.0으로 올렸습니다." });
  Object.assign(text.es, { thinkingH1: "Muye.dev ahora es v2.14.0.", secretCommunityUpdate: "El secreto ahora requiere iniciar sesión e incluye una lista persistente de resolutores y una sala de Talk exclusiva para ellos.", secretCommunityDeploy: "26 de septiembre de 2026: añadimos finalización autenticada, la lista de resolutores y la sala secreta protegida de Talk, y actualizamos el sitio a v2.14.0." });
  Object.assign(text.fr, { thinkingH1: "Muye.dev est maintenant en v2.14.0.", secretCommunityUpdate: "Le secret exige désormais une connexion et comprend une liste persistante des gagnants ainsi qu’un salon Talk qui leur est réservé.", secretCommunityDeploy: "26 septembre 2026 : ajout de la validation authentifiée, de la liste des gagnants et du salon Talk secret protégé, puis passage du site à v2.14.0." });
  Object.assign(text.de, { thinkingH1: "Muye.dev ist jetzt v2.14.0.", secretCommunityUpdate: "Das Geheimnis erfordert nun eine Anmeldung und bietet eine dauerhafte Löserliste sowie einen Talk-Raum nur für Löser.", secretCommunityDeploy: "26. September 2026: Authentifizierten Abschluss, Löserliste und geschützten geheimen Talk-Raum hinzugefügt und die Website auf v2.14.0 aktualisiert." });
  Object.assign(text.pt, { thinkingH1: "Muye.dev agora está na v2.14.0.", secretCommunityUpdate: "O segredo agora exige login e inclui uma lista persistente de solucionadores e uma sala do Talk exclusiva para eles.", secretCommunityDeploy: "26 de setembro de 2026: adicionamos conclusão autenticada, a lista de solucionadores e a sala secreta protegida do Talk e atualizamos o site para v2.14.0." });
  Object.assign(text.ru, { thinkingH1: "Muye.dev теперь версии v2.14.0.", secretCommunityUpdate: "Для секрета теперь требуется вход; добавлены постоянный список решивших и комната Talk только для них.", secretCommunityDeploy: "26 сентября 2026 г.: добавлены подтверждение прохождения, список решивших и защищённая секретная комната Talk, сайт обновлён до v2.14.0." });
  Object.assign(text.ar, { thinkingH1: "أصبح Muye.dev الآن بالإصدار v2.14.0.", secretCommunityUpdate: "أصبح السر يتطلب تسجيل الدخول، مع قائمة دائمة للحالّين وغرفة Talk مخصصة لهم فقط.", secretCommunityDeploy: "26 سبتمبر 2026: تمت إضافة إكمال موثّق وقائمة الحالّين وغرفة Talk السرية المحمية وتحديث الموقع إلى v2.14.0." });

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
