/* ══════════════════════════════════════════════════════════════
   HOLANDÉS CON NAWAR — LANDING PAGE JS
══════════════════════════════════════════════════════════════ */

/* ── Countdown Timer ─────────────────────────────────────────── */
(function initCountdown() {
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const STORAGE_KEY = 'nw_offer_end_v1';

  let endDate = localStorage.getItem(STORAGE_KEY);
  if (!endDate || isNaN(Date.parse(endDate))) {
    endDate = new Date(Date.now() + WEEK_MS).toISOString();
    localStorage.setItem(STORAGE_KEY, endDate);
  }

  const end = new Date(endDate).getTime();

  function pad(n) { return String(n).padStart(2, '0'); }

  function formatCountdown(ms) {
    if (ms <= 0) return { days: '0', hours: '00', mins: '00', secs: '00', str: '00:00:00' };
    const s   = Math.floor(ms / 1000);
    const m   = Math.floor(s / 60);
    const h   = Math.floor(m / 60);
    const d   = Math.floor(h / 24);
    return {
      days:  String(d),
      hours: pad(h % 24),
      mins:  pad(m % 60),
      secs:  pad(s % 60),
      str:   `${pad(d)}d ${pad(h % 24)}h ${pad(m % 60)}m ${pad(s % 60)}s`,
    };
  }

  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
    mini:  document.getElementById('price-countdown'),
    final: document.getElementById('final-countdown'),
  };

  function tick() {
    const remaining = end - Date.now();
    const c = formatCountdown(remaining);

    if (els.days)  els.days.textContent  = c.days;
    if (els.hours) els.hours.textContent = c.hours;
    if (els.mins)  els.mins.textContent  = c.mins;
    if (els.secs)  els.secs.textContent  = c.secs;
    if (els.mini)  els.mini.textContent  = c.str;
    if (els.final) els.final.textContent = c.str;

    if (remaining <= 0) {
      clearInterval(timer);
      // Reset for new week
      const newEnd = new Date(Date.now() + WEEK_MS).toISOString();
      localStorage.setItem(STORAGE_KEY, newEnd);
    }
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

/* ── Scroll Animations (IntersectionObserver) ────────────────── */
(function initScrollAnimations() {
  const items = document.querySelectorAll('[data-anim]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
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

/* ── Sticky Nav ──────────────────────────────────────────────── */
(function initStickyNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ── FAQ Accordion ───────────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        // Smooth scroll if below viewport
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
      btn.style.opacity = entry.isIntersecting ? '0' : '1';
      btn.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.1 });

  observer.observe(pricing);
})();

/* ── Smooth scroll for anchor links ─────────────────────────── */
(function initSmoothScroll() {
  const OFFSET = 64 + 48; // nav + banner
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET - 16;
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
        setTimeout(() => {
          fill.style.width = '65%';
        }, 400);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fill.style.width = '0%';
  observer.observe(fill);
})();
