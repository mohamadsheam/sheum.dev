(() => {
  "use strict";

  const storageKey = "sheum-theme";
  const root = document.documentElement;
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
  const getSavedTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };
  const savedTheme = getSavedTheme();
  const initialTheme = savedTheme || (systemPreference.matches ? "dark" : "light");

  root.dataset.theme = initialTheme;

  document.addEventListener("DOMContentLoaded", () => {
    const copyrightYear = document.querySelector("#copyright-year");
    if (copyrightYear) {
      const currentYear = String(new Date().getFullYear());
      copyrightYear.textContent = currentYear;
      copyrightYear.dateTime = currentYear;
    }

    const toggle = document.querySelector("#theme-toggle");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (!toggle) return;

    function applyTheme(theme, persist = false) {
      root.dataset.theme = theme;
      const isDark = theme === "dark";
      const label = isDark ? "Switch to light mode" : "Switch to dark mode";
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.title = label;
      if (themeColor) themeColor.content = theme === "dark" ? "#121a16" : "#f6f5f0";
      if (persist) {
        try {
          localStorage.setItem(storageKey, theme);
        } catch {
          return;
        }
      }
    }

    applyTheme(initialTheme);
    toggle.addEventListener("click", () => {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
    document.querySelectorAll(".mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        link.closest(".mobile-menu")?.removeAttribute("open");
      });
    });
    systemPreference.addEventListener("change", (event) => {
      if (!getSavedTheme()) applyTheme(event.matches ? "dark" : "light");
    });
  });
})();
