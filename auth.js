let muyeCaptchaToken = window.muyeCaptchaToken || "";
window.muyeCaptchaCallback = (token) => { muyeCaptchaToken = token; window.muyeCaptchaToken = token; };
const forms = document.querySelectorAll("[data-auth-form]");
let createEmailOwnerMode = false;

const clerkAuth = document.querySelector("[data-clerk-auth]");
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

if (clerkAuth) {
  async function waitForClerk() {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (window.Clerk) return window.Clerk;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error("Clerk did not load. Check the production Frontend API DNS record.");
  }

  window.addEventListener("load", async () => {
    try {
      const clerk = await waitForClerk();
      const isSignIn = clerkAuth.dataset.clerkAuth === "sign-in";
      await clerk.load({
        ui: { ClerkUI: window.__internal_ClerkUICtor },
        localization: isSignIn ? {
          signIn: {
            start: {
              title: "Sign in to muye.dev",
            },
          },
        } : undefined,
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
      clerkAuth.textContent = `Authentication could not load. Please refresh and try again.${detail}`;
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
    wrapper.innerHTML = '<span>Confirm password</span><input data-muye-password-confirm type="password" autocomplete="new-password" required><small></small>';
    password.closest("label, div")?.after(wrapper);
    form.addEventListener("submit", (event) => {
      const confirm = form.querySelector("[data-muye-password-confirm]");
      const note = wrapper.querySelector("small");
      if (confirm && password.value !== confirm.value) {
        event.preventDefault();
        event.stopImmediatePropagation();
        note.textContent = "Passwords do not match.";
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
    toggle.textContent = isVisible ? "Show" : "Hide";
    toggle.setAttribute("aria-label", `${isVisible ? "Show" : "Hide"} password`);
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
  form.querySelectorAll("[data-owner-only] input").forEach((input) => { input.required = createEmailOwnerMode; });
  form.querySelectorAll("[data-request-only] textarea").forEach((input) => { input.required = !createEmailOwnerMode; });
  if (submit) submit.textContent = createEmailOwnerMode ? "Create email" : "Send request";
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
    if (sendCodeButton) sendCodeButton.textContent = "Send code";
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
      message.textContent = "Enter your verification email.";
      message.classList.add("error");
      return;
    }

    if (!validEmail) {
      message.textContent = "Enter a valid email address before sending a code.";
      message.classList.add("error");
      return;
    }

    sendCodeButton.disabled = true;
    sendCodeButton.textContent = "Sending...";

    try {
      const response = await fetch("/api/send-email-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: verificationEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send the code.");

      verificationChallenge = result.challenge;
      verificationProof = "";
      sendCodeButton.textContent = "Code sent";
      message.textContent = "Verification code sent by email.";
    } catch (error) {
      sendCodeButton.disabled = false;
      sendCodeButton.textContent = "Send code";
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
        message.textContent = "Enter the Muye email name you want.";
        message.classList.add("error");
        return;
      }

      if (!/^[a-zA-Z0-9._-]+$/.test(emailName)) {
        message.textContent = "Use only letters, numbers, dots, underscores, or hyphens for the email name.";
        message.classList.add("error");
        return;
      }

      if (createEmailOwnerMode) {
        if (password.length < 8) {
          message.textContent = "Password must be at least 8 characters.";
          message.classList.add("error");
          return;
        }

        if (password !== passwordConfirm) {
          message.textContent = "Passwords do not match.";
          message.classList.add("error");
          return;
        }
      } else if (requestText.length < 12) {
        message.textContent = "Write a short request with what you want this email for.";
        message.classList.add("error");
        return;
      }

      if (!captcha) {
        message.textContent = "Please complete the CAPTCHA.";
        message.classList.add("error");
        return;
      }

      submitButton && (submitButton.disabled = true);
      if (submitButton) submitButton.textContent = createEmailOwnerMode ? "Creating..." : "Sending...";
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
        message.textContent = "The mailbox service could not be reached. Please check your connection and try again.";
        message.classList.add("error");
        submitButton && (submitButton.disabled = false);
        if (submitButton) submitButton.textContent = createEmailOwnerMode ? "Create email" : "Send request";
        return;
      }
      if (!createResponse.ok) {
        message.textContent = createResult.error || "We could not create that Muye email address.";
        message.classList.add("error");
        submitButton && (submitButton.disabled = false);
        if (submitButton) submitButton.textContent = createEmailOwnerMode ? "Create email" : "Send request";
        return;
      }

      message.textContent = createResult.requested
        ? `Request sent for ${createResult.mailbox}.`
        : `${createResult.mailbox} is ready.`;
      if (submitButton) submitButton.textContent = createResult.requested ? "Request sent" : "Email created";
      return;
    }

    if (!email || !password || (mode === "sign-up" && !passwordConfirm)) {
      message.textContent = mode === "sign-up" ? "Please enter your email and both password fields." : "Please enter your email and password.";
      message.classList.add("error");
      return;
    }

    if (password.length < 8) {
      message.textContent = "Password must be at least 8 characters.";
      message.classList.add("error");
      return;
    }

    if (mode === "sign-up" && password !== passwordConfirm) {
      message.textContent = "Passwords do not match.";
      message.classList.add("error");
      return;
    }

    message.textContent = mode === "sign-up"
      ? "Account details received. Connect Clerk to create users."
      : "Sign-in details received. Connect Clerk to authenticate.";
  });
});
