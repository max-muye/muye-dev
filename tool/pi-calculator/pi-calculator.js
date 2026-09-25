(() => {
  const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
  const copy = {
    en: { tools: "Tools", languageLabel: "Change language", eyebrow: "NUMBER TOOL", title: "π Calculator", intro: "Calculate decimal places of π locally in your browser.", digits: "Decimal places", calculate: "Calculate", hint: "Enter any positive whole number.", result: "Result", copy: "Copy", ready: "Ready.", calculating: "Calculating…", complete: "Calculated {digits} decimal places.", copied: "Copied.", invalid: "Enter a positive whole number." },
    zh: { tools: "工具", languageLabel: "切换语言", eyebrow: "数字工具", title: "π 计算器", intro: "在浏览器中本地计算 π 的小数位。", digits: "小数位数", calculate: "计算", hint: "请输入任意正整数。", result: "结果", copy: "复制", ready: "准备就绪。", calculating: "正在计算…", complete: "已计算 {digits} 位小数。", copied: "已复制。", invalid: "请输入正整数。" },
    ja: { tools: "ツール", languageLabel: "言語を変更", eyebrow: "数値ツール", title: "π 計算機", intro: "ブラウザ内でπの小数桁を計算します。", digits: "小数桁数", calculate: "計算", hint: "任意の正の整数を入力してください。", result: "結果", copy: "コピー", ready: "準備完了。", calculating: "計算中…", complete: "小数点以下{digits}桁を計算しました。", copied: "コピーしました。", invalid: "正の整数を入力してください。" },
    ko: { tools: "도구", languageLabel: "언어 변경", eyebrow: "숫자 도구", title: "π 계산기", intro: "브라우저에서 π의 소수 자릿수를 계산합니다.", digits: "소수 자릿수", calculate: "계산", hint: "양의 정수를 입력하세요.", result: "결과", copy: "복사", ready: "준비됨.", calculating: "계산 중…", complete: "소수점 이하 {digits}자리를 계산했습니다.", copied: "복사됨.", invalid: "양의 정수를 입력하세요." },
    es: { tools: "Herramientas", languageLabel: "Cambiar idioma", eyebrow: "HERRAMIENTA NUMÉRICA", title: "Calculadora de π", intro: "Calcula decimales de π localmente en tu navegador.", digits: "Decimales", calculate: "Calcular", hint: "Introduce cualquier número entero positivo.", result: "Resultado", copy: "Copiar", ready: "Listo.", calculating: "Calculando…", complete: "Se calcularon {digits} decimales.", copied: "Copiado.", invalid: "Introduce un número entero positivo." },
    fr: { tools: "Outils", languageLabel: "Changer de langue", eyebrow: "OUTIL NUMÉRIQUE", title: "Calculateur de π", intro: "Calculez les décimales de π localement dans votre navigateur.", digits: "Décimales", calculate: "Calculer", hint: "Saisissez un nombre entier positif.", result: "Résultat", copy: "Copier", ready: "Prêt.", calculating: "Calcul en cours…", complete: "{digits} décimales calculées.", copied: "Copié.", invalid: "Saisissez un nombre entier positif." },
    de: { tools: "Werkzeuge", languageLabel: "Sprache ändern", eyebrow: "ZAHLENWERKZEUG", title: "π-Rechner", intro: "Berechne Nachkommastellen von π lokal in deinem Browser.", digits: "Nachkommastellen", calculate: "Berechnen", hint: "Gib eine beliebige positive ganze Zahl ein.", result: "Ergebnis", copy: "Kopieren", ready: "Bereit.", calculating: "Berechnung…", complete: "{digits} Nachkommastellen berechnet.", copied: "Kopiert.", invalid: "Gib eine positive ganze Zahl ein." },
    pt: { tools: "Ferramentas", languageLabel: "Alterar idioma", eyebrow: "FERRAMENTA NUMÉRICA", title: "Calculadora de π", intro: "Calcule casas decimais de π localmente no navegador.", digits: "Casas decimais", calculate: "Calcular", hint: "Digite qualquer número inteiro positivo.", result: "Resultado", copy: "Copiar", ready: "Pronto.", calculating: "Calculando…", complete: "Foram calculadas {digits} casas decimais.", copied: "Copiado.", invalid: "Digite um número inteiro positivo." },
    ru: { tools: "Инструменты", languageLabel: "Сменить язык", eyebrow: "ЧИСЛОВОЙ ИНСТРУМЕНТ", title: "Калькулятор π", intro: "Вычисляйте знаки π локально в браузере.", digits: "Знаки после запятой", calculate: "Вычислить", hint: "Введите любое положительное целое число.", result: "Результат", copy: "Копировать", ready: "Готово.", calculating: "Вычисление…", complete: "Вычислено знаков: {digits}.", copied: "Скопировано.", invalid: "Введите положительное целое число." },
    ar: { tools: "الأدوات", languageLabel: "تغيير اللغة", eyebrow: "أداة أرقام", title: "حاسبة π", intro: "احسب المنازل العشرية لـ π محليًا في متصفحك.", digits: "المنازل العشرية", calculate: "احسب", hint: "أدخل أي عدد صحيح موجب.", result: "النتيجة", copy: "نسخ", ready: "جاهز.", calculating: "جارٍ الحساب…", complete: "تم حساب {digits} منزلة عشرية.", copied: "تم النسخ.", invalid: "أدخل عددًا صحيحًا موجبًا." }
  };

  const digitsInput = document.querySelector("#digits");
  const calculateButton = document.querySelector("#calculate");
  const copyButton = document.querySelector("#copy");
  const output = document.querySelector("#output");
  const status = document.querySelector("#status");
  const languageButton = document.querySelector("#language");
  let statusKey = "ready";
  let statusDigits = 0;

  const currentLanguage = () => {
    const saved = localStorage.getItem("muye-lang") || "en";
    return languages.includes(saved) ? saved : "en";
  };
  const message = (key) => copy[currentLanguage()][key].replace("{digits}", String(statusDigits));
  const render = () => {
    const language = currentLanguage();
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = copy[language][node.dataset.i18n];
    });
    document.querySelectorAll("[data-i18n-label]").forEach((node) => {
      node.setAttribute("aria-label", copy[language][node.dataset.i18nLabel]);
    });
    languageButton.textContent = language === "zh" ? "中A" : "A中";
    status.textContent = message(statusKey);
    document.title = `${copy[language].title} · Muye`;
  };

  const sqrt = (value) => {
    if (value < 0n) throw new Error("negative square root");
    if (value < 2n) return value;
    let x0 = 1n << ((BigInt(value.toString(2).length) + 1n) >> 1n);
    let x1 = (x0 + value / x0) >> 1n;
    while (x1 < x0) {
      x0 = x1;
      x1 = (x0 + value / x0) >> 1n;
    }
    return x0;
  };

  const calculatePi = (places) => {
    const precision = places + 20;
    const scale = 10n ** BigInt(precision);
    let m = 1n;
    let l = 13591409n;
    let x = 1n;
    let k = 6n;
    let sum = l * scale;
    const terms = Math.ceil(precision / 14) + 1;
    for (let i = 1n; i < BigInt(terms); i += 1n) {
      m = (m * (k * k * k - 16n * k)) / (i * i * i);
      l += 545140134n;
      x *= -262537412640768000n;
      sum += (m * l * scale) / x;
      k += 12n;
    }
    const c = 426880n * sqrt(10005n * scale * scale);
    const raw = (c * scale / sum).toString().padStart(precision + 1, "0");
    return `${raw[0]}.${raw.slice(1, places + 1)}`;
  };

  calculateButton.addEventListener("click", () => {
    const places = Number(digitsInput.value);
    if (!Number.isInteger(places) || places < 1) {
      statusKey = "invalid";
      render();
      return;
    }
    statusKey = "calculating";
    render();
    calculateButton.disabled = true;
    window.setTimeout(() => {
      output.textContent = calculatePi(places);
      statusDigits = places;
      statusKey = "complete";
      calculateButton.disabled = false;
      render();
    }, 20);
  });

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(output.textContent);
    statusKey = "copied";
    render();
  });

  languageButton.addEventListener("click", () => {
    const language = currentLanguage();
    localStorage.setItem("muye-lang", languages[(languages.indexOf(language) + 1) % languages.length]);
    render();
  });

  render();
})();
