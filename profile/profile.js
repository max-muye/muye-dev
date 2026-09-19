const form = document.querySelector("#profile-form");
const message = document.querySelector("#profile-message");

function setMessage(text, error = false) {
  message.textContent = text;
  message.classList.toggle("error", error);
}

function displayNameFor(user) {
  return user?.unsafeMetadata?.displayName || user?.username || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "";
}

async function waitForClerk() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (window.Clerk) return window.Clerk;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Clerk did not load.");
}

window.addEventListener("load", async () => {
  try {
    const clerk = await waitForClerk();
    await clerk.load();
    if (!clerk.isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }
    form.displayName.value = displayNameFor(clerk.user);
  } catch (error) {
    setMessage(error.message || "Profile could not load. Please refresh and try again.", true);
  }
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const displayName = String(data.get("displayName") || "").trim();
  if (!displayName) return;
  setMessage("Saving...");
  try {
    await Clerk.user.update({ unsafeMetadata: { ...Clerk.user.unsafeMetadata, displayName } });
    await Clerk.user.reload?.();
    setMessage("Profile saved.");
  } catch (error) {
    setMessage(error.message || "Could not save the profile.", true);
  }
});
