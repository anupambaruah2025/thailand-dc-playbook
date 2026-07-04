/* ==========================================================================
   THAILAND HOTSPOT MAP — stylised SVG silhouette + interactive markers
   ========================================================================== */
(function () {
  const SILHOUETTE = "M35,4 C42,3 48,6 46,12 C54,10 66,14 74,20 C82,24 84,30 78,34 C74,38 70,44 72,50 C68,56 62,58 58,64 C54,70 50,74 48,80 C46,86 44,90 40,95 C38,88 40,82 38,76 C34,72 32,66 34,60 C28,56 26,50 28,44 C24,40 22,34 26,28 C22,22 24,16 30,12 C28,8 30,4 35,4 Z";

  function buildMap() {
    const svg = d3.select('#thailand-map');
    svg.attr('viewBox', '0 0 100 130');

    const defs = svg.append('defs');
    const glow = defs.append('filter').attr('id', 'mapGlow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glow.append('feGaussianBlur').attr('stdDeviation', '2.2').attr('result', 'blur');
    glow.append('feMerge').html('<feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/>');

    svg.append('path').attr('class', 'map-region').attr('d', SILHOUETTE).attr('filter', 'url(#mapGlow)');

    const g = svg.append('g');
    DC_DATA.mapHotspots.forEach(h => {
      const node = g.append('g').attr('class', 'map-hotspot').attr('data-id', h.id)
        .attr('transform', `translate(${h.x}, ${h.y * 1.3})`)
        .attr('tabindex', '0')
        .attr('role', 'button')
        .attr('aria-label', `${h.name} — ${h.strategy}. Show projects.`);
      node.append('circle').attr('class', 'pulse').attr('r', 3);
      node.append('circle').attr('class', 'core').attr('r', 3).attr('filter', 'url(#mapGlow)');
      node.append('text').attr('x', 6).attr('y', 2.5).text(h.name.split(' ')[0].toUpperCase());
      node.on('click', () => selectHotspot(h.id));
      node.on('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectHotspot(h.id); }
      });
    });
  }

  function buildCards() {
    const list = document.getElementById('mapCardList');
    if (!list) return;
    list.innerHTML = '';
    DC_DATA.mapHotspots.forEach(h => {
      const card = document.createElement('div');
      card.className = 'glass map-card';
      card.dataset.id = h.id;
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-label', `${h.name} — ${h.share}. Expand for project details.`);
      card.innerHTML = `
        <div class="map-card-head">
          <h4>${h.name}</h4>
          <span class="tag">${h.share}</span>
        </div>
        <div style="font-size:12.5px;color:var(--text-mid);">${h.strategy}</div>
        <div class="map-card-body">
          ${h.projects.map(p => `
            <div style="margin-bottom:14px;">
              <div style="font-size:13.5px;font-weight:650;color:var(--text-hi);margin-bottom:4px;">${p.name}</div>
              <div class="row"><span>Capacity</span><b>${p.capacity}</b></div>
              <div class="row"><span>Investment</span><b>${p.investment}</b></div>
              <div class="row"><span>Hyperscalers</span><b>${p.hyperscalers}</b></div>
              <div class="row"><span>Status</span><b>${p.status}</b></div>
            </div>
          `).join('')}
        </div>
      `;
      card.addEventListener('click', () => selectHotspot(h.id));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectHotspot(h.id); }
      });
      list.appendChild(card);
    });
  }

  function selectHotspot(id) {
    document.querySelectorAll('.map-hotspot').forEach(n => n.classList.toggle('selected', n.dataset.id === id));
    document.querySelectorAll('.map-hotspot').forEach(n => n.classList.add('active'));
    document.querySelectorAll('.map-card').forEach(c => {
      if (c.dataset.id === id) {
        c.classList.toggle('open');
      } else {
        c.classList.remove('open');
        c.setAttribute('aria-expanded', 'false');
      }
    });
    const card = document.querySelector(`.map-card[data-id="${id}"]`);
    if (card) {
      card.setAttribute('aria-expanded', String(card.classList.contains('open')));
      if (card.classList.contains('open')) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildMap();
    buildCards();
    // gentle idle pulse on all hotspots
    setTimeout(() => document.querySelectorAll('.map-hotspot').forEach(n => n.classList.add('active')), 400);
  });
})();
