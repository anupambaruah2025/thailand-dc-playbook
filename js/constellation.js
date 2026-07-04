/* ==========================================================================
   HYPERSCALER GLASS DECK — fanned, edge-on translucent panes (logos hidden
   in the stack); pointing/focusing a pane pops it face-on and reveals the
   brand mark with a spring. Replaces the auto-scroll marquee (no rAF loop).
   Real marks: AWS, Microsoft, Google, ByteDance; wordmark panes for the rest.
   ========================================================================== */
(function () {
  // Praxis brand-family tints (teal / green / yellow / blue), cycled per pane
  const TINTS = [
    '46,199,230',   // teal  #2EC7E6
    '0,196,140',    // green #00C48C
    '247,229,90',   // yellow #F7E55A
    '59,141,255'    // blue  #3b8dff
  ];

  function buildCard(h, i) {
    const logo = window.DC_LOGOS && window.DC_LOGOS[h.id];
    const card = document.createElement('div');
    card.className = 'logo-card';
    card.style.setProperty('--tint', TINTS[i % TINTS.length]);
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${h.name} (${h.country}): ${h.commitment}. ${h.status}.`);
    card.innerHTML = `
      <div class="logo-face">
        ${logo
          ? `<div class="logo-glyph">${logo}</div>`
          : `<div class="logo-glyph wordmark"><span>${h.name}</span></div>`}
      </div>
    `;
    return card;
  }

  function build() {
    const track = document.getElementById('logoTrack');
    if (!track) return;
    DC_DATA.hyperscalers.forEach((h, i) => track.appendChild(buildCard(h, i)));
  }

  document.addEventListener('DOMContentLoaded', build);
})();
