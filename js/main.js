/* ==========================================================================
   MAIN — nav, scroll progress, cursor glow, magnetic buttons, reveal engine
   ========================================================================== */

/* Shared rAF gate: runs `loopFn(t)` every frame ONLY while `el` is in the
   viewport — animation loops stop burning CPU/battery once scrolled past.
   (All classic scripts execute before DOMContentLoaded, so modules loaded
   earlier can safely call this inside their DOMContentLoaded handlers.) */
window.rafGate = function (el, loopFn) {
  let running = false;
  function frame(t) {
    if (!running) return;
    loopFn(t);
    requestAnimationFrame(frame);
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !running) {
        running = true;
        requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
        running = false;
      }
    });
  }, { rootMargin: '80px 0px' });
  io.observe(el);
};

(function () {
  function initNav() {
    const nav = document.getElementById('siteNav');
    const progress = document.getElementById('navProgress');
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    document.querySelectorAll('.nav-links a, a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id.length < 2 || !id.startsWith('#')) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
      });
    });
  }

  function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || matchMedia('(pointer: coarse)').matches) { if (glow) glow.style.display = 'none'; return; }
    window.addEventListener('mousemove', e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });
  }

  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          if (e.target.id === 'heroStats' || e.target.querySelector?.('.count')) window.triggerCounters?.(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal, .reveal-scale').forEach(el => io.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCursorGlow();
    initMagnetic();
    // slight delay so dynamically-built cards (map/permits/etc) exist before observing
    setTimeout(initReveal, 60);
  });
})();
