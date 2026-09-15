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

function initScrollReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (!items.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );
  items.forEach((el) => observer.observe(el));
}

function initLightbox(): void {
  const lightbox = document.getElementById('lightbox');
  const img = lightbox?.querySelector<HTMLImageElement>('.lightbox-img');
  const closeBtn = lightbox?.querySelector<HTMLButtonElement>('.lightbox-close');
  const prevBtn = lightbox?.querySelector<HTMLButtonElement>('.lightbox-prev');
  const nextBtn = lightbox?.querySelector<HTMLButtonElement>('.lightbox-next');
  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lightbox-src]'));
  if (!lightbox || !img || !closeBtn || !prevBtn || !nextBtn || !triggers.length) return;

  let currentIndex = 0;
  let lastFocused: HTMLElement | null = null;

  const show = (index: number) => {
    currentIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[currentIndex];
    img.src = trigger.dataset.lightboxSrc ?? '';
    img.alt = trigger.dataset.lightboxAlt ?? '';
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  };

  const open = (index: number) => {
    lastFocused = document.activeElement as HTMLElement;
    show(index);
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  };

  function close(): void {
    lightbox!.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', onKeydown);
    setTimeout(() => {
      lightbox!.hidden = true;
      img!.src = '';
    }, 300);
    lastFocused?.focus();
  }

  triggers.forEach((trigger, i) => trigger.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(currentIndex - 1));
  nextBtn.addEventListener('click', () => show(currentIndex + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  let touchStartX = 0;
  let touchStartY = 0;
  img.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  img.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        show(currentIndex + (dx < 0 ? 1 : -1));
      }
    },
    { passive: true },
  );
}

function initCarousel(): void {
  document.querySelectorAll<HTMLElement>('.carousel').forEach((carousel) => {
    const track = carousel.querySelector<HTMLElement>('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll<HTMLElement>('.carousel-slide'));
    const prevBtn = carousel.querySelector<HTMLButtonElement>('.carousel-prev');
    const nextBtn = carousel.querySelector<HTMLButtonElement>('.carousel-next');
    const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('.carousel-dot'));
    if (!track || slides.length < 2) return;

    let activeIndex = 0;
    let autoplayTimer: ReturnType<typeof setInterval> | undefined;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    const autoplayMs = Number(carousel.dataset.autoplayMs) || 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setActive = (index: number) => {
      activeIndex = index;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    };

    const goTo = (index: number) => {
      const target = (index + slides.length) % slides.length;
      slides[target].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    const stopAutoplay = () => clearInterval(autoplayTimer);
    const startAutoplay = () => {
      if (!autoplayMs || reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(activeIndex + 1), autoplayMs);
    };
    const pauseAndScheduleResume = () => {
      stopAutoplay();
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAutoplay, 6000);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio <= 0.6) return;
          const index = slides.indexOf(entry.target as HTMLElement);
          if (index !== -1) setActive(index);
        });
      },
      { root: track, threshold: [0.6] },
    );
    slides.forEach((slide) => observer.observe(slide));

    prevBtn?.addEventListener('click', () => {
      pauseAndScheduleResume();
      goTo(activeIndex - 1);
    });
    nextBtn?.addEventListener('click', () => {
      pauseAndScheduleResume();
      goTo(activeIndex + 1);
    });
    dots.forEach((dot, i) =>
      dot.addEventListener('click', () => {
        pauseAndScheduleResume();
        goTo(i);
      }),
    );

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', pauseAndScheduleResume, { passive: true });

    setActive(0);
    startAutoplay();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initPhoneCopy();
  initScrollReveal();
  initLightbox();
  initCarousel();
});
