/* ==========================================================================
   RISK HEAT-MAP — animated scatter with category filters
   ========================================================================== */
(function () {
  const CAT_COLOR = { Power: '#ff5d78', Regulatory: '#ffb454', Financial: '#5eb3ff', Construction: '#35e0a8', Political: '#c084fc' };
  let activeFilter = 'All';

  function buildFilters() {
    const wrap = document.getElementById('riskFilters');
    if (!wrap) return;
    const cats = ['All', ...new Set(DC_DATA.risks.map(r => r.category))];
    cats.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'risk-filter' + (c === 'All' ? ' active' : '');
      btn.textContent = c;
      btn.addEventListener('click', () => {
        activeFilter = c;
        document.querySelectorAll('.risk-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter();
      });
      wrap.appendChild(btn);
    });
  }

  function applyFilter() {
    d3.selectAll('.risk-dot').classed('dim', d => activeFilter !== 'All' && d.category !== activeFilter);
  }

  function draw() {
    const svgEl = d3.select('#risk-scatter');
    const rect = document.getElementById('risk-scatter').getBoundingClientRect();
    const w = Math.max(rect.width, 320), h = 460;
    svgEl.attr('viewBox', `0 0 ${w} ${h}`);
    const margin = { top: 24, right: 30, bottom: 50, left: 54 };
    const W = w - margin.left - margin.right, H = h - margin.top - margin.bottom;
    const g = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([1, 5]).range([0, W]);
    const y = d3.scaleLinear().domain([1, 5]).range([H, 0]);

    // quadrant shading
    g.append('rect').attr('x', x(3)).attr('y', 0).attr('width', W - x(3)).attr('height', y(3))
      .attr('fill', 'rgba(255,93,120,0.06)');

    [1, 2, 3, 4, 5].forEach(v => {
      g.append('line').attr('class', 'grid-line').attr('x1', x(v)).attr('x2', x(v)).attr('y1', 0).attr('y2', H);
      g.append('line').attr('class', 'grid-line').attr('x1', 0).attr('x2', W).attr('y1', y(v)).attr('y2', y(v));
    });

    g.append('g').attr('class', 'axis').attr('transform', `translate(0,${H})`).call(d3.axisBottom(x).ticks(5).tickSize(0)).call(s => s.select('.domain').remove());
    g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(5).tickSize(0)).call(s => s.select('.domain').remove());

    svgEl.append('text').attr('class', 'risk-axis-label').attr('x', margin.left + W / 2).attr('y', h - 6).attr('text-anchor', 'middle').text('LIKELIHOOD →');
    svgEl.append('text').attr('class', 'risk-axis-label').attr('transform', `translate(16, ${margin.top + H / 2}) rotate(-90)`).attr('text-anchor', 'middle').text('SEVERITY →');

    const tooltip = document.getElementById('riskTooltip');
    const jitter = () => (Math.random() - 0.5) * 0.35;

    const dots = g.selectAll('.risk-dot').data(DC_DATA.risks).enter().append('circle')
      .attr('class', 'risk-dot')
      .attr('cx', d => x(d.likelihood + jitter()))
      .attr('cy', d => y(d.severity + jitter()))
      .attr('r', 0)
      .attr('fill', d => CAT_COLOR[d.category] || '#5eb3ff')
      .attr('fill-opacity', 0.85)
      .attr('stroke', '#04070f')
      .attr('stroke-width', 1.5)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', d => `${d.name}, likelihood ${d.likelihood} of 5, severity ${d.severity} of 5, category ${d.category}. Mitigation: ${d.mitigation}`)
      .style('cursor', 'pointer');

    dots.transition().delay((d, i) => i * 60).duration(600).ease(d3.easeBackOut).attr('r', d => 7 + d.severity * 1.4);

    function showTip(event, d) {
      const [mx, my] = event.type.startsWith('mouse') || event.type === 'pointermove'
        ? d3.pointer(event, svgEl.node())
        : [x(d.likelihood), y(d.severity)];
      tooltip.innerHTML = `<h5 style="color:${CAT_COLOR[d.category]}">${d.name}</h5>
        <p><b style="color:var(--text-hi)">Likelihood/Severity:</b> ${d.likelihood}/${d.severity} · ${d.category}</p>
        <div class="mit"><b>Mitigation:</b> ${d.mitigation}</div>`;
      tooltip.style.left = mx + margin.left + 'px';
      tooltip.style.top = my + margin.top + 'px';
      tooltip.classList.add('show');
    }
    function hideTip() { tooltip.classList.remove('show'); }

    dots.on('mousemove', showTip).on('mouseleave', hideTip)
      .on('focus', function (event, d) { showTip(event, d); })
      .on('blur', hideTip);
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildFilters();
    draw();
    window.addEventListener('resize', () => { d3.select('#risk-scatter').selectAll('*').remove(); draw(); applyFilter(); });
  });
})();
