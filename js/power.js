/* ==========================================================================
   POWER CONSTRAINT — animated transmission flow + mechanism cards
   Gradient comet-trail particles, shockwave pulses, hover tooltips,
   line draw-in reveal, and expandable mechanism cards.
   ========================================================================== */
(function () {
  let canvas, ctx, W, H, dpr, particles = [], shockwaves = [];
  let startTime = null, hoverNode = null;
  const PATHS = {};

  const NODE_META = {
    gen:    { label: 'Generation',              stroke: '#5eb3ff', r: 9,  labelDy: 24,  info: 'Thailand has surplus generation capacity — the constraint is downstream delivery, not supply.' },
    grid:   { label: 'EGAT Grid',                stroke: '#5eb3ff', r: 11, labelDy: 26,  info: 'EGAT has committed ~THB 3bn of immediate works and ~THB 30–31bn programmed against ~3,800MW of new demand.' },
    eec:    { label: 'EEC Substation',           stroke: '#ff5d78', r: 12, labelDy: -20, info: '115/230kV lines and substation bays are exhausted. Utility substations take 24–36 months to deliver.' },
    ring:   { label: 'Second-Ring Substation',   stroke: '#35e0a8', r: 12, labelDy: 24,  info: 'Substation headroom exists — the Energy Ministry is openly steering projects here.' },
    dcEec:  { label: 'Hyperscale campuses',      stroke: '#ff5d78', r: 7,  labelDy: -18, info: 'EEC mega-campuses queueing behind the congested substation.' },
    dcRing: { label: 'Build-to-suit',            stroke: '#35e0a8', r: 7,  labelDy: 22,  info: 'Second-ring builds clear the grid queue faster.' }
  };

  function resize() {
    const wrap = canvas.parentElement;
    W = wrap.clientWidth - 48; H = 420;
    dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    PATHS.gen = { x: 40, y: H / 2 };
    PATHS.grid = { x: W * 0.34, y: H / 2 };
    PATHS.eec = { x: W * 0.68, y: H * 0.26, congested: true };
    PATHS.ring = { x: W * 0.68, y: H * 0.74, congested: false };
    PATHS.dcEec = { x: W * 0.94, y: H * 0.16 };
    PATHS.dcRing = { x: W * 0.94, y: H * 0.84 };

    seedParticles();
  }

  function seedParticles() {
    particles = [];
    const lanes = [
      { from: 'gen', to: 'grid', speed: 0.011, color: '5eb3ff', n: 5 },
      { from: 'grid', to: 'eec', speed: 0.0045, color: 'ff5d78', n: 12, congestBefore: 0.76 },
      { from: 'grid', to: 'ring', speed: 0.010, color: '35e0a8', n: 5 },
      { from: 'eec', to: 'dcEec', speed: 0.0055, color: 'ff5d78', n: 4 },
      { from: 'ring', to: 'dcRing', speed: 0.012, color: '35e0a8', n: 4 }
    ];
    lanes.forEach(lane => {
      for (let i = 0; i < lane.n; i++) {
        particles.push({ ...lane, t: i / lane.n, trail: [] });
      }
    });
  }

  function bezierPoint(p0, p1, t) {
    const mx = (p0.x + p1.x) / 2 + (p1.y - p0.y) * 0.06;
    const my = (p0.y + p1.y) / 2 - (p1.x - p0.x) * 0.06;
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * mx + t * t * p1.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * my + t * t * p1.y;
    return { x, y, mx, my };
  }

  function drawLine(p0, p1, colorA, colorB, congested, progress) {
    const { mx, my } = bezierPoint(p0, p1, 0.5);
    const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
    grad.addColorStop(0, colorA);
    grad.addColorStop(1, colorB);

    // faint full-length base line
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(mx, my, p1.x, p1.y);
    ctx.strokeStyle = congested ? 'rgba(255,93,120,0.14)' : 'rgba(94,179,255,0.12)';
    ctx.lineWidth = congested ? 6 : 3.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // animated draw-in overlay (bright) up to `progress`
    if (progress > 0) {
      const seg = bezierPoint(p0, p1, Math.min(1, progress));
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(mx, my, seg.x, seg.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = congested ? 3.2 : 2;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function drawNode(key, p) {
    const meta = NODE_META[key];
    const isHover = hoverNode === key;
    const r = meta.r + (isHover ? 2.5 : 0);

    // layered outer glow
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.2);
    glow.addColorStop(0, meta.stroke + (isHover ? '55' : '30'));
    glow.addColorStop(1, meta.stroke + '00');
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1220';
    ctx.fill();
    ctx.lineWidth = isHover ? 2.6 : 2;
    ctx.strokeStyle = meta.stroke;
    ctx.stroke();

    // inner bright core
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = meta.stroke;
    ctx.fill();

    ctx.fillStyle = isHover ? '#f6f8fc' : '#a6b0c3';
    ctx.font = (isHover ? '700 ' : '500 ') + '10.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(meta.label, p.x, p.y + meta.labelDy);

    return r;
  }

  function draw(tms) {
    const reduced = window.PREFERS_REDUCED_MOTION;
    if (startTime === null) startTime = tms;
    const t = tms - startTime;
    const drawProgress = reduced ? 1 : Math.min(1, t / 1400);

    ctx.clearRect(0, 0, W, H);

    drawLine(PATHS.gen, PATHS.grid, '#5eb3ff', '#5eb3ff', false, drawProgress);
    drawLine(PATHS.grid, PATHS.eec, '#5eb3ff', '#ff5d78', true, drawProgress);
    drawLine(PATHS.grid, PATHS.ring, '#5eb3ff', '#35e0a8', false, drawProgress);
    drawLine(PATHS.eec, PATHS.dcEec, '#ff5d78', '#ff8fa2', true, drawProgress);
    drawLine(PATHS.ring, PATHS.dcRing, '#35e0a8', '#7ef0c8', false, drawProgress);

    // periodic shockwave rings from the congested EEC substation (skipped under reduced motion)
    if (!reduced) {
      if (Math.floor(t / 1800) > (draw._lastWave || 0)) {
        draw._lastWave = Math.floor(t / 1800);
        shockwaves.push({ born: t });
      }
      shockwaves = shockwaves.filter(w => t - w.born < 1800);
      shockwaves.forEach(w => {
        const age = (t - w.born) / 1800;
        const r = 14 + age * 46;
        ctx.beginPath();
        ctx.arc(PATHS.eec.x, PATHS.eec.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,93,120,${0.4 * (1 - age)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // breathing halo under the shockwaves
    const pulse = reduced ? 1 : 1 + Math.sin(t * 0.0022) * 0.2;
    const g = ctx.createRadialGradient(PATHS.eec.x, PATHS.eec.y, 0, PATHS.eec.x, PATHS.eec.y, 22 * pulse);
    g.addColorStop(0, 'rgba(255,93,120,0.3)');
    g.addColorStop(1, 'rgba(255,93,120,0)');
    ctx.beginPath();
    ctx.arc(PATHS.eec.x, PATHS.eec.y, 22 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    Object.keys(PATHS).forEach(key => drawNode(key, PATHS[key]));

    ctx.fillStyle = '#ff5d78';
    ctx.font = '700 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('>90% of new grid requests', PATHS.eec.x, PATHS.eec.y - 34);

    // comet-trail particles (only once lines have drawn in; skipped under reduced motion)
    if (!reduced && drawProgress > 0.5) {
      particles.forEach(p => {
        let speed = p.speed;
        if (p.congestBefore && p.t > p.congestBefore) speed *= 0.15;
        p.t += speed;
        if (p.t > 1) p.t = 0;
        const pt = bezierPoint(PATHS[p.from], PATHS[p.to], p.t);
        p.trail.unshift({ x: pt.x, y: pt.y });
        if (p.trail.length > 7) p.trail.pop();

        p.trail.forEach((pos, i) => {
          const a = (1 - i / p.trail.length) * 0.8;
          const r = 2.8 * (1 - i / p.trail.length * 0.6);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
          ctx.fillStyle = '#' + p.color;
          ctx.globalAlpha = a;
          ctx.shadowColor = '#' + p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });
    }
  }

  function loop(t) {
    draw(t);
  }

  function hitTest(mx, my) {
    let found = null;
    Object.keys(PATHS).forEach(key => {
      const p = PATHS[key];
      const r = NODE_META[key].r + 6;
      const d = Math.hypot(mx - p.x, my - p.y);
      if (d < r) found = key;
    });
    return found;
  }

  function showNodeTooltip(key, mx, my) {
    const tooltip = document.getElementById('powerTooltip');
    if (!tooltip) return;
    const meta = NODE_META[key];
    tooltip.innerHTML = `<h5 style="color:${meta.stroke};font-size:13px;margin-bottom:4px;">${meta.label}</h5><p style="font-size:12px;color:var(--text-mid);line-height:1.5;">${meta.info}</p>`;
    tooltip.style.left = mx + 'px';
    tooltip.style.top = my + 'px';
    tooltip.classList.add('show');
  }

  function hideNodeTooltip() {
    document.getElementById('powerTooltip')?.classList.remove('show');
  }

  function initInteraction() {
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const key = hitTest(mx, my);
      hoverNode = key;
      canvas.style.cursor = key ? 'pointer' : 'default';
      if (key) showNodeTooltip(key, mx, my);
      else hideNodeTooltip();
    });
    canvas.addEventListener('mouseleave', () => { hoverNode = null; hideNodeTooltip(); });
  }

  /* Keyboard/screen-reader access: invisible 44px focusable buttons overlaid on
     each canvas node — canvas pixels can't receive focus, these can. */
  let hotspotButtons = {};
  function buildOverlayHotspots() {
    const stage = canvas.parentElement;
    let layer = stage.querySelector('.power-hotspot-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'power-hotspot-layer';
      stage.appendChild(layer);
    }
    layer.innerHTML = '';
    hotspotButtons = {};
    Object.keys(PATHS).forEach(key => {
      const meta = NODE_META[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'power-hotspot';
      btn.setAttribute('aria-label', `${meta.label}: ${meta.info}`);
      btn.addEventListener('focus', () => { hoverNode = key; showNodeTooltip(key, PATHS[key].x, PATHS[key].y); });
      btn.addEventListener('blur', () => { hoverNode = null; hideNodeTooltip(); });
      layer.appendChild(btn);
      hotspotButtons[key] = btn;
    });
    positionOverlayHotspots();
  }

  function positionOverlayHotspots() {
    const offX = canvas.offsetLeft, offY = canvas.offsetTop;
    Object.keys(hotspotButtons).forEach(key => {
      const p = PATHS[key];
      const btn = hotspotButtons[key];
      btn.style.left = (offX + p.x - 22) + 'px';
      btn.style.top = (offY + p.y - 22) + 'px';
    });
  }

  const ICONS = {
    live: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L4.5 13.5H11L10 22l9-12h-6.5L13 2z"/></svg>`,
    draft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z"/></svg>`,
    new: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6m0 8v6m-8-8h6m8 0h-6"/><circle cx="12" cy="12" r="9"/></svg>`
  };

  function buildCards() {
    const wrap = document.getElementById('powerCards');
    if (!wrap) return;
    DC_DATA.powerFacts.mechanisms.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'glass power-card';
      card.style.setProperty('--d', i * 0.08 + 's');
      card.innerHTML = `
        <div class="power-card-head">
          <div class="power-card-icon status-${m.statusTag}">${ICONS[m.statusTag] || ICONS.new}</div>
          <div class="power-card-title">
            <h4>${m.name}</h4>
            <div class="power-card-status-line">${m.status}</div>
          </div>
          <span class="status ${m.statusTag}"><i></i>${m.statusTag}</span>
          <svg class="power-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="power-card-body">
          <div class="power-card-body-inner">
            <p><b style="color:var(--text-hi);">Terms:</b> ${m.terms}</p>
            <p><b style="color:var(--cyan);">Investor read:</b> ${m.read}</p>
          </div>
        </div>
      `;
      const head = card.querySelector('.power-card-head');
      head.setAttribute('tabindex', '0');
      head.setAttribute('role', 'button');
      head.setAttribute('aria-expanded', 'false');
      const toggle = () => {
        card.classList.toggle('open');
        head.setAttribute('aria-expanded', card.classList.contains('open') ? 'true' : 'false');
      };
      head.addEventListener('click', toggle);
      head.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      wrap.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('power-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Power flow diagram: generation feeds the EGAT grid, which splits toward congested EEC substations (over 90% of new grid requests, 24–36 month delivery) and second-ring substations with available headroom.');
    resize();
    initInteraction();
    buildOverlayHotspots();
    if (window.PREFERS_REDUCED_MOTION) requestAnimationFrame(loop); // single static frame
    else window.rafGate(canvas, loop); // runs only while diagram is in view
    buildCards();
    window.addEventListener('resize', () => { resize(); positionOverlayHotspots(); });
  });
})();
