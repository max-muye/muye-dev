(() => {
  const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
  const copy = {
    en: ["Tools", "Change language", "IMAGE TOOL", "Unicode Art", "Upload an image and turn it into a custom-sized grid of Unicode characters. Your image stays in your browser.", "Image", "Width (a)", "Height (b)", "Convert", "Image preview", "Unicode art", "Copy", "Download", "Choose an image to begin.", "Unicode art created.", "Unicode art copied.", "Unicode art downloaded.", "Please choose a valid image.", "Width and height must be positive whole numbers."],
    zh: ["工具", "切换语言", "图像工具", "Unicode 字符画", "上传图片并将它转换为自定义大小的 Unicode 字符网格。图片只会保留在浏览器中。", "图片", "宽度 (a)", "高度 (b)", "转换", "图片预览", "Unicode 字符画", "复制", "下载", "请选择一张图片开始。", "Unicode 字符画已生成。", "Unicode 字符画已复制。", "Unicode 字符画已下载。", "请选择有效的图片。", "宽度和高度必须是正整数。"],
    ja: ["ツール", "言語を変更", "画像ツール", "Unicodeアート", "画像をアップロードし、指定した大きさのUnicode文字グリッドに変換します。画像はブラウザ内だけで処理されます。", "画像", "幅 (a)", "高さ (b)", "変換", "画像プレビュー", "Unicodeアート", "コピー", "ダウンロード", "画像を選択してください。", "Unicodeアートを作成しました。", "Unicodeアートをコピーしました。", "Unicodeアートをダウンロードしました。", "有効な画像を選択してください。", "幅と高さは正の整数にしてください。"],
    ko: ["도구", "언어 변경", "이미지 도구", "유니코드 아트", "이미지를 업로드해 원하는 크기의 유니코드 문자 격자로 바꿉니다. 이미지는 브라우저 안에만 남습니다.", "이미지", "너비 (a)", "높이 (b)", "변환", "이미지 미리보기", "유니코드 아트", "복사", "다운로드", "시작할 이미지를 선택하세요.", "유니코드 아트를 만들었습니다.", "유니코드 아트를 복사했습니다.", "유니코드 아트를 다운로드했습니다.", "올바른 이미지를 선택하세요.", "너비와 높이는 양의 정수여야 합니다."],
    es: ["Herramientas", "Cambiar idioma", "HERRAMIENTA DE IMAGEN", "Arte Unicode", "Sube una imagen y conviértela en una cuadrícula de caracteres Unicode del tamaño que elijas. La imagen permanece en tu navegador.", "Imagen", "Ancho (a)", "Alto (b)", "Convertir", "Vista previa", "Arte Unicode", "Copiar", "Descargar", "Elige una imagen para comenzar.", "Arte Unicode creado.", "Arte Unicode copiado.", "Arte Unicode descargado.", "Elige una imagen válida.", "El ancho y el alto deben ser números enteros positivos."],
    fr: ["Outils", "Changer de langue", "OUTIL IMAGE", "Art Unicode", "Importez une image et transformez-la en grille de caractères Unicode aux dimensions choisies. L’image reste dans votre navigateur.", "Image", "Largeur (a)", "Hauteur (b)", "Convertir", "Aperçu de l’image", "Art Unicode", "Copier", "Télécharger", "Choisissez une image pour commencer.", "Art Unicode créé.", "Art Unicode copié.", "Art Unicode téléchargé.", "Choisissez une image valide.", "La largeur et la hauteur doivent être des entiers positifs."],
    de: ["Werkzeuge", "Sprache ändern", "BILDWERKZEUG", "Unicode-Kunst", "Lade ein Bild hoch und verwandle es in ein Unicode-Zeichenraster deiner gewünschten Größe. Das Bild bleibt im Browser.", "Bild", "Breite (a)", "Höhe (b)", "Umwandeln", "Bildvorschau", "Unicode-Kunst", "Kopieren", "Herunterladen", "Wähle zuerst ein Bild aus.", "Unicode-Kunst erstellt.", "Unicode-Kunst kopiert.", "Unicode-Kunst heruntergeladen.", "Bitte wähle ein gültiges Bild.", "Breite und Höhe müssen positive ganze Zahlen sein."],
    pt: ["Ferramentas", "Alterar idioma", "FERRAMENTA DE IMAGEM", "Arte Unicode", "Envie uma imagem e transforme-a em uma grade de caracteres Unicode com o tamanho escolhido. A imagem permanece no navegador.", "Imagem", "Largura (a)", "Altura (b)", "Converter", "Prévia da imagem", "Arte Unicode", "Copiar", "Baixar", "Escolha uma imagem para começar.", "Arte Unicode criada.", "Arte Unicode copiada.", "Arte Unicode baixada.", "Escolha uma imagem válida.", "A largura e a altura devem ser números inteiros positivos."],
    ru: ["Инструменты", "Сменить язык", "ИНСТРУМЕНТ ДЛЯ ИЗОБРАЖЕНИЙ", "Unicode-арт", "Загрузите изображение и превратите его в сетку символов Unicode выбранного размера. Изображение остаётся в браузере.", "Изображение", "Ширина (a)", "Высота (b)", "Преобразовать", "Предпросмотр", "Unicode-арт", "Копировать", "Скачать", "Выберите изображение, чтобы начать.", "Unicode-арт создан.", "Unicode-арт скопирован.", "Unicode-арт скачан.", "Выберите допустимое изображение.", "Ширина и высота должны быть положительными целыми числами."],
    ar: ["الأدوات", "تغيير اللغة", "أداة صور", "فن Unicode", "ارفع صورة وحوّلها إلى شبكة أحرف Unicode بالحجم الذي تختاره. تبقى الصورة داخل متصفحك.", "الصورة", "العرض (a)", "الارتفاع (b)", "تحويل", "معاينة الصورة", "فن Unicode", "نسخ", "تنزيل", "اختر صورة للبدء.", "تم إنشاء فن Unicode.", "تم نسخ فن Unicode.", "تم تنزيل فن Unicode.", "يرجى اختيار صورة صالحة.", "يجب أن يكون العرض والارتفاع عددين صحيحين موجبين."]
  };
  const keys = ["tools", "languageLabel", "eyebrow", "title", "intro", "image", "width", "height", "convert", "preview", "result", "copy", "download", "choose", "ready", "copied", "downloaded", "invalidImage", "invalidSize"];
  Object.keys(copy).forEach((language) => { copy[language] = Object.fromEntries(keys.map((key, index) => [key, copy[language][index]])); });

  const input = document.querySelector("#image");
  const widthInput = document.querySelector("#art-width");
  const heightInput = document.querySelector("#art-height");
  const preview = document.querySelector("#preview");
  const art = document.querySelector("#art");
  const canvas = document.querySelector("#sampler");
  const status = document.querySelector("#status");
  const languageButton = document.querySelector("#language");
  const ramp = Array.from("█▓▒░ ");
  let image = null;
  let imageUrl = "";
  let statusKey = "choose";

  const currentLanguage = () => languages.includes(localStorage.getItem("muye-lang")) ? localStorage.getItem("muye-lang") : "en";
  const renderLanguage = () => {
    const language = currentLanguage();
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = copy[language][node.dataset.i18n]; });
    document.querySelectorAll("[data-i18n-label]").forEach((node) => { node.setAttribute("aria-label", copy[language][node.dataset.i18nLabel]); });
    languageButton.textContent = language === "zh" ? "中A" : "A中";
    status.textContent = copy[language][statusKey];
    status.classList.toggle("is-error", statusKey.startsWith("invalid"));
  };
  const setStatus = (key) => { statusKey = key; renderLanguage(); };
  const dimensions = () => {
    const width = Number(widthInput.value);
    const height = Number(heightInput.value);
    return Number.isSafeInteger(width) && width > 0 && Number.isSafeInteger(height) && height > 0 ? { width, height } : null;
  };
  const convert = () => {
    if (!image) return setStatus("invalidImage");
    const size = dimensions();
    if (!size) return setStatus("invalidSize");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.fillStyle = "#fff";
    context.fillRect(0, 0, size.width, size.height);
    context.drawImage(image, 0, 0, size.width, size.height);
    const pixels = context.getImageData(0, 0, size.width, size.height).data;
    const lines = [];
    for (let y = 0; y < size.height; y += 1) {
      let line = "";
      for (let x = 0; x < size.width; x += 1) {
        const offset = (y * size.width + x) * 4;
        const alpha = pixels[offset + 3] / 255;
        const light = (0.2126 * pixels[offset] + 0.7152 * pixels[offset + 1] + 0.0722 * pixels[offset + 2]) * alpha + 255 * (1 - alpha);
        line += ramp[Math.min(ramp.length - 1, Math.floor(light / 256 * ramp.length))];
      }
      lines.push(line.replace(/\s+$/, ""));
    }
    art.textContent = lines.join("\n");
    art.style.fontSize = `${Math.max(4, Math.min(12, 720 / size.width))}px`;
    setStatus("ready");
  };

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file || !file.type.startsWith("image/")) return setStatus("invalidImage");
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = URL.createObjectURL(file);
    const nextImage = new Image();
    nextImage.onload = () => { image = nextImage; preview.src = imageUrl; preview.alt = file.name; preview.classList.add("is-visible"); convert(); };
    nextImage.onerror = () => setStatus("invalidImage");
    nextImage.src = imageUrl;
  });
  document.querySelector("#convert").addEventListener("click", convert);
  document.querySelector("#copy").addEventListener("click", async () => { if (!art.textContent) return setStatus("invalidImage"); await navigator.clipboard.writeText(art.textContent); setStatus("copied"); });
  document.querySelector("#download").addEventListener("click", () => {
    if (!art.textContent) return setStatus("invalidImage");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([art.textContent], { type: "text/plain;charset=utf-8" }));
    link.download = "unicode-art.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus("downloaded");
  });
  languageButton.addEventListener("click", () => { const language = currentLanguage(); localStorage.setItem("muye-lang", languages[(languages.indexOf(language) + 1) % languages.length]); renderLanguage(); });
  renderLanguage();
})();
