let muyeCaptchaToken = window.muyeCaptchaToken || "";
window.muyeCaptchaCallback = (token) => { muyeCaptchaToken = token; window.muyeCaptchaToken = token; };
const forms = document.querySelectorAll("[data-auth-form]");
let createEmailOwnerMode = false;

const authText = {
  en: { home: "Home", createAccount: "Create account", welcomeBack: "Welcome back", signUpTitle: "Sign up", signInTitle: "Sign in to muye.dev", needEmail: "Need a Muye email?", createEmail: "Create email", alreadyHave: "Already have one?", signIn: "Sign in", muyeMail: "Muye mail", requestHint: "Send Muye a short request. No outside email verification is needed.", ownerHint: "Signed in as owner. This will create the mailbox immediately.", email: "Email", request: "Request", requestPlaceholder: "A little text about who this is for and what name you want.", password: "Password", confirmPassword: "Confirm password", show: "Show", hide: "Hide", passwordPlaceholder: "At least 8 characters and one number", confirmPlaceholder: "Enter password again", sendRequest: "Send request", sendCode: "Send code", codeSent: "Code sent", creating: "Creating...", sending: "Sending...", requestSent: "Request sent", emailCreated: "Email created", createCopy: "Create email", enterName: "Enter the Muye email name you want.", enterRecoveryEmail: "Enter your verification email.", enterValidRecoveryEmail: "Enter a valid email address before sending a code.", validName: "Use only letters, numbers, dots, underscores, or hyphens for the email name.", shortRequest: "Your request must be at least 12 characters.", captcha: "Please complete the CAPTCHA.", serviceDown: "The mailbox service could not be reached. Please check your connection and try again.", createFailed: "We could not create that Muye email address.", codeSendFailed: "Could not send the code.", codeSentEmail: "Verification code sent by email.", passwordShort: "Password must be at least 8 characters and include a number.", passwordMismatch: "Passwords do not match.", authFailed: "Authentication could not load. Please refresh and try again.", confirmLabel: "Confirm password", missingFieldsSignUp: "Please enter your email and both password fields.", missingFieldsSignIn: "Please enter your email and password.", signInDetails: "Sign-in details received. Connect Clerk to authenticate." },
  zh: { home: "主页", createAccount: "创建账户", welcomeBack: "欢迎回来", signUpTitle: "注册", signInTitle: "登录 muye.dev", needEmail: "需要 Muye 邮箱？", createEmail: "创建邮箱", alreadyHave: "已经有了？", signIn: "登录", muyeMail: "Muye 邮箱", requestHint: "给 Muye 发送一个短请求。不需要外部邮箱验证。", ownerHint: "已作为站长登录，将立即创建邮箱。", email: "邮箱", request: "请求", requestPlaceholder: "写一点这是谁用、想要什么名字。", password: "密码", confirmPassword: "确认密码", show: "显示", hide: "隐藏", passwordPlaceholder: "至少 8 个字符", confirmPlaceholder: "再次输入密码", sendRequest: "发送请求", sendCode: "发送验证码", codeSent: "验证码已发送", creating: "创建中...", sending: "发送中...", requestSent: "请求已发送", emailCreated: "邮箱已创建", createCopy: "创建邮箱", enterName: "请输入想要的 Muye 邮箱名。", enterRecoveryEmail: "请输入验证邮箱。", enterValidRecoveryEmail: "发送验证码前请输入有效邮箱。", validName: "邮箱名只能使用字母、数字、点、下划线或连字符。", shortRequest: "请求至少需要 12 个字符。", captcha: "请完成人机验证。", serviceDown: "邮箱服务暂时无法连接，请检查网络后重试。", createFailed: "无法创建这个 Muye 邮箱。", codeSendFailed: "无法发送验证码。", codeSentEmail: "验证码已通过邮件发送。", passwordShort: "密码至少需要 8 个字符。", passwordMismatch: "两次密码不一致。", authFailed: "登录组件无法加载，请刷新后重试。", confirmLabel: "确认密码", missingFieldsSignUp: "请输入邮箱和两次密码。", missingFieldsSignIn: "请输入邮箱和密码。", signInDetails: "登录信息已收到，请连接 Clerk 完成登录。" },
};
Object.assign(authText.en, { continueMailbox: "Continue with Muye Mailbox", or: "or", mailboxEmail: "Muye email", mailboxPassword: "Password", continue: "Continue", cancel: "Cancel", mailboxChecking: "Checking your mailbox...", mailboxSigningIn: "Signing in...", mailboxCaptcha: "Please complete the CAPTCHA.", mailboxAuthError: "Could not continue with Muye Mailbox." });
Object.assign(authText.zh, { continueMailbox: "使用 Muye 邮箱继续", or: "或", mailboxEmail: "Muye 邮箱", mailboxPassword: "密码", continue: "继续", cancel: "取消", mailboxChecking: "正在验证邮箱...", mailboxSigningIn: "正在登录...", mailboxCaptcha: "请完成人机验证。", mailboxAuthError: "无法使用 Muye 邮箱继续。" });
const mailboxAuthText = {
  ja: { continueMailbox: "Muyeメールで続行", or: "または", mailboxEmail: "Muyeメール", mailboxPassword: "パスワード", continue: "続行", cancel: "キャンセル", mailboxChecking: "メールを確認中...", mailboxSigningIn: "ログイン中...", mailboxCaptcha: "CAPTCHAを完了してください。", mailboxAuthError: "Muyeメールで続行できません。" },
  ko: { continueMailbox: "Muye 메일로 계속", or: "또는", mailboxEmail: "Muye 메일", mailboxPassword: "비밀번호", continue: "계속", cancel: "취소", mailboxChecking: "메일 확인 중...", mailboxSigningIn: "로그인 중...", mailboxCaptcha: "CAPTCHA를 완료하세요.", mailboxAuthError: "Muye 메일로 계속할 수 없습니다." },
  es: { continueMailbox: "Continuar con Muye Mailbox", or: "o", mailboxEmail: "Correo Muye", mailboxPassword: "Contraseña", continue: "Continuar", cancel: "Cancelar", mailboxChecking: "Comprobando tu buzón...", mailboxSigningIn: "Iniciando sesión...", mailboxCaptcha: "Completa el CAPTCHA.", mailboxAuthError: "No se pudo continuar con Muye Mailbox." },
  fr: { continueMailbox: "Continuer avec Muye Mailbox", or: "ou", mailboxEmail: "E-mail Muye", mailboxPassword: "Mot de passe", continue: "Continuer", cancel: "Annuler", mailboxChecking: "Vérification de votre boîte...", mailboxSigningIn: "Connexion...", mailboxCaptcha: "Veuillez terminer le CAPTCHA.", mailboxAuthError: "Impossible de continuer avec Muye Mailbox." },
  de: { continueMailbox: "Mit Muye Mailbox fortfahren", or: "oder", mailboxEmail: "Muye-E-Mail", mailboxPassword: "Passwort", continue: "Fortfahren", cancel: "Abbrechen", mailboxChecking: "Postfach wird geprüft...", mailboxSigningIn: "Anmeldung...", mailboxCaptcha: "Bitte CAPTCHA abschließen.", mailboxAuthError: "Mit Muye Mailbox konnte nicht fortgefahren werden." },
  pt: { continueMailbox: "Continuar com Muye Mailbox", or: "ou", mailboxEmail: "Email Muye", mailboxPassword: "Senha", continue: "Continuar", cancel: "Cancelar", mailboxChecking: "Verificando seu email...", mailboxSigningIn: "Entrando...", mailboxCaptcha: "Conclua o CAPTCHA.", mailboxAuthError: "Não foi possível continuar com Muye Mailbox." },
  ru: { continueMailbox: "Продолжить с Muye Mailbox", or: "или", mailboxEmail: "Почта Muye", mailboxPassword: "Пароль", continue: "Продолжить", cancel: "Отмена", mailboxChecking: "Проверяем почту...", mailboxSigningIn: "Вход...", mailboxCaptcha: "Пройдите CAPTCHA.", mailboxAuthError: "Не удалось продолжить с Muye Mailbox." },
  ar: { continueMailbox: "المتابعة باستخدام Muye Mailbox", or: "أو", mailboxEmail: "بريد Muye", mailboxPassword: "كلمة المرور", continue: "متابعة", cancel: "إلغاء", mailboxChecking: "جارٍ التحقق من البريد...", mailboxSigningIn: "جارٍ تسجيل الدخول...", mailboxCaptcha: "يرجى إكمال CAPTCHA.", mailboxAuthError: "تعذرت المتابعة باستخدام Muye Mailbox." },
};
["ja", "ko", "es", "fr", "de", "pt", "ru", "ar"].forEach((code) => { authText[code] = { ...authText.en, ...mailboxAuthText[code] }; });

function authLang() {
  const saved = localStorage.getItem("muye-lang") || localStorage.getItem("localtalk-lang") || "en";
  return authText[saved] ? saved : "en";
}

function tt(key) {
  return authText[authLang()]?.[key] || authText.en[key] || key;
}

function applyAuthLanguage() {
  document.documentElement.lang = authLang();
  document.documentElement.dir = authLang() === "ar" ? "rtl" : "ltr";
  document.querySelector(".home-link") && (document.querySelector(".home-link").textContent = tt("home"));
  const mode = document.querySelector("[data-clerk-auth]")?.dataset.clerkAuth || document.querySelector("[data-auth-form]")?.dataset.authForm || "";
  if (mode === "sign-in") {
    document.querySelector(".eyebrow").textContent = tt("welcomeBack");
    document.querySelector("#auth-title").textContent = tt("signInTitle");
  } else if (mode === "sign-up") {
    document.querySelector(".eyebrow").textContent = tt("createAccount");
    document.querySelector("#auth-title").textContent = tt("signUpTitle");
  } else if (mode === "create-email") {
    document.querySelector(".eyebrow").textContent = tt("muyeMail");
    document.querySelector("#auth-title").textContent = tt("createEmail");
    document.querySelector("[data-request-only].field-hint").textContent = tt("requestHint");
    document.querySelector("[data-owner-only].field-hint").textContent = tt("ownerHint");
    document.querySelector('[name="emailName"]').closest("label").querySelector("span").textContent = tt("email");
    document.querySelector('[name="requestText"]').closest("label").querySelector("span").textContent = tt("request");
    document.querySelector('[name="requestText"]').placeholder = tt("requestPlaceholder");
    document.querySelector('[name="password"]').placeholder = tt("passwordPlaceholder");
    document.querySelector('[name="password"]').closest("label").querySelector("span").textContent = tt("password");
    document.querySelector('[name="passwordConfirm"]').placeholder = tt("confirmPlaceholder");
    document.querySelector('[name="passwordConfirm"]').closest("label").querySelector("span").textContent = tt("confirmPassword");
    document.querySelectorAll("[data-password-toggle]").forEach((button) => { button.textContent = tt("show"); button.setAttribute("aria-label", `${tt("show")} ${tt("password")}`); });
  }
  document.querySelector(".auth-switch") && (document.querySelector(".auth-switch").innerHTML = mode === "create-email" ? `${tt("alreadyHave")} <a href="/sign-in">${tt("signIn")}</a>` : `${tt("needEmail")} <a href="/create-email">${tt("createEmail")}</a>`);
  document.querySelector("[data-muye-mailbox-continue]") && (document.querySelector("[data-muye-mailbox-continue]").textContent = tt("continueMailbox"));
  document.querySelector("[data-muye-mailbox-or]") && (document.querySelector("[data-muye-mailbox-or]").textContent = tt("or"));
  document.querySelector("[data-muye-mailbox-email-label]") && (document.querySelector("[data-muye-mailbox-email-label]").textContent = tt("mailboxEmail"));
  document.querySelector("[data-muye-mailbox-password-label]") && (document.querySelector("[data-muye-mailbox-password-label]").textContent = tt("mailboxPassword"));
  document.querySelector("[data-muye-mailbox-submit]") && (document.querySelector("[data-muye-mailbox-submit]").textContent = tt("continue"));
  document.querySelector("[data-muye-mailbox-cancel]") && (document.querySelector("[data-muye-mailbox-cancel]").textContent = tt("cancel"));
}

const clerkAuth = document.querySelector("[data-clerk-auth]");
window.addEventListener("load", applyAuthLanguage);

async function waitForClerk() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (window.Clerk) return window.Clerk;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Clerk did not load. Check the production Frontend API DNS record.");
}
async function currentClerkToken() {
  if (!window.Clerk) return "";
  try {
    await window.Clerk.load?.();
    return await window.Clerk.session?.getToken?.();
  } catch {
    return "";
  }
}

async function currentClerkUserEmail() {
  if (!window.Clerk) return "";
  try {
    await window.Clerk.load?.();
    const user = window.Clerk.user;
    return String(user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "").toLowerCase();
  } catch {
    return "";
  }
}

function deviceId() {
  const key = "muye_device_id";
  let value = localStorage.getItem(key);
  if (!value) {
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    value = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    localStorage.setItem(key, value);
  }
  return value;
}

function safeAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get("redirect_url") || params.get("redirectUrl") || params.get("after_sign_in_url") || "/";
  try {
    const url = new URL(candidate, window.location.origin);
    return url.origin === window.location.origin ? `${url.pathname}${url.search}${url.hash}` : "/";
  } catch {
    return "/";
  }
}

async function waitForTurnstile() {
  if (!document.querySelector('script[data-muye-mailbox-turnstile-script]')) {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.muyeMailboxTurnstileScript = "true";
    document.head.appendChild(script);
  }
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (window.turnstile?.render) return window.turnstile;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("CAPTCHA could not load.");
}

function setupMailboxAuth() {
  const root = document.querySelector("[data-muye-mailbox-auth]");
  if (!root) return;
  const start = root.querySelector("[data-muye-mailbox-start]");
  const form = root.querySelector("[data-muye-mailbox-form]");
  const cancel = root.querySelector("[data-muye-mailbox-cancel]");
  const submit = root.querySelector("[data-muye-mailbox-submit]");
  const message = root.querySelector("[data-muye-mailbox-message]");
  const captchaBox = root.querySelector("[data-muye-mailbox-turnstile]");
  let captchaToken = "";
  let widgetId = null;

  const setMessage = (value, isError = false) => {
    message.textContent = value;
    message.classList.toggle("error", isError);
  };

  const renderCaptcha = async () => {
    if (widgetId !== null) return;
    const turnstile = await waitForTurnstile();
    widgetId = turnstile.render(captchaBox, {
      sitekey: "0x4AAAAAAEG-XIoYvPuejEbf",
      theme: "dark",
      size: "flexible",
      callback(token) { captchaToken = token; setMessage(""); },
      "expired-callback"() { captchaToken = ""; },
      "error-callback"() { captchaToken = ""; },
    });
  };

  start.addEventListener("click", async () => {
    start.hidden = true;
    form.hidden = false;
    form.querySelector('input[name="mailbox"]')?.focus();
    try {
      await renderCaptcha();
    } catch {
      setMessage(tt("mailboxAuthError"), true);
    }
  });

  cancel.addEventListener("click", () => {
    form.hidden = true;
    start.hidden = false;
    setMessage("");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!captchaToken) {
      setMessage(tt("mailboxCaptcha"), true);
      return;
    }
    const data = new FormData(form);
    submit.disabled = true;
    setMessage(tt("mailboxChecking"));
    try {
      const response = await fetch("/api/mailbox-clerk-auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mailbox: data.get("mailbox"), password: data.get("password"), captcha: captchaToken }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ticket) throw new Error(result.error || tt("mailboxAuthError"));

      setMessage(tt("mailboxSigningIn"));
      const clerk = await waitForClerk();
      await clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } });
      const attempt = await clerk.client.signIn.create({ strategy: "ticket", ticket: result.ticket });
      if (attempt.status !== "complete" || !attempt.createdSessionId) throw new Error(tt("mailboxAuthError"));
      await clerk.setActive({ session: attempt.createdSessionId });
      window.location.assign(safeAuthRedirect());
    } catch (error) {
      captchaToken = "";
      if (widgetId !== null) window.turnstile?.reset?.(widgetId);
      setMessage(error instanceof Error && error.message ? error.message : tt("mailboxAuthError"), true);
      submit.disabled = false;
    }
  });
}

setupMailboxAuth();

if (clerkAuth) {
  window.addEventListener("load", async () => {
    try {
      applyAuthLanguage();
      const clerk = await waitForClerk();
      const isSignIn = clerkAuth.dataset.clerkAuth === "sign-in";
      await clerk.load({
        ui: { ClerkUI: window.__internal_ClerkUICtor },
        localization: {
          signIn: {
            start: {
              title: tt("signInTitle"),
            },
          },
          signUp: {
            start: {
              title: tt("signUpTitle"),
            },
          },
        },
      });
      const commonProps = {
        routing: "path",
        path: isSignIn ? "/sign-in" : "/sign-up",
        signInUrl: "/sign-in",
        signUpUrl: "/sign-up",
        fallbackRedirectUrl: "/",
        signInFallbackRedirectUrl: "/",
        signUpFallbackRedirectUrl: "/",
      };

      if (isSignIn) {
        clerk.mountSignIn(clerkAuth, commonProps);
      } else {
        clerk.mountSignUp(clerkAuth, commonProps);
        installSignUpPasswordConfirm(clerkAuth);
      }
    } catch (error) {
      if (window.location.hostname.endsWith(".pages.dev")) {
        clerkAuth.innerHTML = 'Production sign-up is available at <a href="https://muye.dev/sign-up/">muye.dev/sign-up</a>.';
        return;
      }
      const detail = error instanceof Error && error.message ? ` (${error.message})` : "";
      clerkAuth.textContent = `${tt("authFailed")}${detail}`;
      console.error(error);
    }
  });
}

function installSignUpPasswordConfirm(root) {
  const ensure = () => {
    const password = root.querySelector('input[name="password"], input[type="password"]');
    const form = password?.closest("form");
    if (!password || !form || form.querySelector("[data-muye-password-confirm]")) return;
    const wrapper = document.createElement("label");
    wrapper.className = "muye-clerk-confirm";
    wrapper.innerHTML = `<span>${tt("confirmLabel")}</span><input data-muye-password-confirm type="password" autocomplete="new-password" required><small></small>`;
    password.closest("label, div")?.after(wrapper);
    form.addEventListener("submit", (event) => {
      const confirm = form.querySelector("[data-muye-password-confirm]");
      const note = wrapper.querySelector("small");
      if (confirm && password.value !== confirm.value) {
        event.preventDefault();
        event.stopImmediatePropagation();
        note.textContent = tt("passwordMismatch");
        confirm.focus();
      } else if (note) {
        note.textContent = "";
      }
    }, true);
  };
  ensure();
  new MutationObserver(ensure).observe(root, { childList: true, subtree: true });
}

document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const input = toggle.closest(".password-field")?.querySelector("input");
    if (!input) return;

    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    toggle.textContent = isVisible ? tt("show") : tt("hide");
    toggle.setAttribute("aria-label", `${isVisible ? tt("show") : tt("hide")} ${tt("password")}`);
  });
});

async function configureCreateEmailMode(form) {
  const ownerOnly = document.querySelectorAll("[data-owner-only]");
  const requestOnly = document.querySelectorAll("[data-request-only]");
  const submit = form.querySelector("[data-create-email-submit]");
  const email = await currentClerkUserEmail();
  createEmailOwnerMode = email === "muye@muye.dev";
  ownerOnly.forEach((element) => { element.hidden = !createEmailOwnerMode; });
  requestOnly.forEach((element) => { element.hidden = createEmailOwnerMode; });
  form.querySelectorAll('[name="password"], [name="passwordConfirm"]').forEach((input) => { input.required = true; });
  form.querySelectorAll("[data-request-only] textarea").forEach((input) => { input.required = !createEmailOwnerMode; });
  if (submit) submit.textContent = createEmailOwnerMode ? tt("createEmail") : tt("sendRequest");
}

forms.forEach((form) => {
  const sendCodeButton = form.querySelector("[data-send-code]");
  let verificationChallenge = "";
  const emailInput = form.querySelector('[name="verificationEmail"]');
  const codeInput = form.querySelector('[name="code"]');
  let verificationProof = "";

  function selectedVerificationMethod() {
    return "email";
  }

  function updateVerificationMethod() {
    if (codeInput) {
      codeInput.inputMode = "text";
      codeInput.pattern = "[A-Za-z0-9]{6}";
      codeInput.placeholder = "6-character code";
    }
    if (sendCodeButton) sendCodeButton.textContent = tt("sendCode");
  }

  emailInput?.addEventListener("input", updateVerificationMethod);
  updateVerificationMethod();

  if (form.dataset.authForm === "create-email") configureCreateEmailMode(form);

  sendCodeButton?.addEventListener("click", async () => {
    const message = form.querySelector(".auth-message");
    const formData = new FormData(form);
    const verificationEmail = String(formData.get("verificationEmail") || "").trim();

    message.classList.remove("error");
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verificationEmail);
    if (!verificationEmail) {
      message.textContent = tt("enterRecoveryEmail");
      message.classList.add("error");
      return;
    }

    if (!validEmail) {
      message.textContent = tt("enterValidRecoveryEmail");
      message.classList.add("error");
      return;
    }

    sendCodeButton.disabled = true;
    sendCodeButton.textContent = tt("sending");

    try {
      const response = await fetch("/api/send-email-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: verificationEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || tt("codeSendFailed"));

      verificationChallenge = result.challenge;
      verificationProof = "";
      sendCodeButton.textContent = tt("codeSent");
      message.textContent = tt("codeSentEmail");
    } catch (error) {
      sendCodeButton.disabled = false;
      sendCodeButton.textContent = tt("sendCode");
      message.textContent = error.message;
      message.classList.add("error");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = form.querySelector(".auth-message");
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const emailName = String(formData.get("emailName") || "").trim();
    const verificationEmail = String(formData.get("verificationEmail") || "").trim();
    const code = String(formData.get("code") || "").trim();
    const requestText = String(formData.get("requestText") || "").trim();
    const password = String(formData.get("password") || "");
    const passwordConfirm = String(formData.get("passwordConfirm") || "");
    const captcha = window.muyeCaptchaToken || muyeCaptchaToken || String(formData.get("cf-turnstile-response") || document.querySelector('input[name="cf-turnstile-response"]')?.value || window.turnstile?.getResponse?.() || "");
    const mode = form.dataset.authForm;

    message.classList.remove("error");

    if (mode === "create-email") {
      if (!emailName) {
        message.textContent = tt("enterName");
        message.classList.add("error");
        return;
      }

      if (!/^[a-zA-Z0-9._-]+$/.test(emailName)) {
        message.textContent = tt("validName");
        message.classList.add("error");
        return;
      }

      if (password.length < 8 || !/\d/.test(password)) {
        message.textContent = tt("passwordShort");
        message.classList.add("error");
        return;
      }

      if (password !== passwordConfirm) {
        message.textContent = tt("passwordMismatch");
        message.classList.add("error");
        return;
      }

      if (!createEmailOwnerMode && requestText.length < 12) {
        message.textContent = tt("shortRequest");
        message.classList.add("error");
        return;
      }

      if (!captcha) {
        message.textContent = tt("captcha");
        message.classList.add("error");
        return;
      }

      submitButton && (submitButton.disabled = true);
      if (submitButton) submitButton.textContent = createEmailOwnerMode ? tt("creating") : tt("sending");
      let createResponse;
      let createResult;
      try {
        const clerkToken = await currentClerkToken();
        createResponse = await fetch("/api/create-email", {
          method: "POST",
          headers: { "content-type": "application/json", ...(clerkToken ? { authorization: `Bearer ${clerkToken}` } : {}) },
          body: JSON.stringify({ emailName, requestText, password, captcha, deviceId: deviceId() }),
        });
        const responseText = await createResponse.text();
        try {
          createResult = JSON.parse(responseText);
        } catch {
          createResult = { error: `Server returned ${createResponse.status}.` };
        }
      } catch {
        message.textContent = tt("serviceDown");
        message.classList.add("error");
        submitButton && (submitButton.disabled = false);
        if (submitButton) submitButton.textContent = createEmailOwnerMode ? tt("createEmail") : tt("sendRequest");
        return;
      }
      if (!createResponse.ok) {
        message.textContent = createResult.error || tt("createFailed");
        message.classList.add("error");
        submitButton && (submitButton.disabled = false);
        if (submitButton) submitButton.textContent = createEmailOwnerMode ? tt("createEmail") : tt("sendRequest");
        return;
      }

      message.textContent = createResult.requested
        ? `Request sent for ${createResult.mailbox}.`
        : `${createResult.mailbox} is ready.`;
      if (createResult.requested) {
        form.reset();
        window.turnstile?.reset?.();
        window.muyeCaptchaExpired();
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = tt("sendRequest");
        }
        window.setTimeout(() => window.location.reload(), 700);
      } else if (submitButton) {
        submitButton.textContent = tt("emailCreated");
      }
      return;
    }

    if (!email || !password || (mode === "sign-up" && !passwordConfirm)) {
      message.textContent = mode === "sign-up" ? tt("missingFieldsSignUp") : tt("missingFieldsSignIn");
      message.classList.add("error");
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      message.textContent = tt("passwordShort");
      message.classList.add("error");
      return;
    }

    if (mode === "sign-up" && password !== passwordConfirm) {
      message.textContent = tt("passwordMismatch");
      message.classList.add("error");
      return;
    }

    message.textContent = mode === "sign-up"
      ? "Account details received. Connect Clerk to create users."
      : tt("signInDetails");
  });
});
