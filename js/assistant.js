/* ==========================================================================
   AI ASSISTANT — client-side keyword search over the report data
   (No external API — answers are synthesised only from DC_DATA)
   ========================================================================== */
(function () {
  let KB = [];

  function buildKB() {
    KB.push({ kw: ['summary', 'overview', 'tldr', 'gist', 'headline'], a: DC_DATA.meta.onePara });
    DC_DATA.kpis.forEach(k => {
      KB.push({ kw: [k.label.toLowerCase(), ...k.label.toLowerCase().split(' ')], a: `${k.label}: ${k.value} ${k.unit}. ${k.detail} (Source: ${k.source})` });
    });
    KB.push({ kw: ['power', 'grid', 'electricity', 'bottleneck', 'eec', 'transmission'], a: DC_DATA.powerFacts.bottleneck });
    KB.push({ kw: ['erc', 'letter', 'march', 'rule'], a: DC_DATA.powerFacts.ercRule });
    DC_DATA.powerFacts.mechanisms.forEach(m => {
      KB.push({ kw: [m.name.toLowerCase(), ...m.name.toLowerCase().split(' ')], a: `${m.name} — ${m.status}. Terms: ${m.terms}. Investor read: ${m.read}` });
    });
    KB.push({ kw: ['permit', 'permits', 'licence', 'license', 'lifecycle', 'timeline to build', 'how long'], a: `Permitting runs ~30–48 months from site control to first-rack revenue for a greenfield HV campus (18–24 months if the site inherits substation allocation), across 9 stages from site control to operating licences. The critical path is Stage 6 — power delivery & backup — at 18–36 months.` });
    DC_DATA.permits.forEach(p => {
      KB.push({ kw: [p.title.toLowerCase(), 'stage ' + p.stage], a: `Stage ${p.stage} — ${p.title}: ${p.instruments} (${p.duration}, via ${p.authority})` });
    });
    KB.push({ kw: ['hyperscaler', 'hyperscalers', 'aws', 'microsoft', 'bytedance', 'tiktok', 'who is active', 'investors'], a: `Key hyperscalers active in Thailand: ${DC_DATA.hyperscalers.map(h => h.name).join(', ')}. AWS's region has been live since Jan 2025; a second US hyperscaler's region went live Jan 2026. ByteDance/TikTok is the largest Chinese-linked wholesale absorber.` });
    DC_DATA.hyperscalers.forEach(h => {
      KB.push({ kw: [h.name.toLowerCase()], a: `${h.name} (${h.country}): ${h.commitment}. Location: ${h.location}. Status: ${h.status}. ${h.note}` });
    });
    KB.push({ kw: ['risk', 'risks', 'biggest risk', 'top risk'], a: `Top risk: EEC transmission delay stalls energisation (High likelihood/High severity). Mitigation: site in second-ring provinces, contract energisation milestones, phase IT load to grid delivery.` });
    DC_DATA.risks.forEach(r => {
      KB.push({ kw: [r.name.toLowerCase()], a: `${r.name} (${r.category}, L${r.likelihood}/S${r.severity}). Mitigation: ${r.mitigation}. Monitor: ${r.monitor}` });
    });
    DC_DATA.strategies.forEach(s => {
      KB.push({ kw: [s.label.toLowerCase(), ...s.label.toLowerCase().split(' ')], a: `${s.label} — ${s.play} Critical success factors: ${s.csf.join('; ')}.` });
    });
    KB.push({ kw: ['calendar', 'dates', 'what happens next', 'upcoming'], a: DC_DATA.calendar.map(c => `${c.when}: ${c.what}`).join(' | ') });
    KB.push({ kw: ['capex', 'cost per mw', 'unit economics'], a: `Capex benchmark is USD 7–8m per MW — below Singapore, Malaysia and Indonesia (Arizton 2025).` });
    KB.push({ kw: ['revenue', 'market size', 'forecast'], a: `Revenue trajectory: USD ~2bn (2025/26) → USD 4.3–6.3bn (2030/31), a 17–28% CAGR range depending on the analyst house.` });
    KB.push({ kw: ['contractor', 'contractors', 'builder', 'construction firms'], a: `~2,066 MW of approved 2025 capacity is chasing a DC-credible bench of perhaps 8–12 shell-and-core builders. Top DC-specialised names: Thai Kajima, Thai Obayashi, Syntec, PPS Group.` });
  }

  function tokenize(s) { return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean); }

  function answer(query) {
    const tokens = tokenize(query);
    let best = null, bestScore = 0;
    KB.forEach(entry => {
      let score = 0;
      entry.kw.forEach(k => {
        if (query.toLowerCase().includes(k)) score += k.length; // longer phrase match = stronger
        tokens.forEach(t => { if (k.includes(t) && t.length > 2) score += 1; });
      });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    if (best && bestScore > 0) return best.a;
    return `I can only answer from the July 2026 playbook data. Try asking about power/grid, permits, hyperscalers, risk, capex, revenue, or a strategy profile.`;
  }

  function addMsg(text, cls) {
    const wrap = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = 'ai-msg ' + cls;
    div.textContent = text;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function initChips() {
    const chips = ['What is the power bottleneck?', 'How long does permitting take?', 'Which hyperscalers are active?', 'What is the biggest risk?', 'Give me the summary'];
    const wrap = document.getElementById('aiSuggestions');
    chips.forEach(c => {
      const b = document.createElement('button');
      b.className = 'ai-chip';
      b.textContent = c;
      b.addEventListener('click', () => handleQuery(c));
      wrap.appendChild(b);
    });
  }

  function handleQuery(q) {
    if (!q.trim()) return;
    addMsg(q, 'user');
    document.getElementById('aiInput').value = '';
    setTimeout(() => addMsg(answer(q), 'bot'), 300);
  }

  function initPanel() {
    const fab = document.getElementById('aiFab');
    const panel = document.getElementById('aiPanel');
    const close = document.getElementById('aiClose');
    const input = document.getElementById('aiInput');
    const send = document.getElementById('aiSend');

    fab.addEventListener('click', () => panel.classList.toggle('open'));
    close.addEventListener('click', () => panel.classList.remove('open'));
    send.addEventListener('click', () => handleQuery(input.value));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleQuery(input.value); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildKB();
    initChips();
    initPanel();
    addMsg("Ask me anything from the Thailand DC Market 2026 playbook — power, permits, hyperscalers, risk or strategy.", 'bot');
  });
})();
