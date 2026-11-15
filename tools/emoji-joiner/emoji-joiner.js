(() => {
  const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
  const copy = {
    en: { tools:"Tools", languageLabel:"Change language", eyebrow:"UNICODE TOOL", title:"Emoji Joiner", intro:"Combine emoji pieces with a zero-width joiner (ZWJ) to build a sequence such as 👩‍❤️‍👩. Everything runs in your browser.", exampleCouple:"👩‍❤️‍👩 Couple", exampleTechnologist:"👩‍💻 Technologist", exampleFamily:"👨‍👩‍👧 Family", partsLabel:"Parts — one emoji or text piece per line", partsPlaceholder:"👩\n❤️\n👩", useZwj:"Join with zero-width joiner (U+200D)", clear:"Clear", result:"Result", copy:"Copy result", detailsTitle:"Why does it contain several characters?", detailsText:"A joined emoji can contain multiple Unicode code points: the visible emoji pieces plus U+200D, a zero-width joiner that asks a compatible system to display them as one symbol. The sequence may look different across platforms.", ready:"Ready.", copied:"Copied.", empty:"Add at least one piece to see the result.", metrics:(n,b)=>`${n} Unicode code points · ${b} UTF-8 bytes`, points:"Code points" },
    zh: { tools:"工具", languageLabel:"切换语言", eyebrow:"UNICODE 工具", title:"表情连接器", intro:"使用零宽连接符（ZWJ）组合表情，例如 👩‍❤️‍👩。所有处理都在浏览器中完成。", exampleCouple:"👩‍❤️‍👩 情侣", exampleTechnologist:"👩‍💻 技术人员", exampleFamily:"👨‍👩‍👧 家庭", partsLabel:"组成片段 — 每行输入一个表情或文本片段", partsPlaceholder:"👩\n❤️\n👩", useZwj:"使用零宽连接符（U+200D）连接", clear:"清除", result:"结果", copy:"复制结果", detailsTitle:"为什么它包含多个字符？", detailsText:"组合表情可能由多个 Unicode 码点组成：可见的表情片段，以及 U+200D 零宽连接符。支持该序列的系统会尝试将它显示成一个符号。不同平台的显示可能不同。", ready:"准备就绪。", copied:"已复制。", empty:"至少添加一个片段以查看结果。", metrics:(n,b)=>`${n} 个 Unicode 码点 · ${b} 个 UTF-8 字节`, points:"码点" },
    ja: { tools:"ツール", languageLabel:"言語を変更", eyebrow:"UNICODEツール", title:"絵文字ジョイナー", intro:"ゼロ幅接合子（ZWJ）で絵文字を組み合わせ、👩‍❤️‍👩 のようなシーケンスを作ります。処理はブラウザー内で完結します。", exampleCouple:"👩‍❤️‍👩 カップル", exampleTechnologist:"👩‍💻 技術者", exampleFamily:"👨‍👩‍👧 家族", partsLabel:"パーツ — 1行に絵文字またはテキストを1つ", partsPlaceholder:"👩\n❤️\n👩", useZwj:"ゼロ幅接合子（U+200D）でつなぐ", clear:"クリア", result:"結果", copy:"結果をコピー", detailsTitle:"なぜ複数の文字でできているの？", detailsText:"結合絵文字は、見える絵文字と、対応するシステムに1つの記号として表示するよう伝えるゼロ幅接合子 U+200D など、複数のUnicodeコードポイントを含みます。表示はプラットフォームによって異なります。", ready:"準備完了。", copied:"コピーしました。", empty:"結果を見るにはパーツを1つ以上追加してください。", metrics:(n,b)=>`Unicodeコードポイント ${n} 個 · UTF-8 ${b} バイト`, points:"コードポイント" },
    ko: { tools:"도구", languageLabel:"언어 변경", eyebrow:"UNICODE 도구", title:"이모지 조합기", intro:"제로폭 결합자(ZWJ)로 이모지를 조합해 👩‍❤️‍👩 같은 시퀀스를 만드세요. 모든 처리는 브라우저에서 이루어집니다.", exampleCouple:"👩‍❤️‍👩 커플", exampleTechnologist:"👩‍💻 기술자", exampleFamily:"👨‍👩‍👧 가족", partsLabel:"구성 요소 — 한 줄에 이모지 또는 텍스트 하나", partsPlaceholder:"👩\n❤️\n👩", useZwj:"제로폭 결합자(U+200D)로 연결", clear:"지우기", result:"결과", copy:"결과 복사", detailsTitle:"왜 여러 문자로 이루어져 있나요?", detailsText:"결합 이모지는 보이는 이모지 조각과 U+200D 제로폭 결합자 등 여러 유니코드 코드 포인트를 포함할 수 있습니다. 이를 지원하는 시스템은 하나의 기호로 표시하려고 합니다. 플랫폼마다 모양이 다를 수 있습니다.", ready:"준비됨.", copied:"복사됨.", empty:"결과를 보려면 구성 요소를 하나 이상 추가하세요.", metrics:(n,b)=>`유니코드 코드 포인트 ${n}개 · UTF-8 ${b}바이트`, points:"코드 포인트" },
    es: { tools:"Herramientas", languageLabel:"Cambiar idioma", eyebrow:"HERRAMIENTA UNICODE", title:"Unidor de emojis", intro:"Combina emojis con un unidor de ancho cero (ZWJ) para crear secuencias como 👩‍❤️‍👩. Todo se procesa en tu navegador.", exampleCouple:"👩‍❤️‍👩 Pareja", exampleTechnologist:"👩‍💻 Tecnóloga", exampleFamily:"👨‍👩‍👧 Familia", partsLabel:"Piezas — un emoji o texto por línea", partsPlaceholder:"👩\n❤️\n👩", useZwj:"Unir con un unidor de ancho cero (U+200D)", clear:"Limpiar", result:"Resultado", copy:"Copiar resultado", detailsTitle:"¿Por qué contiene varios caracteres?", detailsText:"Un emoji unido puede incluir varios puntos de código Unicode: las piezas visibles y U+200D, un unidor de ancho cero que pide a los sistemas compatibles que las muestren como un símbolo. Puede verse distinto según la plataforma.", ready:"Listo.", copied:"Copiado.", empty:"Añade al menos una pieza para ver el resultado.", metrics:(n,b)=>`${n} puntos de código Unicode · ${b} bytes UTF-8`, points:"Puntos de código" },
    fr: { tools:"Outils", languageLabel:"Changer de langue", eyebrow:"OUTIL UNICODE", title:"Assembleur d’émojis", intro:"Combinez des émojis avec un liant sans chasse (ZWJ) pour créer une séquence comme 👩‍❤️‍👩. Tout reste dans votre navigateur.", exampleCouple:"👩‍❤️‍👩 Couple", exampleTechnologist:"👩‍💻 Technologue", exampleFamily:"👨‍👩‍👧 Famille", partsLabel:"Éléments — un émoji ou texte par ligne", partsPlaceholder:"👩\n❤️\n👩", useZwj:"Lier avec le liant sans chasse (U+200D)", clear:"Effacer", result:"Résultat", copy:"Copier le résultat", detailsTitle:"Pourquoi plusieurs caractères ?", detailsText:"Un émoji lié peut contenir plusieurs points de code Unicode : les émojis visibles et U+200D, un liant sans chasse qui demande aux systèmes compatibles de les afficher comme un seul symbole. Le rendu varie selon la plateforme.", ready:"Prêt.", copied:"Copié.", empty:"Ajoutez au moins un élément pour voir le résultat.", metrics:(n,b)=>`${n} points de code Unicode · ${b} octets UTF-8`, points:"Points de code" },
    de: { tools:"Werkzeuge", languageLabel:"Sprache ändern", eyebrow:"UNICODE-WERKZEUG", title:"Emoji-Verbinder", intro:"Verbinde Emoji-Teile mit einem unsichtbaren Verbindungszeichen (ZWJ) zu einer Folge wie 👩‍❤️‍👩. Alles läuft im Browser.", exampleCouple:"👩‍❤️‍👩 Paar", exampleTechnologist:"👩‍💻 Technologin", exampleFamily:"👨‍👩‍👧 Familie", partsLabel:"Teile — ein Emoji oder Text pro Zeile", partsPlaceholder:"👩\n❤️\n👩", useZwj:"Mit unsichtbarem Verbindungszeichen (U+200D) verbinden", clear:"Leeren", result:"Ergebnis", copy:"Ergebnis kopieren", detailsTitle:"Warum besteht es aus mehreren Zeichen?", detailsText:"Ein verbundenes Emoji kann mehrere Unicode-Codepoints enthalten: sichtbare Emoji-Teile und U+200D, ein unsichtbares Verbindungszeichen, das kompatible Systeme zur Darstellung als ein Symbol auffordert. Die Darstellung variiert je nach Plattform.", ready:"Bereit.", copied:"Kopiert.", empty:"Füge mindestens ein Teil hinzu, um das Ergebnis zu sehen.", metrics:(n,b)=>`${n} Unicode-Codepoints · ${b} UTF-8-Bytes`, points:"Codepoints" },
    pt: { tools:"Ferramentas", languageLabel:"Alterar idioma", eyebrow:"FERRAMENTA UNICODE", title:"Juntador de emojis", intro:"Combine partes de emojis com um juntor de largura zero (ZWJ) para criar sequências como 👩‍❤️‍👩. Tudo acontece no navegador.", exampleCouple:"👩‍❤️‍👩 Casal", exampleTechnologist:"👩‍💻 Profissional de tecnologia", exampleFamily:"👨‍👩‍👧 Família", partsLabel:"Partes — um emoji ou texto por linha", partsPlaceholder:"👩\n❤️\n👩", useZwj:"Juntar com o juntor de largura zero (U+200D)", clear:"Limpar", result:"Resultado", copy:"Copiar resultado", detailsTitle:"Por que há vários caracteres?", detailsText:"Um emoji combinado pode conter vários pontos de código Unicode: as partes visíveis e U+200D, um juntor de largura zero que pede aos sistemas compatíveis para exibi-los como um símbolo. A aparência pode variar entre plataformas.", ready:"Pronto.", copied:"Copiado.", empty:"Adicione pelo menos uma parte para ver o resultado.", metrics:(n,b)=>`${n} pontos de código Unicode · ${b} bytes UTF-8`, points:"Pontos de código" },
    ru: { tools:"Инструменты", languageLabel:"Сменить язык", eyebrow:"ИНСТРУМЕНТ UNICODE", title:"Сборщик эмодзи", intro:"Соединяйте части эмодзи невидимым соединителем (ZWJ), чтобы создать последовательность вроде 👩‍❤️‍👩. Всё работает в браузере.", exampleCouple:"👩‍❤️‍👩 Пара", exampleTechnologist:"👩‍💻 Технолог", exampleFamily:"👨‍👩‍👧 Семья", partsLabel:"Части — одно эмодзи или фрагмент текста в каждой строке", partsPlaceholder:"👩\n❤️\n👩", useZwj:"Соединять невидимым соединителем (U+200D)", clear:"Очистить", result:"Результат", copy:"Скопировать результат", detailsTitle:"Почему в нём несколько символов?", detailsText:"Объединённое эмодзи может состоять из нескольких кодовых точек Unicode: видимых частей и U+200D — невидимого соединителя, который просит совместимую систему показать их как один символ. На разных платформах вид может отличаться.", ready:"Готово.", copied:"Скопировано.", empty:"Добавьте хотя бы одну часть, чтобы увидеть результат.", metrics:(n,b)=>`${n} кодовых точек Unicode · ${b} байт UTF-8`, points:"Кодовые точки" },
    ar: { tools:"الأدوات", languageLabel:"تغيير اللغة", eyebrow:"أداة UNICODE", title:"موصّل الرموز التعبيرية", intro:"ادمج أجزاء الرموز التعبيرية باستخدام رابط بعرض صفري (ZWJ) لإنشاء تسلسل مثل 👩‍❤️‍👩. تتم المعالجة في متصفحك.", exampleCouple:"👩‍❤️‍👩 زوجان", exampleTechnologist:"👩‍💻 تقنيّة", exampleFamily:"👨‍👩‍👧 عائلة", partsLabel:"الأجزاء — رمز تعبيري أو مقطع نصي واحد في كل سطر", partsPlaceholder:"👩\n❤️\n👩", useZwj:"الربط باستخدام رابط بعرض صفري (U+200D)", clear:"مسح", result:"النتيجة", copy:"نسخ النتيجة", detailsTitle:"لماذا يتكوّن من عدة محارف؟", detailsText:"قد يحتوي الرمز التعبيري المركّب على عدة نقاط ترميز Unicode: الأجزاء الظاهرة وU+200D، وهو رابط بعرض صفري يطلب من الأنظمة المتوافقة عرضها كرمز واحد. قد يختلف الشكل حسب المنصة.", ready:"جاهز.", copied:"تم النسخ.", empty:"أضف جزءًا واحدًا على الأقل لعرض النتيجة.", metrics:(n,b)=>`${n} نقاط ترميز Unicode · ${b} بايت UTF-8`, points:"نقاط الترميز" }
  };
  const parts = document.querySelector("#parts");
  const preview = document.querySelector("#preview");
  const metrics = document.querySelector("#metrics");
  const codepoints = document.querySelector("#codepoints");
  const status = document.querySelector("#status");
  const languageButton = document.querySelector("#language");
  const useZwj = document.querySelector("#use-zwj");
  let statusKey = "ready";
  let lastResult = "";
  const currentLanguage = () => languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
  const renderLanguage = () => {
    const language = currentLanguage();
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = `${copy[language].title} · Muye`;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy[language][node.dataset.i18n]; });
    document.querySelectorAll("[data-i18n-label]").forEach((node) => { node.setAttribute("aria-label", copy[language][node.dataset.i18nLabel]); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = copy[language][node.dataset.i18nPlaceholder]; });
    languageButton.textContent = language === "zh" ? "中A" : "A中";
    status.textContent = copy[language][statusKey];
    metrics.textContent = lastResult ? copy[language].metrics(Array.from(lastResult).length, new TextEncoder().encode(lastResult).length) : "";
    if (lastResult) codepoints.textContent = `${copy[language].points}: ${Array.from(lastResult, (character) => `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`).join(" · ")}`;
  };
  const update = () => {
    const pieces = parts.value.split(/\r?\n/).map((part) => part.trim()).filter(Boolean);
    lastResult = pieces.join(useZwj.checked ? "\u200D" : "");
    preview.textContent = lastResult;
    statusKey = pieces.length ? "ready" : "empty";
    renderLanguage();
  };
  const examples = {
    couple: ["👩", "❤️", "👩"],
    technologist: ["👩", "💻"],
    family: ["👨", "👩", "👧"]
  };
  document.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => { parts.value = examples[button.dataset.example].join("\n"); useZwj.checked = true; update(); }));
  parts.addEventListener("input", update);
  useZwj.addEventListener("change", update);
  document.querySelector("#clear").addEventListener("click", () => { parts.value = ""; update(); parts.focus(); });
  document.querySelector("#copy").addEventListener("click", async () => {
    if (!lastResult) return;
    try { await navigator.clipboard.writeText(lastResult); statusKey = "copied"; renderLanguage(); }
    catch (_) { statusKey = "ready"; status.textContent = copy[currentLanguage()].ready; }
  });
  languageButton.addEventListener("click", () => { const language = currentLanguage(); localStorage.setItem("muye-lang", languages[(languages.indexOf(language) + 1) % languages.length]); renderLanguage(); });
  parts.value = "👩\n❤️\n👩";
  update();
})();
