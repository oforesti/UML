// script.js
(function () {
  const STORAGE_KEY = 'uml_theme'; // 'dark' | 'light'
  const btn = document.getElementById('btnTheme');
  const themeText = document.getElementById('theme-text');

  // Detecta a preferência salva ou a do sistema
  const saved = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = saved || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(theme);
  if (btn) btn.checked = theme === 'light';

  // Alterna o tema no clique
  btn?.addEventListener('change', () => {
    theme = btn.checked ? 'light' : 'dark';
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  });

  // Escuta a mudança no sistema
  if (!saved && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      theme = e.matches ? 'dark' : 'light';
      applyTheme(theme);
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  }

  function applyTheme(mode) {
    const isLight = mode === 'light';
    document.body.classList.toggle('theme-light', isLight);
    if (themeText) {
      // O texto agora é gerenciado pelo launcher.js
      // Esta parte foi comentada para evitar conflito
      // themeText.textContent = isLight ? 'Light Mode' : 'Dark Mode';
    }
  }
})();
