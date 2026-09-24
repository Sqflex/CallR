/**
 * CallR landing page. Framework-free, progressive enhancement.
 * No microphone access, call uploads, analytics or external API requests.
 */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');

  // Real contact actions. Copy is optional; the phone link always works.
  let toastTimer;
  const toast = document.querySelector('.toast');
  function announce(message) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
  }
  const copyPhone = document.querySelector('.copy-phone');
  copyPhone?.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText('+375 44 738 7513');
      announce(copyPhone.dataset.success);
    } catch {
      // Explicit fallback instead of claiming that copying succeeded.
      announce(copyPhone.dataset.failure);
    }
  });

  // Accessible mobile menu: escape, focus containment and breakpoint reset.
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const mobile = window.matchMedia('(max-width: 760px)');
  function setMenu(open, restoreFocus = false) {
    if (!menu || !menuButton) return;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? menuButton.dataset.closeLabel : menuButton.dataset.openLabel);
    document.body.classList.toggle('menu-open', open);
    if (open) menu.querySelector('a')?.focus();
    else if (restoreFocus) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (!menu || menu.hidden || !menuButton) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false, true);
    } else if (event.key === 'Tab') {
      const items = [menuButton, ...menu.querySelectorAll('a[href]')];
      const current = items.indexOf(document.activeElement);
      if (event.shiftKey && current <= 0) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && current === items.length - 1) {
        event.preventDefault();
        menuButton.focus();
      }
    }
  });
  mobile.addEventListener('change', event => { if (!event.matches) setMenu(false); });

  // Use-case tabs: mouse, touch, arrows, Home/End, and previous/next controls.
  const tabsContainer = document.querySelector('[data-scenario-tabs]');
  const tabs = [...document.querySelectorAll('[data-scenario]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const counter = document.querySelector('.scenario-count');
  let currentScenario = 0;
  function selectScenario(next, focus = false) {
    if (!tabs.length) return;
    currentScenario = (next + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const active = i === currentScenario;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = panels.find(item => item.dataset.panel === tab.dataset.scenario);
      if (panel) {
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      }
    });
    if (counter) {
      counter.replaceChildren(document.createTextNode(`${String(currentScenario + 1).padStart(2, '0')} `));
      const total = document.createElement('span');
      total.textContent = `/ ${String(tabs.length).padStart(2, '0')}`;
      counter.append(total);
    }
    if (focus) tabs[currentScenario].focus({ preventScroll: true });
  }
  if (tabsContainer && tabs.length) {
    tabsContainer.setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `scenario-${tab.dataset.scenario}`);
      tab.addEventListener('click', () => selectScenario(index));
      tab.addEventListener('keydown', event => {
        const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1);
        selectScenario(next, true);
      });
    });
    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${panel.dataset.panel}`);
      panel.tabIndex = 0;
    });
    document.querySelector('[data-prev]')?.addEventListener('click', () => selectScenario(currentScenario - 1));
    document.querySelector('[data-next]')?.addEventListener('click', () => selectScenario(currentScenario + 1));
    selectScenario(0);
  }

  // Keep the navigation lightweight while scrolling.
  const header = document.querySelector('.site-header');
  let scrolling = false;
  function updateHeader() {
    header?.classList.toggle('is-scrolled', window.scrollY > 20);
    scrolling = false;
  }
  window.addEventListener('scroll', () => {
    if (scrolling) return;
    scrolling = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });
  updateHeader();

  // Reveal on entry, respecting the operating system's reduced-motion setting.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
    revealItems.forEach(item => observer.observe(item));
    root.classList.add('motion-ready');
    const hero = document.querySelector('.hero-visual');
    if (hero) {
      const heroObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => hero.classList.toggle('is-paused', !entry.isIntersecting));
      });
      heroObserver.observe(hero);
    }
    reduced.addEventListener('change', event => {
      if (event.matches) {
        root.classList.remove('motion-ready');
        observer.disconnect();
      }
    });
  }
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('tab-inactive', document.hidden);
  });
  document.querySelectorAll('[data-year]').forEach(item => { item.textContent = String(new Date().getFullYear()); });
})();
