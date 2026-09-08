(() => {
  const init = () => {
    const nav = document.querySelector('.site-nav');
    const links = nav?.querySelector('.site-links');
    if (!nav || !links || nav.querySelector('.menu-toggle')) return;

    links.id = links.id || 'site-menu';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'menu-toggle';
    button.setAttribute('aria-controls', links.id);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation menu');

    for (let index = 0; index < 3; index += 1) {
      button.append(document.createElement('span'));
    }

    nav.insertBefore(button, links);

    const close = () => {
      nav.classList.remove('menu-open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation menu');
    };

    const toggle = () => {
      const open = nav.classList.toggle('menu-open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    button.addEventListener('click', toggle);
    links.addEventListener('click', (event) => {
      if (event.target.closest('a')) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
    document.addEventListener('click', (event) => {
      if (nav.classList.contains('menu-open') && !nav.contains(event.target)) close();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) close();
    }, { passive: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
