/* ══════════════════════════════════════════════════════════════
   HOLANDÉS CON NAWAR — LANDING PAGE JS
══════════════════════════════════════════════════════════════ */

/* ── Pricing / Final-CTA Countdown (syncs with mobile nav timer) ── */
(function initCountdown() {
  const STORAGE_KEY = 'nawar_offer_end_v2';
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  let endTs = localStorage.getItem(STORAGE_KEY);
  if (!endTs) {
    endTs = Date.now() + WEEK_MS;
    localStorage.setItem(STORAGE_KEY, endTs);
  } else {
    endTs = parseInt(endTs, 10);
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function fmt(diff) {
    if (diff <= 0) return '00:00:00:00';
    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    return `${d}d ${pad(h % 24)}h ${pad(m % 60)}m ${pad(s % 60)}s`;
  }

  const priceEl = document.getElementById('price-countdown');
  const finalEl = document.getElementById('final-countdown');

  function tick() {
    const remaining = endTs - Date.now();
    const str = fmt(remaining);
    if (priceEl) priceEl.textContent = str;
    if (finalEl) finalEl.textContent = '⏰ Precio de lanzamiento termina en: ' + str;
    if (remaining <= 0) clearInterval(timer);
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

/* ── Scroll Animations (IntersectionObserver) ────────────────── */
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
        const delay = idx >= 0 ? idx * 80 : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  items.forEach(el => observer.observe(el));
})();

/* ── Desktop Nav: sticky blur + countdown ────────────────────── */
(function initDesktopNav() {
  // Scroll blur
  window.addEventListener('scroll', function() {
    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Timer (same key as mobile nav)
  const STORAGE_KEY = 'nawar_offer_end_v2';
  let endTs = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (!endTs || isNaN(endTs)) {
    endTs = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, endTs);
  }
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function tick() {
    let diff = endTs - Date.now();
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / (24*60*60*1000));
    const h = Math.floor((diff % (24*60*60*1000)) / (60*60*1000));
    const m = Math.floor((diff % (60*60*1000)) / (60*1000));
    const s = Math.floor((diff % (60*1000)) / 1000);
    const el = document.getElementById('nav-desktop-timer');
    if (el) el.textContent = `${d}D ${pad(h)}H ${pad(m)}M ${pad(s)}S`;
    if (diff === 0) clearInterval(iv);
  }
  const iv = setInterval(tick, 1000);
  tick();
})();

/* ── FAQ Accordion ───────────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        const rect = item.getBoundingClientRect();
        if (rect.top < 80) {
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });
})();

/* ── Mobile Sticky CTA — hide when pricing visible ───────────── */
(function initMobileSticky() {
  const btn = document.getElementById('mobileStickyBtn');
  const pricing = document.getElementById('precio');
  if (!btn || !pricing) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        btn.classList.add('hidden');
      } else {
        btn.classList.remove('hidden');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(pricing);
})();

/* ── Smooth scroll for anchor links ─────────────────────────── */
(function initSmoothScroll() {
  const OFFSET = 72 + 16;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── Progress bar animation on mockup ───────────────────────── */
(function animateMockupProgress() {
  const fill = document.querySelector('.mockup-progress-fill');
  if (!fill) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { fill.style.width = '65%'; }, 400);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fill.style.width = '0%';
  observer.observe(fill);
})();
