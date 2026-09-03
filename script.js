const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const homeClerkProfile = document.querySelector("#home-clerk-profile");
const heroTitle = document.querySelector("#hero-title");
let currentHeroName = "";

async function waitForClerk() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (window.Clerk) return window.Clerk;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Clerk did not load.");
}

function displayNameFor(user) {
  return user?.unsafeMetadata?.displayName || user?.username || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "there";
}

function renderSignedInHero(name) {
  currentHeroName = name;
  heroTitle.innerHTML = `Hi, <a class="hero-name-link" href="/profile/">${escapeHtml(name)}</a>`;
  heroTitle.classList.remove("hero-prompt");
  heroTitle.classList.add("hero-greeting");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function showUserNameForm() {
  const existing = document.querySelector("#hero-name-form");
  if (existing) {
    existing.querySelector("input")?.focus();
    return;
  }
  heroTitle.insertAdjacentHTML("afterend", `
    <form class="hero-name-form" id="hero-name-form">
      <label>
        <span>Username</span>
        <input name="username" type="text" value="${escapeHtml(currentHeroName)}" autocomplete="username" required>
      </label>
      <button class="button primary" type="submit">Save</button>
      <button class="button secondary" id="cancel-name-button" type="button">Cancel</button>
      <p class="hero-name-message" id="hero-name-message" role="status" aria-live="polite"></p>
    </form>`);
  const form = document.querySelector("#hero-name-form");
  form.querySelector("input")?.focus();
  form.addEventListener("submit", updateUserName);
  document.querySelector("#cancel-name-button")?.addEventListener("click", () => form.remove());
}

async function updateUserName(event) {
  event.preventDefault();
  if (!window.Clerk?.user) return;
  const form = event.currentTarget;
  const message = form.querySelector("#hero-name-message");
  const trimmed = String(new FormData(form).get("username") || "").trim();
  if (!trimmed) return;
  message.textContent = "Saving...";
  try {
    await Clerk.user.update({ username: trimmed });
  } catch (error) {
    try {
      await Clerk.user.update({ firstName: trimmed });
    } catch {
      message.textContent = "Could not save that username.";
      return;
    }
  }
  await Clerk.user.reload?.();
  form.remove();
  renderSignedInHero(trimmed);
}

window.addEventListener("load", async () => {
  if (!heroTitle || !homeClerkProfile) return;

  try {
    const clerk = await waitForClerk();
    await clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } });
    if (!clerk.isSignedIn) return;

    const user = clerk.user;
    renderSignedInHero(displayNameFor(user));
    homeClerkProfile.hidden = false;
    if (!homeClerkProfile.dataset.mounted) {
      if (typeof clerk.mountUserButton === "function") {
        clerk.mountUserButton(homeClerkProfile, { afterSignOutUrl: "/" });
        setTimeout(() => {
          if (!homeClerkProfile.childElementCount) mountAccountFallback(clerk);
        }, 1200);
      } else {
        mountAccountFallback(clerk);
      }
      homeClerkProfile.dataset.mounted = "true";
    }
    document.querySelectorAll(".nav-auth.sign-in, .nav-auth.sign-up").forEach((link) => {
      link.hidden = true;
    });
  } catch (error) {
    console.error(error);
  }
});

function mountAccountFallback(clerk) {
  homeClerkProfile.innerHTML = '<button class="clerk-fallback-button" type="button" aria-label="Account">Account</button>';
  homeClerkProfile.querySelector("button")?.addEventListener("click", () => clerk.openUserProfile?.());
}
