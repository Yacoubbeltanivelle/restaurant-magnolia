/* =============================================
   MAGNOLIA — Enhanced Script
   21st.dev inspired effects:
   · Spotlight (Aceternity)
   · 3D Tilt (Aceternity Card Hover)
   · Magnetic Buttons
   · Character Split + GSAP Stagger
   · Aurora Orb Mouse Tracking
   · Animated Tab Indicator
   · Scroll Progress Bar
   ============================================= */

'use strict';

/* ════════════════════════════
   LOADER
═════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('out');
      initHeroAnimation();
    }, 1500);
  });
}


/* ════════════════════════════
   HERO — GSAP + CHAR SPLIT
═════════════════════════════ */
function splitChars(el) {
  if (el.children.length) return;
  const text = el.textContent;
  // Wrap in a no-wrap container so characters never break across lines
  el.style.whiteSpace = 'nowrap';
  el.innerHTML = text.split('').map(ch =>
    `<span class="char" style="display:inline-block;will-change:transform,opacity">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');
}

function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const titleEl = document.getElementById('h-title');
  if (titleEl) splitChars(titleEl);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('#h-eyebrow', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.85 })
    .fromTo('#h-title',   { opacity: 1 }, { opacity: 1, duration: 0.01 }, '-=0.2')
    .fromTo('#h-title .char',
      { opacity: 0, y: 80, rotateX: -90, transformOrigin: 'center bottom' },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 0.7, ease: 'back.out(1.5)' },
    '-=0.3')
    .fromTo('#h-tagline', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
    .fromTo('#h-cta',     { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .fromTo('#h-scroll',  { opacity: 0 },         { opacity: 1, duration: 0.6 },       '-=0.2');

  /* Parallax hero image */
  gsap.to('#hero-img', {
    yPercent: 22, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* Parallax quote image */
  gsap.to('#quote-img', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '.quote-section', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  /* Section titles — subtle upward reveal */
  gsap.utils.toArray('.split-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  /* Staggered dish rows */
  gsap.utils.toArray('.dish').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
    );
  });

  /* Gallery items */
  gsap.utils.toArray('.gallery-item').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.7, delay: i * 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: '#gallery', start: 'top 78%', once: true } }
    );
  });

  /* Highlights cards */
  gsap.utils.toArray('.hl-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.highlights', start: 'top 82%', once: true } }
    );
  });

  /* Hours rows */
  gsap.utils.toArray('.hours-row').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, delay: i * 0.07,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
    );
  });
}


/* ════════════════════════════
   NAVBAR
═════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  document.getElementById('burger')?.addEventListener('click', toggleMobileMenu);
}

/* Mobile menu */
let mobileOverlay = null;
function createMobileMenu() {
  const ov = document.createElement('div');
  ov.className = 'mobile-overlay'; ov.id = 'mobile-overlay';
  ov.innerHTML = `
    <a href="#about">À propos</a>
    <a href="#menu">La carte</a>
    <a href="#gallery">Galerie</a>
    <a href="#contact">Infos pratiques</a>
    <a href="tel:0175306108" class="mobile-cta">01 75 30 61 08</a>
  `;
  document.body.appendChild(ov);
  ov.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
  return ov;
}
function toggleMobileMenu() {
  const burger = document.getElementById('burger');
  if (!mobileOverlay) mobileOverlay = createMobileMenu();
  if (mobileOverlay.classList.contains('open')) {
    closeMobileMenu();
  } else {
    burger.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => mobileOverlay.classList.add('visible'));
  }
}
function closeMobileMenu() {
  const burger = document.getElementById('burger');
  if (!mobileOverlay) return;
  burger?.classList.remove('open');
  mobileOverlay.classList.remove('visible');
  document.body.style.overflow = '';
  setTimeout(() => mobileOverlay.classList.remove('open'), 400);
}


/* ════════════════════════════
   SPOTLIGHT — Aceternity
   Mouse-tracking radial gradient
═════════════════════════════ */
function initSpotlight() {
  const hero      = document.getElementById('hero');
  const spotlight = document.getElementById('spotlight');
  if (!hero || !spotlight) return;

  let raf = null;
  let targetX = 50, targetY = 50;
  let currentX = 50, currentY = 50;

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width)  * 100;
    targetY = ((e.clientY - r.top)  / r.height) * 100;
    spotlight.style.opacity = '1';
    if (!raf) raf = requestAnimationFrame(animateSpotlight);
  });

  hero.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
    raf && cancelAnimationFrame(raf);
    raf = null;
  });

  function animateSpotlight() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    hero.style.setProperty('--mx', currentX.toFixed(2) + '%');
    hero.style.setProperty('--my', currentY.toFixed(2) + '%');
    raf = requestAnimationFrame(animateSpotlight);
  }
}


/* ════════════════════════════
   3D TILT — Aceternity Card Hover
   data-tilt / data-tilt-strength
═════════════════════════════ */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    const strength = parseFloat(el.dataset.tiltStrength || '12');
    let raf = null;
    let tX = 0, tY = 0, cX = 0, cY = 0;

    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      tX = ((e.clientX - r.left) / r.width  - 0.5) * strength;
      tY = ((e.clientY - r.top)  / r.height - 0.5) * strength;
      if (!raf) raf = requestAnimationFrame(animateTilt);

      // Track mouse inside hl-card for aurora bg
      if (el.classList.contains('hl-card')) {
        const bg = el.querySelector('.hl-card-bg');
        if (bg) {
          el.style.setProperty('--hx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
          el.style.setProperty('--hy', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
        }
      }
    });

    el.addEventListener('mouseleave', () => {
      tX = 0; tY = 0;
      if (!raf) raf = requestAnimationFrame(animateTilt);
    });

    function animateTilt() {
      cX += (tX - cX) * 0.12;
      cY += (tY - cY) * 0.12;
      el.style.transform = `perspective(1000px) rotateY(${cX.toFixed(3)}deg) rotateX(${(-cY).toFixed(3)}deg)`;
      if (Math.abs(tX - cX) < 0.01 && Math.abs(tY - cY) < 0.01) {
        raf = null;
      } else {
        raf = requestAnimationFrame(animateTilt);
      }
    }
  });
}


/* ════════════════════════════
   MAGNETIC BUTTONS
   Elements with .magnetic class
═════════════════════════════ */
function initMagnetic() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    const strength = 0.38;

    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const x  = (e.clientX - r.left - r.width  / 2) * strength;
      const y  = (e.clientY - r.top  - r.height / 2) * strength;
      el.style.transition = 'transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94)';
      el.style.transform  = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform  = 'translate(0, 0)';
    });
  });
}


/* ════════════════════════════
   CUSTOM CURSOR
═════════════════════════════ */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;

  let mx = -100, my = -100, fx = -100, fy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function loop() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx.toFixed(2) + 'px';
    follower.style.top  = fy.toFixed(2) + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .gallery-item, .tab, .dish, .hl-card, [data-tilt]').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
  });
}


/* ════════════════════════════
   SCROLL REVEAL (fallback)
═════════════════════════════ */
function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal-block').forEach(b => io.observe(b));
}


/* ════════════════════════════
   ANIMATED COUNTERS
═════════════════════════════ */
function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      let start = 0;
      const step = 16;
      const inc  = end / (1600 / step);
      const timer = setInterval(() => {
        start += inc;
        if (start >= end) { el.textContent = end; clearInterval(timer); }
        else { el.textContent = Math.floor(start); }
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(n => io.observe(n));
}


/* ════════════════════════════
   MENU TABS + SLIDING INDICATOR
═════════════════════════════ */
function initMenuTabs() {
  const tabs      = document.querySelectorAll('.tab');
  const panels    = document.querySelectorAll('.panel');
  const indicator = document.getElementById('tab-indicator');
  if (!tabs.length) return;

  function moveIndicator(tab) {
    if (!indicator) return;
    const tabsEl = document.getElementById('menu-tabs');
    if (!tabsEl) return;
    const tr = tabsEl.getBoundingClientRect();
    const br = tab.getBoundingClientRect();
    // account for horizontal scroll inside the tabs container
    indicator.style.left  = (br.left - tr.left + tabsEl.scrollLeft) + 'px';
    indicator.style.width = br.width + 'px';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
      moveIndicator(tab);
    });
  });

  // Init indicator position
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    requestAnimationFrame(() => moveIndicator(activeTab));
  }
  window.addEventListener('resize', () => {
    const at = document.querySelector('.tab.active');
    if (at) moveIndicator(at);
  });
}


/* ════════════════════════════
   GALLERY LIGHTBOX
═════════════════════════════ */
function initGallery() {
  const items     = document.querySelectorAll('.gallery-item');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  if (!lightbox || !items.length) return;

  const data = Array.from(items).map(it => ({
    src:     it.querySelector('img').src,
    caption: it.querySelector('.gallery-caption')?.textContent || ''
  }));
  let current = 0;

  function open(idx) {
    current = idx;
    lbImg.style.opacity = '0';
    lbImg.src = data[idx].src;
    lbCaption.textContent = data[idx].caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { lbImg.style.opacity = '1'; });
  }
  function close() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  function prev() { open((current - 1 + data.length) % data.length); }
  function next() { open((current + 1) % data.length); }

  items.forEach((it, i) => it.addEventListener('click', () => open(i)));
  document.getElementById('lb-close')?.addEventListener('click', close);
  document.getElementById('lb-prev')?.addEventListener('click', prev);
  document.getElementById('lb-next')?.addEventListener('click', next);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  // Swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
}


/* ════════════════════════════
   SCROLL PROGRESS BAR
═════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct.toFixed(2) + '%';
  }, { passive: true });
}


/* ════════════════════════════
   BACK TO TOP
═════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ════════════════════════════
   INIT ALL
═════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initScrollReveal();
  initCounters();
  initMenuTabs();
  initGallery();
  initSpotlight();
  initTilt();
  initMagnetic();
  initCursor();
  initScrollProgress();
  initBackToTop();

  if (typeof gsap !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(initHeroAnimation, 1600);
    });
  }
});
