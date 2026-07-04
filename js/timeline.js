/* ==========================================================================
   INVESTMENT TIMELINE — native horizontal scroll (drag + arrow keys + buttons)
   Replaces the earlier scroll-jacked/pinned GSAP version: that pattern hijacked
   vertical scroll and fought the browser's native scroll expectations. This
   version never intercepts the page scroll — only the horizontal strip itself
   scrolls, via drag, trackpad, on-screen arrows, or Left/Right arrow keys.
   ========================================================================== */
(function () {
  function build() {
    const track = document.getElementById('timelineTrack');
    if (!track) return;
    DC_DATA.timeline.forEach(y => {
      const el = document.createElement('div');
      el.className = 'timeline-year';
      el.dataset.year = y.year;
      el.innerHTML = `
        <div class="yr-num">${y.year}</div>
        <div class="timeline-milestones">
          ${y.items.map(i => `<div class="glass milestone"><span class="dot"></span><p>${i}</p></div>`).join('')}
        </div>
      `;
      track.appendChild(el);
    });
  }

  function initScroll() {
    const outer = document.getElementById('timelineOuter');
    const track = document.getElementById('timelineTrack');
    const fill = document.getElementById('timelineProgressFill');
    const years = Array.from(document.querySelectorAll('.timeline-year'));
    const prevBtn = document.getElementById('timelinePrev');
    const nextBtn = document.getElementById('timelineNext');
    if (!outer || !track) return;

    function updateProgress() {
      const max = track.scrollWidth - outer.clientWidth;
      const progress = max > 0 ? outer.scrollLeft / max : 0;
      fill.style.width = (progress * 100) + '%';
      const activeIdx = Math.min(years.length - 1, Math.round(progress * (years.length - 1)));
      years.forEach((y, i) => y.classList.toggle('active', i === activeIdx));
    }

    outer.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    function scrollByYear(dir) {
      const step = years[0] ? years[0].getBoundingClientRect().width : 400;
      outer.scrollBy({ left: dir * step, behavior: window.PREFERS_REDUCED_MOTION ? 'auto' : 'smooth' });
    }
    prevBtn?.addEventListener('click', () => scrollByYear(-1));
    nextBtn?.addEventListener('click', () => scrollByYear(1));
    outer.setAttribute('tabindex', '0');
    outer.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollByYear(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByYear(-1); }
    });

    // click-and-drag to scroll (mouse users on desktops without horizontal trackpad gesture)
    let isDown = false, startX = 0, startScroll = 0;
    outer.addEventListener('pointerdown', e => {
      isDown = true; outer.classList.add('grabbing');
      startX = e.clientX; startScroll = outer.scrollLeft;
    });
    window.addEventListener('pointermove', e => {
      if (!isDown) return;
      outer.scrollLeft = startScroll - (e.clientX - startX);
    });
    window.addEventListener('pointerup', () => { isDown = false; outer.classList.remove('grabbing'); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    build();
    initScroll();
  });
})();
