/* Dyeverse homepage interactions (nav, FAQ dialogs, dark mode) */

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setYear() {
    const y = $('#cs-year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  // -----------------------------
  // Mobile navigation
  // -----------------------------
  function initNav() {
    const body = document.body;
    const nav = $('#cs-navigation');
    const toggle = $('.cs-toggle');
    if (!nav || !toggle) return;

    const ulWrapper = $('.cs-ul-wrapper', nav);
    const links = $$('.cs-li-link', nav);

    function closeMenu() {
      body.classList.remove('cs-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
      const isOpen = body.classList.toggle('cs-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    links.forEach((a) => a.addEventListener('click', closeMenu));

    // Close on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (!body.classList.contains('cs-open')) return;
      if (nav.contains(e.target)) return;
      closeMenu();
    });

    // Prevent accidental scroll bleed when menu is open
    if (ulWrapper) {
      ulWrapper.addEventListener('touchmove', (e) => {
        if (body.classList.contains('cs-open')) e.stopPropagation();
      }, { passive: true });
    }
  }

  // -----------------------------
  // FAQ dialogs (accessible)
  // -----------------------------
  function initFaqDialogs() {
    const triggers = $$('.dv-faq-card[data-dialog]');
    if (!triggers.length) return;

    function openDialog(dialog) {
      if (!dialog) return;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }

    function closeDialog(dialog) {
      if (!dialog) return;
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }

    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-dialog');
        const dialog = id ? document.getElementById(id) : null;
        openDialog(dialog);
      });
    });

    $$('.dv-dialog').forEach((dialog) => {
      // close button
      const closeBtn = $('[data-close], .dv-dialog-close', dialog);
      if (closeBtn) closeBtn.addEventListener('click', () => closeDialog(dialog));

      // click on the backdrop closes
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeDialog(dialog);
      });
    });
  }

  // -----------------------------
  // Dark mode toggle (top-right)
  // -----------------------------
  function initDarkMode() {
    const toggle = $('#dv-theme-toggle');
    if (!toggle) return;

    const root = document.documentElement;
    const storageKey = 'dv-theme';

    function applyTheme(mode) {
      const isDark = mode === 'dark';
      root.classList.toggle('theme-dark', isDark);
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      // Let the browser render form controls appropriately
      root.style.colorScheme = isDark ? 'dark' : 'light';
    }

    function getPreferredTheme() {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'dark' || saved === 'light') return saved;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    // Initial
    applyTheme(getPreferredTheme());

    toggle.addEventListener('click', () => {
      const isDark = root.classList.contains('theme-dark');
      const next = isDark ? 'light' : 'dark';
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });

    // If user hasn't chosen, respond to OS changes
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener?.('change', () => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return;
        applyTheme(getPreferredTheme());
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    initNav();
    initFaqDialogs();
    initDarkMode();
  });
})();
