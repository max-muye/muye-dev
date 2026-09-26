(() => {
  const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
  const copy = {
    en: { tools: "Tools", languageLabel: "Change language", eyebrow: "TEXT TOOL", intro: "Convert text to ASCII values or turn ASCII values back into text.", encodeTitle: "Text to ASCII", textLabel: "Text", textPlaceholder: "Type text", formatLabel: "Output format", decimal: "Decimal", binary: "Binary", hexadecimal: "Hexadecimal", encode: "Convert", decodeTitle: "ASCII to text", valuesLabel: "ASCII values", valuesPlaceholder: "72 101 108 108 111", decodeHint: "Separate values with spaces. Binary and hexadecimal are detected automatically.", decode: "Decode", result: "Result", copy: "Copy", ready: "Ready.", encoded: "Text converted.", decoded: "Values decoded.", copied: "Copied.", invalid: "Enter valid ASCII values from 0 to 127." },
    zh: { tools: "工具", languageLabel: "切换语言", eyebrow: "文本工具", intro: "将文本转换为 ASCII 值，或将 ASCII 值还原为文本。", encodeTitle: "文本转 ASCII", textLabel: "文本", textPlaceholder: "输入文本", formatLabel: "输出格式", decimal: "十进制", binary: "二进制", hexadecimal: "十六进制", encode: "转换", decodeTitle: "ASCII 转文本", valuesLabel: "ASCII 值", valuesPlaceholder: "72 101 108 108 111", decodeHint: "用空格分隔数值。可自动识别二进制和十六进制。", decode: "解码", result: "结果", copy: "复制", ready: "准备就绪。", encoded: "文本已转换。", decoded: "数值已解码。", copied: "已复制。", invalid: "请输入 0 到 127 的有效 ASCII 值。" },
    ja: { tools: "ツール", languageLabel: "言語を変更", eyebrow: "テキストツール", intro: "テキストをASCII値に変換したり、ASCII値をテキストに戻したりします。", encodeTitle: "テキストからASCII", textLabel: "テキスト", textPlaceholder: "テキストを入力", formatLabel: "出力形式", decimal: "10進数", binary: "2進数", hexadecimal: "16進数", encode: "変換", decodeTitle: "ASCIIからテキスト", valuesLabel: "ASCII値", valuesPlaceholder: "72 101 108 108 111", decodeHint: "値を空白で区切ります。2進数と16進数は自動検出されます。", decode: "復号", result: "結果", copy: "コピー", ready: "準備完了。", encoded: "変換しました。", decoded: "復号しました。", copied: "コピーしました。", invalid: "0から127の有効なASCII値を入力してください。" },
    ko: { tools: "도구", languageLabel: "언어 변경", eyebrow: "텍스트 도구", intro: "텍스트를 ASCII 값으로 변환하거나 ASCII 값을 텍스트로 되돌립니다.", encodeTitle: "텍스트를 ASCII로", textLabel: "텍스트", textPlaceholder: "텍스트 입력", formatLabel: "출력 형식", decimal: "십진수", binary: "이진수", hexadecimal: "십육진수", encode: "변환", decodeTitle: "ASCII를 텍스트로", valuesLabel: "ASCII 값", valuesPlaceholder: "72 101 108 108 111", decodeHint: "값을 공백으로 구분하세요. 이진수와 십육진수는 자동으로 감지됩니다.", decode: "해독", result: "결과", copy: "복사", ready: "준비됨.", encoded: "텍스트가 변환되었습니다.", decoded: "값이 해독되었습니다.", copied: "복사됨.", invalid: "0부터 127까지의 유효한 ASCII 값을 입력하세요." },
    es: { tools: "Herramientas", languageLabel: "Cambiar idioma", eyebrow: "HERRAMIENTA DE TEXTO", intro: "Convierte texto en valores ASCII o valores ASCII de nuevo en texto.", encodeTitle: "Texto a ASCII", textLabel: "Texto", textPlaceholder: "Escribe texto", formatLabel: "Formato de salida", decimal: "Decimal", binary: "Binario", hexadecimal: "Hexadecimal", encode: "Convertir", decodeTitle: "ASCII a texto", valuesLabel: "Valores ASCII", valuesPlaceholder: "72 101 108 108 111", decodeHint: "Separa los valores con espacios. El binario y hexadecimal se detectan automáticamente.", decode: "Decodificar", result: "Resultado", copy: "Copiar", ready: "Listo.", encoded: "Texto convertido.", decoded: "Valores decodificados.", copied: "Copiado.", invalid: "Introduce valores ASCII válidos de 0 a 127." },
    fr: { tools: "Outils", languageLabel: "Changer de langue", eyebrow: "OUTIL TEXTE", intro: "Convertissez du texte en valeurs ASCII ou des valeurs ASCII en texte.", encodeTitle: "Texte vers ASCII", textLabel: "Texte", textPlaceholder: "Saisissez du texte", formatLabel: "Format de sortie", decimal: "Décimal", binary: "Binaire", hexadecimal: "Hexadécimal", encode: "Convertir", decodeTitle: "ASCII vers texte", valuesLabel: "Valeurs ASCII", valuesPlaceholder: "72 101 108 108 111", decodeHint: "Séparez les valeurs par des espaces. Le binaire et l’hexadécimal sont détectés automatiquement.", decode: "Décoder", result: "Résultat", copy: "Copier", ready: "Prêt.", encoded: "Texte converti.", decoded: "Valeurs décodées.", copied: "Copié.", invalid: "Saisissez des valeurs ASCII valides de 0 à 127." },
    de: { tools: "Werkzeuge", languageLabel: "Sprache ändern", eyebrow: "TEXTWERKZEUG", intro: "Wandle Text in ASCII-Werte oder ASCII-Werte zurück in Text um.", encodeTitle: "Text zu ASCII", textLabel: "Text", textPlaceholder: "Text eingeben", formatLabel: "Ausgabeformat", decimal: "Dezimal", binary: "Binär", hexadecimal: "Hexadezimal", encode: "Umwandeln", decodeTitle: "ASCII zu Text", valuesLabel: "ASCII-Werte", valuesPlaceholder: "72 101 108 108 111", decodeHint: "Trenne Werte mit Leerzeichen. Binär und Hexadezimal werden automatisch erkannt.", decode: "Dekodieren", result: "Ergebnis", copy: "Kopieren", ready: "Bereit.", encoded: "Text umgewandelt.", decoded: "Werte dekodiert.", copied: "Kopiert.", invalid: "Gib gültige ASCII-Werte von 0 bis 127 ein." },
    pt: { tools: "Ferramentas", languageLabel: "Alterar idioma", eyebrow: "FERRAMENTA DE TEXTO", intro: "Converta texto em valores ASCII ou valores ASCII novamente em texto.", encodeTitle: "Texto para ASCII", textLabel: "Texto", textPlaceholder: "Digite o texto", formatLabel: "Formato de saída", decimal: "Decimal", binary: "Binário", hexadecimal: "Hexadecimal", encode: "Converter", decodeTitle: "ASCII para texto", valuesLabel: "Valores ASCII", valuesPlaceholder: "72 101 108 108 111", decodeHint: "Separe os valores com espaços. Binário e hexadecimal são detectados automaticamente.", decode: "Decodificar", result: "Resultado", copy: "Copiar", ready: "Pronto.", encoded: "Texto convertido.", decoded: "Valores decodificados.", copied: "Copiado.", invalid: "Digite valores ASCII válidos de 0 a 127." },
    ru: { tools: "Инструменты", languageLabel: "Сменить язык", eyebrow: "ТЕКСТОВЫЙ ИНСТРУМЕНТ", intro: "Преобразуйте текст в значения ASCII или значения ASCII обратно в текст.", encodeTitle: "Текст в ASCII", textLabel: "Текст", textPlaceholder: "Введите текст", formatLabel: "Формат вывода", decimal: "Десятичный", binary: "Двоичный", hexadecimal: "Шестнадцатеричный", encode: "Преобразовать", decodeTitle: "ASCII в текст", valuesLabel: "Значения ASCII", valuesPlaceholder: "72 101 108 108 111", decodeHint: "Разделяйте значения пробелами. Двоичные и шестнадцатеричные значения определяются автоматически.", decode: "Декодировать", result: "Результат", copy: "Копировать", ready: "Готово.", encoded: "Текст преобразован.", decoded: "Значения декодированы.", copied: "Скопировано.", invalid: "Введите допустимые значения ASCII от 0 до 127." },
    ar: { tools: "الأدوات", languageLabel: "تغيير اللغة", eyebrow: "أداة نص", intro: "حوّل النص إلى قيم ASCII أو أعد قيم ASCII إلى نص.", encodeTitle: "النص إلى ASCII", textLabel: "النص", textPlaceholder: "اكتب نصًا", formatLabel: "تنسيق الإخراج", decimal: "عشري", binary: "ثنائي", hexadecimal: "سداسي عشري", encode: "تحويل", decodeTitle: "ASCII إلى نص", valuesLabel: "قيم ASCII", valuesPlaceholder: "72 101 108 108 111", decodeHint: "افصل القيم بمسافات. يتم اكتشاف الثنائي والسداسي عشري تلقائيًا.", decode: "فك الترميز", result: "النتيجة", copy: "نسخ", ready: "جاهز.", encoded: "تم تحويل النص.", decoded: "تم فك القيم.", copied: "تم النسخ.", invalid: "أدخل قيم ASCII صالحة من 0 إلى 127." }
  };
  const plainText = document.querySelector("#plain-text");
  const values = document.querySelector("#ascii-values");
  const format = document.querySelector("#format");
  const output = document.querySelector("#output");
  const status = document.querySelector("#status");
  const languageButton = document.querySelector("#language");
  let statusKey = "ready";
  const currentLanguage = () => languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
  const render = () => {
    const language = currentLanguage();
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy[language][node.dataset.i18n]; });
    document.querySelectorAll("[data-i18n-label]").forEach((node) => { node.setAttribute("aria-label", copy[language][node.dataset.i18nLabel]); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = copy[language][node.dataset.i18nPlaceholder]; });
    languageButton.textContent = language === "zh" ? "中A" : "A中";
    status.textContent = copy[language][statusKey];
  };
  const setResult = (value, key) => { output.textContent = value; statusKey = key; render(); };
  document.querySelector("#encode").addEventListener("click", () => {
    const bytes = [...plainText.value].map((character) => character.charCodeAt(0));
    if (bytes.some((byte) => byte > 127)) { setResult("", "invalid"); return; }
    const converted = bytes.map((byte) => format.value === "binary" ? byte.toString(2).padStart(8, "0") : format.value === "hex" ? `0x${byte.toString(16).toUpperCase().padStart(2, "0")}` : String(byte));
    setResult(converted.join(" "), "encoded");
  });
  document.querySelector("#decode").addEventListener("click", () => {
    const tokens = values.value.trim().split(/[\s,]+/).filter(Boolean);
    const radix = tokens.some((token) => /^0x/i.test(token) || /[a-f]/i.test(token))
      ? 16
      : tokens.length && tokens.every((token) => /^(?:0b)?[01]{8}$/i.test(token))
        ? 2
        : 10;
    const bytes = tokens.map((token) => {
      return Number.parseInt(token.replace(/^0[bx]/i, ""), radix);
    });
    if (!tokens.length || bytes.some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 127)) { setResult("", "invalid"); return; }
    setResult(String.fromCharCode(...bytes), "decoded");
  });
  document.querySelector("#copy").addEventListener("click", async () => { await navigator.clipboard.writeText(output.textContent); statusKey = "copied"; render(); });
  languageButton.addEventListener("click", () => { const language = currentLanguage(); localStorage.setItem("muye-lang", languages[(languages.indexOf(language) + 1) % languages.length]); render(); });
  render();
})();
