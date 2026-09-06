function initBurgerMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.burger-toggle');
  const nav = document.querySelector<HTMLElement>('.header-nav');
  if (!toggle || !nav) return;

  const setOpen = (open: boolean) => {
    nav.classList.toggle('nav-open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-locked', open);
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  nav.querySelectorAll<HTMLAnchorElement>('a[aria-current="page"]').forEach((link) => {
    link.addEventListener('click', (e) => e.preventDefault());
  });
}

function initPhoneCopy(): void {
  document.querySelectorAll<HTMLElement>('.phone-number').forEach((el) => {
    const phone = el.textContent?.trim() ?? '';
    el.title = 'Copy';

    const badge = document.createElement('span');
    badge.className = 'copied-badge';
    badge.textContent = 'copied!';
    el.appendChild(badge);

    let timer: ReturnType<typeof setTimeout> | undefined;
    el.addEventListener('click', () => {
      navigator.clipboard?.writeText(phone).catch(() => {});
      badge.classList.add('visible');
      clearTimeout(timer);
      timer = setTimeout(() => badge.classList.remove('visible'), 750);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initPhoneCopy();
});
