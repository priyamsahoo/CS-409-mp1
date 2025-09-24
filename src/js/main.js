// js/main.js
// Self-initializing app logic (runs when imported by index.js)

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function initQuadSurvival() {
    const navbar = $('#navbar');
    const progress = $('#progress');
    const navLinks = $$('.nav-links a[data-link]');
    const sections = $$('section.stripe');

    // --- NAVBAR RESIZE + PROGRESS + SCROLLSPY ---
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;

      // Resize navbar
      if (scrollY > 10) navbar.classList.add('shrink');
      else navbar.classList.remove('shrink');

      // Reading progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${docHeight > 0 ? (scrollY / docHeight) * 100 : 0}%`;

      // Active link = section just below navbar bottom
      const navBottom = navbar.getBoundingClientRect().bottom + window.scrollY;
      const probeY = navBottom + 1;
      const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 1;

      let currentId = sections[0]?.id || '';
      for (const sec of sections) {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (probeY >= top && probeY < bottom) { currentId = sec.id; break; }
      }
      if (atBottom) currentId = sections[sections.length - 1].id;

      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll(); // initial

    // --- CAROUSEL ---
    (function initCarousel(){
      const track = document.querySelector('.carousel-track');
      if (!track) return;

      const slides = Array.from(track.querySelectorAll('.slide'));
      const prevBtn = document.querySelector('.carousel-btn.prev');
      const nextBtn = document.querySelector('.carousel-btn.next');

      let index = 0;
      const update = () => { track.style.transform = `translateX(${-index * 100}%)`; };
      const goPrev = () => { index = (index - 1 + slides.length) % slides.length; update(); };
      const goNext = () => { index = (index + 1) % slides.length; update(); };

      prevBtn.addEventListener('click', goPrev);
      nextBtn.addEventListener('click', goNext);

      track.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
      });

      let auto = setInterval(goNext, 6000);
      [prevBtn, nextBtn, track].forEach(el => {
        el.addEventListener('mouseenter', () => clearInterval(auto));
        el.addEventListener('mouseleave', () => auto = setInterval(goNext, 6000));
      });
    })();

    // --- MODALS ---
    (function initModals(){
      const openers = document.querySelectorAll('[data-open-modal]');
      const closers = document.querySelectorAll('[data-close-modal]');
      const modals  = document.querySelectorAll('.modal');

      function openModal(id) {
        const m = document.querySelector(id);
        if (!m) return;
        m.classList.add('open');
        m.setAttribute('aria-hidden', 'false');
        const focusable = m.querySelector('button, [href], input, select, textarea, [tabindex]');
        if (focusable) focusable.focus();
        document.body.style.overflow = 'hidden';
      }
      function closeModal(m) {
        m.classList.remove('open');
        m.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      openers.forEach(btn => btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal'))));
      closers.forEach(btn => btn.addEventListener('click', () => {
        const modal = btn.closest('.modal'); if (modal) closeModal(modal);
      }));
      modals.forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) closeModal(m); });
      });
    })();

    // --- FOOTER YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  // === Equal-height cards (History) ===
  function equalizeSectionCards(sectionSelector) {
    const cards = document.querySelectorAll(`${sectionSelector} .columns .card`);
    if (!cards.length) return;

    // Reset to natural height first (so it can re-measure on resize)
    cards.forEach(c => (c.style.height = 'auto'));

    // Measure tallest
    const tallest = Math.max(...cards.map ? cards.map(c => c.offsetHeight) : Array.from(cards, c => c.offsetHeight));

    // Match your CSS breakpoint: let cards auto-grow on small screens
    const isSingleColumn = window.matchMedia('(max-width: 640px)').matches;

    cards.forEach(c => {
      c.style.height = isSingleColumn ? 'auto' : `${tallest}px`;
    });
  }

  function applyEqualHeights() {
    equalizeSectionCards('#history'); // make the 6 history cards equal height
  }

  // Run once and on resize/load
  applyEqualHeights();
  window.addEventListener('resize', applyEqualHeights);
  window.addEventListener('load', applyEqualHeights);


  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuadSurvival);
  } else {
    initQuadSurvival();
  }
})();
