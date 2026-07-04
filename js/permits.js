/* ==========================================================================
   PERMIT JOURNEY — self-building road, stage-by-stage
   ========================================================================== */
(function () {
  function build() {
    const wrap = document.getElementById('permitStages');
    if (!wrap) return;
    DC_DATA.permits.forEach(p => {
      const el = document.createElement('div');
      el.className = 'permit-stage reveal';
      el.innerHTML = `
        <div class="permit-node">${p.stage}</div>
        <div class="glass permit-body">
          <div class="permit-head">
            <h4>${p.title}</h4>
            <span class="permit-duration">${p.duration}</span>
          </div>
          <div class="permit-authority">${p.authority}</div>
          <div class="permit-instruments">${p.instruments}</div>
        </div>
      `;
      wrap.appendChild(el);
    });
  }

  function initScrollFill() {
    const roadWrap = document.querySelector('.permit-road-wrap');
    const fill = document.getElementById('permitRoadFill');
    if (!roadWrap || !fill) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
    }, { threshold: 0.45 });
    document.querySelectorAll('.permit-stage').forEach(s => io.observe(s));

    function onScroll() {
      const rect = roadWrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const progressed = Math.min(1, Math.max(0, (vh * 0.75 - rect.top) / total));
      fill.style.height = (progressed * 100) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', () => {
    build();
    initScrollFill();
  });
})();
