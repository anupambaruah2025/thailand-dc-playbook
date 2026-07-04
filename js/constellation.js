/* ==========================================================================
   HYPERSCALER ANCHOR PANES — face-on neon glass panes on a reflective floor.
   Curated cloud-provider showcase (per the "Who's already anchored" design).
   Real marks for AWS / Google Cloud / Azure / TikTok (recolored for dark
   glass); brand-colored wordmark/icon marks for Oracle / Huawei / Tencent.
   ========================================================================== */
(function () {
  const L = window.DC_LOGOS || {};
  // AWS wordmark is dark navy by default — recolor to white for the dark pane.
  const awsWhite = (L.aws || '').replace(/#252f3e/gi, '#ffffff');
  // TikTok note is black by default — force white via root fill (keeps red/cyan classes).
  const tiktokWhite = (L.bytedance || '').replace('<svg ', '<svg fill="#ffffff" ');

  const ORACLE = `<svg viewBox="0 0 230 40" xmlns="http://www.w3.org/2000/svg"><text x="0" y="31" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="34" letter-spacing="1.5" fill="#ff4438">ORACLE</text></svg>`;
  const HUAWEI = `<svg viewBox="0 0 230 40" xmlns="http://www.w3.org/2000/svg"><text x="0" y="30" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="30" letter-spacing="1.5" fill="#ff5a4d">HUAWEI</text></svg>`;
  const TENCENT = `<svg viewBox="0 0 72 48" xmlns="http://www.w3.org/2000/svg"><path fill="#4d9fff" d="M18,44 A11,11 0 0,1 18.5,22 A16,14 0 0,1 50,18 A10,10 0 0,1 53,44 Z"/><path fill="#7fbcff" d="M30,38 A8,8 0 0,1 30,24 A12,10 0 0,1 52,22 A8,8 0 0,1 54,38 Z" opacity="0.55"/></svg>`;

  // accent = neon rim color per brand, echoing the reference spectrum
  const ANCHORED = [
    { key: 'aws',     logo: awsWhite,    name: '',                              full: 'Amazon Web Services',          accent: '#2b9dff' },
    { key: 'google',  logo: L.google,    name: 'Google Cloud',                  full: 'Google Cloud',                 accent: '#22d3a0' },
    { key: 'azure',   logo: L.msft,      name: 'Microsoft Azure',               full: 'Microsoft Azure',              accent: '#4ade80' },
    { key: 'oracle',  logo: ORACLE,      name: 'Oracle Cloud Infrastructure',   full: 'Oracle Cloud Infrastructure',  accent: '#f5d23e' },
    { key: 'huawei',  logo: HUAWEI,      name: 'HUAWEI Cloud',                  full: 'Huawei Cloud',                 accent: '#ff8a3d' },
    { key: 'tencent', logo: TENCENT,     name: 'Tencent Cloud',                 full: 'Tencent Cloud',                accent: '#3b8dff' },
    { key: 'tiktok',  logo: tiktokWhite, name: 'TikTok (BytePlus)',             full: 'TikTok / BytePlus',            accent: '#b96bff' }
  ];

  function build() {
    const track = document.getElementById('logoTrack');
    if (!track) return;
    ANCHORED.forEach((a, i) => {
      const pane = document.createElement('div');
      pane.className = 'anchor-pane';
      pane.style.setProperty('--accent', a.accent);
      pane.style.setProperty('--i', i);
      pane.setAttribute('tabindex', '0');
      pane.setAttribute('role', 'listitem');
      pane.setAttribute('aria-label', a.full + ' — anchored in Thailand');
      pane.innerHTML = `
        <div class="anchor-logo">${a.logo || ''}</div>
        <div class="anchor-name">${a.name}</div>
      `;
      track.appendChild(pane);
    });
    track.setAttribute('role', 'list');
    track.setAttribute('aria-label', 'Cloud providers anchored in Thailand');
  }

  document.addEventListener('DOMContentLoaded', build);
})();
