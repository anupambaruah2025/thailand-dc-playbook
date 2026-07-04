/* ==========================================================================
   ENQUIRY MODAL — real EmailJS endpoint with full submit UX
   (contact address is never rendered as visible page text)
   - Inline validation on blur, error message beside the field
   - Loading → success / error states with aria-live announcements
   - Focus moves to first invalid field on failed submit
   - mailto: fallback if EmailJS is unreachable
   ========================================================================== */
(function () {
  const CONTACT_EMAIL = "anupambaruah@yahoo.com";
  const EMAILJS_SERVICE = "service_3wwexsf";
  const EMAILJS_TEMPLATE = "template_sd8vhsl";
  const EMAILJS_PUBLIC = "oJ4fDgpUTNOVofo08";

  let lastFocused = null;

  function openModal(prefillType) {
    const overlay = document.getElementById('enquiryOverlay');
    if (!overlay) return;
    lastFocused = document.activeElement;
    if (prefillType) {
      const sel = document.getElementById('enqType');
      if (sel && [...sel.options].some(o => o.value === prefillType)) sel.value = prefillType;
    }
    overlay.classList.add('open');
    resetFormState();
    document.getElementById('enqEmail')?.focus();
  }

  function closeModal() {
    document.getElementById('enquiryOverlay')?.classList.remove('open');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* ---- inline validation ---- */
  function setFieldError(input, msg) {
    const label = input.closest('label');
    if (!label) return;
    let err = label.querySelector('.field-error');
    if (msg) {
      if (!err) {
        err = document.createElement('span');
        err.className = 'field-error';
        err.setAttribute('role', 'alert');
        label.appendChild(err);
      }
      err.textContent = msg;
      input.setAttribute('aria-invalid', 'true');
    } else {
      if (err) err.remove();
      input.removeAttribute('aria-invalid');
    }
  }

  function validateEmail(input) {
    const v = input.value.trim();
    if (!v) { setFieldError(input, 'Email is required.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setFieldError(input, 'Enter a valid email, e.g. you@company.com.'); return false; }
    setFieldError(input, null); return true;
  }

  function validateType(select) {
    if (!select.value) { setFieldError(select, 'Select an enquiry type.'); return false; }
    setFieldError(select, null); return true;
  }

  function resetFormState() {
    const form = document.getElementById('enquiryForm');
    if (!form) return;
    form.querySelectorAll('.field-error').forEach(e => e.remove());
    form.querySelectorAll('[aria-invalid]').forEach(i => i.removeAttribute('aria-invalid'));
    setSubmitState('idle');
    const status = document.getElementById('enquiryStatus');
    if (status) { status.textContent = ''; status.className = 'enquiry-status'; }
  }

  /* ---- submit states ---- */
  function setSubmitState(state) {
    const btn = document.getElementById('enquirySubmit');
    if (!btn) return;
    btn.disabled = state === 'loading';
    btn.classList.toggle('is-loading', state === 'loading');
    btn.innerHTML = state === 'loading'
      ? `<span class="spinner" aria-hidden="true"></span> Sending…`
      : `Send Enquiry`;
  }

  function showStatus(kind, msg) {
    const status = document.getElementById('enquiryStatus');
    if (!status) return;
    status.textContent = msg;
    status.className = 'enquiry-status show ' + kind;
  }

  async function sendViaEmailJS(payload) {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE,
        template_id: EMAILJS_TEMPLATE,
        user_id: EMAILJS_PUBLIC,
        template_params: payload
      })
    });
    if (!res.ok) throw new Error('EmailJS ' + res.status);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('enqEmail');
    const typeSelect = document.getElementById('enqType');
    const phone = document.getElementById('enqPhone').value.trim();
    const message = document.getElementById('enqMessage').value.trim();

    const emailOk = validateEmail(emailInput);
    const typeOk = validateType(typeSelect);
    if (!emailOk || !typeOk) {
      (emailOk ? typeSelect : emailInput).focus();
      return;
    }

    const payload = {
      to_email: CONTACT_EMAIL,
      subject: `Thailand DC Market 2026 — ${typeSelect.value}`,
      from_email: emailInput.value.trim(),
      phone: phone || 'Not provided',
      enquiry_type: typeSelect.value,
      message: message || '—'
    };

    setSubmitState('loading');
    try {
      await sendViaEmailJS(payload);
      setSubmitState('idle');
      showStatus('success', '✓ Enquiry sent — we\'ll reply to your email shortly.');
      e.target.reset();
      setTimeout(closeModal, 2200);
    } catch (err) {
      setSubmitState('idle');
      showStatus('error', 'Couldn\'t send just now — opening your email app instead…');
      const body = `Enquiry type: ${payload.enquiry_type}\nEmail: ${payload.from_email}\nPhone: ${payload.phone}\n\nMessage:\n${payload.message}`;
      setTimeout(() => {
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
      }, 1200);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('enquiryOverlay');
    const form = document.getElementById('enquiryForm');
    if (!overlay || !form) return;

    document.querySelectorAll('.js-open-enquiry').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.enquiryType));
    });
    document.getElementById('enquiryClose').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

    // validate on blur, not on keystroke
    document.getElementById('enqEmail').addEventListener('blur', e => { if (e.target.value) validateEmail(e.target); });
    document.getElementById('enqType').addEventListener('change', e => validateType(e.target));

    form.addEventListener('submit', handleSubmit);
  });
})();
