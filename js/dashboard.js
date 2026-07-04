/* ==========================================================================
   EXECUTIVE DASHBOARD — KPI cards with rings + sparklines
   ========================================================================== */
(function () {
  function sparkPath(values, w, h) {
    const max = Math.max(...values), min = Math.min(...values);
    const range = (max - min) || 1;
    const step = w / (values.length - 1);
    const pts = values.map((v, i) => [i * step, h - ((v - min) / range) * (h - 4) - 2]);
    const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = line + ` L${w},${h} L0,${h} Z`;
    return { line, area };
  }

  function build() {
    const grid = document.getElementById('kpiGrid');
    if (!grid) return;
    const circumference = 2 * Math.PI * 24;

    DC_DATA.kpis.forEach((k, i) => {
      const { line, area } = sparkPath(k.spark, 200, 36);
      const card = document.createElement('div');
      card.className = 'glass glass-card kpi-card reveal';
      card.innerHTML = `
        <div class="kpi-top">
          <div>
            <div class="kpi-label">${k.label}</div>
          </div>
          <svg class="kpi-ring" viewBox="0 0 60 60">
            <circle class="track" cx="30" cy="30" r="24"></circle>
            <circle class="fill" cx="30" cy="30" r="24" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" data-target-offset="${circumference * (1 - k.pct / 100)}"></circle>
          </svg>
        </div>
        <div class="kpi-value">${k.value}<span class="unit">${k.unit}</span></div>
        <svg class="kpi-spark" viewBox="0 0 200 36" preserveAspectRatio="none">
          <defs><linearGradient id="sparkGrad-${i}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5eb3ff" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#5eb3ff" stop-opacity="0"/>
          </linearGradient></defs>
          <path class="area" d="${area}" fill="url(#sparkGrad-${i})"></path>
          <path class="line" d="${line}"></path>
        </svg>
        <div class="kpi-source">${k.detail} · <em style="font-style:normal;opacity:0.75;">${k.source}</em></div>
      `;
      grid.appendChild(card);
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.fill').forEach(f => {
            f.style.strokeDashoffset = f.dataset.targetOffset;
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    grid.querySelectorAll('.kpi-card').forEach(c => io.observe(c));
  }

  document.addEventListener('DOMContentLoaded', build);
})();
