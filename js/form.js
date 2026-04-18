/* ═══════════════════════════════════════════════
   ESCUDERÍA ATERURA — form.js
   Validación y envío del formulario de contacto
   ─────────────────────────────────────────────
   Para producción: reemplaza el fetch() simulado
   con tu endpoint real (Formspree, Netlify Forms,
   backend propio, etc.)
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMsg   = document.getElementById('formMessage');

  if (!form) return;

  /* ── Regex de validación ── */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ── Muestra mensaje de estado ── */
  function showMessage(text, isOk) {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.style.display  = 'block';
    formMsg.style.background = isOk
      ? 'rgba(99, 185, 17, 0.10)'
      : 'rgba(217, 35, 26, 0.10)';
    formMsg.style.color  = isOk ? '#63b911' : 'var(--red)';
    formMsg.style.border = isOk
      ? '1px solid rgba(99, 185, 17, 0.30)'
      : '1px solid rgba(217, 35, 26, 0.30)';

    clearTimeout(showMessage._timer);
    showMessage._timer = setTimeout(() => {
      formMsg.style.display = 'none';
    }, 5000);
  }

  /* ── Marca campo con error ── */
  function setFieldError(input, hasError) {
    input.style.borderColor = hasError
      ? 'var(--red)'
      : 'rgba(255,255,255,0.08)';
  }

  /* ── Botón: texto de carga ── */
  const ORIGINAL_BTN_HTML = submitBtn ? submitBtn.innerHTML : '';

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
      ? 'Enviando…'
      : ORIGINAL_BTN_HTML;
  }

  /* ── Submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre  = form.nombre?.value.trim()  ?? '';
    const email   = form.email?.value.trim()   ?? '';
    const asunto  = form.asunto?.value         ?? '';
    const mensaje = form.mensaje?.value.trim() ?? '';

    /* Validaciones */
    let hasError = false;

    if (!nombre) {
      setFieldError(form.nombre, true);
      hasError = true;
    } else {
      setFieldError(form.nombre, false);
    }

    if (!EMAIL_RE.test(email)) {
      setFieldError(form.email, true);
      hasError = true;
    } else {
      setFieldError(form.email, false);
    }

    if (!asunto) {
      setFieldError(form.asunto, true);
      hasError = true;
    } else {
      setFieldError(form.asunto, false);
    }

    if (!mensaje) {
      setFieldError(form.mensaje, true);
      hasError = true;
    } else {
      setFieldError(form.mensaje, false);
    }

    if (hasError) {
      showMessage('Por favor, completa todos los campos obligatorios.', false);
      return;
    }

    setLoading(true);

    try {
      /* ─────────────────────────────────────────
         INTEGRACIÓN DE ENVÍO
         ─────────────────────────────────────────
         Opción A — Formspree (recomendado para estático):
           const res = await fetch('https://formspree.io/f/TU_ID', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ nombre, email, asunto, mensaje })
           });
           if (!res.ok) throw new Error('Error de red');

         Opción B — Netlify Forms:
           Añade atributo data-netlify="true" al <form>
           y Netlify lo gestiona automáticamente.

         Opción C — Backend propio:
           const res = await fetch('/api/contact', { ... });
         ───────────────────────────────────────── */

      /* SIMULACIÓN (borrar en producción) */
      await new Promise(r => setTimeout(r, 1400));

      showMessage(
        '¡Mensaje enviado! Te responderemos en menos de 48 horas.',
        true
      );
      form.reset();

    } catch (err) {
      console.error('[form.js] Error al enviar:', err);
      showMessage(
        'Ocurrió un error al enviar. Por favor, inténtalo de nuevo.',
        false
      );
    } finally {
      setLoading(false);
    }
  });

  /* Limpia borde de error al corregir el campo */
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => setFieldError(input, false));
    input.addEventListener('change', () => setFieldError(input, false));
  });

})();
