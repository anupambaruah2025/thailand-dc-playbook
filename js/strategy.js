/* ==========================================================================
   STRATEGIC RECOMMENDATIONS — real content by player type, no gate.
   The recommendations themselves are the site's best conversion driver;
   only the full report (with sourcing/citations) is gated separately.
   Vibrant glossy 3D "bloom" icon per profile, generated as SVG gradients +
   specular highlights (no raster/3D-render tooling required).
   ========================================================================== */
(function () {
  // Tints drawn from the site's existing brand/semantic tokens (blue, cyan, ok-green,
  // warn-amber) rather than arbitrary hues, so this stays part of the same palette
  // as the rest of the UI instead of introducing a fifth unrelated color family.
  const PALETTE = [
    { light: '#8fc9ff', dark: '#2563eb' }, // blue
    { light: '#67e8f9', dark: '#0e7490' }, // cyan
    { light: '#fcd34d', dark: '#b45309' }, // amber (--warn family)
    { light: '#6ee7b7', dark: '#047857' }, // green (--ok family)
    { light: '#bfe0ff', dark: '#3b8dff' }, // blue, lighter tint
    { light: '#a5f3fc', dark: '#155e75' }  // cyan, lighter tint
  ];

  function glossyBloom(light, dark, uid) {
    const petals = 8;
    const petalPath = 'M0,0 C-9,-22 -7,-48 0,-62 C7,-48 9,-22 0,0 Z';
    let petalsMarkup = '';
    for (let i = 0; i < petals; i++) {
      const angle = (360 / petals) * i;
      petalsMarkup += `<g transform="rotate(${angle})"><path d="${petalPath}" fill="url(#grad-${uid})"/><ellipse cx="-2.5" cy="-40" rx="2.6" ry="11" fill="url(#shine-${uid})" opacity="0.8" transform="rotate(-12 -2.5 -40)"/></g>`;
    }
    return `
      <svg viewBox="-70 -70 140 140" width="100%" height="100%">
        <defs>
          <linearGradient id="grad-${uid}" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="${dark}"/>
            <stop offset="100%" stop-color="${light}"/>
          </linearGradient>
          <linearGradient id="shine-${uid}" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.85"/>
          </linearGradient>
          <radialGradient id="shadow-${uid}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${dark}" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="${dark}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="0" cy="8" rx="42" ry="14" fill="url(#shadow-${uid})"/>
        <g>${petalsMarkup}</g>
        <circle cx="0" cy="0" r="7" fill="${dark}"/>
      </svg>
    `;
  }

  function renderPanel(s) {
    const panel = document.getElementById('strategyPanel');
    panel.innerHTML = `
      <h4>${s.label}</h4>
      <div class="role">2026–27 Play</div>
      <div class="strategy-cols">
        <div>
          <h5>The Play</h5>
          <p>${s.play}</p>
        </div>
        <div>
          <h5>Critical Success Factors</h5>
          <ul>${s.csf.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      </div>
    `;
    if (typeof gsap !== 'undefined' && !window.PREFERS_REDUCED_MOTION) {
      gsap.from(panel, { opacity: 0, y: 14, duration: 0.5, ease: 'power2.out' });
    }
  }

  function build() {
    const tabsWrap = document.getElementById('strategyTabs');
    if (!tabsWrap) return;
    DC_DATA.strategies.forEach((s, i) => {
      const c = PALETTE[i % PALETTE.length];
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'glass strategy-tab reveal' + (i === 0 ? ' active' : '');
      tab.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      tab.innerHTML = `<div class="bloom-icon sm">${glossyBloom(c.light, c.dark, 'strat' + i)}</div><div class="lbl">${s.label}</div>`;
      tab.addEventListener('click', () => {
        document.querySelectorAll('.strategy-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-pressed', 'true');
        renderPanel(s);
      });
      tabsWrap.appendChild(tab);
    });
    renderPanel(DC_DATA.strategies[0]);
  }

  document.addEventListener('DOMContentLoaded', build);
})();
