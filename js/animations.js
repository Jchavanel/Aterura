/* ═══════════════════════════════════════════════
   ESCUDERÍA ATERURA — animations.js
   Scroll reveal con IntersectionObserver
   Sin dependencias externas
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Respeta preferencias de accesibilidad del sistema */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    /* Si el usuario prefiere sin movimiento, muestra todo de golpe */
    document.querySelectorAll('.reveal, .reveal-fade').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  /* IntersectionObserver — activa la clase 'visible' cuando
     el elemento entra en viewport */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); /* Solo una vez */
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-fade').forEach(el => {
    observer.observe(el);
  });

})();
