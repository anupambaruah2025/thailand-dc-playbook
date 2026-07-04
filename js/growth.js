/* ==========================================================================
   MARKET GROWTH — cinematic glowing ribbon chart + year scrubber + funnel
   Three forecast lines rendered as thick glass-tube ribbons with a scrolling
   tread texture on the active line, floating value labels, traveling spark
   particles, and sparse background light beams — canvas-driven, continuous.
   ========================================================================== */
(function () {
  const D = DC_DATA.marketGrowth;
  let activeSeries = 'arizton';
  let scrubIndex = 0;
  let canvas, ctx, W, H, dpr;
  let beams = [];

  const SERIES = {
    arizton: { core: '#bfe8ff', glow: '#3b8dff', label: 'Arizton' },
    mordor:  { core: '#a7f3d0', glow: '#22e2ee', label: 'Mordor' },
    nextmsc: { core: '#c7f9e0', glow: '#35e0a8', label: 'NextMSC' }
  };
  const ORDER = ['arizton', 'mordor', 'nextmsc'];

  function resize() {
    const wrap = document.getElementById('ribbonStage');
    if (!wrap) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = wrap.clientWidth; H = 420;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    beams = [0.08, 0.24, 0.52, 0.71, 0.9].map((p, i) => ({ x: p * W, seed: i * 1.7 }));
  }

  function xForIndex(i) {
    const pad = 30;
    return pad + (i / (D.years.length - 1)) * (W - pad * 2);
  }
  function yScale(v) {
    const allVals = [...D.revenue.arizton, ...D.revenue.mordor, ...D.revenue.nextmsc];
    const max = Math.max(...allVals) * 1.15;
    const padTop = 46, padBottom = 56;
    return H - padBottom - (v / max) * (H - padTop - padBottom);
  }

  function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t, t3 = t2 * t;
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
  }

  function smoothPoints(values, samplesPerSeg) {
    const pts = [];
    const n = values.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = values[Math.max(0, i - 1)], p1 = values[i], p2 = values[i + 1], p3 = values[Math.min(n - 1, i + 2)];
      for (let s = 0; s < samplesPerSeg; s++) {
        const t = s / samplesPerSeg;
        const val = catmullRom(p0, p1, p2, p3, t);
        pts.push({ x: xForIndex(i + t), y: yScale(val), val });
      }
    }
    pts.push({ x: xForIndex(n - 1), y: yScale(values[n - 1]), val: values[n - 1] });
    return pts;
  }

  function strokeRibbon(pts, color, glowWidth, coreWidth, alpha) {
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = glowWidth; ctx.globalAlpha = alpha * 0.28;
    ctx.shadowColor = color; ctx.shadowBlur = glowWidth * 1.4;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineWidth = coreWidth; ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.restore();
  }

  function drawTread(pts, t) {
    const step = 5, len = 5.5, speed = 26;
    ctx.save();
    ctx.strokeStyle = 'rgba(6,10,18,0.55)';
    ctx.lineWidth = 1.4;
    const offset = (t * speed) % step;
    for (let i = offset; i < pts.length - 1; i += step) {
      const a = pts[Math.floor(i)], b = pts[Math.min(pts.length - 1, Math.floor(i) + 1)];
      const dx = b.x - a.x, dy = b.y - a.y;
      const mag = Math.hypot(dx, dy) || 1;
      const nx = -dy / mag, ny = dx / mag;
      ctx.beginPath();
      ctx.moveTo(a.x - nx * len, a.y - ny * len);
      ctx.lineTo(a.x + nx * len, a.y + ny * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  const reducedMotion = window.PREFERS_REDUCED_MOTION;

  function draw(tms) {
    const t = reducedMotion ? 0.6 : tms * 0.001;
    ctx.clearRect(0, 0, W, H);

    // background beams
    beams.forEach(b => {
      const flicker = 0.05 + Math.abs(Math.sin(t * 0.3 + b.seed)) * 0.05;
      const grad = ctx.createLinearGradient(b.x, 0, b.x, H);
      grad.addColorStop(0, `rgba(53,224,168,${flicker})`);
      grad.addColorStop(0.5, `rgba(34,226,238,${flicker * 0.6})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(b.x - 1, 0, 2.4, H);
    });

    // year gridlines + labels
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(166,176,195,0.55)';
    ctx.textAlign = 'center';
    D.years.forEach((y, i) => {
      const x = xForIndex(i);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, H - 40); ctx.stroke();
      ctx.fillText(y, x, H - 20);
    });

    // draw inactive series first (receding), active last (on top, brightest)
    const inactive = ORDER.filter(k => k !== activeSeries);
    inactive.forEach(key => {
      const pts = smoothPoints(D.revenue[key], 22);
      strokeRibbon(pts, SERIES[key].glow, 10, 2, 0.4);
    });

    const activePts = smoothPoints(D.revenue[activeSeries], 22);
    strokeRibbon(activePts, SERIES[activeSeries].core, 20, 4.5, 0.95);
    drawTread(activePts, t);

    // traveling spark along the active ribbon
    if (!reducedMotion) {
      const sparkT = (t * 0.12) % 1;
      const sparkIdx = Math.floor(sparkT * (activePts.length - 1));
      const sp = activePts[sparkIdx];
      if (sp) {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = SERIES[activeSeries].glow;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // floating value labels at each real data point on the active series
    D.revenue[activeSeries].forEach((v, i) => {
      const x = xForIndex(i);
      const y = yScale(v) + (reducedMotion ? 0 : Math.sin(t * 1.4 + i * 1.1) * 4);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = SERIES[activeSeries].core;
      ctx.shadowColor = SERIES[activeSeries].glow;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = (i === scrubIndex ? '700 13px' : '600 11px') + ' "Bricolage Grotesque", sans-serif';
      ctx.fillStyle = i === scrubIndex ? '#ffffff' : 'rgba(230,238,250,0.75)';
      ctx.fillText(v.toFixed(2), x, y - 14);
    });

    // scrub marker line
    const sx = xForIndex(scrubIndex);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.moveTo(sx, 30); ctx.lineTo(sx, H - 40); ctx.stroke();
    ctx.setLineDash([]);

  }

  function updateScrubReadout() {
    const values = D.revenue[activeSeries];
    document.getElementById('scrubYear').textContent = D.years[scrubIndex];
    document.getElementById('scrubRevenue').textContent = 'USD ' + values[scrubIndex].toFixed(2) + 'bn';
    if (scrubIndex === 0) {
      document.getElementById('scrubCagr').textContent = '—';
    } else {
      const cagr = (Math.pow(values[scrubIndex] / values[0], 1 / scrubIndex) - 1) * 100;
      document.getElementById('scrubCagr').textContent = cagr.toFixed(1) + '%';
    }
  }

  function initScrubber() {
    const track = document.getElementById('scrubberTrack');
    const fill = document.getElementById('scrubberFill');
    const handle = document.getElementById('scrubberHandle');
    const labels = document.getElementById('scrubberLabels');
    labels.innerHTML = D.years.map(y => `<span>${y}</span>`).join('');

    function setIndex(i) {
      scrubIndex = Math.max(0, Math.min(D.years.length - 1, i));
      const pct = (scrubIndex / (D.years.length - 1)) * 100;
      fill.style.width = pct + '%';
      handle.style.left = pct + '%';
      updateScrubReadout();
      if (reducedMotion) requestAnimationFrame(draw); // one static redraw
    }
    setIndex(0);

    let dragging = false;
    function fromEvent(clientX) {
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setIndex(Math.round(pct * (D.years.length - 1)));
    }
    handle.addEventListener('pointerdown', () => dragging = true);
    track.addEventListener('pointerdown', e => { dragging = true; fromEvent(e.clientX); });
    window.addEventListener('pointermove', e => { if (dragging) fromEvent(e.clientX); });
    window.addEventListener('pointerup', () => dragging = false);
  }

  function initTabs() {
    document.querySelectorAll('.chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeSeries = tab.dataset.series;
        updateScrubReadout();
      if (reducedMotion) requestAnimationFrame(draw); // one static redraw
      });
    });
  }

  function buildFunnel() {
    const wrap = document.getElementById('funnelWrap');
    if (!wrap) return;
    const c = D.capacityMW;
    const rows = [
      { lbl: 'Total pipeline', val: c.pipeline, max: c.pipeline, cls: '' },
      { lbl: '2025 BOI approved', val: c.approved2025, max: c.pipeline, cls: 'alt' },
      { lbl: 'Realistic energised by 2030', val: c.realistic2030High, max: c.pipeline, cls: 'alt', sub: c.realistic2030Low }
    ];
    rows.forEach(r => {
      const row = document.createElement('div');
      row.className = 'funnel-row';
      row.innerHTML = `
        <div class="funnel-lbl">${r.lbl}</div>
        <div class="funnel-track"><div class="funnel-fill ${r.cls}" data-pct="${(r.val / r.max) * 100}"></div></div>
        <div class="funnel-val">${r.sub ? c.realistic2030Low + '–' + c.realistic2030High : r.val.toLocaleString()} MW</div>
      `;
      wrap.appendChild(row);
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.funnel-fill').forEach(f => { f.style.width = f.dataset.pct + '%'; });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    io.observe(wrap);
  }

  document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('growth-chart');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Revenue forecast chart, 2025 to 2031. Arizton projects USD 1.45 to 6.29 billion (27.7% CAGR), Mordor 1.45 to 3.95 billion (17.2%), NextMSC 1.45 to 4.61 billion (18.4%). Use the year slider below to read exact values.');
    resize();
    if (reducedMotion) requestAnimationFrame(draw); // single static frame
    else window.rafGate(canvas, draw); // runs only while chart is in view
    initScrubber();
    initTabs();
    buildFunnel();
    window.addEventListener('resize', resize);
  });
})();
