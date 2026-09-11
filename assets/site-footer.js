(() => {
  const languages = ["en", "zh", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar"];
  const labels = {
    en: "Built for Cloudflare Pages.",
    zh: "为 Cloudflare Pages 构建。",
    ja: "Cloudflare Pages で構築。",
    ko: "Cloudflare Pages로 제작.",
    es: "Creado para Cloudflare Pages.",
    fr: "Construit pour Cloudflare Pages.",
    de: "Gebaut für Cloudflare Pages.",
    pt: "Criado para Cloudflare Pages.",
    ru: "Создано для Cloudflare Pages.",
    ar: "مصمم لـ Cloudflare Pages."
  };

  function currentLanguage() {
    const saved = localStorage.getItem("muye-lang") || localStorage.getItem("localtalk-lang") || "en";
    return languages.includes(saved) ? saved : "en";
  }

  function syncExistingFooter(lang) {
    document.querySelectorAll("[data-footer-built]").forEach((node) => {
      node.textContent = labels[lang] || labels.en;
    });
  }

  function buildFooter() {
    if (document.querySelector("footer")) {
      syncExistingFooter(currentLanguage());
      return;
    }

    const footer = document.createElement("footer");
    footer.className = "muye-site-footer";
    footer.innerHTML = '<div class="muye-site-footer-inner"><span><span class="muye-site-footer-copy"></span> <span data-footer-built></span></span><a href="mailto:muye@muye.dev">muye@muye.dev</a><button class="muye-site-footer-language" type="button" aria-label="Change language">A中</button></div>';
    document.body.appendChild(footer);

    const copy = footer.querySelector(".muye-site-footer-copy");
    const langButton = footer.querySelector(".muye-site-footer-language");

    function render() {
      const lang = currentLanguage();
      copy.textContent = `© ${new Date().getFullYear()} Muye.`;
      syncExistingFooter(lang);
      langButton.textContent = lang === "zh" ? "中A" : "A中";
      document.documentElement.lang = lang;
    }

    langButton.addEventListener("click", () => {
      const lang = currentLanguage();
      const next = languages[(languages.indexOf(lang) + 1) % languages.length];
      localStorage.setItem("muye-lang", next);
      localStorage.setItem("localtalk-lang", next === "zh" ? "zh" : "en");
      window.dispatchEvent(new CustomEvent("muye-language-change", { detail: { lang: next } }));
      render();
    });

    window.addEventListener("storage", render);
    window.addEventListener("muye-language-change", render);
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildFooter);
  } else {
    buildFooter();
  }
})();
