(() => {
  const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
  const copy = {
    en:{tools:"Tools",languageLabel:"Change language",eyebrow:"UNICODE TOOL",title:"Invisible Characters",intro:"Copy zero-width characters and other invisible Unicode controls. Each button copies only the character shown by its code point.",caution:"These characters can change joining, line breaks, text direction, or emoji presentation. Use them only when you need that behavior.",nameNote:"Official Unicode character names are shown in English.",joinTitle:"Zero-width spaces and joiners",joinIntro:"Common invisible characters for word breaks, script joining, and keeping words together.",mathTitle:"Invisible math operators",mathIntro:"Formatting characters used to represent mathematical operations without a visible symbol.",directionTitle:"Direction controls",directionIntro:"Invisible marks and embeddings that affect bidirectional text layout.",variationTitle:"Variation selectors · VS1–VS256",variationIntro:"Choose any of the 256 variation selectors. The dotted circle is only a preview aid; it is not copied.",variationNumber:"Selector number",copySelected:"Copy character",tagTitle:"Emoji tag characters",tagIntro:"Tag characters can form subdivision flag sequences. Enter one ASCII character to copy its invisible tag form.",tagCharacter:"ASCII character",legacyTitle:"Deprecated and legacy format controls",legacyIntro:"These characters are retained for compatibility. New text should normally use Word Joiner (U+2060) instead of U+FEFF for word joining.",ready:"Ready.",copied:"Copied.",copyFailed:"Copy failed. Check browser clipboard access.",invalidVariation:"Enter a selector number from 1 to 256.",invalidTag:"Enter one ASCII character (U+0020–U+007E).",copy:"Copy"},
    zh:{tools:"工具",languageLabel:"切换语言",eyebrow:"UNICODE 工具",title:"不可见字符",intro:"复制零宽字符和其他不可见 Unicode 控制字符。每个按钮只复制对应码位的字符。",caution:"这些字符可能改变字符连接、换行、文本方向或 Emoji 显示方式。请只在需要这些效果时使用。",nameNote:"Unicode 官方字符名称以英文显示。",joinTitle:"零宽空格与连接符",joinIntro:"用于断词、文字连接和禁止换行的常见不可见字符。",mathTitle:"不可见数学运算符",mathIntro:"表示数学运算但不显示符号的格式字符。",directionTitle:"方向控制符",directionIntro:"影响双向文本排版的不可见标记和嵌入控制符。",variationTitle:"变体选择符 · VS1–VS256",variationIntro:"选择 256 个变体选择符中的任意一个。带点圆圈仅用于预览，不会被复制。",variationNumber:"选择符编号",copySelected:"复制字符",tagTitle:"Emoji 标签字符",tagIntro:"标签字符可组成地区旗帜序列。输入一个 ASCII 字符，即可复制它对应的不可见标签形式。",tagCharacter:"ASCII 字符",legacyTitle:"已弃用和旧式格式控制符",legacyIntro:"这些字符为兼容旧文本而保留。需要禁止换行时，新文本通常应使用 Word Joiner（U+2060），而不是 U+FEFF。",ready:"准备就绪。",copied:"已复制。",copyFailed:"复制失败，请检查浏览器剪贴板权限。",invalidVariation:"请输入 1 到 256 之间的选择符编号。",invalidTag:"请输入一个 ASCII 字符（U+0020–U+007E）。",copy:"复制"},
    ja:{tools:"ツール",languageLabel:"言語を変更",eyebrow:"UNICODEツール",title:"不可視文字",intro:"ゼロ幅文字やその他の不可視Unicode制御文字をコピーできます。各ボタンはコードポイントに対応する文字だけをコピーします。",caution:"これらの文字は、文字の接続、改行、文字方向、絵文字の表示を変えることがあります。必要な場合にのみ使用してください。",nameNote:"Unicode公式の文字名は英語で表示されます。",joinTitle:"ゼロ幅スペースと接合子",joinIntro:"語の区切り、文字の接合、改行の抑止に使われる一般的な不可視文字です。",mathTitle:"不可視の数学演算子",mathIntro:"記号を表示せずに数学演算を表す書式文字です。",directionTitle:"方向制御文字",directionIntro:"双方向テキストの配置に影響する不可視のマークや埋め込み制御文字です。",variationTitle:"異体字セレクター · VS1–VS256",variationIntro:"256個の異体字セレクターから選択できます。点付き円はプレビュー用で、コピーされません。",variationNumber:"セレクター番号",copySelected:"文字をコピー",tagTitle:"絵文字タグ文字",tagIntro:"タグ文字は地域旗のシーケンスを構成できます。ASCII文字を1つ入力すると、対応する不可視タグをコピーできます。",tagCharacter:"ASCII文字",legacyTitle:"非推奨・旧式の書式制御文字",legacyIntro:"これらの文字は互換性のために残されています。改行を防ぐには、U+FEFFではなく通常U+2060 WORD JOINERを使います。",ready:"準備完了。",copied:"コピーしました。",copyFailed:"コピーできませんでした。ブラウザーのクリップボード権限を確認してください。",invalidVariation:"1〜256のセレクター番号を入力してください。",invalidTag:"ASCII文字を1つ入力してください（U+0020–U+007E）。",copy:"コピー"},
    ko:{tools:"도구",languageLabel:"언어 변경",eyebrow:"UNICODE 도구",title:"보이지 않는 문자",intro:"제로폭 문자와 기타 보이지 않는 유니코드 제어 문자를 복사합니다. 각 버튼은 해당 코드 포인트의 문자만 복사합니다.",caution:"이 문자는 문자 연결, 줄바꿈, 텍스트 방향 또는 이모지 표시를 바꿀 수 있습니다. 필요한 경우에만 사용하세요.",nameNote:"유니코드 공식 문자 이름은 영어로 표시됩니다.",joinTitle:"제로폭 공백과 결합자",joinIntro:"단어 분리, 문자 결합, 줄바꿈 방지에 쓰이는 일반적인 보이지 않는 문자입니다.",mathTitle:"보이지 않는 수학 연산자",mathIntro:"기호를 표시하지 않고 수학 연산을 나타내는 형식 문자입니다.",directionTitle:"방향 제어 문자",directionIntro:"양방향 텍스트 레이아웃에 영향을 주는 보이지 않는 표시와 임베딩 제어 문자입니다.",variationTitle:"변형 선택자 · VS1–VS256",variationIntro:"256개의 변형 선택자 중 하나를 선택하세요. 점이 있는 원은 미리보기용이며 복사되지 않습니다.",variationNumber:"선택자 번호",copySelected:"문자 복사",tagTitle:"이모지 태그 문자",tagIntro:"태그 문자는 세분화된 국기 시퀀스를 만들 수 있습니다. ASCII 문자 하나를 입력해 보이지 않는 태그 형태를 복사하세요.",tagCharacter:"ASCII 문자",legacyTitle:"사용 중단 및 레거시 형식 제어 문자",legacyIntro:"이 문자들은 호환성을 위해 유지됩니다. 줄바꿈을 막으려면 새 텍스트에서 U+FEFF 대신 U+2060 WORD JOINER를 사용하는 것이 일반적입니다.",ready:"준비됨.",copied:"복사됨.",copyFailed:"복사에 실패했습니다. 브라우저 클립보드 권한을 확인하세요.",invalidVariation:"1에서 256 사이의 선택자 번호를 입력하세요.",invalidTag:"ASCII 문자 하나를 입력하세요(U+0020–U+007E).",copy:"복사"},
    es:{tools:"Herramientas",languageLabel:"Cambiar idioma",eyebrow:"HERRAMIENTA UNICODE",title:"Caracteres invisibles",intro:"Copia caracteres de ancho cero y otros controles Unicode invisibles. Cada botón copia solo el carácter indicado por su punto de código.",caution:"Estos caracteres pueden cambiar la unión, los saltos de línea, la dirección del texto o la presentación de emojis. Úsalos solo cuando necesites ese efecto.",nameNote:"Los nombres oficiales Unicode se muestran en inglés.",joinTitle:"Espacios y unidores de ancho cero",joinIntro:"Caracteres invisibles habituales para separar palabras, unir escrituras y evitar saltos de línea.",mathTitle:"Operadores matemáticos invisibles",mathIntro:"Caracteres de formato que representan operaciones matemáticas sin mostrar un símbolo.",directionTitle:"Controles de dirección",directionIntro:"Marcas y controles de inserción invisibles que afectan al texto bidireccional.",variationTitle:"Selectores de variación · VS1–VS256",variationIntro:"Elige cualquiera de los 256 selectores. El círculo punteado es solo una ayuda visual y no se copia.",variationNumber:"Número del selector",copySelected:"Copiar carácter",tagTitle:"Caracteres de etiqueta emoji",tagIntro:"Los caracteres de etiqueta pueden formar secuencias de banderas regionales. Introduce un carácter ASCII para copiar su forma de etiqueta invisible.",tagCharacter:"Carácter ASCII",legacyTitle:"Controles de formato obsoletos y heredados",legacyIntro:"Se conservan por compatibilidad. Para evitar saltos de línea en texto nuevo, normalmente usa Word Joiner (U+2060) en lugar de U+FEFF.",ready:"Listo.",copied:"Copiado.",copyFailed:"No se pudo copiar. Comprueba el acceso al portapapeles del navegador.",invalidVariation:"Introduce un selector del 1 al 256.",invalidTag:"Introduce un carácter ASCII (U+0020–U+007E).",copy:"Copiar"},
    fr:{tools:"Outils",languageLabel:"Changer de langue",eyebrow:"OUTIL UNICODE",title:"Caractères invisibles",intro:"Copiez des caractères de largeur nulle et d’autres commandes Unicode invisibles. Chaque bouton copie uniquement le caractère indiqué par son point de code.",caution:"Ces caractères peuvent modifier la liaison, les retours à la ligne, le sens du texte ou l’affichage des émojis. Utilisez-les uniquement si nécessaire.",nameNote:"Les noms Unicode officiels sont affichés en anglais.",joinTitle:"Espaces et liants sans chasse",joinIntro:"Caractères invisibles courants pour séparer les mots, lier les écritures et empêcher les retours à la ligne.",mathTitle:"Opérateurs mathématiques invisibles",mathIntro:"Caractères de formatage qui représentent des opérations sans symbole visible.",directionTitle:"Commandes directionnelles",directionIntro:"Marques et commandes d’insertion invisibles qui influencent le texte bidirectionnel.",variationTitle:"Sélecteurs de variante · VS1–VS256",variationIntro:"Choisissez l’un des 256 sélecteurs. Le cercle pointillé sert uniquement d’aperçu et n’est pas copié.",variationNumber:"Numéro du sélecteur",copySelected:"Copier le caractère",tagTitle:"Caractères de balise emoji",tagIntro:"Les caractères de balise peuvent former des séquences de drapeaux régionaux. Saisissez un caractère ASCII pour copier sa forme de balise invisible.",tagCharacter:"Caractère ASCII",legacyTitle:"Commandes de format obsolètes et héritées",legacyIntro:"Ces caractères sont conservés pour la compatibilité. Pour empêcher les retours à la ligne dans un nouveau texte, utilisez généralement Word Joiner (U+2060) plutôt que U+FEFF.",ready:"Prêt.",copied:"Copié.",copyFailed:"Échec de la copie. Vérifiez l’accès au presse-papiers du navigateur.",invalidVariation:"Saisissez un sélecteur compris entre 1 et 256.",invalidTag:"Saisissez un caractère ASCII (U+0020–U+007E).",copy:"Copier"},
    de:{tools:"Werkzeuge",languageLabel:"Sprache ändern",eyebrow:"UNICODE-WERKZEUG",title:"Unsichtbare Zeichen",intro:"Kopiere Nullbreitenzeichen und andere unsichtbare Unicode-Steuerzeichen. Jede Schaltfläche kopiert nur das Zeichen des angegebenen Codepoints.",caution:"Diese Zeichen können Verbindungen, Zeilenumbrüche, Textrichtung oder Emoji-Darstellung verändern. Verwende sie nur bei Bedarf.",nameNote:"Offizielle Unicode-Zeichennamen werden auf Englisch angezeigt.",joinTitle:"Nullbreiten-Leerzeichen und Verbinder",joinIntro:"Häufige unsichtbare Zeichen für Worttrennung, Schriftverbindungen und geschützte Zeilenumbrüche.",mathTitle:"Unsichtbare mathematische Operatoren",mathIntro:"Formatzeichen für mathematische Operationen ohne sichtbares Symbol.",directionTitle:"Richtungssteuerzeichen",directionIntro:"Unsichtbare Marken und Einbettungen, die bidirektionalen Text beeinflussen.",variationTitle:"Variationsselektoren · VS1–VS256",variationIntro:"Wähle einen der 256 Variationsselektoren. Der gepunktete Kreis dient nur als Vorschau und wird nicht kopiert.",variationNumber:"Selektornummer",copySelected:"Zeichen kopieren",tagTitle:"Emoji-Tagzeichen",tagIntro:"Tagzeichen können regionale Flaggenfolgen bilden. Gib ein ASCII-Zeichen ein, um dessen unsichtbare Tagform zu kopieren.",tagCharacter:"ASCII-Zeichen",legacyTitle:"Veraltete und historische Formatsteuerzeichen",legacyIntro:"Diese Zeichen bleiben aus Kompatibilitätsgründen erhalten. Für geschützte Wortabstände sollte neuer Text normalerweise Word Joiner (U+2060) statt U+FEFF verwenden.",ready:"Bereit.",copied:"Kopiert.",copyFailed:"Kopieren fehlgeschlagen. Prüfe den Zugriff auf die Browser-Zwischenablage.",invalidVariation:"Gib eine Selektornummer von 1 bis 256 ein.",invalidTag:"Gib ein ASCII-Zeichen ein (U+0020–U+007E).",copy:"Kopieren"},
    pt:{tools:"Ferramentas",languageLabel:"Alterar idioma",eyebrow:"FERRAMENTA UNICODE",title:"Caracteres invisíveis",intro:"Copie caracteres de largura zero e outros controles Unicode invisíveis. Cada botão copia apenas o caractere indicado pelo ponto de código.",caution:"Esses caracteres podem alterar junções, quebras de linha, direção do texto ou apresentação de emojis. Use-os apenas quando precisar desse efeito.",nameNote:"Os nomes oficiais dos caracteres Unicode são exibidos em inglês.",joinTitle:"Espaços e juntadores de largura zero",joinIntro:"Caracteres invisíveis comuns para separar palavras, unir escritas e impedir quebras de linha.",mathTitle:"Operadores matemáticos invisíveis",mathIntro:"Caracteres de formatação que representam operações matemáticas sem um símbolo visível.",directionTitle:"Controles de direção",directionIntro:"Marcas e controles de incorporação invisíveis que afetam o texto bidirecional.",variationTitle:"Seletores de variação · VS1–VS256",variationIntro:"Escolha qualquer um dos 256 seletores. O círculo pontilhado é apenas uma prévia e não é copiado.",variationNumber:"Número do seletor",copySelected:"Copiar caractere",tagTitle:"Caracteres de etiqueta emoji",tagIntro:"Caracteres de etiqueta podem formar sequências de bandeiras regionais. Digite um caractere ASCII para copiar sua forma invisível de etiqueta.",tagCharacter:"Caractere ASCII",legacyTitle:"Controles de formato obsoletos e antigos",legacyIntro:"Estes caracteres são mantidos por compatibilidade. Para impedir quebras de linha em texto novo, normalmente use Word Joiner (U+2060) em vez de U+FEFF.",ready:"Pronto.",copied:"Copiado.",copyFailed:"Falha ao copiar. Verifique o acesso à área de transferência do navegador.",invalidVariation:"Digite um seletor de 1 a 256.",invalidTag:"Digite um caractere ASCII (U+0020–U+007E).",copy:"Copiar"},
    ru:{tools:"Инструменты",languageLabel:"Сменить язык",eyebrow:"ИНСТРУМЕНТ UNICODE",title:"Невидимые символы",intro:"Копируйте символы нулевой ширины и другие невидимые управляющие символы Unicode. Каждая кнопка копирует только символ указанной кодовой точки.",caution:"Эти символы могут менять соединение, переносы строк, направление текста или отображение эмодзи. Используйте их только при необходимости.",nameNote:"Официальные названия символов Unicode показаны на английском.",joinTitle:"Пробелы и соединители нулевой ширины",joinIntro:"Распространённые невидимые символы для разделения слов, соединения письменностей и запрета переноса строк.",mathTitle:"Невидимые математические операторы",mathIntro:"Форматирующие символы, обозначающие математические операции без видимого знака.",directionTitle:"Управление направлением",directionIntro:"Невидимые метки и управляющие вставки, влияющие на двунаправленный текст.",variationTitle:"Селекторы вариантов · VS1–VS256",variationIntro:"Выберите любой из 256 селекторов. Пунктирный круг нужен только для предварительного просмотра и не копируется.",variationNumber:"Номер селектора",copySelected:"Копировать символ",tagTitle:"Теговые символы эмодзи",tagIntro:"Теговые символы образуют последовательности региональных флагов. Введите один ASCII-символ, чтобы скопировать его невидимую теговую форму.",tagCharacter:"ASCII-символ",legacyTitle:"Устаревшие управляющие символы форматирования",legacyIntro:"Эти символы сохранены для совместимости. Для запрета переноса в новом тексте обычно используйте Word Joiner (U+2060), а не U+FEFF.",ready:"Готово.",copied:"Скопировано.",copyFailed:"Не удалось скопировать. Проверьте доступ браузера к буферу обмена.",invalidVariation:"Введите номер селектора от 1 до 256.",invalidTag:"Введите один ASCII-символ (U+0020–U+007E).",copy:"Копировать"},
    ar:{tools:"الأدوات",languageLabel:"تغيير اللغة",eyebrow:"أداة UNICODE",title:"محارف غير مرئية",intro:"انسخ محارف عديمة العرض ومحارف تحكم Unicode غير مرئية أخرى. ينسخ كل زر المحرف المطابق لنقطة الترميز فقط.",caution:"قد تغيّر هذه المحارف الربط أو فواصل الأسطر أو اتجاه النص أو عرض الرموز التعبيرية. استخدمها عند الحاجة إلى هذا السلوك فقط.",nameNote:"تُعرض أسماء Unicode الرسمية للمحارف باللغة الإنجليزية.",joinTitle:"مسافات وروابط عديمة العرض",joinIntro:"محارف غير مرئية شائعة للفصل بين الكلمات وربط الكتابات ومنع فواصل الأسطر.",mathTitle:"عوامل رياضية غير مرئية",mathIntro:"محارف تنسيق تمثل عمليات رياضية من دون رمز ظاهر.",directionTitle:"محارف التحكم في الاتجاه",directionIntro:"علامات وتضمينات غير مرئية تؤثر في تخطيط النص ثنائي الاتجاه.",variationTitle:"محدّدات التنويع · VS1–VS256",variationIntro:"اختر أيًا من محددات التنويع الـ256. الدائرة المنقطة للمعاينة فقط ولن تُنسخ.",variationNumber:"رقم المحدّد",copySelected:"نسخ المحرف",tagTitle:"محارف وسوم الرموز التعبيرية",tagIntro:"يمكن لمحارف الوسوم تكوين تسلسلات أعلام المناطق. أدخل محرف ASCII واحدًا لنسخ شكل الوسم غير المرئي المقابل له.",tagCharacter:"محرف ASCII",legacyTitle:"محارف تنسيق قديمة ومهملة",legacyIntro:"تُحتفظ بهذه المحارف للتوافق. لمنع فواصل الأسطر في النص الجديد، استخدم عادةً Word Joiner (U+2060) بدلًا من U+FEFF.",ready:"جاهز.",copied:"تم النسخ.",copyFailed:"تعذر النسخ. تحقق من وصول المتصفح إلى الحافظة.",invalidVariation:"أدخل رقم محدّد من 1 إلى 256.",invalidTag:"أدخل محرف ASCII واحدًا (U+0020–U+007E).",copy:"نسخ"}
  };
  const sets = {
    join:[
      ["034F","COMBINING GRAPHEME JOINER"],["200B","ZERO WIDTH SPACE"],["200C","ZERO WIDTH NON-JOINER"],["200D","ZERO WIDTH JOINER"],["2060","WORD JOINER"],["FEFF","ZERO WIDTH NO-BREAK SPACE"]
    ],
    math:[["2061","FUNCTION APPLICATION"],["2062","INVISIBLE TIMES"],["2063","INVISIBLE SEPARATOR"],["2064","INVISIBLE PLUS"]],
    direction:[["061C","ARABIC LETTER MARK"],["200E","LEFT-TO-RIGHT MARK"],["200F","RIGHT-TO-LEFT MARK"],["202A","LEFT-TO-RIGHT EMBEDDING"],["202B","RIGHT-TO-LEFT EMBEDDING"],["202C","POP DIRECTIONAL FORMATTING"],["202D","LEFT-TO-RIGHT OVERRIDE"],["202E","RIGHT-TO-LEFT OVERRIDE"],["2066","LEFT-TO-RIGHT ISOLATE"],["2067","RIGHT-TO-LEFT ISOLATE"],["2068","FIRST STRONG ISOLATE"],["2069","POP DIRECTIONAL ISOLATE"]],
    tag:[["E007F","CANCEL TAG"]],
    legacy:[["180E","MONGOLIAN VOWEL SEPARATOR"],["206A","INHIBIT SYMMETRIC SWAPPING"],["206B","ACTIVATE SYMMETRIC SWAPPING"],["206C","INHIBIT ARABIC FORM SHAPING"],["206D","ACTIVATE ARABIC FORM SHAPING"],["206E","NATIONAL DIGIT SHAPES"],["206F","NOMINAL DIGIT SHAPES"]]
  };
  const status = document.querySelector("#status");
  const languageButton = document.querySelector("#language");
  const currentLanguage = () => languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
  let statusKey = "ready";
  const renderLanguage = () => {
    const language = currentLanguage();
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = `${copy[language].title} · Muye`;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy[language][node.dataset.i18n]; });
    document.querySelectorAll("[data-i18n-label]").forEach((node) => { node.setAttribute("aria-label", copy[language][node.dataset.i18nLabel]); });
    document.querySelectorAll("[data-copy-code]").forEach((node) => { node.textContent = copy[language].copy; node.setAttribute("aria-label", `${copy[language].copy} U+${node.dataset.copyCode} ${node.dataset.copyName}`); });
    status.textContent = copy[language][statusKey];
  };
  const codePoint = (hex) => String.fromCodePoint(Number.parseInt(hex, 16));
  const setStatus = (key) => { statusKey = key; renderLanguage(); };
  const copyCharacter = async (character) => {
    try { await navigator.clipboard.writeText(character); setStatus("copied"); }
    catch (_) { setStatus("copyFailed"); }
  };
  const renderList = (id, entries) => {
    const list = document.querySelector(`#${id}`);
    entries.forEach(([hex, name]) => {
      const row = document.createElement("div"); row.className = "character-row";
      const code = document.createElement("code"); code.textContent = `U+${hex}`;
      const label = document.createElement("span"); label.className = "character-name"; label.textContent = name;
      const button = document.createElement("button"); button.type = "button"; button.dataset.copyCode = hex; button.dataset.copyName = name;
      button.addEventListener("click", () => copyCharacter(codePoint(hex)));
      row.append(code, label, button); list.append(row);
    });
  };
  renderList("join-list", sets.join);
  renderList("math-list", sets.math);
  renderList("direction-list", sets.direction);
  renderList("tag-list", sets.tag);
  renderList("legacy-list", sets.legacy);

  const variationInput = document.querySelector("#variation-number");
  const variationDisplay = document.querySelector("#variation-display");
  const variationCode = document.querySelector("#variation-code");
  const variationValue = () => {
    const number = Number(variationInput.value);
    if (!Number.isInteger(number) || number < 1 || number > 256) return null;
    const point = number <= 16 ? 0xFE00 + number - 1 : 0xE0100 + number - 17;
    return { number, point, character: String.fromCodePoint(point) };
  };
  const renderVariation = () => {
    const value = variationValue();
    if (!value) { variationDisplay.textContent = "◌"; variationCode.textContent = "—"; return; }
    variationDisplay.textContent = `◌${value.character}`;
    variationCode.textContent = `U+${value.point.toString(16).toUpperCase().padStart(value.point > 0xFFFF ? 5 : 4, "0")} · VS${value.number}`;
  };
  variationInput.addEventListener("input", renderVariation);
  document.querySelector("#copy-variation").addEventListener("click", () => {
    const value = variationValue();
    if (!value) return setStatus("invalidVariation");
    copyCharacter(value.character);
  });
  renderVariation();

  const tagInput = document.querySelector("#tag-character");
  const tagDisplay = document.querySelector("#tag-display");
  const tagCode = document.querySelector("#tag-code");
  const tagValue = () => {
    const characters = Array.from(tagInput.value);
    if (characters.length !== 1) return null;
    const ascii = characters[0].codePointAt(0);
    if (ascii < 0x20 || ascii > 0x7E) return null;
    const point = 0xE0000 + ascii;
    return { point, character: String.fromCodePoint(point) };
  };
  const renderTag = () => {
    const value = tagValue();
    if (!value) { tagDisplay.textContent = "◌"; tagCode.textContent = "—"; return; }
    tagDisplay.textContent = `◌${value.character}`;
    tagCode.textContent = `U+${value.point.toString(16).toUpperCase()}`;
  };
  tagInput.addEventListener("input", renderTag);
  document.querySelector("#copy-tag").addEventListener("click", () => {
    const value = tagValue();
    if (!value) return setStatus("invalidTag");
    copyCharacter(value.character);
  });
  languageButton.addEventListener("click", () => { const language = currentLanguage(); localStorage.setItem("muye-lang", languages[(languages.indexOf(language) + 1) % languages.length]); renderLanguage(); });
  window.addEventListener("muye-language-change", renderLanguage);
  renderTag();
  renderLanguage();
})();
