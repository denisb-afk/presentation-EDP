(() => {
  'use strict';

  const body = document.body;
  const pages = Array.from(document.querySelectorAll('.page'));
  const validPages = new Set(pages.map(p => p.dataset.page));
  const orbitDots = Array.from(document.querySelectorAll('.orbit-dot'));

  function normalizeRoute(hash) {
    const route = (hash || '').replace('#', '').trim();
    return validPages.has(route) ? route : 'home';
  }

  function showPage(route, { scroll = true } = {}) {
    pages.forEach(page => {
      const isTarget = page.dataset.page === route;
      page.classList.toggle('is-active', isTarget);
    });

    body.classList.toggle('on-detail', route !== 'home');

    orbitDots.forEach(dot => {
      dot.classList.toggle('is-active', dot.dataset.route === route);
    });

    document.title = route === 'home'
      ? 'EDP · Energia que conecta o futuro'
      : `EDP · ${document.querySelector(`#${route} .detail-title`)?.textContent || 'Tema'}`;

    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' in window.scrollTo ? 'instant' : 'auto' });
  }

  function navigateTo(route) {
    const target = normalizeRoute(route);
    if (window.location.hash.replace('#', '') === target) {
      showPage(target);
    } else {
      window.location.hash = target;
    }
  }

  // roteamento via hash (permite voltar/avançar no navegador)
  window.addEventListener('hashchange', () => showPage(normalizeRoute(window.location.hash)));

  // qualquer elemento com data-route navega ao ser clicado
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-route]');
    if (!trigger) return;
    e.preventDefault();
    navigateTo(trigger.dataset.route);
  });

  // nós do mapa mental (SVG inline) levam ao tema correspondente
  document.querySelectorAll('.map-node').forEach(node => {
    const n = node.getAttribute('data-node');
    node.addEventListener('click', () => navigateTo(`tema-${n}`));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateTo(`tema-${n}`);
      }
    });
  });

  // estado inicial
  showPage(normalizeRoute(window.location.hash), { scroll: false });
})();
