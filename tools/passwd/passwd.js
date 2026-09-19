const encoder = new TextEncoder();
const algorithm = "pbkdf2_sha256";
const defaultIterations = 210000;

const languages = [
  "en",
  "zh",
  "ja",
  "ko",
  "es",
  "fr",
  "de",
  "pt",
  "ru",
  "ar",
];

const text = {
  en: {
    eyebrow: "Tools / Password Hash", title: "Password Hash", miscHome: "Tools Home", coder: "Coder", lambda: "Lambda Projects", hashExplainer: "What is a hash?",
    note: "Hashes are one-way. This page runs locally in your browser and does not send the password anywhere.",
    generateTitle: "Generate hash", verifyTitle: "Test password", password: "Password", iterations: "Iterations", iterationsAdvice: "Recommended: 10,000–1,200,000. Other positive values are allowed.", makeHash: "Make hash", hash: "Hash", copy: "Copy", copied: "Copied", storedHash: "Stored hash", testHash: "Test password", made: "Hash generated.", ok: "Password matches the hash.", bad: "Password does not match.", invalid: "That hash is not in the supported format.",
  },
  zh: {
    eyebrow: "杂项 / 密码哈希", title: "密码哈希", miscHome: "工具主页", coder: "编码器", lambda: "Lambda 项目", hashExplainer: "什么是哈希？",
    note: "哈希是单向的。这个页面只在你的浏览器里运行，不会把密码发送出去。",
    generateTitle: "生成哈希", verifyTitle: "测试密码", password: "密码", iterations: "迭代次数", iterationsAdvice: "建议：10,000–1,200,000。也可以使用其他正数。", makeHash: "生成哈希", hash: "哈希", copy: "复制", copied: "已复制", storedHash: "已保存的哈希", testHash: "测试密码", made: "哈希已生成。", ok: "密码匹配这个哈希。", bad: "密码不匹配。", invalid: "这个哈希格式不支持。",
  },
  ja: {
    eyebrow: "その他 / パスワードハッシュ", title: "パスワードハッシュ", miscHome: "ツールホーム", coder: "コーダー", lambda: "Lambda プロジェクト", hashExplainer: "ハッシュとは？",
    note: "ハッシュは一方向です。このページはブラウザ内だけで動き、パスワードを送信しません。",
    generateTitle: "ハッシュを生成", verifyTitle: "パスワードを確認", password: "パスワード", iterations: "反復回数", makeHash: "ハッシュ作成", hash: "ハッシュ", copy: "コピー", copied: "コピー済み", storedHash: "保存済みハッシュ", testHash: "確認", made: "ハッシュを生成しました。", ok: "パスワードは一致します。", bad: "パスワードは一致しません。", invalid: "このハッシュ形式は未対応です。",
  },
  ko: {
    eyebrow: "기타 / 비밀번호 해시", title: "비밀번호 해시", miscHome: "도구 홈", coder: "코더", lambda: "Lambda 프로젝트", hashExplainer: "해시란?",
    note: "해시는 단방향입니다. 이 페이지는 브라우저 안에서만 실행되고 비밀번호를 보내지 않습니다.",
    generateTitle: "해시 만들기", verifyTitle: "비밀번호 테스트", password: "비밀번호", iterations: "반복 횟수", makeHash: "해시 만들기", hash: "해시", copy: "복사", copied: "복사됨", storedHash: "저장된 해시", testHash: "테스트", made: "해시를 만들었습니다.", ok: "비밀번호가 해시와 일치합니다.", bad: "비밀번호가 일치하지 않습니다.", invalid: "지원하지 않는 해시 형식입니다.",
  },
  es: {
    eyebrow: "Más / Hash de contraseña", title: "Hash de contraseña", miscHome: "Más", coder: "Codificador", lambda: "Proyectos Lambda", hashExplainer: "¿Qué es un hash?",
    note: "Los hashes son de una sola vía. Esta página corre en tu navegador y no envía la contraseña.",
    generateTitle: "Generar hash", verifyTitle: "Probar contraseña", password: "Contraseña", iterations: "Iteraciones", makeHash: "Crear hash", hash: "Hash", copy: "Copiar", copied: "Copiado", storedHash: "Hash guardado", testHash: "Probar", made: "Hash generado.", ok: "La contraseña coincide.", bad: "La contraseña no coincide.", invalid: "Formato de hash no compatible.",
  },
};

["fr", "de", "pt", "ru", "ar"].forEach((code) => {
  text[code] = { ...text.es };
});

function currentLanguage() {
  const saved = localStorage.getItem("muye-lang") || "en";
  return languages.includes(saved) ? saved : "en";
}

function t(key) {
  return text[currentLanguage()]?.[key] || text.en[key] || key;
}

function setLanguage(code) {
  localStorage.setItem("muye-lang", code);
  applyLanguage();
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage();
  document.documentElement.dir = currentLanguage() === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
}

function bytesToBase64(bytes) {
  let value = "";
  bytes.forEach((byte) => { value += String.fromCharCode(byte); });
  return btoa(value);
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function randomSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

function parseHash(value) {
  const parts = String(value || "").trim().split("$");
  if (parts.length !== 4 || parts[0] !== algorithm) throw new Error("bad hash");
  const iterations = Number(parts[1]);
  if (!Number.isSafeInteger(iterations) || iterations < 1) throw new Error("bad iterations");
  return { iterations, salt: base64ToBytes(parts[2]), hash: base64ToBytes(parts[3]) };
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

function setStatus(message, className = "") {
  const status = document.querySelector("#status");
  status.className = `codec-status ${className}`.trim();
  status.textContent = message;
}

document.querySelector("#language-button").addEventListener("click", () => {
  const index = languages.indexOf(currentLanguage());
  setLanguage(languages[(index + 1) % languages.length]);
});

document.querySelector("#generate-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.querySelector("#generate-password").value;
  const rawIterations = Number(document.querySelector("#iterations").value);
  const iterations = Number.isSafeInteger(rawIterations) && rawIterations > 0 ? rawIterations : defaultIterations;
  const salt = randomSalt();
  const hash = await derive(password, salt, iterations);
  const output = `${algorithm}$${iterations}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`;
  document.querySelector("#generated-hash").value = output;
  document.querySelector("#verify-hash").value = output;
  setStatus(t("made"), "is-good");
});

document.querySelector("#verify-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const result = document.querySelector("#verify-result");
  try {
    const parsed = parseHash(document.querySelector("#verify-hash").value);
    const hash = await derive(document.querySelector("#verify-password").value, parsed.salt, parsed.iterations);
    const ok = timingSafeEqual(hash, parsed.hash);
    result.className = `codec-status ${ok ? "is-good" : "is-bad"}`;
    result.textContent = ok ? t("ok") : t("bad");
  } catch {
    result.className = "codec-status is-bad";
    result.textContent = t("invalid");
  }
});

document.querySelector("#copy-hash").addEventListener("click", async () => {
  const hash = document.querySelector("#generated-hash").value;
  if (!hash) return;
  await navigator.clipboard.writeText(hash);
  setStatus(t("copied"), "is-good");
});

applyLanguage();
