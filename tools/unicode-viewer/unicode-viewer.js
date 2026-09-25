(() => {
  const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
  const keys = ["tools", "languageLabel", "eyebrow", "title", "intro", "file", "paste", "placeholder", "show", "viewer", "instructions", "reset", "empty", "shown", "loaded", "invalid", "viewerLabel", "controlsLabel", "zoomIn", "zoomOut", "moveUp", "moveDown", "moveLeft", "moveRight"];
  const values = {
    en: ["Tools", "Change language", "TEXT VIEWER", "Unicode Viewer", "Open or paste Unicode art, then zoom with + and − and move with W, A, S, and D.", "Unicode art file", "Paste Unicode art", "Paste Unicode art here", "Show in viewer", "Viewer", "Click the viewer, then use +, −, W, A, S, and D.", "Reset", "Open a text file or paste Unicode art.", "Unicode art is ready to explore.", "File loaded.", "Please choose a valid text file.", "Unicode art viewer", "Viewer controls", "Zoom in", "Zoom out", "Move up", "Move down", "Move left", "Move right"],
    zh: ["工具", "切换语言", "文本查看器", "Unicode 查看器", "打开或粘贴 Unicode 字符画，然后用 + 和 − 缩放，用 W、A、S、D 移动。", "Unicode 字符画文件", "粘贴 Unicode 字符画", "在此粘贴 Unicode 字符画", "在查看器中显示", "查看器", "点击查看器，然后使用 +、−、W、A、S、D。", "重置", "打开文本文件或粘贴 Unicode 字符画。", "Unicode 字符画已可查看。", "文件已加载。", "请选择有效的文本文件。", "Unicode 字符画查看器", "查看器控制", "放大", "缩小", "向上移动", "向下移动", "向左移动", "向右移动"],
    ja: ["ツール", "言語を変更", "テキストビューアー", "Unicodeビューアー", "Unicodeアートを開くか貼り付け、+と−で拡大縮小し、W、A、S、Dで移動します。", "Unicodeアートファイル", "Unicodeアートを貼り付け", "ここにUnicodeアートを貼り付け", "ビューアーに表示", "ビューアー", "ビューアーをクリックし、+、−、W、A、S、Dを使います。", "リセット", "テキストファイルを開くか、Unicodeアートを貼り付けてください。", "Unicodeアートを表示しました。", "ファイルを読み込みました。", "有効なテキストファイルを選択してください。", "Unicodeアートビューアー", "ビューアー操作", "拡大", "縮小", "上へ移動", "下へ移動", "左へ移動", "右へ移動"],
    ko: ["도구", "언어 변경", "텍스트 뷰어", "유니코드 뷰어", "유니코드 아트를 열거나 붙여넣고 +와 −로 확대·축소하며 W, A, S, D로 이동하세요.", "유니코드 아트 파일", "유니코드 아트 붙여넣기", "여기에 유니코드 아트 붙여넣기", "뷰어에 표시", "뷰어", "뷰어를 클릭한 뒤 +, −, W, A, S, D를 사용하세요.", "초기화", "텍스트 파일을 열거나 유니코드 아트를 붙여넣으세요.", "유니코드 아트를 탐색할 수 있습니다.", "파일을 불러왔습니다.", "올바른 텍스트 파일을 선택하세요.", "유니코드 아트 뷰어", "뷰어 컨트롤", "확대", "축소", "위로 이동", "아래로 이동", "왼쪽으로 이동", "오른쪽으로 이동"],
    es: ["Herramientas", "Cambiar idioma", "VISOR DE TEXTO", "Visor Unicode", "Abre o pega arte Unicode; usa + y − para ampliar y W, A, S y D para moverte.", "Archivo de arte Unicode", "Pegar arte Unicode", "Pega aquí el arte Unicode", "Mostrar en el visor", "Visor", "Haz clic en el visor y usa +, −, W, A, S y D.", "Restablecer", "Abre un archivo de texto o pega arte Unicode.", "El arte Unicode está listo para explorar.", "Archivo cargado.", "Elige un archivo de texto válido.", "Visor de arte Unicode", "Controles del visor", "Ampliar", "Reducir", "Mover arriba", "Mover abajo", "Mover a la izquierda", "Mover a la derecha"],
    fr: ["Outils", "Changer de langue", "VISIONNEUSE DE TEXTE", "Visionneuse Unicode", "Ouvrez ou collez un art Unicode, zoomez avec + et − et déplacez-vous avec W, A, S et D.", "Fichier d’art Unicode", "Coller un art Unicode", "Collez l’art Unicode ici", "Afficher", "Visionneuse", "Cliquez dans la visionneuse, puis utilisez +, −, W, A, S et D.", "Réinitialiser", "Ouvrez un fichier texte ou collez un art Unicode.", "L’art Unicode est prêt à être exploré.", "Fichier chargé.", "Choisissez un fichier texte valide.", "Visionneuse d’art Unicode", "Commandes de la visionneuse", "Zoomer", "Dézoomer", "Monter", "Descendre", "Aller à gauche", "Aller à droite"],
    de: ["Werkzeuge", "Sprache ändern", "TEXTBETRACHTER", "Unicode-Betrachter", "Öffne oder füge Unicode-Kunst ein, zoome mit + und − und bewege dich mit W, A, S und D.", "Unicode-Kunst-Datei", "Unicode-Kunst einfügen", "Unicode-Kunst hier einfügen", "Im Betrachter anzeigen", "Betrachter", "Klicke in den Betrachter und nutze +, −, W, A, S und D.", "Zurücksetzen", "Öffne eine Textdatei oder füge Unicode-Kunst ein.", "Die Unicode-Kunst kann jetzt erkundet werden.", "Datei geladen.", "Bitte wähle eine gültige Textdatei.", "Unicode-Kunst-Betrachter", "Betrachtersteuerung", "Vergrößern", "Verkleinern", "Nach oben", "Nach unten", "Nach links", "Nach rechts"],
    pt: ["Ferramentas", "Alterar idioma", "VISUALIZADOR DE TEXTO", "Visualizador Unicode", "Abra ou cole arte Unicode, use + e − para ampliar e W, A, S e D para mover.", "Arquivo de arte Unicode", "Colar arte Unicode", "Cole a arte Unicode aqui", "Mostrar no visualizador", "Visualizador", "Clique no visualizador e use +, −, W, A, S e D.", "Redefinir", "Abra um arquivo de texto ou cole arte Unicode.", "A arte Unicode está pronta para explorar.", "Arquivo carregado.", "Escolha um arquivo de texto válido.", "Visualizador de arte Unicode", "Controles do visualizador", "Ampliar", "Reduzir", "Mover para cima", "Mover para baixo", "Mover para a esquerda", "Mover para a direita"],
    ru: ["Инструменты", "Сменить язык", "ПРОСМОТР ТЕКСТА", "Просмотр Unicode", "Откройте или вставьте Unicode-арт, меняйте масштаб кнопками + и − и двигайтесь клавишами W, A, S и D.", "Файл Unicode-арта", "Вставить Unicode-арт", "Вставьте Unicode-арт сюда", "Показать", "Просмотр", "Щёлкните по области просмотра и используйте +, −, W, A, S и D.", "Сбросить", "Откройте текстовый файл или вставьте Unicode-арт.", "Unicode-арт готов к просмотру.", "Файл загружен.", "Выберите допустимый текстовый файл.", "Просмотр Unicode-арта", "Управление просмотром", "Увеличить", "Уменьшить", "Вверх", "Вниз", "Влево", "Вправо"],
    ar: ["الأدوات", "تغيير اللغة", "عارض نصوص", "عارض Unicode", "افتح فن Unicode أو الصقه، ثم استخدم + و− للتكبير وW وA وS وD للتحريك.", "ملف فن Unicode", "لصق فن Unicode", "الصق فن Unicode هنا", "عرض", "العارض", "انقر على العارض ثم استخدم + و− وW وA وS وD.", "إعادة ضبط", "افتح ملفًا نصيًا أو الصق فن Unicode.", "فن Unicode جاهز للاستكشاف.", "تم تحميل الملف.", "يرجى اختيار ملف نصي صالح.", "عارض فن Unicode", "عناصر تحكم العارض", "تكبير", "تصغير", "تحريك لأعلى", "تحريك لأسفل", "تحريك لليسار", "تحريك لليمين"]
  };
  const copy = Object.fromEntries(Object.entries(values).map(([language, items]) => [language, Object.fromEntries(keys.map((key, index) => [key, items[index]]))]));
  const source = document.querySelector("#source");
  const art = document.querySelector("#art");
  const viewport = document.querySelector("#viewport");
  const status = document.querySelector("#status");
  const zoomOutput = document.querySelector("#zoom");
  const languageButton = document.querySelector("#language");
  let scale = 1;
  let x = 0;
  let y = 0;
  let statusKey = "empty";

  const currentLanguage = () => languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
  const renderLanguage = () => {
    const language = currentLanguage();
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy[language][node.dataset.i18n]; });
    document.querySelectorAll("[data-i18n-label]").forEach((node) => { node.setAttribute("aria-label", copy[language][node.dataset.i18nLabel]); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = copy[language][node.dataset.i18nPlaceholder]; });
    languageButton.textContent = language === "zh" ? "中A" : "A中";
    status.textContent = copy[language][statusKey];
  };
  const setStatus = (key) => { statusKey = key; renderLanguage(); };
  const draw = () => { art.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`; zoomOutput.textContent = `${Math.round(scale * 100)}%`; };
  const reset = () => { scale = 1; x = 0; y = 0; draw(); };
  const action = (name) => {
    if (name === "zoom-in") scale *= 1.2;
    if (name === "zoom-out") scale /= 1.2;
    if (name === "up") y += 36;
    if (name === "down") y -= 36;
    if (name === "left") x += 36;
    if (name === "right") x -= 36;
    if (name === "reset") reset(); else draw();
    viewport.focus();
  };
  const show = () => { art.textContent = source.value; reset(); setStatus(source.value ? "shown" : "empty"); viewport.focus(); };

  document.querySelector("#show").addEventListener("click", show);
  document.querySelector("#file").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 0 && file.type && file.type !== "text/plain" && !file.name.toLowerCase().endsWith(".txt")) return setStatus("invalid");
    source.value = await file.text();
    show();
    setStatus("loaded");
  });
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => action(button.dataset.action)));
  viewport.addEventListener("keydown", (event) => {
    const actions = { "+": "zoom-in", "=": "zoom-in", "-": "zoom-out", w: "up", a: "left", s: "down", d: "right", W: "up", A: "left", S: "down", D: "right" };
    if (!actions[event.key]) return;
    event.preventDefault();
    action(actions[event.key]);
  });
  languageButton.addEventListener("click", () => { const language = currentLanguage(); localStorage.setItem("muye-lang", languages[(languages.indexOf(language) + 1) % languages.length]); renderLanguage(); });
  draw();
  renderLanguage();
})();
