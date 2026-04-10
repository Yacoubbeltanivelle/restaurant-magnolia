/* =============================================
   MAGNOLIA — Restaurant Script
   ============================================= */

'use strict';

/* ── Loader ── */
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

/* ── Hero GSAP Animation ── */
function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('#h-eyebrow', { opacity: 1, y: 0, duration: 0.9, from: { opacity: 0, y: 20 } })
    .fromTo('#h-title', { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.1 }, '-=0.4')
    .fromTo('#h-tagline', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .fromTo('#h-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .fromTo('#h-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');

  // Parallax on hero image
  gsap.to('#hero-img', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Parallax on quote image
  gsap.to('#quote-img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.quote-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
}

/* ── Navbar ── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('burger');
  if (!navbar) return;

  // Scroll behavior
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // Mobile burger
  if (burger) {
    burger.addEventListener('click', toggleMobileMenu);
  }
}

/* ── Mobile Menu ── */
let mobileOverlay = null;

function createMobileMenu() {
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  overlay.id = 'mobile-overlay';
  overlay.innerHTML = `
    <a href="#about">À propos</a>
    <a href="#menu">La carte</a>
    <a href="#gallery">Galerie</a>
    <a href="#contact">Infos pratiques</a>
    <a href="tel:0175306108" class="mobile-cta">01 75 30 61 08</a>
  `;
  document.body.appendChild(overlay);

  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMobileMenu());
  });

  return overlay;
}

function toggleMobileMenu() {
  const burger = document.getElementById('burger');
  if (!mobileOverlay) {
    mobileOverlay = createMobileMenu();
  }

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
  burger.classList.remove('open');
  mobileOverlay.classList.remove('visible');
  document.body.style.overflow = '';
  setTimeout(() => mobileOverlay.classList.remove('open'), 400);
}

/* ── Scroll Reveal (fallback without GSAP) ── */
function initScrollReveal() {
  const blocks = document.querySelectorAll('.reveal-block');
  if (!blocks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  blocks.forEach(b => io.observe(b));
}

/* ── Animated Counters ── */
function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      let start = 0;
      const dur = 1600;
      const step = 16;
      const inc = end / (dur / step);

      const timer = setInterval(() => {
        start += inc;
        if (start >= end) {
          el.textContent = end;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start);
        }
      }, step);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
}

/* ── Menu Tabs ── */
function initMenuTabs() {
  const tabs   = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      panels.forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ── Gallery Lightbox ── */
function initGallery() {
  const items     = document.querySelectorAll('.gallery-item');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose   = document.getElementById('lb-close');
  const lbPrev    = document.getElementById('lb-prev');
  const lbNext    = document.getElementById('lb-next');

  if (!lightbox || !items.length) return;

  const images = Array.from(items).map(item => ({
    src:     item.querySelector('img').src,
    caption: item.querySelector('.gallery-caption')?.textContent || ''
  }));

  let current = 0;

  function openLightbox(idx) {
    current = idx;
    lbImg.src = images[idx].src;
    lbCaption.textContent = images[idx].caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbImg.style.opacity = '0';
    setTimeout(() => { lbImg.style.opacity = '1'; lbImg.style.transition = 'opacity 0.3s'; }, 20);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    current = (current - 1 + images.length) % images.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = images[current].src;
      lbCaption.textContent = images[current].caption;
      lbImg.style.opacity = '1';
    }, 200);
  }

  function showNext() {
    current = (current + 1) % images.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = images[current].src;
      lbCaption.textContent = images[current].caption;
      lbImg.style.opacity = '1';
    }, 200);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

/* ── Custom Cursor ── */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function followCursor() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(followCursor);
  }

  followCursor();

  // Scale on hover
  document.querySelectorAll('a, button, .gallery-item, .tab, .dish').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform   = 'translate(-50%,-50%) scale(2.5)';
      follower.style.transform = 'translate(-50%,-50%) scale(1.6)';
      follower.style.opacity   = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform   = 'translate(-50%,-50%) scale(1)';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.opacity   = '1';
    });
  });
}

/* ── Marquee duplicate (for seamless loop) ── */
function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  // Already duplicated in HTML, CSS animation handles the loop
}

/* ── GSAP ScrollTrigger reveals (enhanced) ── */
function initGsapReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Staggered menu items
  gsap.utils.toArray('.dish').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        delay: (i % 4) * 0.07,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // Hours rows
  gsap.utils.toArray('.hours-row').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, x: -16 },
      {
        opacity: 1, x: 0,
        duration: 0.5,
        delay: i * 0.08,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  // Gallery items stagger
  gsap.utils.toArray('.gallery-item').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1, scale: 1,
        duration: 0.7,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#gallery', start: 'top 75%', once: true }
      }
    );
  });
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initScrollReveal();
  initCounters();
  initMenuTabs();
  initGallery();
  initCursor();
  initMarquee();

  // GSAP enhancements run after loader if available
  if (typeof gsap !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(initGsapReveals, 1600);
    });
  }
});
