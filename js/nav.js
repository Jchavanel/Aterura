/* ═══════════════════════════════════════════════
   ESCUDERÍA ATERURA — nav.js
   Barra de navegación: scroll shrink, dropdowns
   desktop y menú móvil con acordeón
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════
     NAV SHRINK AL HACER SCROLL
  ════════════════════════════ */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ════════════════════════════
     DROPDOWNS DESKTOP
  ════════════════════════════ */
  const navItems = Array.from(document.querySelectorAll('.nav-item'));

  /** Cierra todos los dropdowns, opcionalmente excepto uno */
  function closeAllDropdowns(except) {
    navItems.forEach(item => {
      if (item === except) return;
      const btn = item.querySelector('button[data-dropdown]');
      if (!btn) return;
      item.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  navItems.forEach(item => {
    const btn = item.querySelector('button[data-dropdown]');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      closeAllDropdowns(null);

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Cerrar al hacer clic fuera del nav */
  document.addEventListener('click', () => closeAllDropdowns(null));

  /* Cerrar con Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns(null);
  });

  /* Cerrar al navegar a un ancla */
  document.querySelectorAll('.nav-dropdown a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => closeAllDropdowns(null));
  });

  /* ════════════════════════════
     MENÚ MÓVIL
  ════════════════════════════ */
  const hamburger     = document.getElementById('hamburger');
  const mobileMenu    = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (!hamburger || !mobileMenu) return;

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    /* Cierra también los sub-acordeones */
    document.querySelectorAll('.mob-sub').forEach(s => s.classList.remove('open'));
    document.querySelectorAll('.mob-group-btn').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });
  }

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  /* Acordeón de grupos en el menú móvil */
  document.querySelectorAll('.mob-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-mob-group');
      const sub = document.getElementById(targetId);
      if (!sub) return;

      const isOpen = sub.classList.contains('open');

      /* Cierra todos */
      document.querySelectorAll('.mob-sub').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.mob-group-btn').forEach(b => {
        b.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
      });

      /* Abre el seleccionado si estaba cerrado */
      if (!isOpen) {
        sub.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Cerrar menú al hacer clic en cualquier enlace */
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

})();
