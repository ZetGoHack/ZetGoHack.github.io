document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.burger-toggle');
  const nav = document.querySelector('.header-nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('nav-open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-locked', isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  nav.querySelectorAll('a.current-page').forEach((link) => {
    link.addEventListener('click', (e) => e.preventDefault());
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.phone-number').forEach((el) => {
    const phone = el.textContent.trim();
    el.title = 'Copy';

    const badge = document.createElement('span');
    badge.className = 'copied-badge';
    badge.textContent = 'copied!';
    el.appendChild(badge);

    el.addEventListener('click', () => {
      navigator.clipboard?.writeText(phone).catch(() => {});
      badge.classList.add('visible');
      clearTimeout(el._copyTimeout);
      el._copyTimeout = setTimeout(() => {
        badge.classList.remove('visible');
      }, 750);
    });
  });
});
