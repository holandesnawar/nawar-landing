/* ══════════════════════════════════════════════════════════════
   HOLANDÉS CON NAWAR — LANDING JS (v4)
══════════════════════════════════════════════════════════════ */

/* ── Countdown (pricing) — sincronizado con el nav ────────────── */
(function initCountdown() {
  const STORAGE_KEY = 'nawar_offer_end_v2';
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  let endTs = localStorage.getItem(STORAGE_KEY);
  if (!endTs) { endTs = Date.now() + WEEK_MS; localStorage.setItem(STORAGE_KEY, endTs); }
  else { endTs = parseInt(endTs, 10); }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(diff) {
    if (diff <= 0) return '0d 00h 00m 00s';
    const s = Math.floor(diff / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24);
    return `${d}d ${pad(h % 24)}h ${pad(m % 60)}m ${pad(s % 60)}s`;
  }

  const priceEl = document.getElementById('price-countdown');
  function tick() {
    const remaining = endTs - Date.now();
    if (priceEl) priceEl.textContent = fmt(remaining);
    if (remaining <= 0) clearInterval(timer);
  }
  tick();
  const timer = setInterval(tick, 1000);
})();

/* ── Nav desktop: blur al hacer scroll + countdown ────────────── */
(function initDesktopNav() {
  window.addEventListener('scroll', function () {
    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  const STORAGE_KEY = 'nawar_offer_end_v2';
  let endTs = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (!endTs || isNaN(endTs)) { endTs = Date.now() + 7 * 24 * 60 * 60 * 1000; localStorage.setItem(STORAGE_KEY, endTs); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    let diff = endTs - Date.now(); if (diff < 0) diff = 0;
    const d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5), m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
    const el = document.getElementById('nav-desktop-timer');
    if (el) el.textContent = `${d}D ${pad(h)}H ${pad(m)}M ${pad(s)}S`;
    if (diff === 0) clearInterval(iv);
  }
  const iv = setInterval(tick, 1000); tick();
})();

/* ── Animaciones al hacer scroll ──────────────────────────────── */
(function initScrollAnimations() {
  const items = document.querySelectorAll('[data-anim]');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(el => el.hasAttribute('data-anim') && !el.classList.contains('visible'))
          : [entry.target];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx >= 0 ? idx * 70 : 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
})();

/* ── FAQ acordeón ─────────────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-q');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── Sticky CTA móvil: ocultar sobre el precio ────────────────── */
(function initMobileSticky() {
  const btn = document.getElementById('mobileStickyBtn');
  const pricing = document.getElementById('precio');
  if (!btn || !pricing) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => btn.classList.toggle('hidden', entry.isIntersecting));
  }, { threshold: 0.1 });
  observer.observe(pricing);
})();

/* ── Scroll suave para anclas ─────────────────────────────────── */
(function initSmoothScroll() {
  const OFFSET = 74 + 12;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── Animación de la barra de progreso del mockup ─────────────── */
(function animateProgress() {
  const fill = document.querySelector('.dv-fill');
  if (!fill) return;
  const target = fill.style.width || '65%';
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { fill.style.width = target; }, 350);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fill.style.width = '0%';
  observer.observe(fill);
})();
