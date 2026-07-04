/* ==========================================================================
   FULL REPORT — single gated report card, contact-to-unlock
   ========================================================================== */
(function () {
  const LOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>`;

  function build() {
    const wrap = document.getElementById('downloadLocked');
    if (!wrap) return;
    wrap.innerHTML = `
      <div class="glass locked-report reveal">
        <div class="locked-badge">${LOCK_ICON}</div>
        <div class="locked-tag">LOCKED</div>
        <h4>Thailand DC Report 2026</h4>
        <p>The complete investment &amp; delivery playbook — market sizing, hyperscaler inventory, power reality, permit lifecycle, risk and strategy in one document.</p>
        <div class="locked-report-ctas">
          <button type="button" class="btn btn-primary magnetic js-open-enquiry" data-enquiry-type="Full Report Access">Contact for Full Report</button>
        </div>
      </div>
    `;
  }
  document.addEventListener('DOMContentLoaded', build);
})();
