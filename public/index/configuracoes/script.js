(function () {
  const STORAGE_KEY = 'uml_theme'; // 'dark' | 'light'
  const btn = document.getElementById('btnTheme');

  // 1) Preferência salva OU do sistema (fallback)
  const saved = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = saved || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(theme);

  // 2) Alternar no clique
  btn?.addEventListener('click', () => {
    theme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  });

  // 3) Acompanhar mudança do sistema se o usuário não tiver fixado um tema
  if (!saved && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    // Safari antigo usa .addListener; navegadores modernos usam .addEventListener
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

    if (btn) {
      btn.setAttribute('aria-pressed', String(isLight));
      const icon = btn.querySelector('.icon');
      const label = btn.querySelector('.label');
      if (icon) icon.textContent = isLight ? '☀️' : '🌙';
      if (label) label.textContent = isLight ? 'Modo claro' : 'Modo escuro';
    }
  }
})();