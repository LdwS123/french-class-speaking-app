// Mode sombre togglable. Persiste dans localStorage.
// Usage : <button data-theme-toggle>...</button>
// Ajoute la classe `theme-dark` sur <html>.

(function () {
  'use strict';

  const KEY = 'fco-theme';

  function current() {
    const v = localStorage.getItem(KEY);
    if (v === 'dark' || v === 'light') return v;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function apply(theme) {
    const html = document.documentElement;
    if (theme === 'dark') html.classList.add('theme-dark');
    else html.classList.remove('theme-dark');
    localStorage.setItem(KEY, theme);
    syncButtons(theme);
  }

  function toggle() {
    const t = current() === 'dark' ? 'light' : 'dark';
    apply(t);
    return t;
  }

  function syncButtons(theme) {
    const btns = document.querySelectorAll('[data-theme-toggle]');
    btns.forEach(b => {
      b.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      b.textContent = theme === 'dark' ? '☀️ Clair' : '🌙 Sombre';
    });
  }

  // Apply au chargement, le plus tot possible.
  apply(current());

  function wire() {
    syncButtons(current());
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-theme-toggle]');
      if (!t) return;
      e.preventDefault();
      toggle();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  window.FrenchTheme = { current, apply, toggle };
})();
