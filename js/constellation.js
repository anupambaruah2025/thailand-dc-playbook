/* ==========================================================================
   HYPERSCALER ANCHOR PANES — face-on neon glass panes on a reflective floor.
   Full anchored roster: cloud majors (real logos, recolored for dark glass)
   + the site's other players from DC_DATA (brand-colored wordmark panes).
   ========================================================================== */
(function () {
  const L = window.DC_LOGOS || {};
  const awsWhite = (L.aws || '').replace(/#252f3e/gi, '#ffffff');
  const tiktokWhite = (L.bytedance || '').replace('<svg ', '<svg fill="#ffffff" ');

  const ORACLE = `<svg viewBox="0 0 230 40" xmlns="http://www.w3.org/2000/svg"><text x="0" y="31" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="34" letter-spacing="1.5" fill="#ff4438">ORACLE</text></svg>`;
  const HUAWEI = `<svg viewBox="0 0 230 40" xmlns="http://www.w3.org/2000/svg"><text x="0" y="30" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="30" letter-spacing="1.5" fill="#ff5a4d">HUAWEI</text></svg>`;
  const TENCENT = `<svg viewBox="0 0 72 48" xmlns="http://www.w3.org/2000/svg"><path fill="#4d9fff" d="M18,44 A11,11 0 0,1 18.5,22 A16,14 0 0,1 50,18 A10,10 0 0,1 53,44 Z"/><path fill="#7fbcff" d="M30,38 A8,8 0 0,1 30,24 A12,10 0 0,1 52,22 A8,8 0 0,1 54,38 Z" opacity="0.55"/></svg>`;

  // Cloud majors — real/brand marks, always shown first
  const MAJORS = [
    { logo: awsWhite,    name: '',                            full: 'Amazon Web Services',         accent: '#2b9dff' },
    { logo: L.google,    name: 'Google Cloud',                full: 'Google Cloud',                accent: '#22d3a0' },
    { logo: L.msft,      name: 'Microsoft Azure',             full: 'Microsoft Azure',             accent: '#4ade80' },
    { logo: ORACLE,      name: 'Oracle Cloud Infrastructure', full: 'Oracle Cloud Infrastructure', accent: '#f5d23e' },
    { logo: HUAWEI,      name: 'HUAWEI Cloud',                full: 'Huawei Cloud',                accent: '#ff8a3d' },
    { logo: TENCENT,     name: 'Tencent Cloud',               full: 'Tencent Cloud',               accent: '#3b8dff' },
    { logo: tiktokWhite, name: 'TikTok (BytePlus)',           full: 'TikTok / BytePlus',           accent: '#b96bff' }
  ];

  // Other anchored players — wordmark panes, styling + short descriptor from DC_DATA
  const OTHERS = [
    { word: 'Alibaba Cloud',    desc: 'China · 2nd Thai DC',        accent: '#ff6a00' },
    { word: 'Beijing Haoyang',  desc: '300 MW · Rayong',            accent: '#ff5d78' },
    { word: 'GDS / DigitalLand',desc: '~120 MW · Chonburi',         accent: '#22e2ee' },
    { word: 'NEXTDC',           desc: 'Colocation · ANZ',           accent: '#35e0a8' },
    { word: 'Equinix',          desc: 'Interconnection hub',        accent: '#ff4d4d' },
    { word: 'True IDC',         desc: '223 MW · CP Group',          accent: '#5eb3ff' },
    { word: 'STT GDC',          desc: 'Bangkok · liquid-cooled',    accent: '#a78bfa' },
    { word: 'GSA (Gulf·Singtel·AIS)', desc: '120 MW JV · Rayong',   accent: '#fbbf24' }
  ];

  function paneEl(i, accent, aria, inner) {
    const pane = document.createElement('div');
    pane.className = 'anchor-pane';
    pane.style.setProperty('--accent', accent);
    pane.style.setProperty('--i', i);
    pane.setAttribute('tabindex', '0');
    pane.setAttribute('role', 'listitem');
    pane.setAttribute('aria-label', aria);
    pane.innerHTML = inner;
    return pane;
  }

  function build() {
    const track = document.getElementById('logoTrack');
    if (!track) return;
    let i = 0;
    MAJORS.forEach(a => {
      track.appendChild(paneEl(i++, a.accent, a.full + ' — anchored in Thailand',
        `<div class="anchor-logo">${a.logo || ''}</div><div class="anchor-name">${a.name}</div>`));
    });
    OTHERS.forEach(a => {
      track.appendChild(paneEl(i++, a.accent, a.word + ' — ' + a.desc,
        `<div class="anchor-logo wordmark"><span style="color:${a.accent}">${a.word}</span></div><div class="anchor-name muted">${a.desc}</div>`));
    });
    track.setAttribute('role', 'list');
    track.setAttribute('aria-label', 'Cloud providers and operators anchored in Thailand');
  }

  document.addEventListener('DOMContentLoaded', build);
})();
