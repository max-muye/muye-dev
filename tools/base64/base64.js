(() => {
  const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
  const copy = {
    en: { tools: "Tools", languageLabel: "Change language", eyebrow: "TEXT TOOL", intro: "Encode text as Base64 or decode Base64 back into text. Everything stays in your browser.", plainText: "Plain text", encode: "Encode", plainPlaceholder: "Type text here", base64Text: "Base64", decode: "Decode", base64Placeholder: "Base64 appears here", copyPlain: "Copy text", copyBase64: "Copy Base64", clear: "Clear", ready: "Ready.", encoded: "Text encoded.", decoded: "Base64 decoded.", copied: "Copied.", invalid: "That is not valid Base64 text." },
    zh: { tools: "工具", languageLabel: "切换语言", eyebrow: "文本工具", intro: "将文本编码为 Base64，或将 Base64 解码回文本。所有内容都保留在浏览器中。", plainText: "普通文本", encode: "编码", plainPlaceholder: "在此输入文本", base64Text: "Base64", decode: "解码", base64Placeholder: "Base64 显示在这里", copyPlain: "复制文本", copyBase64: "复制 Base64", clear: "清除", ready: "准备就绪。", encoded: "文本已编码。", decoded: "Base64 已解码。", copied: "已复制。", invalid: "这不是有效的 Base64 文本。" },
    ja: { tools: "ツール", languageLabel: "言語を変更", eyebrow: "テキストツール", intro: "テキストをBase64に変換したり、Base64をテキストに戻したりします。すべてブラウザ内で処理されます。", plainText: "プレーンテキスト", encode: "エンコード", plainPlaceholder: "ここにテキストを入力", base64Text: "Base64", decode: "デコード", base64Placeholder: "Base64がここに表示されます", copyPlain: "テキストをコピー", copyBase64: "Base64をコピー", clear: "クリア", ready: "準備完了。", encoded: "テキストをエンコードしました。", decoded: "Base64をデコードしました。", copied: "コピーしました。", invalid: "有効なBase64テキストではありません。" },
    ko: { tools: "도구", languageLabel: "언어 변경", eyebrow: "텍스트 도구", intro: "텍스트를 Base64로 인코딩하거나 Base64를 다시 텍스트로 디코딩합니다. 모든 처리는 브라우저에서 이루어집니다.", plainText: "일반 텍스트", encode: "인코딩", plainPlaceholder: "여기에 텍스트 입력", base64Text: "Base64", decode: "디코딩", base64Placeholder: "Base64가 여기에 표시됩니다", copyPlain: "텍스트 복사", copyBase64: "Base64 복사", clear: "지우기", ready: "준비됨.", encoded: "텍스트가 인코딩되었습니다.", decoded: "Base64가 디코딩되었습니다.", copied: "복사됨.", invalid: "올바른 Base64 텍스트가 아닙니다." },
    es: { tools: "Herramientas", languageLabel: "Cambiar idioma", eyebrow: "HERRAMIENTA DE TEXTO", intro: "Codifica texto como Base64 o decodifica Base64 a texto. Todo permanece en tu navegador.", plainText: "Texto sin formato", encode: "Codificar", plainPlaceholder: "Escribe texto aquí", base64Text: "Base64", decode: "Decodificar", base64Placeholder: "Base64 aparece aquí", copyPlain: "Copiar texto", copyBase64: "Copiar Base64", clear: "Limpiar", ready: "Listo.", encoded: "Texto codificado.", decoded: "Base64 decodificado.", copied: "Copiado.", invalid: "No es un texto Base64 válido." },
    fr: { tools: "Outils", languageLabel: "Changer de langue", eyebrow: "OUTIL TEXTE", intro: "Encodez du texte en Base64 ou décodez du Base64 en texte. Tout reste dans votre navigateur.", plainText: "Texte brut", encode: "Encoder", plainPlaceholder: "Saisissez du texte ici", base64Text: "Base64", decode: "Décoder", base64Placeholder: "Le Base64 apparaît ici", copyPlain: "Copier le texte", copyBase64: "Copier le Base64", clear: "Effacer", ready: "Prêt.", encoded: "Texte encodé.", decoded: "Base64 décodé.", copied: "Copié.", invalid: "Ce texte Base64 n’est pas valide." },
    de: { tools: "Werkzeuge", languageLabel: "Sprache ändern", eyebrow: "TEXTWERKZEUG", intro: "Kodiere Text als Base64 oder dekodiere Base64 zurück in Text. Alles bleibt in deinem Browser.", plainText: "Klartext", encode: "Kodieren", plainPlaceholder: "Text hier eingeben", base64Text: "Base64", decode: "Dekodieren", base64Placeholder: "Base64 erscheint hier", copyPlain: "Text kopieren", copyBase64: "Base64 kopieren", clear: "Leeren", ready: "Bereit.", encoded: "Text kodiert.", decoded: "Base64 dekodiert.", copied: "Kopiert.", invalid: "Das ist kein gültiger Base64-Text." },
    pt: { tools: "Ferramentas", languageLabel: "Alterar idioma", eyebrow: "FERRAMENTA DE TEXTO", intro: "Codifique texto em Base64 ou decodifique Base64 de volta para texto. Tudo fica no navegador.", plainText: "Texto simples", encode: "Codificar", plainPlaceholder: "Digite o texto aqui", base64Text: "Base64", decode: "Decodificar", base64Placeholder: "O Base64 aparece aqui", copyPlain: "Copiar texto", copyBase64: "Copiar Base64", clear: "Limpar", ready: "Pronto.", encoded: "Texto codificado.", decoded: "Base64 decodificado.", copied: "Copiado.", invalid: "Esse não é um texto Base64 válido." },
    ru: { tools: "Инструменты", languageLabel: "Сменить язык", eyebrow: "ТЕКСТОВЫЙ ИНСТРУМЕНТ", intro: "Кодируйте текст в Base64 или декодируйте Base64 обратно в текст. Всё остаётся в браузере.", plainText: "Обычный текст", encode: "Кодировать", plainPlaceholder: "Введите текст здесь", base64Text: "Base64", decode: "Декодировать", base64Placeholder: "Base64 появится здесь", copyPlain: "Копировать текст", copyBase64: "Копировать Base64", clear: "Очистить", ready: "Готово.", encoded: "Текст закодирован.", decoded: "Base64 декодирован.", copied: "Скопировано.", invalid: "Это недопустимый текст Base64." },
    ar: { tools: "الأدوات", languageLabel: "تغيير اللغة", eyebrow: "أداة نص", intro: "رمّز النص بصيغة Base64 أو فك Base64 إلى نص. تبقى كل البيانات في متصفحك.", plainText: "نص عادي", encode: "ترميز", plainPlaceholder: "اكتب النص هنا", base64Text: "Base64", decode: "فك الترميز", base64Placeholder: "يظهر Base64 هنا", copyPlain: "نسخ النص", copyBase64: "نسخ Base64", clear: "مسح", ready: "جاهز.", encoded: "تم ترميز النص.", decoded: "تم فك Base64.", copied: "تم النسخ.", invalid: "هذا ليس نص Base64 صالحًا." }
  };
  const plain = document.querySelector("#plain");
  const encoded = document.querySelector("#encoded");
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
    status.classList.toggle("is-error", statusKey === "invalid");
  };
  const bytesToBase64 = (bytes) => {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  };
  const base64ToBytes = (value) => {
    const compact = value.replace(/\s+/g, "");
    if (!compact || !/^[A-Za-z0-9+/]*={0,2}$/.test(compact) || compact.length % 4 !== 0) throw new Error("invalid Base64");
    const binary = atob(compact);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  };
  document.querySelector("#encode").addEventListener("click", () => {
    encoded.value = bytesToBase64(new TextEncoder().encode(plain.value));
    statusKey = "encoded";
    render();
  });
  document.querySelector("#decode").addEventListener("click", () => {
    try {
      plain.value = new TextDecoder("utf-8", { fatal: true }).decode(base64ToBytes(encoded.value));
      statusKey = "decoded";
    } catch (_) {
      statusKey = "invalid";
    }
    render();
  });
  const copyValue = async (value) => { await navigator.clipboard.writeText(value); statusKey = "copied"; render(); };
  document.querySelector("#copy-plain").addEventListener("click", () => copyValue(plain.value));
  document.querySelector("#copy-base64").addEventListener("click", () => copyValue(encoded.value));
  document.querySelector("#clear").addEventListener("click", () => { plain.value = ""; encoded.value = ""; statusKey = "ready"; render(); plain.focus(); });
  languageButton.addEventListener("click", () => { const language = currentLanguage(); localStorage.setItem("muye-lang", languages[(languages.indexOf(language) + 1) % languages.length]); render(); });
  render();
})();
