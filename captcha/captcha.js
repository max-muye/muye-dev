const form = document.querySelector("#captcha-form");
const result = document.querySelector("#captcha-result");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  result.textContent = window.MuyePageI18n?.t("checking") || "checking...";
  result.classList.remove("error");
  const token = window.turnstile?.getResponse?.() || "";
  try {
    const response = await fetch("/api/captcha-test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    result.textContent = data.valid ? "true" : "false";
    result.classList.toggle("error", !data.valid);
    if (!data.valid && data.reason) result.textContent = `false (${data.reason})`;
  } catch {
    result.textContent = "false";
    result.classList.add("error");
  }
});
